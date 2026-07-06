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
      <h2>Your groups</h2>

      <div className="card">
        <form onSubmit={handleCreate}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New group name"
          />
          <button type="submit">Create group</button>
        </form>
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="empty-state">Loading groups…</p>
      ) : groups.length === 0 ? (
        <p className="empty-state">No groups yet — create one above to get started.</p>
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
