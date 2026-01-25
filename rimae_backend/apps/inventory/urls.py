"""
Inventory URL Configuration
"""
from django.urls import path
from .views import (
    InventoryListView, InventoryDetailView, InventoryAdjustView,
    InventoryMovementListView, LowStockAlertView,
    SupplierListView, SupplierDetailView,
    PurchaseOrderListView, PurchaseOrderDetailView, ReceivePurchaseOrderView,
    ShipmentListView, ShipmentDetailView, UpdateShipmentStatusView,
    CarrierListView, CarrierDetailView, CarrierPerformanceView
)

urlpatterns = [
    # Inventory
    path('', InventoryListView.as_view(), name='inventory-list'),
    path('<uuid:pk>/', InventoryDetailView.as_view(), name='inventory-detail'),
    path('<uuid:pk>/adjust/', InventoryAdjustView.as_view(), name='inventory-adjust'),
    path('<uuid:inventory_id>/movements/', InventoryMovementListView.as_view(), name='inventory-movements'),
    path('movements/', InventoryMovementListView.as_view(), name='all-movements'),
    path('low-stock/', LowStockAlertView.as_view(), name='low-stock'),
    
    # Suppliers
    path('suppliers/', SupplierListView.as_view(), name='supplier-list'),
    path('suppliers/<uuid:pk>/', SupplierDetailView.as_view(), name='supplier-detail'),
    
    # Purchase Orders
    path('purchase-orders/', PurchaseOrderListView.as_view(), name='po-list'),
    path('purchase-orders/<uuid:pk>/', PurchaseOrderDetailView.as_view(), name='po-detail'),
    path('purchase-orders/<uuid:pk>/receive/', ReceivePurchaseOrderView.as_view(), name='po-receive'),
    
    # Shipments
    path('shipments/', ShipmentListView.as_view(), name='shipment-list'),
    path('shipments/<uuid:pk>/', ShipmentDetailView.as_view(), name='shipment-detail'),
    path('shipments/<uuid:pk>/status/', UpdateShipmentStatusView.as_view(), name='shipment-status'),
    
    # Carriers
    path('carriers/', CarrierListView.as_view(), name='carrier-list'),
    path('carriers/<uuid:pk>/', CarrierDetailView.as_view(), name='carrier-detail'),
    path('carriers/performance/', CarrierPerformanceView.as_view(), name='carrier-performance'),
]
