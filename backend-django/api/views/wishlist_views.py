"""
Wishlist Views
"""
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action

from ..models import Wishlist, Product
from ..viewmodels import WishlistSerializer


class WishlistViewSet(viewsets.ViewSet):
    """
    GET    /wishlist/            - Get user wishlist
    POST   /wishlist/add/        - Add item to wishlist
    DELETE /wishlist/remove/<id>/ - Remove from wishlist
    """
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """GET /wishlist/ - Get wishlist"""
        items = Wishlist.objects.filter(user=request.user)
        serializer = WishlistSerializer(items, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add(self, request):
        """POST /wishlist/add/ - Add item"""
        product_id = request.data.get('product_id')
        
        try:
            product = Product.objects.get(pk=product_id, is_active=True)
        except Product.DoesNotExist:
            return Response(
                {'error': 'Product not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        wishlist_item, created = Wishlist.objects.get_or_create(
            user=request.user,
            product=product
        )
        
        if created:
            return Response(
                WishlistSerializer(wishlist_item).data,
                status=status.HTTP_201_CREATED
            )
        return Response({'message': 'Already in wishlist'})

    @action(detail=False, methods=['delete'], url_path='remove/(?P<product_id>[^/.]+)')
    def remove(self, request, product_id=None):
        """DELETE /wishlist/remove/<product_id>/ - Remove item"""
        try:
            item = Wishlist.objects.get(
                user=request.user,
                product_id=product_id
            )
            item.delete()
        except Wishlist.DoesNotExist:
            pass
        
        return Response(status=status.HTTP_204_NO_CONTENT)
