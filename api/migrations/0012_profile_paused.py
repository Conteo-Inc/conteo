# Generated by Django 3.1.4 on 2021-04-26 16:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0011_auto_20210419_1624"),
    ]

    operations = [
        migrations.AddField(
            model_name="profile",
            name="paused",
            field=models.BooleanField(default=False),
        ),
    ]