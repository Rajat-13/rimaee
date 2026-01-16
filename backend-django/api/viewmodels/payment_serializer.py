"""
Payment Serializers (ViewModel)
"""
from rest_framework import serializers
from ..models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    order_number = serializers.CharField(source='order.order_number', read_only=True)
    customer_name = serializers.CharField(source='user.full_name', read_only=True)
    customer_phone = serializers.CharField(source='user.phone', read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'transaction_id', 'order', 'order_number',
            'user', 'customer_name', 'customer_phone',
            'amount', 'method', 'status',
            'gateway_transaction_id',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'transaction_id', 'created_at', 'updated_at']


class PaymentInitiateSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()
    method = serializers.CharField(max_length=20)


class PaymentVerifySerializer(serializers.Serializer):
    transaction_id = serializers.CharField()
    gateway_response = serializers.JSONField()
