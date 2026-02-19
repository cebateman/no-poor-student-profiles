"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";

export default function AdminSettingsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [heroBackgroundUrl, setHeroBackgroundUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/admin/settings", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("npa_token")}`,
          },
        });
        if (res.status === 401) {
          localStorage.removeItem("npa_token");
          router.replace("/admin/login");
          return;
        }
        const data = await res.json();
        setHeroBackgroundUrl(data.heroBackgroundUrl || null);
      } catch {
        setMessage({ type: "error", text: t("settings.failedLoad") });
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, [router]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setMessage(null);
  }

  async function handleSave() {
    if (!selectedFile) return;
    setSaving(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("heroBackground", selectedFile);

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("npa_token")}`,
        },
        body: formData,
      });

      if (res.status === 401) {
        localStorage.removeItem("npa_token");
        router.replace("/admin/login");
        return;
      }

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Server error: invalid response");
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to save");
      }
      setHeroBackgroundUrl(data.heroBackgroundUrl);
      setSelectedFile(null);
      setPreviewUrl(null);
      setMessage({ type: "success", text: t("settings.bgUpdated") });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : t("settings.failedSave") });
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove() {
    setSaving(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("removeBackground", "true");

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("npa_token")}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to remove background");
      }

      setHeroBackgroundUrl(null);
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setMessage({ type: "success", text: t("settings.bgRemoved") });
    } catch {
      setMessage({ type: "error", text: t("settings.failedRemove") });
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setMessage(null);
  }

  if (loading) {
    return (
      <div style={{ padding: "60px 0", textAlign: "center", color: "#6b7280", fontSize: "14px" }}>
        {t("settings.loadingSettings")}
      </div>
    );
  }

  const displayUrl = previewUrl || heroBackgroundUrl;

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: "#271609" }}>
          {t("settings.title")}
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#6b7280" }}>
          {t("settings.subtitle")}
        </p>
      </div>

      {message && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: "16px",
            borderRadius: "8px",
            backgroundColor: message.type === "success" ? "#f0fdf4" : "#fef2f2",
            border: `1px solid ${message.type === "success" ? "#bbf7d0" : "#fecaca"}`,
            color: message.type === "success" ? "#16a34a" : "#dc2626",
            fontSize: "14px",
          }}
        >
          {message.text}
        </div>
      )}

      {/* Hero Background Image */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          padding: "24px",
        }}
      >
        <h2 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 600, color: "#271609" }}>
          {t("settings.heroTitle")}
        </h2>
        <p style={{ margin: "0 0 20px", fontSize: "13px", color: "#6b7280" }}>
          {t("settings.heroDescription")}
        </p>

        {/* Preview */}
        {displayUrl ? (
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "640px",
              aspectRatio: "16/9",
              borderRadius: "8px",
              overflow: "hidden",
              marginBottom: "16px",
              border: "1px solid #e5e7eb",
            }}
          >
            <img
              src={displayUrl}
              alt="Hero background preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            {/* Overlay preview showing how text will look */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to bottom, rgba(30, 58, 63, 0.7), rgba(30, 58, 63, 0.5))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p style={{ color: "#ffffff", fontSize: "18px", fontWeight: 700, textAlign: "center" }}>
                {t("settings.heroPreview")}
              </p>
            </div>
            {previewUrl && (
              <div
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  padding: "4px 10px",
                  borderRadius: "4px",
                  backgroundColor: "#F1CB4B",
                  color: "#271609",
                  fontSize: "11px",
                  fontWeight: 600,
                }}
              >
                {t("settings.unsaved")}
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              maxWidth: "640px",
              aspectRatio: "16/9",
              borderRadius: "8px",
              overflow: "hidden",
              marginBottom: "16px",
              border: "2px dashed #d1d5db",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#1E3A3F",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#ffffff", fontSize: "18px", fontWeight: 700, margin: "0 0 4px" }}>
                {t("settings.heroPreview")}
              </p>
              <p style={{ color: "#6A9A9F", fontSize: "12px", margin: 0 }}>
                {t("settings.defaultBg")}
              </p>
            </div>
          </div>
        )}

        {/* Controls */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={saving}
            style={{
              padding: "10px 20px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              color: "#374151",
              fontSize: "14px",
              fontWeight: 500,
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.6 : 1,
            }}
          >
            {heroBackgroundUrl ? t("settings.changeImage") : t("settings.uploadImage")}
          </button>

          {selectedFile && (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: "#335D63",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving ? t("settings.saving") : t("settings.save")}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: "transparent",
                  color: "#6b7280",
                  fontSize: "14px",
                  cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                {t("form.cancel")}
              </button>
            </>
          )}

          {heroBackgroundUrl && !selectedFile && (
            <button
              onClick={handleRemove}
              disabled={saving}
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                backgroundColor: "transparent",
                color: "#dc2626",
                fontSize: "14px",
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? t("settings.removing") : t("settings.removeImage")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
