from rest_framework import serializers
from .models import Asset

class AssetSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    
    class Meta:
        model = Asset
        fields = '__all__'
    
    def get_url(self, obj):
        return obj.file.url if obj.file else None
