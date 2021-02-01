# Generated by Django 3.1.4 on 2021-01-19 21:06

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("api", "0002_matchstatus"),
    ]

    operations = [
        migrations.AddField(
            model_name="video",
            name="created_by",
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="videos",
                to="auth.user",
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="video",
            name="video_file",
            field=models.FileField(null=True, upload_to="media/", verbose_name=""),
        ),
    ]
