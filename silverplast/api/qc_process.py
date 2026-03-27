import frappe

@frappe.whitelist()
def create_qc_process(incoming_qc):
    source = frappe.get_doc("Incoming QC", incoming_qc)

    qc = frappe.get_doc({
        "doctype": "QC Process",
        "source_incoming_qc": source.name,
        "item_code": source.item_code,
        "qty": source.qty_received,
        "remarks": source.remarks,
        "qc_result": "Pending"
    })

    qc.insert(ignore_permissions=True)

    return qc.name