"""
Authentication Views
"""
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from datetime import timedelta

from ..models import User, OTP
from ..viewmodels import UserSerializer, UserCreateSerializer, OTPSerializer, LoginSerializer


class RegisterView(APIView):
    """POST /auth/register/ - Register new user"""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SendOTPView(APIView):
    """POST /auth/send-otp/ - Send OTP to phone"""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OTPSerializer(data=request.data)
        if serializer.is_valid():
            phone = serializer.validated_data['phone']
            
            # Delete existing OTPs
            OTP.objects.filter(phone=phone).delete()
            
            # Generate new OTP
            otp_code = OTP.generate_otp()
            expires_at = timezone.now() + timedelta(minutes=10)
            
            OTP.objects.create(
                phone=phone,
                otp=otp_code,
                expires_at=expires_at
            )
            
            # TODO: Send OTP via SMS gateway
            # For development, return OTP in response
            return Response({
                'message': 'OTP sent successfully',
                'otp': otp_code  # Remove in production
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyOTPView(APIView):
    """POST /auth/verify-otp/ - Verify OTP"""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            phone = serializer.validated_data['phone']
            otp_code = serializer.validated_data['otp']
            
            try:
                otp = OTP.objects.get(
                    phone=phone,
                    otp=otp_code,
                    is_verified=False,
                    expires_at__gt=timezone.now()
                )
                otp.is_verified = True
                otp.save()
                
                return Response({'message': 'OTP verified successfully', 'verified': True})
            except OTP.DoesNotExist:
                return Response(
                    {'error': 'Invalid or expired OTP'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """POST /auth/login/ - Login with phone and OTP"""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            phone = serializer.validated_data['phone']
            otp_code = serializer.validated_data['otp']
            
            # Verify OTP
            try:
                otp = OTP.objects.get(
                    phone=phone,
                    otp=otp_code,
                    expires_at__gt=timezone.now()
                )
            except OTP.DoesNotExist:
                return Response(
                    {'error': 'Invalid or expired OTP'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get or create user
            user, created = User.objects.get_or_create(phone=phone)
            user.is_phone_verified = True
            user.last_login_at = timezone.now()
            user.save()
            
            # Delete used OTP
            otp.delete()
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                },
                'is_new_user': created
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """POST /auth/logout/ - Logout user"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'message': 'Logged out successfully'})
        except Exception:
            return Response({'message': 'Logged out'})


class ProfileView(APIView):
    """GET/PUT /auth/profile/ - Get or update user profile"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
