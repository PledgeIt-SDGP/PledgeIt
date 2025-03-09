import os
import qrcode
from io import BytesIO
import smtplib
from email.message import EmailMessage
import logging
import json

# Import the events_collection so we can fetch event details if needed
from database import events_collection

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

def send_email_with_qr(recipient: str, subject: str, html_content: str, qr_buffer: BytesIO):
    """
    Sends an email with the QR code attached as a file named 'qr_code.png'.
    
    Args:
        recipient (str): The recipient's email address.
        subject (str): The subject line of the email.
        html_content (str): The HTML body of the email.
        qr_buffer (BytesIO): The QR code image in a BytesIO stream.
    """
    try:
        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"] = FROM_EMAIL
        msg["To"] = recipient

        # Provide a fallback text-only content
        msg.set_content("This email contains a QR code attachment. Please view it using an HTML compatible email client.")
        # Add the HTML part
        msg.add_alternative(html_content, subtype="html")

        # Attach the QR code image
        qr_data = qr_buffer.read()
        msg.add_attachment(qr_data, maintype="image", subtype="png", filename="qr_code.png")
        logger.info("Attached QR code as 'qr_code.png' for recipient: %s", recipient)

        # Send the email over a secure connection
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)
        logger.info("Email sent successfully to: %s", recipient)
    except Exception as e:
        logger.error("Error sending email to %s: %s", recipient, str(e))
        raise

def send_event_qr_to_organization(event_id: int, organization_email: str, event_details: dict = None):
    """
    Fetches or uses provided event details, generates a JSON payload (including a redirect_url),
    creates a QR code from it, and sends it as an attached PNG file 
    to the organization's email.
    
    Args:
        event_id (int): Unique identifier for the event.
        organization_email (str): Email address of the organization.
        event_details (dict, optional): Event details, if already available.
            If None, function fetches the event details from MongoDB.
    """
    try:
        # If no event_details are provided, fetch from the database
        if event_details is None:
            event_details = events_collection.find_one({"event_id": event_id})
            if event_details is None:
                # If not found, store minimal data
                event_details = {"event_id": event_id}

        # Add a redirect_url field so scanning the QR can open the detail page
        redirect_url = f"https://pledgeit.com/events/{event_id}"
        event_details["redirect_url"] = redirect_url

        # --- NEW FEATURE: Add QR code expiration date (one day after the event) ---
        if "date" in event_details and "time" in event_details:
            try:
                from datetime import datetime, timedelta
                # Try parsing assuming time is stored as HH:MM:SS; if not, try appending seconds
                try:
                    event_dt = datetime.strptime(f"{event_details['date']} {event_details['time']}", "%Y-%m-%d %H:%M:%S")
                except Exception:
                    event_dt = datetime.strptime(f"{event_details['date']} {event_details['time']}:00", "%Y-%m-%d %H:%M:%S")
                expiration_dt = event_dt + timedelta(days=1)
                event_details["qr_expiration"] = expiration_dt.isoformat()
            except Exception as exp:
                logger.warning("Could not compute QR expiration for event_id %s: %s", event_id, str(exp))
        # --- End new feature ---

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
        # Attach and send the QR
        send_email_with_qr(organization_email, subject, html_content, qr_buffer)
    except Exception as e:
        logger.error("Failed to send event QR code to organization: %s", str(e))
        raise

def send_event_qr_to_volunteer(event_id: int, volunteer_email: str, event_details: dict = None):
    """
    Fetches or uses provided event details, generates a JSON payload (including a redirect_url),
    creates a QR code from it, and sends it as an attached PNG file 
    to the volunteer's email.
    
    Args:
        event_id (int): Unique identifier for the event.
        volunteer_email (str): Email address of the volunteer.
        event_details (dict, optional): Event details, if already available.
            If None, function fetches the event details from MongoDB.
    """
    try:
        # If no event_details are provided, fetch from the database
        if event_details is None:
            event_details = events_collection.find_one({"event_id": event_id})
            if event_details is None:
                # If not found, store minimal data
                event_details = {"event_id": event_id}

        # Add a redirect_url field so scanning the QR can open the detail page
        redirect_url = f"https://pledgeit.com/events/{event_id}"
        event_details["redirect_url"] = redirect_url

        # --- NEW FEATURE: Add QR code expiration date (one day after the event) ---
        if "date" in event_details and "time" in event_details:
            try:
                from datetime import datetime, timedelta
                try:
                    event_dt = datetime.strptime(f"{event_details['date']} {event_details['time']}", "%Y-%m-%d %H:%M:%S")
                except Exception:
                    event_dt = datetime.strptime(f"{event_details['date']} {event_details['time']}:00", "%Y-%m-%d %H:%M:%S")
                expiration_dt = event_dt + timedelta(days=1)
                event_details["qr_expiration"] = expiration_dt.isoformat()
            except Exception as exp:
                logger.warning("Could not compute QR expiration for event_id %s: %s", event_id, str(exp))
        # --- End new feature ---

        # Convert event_details to JSON string
        qr_data = json.dumps(event_details, default=str)
        qr_buffer = generate_qr_code(qr_data)

        subject = f"Your PledgeIt Attendance QR Code (Event ID {event_id})"
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
                  <h2 style="color:#D32F2F; text-align:center;">Attendance QR Code</h2>
                  <p style="color:#333333; font-size:16px;">
                    Dear Volunteer,<br><br>
                    You have successfully registered for the event (ID: <strong>{event_id}</strong>) on <span style="color:#D32F2F;">PledgeIt</span>.
                    Please find attached your unique QR code for attendance verification.
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
                    Please present this QR code upon arrival for attendance verification.
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
        # Attach and send the QR
        send_email_with_qr(volunteer_email, subject, html_content, qr_buffer)
    except Exception as e:
        logger.error("Failed to send event QR code to volunteer: %s", str(e))
        raise
