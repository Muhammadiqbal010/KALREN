import io
import os

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate, Spacer, Paragraph,
    PageBreak, Table, TableStyle, Image
)
from reportlab.pdfgen import canvas
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT


# ── warna ──────────────────────────────────────────────────────────────────
DARK_NAVY  = colors.HexColor("#1A1A2E")
MID_NAVY   = colors.HexColor("#16213E")
GREEN_ACC  = colors.HexColor("#27AE60")
RED_ACC    = colors.HexColor("#E74C3C")
BLUE_ACC   = colors.HexColor("#2980B9")
LIGHT_BG   = colors.HexColor("#F5F5F5")
SECTION_BG = colors.HexColor("#E8E8F0")
WHITE      = colors.white
GREY_TEXT  = colors.HexColor("#B0B8C8")
DIM_TEXT   = colors.HexColor("#6C7A8D")

PAGE_W, PAGE_H = A4
LOGO_PATH = "app/assets/logokalren.png"


# ── helper rupiah ──────────────────────────────────────────────────────────
def rupiah(value):
    try:
        return f"Rp {value:,.0f}".replace(",", ".")
    except Exception:
        return "Rp 0"


# ── cover dengan canvas ────────────────────────────────────────────────────
def _draw_cover(c: canvas.Canvas, month: str, year):
    w, h = PAGE_W, PAGE_H

    # background penuh navy gelap
    c.setFillColor(DARK_NAVY)
    c.rect(0, 0, w, h, fill=1, stroke=0)

    # accent bar kiri
    c.setFillColor(GREEN_ACC)
    c.rect(0, 0, 8, h, fill=1, stroke=0)

    # ── logo ──────────────────────────────────────────────────────────────
    logo_y = h - 5 * cm - 2 * cm   # ~top area
    if os.path.exists(LOGO_PATH):
        c.drawImage(
            LOGO_PATH,
            x=2 * cm, y=logo_y,
            width=4 * cm, height=4 * cm,
            preserveAspectRatio=True,
            mask="auto"
        )

    # ── KALREN ────────────────────────────────────────────────────────────
    kalren_y = logo_y - 1.4 * cm
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 36)
    c.drawString(2 * cm, kalren_y, "KALREN")

    # ── garis hijau divider 1 ─────────────────────────────────────────────
    div1_y = kalren_y - 0.7 * cm
    c.setFillColor(GREEN_ACC)
    c.rect(2 * cm, div1_y, w - 3 * cm, 2, fill=1, stroke=0)

    # ── LAPORAN KEUANGAN ──────────────────────────────────────────────────
    lk_y = div1_y - 1.1 * cm
    c.setFillColor(GREY_TEXT)
    c.setFont("Helvetica", 16)
    c.drawString(2 * cm, lk_y, "LAPORAN KEUANGAN")

    # ── Periode ───────────────────────────────────────────────────────────
    periode_y = lk_y - 0.85 * cm
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 13)
    c.drawString(2 * cm, periode_y, f"Periode: {month} {year}")

    # ── garis hijau divider 2 ─────────────────────────────────────────────
    div2_y = periode_y - 0.7 * cm
    c.setFillColor(GREEN_ACC)
    c.rect(2 * cm, div2_y, w - 3 * cm, 2, fill=1, stroke=0)

    # ── footer strip ──────────────────────────────────────────────────────
    footer_h = 1.8 * cm
    c.setFillColor(MID_NAVY)
    c.rect(0, 0, w, footer_h, fill=1, stroke=0)

    # accent bar kiri juga di footer
    c.setFillColor(GREEN_ACC)
    c.rect(0, 0, 8, footer_h, fill=1, stroke=0)

    # teks footer
    c.setFillColor(DIM_TEXT)
    c.setFont("Helvetica", 9)
    footer_text = "Konfidensial · Untuk Internal Perusahaan"
    text_w = c.stringWidth(footer_text, "Helvetica", 9)
    c.drawString((w - text_w) / 2, 0.65 * cm, footer_text)

    c.showPage()


