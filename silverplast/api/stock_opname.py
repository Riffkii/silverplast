import frappe

@frappe.whitelist()
def get_stock_qty(item_code, warehouse):
  qty = frappe.db.get_value(
      "Bin",
      {"item_code": item_code, "warehouse": warehouse},
      "actual_qty"
  ) or 0
  return qty
