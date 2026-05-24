from rest_framework import serializers
from . import models

class ProductListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ProductListing
        fields = ['id', 'CHEMICAL_NAME', 'CATEGORY', 'CAS_NUMBER']

class PriceListingSerializer(serializers.ModelSerializer):
    DISTRIBUTOR = serializers.SerializerMethodField(read_only=True)
    PRODUCT = ProductListingSerializer(read_only=True)
    class Meta:
        model = models.PriceListing
        fields = ['id', 'DISTRIBUTOR', 'PRODUCT', 'price_per_metric_ton', 'quantity_available_mt', 'created_at', 'updated_at', 'is_available']  

    def get_DISTRIBUTOR(self, obj):
        return obj.DISTRIBUTOR.shop_name or obj.DISTRIBUTOR.username  

class ProcurementOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ProcurementOrder
        fields = ['id', 'MANUFACTURER', 'listing', 'quantity_requested', 'total_invoice', 'created_at']  

    def get_MANUFACTURER(self, obj):
        return obj.MANUFACTURER.shop_name or obj.MANUFACTURER.username  

    def validate(self, data):
        requested_amount = data.get('quantity_requested')
        listing_instance = data.get('listing')

        if listing_instance and requested_amount:
            available_stock = listing_instance.quantity_available_mt

            if requested_amount > available_stock:
                raise serializers.ValidationError({
                    "quantity_kg": f"Allocation rejected. Only {available_stock} units available in vendor warehouse inventory."
                })
            
        return data
