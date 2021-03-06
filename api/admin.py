from django.contrib import admin

from .models import MatchStatus, Profile, Report, Video

admin.site.register(MatchStatus)
admin.site.register(Profile)
admin.site.register(Video)
admin.site.register(Report)
