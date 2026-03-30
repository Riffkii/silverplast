import frappe

def on_stock_entry_submit(doc, method):
  frappe.logger().info(
    f"[Hook] Stock Entry submitted: {doc.name} | Type: {doc.entry_type}"
  )
