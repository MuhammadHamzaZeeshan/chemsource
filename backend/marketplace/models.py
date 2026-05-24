from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
class CustomUser(AbstractUser):

    CATEGORIES = (
        ("ADMIN", "System Admin"),
        ("DISTRIBUTOR", "Distributor"),
        ("MANUFACTURER", "Manufacturer")
    )
    SHOP_NAME = models.CharField(max_length=255, unique=True, null=True, blank=True)
    PHONE = models.CharField(max_length=13, unique=True, null=True, blank=True)
    CATEGORY = models.CharField(max_length=50, choices=CATEGORIES)

    def __str__(self):
        return f"{self.username} - {self.CATEGORY}"

class ProductListing(models.Model):
    CATEGORIES = (
        ("TEXTILE_AUXILIARY", "Textile Auxiliary"),
        ("PHARMA_GRADE", "Pharma Grade"),
        ("SOLVENT", "Solvent"),
        ("ACID_BASE", "Acid Base")
    )
    CHEMICAL_NAME = models.CharField(max_length=100, unique=True, null=False, blank=False)
    CATEGORY = models.CharField(max_length=100, choices=CATEGORIES,unique=True, null=False, blank=False)
    CAS_NUMBER = models.CharField(max_length=50, unique=True, null=False, blank=False)

    def __str__(self):
        return f"{self.CAS_NUMBER} - {self.CHEMICAL_NAME}"
    
class PriceListing(models.Model):
    DISTRIBUTOR = models.ForeignKey(CustomUser, limit_choices_to={'role':'DISTRIBUTOR'}, on_delete=models.CASCADE, related_name='listings')
    PRODUCT = models.ForeignKey(ProductListing, on_delete=models.CASCADE, related_name='listings')
    price_per_metric_ton = models.DecimalField(max_digits=10, decimal_places=2)
    quantity_available_mt = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('DISTRIBUTOR', 'PRODUCT')

    def __str__(self):
        return f"{(self.DISTRIBUTOR.SHOP_NAME)} - {self.CHEMICAL_NAME}"
    
class ProcurementOrder(models.Model):
    ProcurementOrder = models.ForeignKey(CustomUser, limit_choices_to={'role':'MANUFACTURER'}, on_delete=models.CASCADE, related_name='orders')
    listing = models.ForeignKey(PriceListing, on_delete=models.CASCADE, related_name='orders')
    quantity_requested = models.PositiveIntegerField()
    total_invoice = models.DecimalField(max_digits=10, decimal_places=2, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        
        listing_obj = self.listing
        
        self.total_invoice = listing_obj.price_per_metric_ton * self.quantity_requested
        if self.pk is None:
            listing_obj.quantity_available_mt -= self.quantity_requested
            listing_obj.save()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{(self.MANUFACTURER.SHOP_NAME)} - {self.listing.CHEMICAL_NAME} @ {self.listing.price_per_metric_ton} PKR/MT"
