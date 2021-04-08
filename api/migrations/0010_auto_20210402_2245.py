# Generated by Django 3.1.4 on 2021-04-03 02:45

import json

from django.db import migrations


def add_interests(apps, schema_editor):
    # We can't import the Interest model directly as it may be a newer
    # version than this migration expects. We use the historical version.
    Interest = apps.get_model("api", "Interest")

    # Add all predefined interests into model.
    with open("api/data/interests.json") as fileData:
        data = json.load(fileData)
        for interestData in data:
            try:
                category = interestData["category"]
                title = interestData["title"]
                interest = Interest(category=category, title=title)
                interest.save()
            except KeyError as e:
                print(f"KeyError reading interests.json {e} on data {interestData}")


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0009_interest_privacy"),
    ]

    operations = [
        migrations.RunPython(add_interests),
    ]
