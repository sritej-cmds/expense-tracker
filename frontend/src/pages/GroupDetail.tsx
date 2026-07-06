import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import type { Expense, BalanceEntry, Group } from "../types";

export default function GroupDetail() {
  const { groupId } = useParams();
  const id = Number(groupId);

  const [group, setGroup] = useState<Group | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balances, setBalances] = useState<BalanceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState("");

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const [newMemberId, setNewMemberId] = useState("");

  const [settleTo, setSettleTo] = useState("");
  const [settleAmount, setSettleAmount] = useState("");

  function nameFor(userId: number) {
    const member = group?.members?.find((m) => m.id === userId);
    return member ? member.name : `User ${userId}`;
  }

  async function loadAll() {
    setLoading(true);
    try {
      setGroup(await api.getGroup(id));
      setExpenses(await api.listExpenses(id));
      setBalances(await api.getBalances(id));
    } catch (err) {
      setActionError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleAddExpense(e: React.FormEvent) {
    e.preventDefault();
    setActionError("");
    try {
      const participants = (group?.members || []).map((m) => ({ user_id: m.id }));
      await api.addExpense(id, {
        description,
        amount: Number(amount),
        split_type: "equal",
        participants,
      });
      setDescription("");
      setAmount("");
      loadAll();
    } catch (err) {
      setActionError((err as Error).message);
    }
  }

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    setActionError("");
    try {
      await api.addMember(id, Number(newMemberId));
      setNewMemberId("");
      loadAll();
    } catch (err) {
      setActionError((err as Error).message);
    }
  }

  async function handleSettleUp(e: React.FormEvent) {
    e.preventDefault();
    setActionError("");
    try {
      await api.settleUp(id, {
        paid_to: Number(settleTo),
        amount: Number(settleAmount),
      });
      setSettleTo("");
      setSettleAmount("");
      loadAll();
    } catch (err) {
      setActionError((err as Error).message);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <p className="empty-state">Loading group…</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>{group?.name}</h2>

      {actionError && <p className="error">{actionError}</p>}

      <h3>Members</h3>
      <div className="card">
        {group?.members && group.members.length > 0 ? (
          <ul className="list">
            {group.members.map((m) => (
              <li key={m.id}>
                <span>{m.name}</span>
                <span className="empty-state">{m.email}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-state">No members yet.</p>
        )}
        <form onSubmit={handleAddMember} style={{ marginTop: "1rem" }}>
          <input
            value={newMemberId}
            onChange={(e) => setNewMemberId(e.target.value)}
            placeholder="User ID to add"
            type="number"
          />
          <button type="submit">Add member</button>
        </form>
      </div>

      <h3>Add an expense</h3>
      <div className="card">
        <form onSubmit={handleAddExpense}>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            type="number"
          />
          <button type="submit">Add expense</button>
        </form>
      </div>

      <h3>Expenses</h3>
      {expenses.length === 0 ? (
        <p className="empty-state">No expenses yet.</p>
      ) : (
        <ul className="list">
          {expenses.map((e) => (
            <li key={e.id}>
              <span>
                {e.description}{" "}
                <span className="empty-state">— paid by {nameFor(e.paid_by)}</span>
              </span>
              <span className="amount">Rs.{e.amount}</span>
            </li>
          ))}
        </ul>
      )}

      <h3>Balances</h3>
      {balances.length === 0 ? (
        <p className="empty-state">Everyone's settled up.</p>
      ) : (
        <ul className="list">
          {balances.map((b, i) => (
            <li key={i}>
              <span>
                {nameFor(b.from_user)} owes {nameFor(b.to_user)}
              </span>
              <span className="amount you-owe">Rs.{b.amount}</span>
            </li>
          ))}
        </ul>
      )}

      <h3>Settle up</h3>
      <div className="card">
        <form onSubmit={handleSettleUp}>
          <input
            value={settleTo}
            onChange={(e) => setSettleTo(e.target.value)}
            placeholder="Paid to (user ID)"
            type="number"
          />
          <input
            value={settleAmount}
            onChange={(e) => setSettleAmount(e.target.value)}
            placeholder="Amount"
            type="number"
          />
          <button type="submit">Record settlement</button>
        </form>
      </div>
    </div>
  );
}
