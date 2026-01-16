"""
Address Serializers (ViewModel)
"""
from rest_framework import serializers
from ..models import Address


class AddressSerializer(serializers.ModelSerializer):
    full_address = serializers.CharField(read_only=True)

    class Meta:
        model = Address
        fields = [
            'id', 'label', 'type', 'full_name', 'phone',
            'address_line1', 'address_line2', 'landmark',
            'city', 'state', 'pincode', 'country',
            'is_default', 'is_active', 'full_address',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
