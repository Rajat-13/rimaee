"""
Inventory Views - Stock & Logistics
MVVM: View Layer
"""
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum, F, Count, Avg
from django.utils import timezone
from .models import (
    Inventory, InventoryMovement, Supplier,
    PurchaseOrder, PurchaseOrderItem, Shipment, Carrier
)
from .serializers import (
    InventorySerializer, InventoryMovementSerializer, SupplierSerializer,
    PurchaseOrderSerializer, PurchaseOrderItemSerializer,
    ShipmentSerializer, ShipmentCreateSerializer, CarrierSerializer
)
from apps.accounts.views import IsAdmin


# ============ INVENTORY ============

class InventoryListView(generics.ListAPIView):
    """List all inventory with stock levels."""
    serializer_class = InventorySerializer
    permission_classes = [IsAdmin]
    filterset_fields = ['needs_reorder']
    search_fields = ['product__name', 'product__sku', 'variant__sku']
    
    def get_queryset(self):
        return Inventory.objects.select_related('product', 'variant')


class InventoryDetailView(generics.RetrieveUpdateAPIView):
    """Get/update inventory item."""
    serializer_class = InventorySerializer
    permission_classes = [IsAdmin]
    queryset = Inventory.objects.all()


class InventoryAdjustView(APIView):
    """Adjust inventory stock."""
    permission_classes = [IsAdmin]
    
    def post(self, request, pk):
        try:
            inventory = Inventory.objects.get(pk=pk)
        except Inventory.DoesNotExist:
            return Response({'error': 'Inventory not found'}, status=404)
        
        adjustment = request.data.get('adjustment', 0)
        movement_type = request.data.get('type', 'adjustment')
        notes = request.data.get('notes', '')
        
        previous = inventory.quantity
        inventory.quantity += adjustment
        inventory.save()
        
        InventoryMovement.objects.create(
            inventory=inventory,
            movement_type=movement_type,
            quantity=adjustment,
            previous_quantity=previous,
            new_quantity=inventory.quantity,
            notes=notes,
            created_by=request.user
        )
        
        if movement_type == 'in':
            inventory.last_restocked = timezone.now()
            inventory.save()
        
        return Response(InventorySerializer(inventory).data)


class InventoryMovementListView(generics.ListAPIView):
    """List inventory movements."""
    serializer_class = InventoryMovementSerializer
    permission_classes = [IsAdmin]
    
    def get_queryset(self):
        inventory_id = self.kwargs.get('inventory_id')
        if inventory_id:
            return InventoryMovement.objects.filter(inventory_id=inventory_id)
        return InventoryMovement.objects.all()


class LowStockAlertView(APIView):
    """Get items that need reordering."""
    permission_classes = [IsAdmin]
    
    def get(self, request):
        low_stock = Inventory.objects.filter(
            quantity__lte=F('reorder_level')
        ).select_related('product', 'variant')
        
        return Response(InventorySerializer(low_stock, many=True).data)


# ============ SUPPLIERS ============

class SupplierListView(generics.ListCreateAPIView):
    serializer_class = SupplierSerializer
    permission_classes = [IsAdmin]
    queryset = Supplier.objects.all()


class SupplierDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SupplierSerializer
    permission_classes = [IsAdmin]
    queryset = Supplier.objects.all()


# ============ PURCHASE ORDERS ============

class PurchaseOrderListView(generics.ListCreateAPIView):
    serializer_class = PurchaseOrderSerializer
    permission_classes = [IsAdmin]
    queryset = PurchaseOrder.objects.all()
    filterset_fields = ['status', 'supplier']
    
    def perform_create(self, serializer):
        from datetime import datetime
        po_number = f"PO{datetime.now().strftime('%Y%m%d%H%M%S')}"
        serializer.save(created_by=self.request.user, po_number=po_number)


class PurchaseOrderDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = PurchaseOrderSerializer
    permission_classes = [IsAdmin]
    queryset = PurchaseOrder.objects.all()


