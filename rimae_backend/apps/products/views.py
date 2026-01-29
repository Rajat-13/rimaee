from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db import transaction

from .models import Product, ProductVariant
from .serializers import ProductSerializer, ProductWriteSerializer


class ProductViewSet(viewsets.ModelViewSet):
    """
    GET /api/v1/products/products/
    GET /api/v1/products/products/{id}/
    POST /api/v1/products/products/
    PUT / PATCH /api/v1/products/products/{id}/
    DELETE /api/v1/products/products/{id}/
    """

    queryset = Product.objects.all().prefetch_related('variants')
    lookup_field = 'id'
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProductWriteSerializer
        return ProductSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        
   
        # Return with full serializer
        output_serializer = ProductSerializer(product)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        
      
        
        output_serializer = ProductSerializer(product)
        return Response(output_serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
