"""
Accounts Serializers - Data transformation
MVVM: ViewModel Layer
"""
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, UserRole, Address


class UserSerializer(serializers.ModelSerializer):
    roles = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'phone',
            'avatar', 'date_of_birth', 'address_line1', 'address_line2',
            'city', 'state', 'pincode', 'country', 'newsletter_subscribed',
            'roles', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'roles']

    def get_roles(self, obj):
        return list(obj.roles.values_list('role', flat=True))


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password_confirm', 
                  'first_name', 'last_name', 'phone']
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({'password_confirm': 'Passwords do not match'})
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        # Create default user role
        UserRole.objects.create(user=user, role='user')
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['roles'] = list(user.roles.values_list('role', flat=True))
        return token


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at']


class CustomerListSerializer(serializers.ModelSerializer):
    """Admin view of customers with stats."""
    total_orders = serializers.IntegerField(read_only=True)
    total_spent = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    roles = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'phone',
            'avatar', 'city', 'state', 'is_active', 'total_orders', 
            'total_spent', 'roles', 'created_at'
        ]
    
    def get_roles(self, obj):
        return list(obj.roles.values_list('role', flat=True))
