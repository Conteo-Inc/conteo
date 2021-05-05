from django.contrib import admin

from .models import Interest, MatchStatus, Privacy, Profile, Report, Video

admin.site.register(MatchStatus)
admin.site.register(Profile)
admin.site.register(Video)
admin.site.register(Report)
admin.site.register(Interest)
admin.site.register(Privacy)
