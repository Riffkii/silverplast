# Copyright (c) 2026, P79 and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document


class Warehouse(Document):
    def validate(self):
        self.validate_hierarchy()
        self.validate_capacity()

    def before_save(self):
        self.warehouse_code = self.warehouse_code.upper().strip()

    def validate_hierarchy(self):
        """
        WH-01: Pastikan hierarki Gudang > Area > Rak konsisten.

        Aturan:
        - Level 'Gudang' → parent_warehouse harus KOSONG
        - Level 'Area'   → parent_warehouse wajib ada & level-nya 'Gudang'
        - Level 'Rak'    → parent_warehouse wajib ada & level-nya 'Area'
        """
        if self.level == "Gudang":
            if self.parent_warehouse:
                frappe.throw(
                    _("Level 'Gudang' tidak boleh memiliki Induk Gudang. "
                      "Kosongkan field Induk Gudang.")
                )
            return

        if not self.parent_warehouse:
            frappe.throw(
                _("Level '{0}' wajib memiliki Induk Gudang.").format(self.level)
            )

        if self.parent_warehouse == self.warehouse_code:
            frappe.throw(_("Induk Gudang tidak boleh merujuk ke dirinya sendiri."))

        parent_level = frappe.db.get_value(
            "Warehouse", self.parent_warehouse, "level"
        )
        if not parent_level:
            frappe.throw(
                _("Induk Gudang '{0}' tidak ditemukan.").format(self.parent_warehouse)
            )

        if self.level == "Area" and parent_level != "Gudang":
            frappe.throw(
                _("Induk dari level 'Area' harus berupa 'Gudang'. "
                  "'{0}' memiliki level '{1}'.").format(
                    self.parent_warehouse, parent_level
                )
            )

        if self.level == "Rak" and parent_level != "Area":
            frappe.throw(
                _("Induk dari level 'Rak' harus berupa 'Area'. "
                  "'{0}' memiliki level '{1}'.").format(
                    self.parent_warehouse, parent_level
                )
            )

    def validate_capacity(self):
        if self.capacity_ton and self.capacity_ton <= 0:
            frappe.throw(_("Kapasitas (Ton) harus lebih besar dari 0."))