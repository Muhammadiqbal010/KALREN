import io
import os
import pandas as pd


# ─── COLOR PALETTE ────────────────────────────────────────────────────────────
COLOR = {
    "navy":        "#1A1A2E",
    "navy_dark":   "#16213E",
    "navy_light":  "#E8E8F0",
    "white":       "#FFFFFF",
    "gray_light":  "#F5F5F5",
    "gray_mid":    "#E0E0E0",
    "gray_text":   "#9E9E9E",
    "green":       "#27AE60",
    "green_light": "#C6EFCE",
    "green_dark":  "#006100",
    "red":         "#E74C3C",
    "red_light":   "#FFC7CE",
    "red_dark":    "#9C0006",
    "blue":        "#2980B9",
}


def generate_excel_report(data, month, year):
    rows = []
    for item in data:
        rows.append({
            "Tanggal":     item.get("tanggal"),
            "Flow":        item.get("flow"),
            "Kategori":    item.get("kategori"),
            "Sub Kategori": item.get("sub_kategori") or "-",
            "Keterangan":  item.get("keterangan"),
            "Metode":      item.get("metode"),
            "Gross Amount": item.get("gross_amount", 0),
            "Potongan":    item.get("potongan", 0),
            "Net Amount":  item.get("net_amount", 0),
        })

    df = pd.DataFrame(rows)
    output = io.BytesIO()

    # ── Aggregations ──────────────────────────────────────────────────────────
    total_income  = df[df["Flow"] == "Income"]["Net Amount"].sum()
    total_expense = df[df["Flow"] == "Expense"]["Net Amount"].sum()
    profit        = total_income - total_expense

    kategori_income_df  = (
        df[df["Flow"] == "Income"]
        .groupby("Kategori")["Net Amount"].sum()
        .reset_index()
        .rename(columns={"Net Amount": "Pendapatan"})
    )
    kategori_expense_df = (
        df[df["Flow"] == "Expense"]
        .groupby("Kategori")["Net Amount"].sum()
        .reset_index()
        .rename(columns={"Net Amount": "Pengeluaran"})
    )
    kategori_df = pd.merge(
        kategori_income_df, kategori_expense_df, on="Kategori", how="outer"
    ).fillna(0)
    kategori_df["Net"] = kategori_df["Pendapatan"] - kategori_df["Pengeluaran"]

    cashflow_df = df.copy()
    cashflow_df["Masuk"]  = cashflow_df.apply(
        lambda x: x["Net Amount"] if x["Flow"] == "Income" else 0, axis=1
    )
    cashflow_df["Keluar"] = cashflow_df.apply(
        lambda x: x["Net Amount"] if x["Flow"] == "Expense" else 0, axis=1
    )
    saldo, saldo_list = 0, []
    for _, row in cashflow_df.iterrows():
        saldo += row["Masuk"] - row["Keluar"]
        saldo_list.append(saldo)
    cashflow_df["Saldo"] = saldo_list

    logo_path = "app/assets/logokalren.png"
    period_str = f"{month:02d}/{year}" if isinstance(month, int) else f"{month}/{year}"

    with pd.ExcelWriter(output, engine="xlsxwriter") as writer:
        wb = writer.book

        # ── Formats ───────────────────────────────────────────────────────────
        def fmt(**kw):
            return wb.add_format(kw)

        # Base
        base       = fmt(font_name="Arial", font_size=10, valign="vcenter")
        base_r     = fmt(font_name="Arial", font_size=10, valign="vcenter", align="right")
        base_c     = fmt(font_name="Arial", font_size=10, valign="vcenter", align="center")

        # Rupiah
        rp         = fmt(font_name="Arial", font_size=10, valign="vcenter",
                         align="right", num_format='"Rp" #,##0;("Rp" #,##0);"-"')
        rp_bold    = fmt(font_name="Arial", font_size=11, bold=True, valign="vcenter",
                         align="right", num_format='"Rp" #,##0;("Rp" #,##0);"-"')
        rp_stripe  = fmt(font_name="Arial", font_size=10, valign="vcenter",
                         align="right", num_format='"Rp" #,##0;("Rp" #,##0);"-"',
                         bg_color=COLOR["gray_light"])

        # Header bar
        hdr_main   = fmt(font_name="Arial", font_size=13, bold=True,
                         font_color=COLOR["white"], bg_color=COLOR["navy"],
                         valign="vcenter", border=0)

        # Table column header
        col_hdr    = fmt(font_name="Arial", font_size=9, bold=True,
                         font_color=COLOR["white"], bg_color=COLOR["navy_dark"],
                         align="center", valign="vcenter",
                         text_wrap=True, border=1, border_color=COLOR["gray_mid"])

        # KPI cards
        kpi_lbl    = fmt(font_name="Arial", font_size=8, font_color=COLOR["gray_text"],
                         align="center", valign="vcenter", bg_color=COLOR["gray_light"])
        kpi_val    = fmt(font_name="Arial", font_size=14, bold=True,
                         font_color=COLOR["navy"], align="center", valign="vcenter",
                         num_format='"Rp" #,##0;("Rp" #,##0);"-"',
                         bg_color=COLOR["gray_light"])

        kpi_top_g  = fmt(bg_color=COLOR["green"])
        kpi_top_r  = fmt(bg_color=COLOR["red"])
        kpi_top_b  = fmt(bg_color=COLOR["blue"])

        # Stripe rows
        row_white  = fmt(font_name="Arial", font_size=9, valign="vcenter",
                         bottom=1, bottom_color=COLOR["gray_mid"])
        row_stripe = fmt(font_name="Arial", font_size=9, valign="vcenter",
                         bg_color=COLOR["gray_light"],
                         bottom=1, bottom_color=COLOR["gray_mid"])
        rp_white   = fmt(font_name="Arial", font_size=9, valign="vcenter",
                         align="right", num_format='"Rp" #,##0;("Rp" #,##0);"-"',
                         bottom=1, bottom_color=COLOR["gray_mid"])
        rp_stripe2 = fmt(font_name="Arial", font_size=9, valign="vcenter",
                         align="right", num_format='"Rp" #,##0;("Rp" #,##0);"-"',
                         bg_color=COLOR["gray_light"],
                         bottom=1, bottom_color=COLOR["gray_mid"])

        # Total row
        total_lbl  = fmt(font_name="Arial", font_size=10, bold=True,
                         font_color=COLOR["navy"], bg_color=COLOR["navy_light"],
                         valign="vcenter", top=2, top_color=COLOR["navy"])
        total_rp   = fmt(font_name="Arial", font_size=10, bold=True,
                         bg_color=COLOR["navy_light"], align="right",
                         num_format='"Rp" #,##0;("Rp" #,##0);"-"',
                         valign="vcenter", top=2, top_color=COLOR["navy"])

        # Section headers
        sec_green  = fmt(font_name="Arial", font_size=10, bold=True,
                         font_color=COLOR["white"], bg_color=COLOR["green"], valign="vcenter")
        sec_red    = fmt(font_name="Arial", font_size=10, bold=True,
                         font_color=COLOR["white"], bg_color=COLOR["red"], valign="vcenter")
        sec_blue   = fmt(font_name="Arial", font_size=10, bold=True,
                         font_color=COLOR["white"], bg_color=COLOR["blue"], valign="vcenter")
        sec_navy   = fmt(font_name="Arial", font_size=10, bold=True,
                         font_color=COLOR["white"], bg_color=COLOR["navy"], valign="vcenter")

        # Income / expense conditional
        income_fmt  = fmt(font_name="Arial", font_size=9, bold=True,
                          font_color=COLOR["green"], align="center", valign="vcenter")
        expense_fmt = fmt(font_name="Arial", font_size=9, bold=True,
                          font_color=COLOR["red"], align="center", valign="vcenter")

        # Laba bersih
        laba_val   = fmt(font_name="Arial", font_size=12, bold=True,
                         font_color=COLOR["navy"], align="right", valign="vcenter",
                         num_format='"Rp" #,##0;("Rp" #,##0);"-"',
                         top=2, bottom=2, top_color=COLOR["navy"], bottom_color=COLOR["navy"])

        # Cover title
        cover_title = fmt(font_name="Arial", font_size=26, bold=True,
                          font_color=COLOR["navy"], align="center", valign="vcenter")
        cover_sub   = fmt(font_name="Arial", font_size=13,
                          font_color=COLOR["gray_text"], align="center", valign="vcenter")
        cover_period= fmt(font_name="Arial", font_size=14, bold=True,
                          font_color=COLOR["navy"], align="center", valign="vcenter")
        cover_footer= fmt(font_name="Arial", font_size=9,
                          font_color=COLOR["white"], bg_color=COLOR["navy_dark"],
                          align="center", valign="vcenter")

        # ── Helper ────────────────────────────────────────────────────────────
        def set_cols(ws, widths):
            """widths: list of (col_index, width)"""
            for col, w in widths:
                ws.set_column(col, col, w)

        def write_sheet_header(ws, text, n_cols=8):
            ws.set_row(0, 32)
            ws.merge_range(0, 0, 0, n_cols - 1, text, hdr_main)

        # ══════════════════════════════════════════════════════════════════════
        # COVER
        # ══════════════════════════════════════════════════════════════════════
        cover = wb.add_worksheet("Cover")
        cover.hide_gridlines(2)
        set_cols(cover, [(i, 13) for i in range(8)])

        # Dark background
        bg = fmt(bg_color=COLOR["navy"])
        for r in range(44):
            cover.set_row(r, 18)
            for c in range(8):
                cover.write(r, c, "", bg)

        # White card (rows 4-39, cols 1-6)
        card = fmt(bg_color=COLOR["white"])
        for r in range(4, 40):
            for c in range(1, 7):
                cover.write(r, c, "", card)

        # Logo area (rows 5-15, cols 2-5)
        logo_bg = fmt(bg_color=COLOR["gray_light"])
        for r in range(5, 16):
            for c in range(2, 6):
                cover.write(r, c, "", logo_bg)

        if os.path.exists(logo_path):
            cover.insert_image(3, 3, logo_path, {
                "x_scale": 0.5, "y_scale": 0.5,
                "x_offset": 10, "y_offset": 5
            })
        else:
            cover.merge_range(8, 2, 13, 5, "LOGO", fmt(
                font_name="Arial", font_size=18, bold=True,
                font_color=COLOR["gray_text"], align="center", valign="vcenter",
                bg_color=COLOR["gray_light"]
            ))

        # Divider
        div = fmt(bg_color=COLOR["navy"])
        for c in range(1, 7):
            cover.write(18, c, "", div)

        # Company name
        cover.set_row(17, 32)
        cover.merge_range(17, 1, 17, 6, "KALREN", cover_title)

        # Subtitle
        cover.merge_range(19, 1, 19, 6, "LAPORAN KEUANGAN", cover_sub)

        # Period
        cover.set_row(21, 22)
        cover.merge_range(21, 1, 21, 6, f"Periode: {period_str}", cover_period)

        # Footer
        footer_bg = fmt(bg_color=COLOR["navy_dark"])
        for r in range(35, 38):
            for c in range(1, 7):
                cover.write(r, c, "", footer_bg)
        cover.merge_range(36, 1, 36, 6,
                          "Konfidensial  ·  Untuk Internal Perusahaan",
                          cover_footer)

        # ══════════════════════════════════════════════════════════════════════
        # DASHBOARD
        # ══════════════════════════════════════════════════════════════════════
        db = wb.add_worksheet("Dashboard")
        db.hide_gridlines(2)
        set_cols(db, [(0, 1), (1, 24), (2, 18), (3, 18), (4, 18), (5, 18), (6, 1)])

        write_sheet_header(db, "📊  DASHBOARD KEUANGAN — KALREN", 7)
        db.set_row(1, 8)

        # KPI cards
        kpi_items = [
            (1, "TOTAL PENDAPATAN", total_income,  kpi_top_g),
            (2, "TOTAL PENGELUARAN", total_expense, kpi_top_r),
            (3, "LABA BERSIH",       profit,         kpi_top_b),
        ]
        for col, label, value, top_fmt in kpi_items:
            db.set_row(2, 6)
            db.set_row(3, 14)
            db.set_row(4, 26)
            db.set_row(5, 16)
            db.set_row(6, 8)
            db.write(2, col, "", top_fmt)
            db.write(3, col, label,  kpi_lbl)
            db.write(4, col, value,  kpi_val)
            db.write(5, col, "",     kpi_lbl)
            db.write(6, col, "",     fmt(bg_color=COLOR["gray_light"]))

        # Section label
        db.set_row(7, 22)
        db.merge_range(7, 1, 7, 5,
                       "Ringkasan Berdasarkan Kategori",
                       fmt(font_name="Arial", font_size=11, bold=True,
                           font_color=COLOR["navy"], bg_color=COLOR["navy_light"],
                           valign="vcenter"))

        # Table headers
        db.set_row(8, 20)
        for i, h in enumerate(["Kategori", "Pendapatan (Rp)", "Pengeluaran (Rp)", "Net (Rp)"]):
            db.write(8, i + 1, h, col_hdr)

        # Table rows
        for r_i, row in kategori_df.iterrows():
            r = r_i + 9
            db.set_row(r, 16)
            bg_r = row_stripe if r_i % 2 == 0 else row_white
            bg_rp = rp_stripe2 if r_i % 2 == 0 else rp_white
            db.write(r, 1, row["Kategori"],    bg_r)
            db.write(r, 2, row["Pendapatan"],  bg_rp)
            db.write(r, 3, row["Pengeluaran"], bg_rp)
            db.write(r, 4, row["Net"],         bg_rp)

        # Chart
        chart = wb.add_chart({"type": "column"})
        chart.add_series({
            "name": "Pendapatan",
            "categories": ["Dashboard", 8, 1, 8 + len(kategori_df) - 1, 1],
            "values":     ["Dashboard", 8, 2, 8 + len(kategori_df) - 1, 2],
            "fill":       {"color": COLOR["green"]},
        })
        chart.add_series({
            "name": "Pengeluaran",
            "categories": ["Dashboard", 8, 1, 8 + len(kategori_df) - 1, 1],
            "values":     ["Dashboard", 8, 3, 8 + len(kategori_df) - 1, 3],
            "fill":       {"color": COLOR["red"]},
        })
        chart.set_title({"name": "Pendapatan vs Pengeluaran per Kategori"})
        chart.set_style(11)
        chart.set_size({"width": 480, "height": 280})
        db.insert_chart(9 + len(kategori_df) + 1, 1, chart)

        # ══════════════════════════════════════════════════════════════════════
        # DETAIL
        # ══════════════════════════════════════════════════════════════════════
        detail = wb.add_worksheet("Detail")
        detail.hide_gridlines(2)

        col_widths_det = [1, 13, 10, 14, 14, 20, 11, 16, 11, 16, 1]
        for i, w in enumerate(col_widths_det):
            detail.set_column(i, i, w)

        detail.set_row(0, 30)
        detail.merge_range(0, 0, 0, 10,
                           f"📋  DETAIL TRANSAKSI — PERIODE {period_str}", hdr_main)

        # Column headers
        det_cols = ["Tanggal", "Flow", "Kategori", "Sub Kategori",
                    "Keterangan", "Metode", "Gross Amount (Rp)", "Potongan (Rp)", "Net Amount (Rp)"]
        detail.set_row(1, 8)
        detail.set_row(2, 20)
        for i, h in enumerate(det_cols):
            detail.write(2, i + 1, h, col_hdr)

        detail.freeze_panes(3, 0)

        # Data rows
        rp_cols = {6, 7, 8}  # 0-indexed within det_cols → actual col offset +1
        for r_i, row in df.iterrows():
            r = r_i + 3
            detail.set_row(r, 16)
            is_stripe = r_i % 2 == 0
            bg_r  = row_stripe if is_stripe else row_white
            bg_rp = rp_stripe2 if is_stripe else rp_white

            vals = [
                row["Tanggal"], row["Flow"], row["Kategori"], row["Sub Kategori"],
                row["Keterangan"], row["Metode"],
                row["Gross Amount"], row["Potongan"], row["Net Amount"],
            ]
            for c_i, v in enumerate(vals):
                col = c_i + 1
                if c_i in rp_cols:
                    detail.write(r, col, v, bg_rp)
                elif c_i == 1:  # Flow
                    flow_f = income_fmt if v == "Income" else expense_fmt
                    detail.write(r, col, v, flow_f)
                else:
                    detail.write(r, col, v, bg_r)

        # Total row
        tot_r = len(df) + 3
        detail.set_row(tot_r, 20)
        detail.write(tot_r, 1, "TOTAL", total_lbl)
        for c in range(2, 9):
            detail.write(tot_r, c, "", total_lbl)
        detail.write(tot_r, 7, df["Gross Amount"].sum(), total_rp)
        detail.write(tot_r, 8, df["Potongan"].sum(),     total_rp)
        detail.write(tot_r, 9, df["Net Amount"].sum(),   total_rp)

        # ══════════════════════════════════════════════════════════════════════
        # RINGKASAN (P&L)
        # ══════════════════════════════════════════════════════════════════════
        ringkasan = wb.add_worksheet("Ringkasan")
        ringkasan.hide_gridlines(2)
        set_cols(ringkasan, [(0, 1), (1, 30), (2, 20), (3, 1)])

        write_sheet_header(ringkasan, "📑  RINGKASAN LAPORAN KEUANGAN", 4)
        ringkasan.set_row(1, 8)

        def write_section(ws, start_row, label, items, total_val, sec_fmt):
            ws.set_row(start_row, 20)
            ws.merge_range(start_row, 1, start_row, 2, label, sec_fmt)

            for i, (lbl, val) in enumerate(items):
                r = start_row + 1 + i
                ws.set_row(r, 16)
                is_stripe = i % 2 == 0
                ws.write(r, 1, lbl,
                         row_stripe if is_stripe else row_white)
                ws.write(r, 2, val,
                         rp_stripe2 if is_stripe else rp_white)

            tot_r = start_row + 1 + len(items)
            ws.set_row(tot_r, 20)
            ws.write(tot_r, 1, f"Total {label}", total_lbl)
            ws.write(tot_r, 2, total_val, total_rp)
            return tot_r

        # Pendapatan
        pend_items = (
            df[df["Flow"] == "Income"]
            .groupby("Sub Kategori")["Net Amount"].sum()
            .reset_index()
        )
        pend_list = [(r["Sub Kategori"], r["Net Amount"]) for _, r in pend_items.iterrows()]
        tot_pend_row = write_section(ringkasan, 2, "PENDAPATAN", pend_list, total_income, sec_green)

        # Pengeluaran
        exp_items = (
            df[df["Flow"] == "Expense"]
            .groupby("Sub Kategori")["Net Amount"].sum()
            .reset_index()
        )
        exp_list = [(r["Sub Kategori"], r["Net Amount"]) for _, r in exp_items.iterrows()]
        tot_exp_row = write_section(ringkasan, tot_pend_row + 2, "PENGELUARAN", exp_list, total_expense, sec_red)

        # Laba / Rugi
        laba_r = tot_exp_row + 2
        ringkasan.set_row(laba_r, 20)
        ringkasan.merge_range(laba_r, 1, laba_r, 2, "LABA / RUGI", sec_blue)
        ringkasan.set_row(laba_r + 1, 22)
        ringkasan.write(laba_r + 1, 1, "Laba Bersih",
                        fmt(font_name="Arial", font_size=12, bold=True, valign="vcenter"))
        ringkasan.write(laba_r + 1, 2, profit, laba_val)

        # ══════════════════════════════════════════════════════════════════════
        # ARUS KAS
        # ══════════════════════════════════════════════════════════════════════
        ak = wb.add_worksheet("Arus Kas")
        ak.hide_gridlines(2)
        set_cols(ak, [(0, 1), (1, 14), (2, 18), (3, 18), (4, 18), (5, 1)])

        write_sheet_header(ak, f"💵  LAPORAN ARUS KAS — PERIODE {period_str}", 6)
        ak.set_row(1, 8)
        ak.set_row(2, 20)
        for i, h in enumerate(["Tanggal", "Masuk (Rp)", "Keluar (Rp)", "Saldo (Rp)"]):
            ak.write(2, i + 1, h, col_hdr)

        ak.freeze_panes(3, 0)

        cf = cashflow_df[["Tanggal", "Masuk", "Keluar", "Saldo"]].reset_index(drop=True)
        for r_i, row in cf.iterrows():
            r = r_i + 3
            ak.set_row(r, 16)
            is_stripe = r_i % 2 == 0
            bg_r  = row_stripe if is_stripe else row_white
            bg_rp = rp_stripe2 if is_stripe else rp_white
            ak.write(r, 1, row["Tanggal"], bg_r)
            ak.write(r, 2, row["Masuk"],   bg_rp)
            ak.write(r, 3, row["Keluar"],  bg_rp)
            saldo_f = fmt(
                font_name="Arial", font_size=9, valign="vcenter", align="right",
                num_format='"Rp" #,##0;("Rp" #,##0);"-"',
                font_color=COLOR["green"] if row["Saldo"] >= 0 else COLOR["red"],
                bg_color=COLOR["gray_light"] if is_stripe else COLOR["white"],
                bottom=1, bottom_color=COLOR["gray_mid"]
            )
            ak.write(r, 4, row["Saldo"], saldo_f)

        # Total row
        tot_r = len(cf) + 3
        ak.set_row(tot_r, 20)
        ak.write(tot_r, 1, "TOTAL", total_lbl)
        ak.write(tot_r, 2, cf["Masuk"].sum(),  total_rp)
        ak.write(tot_r, 3, cf["Keluar"].sum(), total_rp)
        ak.write(tot_r, 4, cf["Saldo"].iloc[-1] if not cf.empty else 0, total_rp)

        # ══════════════════════════════════════════════════════════════════════
        # LABA RUGI
        # ══════════════════════════════════════════════════════════════════════
        laba = wb.add_worksheet("Laba Rugi")
        laba.hide_gridlines(2)
        set_cols(laba, [(0, 1), (1, 28), (2, 20), (3, 1)])
        write_sheet_header(laba, "📊  LAPORAN LABA RUGI", 4)
        laba.set_row(1, 8)

        laba_rows = [
            (2, "PENDAPATAN", sec_green),
            (3, "Pendapatan Penjualan", None, total_income),
            (4, "PENGELUARAN / BEBAN", sec_red),
            (5, "Total Beban", None, total_expense),
            (6, None, None, None),  # spacer
            (7, "LABA BERSIH", None, profit),
        ]
        for item in laba_rows:
            r = item[0]
            laba.set_row(r, 20 if item[2] is not None or r == 7 else 16)
            if item[2]:  # section header
                laba.merge_range(r, 1, r, 2, item[1], item[2])
            elif item[1] and r != 7:
                laba.write(r, 1, item[1], row_white)
                laba.write(r, 2, item[3], rp_white)
            elif r == 7:
                laba.write(r, 1, "Laba Bersih",
                           fmt(font_name="Arial", font_size=12, bold=True, valign="vcenter"))
                laba.write(r, 2, profit, laba_val)

        # ══════════════════════════════════════════════════════════════════════
        # NERACA
        # ══════════════════════════════════════════════════════════════════════
        neraca = wb.add_worksheet("Neraca")
        neraca.hide_gridlines(2)
        set_cols(neraca, [(0, 1), (1, 28), (2, 20), (3, 1)])
        write_sheet_header(neraca, "🏦  NERACA", 4)
        neraca.set_row(1, 8)

        neraca.set_row(2, 20)
        neraca.merge_range(2, 1, 2, 2, "AKTIVA", sec_navy)
        neraca.set_row(3, 16)
        neraca.write(3, 1, "Kas / Bank", row_white)
        neraca.write(3, 2, profit, rp_white)
        neraca.set_row(4, 20)
        neraca.write(4, 1, "Total Aktiva", total_lbl)
        neraca.write(4, 2, profit, total_rp)

        neraca.set_row(5, 8)
        neraca.set_row(6, 20)
        neraca.merge_range(6, 1, 6, 2, "EKUITAS", sec_navy)
        neraca.set_row(7, 16)
        neraca.write(7, 1, "Modal", row_white)
        neraca.write(7, 2, profit, rp_white)
        neraca.set_row(8, 20)
        neraca.write(8, 1, "Total Ekuitas", total_lbl)
        neraca.write(8, 2, profit, total_rp)

    output.seek(0)
    return output