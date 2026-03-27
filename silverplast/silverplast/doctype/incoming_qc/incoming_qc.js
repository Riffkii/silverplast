// Copyright (c) 2026, P79 and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Incoming QC", {
// 	refresh(frm) {

// 	},
// });


frappe.ui.form.on('Incoming QC', {
    refresh: function(frm) {
        frm.add_custom_button('Create QC', function() {

            frappe.call({
                method: 'silverplast.api.qc_process.create_qc_process',
                args: {
                    incoming_qc: frm.doc.name
                },
                callback: function(r) {
                    if (r.message) {
                        frappe.set_route('Form', 'QC Process', r.message);
                    }
                }
            });

        });
    }
});