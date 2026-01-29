from rest_framework import serializers
from .models import Product, ProductVariant, ProductImage


# -----------------------------
# Product Variant Serializer
# -----------------------------
class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = [
            'id',
            'size',
            'mrp',
            'discount',
            'price',
        ]


# -----------------------------
# Product Image Serializer
# -----------------------------
class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = [
            'image',
            'images',
        ]


# -----------------------------
# Product READ Serializer
# -----------------------------
class ProductSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)
    product_images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'sku',
            'product_type',
            'gender',
            'category',
            'notes',
            'description',
            'occasion',
            'tag',
            'sillage',
            'projection',
            'longevity',
            'max_order_threshold',
            'stock_id',
            'is_active',
            'created_at',
            'variants',
            'product_images',
        ]


# -----------------------------
# Product WRITE Serializer
# -----------------------------
class ProductWriteSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True, required=False)

    # 👇 ACCEPT UI FIELDS DIRECTLY
    image = serializers.CharField(required=False, allow_null=True)
    images = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )

    class Meta:
        model = Product
        fields = [
            'name',
            'sku',
            'product_type',
            'gender',
            'category',
            'notes',
            'description',
            'occasion',
            'tag',
            'sillage',
            'projection',
            'longevity',
            'max_order_threshold',
            'stock_id',
            'is_active',
            'variants',
            'image',     # 👈 UI sends this
            'images',    # 👈 UI sends this
        ]

    def create(self, validated_data):
        variants_data = validated_data.pop('variants', [])
        image = validated_data.pop('image', None)
        images = validated_data.pop('images', [])

        product = Product.objects.create(**validated_data)

        # Create variants
        for variant in variants_data:
            ProductVariant.objects.create(product=product, **variant)

        # Create product images (ONLY ONE ROW PER PRODUCT)
        if image or images:
            ProductImage.objects.create(
                product=product,
                image=image,
                images=images
            )

        return product

    def update(self, instance, validated_data):
        variants_data = validated_data.pop('variants', None)
        image = validated_data.pop('image', None)
        images = validated_data.pop('images', None)

        # Update product fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update variants
        if variants_data is not None:
            instance.variants.all().delete()
            for variant in variants_data:
                ProductVariant.objects.create(product=instance, **variant)

        # Update images (single row logic)
        if image is not None or images is not None:
            product_image, _ = ProductImage.objects.get_or_create(product=instance)
            if image is not None:
                product_image.image = image
            if images is not None:
                product_image.images = images
            product_image.save()

        return instance
    
