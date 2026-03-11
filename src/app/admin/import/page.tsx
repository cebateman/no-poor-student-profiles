"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

interface PreviewRow {
  fullName: string;
  preferredName: string;
  dateOfBirth: string;
  enrollmentYear: number;
  enrollmentGrade: number;
  homeCommunity: string;
  status: string;
  isPublic: boolean;
  graduationYear: number | null;
}

interface ValidationError {
  row: number;
  message: string;
}

interface PreviewResult {
  totalRows: number;
  validRows: number;
  errors: ValidationError[];
  preview: PreviewRow[];
}

interface ImportResult {
  imported: number;
  totalRows: number;
  errors: ValidationError[];
}

export default function CSVImportPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(null);
      setImportResult(null);
      setError("");
    }
  }

  async function handlePreview() {
    if (!file) return;
    setLoading(true);
    setError("");
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("preview", "true");

      const res = await fetch("/api/admin/students/import", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("npa_token")}`,
        },
        body: formData,
      });

      if (res.status === 401) {
        localStorage.removeItem("npa_token");
        router.replace("/login");
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setError(data.error + (data.hint ? ` (${data.hint})` : ""));
        return;
      }

      setPreview(data);
    } catch {
      setError("Failed to preview CSV file.");
    } finally {
      setLoading(false);
    }
  }

  async function handleImport() {
    if (!file) return;
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/students/import", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("npa_token")}`,
        },
        body: formData,
      });

      if (res.status === 401) {
        localStorage.removeItem("npa_token");
        router.replace("/login");
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to import students.");
        return;
      }

      setImportResult(data);
      setPreview(null);
    } catch {
      setError("Failed to import CSV file.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setFile(null);
    setPreview(null);
    setImportResult(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ marginBottom: "24px" }}>
        <Link
          href="/"
          style={{ color: "#6b7280", textDecoration: "none", fontSize: "14px" }}
        >
          {t("nav.dashboard")}
        </Link>
        <span style={{ color: "#d1d5db", margin: "0 8px", fontSize: "14px" }}>/</span>
        <span style={{ color: "#271609", fontSize: "14px", fontWeight: 500 }}>
          Import Students
        </span>
      </div>

      <h1 style={{ margin: "0 0 8px", fontSize: "24px", fontWeight: 700, color: "#271609" }}>
        CSV Bulk Import
      </h1>
      <p style={{ margin: "0 0 24px", fontSize: "14px", color: "#6b7280" }}>
        Upload a CSV file to add multiple students at once. The file must include these columns:
        fullName, preferredName, dateOfBirth, enrollmentYear, enrollmentGrade, homeCommunity.
        Optional columns: status, isPublic, graduationYear.
      </p>

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

      {/* Success */}
      {importResult && (
        <div
          style={{
            padding: "16px 20px",
            marginBottom: "20px",
            borderRadius: "8px",
            backgroundColor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            color: "#166534",
            fontSize: "14px",
          }}
        >
          <strong>Import complete!</strong> {importResult.imported} student{importResult.imported !== 1 ? "s" : ""} imported
          out of {importResult.totalRows} rows.
          {importResult.errors.length > 0 && (
            <span> ({importResult.errors.length} row{importResult.errors.length !== 1 ? "s" : ""} skipped due to errors)</span>
          )}
          <div style={{ marginTop: "12px", display: "flex", gap: "12px" }}>
            <button
              onClick={() => router.push("/")}
              style={{
                padding: "8px 16px",
                border: "none",
                borderRadius: "6px",
                backgroundColor: "#335D63",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Go to Dashboard
            </button>
            <button
              onClick={reset}
              style={{
                padding: "8px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                backgroundColor: "#fff",
                color: "#374151",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              Import More
            </button>
          </div>
        </div>
      )}

      {/* Upload Card */}
      {!importResult && (
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            padding: "32px",
          }}
        >
          {/* File Input */}
          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>CSV File</label>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
                  minWidth: "200px",
                }}
              >
                {file ? file.name : "Choose a CSV file..."}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </label>
              {file && !preview && (
                <button
                  onClick={handlePreview}
                  disabled={loading}
                  style={{
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "8px",
                    backgroundColor: loading ? "#8FBFC4" : "#335D63",
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Validating..." : "Preview & Validate"}
                </button>
              )}
            </div>
          </div>

          {/* Sample CSV format */}
          {!preview && (
            <div style={{ marginBottom: "24px" }}>
              <label style={labelStyle}>Example CSV Format</label>
              <pre
                style={{
                  padding: "12px 16px",
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  fontSize: "12px",
                  color: "#374151",
                  overflow: "auto",
                  lineHeight: "1.6",
                }}
              >
{`fullName,preferredName,dateOfBirth,enrollmentYear,enrollmentGrade,homeCommunity,status,isPublic
Maria Josefa Nhampossa,Maria,2012-03-15,2023,5,Machava,active,true
Ana Lucia Mondlane,Ana,2011-06-22,2022,4,Matola,active,true
Joana Esperanca,Joana,2009-01-10,2020,6,Beira,graduated,true`}
              </pre>
            </div>
          )}

          {/* Preview Results */}
          {preview && (
            <div>
              {/* Summary */}
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  marginBottom: "20px",
                  flexWrap: "wrap",
                }}
              >
                <div style={statBox}>
                  <div style={{ fontSize: "24px", fontWeight: 700, color: "#271609" }}>
                    {preview.totalRows}
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>Total Rows</div>
                </div>
                <div style={statBox}>
                  <div style={{ fontSize: "24px", fontWeight: 700, color: "#166534" }}>
                    {preview.validRows}
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>Valid</div>
                </div>
                {preview.errors.length > 0 && (
                  <div style={{ ...statBox, borderColor: "#fecaca" }}>
                    <div style={{ fontSize: "24px", fontWeight: 700, color: "#dc2626" }}>
                      {preview.errors.length}
                    </div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>Errors</div>
                  </div>
                )}
              </div>

              {/* Errors */}
              {preview.errors.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                  <label style={labelStyle}>Row Errors</label>
                  <div
                    style={{
                      maxHeight: "200px",
                      overflow: "auto",
                      borderRadius: "8px",
                      border: "1px solid #fecaca",
                      backgroundColor: "#fef2f2",
                    }}
                  >
                    {preview.errors.map((err, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "8px 12px",
                          fontSize: "13px",
                          color: "#dc2626",
                          borderBottom:
                            i < preview.errors.length - 1 ? "1px solid #fecaca" : "none",
                        }}
                      >
                        <strong>Row {err.row}:</strong> {err.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview Table */}
              {preview.preview.length > 0 && (
                <div style={{ marginBottom: "24px" }}>
                  <label style={labelStyle}>
                    Preview (first {Math.min(20, preview.preview.length)} of {preview.validRows} valid rows)
                  </label>
                  <div
                    style={{
                      overflow: "auto",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: "13px",
                      }}
                    >
                      <thead>
                        <tr style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                          <th style={thStyle}>Name</th>
                          <th style={thStyle}>Preferred</th>
                          <th style={thStyle}>DOB</th>
                          <th style={thStyle}>Year</th>
                          <th style={thStyle}>Grade</th>
                          <th style={thStyle}>Community</th>
                          <th style={thStyle}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {preview.preview.map((row, i) => (
                          <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                            <td style={tdStyle}>{row.fullName}</td>
                            <td style={tdStyle}>{row.preferredName}</td>
                            <td style={tdStyle}>{row.dateOfBirth}</td>
                            <td style={{ ...tdStyle, textAlign: "center" }}>{row.enrollmentYear}</td>
                            <td style={{ ...tdStyle, textAlign: "center" }}>{row.enrollmentGrade}</td>
                            <td style={tdStyle}>{row.homeCommunity}</td>
                            <td style={{ ...tdStyle, textAlign: "center" }}>{row.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", gap: "12px" }}>
                {preview.validRows > 0 && (
                  <button
                    onClick={handleImport}
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
                    {loading ? "Importing..." : `Import ${preview.validRows} Student${preview.validRows !== 1 ? "s" : ""}`}
                  </button>
                )}
                <button
                  onClick={reset}
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
            </div>
          )}
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

const statBox: React.CSSProperties = {
  padding: "16px 24px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  backgroundColor: "#f9fafb",
  textAlign: "center",
  minWidth: "80px",
};

const thStyle: React.CSSProperties = {
  padding: "10px 12px",
  fontSize: "12px",
  fontWeight: 600,
  color: "#6b7280",
  textTransform: "uppercase",
  textAlign: "left",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "8px 12px",
  whiteSpace: "nowrap",
};
