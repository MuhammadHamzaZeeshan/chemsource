from . import views
from django.urls import path

urlpatterns = [
    path('api/listings/', views.PriceListAPIView.as_view(), name='listings'),
    path('api/products/', views.ProductListAPIView.as_view(), name='products'),
    path('api/orders/', views.OrderListAPIView.as_view(), name='orders'),
]