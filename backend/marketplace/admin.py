from django.contrib import admin
from . import models

# Register your models here.
admin.site.register(models.CustomUser)
admin.site.register(models.PriceListing)
admin.site.register(models.ProcurementOrder)
admin.site.register(models.ProductListing)