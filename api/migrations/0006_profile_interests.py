# Generated by Django 3.1.4 on 2021-02-28 18:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0005_auto_20210220_1518"),
    ]

    operations = [
        migrations.AddField(
            model_name="profile",
            name="interests",
            field=models.CharField(blank=True, max_length=200),
        ),
    ]
