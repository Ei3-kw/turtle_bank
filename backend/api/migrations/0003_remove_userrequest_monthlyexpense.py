# Generated by Django 5.0.6 on 2024-07-05 01:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_remove_userrequest_age_remove_userrequest_occupation'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userrequest',
            name='monthlyExpense',
        ),
    ]