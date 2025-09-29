import frappe
import pyotp

DEFAULT_AUTH_EMAIL_SENDER = "noreply@scalix.in"

EMAIL_TEMPLATES = {
    "signup": {
        "template_name": "signup_otp",
    },
    "login": {
        "template_name": "login_otp",
    },
}


def send_otp_email(otpsecret, token, email, type_of_otp):
    email_template = frappe.get_doc(
        "Email Template", EMAIL_TEMPLATES.get(type_of_otp).get("template_name")
    )
    hotp = pyotp.HOTP(otpsecret)
    otp = hotp.at(int(token))

    if not email_template:
        frappe.throw(
            f"Email template for type '{type_of_otp}' not found.",
            title="Email Template Not Found",
        )

    args = {
        "otp": otp,
        "base_url": frappe.utils.get_url(),
        "year": frappe.utils.datetime.datetime.now().year,
    }

    message = frappe.render_template(email_template.response_, args)
    subject = frappe.render_template(email_template.subject, args)

    frappe.log_error("DEBUG: GENERATED OTP ", otp)

    frappe.enqueue(
        sender=DEFAULT_AUTH_EMAIL_SENDER,
        method=frappe.sendmail,
        queue="short",
        recipients=[email],
        subject=subject,
        message=message,
        delayed=False,
    )
