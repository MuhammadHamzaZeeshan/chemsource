from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from decimal import Decimal
from marketplace.models import ProductListing, PriceListing

User = get_user_model()


class Command(BaseCommand):
    help = 'Seeds the PostgreSQL database with comprehensive enterprise B2B ChemSource data'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING('\n🚀 Initializing ChemSource Data Seeding...'))

        # -----------------------------
        # 1. MASTER PRODUCT CATALOG
        # -----------------------------
        self.stdout.write('Seeding static catalog products...')

        compounds_data = [
            # CORE PRODUCTS
            {"name": "Glacial Acetic Acid (99%)", "cat": "TEXTILE_AUXILIARY", "cas": "64-19-7"},
            {"name": "Caustic Soda Flakes", "cat": "ACID_BASE", "cas": "1310-73-2"},
            {"name": "Hydrogen Peroxide (50%)", "cat": "TEXTILE_AUXILIARY", "cas": "7722-84-1"},
            {"name": "Isopropyl Alcohol (IPA)", "cat": "SOLVENT", "cas": "67-63-0"},
            {"name": "Tech-Grade Sulfuric Acid (98%)", "cat": "ACID_BASE", "cas": "7664-93-9"},

            # EXPANDED PRODUCTS
            {"name": "Ethyl Acetate Industrial Grade", "cat": "SOLVENT", "cas": "141-78-6"},
            {"name": "Butyl Glycol (EGBE)", "cat": "SOLVENT", "cas": "111-76-2"},
            {"name": "Soda Ash Dense", "cat": "ACID_BASE", "cas": "497-19-8"},
            {"name": "Sodium Sulfate Anhydrous", "cat": "ACID_BASE", "cas": "7757-82-6"},
            {"name": "Hydrochloric Acid (37%)", "cat": "ACID_BASE", "cas": "7647-01-0"},
            {"name": "Formic Acid (85%)", "cat": "ACID_BASE", "cas": "64-18-6"},
            {"name": "Ammonium Bicarbonate", "cat": "ACID_BASE", "cas": "1066-33-7"},
            {"name": "Zinc Oxide Industrial Grade", "cat": "TEXTILE_AUXILIARY", "cas": "1314-13-2"},
            {"name": "Sodium Lauryl Sulfate (SLS)", "cat": "TEXTILE_AUXILIARY", "cas": "151-21-3"},
            {"name": "EDTA Disodium Salt", "cat": "TEXTILE_AUXILIARY", "cas": "139-33-3"},
        ]

        compound_objects = {}

        for c in compounds_data:
            obj, created = ProductListing.objects.get_or_create(
                CHEMICAL_NAME=c["name"],
                defaults={
                    "CATEGORY": c["cat"],
                    "CAS_NUMBER": c["cas"],
                }
            )
            compound_objects[c["name"]] = obj

        # -----------------------------
        # 2. LISTINGS DATA (SAFE)
        # -----------------------------
        self.stdout.write('Generating active warehouse supply listings...')

        listings_data = [
            {"vendor": "al_poly", "prod": "Glacial Acetic Acid (99%)", "price": 340000, "qty": 45},
            {"vendor": "al_poly", "prod": "Isopropyl Alcohol (IPA)", "price": 410000, "qty": 18},
            {"vendor": "indus_chem", "prod": "Caustic Soda Flakes", "price": 195000, "qty": 120},
            {"vendor": "indus_chem", "prod": "Hydrogen Peroxide (50%)", "price": 160000, "qty": 85},
            {"vendor": "indus_chem", "prod": "Tech-Grade Sulfuric Acid (98%)", "price": 95000, "qty": 250},
            {"vendor": "al_poly", "prod": "Hydrogen Peroxide (50%)", "price": 158000, "qty": 40},

            {"vendor": "pak_chem_global", "prod": "Mono Ethylene Glycol (MEG)", "price": 365000, "qty": 70},
            {"vendor": "pak_chem_global", "prod": "Methanol Industrial Grade", "price": 275000, "qty": 95},

            {"vendor": "nova_industries", "prod": "Titanium Dioxide Rutile Grade", "price": 890000, "qty": 22},
            {"vendor": "nova_industries", "prod": "Phosphoric Acid (85%)", "price": 315000, "qty": 48},

            {"vendor": "eastern_bulk_chem", "prod": "Sodium Bicarbonate Industrial Grade", "price": 145000, "qty": 130},
            {"vendor": "eastern_bulk_chem", "prod": "Liquid Chlorine", "price": 118000, "qty": 160},

            {"vendor": "trade_axis_ltd", "prod": "Toluene Commercial Grade", "price": 425000, "qty": 35},
            {"vendor": "trade_axis_ltd", "prod": "Nitric Acid (68%)", "price": 290000, "qty": 60},

            {"vendor": "chembridge_pk", "prod": "Linear Alkyl Benzene Sulphonic Acid", "price": 255000, "qty": 85},
            {"vendor": "chembridge_pk", "prod": "Sodium Hypochlorite Solution", "price": 98000, "qty": 210},

            {"vendor": "al_poly", "prod": "Methanol Industrial Grade", "price": 270000, "qty": 40},
            {"vendor": "indus_chem", "prod": "Mono Ethylene Glycol (MEG)", "price": 360000, "qty": 55},

            # EXPANSION
            {"vendor": "indus_chem", "prod": "Hydrochloric Acid (37%)", "price": 125000, "qty": 140},
            {"vendor": "indus_chem", "prod": "Soda Ash Dense", "price": 210000, "qty": 90},

            {"vendor": "pak_chem_global", "prod": "Ethyl Acetate Industrial Grade", "price": 385000, "qty": 55},
            {"vendor": "pak_chem_global", "prod": "Butyl Glycol (EGBE)", "price": 445000, "qty": 35},

            {"vendor": "nova_industries", "prod": "Zinc Oxide Industrial Grade", "price": 520000, "qty": 60},
            {"vendor": "nova_industries", "prod": "Formic Acid (85%)", "price": 260000, "qty": 75},

            {"vendor": "chembridge_pk", "prod": "Sodium Lauryl Sulfate (SLS)", "price": 310000, "qty": 120},
            {"vendor": "chembridge_pk", "prod": "EDTA Disodium Salt", "price": 275000, "qty": 95},

            {"vendor": "trade_axis_ltd", "prod": "Ammonium Bicarbonate", "price": 185000, "qty": 110},
            {"vendor": "eastern_bulk_chem", "prod": "Sodium Sulfate Anhydrous", "price": 165000, "qty": 150},

            {"vendor": "karachi_chem_mart", "prod": "Hydrochloric Acid (37%)", "price": 130000, "qty": 200},
            {"vendor": "lahore_industrial_chem", "prod": "Soda Ash Dense", "price": 215000, "qty": 180},
            {"vendor": "faisalabad_textile_chem", "prod": "Hydrogen Peroxide (50%)", "price": 162000, "qty": 140},
        ]

        # -----------------------------
        # 3. SAFE PRODUCT VALIDATION
        # -----------------------------
        for l in listings_data:
            if l["prod"] not in compound_objects:
                obj, created = ProductListing.objects.get_or_create(
                    CHEMICAL_NAME=l["prod"],
                    defaults={
                        "CATEGORY": "SOLVENT",
                        "CAS_NUMBER": "0000-00-0",
                    }
                )
                compound_objects[l["prod"]] = obj

        # -----------------------------
        # 4. VENDORS
        # -----------------------------
        vendor_shop_names = {
            "indus_chem": "Indus Chemical Distributors",
            "pak_chem_global": "Pak Chem Global Traders",
            "nova_industries": "Nova Industrial Chemicals",
            "eastern_bulk_chem": "Eastern Bulk Chemical Supply",
            "trade_axis_ltd": "Trade Axis Chemical Solutions",
            "chembridge_pk": "ChemBridge Pakistan",
            "karachi_chem_mart": "Karachi Chemical Mart",
            "lahore_industrial_chem": "Lahore Industrial Chemicals",
            "faisalabad_textile_chem": "Faisalabad Textile Chemicals",
        }

        user_objects = {}
        vendors = set([l["vendor"] for l in listings_data])

        for v in vendors:
            user, created = User.objects.get_or_create(
                username=v,
                defaults={
                    "SHOP_NAME": vendor_shop_names.get(v, v.replace("_", " ").title()),
                    "CATEGORY": "DISTRIBUTOR",
                }
            )
            if created:
                user.set_unusable_password()
                user.save()

            user_objects[v] = user

        # -----------------------------
        # 5. LISTINGS
        # -----------------------------
        for l in listings_data:
            PriceListing.objects.get_or_create(
                DISTRIBUTOR=user_objects[l["vendor"]],
                PRODUCT=compound_objects[l["prod"]],
                defaults={
                    "price_per_metric_ton": Decimal(l["price"]),
                    "quantity_available_mt": l["qty"],
                }
            )

        self.stdout.write(self.style.SUCCESS(
            '🎉 Complete! Database population automated successfully.\n'
        ))