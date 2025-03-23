import os
import qrcode
from io import BytesIO
import smtplib
from email.message import EmailMessage
import logging
import json
from datetime import datetime, timedelta

# Import the events_collection so we can fetch event details if needed
from database.database import events_collection

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
        data (str): The data to be encoded in the QR code (e.g., a JSON string with event details).
        
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

def send_email(recipient: str, subject: str, html_content: str, attachment: BytesIO = None, attachment_name: str = None):
    """
    Sends an email with optional attachment.
    
    Args:
        recipient (str): The recipient's email address.
        subject (str): The subject line of the email.
        html_content (str): The HTML body of the email.
        attachment (BytesIO, optional): The attachment as a BytesIO stream.
        attachment_name (str, optional): The name of the attachment file.
    """
    try:
        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"] = FROM_EMAIL
        msg["To"] = recipient

        # Provide a fallback text-only content
        msg.set_content("This email contains an HTML version. Please view it using an HTML compatible email client.")
        # Add the HTML part
        msg.add_alternative(html_content, subtype="html")

        # Attach the file if provided
        if attachment:
            attachment_data = attachment.read()
            msg.add_attachment(attachment_data, maintype="image", subtype="png", filename=attachment_name)
            logger.info(f"Attached {attachment_name} for recipient: {recipient}")

        # Send the email over a secure connection
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)
        logger.info(f"Email sent successfully to: {recipient}")
    except Exception as e:
        logger.error(f"Error sending email to {recipient}: {str(e)}")
        raise

def send_event_qr_to_organization(event_id: int, organization_email: str, event_details: dict):
    """
    Sends an email to the organization with event details and a QR code.
    
    Args:
        event_id (int): Unique identifier for the event.
        organization_email (str): Email address of the organization.
        event_details (dict): Event details.
    """
    try:
        # Add a redirect_url field so scanning the QR can open the detail page
        redirect_url = f"https://pledgeit.com/events/{event_id}"
        event_details["redirect_url"] = redirect_url

        # Add QR code expiration date (one day after the event)
        if "date" in event_details and "time" in event_details:
            try:
                event_dt = datetime.strptime(f"{event_details['date']} {event_details['time']}", "%Y-%m-%d %H:%M:%S")
                expiration_dt = event_dt + timedelta(days=1)
                event_details["qr_expiration"] = expiration_dt.isoformat()
            except Exception as exp:
                logger.warning(f"Could not compute QR expiration for event_id {event_id}: {str(exp)}")

        # Convert event_details to JSON string
        qr_data = json.dumps(event_details, default=str)
        qr_buffer = generate_qr_code(qr_data)

        subject = f"Your PledgeIt Event QR Code (Event ID {event_id})"
        html_content = f"""
        <html>
          <body style="margin:0; padding:0; background-color:#F7F7F7;">
            <table align="center" width="600" style="border-collapse:collapse; background-color:#ffffff; font-family:Arial, sans-serif;">
              <tr>
                <td style="background-color:#000; padding:20px; text-align:center;">
                  <span style="color:#fff; font-size:24px; font-weight:bold;">PledgeIt</span>
                </td>
              </tr>
              <tr>
                <td style="padding:30px;">
                  <h2 style="color:#D32F2F; text-align:center;">Event QR Code</h2>
                  <p style="color:#333333; font-size:16px;">
                    Dear Organization,<br><br>
                    Your event (ID: <strong>{event_id}</strong>) has been successfully created on <span style="color:#D32F2F;">PledgeIt</span>.
                    Please find attached your unique QR code for attendance tracking.
                  </p>
                  <table style="width:100%; margin:20px 0; font-size:14px;">
                    <tr>
                      <td style="padding:8px; border:1px solid #dddddd;"><strong>Event ID:</strong></td>
                      <td style="padding:8px; border:1px solid #dddddd;">{event_details.get("event_id", event_id)}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px; border:1px solid #dddddd;"><strong>Event Name:</strong></td>
                      <td style="padding:8px; border:1px solid #dddddd;">{event_details.get("event_name", "N/A")}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px; border:1px solid #dddddd;"><strong>Date:</strong></td>
                      <td style="padding:8px; border:1px solid #dddddd;">{event_details.get("date", "N/A")}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px; border:1px solid #dddddd;"><strong>Time:</strong></td>
                      <td style="padding:8px; border:1px solid #dddddd;">{event_details.get("time", "N/A")}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px; border:1px solid #dddddd;"><strong>Venue:</strong></td>
                      <td style="padding:8px; border:1px solid #dddddd;">{event_details.get("venue", "N/A")}</td>
                    </tr>
                  </table>
                  <p style="color:#333333; font-size:16px; text-align:center;">
                    Please keep this QR code safe. It will be used for tracking event attendance.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="background-color:#000; padding:15px; text-align:center;">
                  <p style="margin:0; color:#fff; font-size:12px;">&copy; 2025 PledgeIt. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </body>
        </html>
        """
        # Send the email with the QR code
        send_email(organization_email, subject, html_content, qr_buffer, "event_qr_code.png")
    except Exception as e:
        logger.error(f"Failed to send event QR code to organization: {str(e)}")
        raise

