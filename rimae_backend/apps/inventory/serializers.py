"""
Inventory Serializers
MVVM: ViewModel Layer
"""
from rest_framework import serializers
from .models import (
    Inventory, InventoryMovement, Supplier, 
    PurchaseOrder, PurchaseOrderItem, Shipment, Carrier
)


class InventorySerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    variant_name = serializers.CharField(source='variant.name', read_only=True)
    sku = serializers.SerializerMethodField()
    available_quantity = serializers.IntegerField(read_only=True)
    needs_reorder = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Inventory
        fields = '__all__'
    
    def get_sku(self, obj):
        return obj.variant.sku if obj.variant else obj.product.sku


class InventoryMovementSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.first_name', read_only=True)
    
    class Meta:
        model = InventoryMovement
        fields = '__all__'
        read_only_fields = ['previous_quantity', 'new_quantity', 'created_by', 'created_at']


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'


class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = PurchaseOrderItem
        fields = '__all__'


class PurchaseOrderSerializer(serializers.ModelSerializer):
    items = PurchaseOrderItemSerializer(many=True, read_only=True)
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    
    class Meta:
        model = PurchaseOrder
        fields = '__all__'


class CarrierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carrier
        fields = '__all__'


class ShipmentSerializer(serializers.ModelSerializer):
    carrier_name = serializers.CharField(source='carrier.name', read_only=True)
    order_number = serializers.CharField(source='order.order_number', read_only=True)
    profit_loss = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = Shipment
        fields = '__all__'


class ShipmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipment
        fields = [
            'order', 'carrier', 'tracking_number', 'shipping_charged',
            'shipping_cost', 'packaging_cost', 'weight', 'length', 'width', 'height'
        ]
