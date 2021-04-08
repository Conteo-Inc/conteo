# Generated by Django 3.1.4 on 2021-04-03 02:45

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0008_auto_20210306_1641"),
    ]

    operations = [
        migrations.CreateModel(
            name="Privacy",
            fields=[
                (
                    "profile",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        primary_key=True,
                        serialize=False,
                        to="api.profile",
                        verbose_name="related profile",
                    ),
                ),
                (
                    "first_name_privacy",
                    models.CharField(
                        choices=[("PU", "Public"), ("PR", "Private"), ("HI", "Hidden")],
                        default="PU",
                        max_length=2,
                    ),
                ),
                (
                    "last_name_privacy",
                    models.CharField(
                        choices=[("PU", "Public"), ("PR", "Private"), ("HI", "Hidden")],
                        default="PU",
                        max_length=2,
                    ),
                ),
                (
                    "birth_date_privacy",
                    models.CharField(
                        choices=[("PU", "Public"), ("PR", "Private"), ("HI", "Hidden")],
                        default="PR",
                        max_length=2,
                    ),
                ),
                (
                    "gender_privacy",
                    models.CharField(
                        choices=[("PU", "Public"), ("PR", "Private"), ("HI", "Hidden")],
                        default="PR",
                        max_length=2,
                    ),
                ),
                (
                    "interests_privacy",
                    models.CharField(
                        choices=[("PU", "Public"), ("PR", "Private"), ("HI", "Hidden")],
                        default="PU",
                        max_length=2,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Interest",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("category", models.CharField(blank=True, max_length=30)),
                ("title", models.CharField(max_length=30)),
                ("profiles", models.ManyToManyField(to="api.Profile")),
            ],
        ),
    ]