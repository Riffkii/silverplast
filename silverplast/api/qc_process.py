import frappe

@frappe.whitelist()
def create_qc_process(incoming_qc):
    source = frappe.get_doc("Incoming QC", incoming_qc)

    if frappe.db.exists("QC Process", {"source_incoming_qc": source.name}):
        frappe.throw("QC Process sudah dibuat untuk data ini")

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

@frappe.whitelist()
def qc_pass(qc_name):
    qc = frappe.get_doc("QC Process", qc_name)

    if qc.qc_result != "Pending":
        frappe.throw("QC sudah diproses")

    qc.qc_result = "Pass"
    qc.save(ignore_permissions=True)

    doc = frappe.get_doc({
        "doctype": "Stock Receipt Document",
        "source_qc": qc.name,
        "item_code": qc.item_code,
        "qty": qc.qty
    })

    doc.insert(ignore_permissions=True)

    return doc.name

@frappe.whitelist()
def qc_reject(qc_name):
    qc = frappe.get_doc("QC Process", qc_name)

    if qc.qc_result != "Pending":
        frappe.throw("QC sudah diproses")

    qc.qc_result = "Reject"
    qc.save(ignore_permissions=True)