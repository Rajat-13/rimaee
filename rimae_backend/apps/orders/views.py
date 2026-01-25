"""
Orders Views - API endpoints
MVVM: View Layer
"""
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum, F, Count
from .models import Order, OrderItem, Coupon, Cart, CartItem, Wishlist
from .serializers import (
    OrderListSerializer, OrderDetailSerializer, OrderCreateSerializer,
    OrderAdminUpdateSerializer, CouponSerializer,
    CartSerializer, CartItemSerializer, WishlistSerializer
)
from apps.accounts.views import IsAdmin
from apps.products.models import Product, ProductVariant


# ============ USER ENDPOINTS ============

class CartView(generics.RetrieveAPIView):
    """Get current user's cart."""
    serializer_class = CartSerializer
    
    def get_object(self):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        return cart


class CartAddItem(APIView):
    """Add item to cart."""
    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        variant_id = request.data.get('variant_id')
        quantity = request.data.get('quantity', 1)
        
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=404)
        
        variant = None
        if variant_id:
            try:
                variant = ProductVariant.objects.get(id=variant_id)
            except ProductVariant.DoesNotExist:
                return Response({'error': 'Variant not found'}, status=404)
        
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart, product=product, variant=variant,
            defaults={'quantity': quantity}
        )
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        
        return Response(CartSerializer(cart).data)


class CartUpdateItem(APIView):
    """Update cart item quantity."""
    def patch(self, request, item_id):
        try:
            cart_item = CartItem.objects.get(id=item_id, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response({'error': 'Item not found'}, status=404)
        
        quantity = request.data.get('quantity', 1)
        if quantity <= 0:
            cart_item.delete()
        else:
            cart_item.quantity = quantity
            cart_item.save()
        
        cart = Cart.objects.get(user=request.user)
        return Response(CartSerializer(cart).data)


class CartRemoveItem(APIView):
    """Remove item from cart."""
    def delete(self, request, item_id):
        try:
            cart_item = CartItem.objects.get(id=item_id, cart__user=request.user)
            cart_item.delete()
        except CartItem.DoesNotExist:
            pass
        
        cart = Cart.objects.get(user=request.user)
        return Response(CartSerializer(cart).data)


class WishlistView(generics.ListCreateAPIView):
    """Get/add to wishlist."""
    serializer_class = WishlistSerializer
    
    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        product_id = request.data.get('product_id')
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=404)
        
        wishlist_item, created = Wishlist.objects.get_or_create(
            user=request.user, product=product
        )
        return Response(WishlistSerializer(wishlist_item).data, 
                       status=201 if created else 200)


class WishlistRemove(APIView):
    """Remove from wishlist."""
    def delete(self, request, product_id):
        Wishlist.objects.filter(user=request.user, product_id=product_id).delete()
        return Response({'status': 'removed'})


class UserOrderListView(generics.ListAPIView):
    """User's order history."""
    serializer_class = OrderListSerializer
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class UserOrderDetailView(generics.RetrieveAPIView):
    """Get specific order."""
    serializer_class = OrderDetailSerializer
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class CreateOrderView(APIView):
    """Create order from cart."""
    def post(self, request):
        serializer = OrderCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        cart = Cart.objects.filter(user=request.user).first()
        if not cart or not cart.items.exists():
            return Response({'error': 'Cart is empty'}, status=400)
        
        # Calculate totals
        subtotal = 0
        cogs = 0
        items_data = []
        
        for cart_item in cart.items.all():
            price = cart_item.variant.price if cart_item.variant else cart_item.product.price
            cost = cart_item.variant.cost_price if cart_item.variant else cart_item.product.cost_price
            line_total = price * cart_item.quantity
            subtotal += line_total
            cogs += cost * cart_item.quantity
            
            items_data.append({
                'product': cart_item.product,
                'variant': cart_item.variant,
                'product_name': cart_item.product.name,
                'variant_name': cart_item.variant.name if cart_item.variant else '',
                'sku': cart_item.variant.sku if cart_item.variant else cart_item.product.sku,
                'quantity': cart_item.quantity,
                'unit_price': price,
                'unit_cost': cost,
                'total_price': line_total,
            })
        
        # Create order
        order = Order.objects.create(
            user=request.user,
            subtotal=subtotal,
            total_amount=subtotal,  # Add shipping/tax later
            cogs=cogs,
            **{k: v for k, v in serializer.validated_data.items() if k != 'items'}
        )
        
        # Create order items
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        
        # Clear cart
        cart.items.all().delete()
        
        return Response(OrderDetailSerializer(order).data, status=201)


