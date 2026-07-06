from sqlalchemy.orm import Session
from app.models.expense import Expense
from app.models.settlement import Settlement


def compute_net_balances(db: Session, group_id: int) -> dict[int, float]:
    net: dict[int, float] = {}

    expenses = db.query(Expense).filter(Expense.group_id == group_id).all()
    for exp in expenses:
        net[exp.paid_by] = net.get(exp.paid_by, 0) + exp.amount
        for split in exp.splits:
            net[split.user_id] = net.get(split.user_id, 0) - split.share_amount

    settlements = db.query(Settlement).filter(Settlement.group_id == group_id).all()
    for s in settlements:
        net[s.paid_by] = net.get(s.paid_by, 0) + s.amount
        net[s.paid_to] = net.get(s.paid_to, 0) - s.amount

    return {uid: round(amt, 2) for uid, amt in net.items() if abs(amt) > 0.01}


def simplify_debts(net_balances: dict[int, float]) -> list[dict]:
    creditors = [[uid, amt] for uid, amt in net_balances.items() if amt > 0]
    debtors = [[uid, -amt] for uid, amt in net_balances.items() if amt < 0]

    creditors.sort(key=lambda x: -x[1])
    debtors.sort(key=lambda x: -x[1])

    transactions = []
    i, j = 0, 0
    while i < len(debtors) and j < len(creditors):
        debtor_id, debt_amt = debtors[i]
        creditor_id, credit_amt = creditors[j]

        settled = min(debt_amt, credit_amt)
        transactions.append(
            {"from_user": debtor_id, "to_user": creditor_id, "amount": round(settled, 2)}
        )

        debtors[i][1] -= settled
        creditors[j][1] -= settled

        if debtors[i][1] <= 0.01:
            i += 1
        if creditors[j][1] <= 0.01:
            j += 1

    return transactions
    