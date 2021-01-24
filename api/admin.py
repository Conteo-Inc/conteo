from django.contrib import admin
from .models import Video

from .models import MatchStatus

# Register your models here.
admin.site.register(Video)
admin.site.register(MatchStatus)