class ApplyCouponView(APIView):
    """Apply coupon to order."""
    def post(self, request):
        code = request.data.get('code')
        try:
            coupon = Coupon.objects.get(code=code, is_active=True)
        except Coupon.DoesNotExist:
            return Response({'error': 'Invalid coupon'}, status=400)
        
        from django.utils import timezone
        now = timezone.now()
        if coupon.valid_from > now or coupon.valid_until < now:
            return Response({'error': 'Coupon expired'}, status=400)
        
        if coupon.usage_limit and coupon.used_count >= coupon.usage_limit:
            return Response({'error': 'Coupon usage limit reached'}, status=400)
        
        return Response(CouponSerializer(coupon).data)


# ============ ADMIN ENDPOINTS ============

class AdminOrderListView(generics.ListAPIView):
    """Admin: List all orders with unit economics."""
    serializer_class = OrderDetailSerializer
    permission_classes = [IsAdmin]
    filterset_fields = ['status', 'payment_status']
    search_fields = ['order_number', 'user__email', 'shipping_name']
    ordering_fields = ['created_at', 'total_amount', 'net_profit']
    
    def get_queryset(self):
        return Order.objects.select_related('user').prefetch_related('items')


class AdminOrderDetailView(generics.RetrieveUpdateAPIView):
    """Admin: Get/update order with costs."""
    permission_classes = [IsAdmin]
    queryset = Order.objects.all()
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return OrderAdminUpdateSerializer
        return OrderDetailSerializer


class AdminCouponListView(generics.ListCreateAPIView):
    """Admin: Manage coupons."""
    serializer_class = CouponSerializer
    permission_classes = [IsAdmin]
    queryset = Coupon.objects.all()


class AdminCouponDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin: Get/update/delete coupon."""
    serializer_class = CouponSerializer
    permission_classes = [IsAdmin]
    queryset = Coupon.objects.all()


class UnitEconomicsView(APIView):
    """Admin: Get unit economics summary."""
    permission_classes = [IsAdmin]
    
    def get(self, request):
        from django.db.models.functions import TruncMonth
        
        orders = Order.objects.filter(status='delivered')
        
        totals = orders.aggregate(
            total_revenue=Sum('total_amount'),
            total_cogs=Sum('cogs'),
            total_shipping_cost=Sum('shipping_cost'),
            total_packaging=Sum('packaging_cost'),
            total_gateway_fees=Sum('payment_gateway_fee'),
            total_cac=Sum('cac'),
            order_count=Count('id')
        )
        
        revenue = totals['total_revenue'] or 0
        total_costs = (
            (totals['total_cogs'] or 0) +
            (totals['total_shipping_cost'] or 0) +
            (totals['total_packaging'] or 0) +
            (totals['total_gateway_fees'] or 0) +
            (totals['total_cac'] or 0)
        )
        
        monthly = orders.annotate(
            month=TruncMonth('created_at')
        ).values('month').annotate(
            revenue=Sum('total_amount'),
            cogs=Sum('cogs'),
            orders=Count('id')
        ).order_by('month')
        
        return Response({
            'summary': {
                'total_revenue': float(revenue),
                'total_costs': float(total_costs),
                'gross_profit': float(revenue - (totals['total_cogs'] or 0)),
                'net_profit': float(revenue - total_costs),
                'profit_margin': float((revenue - total_costs) / revenue * 100) if revenue else 0,
                'order_count': totals['order_count'],
                'avg_order_value': float(revenue / totals['order_count']) if totals['order_count'] else 0,
            },
            'monthly': list(monthly)
        })
