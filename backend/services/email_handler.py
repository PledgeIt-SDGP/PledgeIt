import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from jinja2 import Environment, FileSystemLoader
import qrcode
from io import BytesIO
from dotenv import load_dotenv
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class EmailService:
    def __init__(self):
        # Email configuration from .env
        self.smtp_server = os.getenv("EMAIL_HOST", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("EMAIL_PORT", 587))
        self.email_address = os.getenv("EMAIL_USER")
        self.email_password = os.getenv("EMAIL_PASSWORD")
        self.from_name = os.getenv("EMAIL_FROM_NAME", "PledgeIt Team")
        self.from_address = os.getenv("EMAIL_FROM_ADDRESS", self.email_address)
        self.app_name = os.getenv("APP_NAME", "PledgeIt")
        self.app_url = os.getenv("APP_URL", "https://pledgeit.live")

        # Validate required email configuration
        if not all([self.email_address, self.email_password]):
            logger.error("Missing required email configuration in environment variables")
            raise ValueError("Email service configuration incomplete")

        # Template environment
        self.template_env = Environment(loader=FileSystemLoader("templates"))

    def _send_email(self, to_email: str, subject: str, body: str, image_data: bytes = None, image_name: str = None):
        """
        Internal method to send an email with optional image attachment.
        """
        try:
            # Create message container
            msg = MIMEMultipart()
            msg['From'] = f"{self.from_name} <{self.from_address}>"
            msg['To'] = to_email
            msg['Subject'] = subject

            # Attach body
            msg.attach(MIMEText(body, 'html'))

            # Attach image if provided
            if image_data and image_name:
                image = MIMEImage(image_data)
                image.add_header('Content-Disposition', f'attachment; filename="{image_name}"')
                image.add_header('Content-ID', '<qr_code>')
                msg.attach(image)

            # Connect to SMTP server and send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.email_address, self.email_password)
                server.send_message(msg)

            logger.info(f"Email sent successfully to {to_email}")
            return True
        except smtplib.SMTPException as e:
            logger.error(f"SMTP error sending email to {to_email}: {str(e)}")
            return False
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False

    def generate_qr_code(self, event_id: int, event_name: str) -> bytes:
        """
        Generates a QR code containing event information.
        Returns the QR code image as bytes.
        """
        try:
            # Create QR code with event details
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            
            # Include the frontend URL for scanning
            qr_data = f"{self.app_url}/events/{event_id}/scan"
            qr.add_data(qr_data)
            qr.make(fit=True)

            # Create image
            img = qr.make_image(fill_color="black", back_color="white")

            # Convert to bytes
            img_bytes = BytesIO()
            img.save(img_bytes, format="PNG")
            return img_bytes.getvalue()
        except Exception as e:
            logger.error(f"Failed to generate QR code: {str(e)}")
            raise

    def send_event_qr_to_organization(self, event_id: int, event_name: str, organization_email: str, event_details: dict):
        """
        Sends an email to the organization with the event QR code and details.
        """
        try:
            # Generate QR code
            qr_image = self.generate_qr_code(event_id, event_name)

            # Load email template
            template = self.template_env.get_template("event_creation_email.html")
            event_date = datetime.strptime(event_details['date'], "%Y-%m-%d").strftime("%B %d, %Y")
            event_time = event_details['time']

            # Render template with event details
            email_body = template.render(
                app_name=self.app_name,
                app_url=self.app_url,
                event_name=event_name,
                event_id=event_id,
                organization_name=event_details['organization'],
                event_date=event_date,
                event_time=event_time,
                venue=event_details['venue'],
                address=event_details['address'],
                contact_person=event_details['contact_person']['name'],
                contact_number=event_details['contact_person']['contact_number'],
                qr_code_url=f"{self.app_url}/events/{event_id}/scan"
            )

            # Send email with QR code
            subject = f"{self.app_name}: Your Event QR Code - {event_name}"
            return self._send_email(
                to_email=organization_email,
                subject=subject,
                body=email_body,
                image_data=qr_image,
                image_name=f"pledgeit_event_{event_id}_qr.png"
            )
        except Exception as e:
            logger.error(f"Failed to send event QR email: {str(e)}")
            return False

    def send_participation_confirmation(self, volunteer_email: str, volunteer_name: str, event_name: str, event_details: dict):
        """
        Sends a confirmation email to the volunteer after scanning the QR code.
        """
        try:
            # Load email template
            template = self.template_env.get_template("participation_confirmation.html")
            event_date = datetime.strptime(event_details['date'], "%Y-%m-%d").strftime("%B %d, %Y")
            event_time = event_details['time']

            # Render template with event details
            email_body = template.render(
                app_name=self.app_name,
                app_url=self.app_url,
                volunteer_name=volunteer_name,
                event_name=event_name,
                organization_name=event_details['organization'],
                event_date=event_date,
                event_time=event_time,
                venue=event_details['venue'],
                address=event_details['address'],
                contact_email=event_details['contact_email'],
                event_url=f"{self.app_url}/events/{event_details['event_id']}"
            )

            # Send email
            subject = f"{self.app_name}: Participation Confirmed - {event_name}"
            return self._send_email(
                to_email=volunteer_email,
                subject=subject,
                body=email_body
            )
        except Exception as e:
            logger.error(f"Failed to send participation confirmation: {str(e)}")
            return False