class ReceivePurchaseOrderView(APIView):
    """Mark items as received and update inventory."""
    permission_classes = [IsAdmin]
    
    def post(self, request, pk):
        try:
            po = PurchaseOrder.objects.get(pk=pk)
        except PurchaseOrder.DoesNotExist:
            return Response({'error': 'PO not found'}, status=404)
        
        items = request.data.get('items', [])
        
        for item_data in items:
            try:
                item = PurchaseOrderItem.objects.get(id=item_data['id'])
            except PurchaseOrderItem.DoesNotExist:
                continue
            
            received = item_data.get('received', 0)
            item.quantity_received += received
            item.save()
            
            # Update inventory
            inventory, _ = Inventory.objects.get_or_create(
                product=item.product,
                variant=item.variant
            )
            
            previous = inventory.quantity
            inventory.quantity += received
            inventory.last_restocked = timezone.now()
            inventory.save()
            
            InventoryMovement.objects.create(
                inventory=inventory,
                movement_type='in',
                quantity=received,
                previous_quantity=previous,
                new_quantity=inventory.quantity,
                reference_type='purchase_order',
                reference_id=po.id,
                notes=f'Received from PO {po.po_number}',
                created_by=request.user
            )
        
        # Update PO status
        all_received = all(
            item.quantity_received >= item.quantity_ordered
            for item in po.items.all()
        )
        any_received = any(item.quantity_received > 0 for item in po.items.all())
        
        if all_received:
            po.status = 'received'
            po.received_at = timezone.now()
        elif any_received:
            po.status = 'partial'
        po.save()
        
        return Response(PurchaseOrderSerializer(po).data)


# ============ SHIPMENTS ============

class ShipmentListView(generics.ListCreateAPIView):
    permission_classes = [IsAdmin]
    filterset_fields = ['status', 'carrier']
    search_fields = ['tracking_number', 'order__order_number']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ShipmentCreateSerializer
        return ShipmentSerializer
    
    def get_queryset(self):
        return Shipment.objects.select_related('carrier', 'order')


class ShipmentDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = ShipmentSerializer
    permission_classes = [IsAdmin]
    queryset = Shipment.objects.all()


class UpdateShipmentStatusView(APIView):
    """Update shipment status and sync with order."""
    permission_classes = [IsAdmin]
    
    def post(self, request, pk):
        try:
            shipment = Shipment.objects.get(pk=pk)
        except Shipment.DoesNotExist:
            return Response({'error': 'Shipment not found'}, status=404)
        
        new_status = request.data.get('status')
        shipment.status = new_status
        
        if new_status == 'picked_up':
            shipment.shipped_at = timezone.now()
        elif new_status == 'delivered':
            shipment.delivered_at = timezone.now()
            # Update order status
            shipment.order.status = 'delivered'
            shipment.order.save()
        
        shipment.save()
        return Response(ShipmentSerializer(shipment).data)


# ============ CARRIERS ============

class CarrierListView(generics.ListCreateAPIView):
    serializer_class = CarrierSerializer
    permission_classes = [IsAdmin]
    queryset = Carrier.objects.all()


class CarrierDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CarrierSerializer
    permission_classes = [IsAdmin]
    queryset = Carrier.objects.all()


class CarrierPerformanceView(APIView):
    """Get carrier performance metrics."""
    permission_classes = [IsAdmin]
    
    def get(self, request):
        carriers = Carrier.objects.filter(is_active=True)
        performance = []
        
        for carrier in carriers:
            shipments = Shipment.objects.filter(carrier=carrier, status='delivered')
            stats = shipments.aggregate(
                total_shipments=Count('id'),
                total_revenue=Sum('shipping_charged'),
                total_cost=Sum('shipping_cost'),
                avg_days=Avg(F('delivered_at') - F('shipped_at'))
            )
            
            performance.append({
                'carrier': CarrierSerializer(carrier).data,
                'total_shipments': stats['total_shipments'] or 0,
                'total_revenue': float(stats['total_revenue'] or 0),
                'total_cost': float(stats['total_cost'] or 0),
                'profit': float((stats['total_revenue'] or 0) - (stats['total_cost'] or 0)),
            })
        
        return Response(performance)
