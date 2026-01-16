"""
Cart Views
"""
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action

from ..models import Cart, CartItem, Product
from ..viewmodels import CartSerializer, CartItemSerializer


class CartViewSet(viewsets.ViewSet):
    """
    GET    /cart/                  - Get user cart
    POST   /cart/add/              - Add item to cart
    PUT    /cart/update/<item_id>/ - Update cart item
    DELETE /cart/remove/<item_id>/ - Remove item from cart
    DELETE /cart/clear/            - Clear entire cart
    """
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """GET /cart/ - Get cart"""
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add(self, request):
        """POST /cart/add/ - Add item"""
        cart, _ = Cart.objects.get_or_create(user=request.user)
        
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)
        size = request.data.get('size', '')
        
        try:
            product = Product.objects.get(pk=product_id, is_active=True)
        except Product.DoesNotExist:
            return Response(
                {'error': 'Product not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if item exists
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            size=size,
            defaults={'quantity': quantity}
        )
        
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        
        return Response(CartSerializer(cart).data)

    @action(detail=False, methods=['put'], url_path='update/(?P<item_id>[^/.]+)')
    def update_item(self, request, item_id=None):
        """PUT /cart/update/<item_id>/ - Update quantity"""
        try:
            cart_item = CartItem.objects.get(
                pk=item_id,
                cart__user=request.user
            )
        except CartItem.DoesNotExist:
            return Response(
                {'error': 'Item not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        quantity = request.data.get('quantity')
        if quantity and quantity > 0:
            cart_item.quantity = quantity
            cart_item.save()
        else:
            cart_item.delete()
        
        cart = Cart.objects.get(user=request.user)
        return Response(CartSerializer(cart).data)

    @action(detail=False, methods=['delete'], url_path='remove/(?P<item_id>[^/.]+)')
    def remove(self, request, item_id=None):
        """DELETE /cart/remove/<item_id>/ - Remove item"""
        try:
            cart_item = CartItem.objects.get(
                pk=item_id,
                cart__user=request.user
            )
            cart_item.delete()
        except CartItem.DoesNotExist:
            pass
        
        cart = Cart.objects.get(user=request.user)
        return Response(CartSerializer(cart).data)

    @action(detail=False, methods=['delete'])
    def clear(self, request):
        """DELETE /cart/clear/ - Clear cart"""
        try:
            cart = Cart.objects.get(user=request.user)
            cart.items.all().delete()
        except Cart.DoesNotExist:
            pass
        
        return Response({'message': 'Cart cleared'})