# ── header/footer tiap halaman isi ────────────────────────────────────────
class _KalrenTemplate(SimpleDocTemplate):
    def __init__(self, buffer, month, year, **kwargs):
        self.period_label = f"{month} {year}"
        super().__init__(buffer, **kwargs)

    def handle_pageBegin(self):
        super().handle_pageBegin()

    def afterPage(self):
        c = self.canv
        w = PAGE_W

        # header bar tipis
        c.setFillColor(DARK_NAVY)
        c.rect(0, PAGE_H - 1 * cm, w, 1 * cm, fill=1, stroke=0)
        c.setFillColor(GREEN_ACC)
        c.rect(0, PAGE_H - 1 * cm, 6, 1 * cm, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 8)
        c.drawString(1 * cm, PAGE_H - 0.65 * cm, "KALREN")
        c.setFont("Helvetica", 8)
        right_text = f"Laporan Keuangan – {self.period_label}"
        tw = c.stringWidth(right_text, "Helvetica", 8)
        c.drawString(w - tw - 1 * cm, PAGE_H - 0.65 * cm, right_text)

        # footer bar tipis
        c.setFillColor(MID_NAVY)
        c.rect(0, 0, w, 0.8 * cm, fill=1, stroke=0)
        c.setFillColor(DIM_TEXT)
        c.setFont("Helvetica", 7)
        footer = "Dokumen internal – KALREN"
        fw = c.stringWidth(footer, "Helvetica", 7)
        c.drawString((w - fw) / 2, 0.28 * cm, footer)

        # nomor halaman
        c.setFillColor(GREY_TEXT)
        c.setFont("Helvetica", 7)
        pg = f"Halaman {self.canv.getPageNumber()}"
        pgw = c.stringWidth(pg, "Helvetica", 7)
        c.drawString(w - pgw - 1 * cm, 0.28 * cm, pg)


# ── styles ─────────────────────────────────────────────────────────────────
def _make_styles():
    base = getSampleStyleSheet()
    styles = {}

    styles["section_title"] = ParagraphStyle(
        "section_title",
        fontName="Helvetica-Bold",
        fontSize=14,
        textColor=DARK_NAVY,
        spaceAfter=8,
        spaceBefore=12,
    )
    styles["body"] = ParagraphStyle(
        "body",
        fontName="Helvetica",
        fontSize=10,
        textColor=colors.HexColor("#333333"),
        spaceAfter=6,
        leading=14,
    )
    styles["note"] = ParagraphStyle(
        "note",
        fontName="Helvetica-Oblique",
        fontSize=9,
        textColor=colors.HexColor("#666666"),
        spaceAfter=4,
    )
    styles["label"] = ParagraphStyle(
        "label",
        fontName="Helvetica-Bold",
        fontSize=9,
        textColor=DARK_NAVY,
    )
    return styles


