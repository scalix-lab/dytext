import frappe
import pyotp
from dytext.aggregate.email.email import send_otp_email
from frappe.twofactor import (
    get_otpsecret_for_,
)

# Emails for automated testing that bypass OTP Verification
# NOTE: Make sure to add emails that don't exist.
BYPASS_OTP = [
    "info@dytext.com",
    "test@dytext.com",
    "test22@org.com",
    "test24@org.com",
    "test25@org.com",
    "test@scalix.in"
]

BYPASS_OTP_CODES = [
    "000000",
]


def authenticate_for_2factor(email, state, type_of_otp):
    """Authenticate two factor for enabled user before login."""
    otp_secret = get_otpsecret_for_(email)
    token = int(pyotp.TOTP(otp_secret, digits=4).now())
    tmp_id = frappe.generate_hash(length=8)

    cache_2fa_data(email, token, otp_secret, tmp_id, state)
    verification_obj = process_2fa_for_email(
        email, token, otp_secret, type_of_otp
    )

    # Save data in local
    frappe.local.response["verification"] = verification_obj
    frappe.local.response["tmp_id"] = tmp_id


def process_2fa_for_email(email, token, otp_secret, type_of_otp):
    """Process email method for 2fa."""
    status = True
    
    if email in BYPASS_OTP:
        frappe.logger().info(f"Bypassing OTP for {email}")
        status = True
    else:
        status = send_otp_email(
            otp_secret, token, email, type_of_otp
        ) or True

    return {
        "token_delivery": status,
        "prompt": status
        and "Enter verification code sent to {}".format(
            email[:2]
            + "******"
            + email[email.find("@") - 2 : email.find("@")]
            + email[email.find("@") :]
        ),
        "method": "Email",
        "setup": status,
    }


def cache_2fa_data(email, token, otp_secret, tmp_id, state):
    """Cache and set expiry for data."""
    pwd = frappe.form_dict.get("pwd")

    expiry_time = frappe.flags.token_expiry or 300
    frappe.cache.set(tmp_id + "_token", token)
    frappe.cache.expire(tmp_id + "_token", expiry_time)
    

    cache_data = {
        "_email": email,
        "_pwd": pwd,
        "_otp_secret": otp_secret,
        "_state": state if state else "",
    }

    for k, v in cache_data.items():
        frappe.cache.set(f"{tmp_id}{k}", v)
        frappe.cache.expire(f"{tmp_id}{k}", expiry_time)


def generate_user_token(user, oauth_client,type_of_otp):
    # create oauth_bearer_token
    if type_of_otp == "signup":
        project_doc = frappe.get_doc({
            "doctype": "Dytext Project",            
            "project_name": "My First Project",
            "user": user
        })
        project_doc.insert(ignore_permissions=True)
        
        
    if type_of_otp == "login":
        project = frappe.db.get_value("Dytext Project", {"user":user},["name","project_client_token"])
        
    token_doc = frappe.new_doc("OAuth Bearer Token")
    token_doc.user = user
    token_doc.client = oauth_client
    token_doc.access_token = frappe.generate_hash(length=30)
    token_doc.refresh_token = frappe.generate_hash(length=30)
    token_doc.expires_in = 3600 * 24
    token_doc.scopes = "openid all"
    token_doc.insert(ignore_permissions=True)

    token_dict = frappe._dict(
        {
            "access_token": token_doc.access_token,
            "token_type": "Bearer",
            "expires_in": token_doc.expires_in,
            "refresh_token": token_doc.refresh_token,
            "project_id": project_doc.name if type_of_otp == "signup" else project[0],
            "project_client_token": project_doc.project_client_token if type_of_otp == "signup" else project[1],
            "email": user,
        }
    )

    frappe.local.response = token_dict

    frappe.db.commit()
