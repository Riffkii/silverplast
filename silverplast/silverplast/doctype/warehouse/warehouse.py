# Copyright (c) 2026, P79 and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Warehouse(Document):
	def validate(self):
		# Pastikan nama warehouse tidak duplikat
		existing = frappe.db.exists(
				"Warehouse",
				{"warehouse_name": self.warehouse_name, "name": ("!=", self.name)}
		)
		if existing:
				frappe.throw(f"Warehouse '{self.warehouse_name}' sudah ada.")

