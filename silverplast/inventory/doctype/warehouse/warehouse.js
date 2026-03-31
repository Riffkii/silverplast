// Copyright (c) 2026, P79 and contributors
// For license information, please see license.txt

frappe.ui.form.on("Warehouse", {

    // ─────────────────────────────────────────────
    // Form dibuka / refresh
    // ─────────────────────────────────────────────

    refresh(frm) {
        // Tampilkan indikator status berwarna
        frm.trigger("set_status_indicator");

        // Tampilkan info kapasitas
        frm.trigger("show_capacity_info");

        // Tambah tombol aksi (hanya kalau bukan dokumen baru)
        if (!frm.is_new()) {
            frm.trigger("add_custom_buttons");
        }

        // Sesuaikan tampilan field berdasarkan level
        frm.trigger("toggle_fields_by_level");
    },

    // ─────────────────────────────────────────────
    // Saat field berubah
    // ─────────────────────────────────────────────

    level(frm) {
        frm.trigger("toggle_fields_by_level");

        // Reset parent jika pilih level Gudang
        if (frm.doc.level === "Gudang") {
            frm.set_value("parent_warehouse", "");
        }
    },

    capacity_ton(frm) {
        frm.trigger("show_capacity_info");
    },

    current_stock_ton(frm) {
        frm.trigger("show_capacity_info");
    },

    // ─────────────────────────────────────────────
    // Helper: tampilkan / sembunyikan field
    // ─────────────────────────────────────────────

    toggle_fields_by_level(frm) {
        const isAreaOrRak = frm.doc.level === "Area" || frm.doc.level === "Rak";

        // parent_warehouse hanya muncul untuk Area dan Rak
        frm.toggle_display("parent_warehouse", isAreaOrRak);
        frm.toggle_reqd("parent_warehouse", isAreaOrRak);

        // Kapasitas tidak relevan di level Rak
        frm.toggle_display("capacity_ton", frm.doc.level !== "Rak");
        frm.toggle_display("current_stock_ton", frm.doc.level !== "Rak");

        // PIC wajib di level Gudang
        frm.toggle_reqd("pic", frm.doc.level === "Gudang");
    },

    // ─────────────────────────────────────────────
    // Helper: indikator status
    // ─────────────────────────────────────────────

    set_status_indicator(frm) {
        const color = frm.doc.status === "Aktif" ? "green" : "red";
        frm.page.set_indicator(frm.doc.status || "Aktif", color);
    },

    // ─────────────────────────────────────────────
    // Helper: info kapasitas dengan progress bar
    // ─────────────────────────────────────────────

    show_capacity_info(frm) {
        // Hapus info lama supaya tidak menumpuk
        frm.dashboard.reset();

        if (!frm.doc.capacity_ton || frm.doc.level === "Rak") return;

        const kapasitas   = frm.doc.capacity_ton || 0;
        const stokSaatIni = frm.doc.current_stock_ton || 0;
        const persen      = kapasitas > 0
            ? Math.min(Math.round((stokSaatIni / kapasitas) * 100), 100)
            : 0;

        let warna  = "green";
        let label  = "Normal";

        if (persen >= 90) {
            warna = "red";
            label = "Hampir Penuh!";
        } else if (persen >= 70) {
            warna = "orange";
            label = "Perlu Perhatian";
        }

        frm.dashboard.add_comment(
            `<div style="margin: 4px 0">
                <span style="font-size:12px;color:#6c7680">Kapasitas Terpakai</span>
                <div style="
                    background:#e9ecef;
                    border-radius:4px;
                    height:10px;
                    margin:4px 0;
                    overflow:hidden;
                ">
                    <div style="
                        width:${persen}%;
                        background:${warna === 'green' ? '#28a745' : warna === 'orange' ? '#fd7e14' : '#dc3545'};
                        height:100%;
                        border-radius:4px;
                        transition: width 0.3s;
                    "></div>
                </div>
                <span style="font-size:12px;font-weight:500;color:${warna === 'green' ? '#28a745' : warna === 'orange' ? '#fd7e14' : '#dc3545'}">
                    ${stokSaatIni} / ${kapasitas} ton (${persen}%) — ${label}
                </span>
            </div>`,
            warna,
            true
        );
    },

    // ─────────────────────────────────────────────
    // Tombol aksi custom
    // ─────────────────────────────────────────────

    add_custom_buttons(frm) {
        if (frm.doc.level !== "Rak") {
            frm.add_custom_button(__("Sub-Lokasi"), function () {
                frm.trigger("show_child_locations");
            }, __("Aksi"));
        }

        // Tombol: Lihat Stok per Tipe (WH-02, WH-03)
        frm.add_custom_button(__("Lihat Stok"), function () {
            frm.trigger("show_stock_summary");
        }, __("Aksi"));

        // Tombol: Riwayat Mutasi Barang (WH-02)
        frm.add_custom_button(__("Riwayat Mutasi"), function () {
            frappe.set_route("query-report", "Stock Ledger", {
                warehouse: frm.doc.name,
            });
        }, __("Aksi"));
    },

    // ─────────────────────────────────────────────
    // Aksi: Sub-Lokasi (WH-01)
    // ─────────────────────────────────────────────

    show_child_locations(frm) {
        frappe.call({
            method: "silverplast.api.warehouse.get_child_locations",
            args: { warehouse_code: frm.doc.warehouse_code },
            callback(r) {
                if (!r.message || r.message.length === 0) {
                    frappe.msgprint(__("Belum ada Area atau Rak di gudang ini."));
                    return;
                }

                const rows = r.message.map(d =>
                    `<tr>
                        <td><a href="/app/warehouse/${d.warehouse_code}" target="_blank">
                            ${d.warehouse_code}
                        </a></td>
                        <td>${d.warehouse_name}</td>
                        <td>${d.level}</td>
                        <td>${d.warehouse_type || "-"}</td>
                    </tr>`
                ).join("");

                frappe.msgprint({
                    title: __("Sub-Lokasi: " + frm.doc.warehouse_name),
                    message: `
                        <table class="table table-bordered table-condensed" style="font-size:13px">
                            <thead style="background:#f8f9fa">
                                <tr>
                                    <th>Kode</th>
                                    <th>Nama</th>
                                    <th>Level</th>
                                    <th>Tipe Barang</th>
                                </tr>
                            </thead>
                            <tbody>${rows}</tbody>
                        </table>`,
                    wide: true,
                });
            },
        });
    },

    // ─────────────────────────────────────────────
    // Aksi: Ringkasan Stok per Tipe (WH-02, WH-03)
    // ─────────────────────────────────────────────

    show_stock_summary(frm) {
        frappe.call({
            method: "silverplast.api.warehouse.get_stock_summary",
            args: { warehouse_code: frm.doc.warehouse_code },
            callback(r) {
                if (!r.message || r.message.length === 0) {
                    frappe.msgprint(__("Tidak ada stok di gudang ini saat ini."));
                    return;
                }

                const rows = r.message.map(d =>
                    `<tr>
                        <td>${d.item_code}</td>
                        <td>${d.item_name}</td>
                        <td>${d.item_group || "-"}</td>
                        <td style="text-align:right"><strong>
                            ${frappe.format(d.qty, { fieldtype: "Float" })} ${d.stock_uom}
                        </strong></td>
                    </tr>`
                ).join("");

                frappe.msgprint({
                    title: __("Stok Saat Ini — " + frm.doc.warehouse_name),
                    message: `
                        <table class="table table-bordered table-condensed" style="font-size:13px">
                            <thead style="background:#f8f9fa">
                                <tr>
                                    <th>Kode Item</th>
                                    <th>Nama Item</th>
                                    <th>Tipe</th>
                                    <th style="text-align:right">QTY</th>
                                </tr>
                            </thead>
                            <tbody>${rows}</tbody>
                        </table>`,
                    wide: true,
                });
            },
        });
    },
});