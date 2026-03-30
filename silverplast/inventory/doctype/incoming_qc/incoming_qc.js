// Copyright (c) 2026, P79 and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Incoming QC", {
// 	refresh(frm) {

// 	},
// });

frappe.ui.form.on('Incoming QC', {
    refresh: function(frm) {

        if (!frm.doc.__islocal) {

            frappe.call({
                method: 'frappe.client.get_list',
                args: {
                    doctype: 'QC Process',
                    filters: {
                        source_incoming_qc: frm.doc.name
                    },
                    limit_page_length: 1
                },
                callback: function(r) {
                    if (!r.message || r.message.length === 0) {

                        frm.add_custom_button('Create QC', function() {

                            frappe.call({
                                method: 'silverplast.api.qc_process.create_qc_process',
                                args: {
                                    incoming_qc: frm.doc.name
                                },
                                callback: function(res) {
                                    if (res.message) {
                                        frappe.set_route('Form', 'QC Process', res.message);
                                    }
                                }
                            });

                        });

                    }
                }
            });

        }
    }
});