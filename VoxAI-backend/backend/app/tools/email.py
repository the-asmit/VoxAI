import os
import asyncio
import smtplib
from email.message import EmailMessage


def _send_email_sync(to_email: str, subject: str, body: str, attachment_path: str | None = None):
    msg = EmailMessage()
    msg["From"] = os.getenv("SMTP_SENDER")
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.set_content(body)

    if attachment_path:
        with open(attachment_path, "rb") as f:
            data = f.read()
            msg.add_attachment(
                data,
                maintype="application",
                subtype="pdf",
                filename=os.path.basename(attachment_path)
            )

    # Single context manager - auto-closes connection on exit
    with smtplib.SMTP(os.getenv("SMTP_HOST"), int(os.getenv("SMTP_PORT"))) as server:
        server.starttls()
        server.login(
            os.getenv("SMTP_USERNAME"),
            os.getenv("SMTP_PASSWORD")
        )
        server.send_message(msg)


async def send_email_async(
    to_email: str,
    subject: str,
    body: str,
    attachment_path: str | None = None
):
    await asyncio.to_thread(
        _send_email_sync,
        to_email,
        subject,
        body,
        attachment_path
    )
