"use client";

import { useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

interface CustomField {
  key: string;
  value: string;
}

const LANGUAGE_KEYS = ["Portuguese", "English", "Local Language"] as const;

export default function SnapshotFormPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;
  const { t } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form fields
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [gradeAtTime, setGradeAtTime] = useState("1");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [storyText, setStoryText] = useState("");
  const [storyLanguage, setStoryLanguage] = useState("Portuguese");
  const [storyTranslation, setStoryTranslation] = useState("");
  const [dreamCareer, setDreamCareer] = useState("");
  const [favoriteSubject, setFavoriteSubject] = useState("");
  const [academicNotes, setAcademicNotes] = useState("");
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function addCustomField() {
    setCustomFields([...customFields, { key: "", value: "" }]);
  }

  function updateCustomField(
    index: number,
    field: "key" | "value",
    val: string
  ) {
    const updated = [...customFields];
    updated[index][field] = val;
    setCustomFields(updated);
  }

  function removeCustomField(index: number) {
    setCustomFields(customFields.filter((_, i) => i !== index));
  }

  const languageDisplayNames: Record<string, () => string> = {
    Portuguese: () => t("snapshotForm.portuguese"),
    English: () => t("snapshotForm.english"),
    "Local Language": () => t("snapshotForm.localLanguage"),
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!year || !gradeAtTime) {
      setError(t("snapshotForm.yearRequired"));
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("year", year);
      formData.append("gradeAtTime", gradeAtTime);

      if (photo) {
        formData.append("photo", photo);
      }
      if (storyText.trim()) {
        formData.append("storyText", storyText.trim());
      }
      formData.append("storyLanguage", storyLanguage);
      if (storyTranslation.trim()) {
        formData.append("storyTranslation", storyTranslation.trim());
      }
      if (dreamCareer.trim()) {
        formData.append("dreamCareer", dreamCareer.trim());
      }
      if (favoriteSubject.trim()) {
        formData.append("favoriteSubject", favoriteSubject.trim());
      }
      if (academicNotes.trim()) {
        formData.append("academicNotes", academicNotes.trim());
      }

      // Build extraData from custom fields
      const validFields = customFields.filter(
        (f) => f.key.trim() && f.value.trim()
      );
      if (validFields.length > 0) {
        const extraData: Record<string, string> = {};
        for (const f of validFields) {
          extraData[f.key.trim()] = f.value.trim();
        }
        formData.append("extraData", JSON.stringify(extraData));
      }

      const res = await fetch(`/api/admin/students/${studentId}/snapshots`, {
        method: "POST",
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

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t("snapshotForm.failedCreate"));
      }

      router.push(`/admin/students/${studentId}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("snapshotForm.failedCreate")
      );
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ marginBottom: "24px" }}>
        <Link
          href="/admin"
          style={{
            color: "#6b7280",
            textDecoration: "none",
            fontSize: "14px",
          }}
        >
          {t("nav.dashboard")}
        </Link>
        <span style={{ color: "#d1d5db", margin: "0 8px", fontSize: "14px" }}>
          /
        </span>
        <Link
          href={`/admin/students/${studentId}`}
          style={{
            color: "#6b7280",
            textDecoration: "none",
            fontSize: "14px",
          }}
        >
          {t("snapshotForm.breadcrumbStudent")}
        </Link>
        <span style={{ color: "#d1d5db", margin: "0 8px", fontSize: "14px" }}>
          /
        </span>
        <span style={{ color: "#271609", fontSize: "14px", fontWeight: 500 }}>
          {t("snapshotForm.breadcrumbNew")}
        </span>
      </div>

      <h1
        style={{
          margin: "0 0 24px",
          fontSize: "24px",
          fontWeight: 700,
          color: "#271609",
        }}
      >
        {t("snapshotForm.title")}
      </h1>

      {/* Error */}
      {error && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: "20px",
            borderRadius: "8px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {/* Form Card */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          padding: "32px",
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* Year & Grade Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "24px",
            }}
          >
            <div>
              <label style={labelStyle}>
                {t("snapshotForm.year")} <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
                min="2000"
                max="2099"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>
                {t("snapshot.gradeAtTime")} <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <select
                value={gradeAtTime}
                onChange={(e) => setGradeAtTime(e.target.value)}
                style={inputStyle}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                  <option key={g} value={g}>
                    {`${t("form.grade")} ${g}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Photo Upload */}
          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>{t("snapshotForm.snapshotPhoto")}</label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Preview"
                  style={{
                    width: "100px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                  }}
                />
              )}
              <label
                style={{
                  padding: "10px 20px",
                  border: "1px dashed #d1d5db",
                  borderRadius: "8px",
                  backgroundColor: "#f9fafb",
                  color: "#6b7280",
                  fontSize: "14px",
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                {photo ? photo.name : t("snapshotForm.choosePhoto")}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          </div>

          {/* Story Section */}
          <div
            style={{
              borderTop: "1px solid #e5e7eb",
              paddingTop: "24px",
              marginBottom: "24px",
            }}
          >
            <h3
              style={{
                margin: "0 0 16px",
                fontSize: "15px",
                fontWeight: 600,
                color: "#271609",
              }}
            >
              {t("snapshotForm.studentStory")}
            </h3>

            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>{t("snapshotForm.storyLanguage")}</label>
              <select
                value={storyLanguage}
                onChange={(e) => setStoryLanguage(e.target.value)}
                style={{ ...inputStyle, maxWidth: "300px" }}
              >
                {LANGUAGE_KEYS.map((lang) => (
                  <option key={lang} value={lang}>
                    {languageDisplayNames[lang]()}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>{t("snapshotForm.storyTextLabel")}</label>
              <textarea
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                rows={4}
                placeholder={t("snapshotForm.storyTextPlaceholder")}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  minHeight: "100px",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div>
              <label style={labelStyle}>{t("snapshotForm.translationLabel")}</label>
              <textarea
                value={storyTranslation}
                onChange={(e) => setStoryTranslation(e.target.value)}
                rows={4}
                placeholder={t("snapshotForm.translationPlaceholder")}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  minHeight: "100px",
                  fontFamily: "inherit",
                }}
              />
            </div>
          </div>

          {/* Interests & Academics */}
          <div
            style={{
              borderTop: "1px solid #e5e7eb",
              paddingTop: "24px",
              marginBottom: "24px",
            }}
          >
            <h3
              style={{
                margin: "0 0 16px",
                fontSize: "15px",
                fontWeight: 600,
                color: "#271609",
              }}
            >
              {t("snapshotForm.interestsTitle")}
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginBottom: "16px",
              }}
            >
              <div>
                <label style={labelStyle}>{t("snapshot.dreamCareer")}</label>
                <input
                  type="text"
                  value={dreamCareer}
                  onChange={(e) => setDreamCareer(e.target.value)}
                  placeholder={t("snapshotForm.dreamCareerPlaceholder")}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>{t("snapshot.favoriteSubject")}</label>
                <input
                  type="text"
                  value={favoriteSubject}
                  onChange={(e) => setFavoriteSubject(e.target.value)}
                  placeholder={t("snapshotForm.favoriteSubjectPlaceholder")}
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>{t("snapshot.academicNotes")}</label>
              <textarea
                value={academicNotes}
                onChange={(e) => setAcademicNotes(e.target.value)}
                rows={3}
                placeholder={t("snapshotForm.academicNotesPlaceholder")}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  minHeight: "80px",
                  fontFamily: "inherit",
                }}
              />
            </div>
          </div>

          {/* Custom Fields */}
          <div
            style={{
              borderTop: "1px solid #e5e7eb",
              paddingTop: "24px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#271609",
                }}
              >
                {t("snapshotForm.customFields")}
              </h3>
              <button
                type="button"
                onClick={addCustomField}
                style={{
                  padding: "6px 14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  backgroundColor: "#ffffff",
                  color: "#374151",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                {t("snapshotForm.addCustomField")}
              </button>
            </div>

            {customFields.length === 0 ? (
              <p
                style={{
                  color: "#9ca3af",
                  fontSize: "13px",
                  margin: 0,
                  fontStyle: "italic",
                }}
              >
                {t("snapshotForm.noCustomFields")}
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {customFields.map((field, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="text"
                      value={field.key}
                      onChange={(e) =>
                        updateCustomField(index, "key", e.target.value)
                      }
                      placeholder={t("snapshotForm.key")}
                      style={{ ...inputStyle, flex: "1" }}
                    />
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) =>
                        updateCustomField(index, "value", e.target.value)
                      }
                      placeholder={t("snapshotForm.value")}
                      style={{ ...inputStyle, flex: "2" }}
                    />
                    <button
                      type="button"
                      onClick={() => removeCustomField(index)}
                      style={{
                        padding: "8px 12px",
                        border: "1px solid #fecaca",
                        borderRadius: "6px",
                        backgroundColor: "#fef2f2",
                        color: "#dc2626",
                        fontSize: "13px",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {t("snapshotForm.remove")}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              paddingTop: "24px",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 24px",
                border: "none",
                borderRadius: "8px",
                backgroundColor: loading ? "#8FBFC4" : "#335D63",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? t("form.saving") : t("snapshotForm.saveSnapshot")}
            </button>
            <button
              type="button"
              onClick={() => router.push(`/admin/students/${studentId}`)}
              style={{
                padding: "10px 24px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                backgroundColor: "#ffffff",
                color: "#374151",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {t("form.cancel")}
            </button>
          </div>
        </form>
      </div>
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
