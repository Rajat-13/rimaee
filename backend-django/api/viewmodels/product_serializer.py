"""
Product Serializers (ViewModel)
"""
from rest_framework import serializers
from ..models import Product, ProductImage, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'is_active']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_cover', 'order']


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views"""
    cover_image = serializers.SerializerMethodField()
    final_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'type', 'sku', 'price', 'discount',
            'final_price', 'cover_image', 'category_name', 'gender',
            'rating', 'review_count', 'is_bestseller', 'stock_quantity'
        ]

    def get_cover_image(self, obj):
        cover = obj.images.filter(is_cover=True).first()
        if cover:
            return cover.image.url
        first_image = obj.images.first()
        return first_image.image.url if first_image else None


class ProductSerializer(serializers.ModelSerializer):
    """Full serializer for detail views"""
    images = ProductImageSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True,
        required=False
    )
    final_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    is_low_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'short_description',
            'type', 'sku', 'price', 'discount', 'final_price',
            'category', 'category_id', 'gender', 'concentration',
            'stock_quantity', 'min_order_threshold', 'watching_count',
            'is_active', 'is_bestseller', 'is_featured', 'is_low_stock',
            'top_notes', 'middle_notes', 'base_notes',
            'rating', 'review_count', 'images',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'rating', 'review_count']
