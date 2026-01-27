from django.db import models


class Product(models.Model):
    PRODUCT_TYPE_CHOICES = (
        ('perfume', 'Perfume'),
        ('attar', 'Attar'),
    )

    GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
        ('unisex', 'Unisex'),
    )

    name = models.CharField(max_length=200)
    sku = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(unique=True)

    product_type = models.CharField(
        max_length=10,
        choices=PRODUCT_TYPE_CHOICES,
        default='perfume'
    )

    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES,
        default='unisex'
    )

    category = models.CharField(max_length=100)

    image = models.URLField(blank=True)
    images = models.JSONField(default=list)

    notes = models.JSONField(default=dict)

    sillage = models.PositiveSmallIntegerField(default=50)
    projection = models.PositiveSmallIntegerField(default=50)
    longevity = models.PositiveSmallIntegerField(default=50)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class ProductVariant(models.Model):
    SIZE_CHOICES = (
        ('8ml', '8ml'),
        ('50ml', '50ml'),
        ('100ml', '100ml'),
    )

    product = models.ForeignKey(
        Product,
        related_name='variants',
        on_delete=models.CASCADE
    )

    size = models.CharField(max_length=10, choices=SIZE_CHOICES)
    mrp = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.PositiveSmallIntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = ('product', 'size')

    def __str__(self):
        return f"{self.product.name} - {self.size}"
