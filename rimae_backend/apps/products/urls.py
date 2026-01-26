from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_some_by('-created_at')
    serializer_class = ProductSerializer
    
    # Enable filtering to match your frontend dashboard
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['type', 'category', 'gender', 'is_active']
    search_fields = ['name', 'sku']