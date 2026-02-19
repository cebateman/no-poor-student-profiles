"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const STATUS_OPTIONS = ["active", "graduated", "alumni", "withdrawn"];

export default function NewStudentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [preferredName, setPreferredName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [enrollmentYear, setEnrollmentYear] = useState(
    new Date().getFullYear().toString()
  );
  const [enrollmentGrade, setEnrollmentGrade] = useState("1");
  const [homeCommunity, setHomeCommunity] = useState("");
  const [status, setStatus] = useState("active");
  const [isPublic, setIsPublic] = useState(true);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !preferredName.trim() || !dateOfBirth || !homeCommunity.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("npa_token")}`,
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          preferredName: preferredName.trim(),
          dateOfBirth,
          enrollmentYear: parseInt(enrollmentYear),
          enrollmentGrade: parseInt(enrollmentGrade),
          homeCommunity: homeCommunity.trim(),
          status,
          isPublic,
        }),
      });

      if (res.status === 401) {
        localStorage.removeItem("npa_token");
        router.replace("/admin/login");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create student.");
        setLoading(false);
        return;
      }

      router.push(`/admin/students/${data.id}`);
    } catch {
      setError("Network error. Please try again.");
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
          Dashboard
        </Link>
        <span style={{ color: "#d1d5db", margin: "0 8px", fontSize: "14px" }}>/</span>
        <span style={{ color: "#111827", fontSize: "14px", fontWeight: 500 }}>
          New Student
        </span>
      </div>

      <h1
        style={{
          margin: "0 0 24px",
          fontSize: "24px",
          fontWeight: 700,
          color: "#111827",
        }}
      >
        Add New Student
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            {/* Full Name */}
            <div>
              <label style={labelStyle}>
                Full Name <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={inputStyle}
                placeholder="e.g. Maria Josefa Nhampossa"
              />
            </div>

            {/* Preferred Name */}
            <div>
              <label style={labelStyle}>
                Preferred Name <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                type="text"
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
                required
                style={inputStyle}
                placeholder="e.g. Maria"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label style={labelStyle}>
                Date of Birth <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            {/* Home Community */}
            <div>
              <label style={labelStyle}>
                Home Community <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                type="text"
                value={homeCommunity}
                onChange={(e) => setHomeCommunity(e.target.value)}
                required
                style={inputStyle}
                placeholder="e.g. Machava"
              />
            </div>

            {/* Enrollment Year */}
            <div>
              <label style={labelStyle}>
                Enrollment Year <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                type="number"
                value={enrollmentYear}
                onChange={(e) => setEnrollmentYear(e.target.value)}
                required
                min="2000"
                max="2099"
                style={inputStyle}
              />
            </div>

            {/* Enrollment Grade */}
            <div>
              <label style={labelStyle}>
                Enrollment Grade <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <select
                value={enrollmentGrade}
                onChange={(e) => setEnrollmentGrade(e.target.value)}
                style={inputStyle}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                  <option key={g} value={g}>
                    Grade {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label style={labelStyle}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={inputStyle}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Is Public */}
            <div style={{ display: "flex", alignItems: "end" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#374151",
                  padding: "10px 0",
                }}
              >
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  style={{
                    width: "18px",
                    height: "18px",
                    accentColor: "#166534",
                    cursor: "pointer",
                  }}
                />
                Visible on public website
              </label>
            </div>
          </div>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "32px",
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
                backgroundColor: loading ? "#86efac" : "#166534",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Creating..." : "Create Student"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin")}
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
              Cancel
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
