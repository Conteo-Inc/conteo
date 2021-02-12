# Generated by Django 3.1.4 on 2021-02-09 21:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0003_profile"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="profile",
            name="age",
        ),
        migrations.AddField(
            model_name="profile",
            name="birth_date",
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name="profile",
            name="gender",
            field=models.CharField(
                choices=[("M", "Male"), ("F", "Female"), ("O", "Other")],
                max_length=1,
                null=True,
            ),
        ),
    ]