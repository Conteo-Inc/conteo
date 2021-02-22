# Generated by Django 3.1.4 on 2021-02-14 03:37

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("api", "0003_profile"),
    ]

    operations = [
        migrations.CreateModel(
            name="Report",
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
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("U", "Unassigned"),
                            ("A", "Assigned"),
                            ("R", "Resolved"),
                        ],
                        default="U",
                        max_length=1,
                    ),
                ),
                (
                    "report_type",
                    models.CharField(
                        choices=[("V", "Video"), ("P", "Profile")], max_length=1
                    ),
                ),
                ("description", models.TextField(blank=True)),
                ("submitted_on", models.DateTimeField(auto_now_add=True)),
                (
                    "reportee",
                    models.ForeignKey(
                        help_text="The user being reported",
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "reporter",
                    models.ForeignKey(
                        help_text="The user who submitted the report",
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="submitted_reports",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "reviewer",
                    models.ForeignKey(
                        help_text="The admin handling the report",
                        limit_choices_to={"is_staff": True},
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="assigned_reports",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "video",
                    models.ForeignKey(
                        help_text="The offending video",
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="api.video",
                    ),
                ),
            ],
        ),
    ]