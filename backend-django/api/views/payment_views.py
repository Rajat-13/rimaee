"""
Payment Views
"""
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import action
import uuid

from ..models import Payment, Order
from ..viewmodels import PaymentSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    """
    GET    /payments/           - List all payments (Admin)
    POST   /payments/initiate/  - Initiate payment
    POST   /payments/verify/    - Verify payment
    GET    /payments/<id>/      - Get payment details
    """
    serializer_class = PaymentSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAdminUser()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Payment.objects.all()
        return Payment.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def initiate(self, request):
        """POST /payments/initiate/ - Initiate payment"""
        order_id = request.data.get('order_id')
        method = request.data.get('method', 'cod')
        
        try:
            order = Order.objects.get(pk=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Create payment record
        payment = Payment.objects.create(
            transaction_id=f"TXN-{uuid.uuid4().hex[:12].upper()}",
            order=order,
            user=request.user,
            amount=order.total_amount,
            method=method,
            status='pending'
        )
        
        # For COD, mark as success immediately
        if method == 'cod':
            payment.status = 'success'
            payment.save()
            order.payment_status = 'paid'
            order.status = 'confirmed'
            order.save()
        
        return Response(PaymentSerializer(payment).data)

    @action(detail=False, methods=['post'])
    def verify(self, request):
        """POST /payments/verify/ - Verify payment (for online payments)"""
        transaction_id = request.data.get('transaction_id')
        gateway_response = request.data.get('gateway_response', {})
        
        try:
            payment = Payment.objects.get(
                transaction_id=transaction_id,
                user=request.user
            )
        except Payment.DoesNotExist:
            return Response(
                {'error': 'Payment not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # TODO: Verify with actual payment gateway
        # For now, just mark as success
        payment.status = 'success'
        payment.gateway_response = gateway_response
        payment.save()
        
        # Update order
        payment.order.payment_status = 'paid'
        payment.order.status = 'confirmed'
        payment.order.save()
        
        return Response(PaymentSerializer(payment).data)
