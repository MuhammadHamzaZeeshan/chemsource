from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
class CustomUser(AbstractUser):

    CATEGORIES = (
        ("ADMIN", "System Admin"),
        ("DISTRIBUTOR", "Distributor"),
        ("MANUFACTURER", "Manufacturer")
    )
    SHOP_NAME = models.CharField(max_length=255, unique=True, null=False, blank=False)
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
    DISTRIBUTOR = models.ForeignKey(CustomUser, limit_choices_to={'role':'DISTRIBUTOR'})
    CHEMICAL_NAME = models.ForeignKey(ProductListing)
    price_per_metric_ton = models.DecimalField(max_digits=10, decimal_places=2)
    quantity_available_mt = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{(self.DISTRIBUTOR.SHOP_NAME)} - {self.CHEMICAL_NAME}"
    
class ProcurementOrder(models.Model):
    MANUFACTURER = models.ForeignKey(CustomUser, limit_choices_to={'role':'MANUFACTURER'})
    listing = models.ForeignKey(PriceListing)
    created_at = models.DateTimeField(auto_now=True)
    quantity_requested = models.PositiveIntegerField()
    total_invoice = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{(self.MANUFACTURER.SHOP_NAME)} - {self.listing.CHEMICAL_NAME} @ {self.listing.price_per_metric_ton} PKR/MT"
    
    def save(self):
        total_invoice = self.quantity_requested * self.listing.price_per_metric_ton
