import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { User } from "../types";

export default function UserLookup() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const query = search.trim();

    if (!query) {
      setUsers([]);
      setLoading(false);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    api
      .listUsers(query)
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

      {search.trim() === "" ? null : loading ? (
        <p className="empty-state">looking around...</p>
      ) : users.length === 0 ? (
        <p className="empty-state">
          no one matches that - try a different search
        </p>
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