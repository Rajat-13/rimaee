"""
Products Serializers
MVVM: ViewModel Layer
"""
from rest_framework import serializers
from .models import Category, Product, ProductVariant, ProductImage, Ingredient, ProductView


class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = '__all__'
    
    def get_children(self, obj):
        return CategorySerializer(obj.children.filter(is_active=True), many=True).data


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = '__all__'


class ProductVariantSerializer(serializers.ModelSerializer):
    stock_quantity = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = ProductVariant
        fields = '__all__'


class ProductListSerializer(serializers.ModelSerializer):
    """Light serializer for product lists."""
    primary_image = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    discount_percent = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'sku', 'name', 'slug', 'short_description', 'product_type',
            'gender', 'price', 'compare_at_price', 'primary_image',
            'category_name', 'is_featured', 'is_bestseller', 'is_new_arrival',
            'discount_percent', 'created_at'
        ]
    
    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        if primary:
            return primary.image.url if primary.image else None
        first = obj.images.first()
        return first.image.url if first and first.image else None
    
    def get_discount_percent(self, obj):
        if obj.compare_at_price and obj.compare_at_price > obj.price:
            return round((1 - obj.price / obj.compare_at_price) * 100)
        return 0


class ProductDetailSerializer(serializers.ModelSerializer):
    """Full serializer for product detail page."""
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    
    class Meta:
        model = Product
        fields = '__all__'


class ProductAdminSerializer(serializers.ModelSerializer):
    """Admin serializer with cost data."""
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    total_stock = serializers.IntegerField(read_only=True)
    total_sales = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Product
        fields = '__all__'


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = '__all__'


class ProductViewSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    
    class Meta:
        model = ProductView
        fields = ['id', 'product', 'viewed_at']
