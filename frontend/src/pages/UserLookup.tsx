import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { User } from "../types";

export default function UserLookup() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    api
      .listUsers(search || undefined)
      .then(setUsers)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <div className="page">
      <h2>find people</h2>

      <div className="card">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="search by name or email"
        />
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="empty-state">looking around...</p>
      ) : users.length === 0 ? (
        <p className="empty-state">no one matches that - try a different search</p>
      ) : (
        <ul className="list">
          {users.map((u) => (
            <li key={u.id}>
              <div>
                <strong>{u.name}</strong>
                <br />
                <span className="empty-state">{u.email}</span>
              </div>
              <span className="amount">#{u.id}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