def mark_volunteer_participation(event_id: int, volunteer_email: str):
    """
    Marks a volunteer's participation for an event and sends a confirmation email.
    
    Args:
        event_id (int): The event ID.
        volunteer_email (str): The volunteer's email.
    """
    try:
        # Update the participation status in the database
        events_collection.update_one(
            {"event_id": event_id, "volunteers.email": volunteer_email},
            {"$set": {"volunteers.$.participation_status": "Attended"}}
        )
        logger.info(f"Volunteer {volunteer_email} marked as attended for event {event_id}.")

        # Fetch event details
        event_details = events_collection.find_one({"event_id": event_id})
        if not event_details:
            raise ValueError(f"Event {event_id} not found.")

        # Send confirmation email to the volunteer
        subject = f"Participation Confirmation for Event ID {event_id}"
        html_content = f"""
        <html>
          <body style="margin:0; padding:0; background-color:#F7F7F7;">
            <table align="center" width="600" style="border-collapse:collapse; background-color:#ffffff; font-family:Arial, sans-serif;">
              <tr>
                <td style="background-color:#000; padding:20px; text-align:center;">
                  <span style="color:#fff; font-size:24px; font-weight:bold;">PledgeIt</span>
                </td>
              </tr>
              <tr>
                <td style="padding:30px;">
                  <h2 style="color:#D32F2F; text-align:center;">Participation Confirmed</h2>
                  <p style="color:#333333; font-size:16px;">
                    Dear Volunteer,<br><br>
                    Your participation for the event (ID: <strong>{event_id}</strong>) has been successfully recorded.
                  </p>
                  <table style="width:100%; margin:20px 0; font-size:14px;">
                    <tr>
                      <td style="padding:8px; border:1px solid #dddddd;"><strong>Event Name:</strong></td>
                      <td style="padding:8px; border:1px solid #dddddd;">{event_details.get("event_name", "N/A")}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px; border:1px solid #dddddd;"><strong>Date:</strong></td>
                      <td style="padding:8px; border:1px solid #dddddd;">{event_details.get("date", "N/A")}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px; border:1px solid #dddddd;"><strong>Time:</strong></td>
                      <td style="padding:8px; border:1px solid #dddddd;">{event_details.get("time", "N/A")}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px; border:1px solid #dddddd;"><strong>Venue:</strong></td>
                      <td style="padding:8px; border:1px solid #dddddd;">{event_details.get("venue", "N/A")}</td>
                    </tr>
                  </table>
                  <p style="color:#333333; font-size:16px; text-align:center;">
                    Thank you for participating!
                  </p>
                </td>
              </tr>
              <tr>
                <td style="background-color:#000; padding:15px; text-align:center;">
                  <p style="margin:0; color:#fff; font-size:12px;">&copy; 2025 PledgeIt. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </body>
        </html>
        """
        send_email(volunteer_email, subject, html_content)
    except Exception as e:
        logger.error(f"Failed to mark participation for volunteer {volunteer_email}: {str(e)}")
        raise