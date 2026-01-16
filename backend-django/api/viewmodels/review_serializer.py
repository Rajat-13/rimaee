"""
Review Serializers (ViewModel)
"""
from rest_framework import serializers
from ..models import Review


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    user_avatar = serializers.ImageField(source='user.avatar', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'user', 'user_name', 'user_avatar', 'product',
            'rating', 'title', 'comment',
            'is_verified_purchase', 'helpful_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'is_verified_purchase', 'helpful_count', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
