from django.contrib import admin

from .models import MatchStatus, Report

# Register your models here.
admin.site.register(MatchStatus)
admin.site.register(Report)
