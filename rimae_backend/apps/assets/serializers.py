# apps/assets/serializers.py
from rest_framework import serializers
from .models import Asset

class AssetSerializer(serializers.ModelSerializer):
    # We calculate these on the fly for the frontend
    size_mb = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Asset
        fields = '__all__'
        # THIS IS THE FIX: Tell DRF not to require these in the POST request
        read_only_fields = ['asset_type', 'file_size', 'mime_type', 'used_in']

    def get_size_mb(self, obj):
        return round(obj.file_size / (1024 * 1024), 2) if obj.file_size else 0

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return obj.file.url if obj.file else None