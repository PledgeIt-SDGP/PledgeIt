import os
import qrcode
from io import BytesIO
import smtplib
from email.message import EmailMessage
import logging

# Configure logging for this module
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter("[%(asctime)s] %(levelname)s - %(message)s")
    handler.setFormatter(formatter)
    logger.addHandler(handler)

# Load SMTP configuration from environment variables
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.example.com")
try:
    SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
except ValueError:
    SMTP_PORT = 587
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "your_username")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "your_password")
FROM_EMAIL = os.getenv("FROM_EMAIL", "no-reply@example.com")

# Validate SMTP configuration
if not all([SMTP_SERVER, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD, FROM_EMAIL]):
    logger.error("Incomplete SMTP configuration. Please set SMTP_SERVER, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD, and FROM_EMAIL.")
    raise ValueError("Incomplete SMTP configuration in environment variables.")

def generate_qr_code(data: str) -> BytesIO:
    """
    Generates a QR code image for the provided data.
    
    Args:
        data (str): The data to be encoded in the QR code (e.g., "EventID:12345").
        
    Returns:
        BytesIO: In-memory binary stream containing the PNG image.
    """
    try:
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4
        )
        qr.add_data(data)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        buf = BytesIO()
        img.save(buf, format="PNG")
        buf.seek(0)
        logger.info("QR code generated successfully for data: %s", data)
        return buf
    except Exception as e:
        logger.error("Error generating QR code for data %s: %s", data, str(e))
        raise

def send_email_with_qr(recipient: str, subject: str, html_content: str, qr_buffer: BytesIO):
    """
    Sends an email with a QR code attachment.
    
    Args:
        recipient (str): Recipient's email address.
        subject (str): Email subject.
        html_content (str): HTML formatted email body.
        qr_buffer (BytesIO): The QR code image in a BytesIO stream.
    """
    try:
        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"] = FROM_EMAIL
        msg["To"] = recipient

        # Set plain text content as a fallback
        msg.set_content("This email contains a QR code attachment. Please view it using an HTML compatible email client.")
        msg.add_alternative(html_content, subtype="html")

        # Attach the QR code image
        qr_data = qr_buffer.read()
        msg.add_attachment(qr_data, maintype="image", subtype="png", filename="qr_code.png")
        logger.info("Attached QR code for recipient: %s", recipient)

        # Send the email over a secure connection
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)
        logger.info("Email sent successfully to: %s", recipient)
    except Exception as e:
        logger.error("Error sending email to %s: %s", recipient, str(e))
        raise

def send_event_qr_to_organization(event_id: int, organization_email: str):
    """
    Generates a unique QR code for an event and sends it to the organization's email address.
    
    Args:
        event_id (int): Unique identifier for the event.
        organization_email (str): Email address of the organization.
    """
    try:
        # Generate QR code data. Customize payload as needed.
        qr_data = f"EventID:{event_id}"
        qr_buffer = generate_qr_code(qr_data)

        subject = f"QR Code for Your Event (ID: {event_id})"
        html_content = f"""
        <html>
          <body style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #2a7ae2;">Event QR Code</h2>
            <p>Dear Organization,</p>
            <p>Your event (ID: {event_id}) has been successfully created. Please find attached your unique QR code for attendance tracking.</p>
            <p>Please keep this QR code safe and use it during event check-ins.</p>
            <p>Thank you,</p>
            <p><strong>PledgeIt Team</strong></p>
          </body>
        </html>
        """
        send_email_with_qr(organization_email, subject, html_content, qr_buffer)
    except Exception as e:
        logger.error("Failed to send event QR code to organization: %s", str(e))
        raise

def send_event_qr_to_volunteer(event_id: int, volunteer_email: str):
    """
    Generates a unique QR code for an event and sends it to the volunteer's email address.
    
    Args:
        event_id (int): Unique identifier for the event.
        volunteer_email (str): Email address of the volunteer.
    """
    try:
        # Generate QR code data. You can include volunteer-specific info if desired.
        qr_data = f"EventID:{event_id}"
        qr_buffer = generate_qr_code(qr_data)

        subject = f"Your Attendance QR Code for Event ID: {event_id}"
        html_content = f"""
        <html>
          <body style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #2a7ae2;">Event Attendance QR Code</h2>
            <p>Dear Volunteer,</p>
            <p>You have successfully registered for the event (ID: {event_id}). Please find your unique QR code attached.</p>
            <p>Present this QR code at the event for attendance verification.</p>
            <p>Thank you for your commitment and participation!</p>
            <p>Best Regards,</p>
            <p><strong>PledgeIt Team</strong></p>
          </body>
        </html>
        """
        send_email_with_qr(volunteer_email, subject, html_content, qr_buffer)
    except Exception as e:
        logger.error("Failed to send event QR code to volunteer: %s", str(e))
        raise
