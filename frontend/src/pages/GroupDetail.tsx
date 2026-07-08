import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import type { Expense, BalanceEntry, Group, User } from "../types";

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

  const [memberSearch, setMemberSearch] = useState("");
  const [memberResults, setMemberResults] = useState<User[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

  const [settleTo, setSettleTo] = useState("");
  const [settleAmount, setSettleAmount] = useState("");
  const settleFormRef = useRef<HTMLDivElement>(null);

function prefillSettle(toUserId: number, amount: number) {
  setSettleTo(String(toUserId));
  setSettleAmount(String(amount));
  settleFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
}

  function nameFor(userId: number) {
    const member = group?.members?.find((m) => m.id === userId);
    return member ? member.name : `user ${userId}`;
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

  useEffect(() => {
    if (memberSearch.trim().length === 0) {
      setMemberResults([]);
      return;
    }
    const timeout = setTimeout(() => {
      api
        .listUsers(memberSearch)
        .then(setMemberResults)
        .catch(() => setMemberResults([]));
    }, 300);
    return () => clearTimeout(timeout);
  }, [memberSearch]);

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
    if (selectedMemberId === null) {
      setActionError("pick someone from the search results first");
      return;
    }
    try {
      await api.addMember(id, selectedMemberId);
      setMemberSearch("");
      setMemberResults([]);
      setSelectedMemberId(null);
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
        <p className="empty-state">loading the squad...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>{group?.name}</h2>

      {actionError && <p className="error">{actionError}</p>}

      <h3>the crew</h3>
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
          <p className="empty-state">nobody's here yet.</p>
        )}

        <form onSubmit={handleAddMember} style={{ marginTop: "1rem" }}>
          <input
            value={memberSearch}
            onChange={(e) => {
              setMemberSearch(e.target.value);
              setSelectedMemberId(null);
            }}
            placeholder="search by name or email"
          />
          {memberResults.length > 0 && selectedMemberId === null && (
            <ul className="list">
              {memberResults.map((u) => (
                <li
                  key={u.id}
                  onClick={() => {
                    setSelectedMemberId(u.id);
                    setMemberSearch(`${u.name} (${u.email})`);
                    setMemberResults([]);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <span>{u.name}</span>
                  <span className="empty-state">{u.email}</span>
                </li>
              ))}
            </ul>
          )}
          <button type="submit">add to crew</button>
        </form>
      </div>

      <h3>add the damage</h3>
      <div className="card">
        <form onSubmit={handleAddExpense}>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="what was it"
          />
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="how much"
            type="number"
          />
          <button type="submit">log it</button>
        </form>
      </div>

      <h3>the damage so far</h3>
      {expenses.length === 0 ? (
        <p className="empty-state">nothing logged yet, we broke or fine?</p>
      ) : (
        <ul className="list">
          {expenses.map((e) => (
            <li key={e.id}>
              <span>
                {e.description}{" "}
                <span className="empty-state">— {nameFor(e.paid_by)} paid</span>
              </span>
              <span className="amount">Rs.{e.amount}</span>
            </li>
          ))}
        </ul>
      )}

      <h3>the tea</h3>
      {balances.length === 0 ? (
        <p className="empty-state">everyone's square, no cap</p>
      ) : (
        <ul className="list">
  {balances.map((b, i) => (
    <li key={i}>
      <span>
        {nameFor(b.from_user)} owes {nameFor(b.to_user)}
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span className="amount you-owe">Rs.{b.amount}</span>
        <button
          type="button"
          onClick={() => prefillSettle(b.to_user, b.amount)}
        >
          settle up
        </button>
      </span>
    </li>
  ))}
</ul>
      )}

      <h3>squash the beef</h3>
      <div className="card" ref={settleFormRef}>
        <form onSubmit={handleSettleUp}>
          <select
            value={settleTo}
            onChange={(e) => setSettleTo(e.target.value)}
          >
            <option value="">pay who?</option>
            {(group?.members || []).map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.email})
              </option>
            ))}
          </select>
          <input
            value={settleAmount}
            onChange={(e) => setSettleAmount(e.target.value)}
            placeholder="how much"
            type="number"
            step="0.01"
            min="0.01"
/>
          <button type="submit">pay up</button>
        </form>
      </div>
    </div>
  );
}
