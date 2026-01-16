"""
Order Views
"""
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import action
from django.utils import timezone
import uuid

from ..models import Order, OrderItem, Cart, Address
from ..viewmodels import OrderSerializer, OrderListSerializer


class OrderViewSet(viewsets.ModelViewSet):
    """
    GET    /orders/           - List user orders
    GET    /orders/<id>/      - Get single order
    POST   /orders/           - Create new order
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == 'list':
            return OrderListSerializer
        return OrderSerializer

    def create(self, request):
        address_id = request.data.get('address_id')
        payment_method = request.data.get('payment_method', 'cod')
        notes = request.data.get('notes', '')

        # Get address
        try:
            address = Address.objects.get(pk=address_id, user=request.user)
        except Address.DoesNotExist:
            return Response(
                {'error': 'Address not found'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get cart
        try:
            cart = Cart.objects.get(user=request.user)
            if not cart.items.exists():
                return Response(
                    {'error': 'Cart is empty'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Cart.DoesNotExist:
            return Response(
                {'error': 'Cart not found'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calculate totals
        subtotal = cart.subtotal
        shipping = 0 if subtotal >= 999 else 49
        tax = subtotal * 0.18
        total = subtotal + shipping + tax

        # Create order
        order = Order.objects.create(
            order_number=f"ORD-{uuid.uuid4().hex[:8].upper()}",
            user=request.user,
            shipping_name=address.full_name,
            shipping_phone=address.phone,
            shipping_address=address.full_address,
            shipping_city=address.city,
            shipping_state=address.state,
            shipping_pincode=address.pincode,
            subtotal=subtotal,
            shipping_amount=shipping,
            tax_amount=tax,
            total_amount=total,
            payment_method=payment_method,
            notes=notes
        )

        # Create order items
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                product_name=item.product.name,
                product_sku=item.product.sku,
                quantity=item.quantity,
                unit_price=item.unit_price,
                total_price=item.total_price,
                size=item.size
            )

        # Clear cart
        cart.items.all().delete()

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AdminOrderViewSet(viewsets.ModelViewSet):
    """
    GET /orders/admin/          - List all orders
    PUT /orders/<id>/status/    - Update order status
    """
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]

    def get_serializer_class(self):
        if self.action == 'list':
            return OrderListSerializer
        return OrderSerializer

    @action(detail=True, methods=['put'])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(Order.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = new_status
        if new_status == 'delivered':
            order.delivered_at = timezone.now()
        order.save()
        
        return Response(OrderSerializer(order).data)
