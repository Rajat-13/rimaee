"""
Notification Serializers (ViewModel)
"""
from rest_framework import serializers
from ..models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'type', 'title', 'message',
            'is_read', 'is_broadcast', 'metadata', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class BroadcastSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=200)
    message = serializers.CharField()
    type = serializers.ChoiceField(choices=['promo', 'system'], default='promo')
