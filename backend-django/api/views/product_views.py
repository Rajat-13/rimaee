"""
Product Views
"""
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from ..models import Product, Category
from ..viewmodels import ProductSerializer, ProductListSerializer, CategorySerializer


class ProductViewSet(viewsets.ModelViewSet):
    """
    GET    /products/           - List all products (paginated)
    GET    /products/<id>/      - Get single product
    POST   /products/           - Create product (Admin)
    PUT    /products/<id>/      - Update product (Admin)
    DELETE /products/<id>/      - Delete product (Admin)
    """
    queryset = Product.objects.filter(is_active=True)
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['type', 'gender', 'category', 'is_bestseller', 'concentration']
    search_fields = ['name', 'description', 'sku']
    ordering_fields = ['price', 'created_at', 'rating', 'name']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        return ProductSerializer


class BestsellersView(APIView):
    """GET /products/bestsellers/ - Get bestseller products"""
    permission_classes = [AllowAny]

    def get(self, request):
        product_type = request.query_params.get('type', None)
        queryset = Product.objects.filter(is_active=True, is_bestseller=True)
        
        if product_type:
            queryset = queryset.filter(type=product_type)
        
        queryset = queryset[:12]  # Limit to 12
        serializer = ProductListSerializer(queryset, many=True)
        return Response(serializer.data)


class ProductSearchView(APIView):
    """GET /products/search/ - Search products"""
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get('q', '')
        if len(query) < 2:
            return Response([])
        
        products = Product.objects.filter(
            is_active=True
        ).filter(
            name__icontains=query
        ) | Product.objects.filter(
            is_active=True
        ).filter(
            description__icontains=query
        )
        
        products = products.distinct()[:20]
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)
