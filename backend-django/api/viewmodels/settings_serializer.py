"""
Settings Serializers (ViewModel)
"""
from rest_framework import serializers
from ..models import BrandSettings


class BrandSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BrandSettings
        fields = [
            'brand_name', 'tagline', 'currency', 'currency_symbol',
            'support_email', 'support_phone',
            'instagram_url', 'facebook_url', 'twitter_url',
            'free_shipping_threshold', 'default_shipping_cost',
            'gst_percentage', 'updated_at'
        ]
        read_only_fields = ['updated_at']