# ── table style helpers ────────────────────────────────────────────────────
def _tbl_header_style(extra=None):
    base = [
        ("BACKGROUND", (0, 0), (-1, 0), DARK_NAVY),
        ("TEXTCOLOR",  (0, 0), (-1, 0), WHITE),
        ("FONTNAME",   (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE",   (0, 0), (-1, 0), 9),
        ("ALIGN",      (0, 0), (-1, 0), "CENTER"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [LIGHT_BG, WHITE]),
        ("FONTNAME",   (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE",   (0, 1), (-1, -1), 9),
        ("GRID",       (0, 0), (-1, -1), 0.4, colors.HexColor("#CCCCCC")),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING",   (0, 0), (-1, -1), 8),
    ]
    if extra:
        base.extend(extra)
    return TableStyle(base)


# ── main function ──────────────────────────────────────────────────────────
def generate_pdf_report(data, month, year):
    """
    Jalur penarikan data sama persis dengan kode asli:
      item.get("flow"), item.get("net_amount"), item.get("tanggal"), dst.
    """

    buffer = io.BytesIO()

    # ── prepare data ──────────────────────────────────────────────────────
    total_income = sum(
        item.get("net_amount", 0)
        for item in data
        if item.get("flow") == "Income"
    )
    total_expense = sum(
        item.get("net_amount", 0)
        for item in data
        if item.get("flow") == "Expense"
    )
    net_profit = total_income - total_expense
    margin = (net_profit / total_income * 100) if total_income > 0 else 0

    period_label = f"{month} {year}"

    # ── cover (canvas langsung) ────────────────────────────────────────────
    cover_buf = io.BytesIO()
    cover_c = canvas.Canvas(cover_buf, pagesize=A4)
    _draw_cover(cover_c, month, year)
    cover_c.save()
    cover_buf.seek(0)

    # ── dokumen isi ───────────────────────────────────────────────────────
    content_buf = io.BytesIO()
    doc = _KalrenTemplate(
        content_buf,
        month=month,
        year=year,
        pagesize=A4,
        rightMargin=2 * cm,
        leftMargin=2 * cm,
        topMargin=1.8 * cm,
        bottomMargin=1.5 * cm,
    )

    S = _make_styles()
    elements = []

    # ── Ringkasan Eksekutif ───────────────────────────────────────────────
    elements.append(Paragraph("Ringkasan Eksekutif", S["section_title"]))

    intro = (
        f"Pada periode <b>{period_label}</b>, KALREN mencatatkan total pendapatan "
        f"sebesar <b>{rupiah(total_income)}</b> dan total beban sebesar "
        f"<b>{rupiah(total_expense)}</b>, sehingga menghasilkan laba bersih "
        f"sebesar <b>{rupiah(net_profit)}</b> dengan margin laba "
        f"<b>{margin:.2f}%</b>."
    )
    elements.append(Paragraph(intro, S["body"]))
    elements.append(Spacer(1, 0.3 * cm))

    kpi_data = [
        [
            Paragraph("<b>TOTAL INCOME</b>", S["label"]),
            Paragraph("<b>TOTAL EXPENSE</b>", S["label"]),
            Paragraph("<b>NET PROFIT</b>", S["label"]),
        ],
        [
            Paragraph(f"<b>{rupiah(total_income)}</b>", S["label"]),
            Paragraph(f"<b>{rupiah(total_expense)}</b>", S["label"]),
            Paragraph(f"<b>{rupiah(net_profit)}</b>", S["label"]),
        ],
    ]
    kpi_tbl = Table(kpi_data, colWidths=[(PAGE_W - 4 * cm) / 3] * 3)
    kpi_tbl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), GREEN_ACC),
        ("BACKGROUND", (1, 0), (1, -1), RED_ACC),
        ("BACKGROUND", (2, 0), (2, -1), BLUE_ACC),
        ("TEXTCOLOR",  (0, 0), (-1, -1), WHITE),
        ("ALIGN",      (0, 0), (-1, -1), "CENTER"),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("ROUNDEDCORNERS", [4]),
    ]))
    elements.append(kpi_tbl)
    elements.append(PageBreak())

    # ── Laporan Laba Rugi ─────────────────────────────────────────────────
    elements.append(Paragraph("Laporan Laba Rugi", S["section_title"]))
    elements.append(Paragraph(
        f"Laporan ini menyajikan posisi pendapatan dan beban KALREN "
        f"untuk periode {period_label}.", S["body"]
    ))

    laba_data = [
        ["Komponen", "Jumlah"],
        ["Pendapatan (Income)", rupiah(total_income)],
        ["Beban (Expense)",     rupiah(total_expense)],
        ["Laba Bersih (Net Profit)", rupiah(net_profit)],
    ]
    laba_tbl = Table(laba_data, colWidths=[10 * cm, 6 * cm])
    laba_tbl.setStyle(_tbl_header_style([
        ("FONTNAME",   (0, 3), (-1, 3), "Helvetica-Bold"),
        ("BACKGROUND", (0, 3), (-1, 3), SECTION_BG),
        ("ALIGN",      (1, 1), (1, -1), "RIGHT"),
    ]))
    elements.append(laba_tbl)
    elements.append(PageBreak())

    # ── Laporan Arus Kas ──────────────────────────────────────────────────
    elements.append(Paragraph("Laporan Arus Kas", S["section_title"]))
    elements.append(Paragraph(
        f"Rincian mutasi kas harian KALREN selama periode {period_label}.",
        S["body"]
    ))

    saldo = 0
    cash_rows = [["Tanggal", "Masuk", "Keluar", "Saldo"]]
    sorted_data = sorted(data, key=lambda x: x.get("tanggal", ""))

    for item in sorted_data:
        is_income = item.get("flow") == "Income"
        income  = item.get("net_amount", 0) if is_income else 0
        expense = item.get("net_amount", 0) if not is_income else 0
        saldo  += income - expense
        cash_rows.append([
            str(item.get("tanggal", ""))[:10],
            rupiah(income)  if income  else "–",
            rupiah(expense) if expense else "–",
            rupiah(saldo),
        ])

    cash_rows.append(["Saldo Akhir", "", "", rupiah(saldo)])

    col_w = (PAGE_W - 4 * cm) / 4
    cash_tbl = Table(cash_rows, colWidths=[col_w * 1.3, col_w, col_w, col_w * 0.7], repeatRows=1)
    cash_tbl.setStyle(_tbl_header_style([
        ("ALIGN",      (1, 1), (-1, -1), "RIGHT"),
        ("FONTNAME",   (0, -1), (-1, -1), "Helvetica-Bold"),
        ("BACKGROUND", (0, -1), (-1, -1), SECTION_BG),
    ]))
    elements.append(cash_tbl)
    elements.append(PageBreak())

    # ── Neraca Sederhana ──────────────────────────────────────────────────
    elements.append(Paragraph("Neraca Sederhana", S["section_title"]))
    elements.append(Paragraph(
        f"Posisi aset dan modal KALREN per akhir periode {period_label}.",
        S["body"]
    ))

    neraca_data = [
        ["Komponen", "Jumlah"],
        ["ASET", ""],
        ["Kas", rupiah(net_profit)],
        ["Total Aset", rupiah(net_profit)],
        ["MODAL", ""],
        ["Modal Owner", rupiah(net_profit)],
        ["Total Modal", rupiah(net_profit)],
    ]
    neraca_tbl = Table(neraca_data, colWidths=[10 * cm, 6 * cm])
    neraca_tbl.setStyle(_tbl_header_style([
        ("FONTNAME",   (0, 1), (-1, 1), "Helvetica-Bold"),
        ("FONTNAME",   (0, 4), (-1, 4), "Helvetica-Bold"),
        ("FONTNAME",   (0, 3), (-1, 3), "Helvetica-Bold"),
        ("FONTNAME",   (0, 6), (-1, 6), "Helvetica-Bold"),
        ("BACKGROUND", (0, 1), (-1, 1), MID_NAVY),
        ("BACKGROUND", (0, 4), (-1, 4), MID_NAVY),
        ("TEXTCOLOR",  (0, 1), (-1, 1), WHITE),
        ("TEXTCOLOR",  (0, 4), (-1, 4), WHITE),
        ("BACKGROUND", (0, 3), (-1, 3), SECTION_BG),
        ("BACKGROUND", (0, 6), (-1, 6), SECTION_BG),
        ("ALIGN",      (1, 1), (1, -1), "RIGHT"),
    ]))
    elements.append(neraca_tbl)
    elements.append(PageBreak())

    # ── Analisis Keuangan ─────────────────────────────────────────────────
    elements.append(Paragraph("Analisis Keuangan", S["section_title"]))

    analisis_data = [
        ["Indikator", "Nilai"],
        ["Total Income",   rupiah(total_income)],
        ["Total Expense",  rupiah(total_expense)],
        ["Net Profit",     rupiah(net_profit)],
        ["Profit Margin",  f"{margin:.2f}%"],
    ]
    analisis_tbl = Table(analisis_data, colWidths=[10 * cm, 6 * cm])
    analisis_tbl.setStyle(_tbl_header_style([
        ("FONTNAME",   (0, 3), (-1, 4), "Helvetica-Bold"),
        ("BACKGROUND", (0, 3), (-1, 4), SECTION_BG),
        ("ALIGN",      (1, 1), (1, -1), "RIGHT"),
    ]))
    elements.append(analisis_tbl)

    note = (
        "<i>Catatan: Periode ini mencatatkan margin laba negatif, yang mengindikasikan "
        "total beban melebihi total pendapatan. Diperlukan tinjauan terhadap struktur "
        "biaya untuk periode berikutnya.</i>"
        if net_profit < 0 else
        "<i>Catatan: Periode ini mencatatkan margin laba positif.</i>"
    )
    elements.append(Spacer(1, 0.4 * cm))
    elements.append(Paragraph(note, S["note"]))

    # ── Persetujuan ───────────────────────────────────────────────────────
    elements.append(Spacer(1, 2 * cm))
    elements.append(Paragraph(f"{month} {year}", S["body"]))
    elements.append(Paragraph("Disetujui Oleh,", S["body"]))
    elements.append(Spacer(1, 1.5 * cm))
    elements.append(Paragraph("<b>Muhammad Iqbal</b>", S["section_title"]))
    elements.append(Paragraph("Owner KALREN", S["body"]))

    # ── build content ─────────────────────────────────────────────────────
    doc.build(elements)
    content_buf.seek(0)

    # ── gabungkan cover + isi dengan pypdf ────────────────────────────────
    from pypdf import PdfWriter, PdfReader

    writer = PdfWriter()
    writer.append(PdfReader(cover_buf))
    writer.append(PdfReader(content_buf))

    writer.write(buffer)
    buffer.seek(0)
    return buffer


