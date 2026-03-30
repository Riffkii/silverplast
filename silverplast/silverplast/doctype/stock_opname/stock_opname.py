# Copyright (c) 2026, P79 and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class StockOpname(Document):
  def validate(self):
    self.selisih = self.qty_actual - self.qty_sistem
    
# 	pass
