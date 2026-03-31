// Copyright (c) 2026, P79 and contributors
// For license information, please see license.txt

// frappe.ui.form.on("QC Process", {
// 	refresh(frm) {

// 	},
// });

frappe.ui.form.on('QC Process', {
    refresh: function(frm) {

        if (frm.doc.qc_result === "Pending") {

            frm.add_custom_button('Pass', function() {

                frappe.call({
                    method: 'silverplast.api.qc_process.qc_pass',
                    args: {
                        qc_name: frm.doc.name
                    },
                    callback: function(r) {
                        if (r.message) {
                            frappe.set_route('Form', 'Stock Receipt Document', r.message);
                        }
                    }
                });

            }).addClass("btn-success");

            frm.add_custom_button('Reject', function() {

                frappe.call({
                    method: 'silverplast.api.qc_process.qc_reject',
                    args: {
                        qc_name: frm.doc.name
                    },
                    callback: function() {
                        frappe.msgprint("QC Rejected");
                        frm.reload_doc();
                    }
                });

            }).addClass("btn-danger");
        }
    }
});