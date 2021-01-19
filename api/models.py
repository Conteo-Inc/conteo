from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

class Video(models.Model):
    title = models.CharField(max_length=100)    #At some point this needs to be removed
    created_at = models.DateTimeField(auto_now_add=True)
    viewed_at = models.DateTimeField(null=True)
    video_file = models.FileField(upload_to='media/', null=True, verbose_name="")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="videos")

#All possible relationships
#(true,true), (true, null), (false, true/null/false), (null,null)
#Note that we don't need to store (null,null)
class MatchStatus(models.Model):
    primary_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="+")
    secondary_user = models.ForeignKey(User, null=True, on_delete=models.CASCADE, related_name="+")
    primary_response = models.BooleanField()
    secondary_response = models.BooleanField(null=True)

    @property
    def accepted(self):
        return self.primary_response and self.secondary_accepted()

    @property
    def secondary_accepted(self):
        return self.secondary_response is not None and self.secondary_response
    

#when matching page loads:
#1.(FE) getMatches(N: number, queued: id[])
#2.(BE) query users where
#       a. not penpal
#       b. not rejected
#       c. not limbo
#       d. not queued
#                   Here we have X users
#3.(BE) With alg v1: randomize
#4.(BE) Return at most N
#5.(FE), display 5