# Generated by Django 3.1.4 on 2021-05-12 21:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0014_merge_20210506_1452"),
    ]

    operations = [
        migrations.RenameField(
            model_name="privacy",
            old_name="birth_date_privacy",
            new_name="birth_date",
        ),
        migrations.RenameField(
            model_name="privacy",
            old_name="first_name_privacy",
            new_name="first_name",
        ),
        migrations.RenameField(
            model_name="privacy",
            old_name="gender_privacy",
            new_name="gender",
        ),
        migrations.RenameField(
            model_name="privacy",
            old_name="interests_privacy",
            new_name="interests",
        ),
        migrations.RenameField(
            model_name="privacy",
            old_name="last_name_privacy",
            new_name="last_name",
        ),
    ]