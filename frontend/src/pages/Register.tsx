import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

function getPasswordChecks(password: string) {
  return [
    { label: "at least 8 characters", pass: password.length >= 8 },
    { label: "an uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "a lowercase letter", pass: /[a-z]/.test(password) },
    { label: "a digit", pass: /\d/.test(password) },
    { label: "a special character", pass: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];
}

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const passwordChecks = getPasswordChecks(password);
  const nameValid = /^[A-Za-z0-9_ ]{3,30}$/.test(name);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.register({ name, email, password });
      navigate("/login");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h2>join the chaos</h2>
        <form onSubmit={handleSubmit}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="your name"
          />
          {name.length > 0 && (
            <p className={nameValid ? "hint hint-ok" : "hint hint-bad"}>
              3-30 characters, letters/numbers/spaces/underscores only
            </p>
          )}

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            type="email"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="password"
          />
          {password.length > 0 && (
            <ul className="password-hints">
              {passwordChecks.map((check) => (
                <li key={check.label} className={check.pass ? "hint-ok" : "hint-bad"}>
                  {check.label}
                </li>
              ))}
            </ul>
          )}

          <button type="submit">count me in</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
