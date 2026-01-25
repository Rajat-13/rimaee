"""
Products Views - API endpoints
MVVM: View Layer
"""
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Sum, Count
from .models import Category, Product, ProductVariant, ProductImage, Ingredient, ProductView
from .serializers import (
    CategorySerializer, ProductListSerializer, ProductDetailSerializer,
    ProductAdminSerializer, ProductVariantSerializer, ProductImageSerializer,
    IngredientSerializer, ProductViewSerializer
)
from apps.accounts.views import IsAdmin


# ============ PUBLIC ENDPOINTS ============

class CategoryListView(generics.ListAPIView):
    """Public: List all active categories."""
    queryset = Category.objects.filter(is_active=True, parent__isnull=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class ProductListView(generics.ListAPIView):
    """Public: List products with filters."""
    serializer_class = ProductListSerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ['product_type', 'gender', 'is_featured', 'is_bestseller', 'category']
    search_fields = ['name', 'description', 'sku']
    ordering_fields = ['price', 'created_at', 'name']
    
    def get_queryset(self):
        return Product.objects.filter(is_active=True).select_related('category').prefetch_related('images')


class ProductDetailView(generics.RetrieveAPIView):
    """Public: Get product details."""
    serializer_class = ProductDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    
    def get_queryset(self):
        return Product.objects.filter(is_active=True).prefetch_related('images', 'variants')


class RecordProductView(APIView):
    """Record that user viewed a product."""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, product_id):
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=404)
        
        ProductView.objects.update_or_create(
            user=request.user,
            product=product
        )
        return Response({'status': 'recorded'})


class RecentlyViewedView(generics.ListAPIView):
    """Get user's recently viewed products."""
    serializer_class = ProductViewSerializer
    
    def get_queryset(self):
        return ProductView.objects.filter(user=self.request.user)[:20]


# ============ ADMIN ENDPOINTS ============

class AdminProductListView(generics.ListCreateAPIView):
    """Admin: List/create products with full data."""
    serializer_class = ProductAdminSerializer
    permission_classes = [IsAdmin]
    filterset_fields = ['product_type', 'is_active', 'is_featured', 'category']
    search_fields = ['name', 'sku']
    
    def get_queryset(self):
        return Product.objects.annotate(
            total_stock=Sum('variants__inventory__quantity'),
            total_sales=Count('order_items')
        ).prefetch_related('images', 'variants')


class AdminProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin: Get/update/delete product."""
    serializer_class = ProductAdminSerializer
    permission_classes = [IsAdmin]
    queryset = Product.objects.all()


class AdminProductImageUpload(APIView):
    """Admin: Upload product images."""
    permission_classes = [IsAdmin]
    parser_classes = [MultiPartParser, FormParser]
    
    def post(self, request, product_id):
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=404)
        
        images = request.FILES.getlist('images')
        created = []
        
        for i, image in enumerate(images):
            img = ProductImage.objects.create(
                product=product,
                image=image,
                is_primary=(i == 0 and not product.images.filter(is_primary=True).exists()),
                sort_order=product.images.count() + i
            )
            created.append(ProductImageSerializer(img).data)
        
        return Response(created, status=201)


class AdminVariantListView(generics.ListCreateAPIView):
    """Admin: Manage product variants."""
    serializer_class = ProductVariantSerializer
    permission_classes = [IsAdmin]
    
    def get_queryset(self):
        return ProductVariant.objects.filter(product_id=self.kwargs['product_id'])
    
    def perform_create(self, serializer):
        serializer.save(product_id=self.kwargs['product_id'])


class AdminCategoryListView(generics.ListCreateAPIView):
    """Admin: Manage categories."""
    serializer_class = CategorySerializer
    permission_classes = [IsAdmin]
    queryset = Category.objects.all()


class AdminCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin: Get/update/delete category."""
    serializer_class = CategorySerializer
    permission_classes = [IsAdmin]
    queryset = Category.objects.all()


class AdminIngredientListView(generics.ListCreateAPIView):
    """Admin: Manage ingredients."""
    serializer_class = IngredientSerializer
    permission_classes = [IsAdmin]
    queryset = Ingredient.objects.all()
    filterset_fields = ['note_type', 'family', 'is_active']


class AdminIngredientDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin: Get/update/delete ingredient."""
    serializer_class = IngredientSerializer
    permission_classes = [IsAdmin]
    queryset = Ingredient.objects.all()
