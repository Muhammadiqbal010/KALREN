from collections import defaultdict
from datetime import datetime


def rupiah(value):
    return round(float(value or 0), 0)


def generate_report_data(data):

    total_income = 0
    total_expense = 0

    expense_by_category = defaultdict(float)
    income_by_category = defaultdict(float)

    cashflow_daily = defaultdict(
        lambda: {
            "income": 0,
            "expense": 0
        }
    )

    cashflow_monthly = defaultdict(
        lambda: {
            "income": 0,
            "expense": 0
        }
    )

    cashflow_yearly = defaultdict(
        lambda: {
            "income": 0,
            "expense": 0
        }
    )

    transaksi_detail = []

    saldo_berjalan = 0

    sorted_data = sorted(
        data,
        key=lambda x: x.get("tanggal")
    )

    for trx in sorted_data:

        flow = trx.get("flow")
        kategori = trx.get("kategori")
        amount = float(
            trx.get("net_amount", 0)
        )

        tanggal = trx.get("tanggal")

        if isinstance(
            tanggal,
            datetime
        ):
            tanggal_daily = tanggal.strftime(
                "%Y-%m-%d"
            )

            tanggal_month = tanggal.strftime(
                "%Y-%m"
            )

            tanggal_year = tanggal.strftime(
                "%Y"
            )

        else:

            tanggal_str = str(
                tanggal
            )[:10]

            tanggal_daily = tanggal_str

            tanggal_month = tanggal_str[:7]

            tanggal_year = tanggal_str[:4]

        # ====================
        # INCOME
        # ====================

        if flow == "Income":

            total_income += amount

            income_by_category[
                kategori
            ] += amount

            cashflow_daily[
                tanggal_daily
            ]["income"] += amount

            cashflow_monthly[
                tanggal_month
            ]["income"] += amount

            cashflow_yearly[
                tanggal_year
            ]["income"] += amount

            saldo_berjalan += amount

        # ====================
        # EXPENSE
        # ====================

        elif flow == "Expense":

            total_expense += amount

            expense_by_category[
                kategori
            ] += amount

            cashflow_daily[
                tanggal_daily
            ]["expense"] += amount

            cashflow_monthly[
                tanggal_month
            ]["expense"] += amount

            cashflow_yearly[
                tanggal_year
            ]["expense"] += amount

            saldo_berjalan -= amount

        transaksi_detail.append({
            "tanggal": tanggal_daily,
            "flow": flow,
            "kategori": kategori,
            "sub_kategori": trx.get(
                "sub_kategori"
            ),
            "keterangan": trx.get(
                "keterangan"
            ),
            "net_amount": amount,
            "saldo": saldo_berjalan
        })

    # ====================
    # PROFIT
    # ====================

    net_profit = (
        total_income
        - total_expense
    )

    # ====================
    # PROFIT MARGIN
    # ====================

    profit_margin = 0

    if total_income > 0:

        profit_margin = round(
            (
                net_profit
                /
                total_income
            ) * 100,
            2
        )

    # ====================
    # TOP EXPENSE
    # ====================

    top_expense = sorted(
        expense_by_category.items(),
        key=lambda x: x[1],
        reverse=True
    )

    # ====================
    # TOP INCOME
    # ====================

    top_income = sorted(
        income_by_category.items(),
        key=lambda x: x[1],
        reverse=True
    )

    # ====================
    # BALANCE SHEET
    # ====================

    balance_sheet = {
        "assets": {
            "cash": net_profit
        },
        "equity": {
            "owner_capital":
            net_profit
        }
    }

    # ====================
    # PROFIT LOSS
    # ====================

    profit_loss = {
        "income": total_income,
        "expense": total_expense,
        "net_profit": net_profit,
        "margin": profit_margin
    }

    # ====================
    # CASHFLOW
    # ====================

    cashflow = {
        "daily": [
            {
                "date": k,
                **v
            }
            for k, v
            in cashflow_daily.items()
        ],
        "monthly": [
            {
                "date": k,
                **v
            }
            for k, v
            in cashflow_monthly.items()
        ],
        "yearly": [
            {
                "date": k,
                **v
            }
            for k, v
            in cashflow_yearly.items()
        ]
    }

    # ====================
    # DASHBOARD
    # ====================

    dashboard = {
        "income": total_income,
        "expense": total_expense,
        "profit": net_profit,
        "profit_margin":
        profit_margin,

        "expense_by_category": [
            {
                "kategori": k,
                "amount": v
            }
            for k, v
            in expense_by_category.items()
        ],

        "income_by_category": [
            {
                "kategori": k,
                "amount": v
            }
            for k, v
            in income_by_category.items()
        ],

        "top_expense": [
            {
                "kategori": k,
                "amount": v
            }
            for k, v
            in top_expense[:5]
        ],

        "top_income": [
            {
                "kategori": k,
                "amount": v
            }
            for k, v
            in top_income[:5]
        ]
    }

    return {
        "dashboard": dashboard,
        "profit_loss": profit_loss,
        "cashflow": cashflow,
        "balance_sheet":
        balance_sheet,
        "transactions":
        transaksi_detail
    }