from django.test import TestCase
from unittest.mock import patch, MagicMock
from consulviewer import tasks

class TaskSaveHistoryTest(TestCase):
    @patch("consulviewer.tasks.save_history")
    def test_task_save_history_calls_save_history(self, mock_save_history):
        mock_save_history.return_value = "ok"

        result = tasks.task_save_history()

        mock_save_history.assert_called_once_with()
        self.assertEqual(result, "ok")

    @patch("consulviewer.tasks.save_history")
    def test_task_save_history_handles_exception(self, mock_save_history):
        mock_save_history.side_effect = Exception("erro interno")

        with self.assertRaises(Exception):
            tasks.task_save_history()
