from rest_framework import serializers
from .models import Product, ProductVariant


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = [
            'id',
            'size',
            'mrp',
            'discount',
            'price'
        ]


class ProductSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'sku',
            'slug',
            'product_type',
            'gender',
            'category',
            'image',
            'images',
            'notes',
            'sillage',
            'projection',
            'longevity',
            'is_active',
            'created_at',
            'variants'
        ]
