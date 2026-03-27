import frappe

def create_incoming_qc(doc, method):
    frappe.get_doc({
        "doctype": "Incoming QC",
        "source_receipt": doc.name,
        "item_code": doc.item_code,
        "qty_received": doc.qty_received,
        "posting_date": doc.posting_date,
        "remarks": doc.remarks
    }).insert(ignore_permissions=True)