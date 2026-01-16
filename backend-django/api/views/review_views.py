"""
Review Views
"""
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly

from ..models import Review, Product, OrderItem
from ..viewmodels import ReviewSerializer


class ReviewViewSet(viewsets.ModelViewSet):
    """
    GET    /products/<id>/reviews/ - Get product reviews
    POST   /products/<id>/reviews/ - Add review
    PUT    /reviews/<id>/          - Update review
    DELETE /reviews/<id>/          - Delete review
    """
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        product_id = self.kwargs.get('product_id')
        if product_id:
            return Review.objects.filter(product_id=product_id, is_approved=True)
        return Review.objects.filter(user=self.request.user)

    def create(self, request, product_id=None):
        # Check if product exists
        try:
            product = Product.objects.get(pk=product_id)
        except Product.DoesNotExist:
            return Response(
                {'error': 'Product not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if already reviewed
        if Review.objects.filter(user=request.user, product=product).exists():
            return Response(
                {'error': 'You have already reviewed this product'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if verified purchase
        is_verified = OrderItem.objects.filter(
            order__user=request.user,
            product=product,
            order__status='delivered'
        ).exists()
        
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(
                user=request.user,
                product=product,
                is_verified_purchase=is_verified
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