# ── quick test ────────────────────────────────────────────────────────────
if __name__ == "__main__":
    sample_data = [
        {"tanggal": "01/05/2026", "flow": "Expense", "kategori": "Pembelian",
         "sub_kategori": "Bahan Baku", "keterangan": "Polyflex", "metode": "Transfer",
         "gross_amount": 60500,  "potongan": 0, "net_amount": 60500},
        {"tanggal": "01/05/2026", "flow": "Expense", "kategori": "Pembelian",
         "sub_kategori": "Bahan Baku", "keterangan": "Polyflex", "metode": "Transfer",
         "gross_amount": 398000, "potongan": 0, "net_amount": 398000},
        {"tanggal": "01/05/2026", "flow": "Expense", "kategori": "Pembelian",
         "sub_kategori": "Hangtag",    "keterangan": "Hangtag",  "metode": "Transfer",
         "gross_amount": 356000, "potongan": 0, "net_amount": 356000},
        {"tanggal": "01/05/2026", "flow": "Income",  "kategori": "Income",
         "sub_kategori": "Modal",      "keterangan": "Modal rendi","metode": "Transfer",
         "gross_amount": 814500, "potongan": 0, "net_amount": 814500},
        {"tanggal": "14/05/2026", "flow": "Expense", "kategori": "Pembelian",
         "sub_kategori": "Lainnya",    "keterangan": "Wallpaper","metode": "Transfer",
         "gross_amount": 145000, "potongan": 0, "net_amount": 145000},
        {"tanggal": "03/05/2026", "flow": "Income",  "kategori": "Income",
         "sub_kategori": "Penjualan",  "keterangan": "Baju 1 pcs","metode": "Cash",
         "gross_amount": 60000,  "potongan": 0, "net_amount": 60000},
        {"tanggal": "03/05/2026", "flow": "Income",  "kategori": "Income",
         "sub_kategori": "Penjualan",  "keterangan": "Baju 1 pcs","metode": "Transfer",
         "gross_amount": 50000,  "potongan": 0, "net_amount": 50000},
    ]

    buf = generate_pdf_report(sample_data, "Mei", 2026)
    with open("/mnt/user-data/outputs/laporan_keuangan_kalren.pdf", "wb") as f:
        f.write(buf.read())
    print("Done.")