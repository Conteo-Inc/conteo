# Generated by Django 3.1.4 on 2021-02-10 03:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0003_profile"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="matchstatus",
            options={"verbose_name_plural": "MatchStatuses"},
        ),
    ]