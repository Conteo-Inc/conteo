from django.contrib.auth.models import User
from rest_framework.test import APITestCase

from api.models import Report


class ReportViewTestCase(APITestCase):
    def setUp(self):
        self.ale = User.objects.create_user(username="ale", password="password")
        self.boy = User.objects.create_user(username="boy", password="password")

    def test_report(self):
        """
        Test reporting a user.

        Checks if a user can report another user through the reporting
        endpoint.
        """
        self.client.login(username="ale", password="password")
        res = self.client.post(
            "/api/reports/",
            {
                "report_type": Report.ReportType.PROFILE,
                "reportee": self.boy.id,
            },
            format="json",
        )
        self.assertEqual(res.status_code, 201)
        report = Report.objects.filter(reporter=self.ale.id).first()
        self.assertEqual(report.reporter, self.ale)
        self.assertEqual(report.reportee, self.boy)
