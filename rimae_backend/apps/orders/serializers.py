"""
Orders Serializers with Unit Economics
MVVM: ViewModel Layer
"""
from rest_framework import serializers
from .models import Order, OrderItem, Coupon, Cart, CartItem, Wishlist
from apps.products.serializers import ProductSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    profit = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = '__all__'
    
    def get_profit(self, obj):
        return float(obj.total_price - (obj.unit_cost * obj.quantity))


class OrderListSerializer(serializers.ModelSerializer):
    """Light serializer for order lists."""
    customer_name = serializers.CharField(source='user.first_name', read_only=True)
    customer_email = serializers.CharField(source='user.email', read_only=True)
    item_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'customer_name', 'customer_email',
            'status', 'payment_status', 'total_amount', 'item_count', 'created_at'
        ]
    
    def get_item_count(self, obj):
        return obj.items.count()


class OrderDetailSerializer(serializers.ModelSerializer):
    """Full order with unit economics."""
    items = OrderItemSerializer(many=True, read_only=True)
    gross_profit = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    net_profit = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    profit_margin = serializers.DecimalField(max_digits=5, decimal_places=2, read_only=True)
    customer_name = serializers.CharField(source='user.first_name', read_only=True)
    customer_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'


class OrderCreateSerializer(serializers.ModelSerializer):
    """Create order from cart."""
    items = serializers.ListField(child=serializers.DictField(), write_only=True)
    
    class Meta:
        model = Order
        fields = [
            'shipping_name', 'shipping_phone', 'shipping_address1', 'shipping_address2',
            'shipping_city', 'shipping_state', 'shipping_pincode', 'payment_method',
            'customer_notes', 'items', 'coupon'
        ]


class OrderAdminUpdateSerializer(serializers.ModelSerializer):
    """Admin can update costs for unit economics."""
    class Meta:
        model = Order
        fields = [
            'status', 'payment_status', 'cogs', 'shipping_cost', 
            'packaging_cost', 'payment_gateway_fee', 'cac', 'admin_notes'
        ]


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = '__all__'


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.UUIDField(write_only=True)
    variant_id = serializers.UUIDField(write_only=True, required=False)
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'variant', 'variant_id', 'quantity', 'created_at']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()
    
    class Meta:
        model = Cart
        fields = ['id', 'items', 'total', 'updated_at']
    
    def get_total(self, obj):
        total = 0
        for item in obj.items.all():
            price = item.variant.price if item.variant else item.product.price
            total += price * item.quantity
        return float(total)


class WishlistSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.UUIDField(write_only=True)
    
    class Meta:
        model = Wishlist
        fields = ['id', 'product', 'product_id', 'created_at']
