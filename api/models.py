from django.db import models
from django.contrib.auth.models import User, BaseUserManager, AbstractBaseUser
import uuid


class UserManager(BaseUserManager):
    '''
    creating a manager for a custom user model
    https://docs.djangoproject.com/en/3.0/topics/auth/customizing/#writing-a-manager-for-a-custom-user-model
    https://docs.djangoproject.com/en/3.0/topics/auth/customizing/#a-full-example
    '''
    def create_user(self, email, password=None):
        """
        Create and return a `User` with an email, username and password.
        """
        if not email:
            raise ValueError('Users Must Have an email address')

        user = self.model(
            email=self.normalize_email(email),
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        """
        Create and return a `User` with superuser (admin) permissions.
        """
        if password is None:
            raise TypeError('Superusers must have a password.')

        user = self.create_user(email, password)
        user.is_superuser = True
        user.is_staff = True
        user.save()

        return user


class User(AbstractBaseUser):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True
        )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    # Tells Django that the UserManager class defined above should manage
    # objects of this type.
    objects = UserManager()

    def __str__(self):
        return self.email

    class Meta:
        '''
        to set table name in database
        '''
        db_table = "login"

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

    class Meta:
        '''
        to set table name in database
        '''
        db_table = "profile"


# Create your models here.
class Video(models.Model):
    title = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    viewed_at = models.DateTimeField(null=True)

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