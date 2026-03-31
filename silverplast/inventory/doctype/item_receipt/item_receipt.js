// Copyright (c) 2026, P79 and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Item Receipt", {
// 	refresh(frm) {

// 	},
// });

frappe.ui.form.on('Item Receipt', {

    onload: function(frm) {
        toggle_backdate_field(frm);
    },

    refresh: function(frm) {
        toggle_backdate_field(frm);
    },

    posting_date: function(frm) {
        toggle_backdate_field(frm);
    }
});

function toggle_backdate_field(frm) {

    let posting_date = frm.doc.posting_date;
    let today = frappe.datetime.get_today();

    if (!posting_date) {
        frm.set_df_property('backdate_reason', 'hidden', 1);
        frm.set_df_property('backdate_reason', 'reqd', 0);
        frm.set_value('backdate_reason', '');
        return;
    }

    if (posting_date < today) {
        frm.set_df_property('backdate_reason', 'hidden', 0);
        frm.set_df_property('backdate_reason', 'reqd', 1);

    } else {
        frm.set_df_property('backdate_reason', 'hidden', 1);
        frm.set_df_property('backdate_reason', 'reqd', 0);
        frm.set_value('backdate_reason', '');
    }
}