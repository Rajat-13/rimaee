"""
User Serializers (ViewModel)
"""
from rest_framework import serializers
from ..models import User, OTP


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'phone', 'email', 'username', 'full_name', 'avatar',
            'role', 'is_phone_verified', 'is_email_verified',
            'notifications_enabled', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'is_phone_verified', 'is_email_verified']


class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['phone', 'email', 'username', 'full_name', 'password', 'notifications_enabled']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User.objects.create(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user


class OTPSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=15)
    otp = serializers.CharField(max_length=6, required=False)


class LoginSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=15)
    otp = serializers.CharField(max_length=6)
