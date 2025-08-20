"use client";

import { useEffect, useState } from "react";
import { getProfile, login, logout, signup } from "@/lib/api";

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [me, setMe] = useState<{ id: string; email: string } | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      setChecking(true);
      const profile = await getProfile();
      setMe(profile);
      setChecking(false);
    })();
  }, []);

  async function handleAuth() {
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      if (mode === "signin") {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      const profile = await getProfile();
      setMe(profile);
      setEmail("");
      setPassword("");
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Authentication failed";
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  function handleLogout() {
    logout();
    setMe(null);
  }

  return (
    <div className="max-w-md mx-auto">
      <header className="mb-6">
        <h2 className="text-xl font-semibold">Authentication</h2>
        <p className="text-sm text-slate-500">
          {checking ? "Checking session..." : me ? `Signed in as ${me.email}` : "You are not signed in."}
        </p>
      </header>

      <div className="card p-4">
        {me ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{me.email}</p>
              <p className="text-sm text-slate-500">You are authenticated.</p>
            </div>
            <button className="btn secondary" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-2 mb-4">
              <button
                className={`btn secondary ${mode === "signin" ? "!bg-[var(--color-primary)] !text-white !border-transparent" : ""}`}
                onClick={() => setMode("signin")}
              >
                Sign In
              </button>
              <button
                className={`btn secondary ${mode === "signup" ? "!bg-[var(--color-primary)] !text-white !border-transparent" : ""}`}
                onClick={() => setMode("signup")}
              >
                Sign Up
              </button>
            </div>

            <div className="grid gap-3">
              <input
                className="input"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <input
                className="input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              {error && (
                <div className="p-3 border border-rose-200 bg-rose-50 text-rose-700 rounded-md">
                  {error}
                </div>
              )}
              <button className="btn" onClick={handleAuth} disabled={busy}>
                {busy ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
              </button>
              <p className="text-xs text-slate-500">
                After signing in, return to the notes list to create and save notes.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
