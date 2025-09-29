from unittest import case
import frappe
import base64
import json

from frappe.twofactor import confirm_otp_token

from dytext.aggregate.auth.custom_two_factor import (
    authenticate_for_2factor,
    generate_user_token,
)
from dytext.aggregate.auth.custom_two_factor import BYPASS_OTP, BYPASS_OTP_CODES


def send_otp_email(
    email,
    recaptcha_response=None,
    type_of_otp="login",  # noqa E501
):  # noqa E501
    #  if recaptcha_response:
    state = json.dumps(
        {
            "type_of_otp": type_of_otp,
            "email": email,
        }
    )

    existing_user = validate_send_otp(email, type_of_otp)

    setattr(
        frappe.form_dict,
        "pwd",
        base64.b64encode(email.encode("utf-8")),
    )

    authenticate_for_2factor(email, state, type_of_otp)


def validate_send_otp(email, type_of_otp):
    existing_user = frappe.db.exists("User", email)

    match type_of_otp:
        case "login":
            if not existing_user:
                frappe.throw("User does not exist, please signup first.")

        case "signup":
            if existing_user:
                frappe.throw("User already exists")

        case _:
            frappe.throw("Invalid type of OTP requested")

    return existing_user


def verify_email_otp(email, otp, temp_id):
    user = frappe.cache.get(temp_id + "_email")
    state = json.loads(frappe.cache.get(temp_id + "_state"))
    if isinstance(user, bytes):
            user = user.decode("utf-8")
            
    settings = frappe.get_single("Dytext Settings")
    if not settings.default_oauth_client:
        frappe.throw("Default OAuth client not configured in Dytext Settings")
        
    if isinstance(user, bytes):
        user = user.decode("utf-8")
        
    if email in BYPASS_OTP or otp in BYPASS_OTP_CODES:
        pass
    elif not confirm_otp_token(frappe.local.login_manager, otp, temp_id):
        return False
    
    if state.get("type_of_otp") == "signup":
        user = frappe.get_doc(
            {
                "doctype": "User",
                "email": email,
                "first_name": email.split("@")[0],
                "enabled": 1,
            }
        )
        user.insert(ignore_permissions=True)
        user.save()
    return generate_user_token(user=email, oauth_client=settings.default_oauth_client,type_of_otp=state.get("type_of_otp"))