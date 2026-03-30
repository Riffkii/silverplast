import frappe
from frappe.model.document import Document

class StockEntry(Document):

    def validate(self):
        if self.entry_type == "Pindah Gudang":
            if self.from_warehouse == self.to_warehouse:
                frappe.throw("From Warehouse dan To Warehouse tidak boleh sama.")

        if not self.qty or self.qty <= 0:
            frappe.throw("QTY harus lebih dari 0.")

    def on_submit(self):
        frappe.logger().info(
            f"Stock Entry {self.name} submitted: {self.entry_type} | "
            f"Item: {self.item} | QTY: {self.qty}"
        )