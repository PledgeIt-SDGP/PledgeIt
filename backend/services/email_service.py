import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
from fastapi import HTTPException
import logging
from datetime import datetime
from typing import Optional, Dict

# Load environment variables
load_dotenv()

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER")
        self.smtp_port = int(os.getenv("SMTP_PORT", 2525))
        self.smtp_username = os.getenv("SMTP_USERNAME")
        self.smtp_password = os.getenv("SMTP_PASSWORD")
        self.sender_email = os.getenv("SENDER_EMAIL")
        self.sender_name = os.getenv("SENDER_NAME")
        self.app_name = os.getenv("APP_NAME")

    def _create_message(
        self,
        recipient: str,
        subject: str,
        body: str,
        is_html: bool = False,
        recipient_name: Optional[str] = None
    ) -> MIMEMultipart:
        """Create email message with proper headers"""
        message = MIMEMultipart()
        message["From"] = f"{self.sender_name} <{self.sender_email}>"
        message["To"] = f"{recipient_name} <{recipient}>" if recipient_name else recipient
        message["Subject"] = subject

        # Attach the body
        content_type = "html" if is_html else "plain"
        message.attach(MIMEText(body, content_type))
        return message

    def send_email(
        self,
        recipient: str,
        subject: str,
        body: str,
        is_html: bool = False,
        recipient_name: Optional[str] = None
    ) -> bool:
        """Send email using SMTP"""
        try:
            # Create message
            msg = self._create_message(recipient, subject, body, is_html, recipient_name)
            
            # Connect and send
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
            
            return True
        except Exception as e:
            logging.error(f"Failed to send email: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="Failed to send email. Please try again later."
            )

    # Example email methods
    def send_welcome_email(self, recipient: str, name: str):
        """Send welcome email template"""
        subject = f"Welcome to {self.app_name}, {name}!"
        body = f"""
        <html>
            <body>
                <h2>Welcome to {self.app_name}!</h2>
                <p>Dear {name},</p>
                <p>Thank you for joining {self.app_name}. We're excited to have you on board!</p>
                <p>Start exploring volunteering opportunities today.</p>
                <p>Best regards,<br>{self.sender_name}</p>
            </body>
        </html>
        """
        return self.send_email(recipient, subject, body, is_html=True, recipient_name=name)

    def send_test_email(self, recipient: str = "saparamadusukhitha@gmail.com"):
        """Send a test email (like your example)"""
        subject = "Hi Mailtrap - Test Email"
        body = "This is a test e-mail message from PledgeIt."
        return self.send_email(recipient, subject, body)