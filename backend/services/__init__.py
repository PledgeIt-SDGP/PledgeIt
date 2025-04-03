from .email_handler import EmailService
from .geocoding import get_coordinates
email_service = EmailService()

__all__ = ['email_service']