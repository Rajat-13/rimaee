"""
Order Serializers (ViewModel)
"""
from rest_framework import serializers
from ..models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'product_name', 'product_sku', 'product_image',
            'quantity', 'unit_price', 'discount', 'total_price', 'size'
        ]
        read_only_fields = ['id']


class OrderListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views"""
    items_count = serializers.IntegerField(read_only=True)
    customer_name = serializers.CharField(source='user.full_name', read_only=True)
    customer_phone = serializers.CharField(source='user.phone', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'customer_name', 'customer_phone',
            'total_amount', 'status', 'payment_status',
            'items_count', 'created_at'
        ]


class OrderSerializer(serializers.ModelSerializer):
    """Full serializer for detail views"""
    items = OrderItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='user.full_name', read_only=True)
    customer_phone = serializers.CharField(source='user.phone', read_only=True)
    customer_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'user',
            'customer_name', 'customer_phone', 'customer_email',
            'shipping_name', 'shipping_phone', 'shipping_address',
            'shipping_city', 'shipping_state', 'shipping_pincode',
            'subtotal', 'discount_amount', 'shipping_amount',
            'tax_amount', 'total_amount',
            'status', 'payment_status', 'payment_method',
            'notes', 'items',
            'created_at', 'updated_at', 'delivered_at'
        ]
        read_only_fields = ['id', 'order_number', 'created_at', 'updated_at']


class OrderCreateSerializer(serializers.Serializer):
    """Serializer for creating orders"""
    address_id = serializers.IntegerField()
    payment_method = serializers.CharField(max_length=50)
    notes = serializers.CharField(required=False, allow_blank=True)
