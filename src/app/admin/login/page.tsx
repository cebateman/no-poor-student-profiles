"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Locale, t } from "@/lib/i18n";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("npa_admin_locale") as Locale | null;
    if (saved === "en" || saved === "pt") {
      setLocale(saved);
    }
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("login.invalidCredentials", locale));
        setLoading(false);
        return;
      }

      localStorage.setItem("npa_token", data.token);
      router.replace("/");
    } catch {
      setError(t("login.networkError", locale));
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#CEDBD5",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px", padding: "0 16px" }}>
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
            padding: "40px 32px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "56px",
                height: "56px",
                borderRadius: "12px",
                backgroundColor: "#335D63",
                color: "#ffffff",
                fontSize: "24px",
                fontWeight: 700,
                marginBottom: "16px",
              }}
            >
              NPA
            </div>
            <h1 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: 700, color: "#271609" }}>
              {t("login.title", locale)}
            </h1>
            <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
              {t("login.subtitle", locale)}
            </p>
          </div>

          {/* Language Toggle */}
          <div
            style={{
              display: "flex",
              gap: "2px",
              marginBottom: "20px",
              padding: "2px",
              borderRadius: "6px",
              backgroundColor: "#f3f4f6",
            }}
          >
            <button
              type="button"
              onClick={() => { setLocale("en"); localStorage.setItem("npa_admin_locale", "en"); }}
              style={{
                flex: 1, padding: "6px 0", border: "none", borderRadius: "4px",
                backgroundColor: locale === "en" ? "#ffffff" : "transparent",
                color: locale === "en" ? "#335D63" : "#6b7280",
                fontSize: "12px", fontWeight: locale === "en" ? 600 : 400,
                cursor: "pointer",
                boxShadow: locale === "en" ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
              }}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => { setLocale("pt"); localStorage.setItem("npa_admin_locale", "pt"); }}
              style={{
                flex: 1, padding: "6px 0", border: "none", borderRadius: "4px",
                backgroundColor: locale === "pt" ? "#ffffff" : "transparent",
                color: locale === "pt" ? "#335D63" : "#6b7280",
                fontSize: "12px", fontWeight: locale === "pt" ? 600 : 400,
                cursor: "pointer",
                boxShadow: locale === "pt" ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
              }}
            >
              Portugues
            </button>
          </div>

          {error && (
            <div
              style={{
                padding: "10px 14px", marginBottom: "20px", borderRadius: "8px",
                backgroundColor: "#fef2f2", border: "1px solid #fecaca",
                color: "#dc2626", fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label htmlFor="username" style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 500, color: "#374151" }}>
                {t("login.username", locale)}
              </label>
              <input
                id="username" type="text" value={username}
                onChange={(e) => setUsername(e.target.value)}
                required autoComplete="username"
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "border-color 0.15s" }}
                onFocus={(e) => (e.target.style.borderColor = "#335D63")}
                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label htmlFor="password" style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 500, color: "#374151" }}>
                {t("login.password", locale)}
              </label>
              <input
                id="password" type="password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                required autoComplete="current-password"
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "border-color 0.15s" }}
                onFocus={(e) => (e.target.style.borderColor = "#335D63")}
                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              />
            </div>
            <button
              type="submit" disabled={loading}
              style={{
                width: "100%", padding: "12px", border: "none", borderRadius: "8px",
                backgroundColor: loading ? "#8FBFC4" : "#335D63", color: "#ffffff",
                fontSize: "14px", fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer", transition: "background-color 0.15s",
              }}
            >
              {loading ? t("login.signingIn", locale) : t("login.signIn", locale)}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
