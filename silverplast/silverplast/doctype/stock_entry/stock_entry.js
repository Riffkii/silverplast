frappe.ui.form.on("Stock Entry", {
  refresh(frm) {
    // Sembunyikan field To Warehouse jika bukan Pindah Gudang
    frm.toggle_display("to_warehouse",
        frm.doc.entry_type === "Pindah Gudang"
    );

    // Sembunyikan From Warehouse untuk tipe Produksi
    frm.toggle_display("from_warehouse",
        frm.doc.entry_type !== "Produksi"
    );
  },

  entry_type(frm) {
    frm.toggle_display("to_warehouse",
      frm.doc.entry_type === "Pindah Gudang"
    );
    frm.toggle_display("from_warehouse",
        frm.doc.entry_type !== "Produksi"
    );

    // Reset warehouse kalau type berubah
    frm.set_value("to_warehouse", "");
    frm.set_value("from_warehouse", "");
  }
});