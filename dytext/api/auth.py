import frappe
from dytext.aggregate.auth.login import send_otp_email, verify_email_otp

@frappe.whitelist(methods=["POST", "GET"], allow_guest=True)
def send_otp(
    email,
    recaptcha_response=None,
    type_of_otp="login",  # noqa E501
):  # noqa E501
    return send_otp_email(
        email=email,
        recaptcha_response=recaptcha_response,
        type_of_otp=type_of_otp,
    )

@frappe.whitelist(allow_guest=True)
def check():
    return "ok"

@frappe.whitelist(allow_guest=True)
def verify_otp(email, otp, temp_id):
    return verify_email_otp(
        email=email,
        otp=otp,
        temp_id=temp_id,
    )  # noqa E501

