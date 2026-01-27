from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.permissions import AllowAny

from .models import Product
from .serializers import ProductSerializer


class ProductViewSet(viewsets.ModelViewSet):
    """
    GET /api/v1/products/
    GET /api/v1/products/{slug}/
    POST /api/v1/products/
    PUT / PATCH /api/v1/products/{slug}/
    DELETE /api/v1/products/{slug}/
    """

    queryset = Product.objects.all().prefetch_related('variants')
    serializer_class = ProductSerializer
    lookup_field = 'slug'
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)