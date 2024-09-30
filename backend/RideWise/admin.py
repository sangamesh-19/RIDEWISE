from django.contrib import admin
from .models import  Trips, FavoriteRoute, Review, CabService


admin.site.register(Trips)
admin.site.register(FavoriteRoute)
admin.site.register(Review)
admin.site.register(CabService)
