from django.contrib import admin

from .models import MatchStatus, Video

# Register your models here.
admin.site.register(Video)
admin.site.register(MatchStatus)
