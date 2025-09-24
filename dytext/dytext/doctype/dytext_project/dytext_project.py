# Copyright (c) 2025, Scalix and contributors
# For license information, please see license.txt

import frappe, secrets
from frappe.model.document import Document

class DytextProject(Document):
    
    def before_insert(self):
        """
        This runs automatically before the document is inserted.
        It will generate a Dytext client token if it doesn't exist.
        """
        if not self.dytext_client_token:
            self.dytext_client_token = secrets.token_hex(32)
