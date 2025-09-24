import frappe, secrets,json
from frappe import _

@frappe.whitelist(allow_guest=True)
def get_project_data(client_token, model_name='*'):
    project_name = frappe.get_value("Dytext Project", {"project_client_token": client_token}, "name")
    if not project_name:
        frappe.throw(_("Invalid Client Token"), frappe.PermissionError)

    model_filters = {"project": project_name}
    if model_name != "*" and model_name:
        model_filters["model_name"] = model_name

    models = {}

    for m in frappe.get_all("Dytext Model", filters=model_filters, fields=["name", "model_name"]):
        fields_def = frappe.get_all(
            "Dytext Model Defination",
            filters={"model": m.name},
            fields=["field_name", "key"]
        )

        raw_data = frappe.get_all(
            "Dytext Model Data",
            filters={"model": m.name},
            fields=["name", "value"]
        )

        fields_list = []
        for row in raw_data:
            try:
                row_value = json.loads(row.value) if row.value else {}
            except Exception:
                row_value = {"value": row.value}

            field_obj = {}
            for f in fields_def:
                field_obj[f["key"]] = {
                    "value": row_value.get(f["key"], None)
                }
            fields_list.append(field_obj)

        models[m.model_name] = {
            "name": m.model_name,
            "fields": fields_list
        }
        
    return models


@frappe.whitelist(allow_guest=True)
def regenerate_client_token(client_token):
    doc_name = frappe.get_value("Dytext Project", {"dytext_client_token": client_token}, "name")
    if not doc_name:
        frappe.throw(f"Dytext Project with token '{client_token}' not found")

    doc = frappe.get_doc("Dytext Project", doc_name)
    doc.dytext_client_token = secrets.token_hex(32)
    doc.save()

    return doc.dytext_client_token

@frappe.whitelist(allow_guest=True)
def create_model(client_token, model_name, description=None, tag=None):
    project_name = frappe.get_value("Dytext Project", {"project_client_token": client_token}, "name")
    if not project_name:
        frappe.throw(_("Dytext Project with token '{0}' not found").format(client_token))

    existing_model = frappe.get_value("Dytext Model", {"project": project_name, "model_name": model_name})
    if existing_model:
        return {"message": "Model already exists"}

    model_doc = frappe.get_doc({
        "doctype": "Dytext Model",
        "project": project_name,
        "model_name": model_name,
        "description": description,
        "tag": tag
    })
    model_doc.insert()
    
    return {
        "model_name": model_doc.model_name,
        "project": project_name,
        "description": model_doc.description,
        "tag": model_doc.tag,
        "message": "Model created successfully"
    }   

@frappe.whitelist(allow_guest=True)
def create_model_definition(client_token, model_name, field_name, field_type, key):
    project_name = frappe.get_value("Dytext Project", {"project_client_token": client_token}, "name")
    if not project_name:
        frappe.throw(_("Invalid project token"))

    model_doc = frappe.get_doc("Dytext Model", {"project": project_name, "model_name": model_name})
    if not model_doc:
        frappe.throw(_("Model '{0}' not found in project '{1}'").format(model_name, project_name))

    existing_keys = {f.key for f in frappe.get_all("Dytext Model Defination", filters={"model": model_doc.name}, fields=["key"])}
    if key in existing_keys:
        frappe.throw(_("Field key '{0}' already exists for model '{1}'").format(key, model_name))

    field_doc = frappe.get_doc({
        "doctype": "Dytext Model Defination",
        "model": model_doc.name,
        "field_name": field_name,
        "type": field_type,
        "key": key
    })
    field_doc.insert()

    return {
        "model": model_name,
        "field_name": field_name,
        "type": field_type,
        "key": key,
        "message": _("Field added successfully")
    }

@frappe.whitelist(allow_guest=True)
def create_model_data(client_token, model_name, data):
    project_name = frappe.get_value("Dytext Project", {"project_client_token": client_token}, "name")
    if not project_name:
        frappe.throw(_("Invalid project token"))

    model_doc = frappe.get_doc("Dytext Model", {"project": project_name, "model_name": model_name})
    if not model_doc:
        frappe.throw(_("Model '{0}' not found in project '{1}'").format(model_name, project_name))

    if isinstance(data, str):
        try:
            data = json.loads(data)
        except Exception:
            frappe.throw(_("Invalid JSON format for data"))

    if not isinstance(data, dict):
        frappe.throw(_("Data must be a JSON object"))

    allowed_fields = {f.key for f in frappe.get_all("Dytext Model Defination", filters={"model": model_doc.name}, fields=["key"])}

    for key in data.keys():
        if key not in allowed_fields:
            frappe.throw(_("Field '{0}' is not defined in model '{1}'").format(key, model_name))

    data_doc = frappe.get_doc({
        "doctype": "Dytext Model Data",
        "model": model_doc.name,
        "value": json.dumps(data)
    })
    data_doc.insert()

    return {
        "message": _("Data inserted successfully"),
        "model": model_name,
        "data_id": data_doc.name,
        "data": data
    }
