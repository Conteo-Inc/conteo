from django.contrib.auth.models import User
from django.db import models
from django.db.models import F, Q


class Profile(models.Model):
    GENDER_CHOICES = (("M", "Male"), ("F", "Female"), ("O", "Other"))

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    phone_number = models.CharField(max_length=10, unique=True, null=True)
    birth_date = models.DateField(null=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, null=True)
    image = models.FileField(
        upload_to="images/", null=True, verbose_name="profile picture"
    )


class Privacy(models.Model):
    class Setting(models.TextChoices):
        PUBLIC = "PU"
        PRIVATE = "PR"
        HIDDEN = "HI"

    profile = models.OneToOneField(
        Profile,
        on_delete=models.CASCADE,
        primary_key=True,
        verbose_name="related profile",
    )
    first_name_privacy = models.CharField(
        max_length=2, choices=Setting.choices, default=Setting.PUBLIC
    )
    last_name_privacy = models.CharField(
        max_length=2, choices=Setting.choices, default=Setting.PUBLIC
    )
    birth_date_privacy = models.CharField(
        max_length=2, choices=Setting.choices, default=Setting.PRIVATE
    )
    gender_privacy = models.CharField(
        max_length=2, choices=Setting.choices, default=Setting.PRIVATE
    )
    interests_privacy = models.CharField(
        max_length=2, choices=Setting.choices, default=Setting.PUBLIC
    )


class Interest(models.Model):
    profiles = models.ManyToManyField(Profile)
    category = models.CharField(max_length=30, blank=True)
    title = models.CharField(max_length=30)


class Video(models.Model):
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="sent_videos"
    )
    receiver = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="received_videos"
    )

    created_at = models.DateTimeField()
    viewed_at = models.DateTimeField(null=True)

    video_file = models.FileField(upload_to="videos/", null=True, verbose_name="")


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
        verbose_name_plural = "MatchStatuses"

    def __str__(self):
        return f"{self.user_lo} [{self.user_lo_response}] - {self.user_hi} [{self.user_hi_response}]"  # noqa: E501


class Report(models.Model):
    class Status(models.TextChoices):
        UNASSIGNED = "U"
        ASSIGNED = "A"
        RESOLVED = "R"

    class ReportType(models.TextChoices):
        VIDEO = "V"
        PROFILE = "P"

    status = models.CharField(
        max_length=1, choices=Status.choices, default=Status.UNASSIGNED
    )
    report_type = models.CharField(max_length=1, choices=ReportType.choices)
    description = models.TextField(blank=True)
    reporter = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        help_text="The user who submitted the report",
        related_name="submitted_reports",
    )
    reportee = models.ForeignKey(
        User, on_delete=models.CASCADE, help_text="The user being reported"
    )
    reviewer = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        limit_choices_to={"is_staff": True},
        null=True,
        help_text="The admin handling the report",
        related_name="assigned_reports",
    )
    video = models.ForeignKey(
        Video, on_delete=models.SET_NULL, null=True, help_text="The offending video"
    )
    submitted_on = models.DateTimeField(auto_now_add=True, editable=False)
