"use client";

import { useEffect, useState, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";

interface AdminUser {
  id: string;
  username: string;
  name: string;
  createdAt: string;
}

export default function ManageAdminsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Create form
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const authHeaders = useCallback(() => ({
    Authorization: `Bearer ${localStorage.getItem("npa_token")}`,
  }), []);

  const fetchAdmins = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/admins", { headers: authHeaders() });
      if (res.status === 401) {
        localStorage.removeItem("npa_token");
        router.replace("/admin/login");
        return;
      }
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAdmins(data);
    } catch {
      setMessage({ type: "error", text: t("admins.failedLoad") });
    } finally {
      setLoading(false);
    }
  }, [authHeaders, router, t]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setCreating(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          name: newName.trim(),
          username: newUsername.trim(),
          password: newPassword,
        }),
      });

      if (res.status === 401) {
        localStorage.removeItem("npa_token");
        router.replace("/admin/login");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t("admins.failedCreate"));
      }

      setMessage({ type: "success", text: t("admins.createdSuccess") });
      setNewName("");
      setNewUsername("");
      setNewPassword("");
      setShowForm(false);
      await fetchAdmins();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : t("admins.failedCreate") });
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t("admins.confirmDelete"))) return;

    setDeletingId(id);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/admins?id=${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.error === "Cannot delete your own account") {
          throw new Error(t("admins.cannotDeleteSelf"));
        }
        throw new Error(data.error || t("admins.failedDelete"));
      }

      setMessage({ type: "success", text: t("admins.deletedSuccess") });
      await fetchAdmins();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : t("admins.failedDelete") });
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "60px 0", textAlign: "center", color: "#6b7280", fontSize: "14px" }}>
        {t("admins.loadingAdmins")}
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: "#271609" }}>
            {t("admins.title")}
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#6b7280" }}>
            {t("admins.subtitle")}
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: "10px 20px", border: "none", borderRadius: "8px",
              backgroundColor: "#335D63", color: "#ffffff",
              fontSize: "14px", fontWeight: 600, cursor: "pointer",
            }}
          >
            {t("admins.addNew")}
          </button>
        )}
      </div>

      {message && (
        <div
          style={{
            padding: "12px 16px", marginBottom: "16px", borderRadius: "8px",
            backgroundColor: message.type === "success" ? "#f0fdf4" : "#fef2f2",
            border: `1px solid ${message.type === "success" ? "#bbf7d0" : "#fecaca"}`,
            color: message.type === "success" ? "#16a34a" : "#dc2626",
            fontSize: "14px",
          }}
        >
          {message.text}
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <div
          style={{
            backgroundColor: "#ffffff", borderRadius: "12px",
            border: "1px solid #e5e7eb", padding: "24px", marginBottom: "24px",
          }}
        >
          <h2 style={{ margin: "0 0 20px", fontSize: "17px", fontWeight: 600, color: "#271609" }}>
            {t("admins.createTitle")}
          </h2>
          <form onSubmit={handleCreate}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              <div>
                <label style={labelStyle}>
                  {t("admins.name")} <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  type="text" value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required placeholder={t("admins.namePlaceholder")}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  {t("admins.username")} <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  type="text" value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required placeholder={t("admins.usernamePlaceholder")}
                  autoComplete="off"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  {t("admins.password")} <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  type="password" value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required minLength={6}
                  placeholder={t("admins.passwordPlaceholder")}
                  autoComplete="new-password"
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="submit" disabled={creating}
                style={{
                  padding: "10px 24px", border: "none", borderRadius: "8px",
                  backgroundColor: creating ? "#8FBFC4" : "#335D63",
                  color: "#ffffff", fontSize: "14px", fontWeight: 600,
                  cursor: creating ? "not-allowed" : "pointer",
                }}
              >
                {creating ? t("admins.creating") : t("admins.createAdmin")}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setNewName(""); setNewUsername(""); setNewPassword(""); }}
                style={{
                  padding: "10px 24px", border: "1px solid #d1d5db", borderRadius: "8px",
                  backgroundColor: "#ffffff", color: "#374151",
                  fontSize: "14px", fontWeight: 500, cursor: "pointer",
                }}
              >
                {t("form.cancel")}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Admin List */}
      {admins.length === 0 ? (
        <div style={{ padding: "60px 0", textAlign: "center", color: "#6b7280", fontSize: "14px" }}>
          {t("admins.noAdmins")}
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "#ffffff", borderRadius: "12px",
            border: "1px solid #e5e7eb", overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                <th style={thStyle}>{t("admins.name")}</th>
                <th style={thStyle}>{t("admins.username")}</th>
                <th style={thStyle}>{t("admins.created")}</th>
                <th style={{ ...thStyle, textAlign: "center", width: "100px" }}>{t("admins.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={tdStyle}>
                    <span style={{ fontWeight: 500, color: "#271609" }}>{admin.name}</span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ color: "#6b7280" }}>{admin.username}</span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ color: "#6b7280", fontSize: "13px" }}>
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    <button
                      onClick={() => handleDelete(admin.id)}
                      disabled={deletingId === admin.id}
                      style={{
                        padding: "4px 12px", border: "1px solid #fecaca", borderRadius: "6px",
                        backgroundColor: "#fef2f2", color: "#dc2626",
                        fontSize: "12px", cursor: deletingId === admin.id ? "not-allowed" : "pointer",
                        opacity: deletingId === admin.id ? 0.6 : 1,
                      }}
                    >
                      {deletingId === admin.id ? t("admins.deleting") : t("admins.delete")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "6px",
  fontSize: "14px",
  fontWeight: 500,
  color: "#374151",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
  backgroundColor: "#ffffff",
};

const thStyle: React.CSSProperties = {
  padding: "12px 16px",
  fontSize: "12px",
  fontWeight: 600,
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  textAlign: "left",
};

const tdStyle: React.CSSProperties = {
  padding: "12px 16px",
};
