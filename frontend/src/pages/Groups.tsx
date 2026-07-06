import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { Group } from "../types";

export default function Groups() {
  const [name, setName] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .listGroups()
      .then(setGroups)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const group = await api.createGroup(name);
      setGroups([...groups, group]);
      setName("");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="page">
      <h2>your squads 🐍</h2>

      <div className="card">
        <form onSubmit={handleCreate}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="squad name"
          />
          <button type="submit">start a squad</button>
        </form>
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="empty-state">loading your squads…</p>
      ) : groups.length === 0 ? (
        <p className="empty-state">no squads yet — start one up there ☝️</p>
      ) : (
        <ul className="list">
          {groups.map((g) => (
            <li key={g.id}>
              <Link to={`/groups/${g.id}`}>{g.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
