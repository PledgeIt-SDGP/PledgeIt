import qrcode
import io
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from email.utils import formataddr
from pydantic import EmailStr, ValidationError

# SMTP and sender configuration from environment variables
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.example.com")
SMTP_PORT = os.getenv("SMTP_PORT", 587)
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "your_username")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "your_password")
FROM_EMAIL = os.getenv("FROM_EMAIL", "no-reply@example.com")
FROM_NAME = os.getenv("FROM_NAME", "PledgeIt Team")

def generate_qr_code(content: str) -> bytes:
    """
    Generates a QR code image in PNG format for the given content.
    Returns the image as bytes.
    """
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(content)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    img_bytes = io.BytesIO()
    img.save(img_bytes, format="PNG")
    return img_bytes.getvalue()

def send_email_with_qr(recipient: str, subject: str, html_body: str, qr_image_bytes: bytes, qr_cid: str = "qr_code"):
    """
    Sends an email with a QR code image embedded inline.
    The email is sent in a professional HTML format.
    """
    # Validate recipient email
    try:
        EmailStr.validate(recipient)
    except ValidationError:
        raise ValueError("Invalid recipient email address")
    
    # Create MIME message with related parts
    msg = MIMEMultipart("related")
    msg["Subject"] = subject
    msg["From"] = formataddr((FROM_NAME, FROM_EMAIL))
    msg["To"] = recipient
    
    # Create alternative part for HTML
    msg_alternative = MIMEMultipart("alternative")
    msg.attach(msg_alternative)

    # Attach HTML part and reference inline image by CID
    html_content = html_body.replace("{{qr_cid}}", qr_cid)
    msg_alternative.attach(MIMEText(html_content, "html"))

    # Attach QR code image inline
    image = MIMEImage(qr_image_bytes, name="qr_code.png")
    image.add_header("Content-ID", f"<{qr_cid}>")
    image.add_header("Content-Disposition", "inline", filename="qr_code.png")
    msg.attach(image)

    # Send email using SMTP server
    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.sendmail(FROM_EMAIL, recipient, msg.as_string())
    except Exception as e:
        raise Exception(f"Error sending email: {e}")


    
