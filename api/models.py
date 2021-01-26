from django.db import models
from django.db.models import F,Q
from django.contrib.auth.models import User, BaseUserManager, AbstractBaseUser, models
import uuid


# class UserManager(BaseUserManager):
#     '''
#     creating a manager for a custom user model
#     https://docs.djangoproject.com/en/3.0/topics/auth/customizing/#writing-a-manager-for-a-custom-user-model
#     https://docs.djangoproject.com/en/3.0/topics/auth/customizing/#a-full-example
#     '''
#     def create_user(self, email, password=None):
#         """
#         Create and return a `User` with an email, username and password.
#         """
#         if not email:
#             raise ValueError('Users Must Have an email address')

#         user = self.model(
#             email=self.normalize_email(email),
#         )
#         user.set_password(password)
#         user.save(using=self._db)
#         return user

#     def create_superuser(self, email, password):
#         """
#         Create and return a `User` with superuser (admin) permissions.
#         """
#         if password is None:
#             raise TypeError('Superusers must have a password.')

#         user = self.create_user(email, password)
#         user.is_superuser = True
#         user.is_staff = True
#         user.save()

#         return user


# class User(AbstractBaseUser):

#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     email = models.EmailField(
#         verbose_name='email address',
#         max_length=255,
#         unique=True
#         )
#     is_active = models.BooleanField(default=True)
#     is_staff = models.BooleanField(default=False)
#     is_superuser = models.BooleanField(default=False)
#     USERNAME_FIELD = 'email'
#     REQUIRED_FIELDS = []

#     # Tells Django that the UserManager class defined above should manage
#     # objects of this type.
#     objects = UserManager()

#     def __str__(self):
#         return self.email


#Note that enforcement on these fields should be done on the frontend --- Very easy!
class UserProfile(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    first_name = models.CharField(max_length=50, unique=False)
    last_name = models.CharField(max_length=50, unique=False)
    phone_number = models.CharField(max_length=10, unique=True, null=True)
    age = models.PositiveIntegerField(null=True, blank=False)
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
    )
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
