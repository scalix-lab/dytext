import frappe

def before_insert_user(doc, method):
    """Automatically assign default role when a new user is created."""
    default_role = "Dytext User"

    # Ensure role exists
    if not frappe.db.exists("Role", default_role):
        frappe.throw(f"Role {default_role} does not exist. Please create it first.")

    # Assign role
    doc.append("roles", {"role": default_role})