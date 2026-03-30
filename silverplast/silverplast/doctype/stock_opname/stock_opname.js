// Copyright (c) 2026, P79 and contributors
// For license information, please see license.txt

frappe.ui.form.on("Stock Opname", {
	item_code(frm) {
    if(frm.doc.item_code && frm.doc.warehouse){
      frappe.call({
        method: "silverplast.api.stock_opname.get_stock_qty",
        args: {
          item_code: frm.doc.item_code,
          warehouse: frm.doc.warehouse
        },
        callback(r) {
          frm.set_value("qty_sistem", r.message);
        }
      })
    }
	},
});
