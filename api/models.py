from django.contrib.auth.models import User
from django.db import models
from django.db.models import F, Q

GENDER_CHOICES = (
        ("M", "Male"),
        ("F", "Female"),
        ("O", "Other")
)

# Note that enforcement on these fields should be done on the frontend --- Very easy!
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    phone_number = models.CharField(max_length=10, unique=True, null=True)
    age = models.PositiveIntegerField(null=True, blank=False)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, null=True)


class Video(models.Model):
    title = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    viewed_at = models.DateTimeField(null=True)


class MatchStatus(models.Model):
    """
    Represents the match status for two users.

    A True response means that the user accepted the other user as a penpal.
    A False response means that the user declined the other user as a penpal.
    A null response means that the user is undecided.
    """

    user_lo = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="matchstatus_lo"
    )
    user_hi = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="matchstatus_hi"
    )
    user_lo_response = models.BooleanField(null=True)
    user_hi_response = models.BooleanField(null=True)

    class Meta:
        constraints = [
            # This constraint avoids duplicate/illegal records:
            #   user_lo  user_hi   . . .
            #   -------  -------
            #   0034     0035     }
            #   0035     0034     } Only one of these two records needs to exist
            #   . . .
            #   0022     0022     Users can't match with themselves
            models.CheckConstraint(
                check=Q(user_lo_id__lt=F("user_hi_id")), name="user_lo_lt_user_hi"
            )
        ]

    def __str__(self):
        return f"{self.user_lo} [{self.user_lo_response}] - {self.user_hi} [{self.user_hi_response}]"  # noqa: E501
