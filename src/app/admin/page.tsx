"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";

interface Student {
  id: string;
  fullName: string;
  preferredName: string;
  dateOfBirth: string;
  enrollmentYear: number;
  enrollmentGrade: number;
  homeCommunity: string;
  profilePhotoUrl: string | null;
  status: string;
  isPublic: boolean;
  age: number;
  currentGrade: number;
}

const STATUS_OPTIONS = ["all", "active", "graduated", "alumni", "withdrawn"] as const;

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  active: { bg: "#E0EDEA", text: "#335D63" },
  graduated: { bg: "#dbeafe", text: "#1e40af" },
  alumni: { bg: "#f3e8ff", text: "#7c3aed" },
  withdrawn: { bg: "#f3f4f6", text: "#6b7280" },
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const { t, getStatusLabel } = useLanguage();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchStudents = useCallback(async function() {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }

      const res = await fetch(`/api/admin/students?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("npa_token")}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("npa_token");
        router.replace("/login");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await res.json();
      setStudents(data);
    } catch {
      setError("Failed to load students. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, router]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const q = searchQuery.toLowerCase();
    return students.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.preferredName.toLowerCase().includes(q)
    );
  }, [students, searchQuery]);

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: 700,
              color: "#271609",
            }}
          >
            {t("dashboard.title")}
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#6b7280" }}>
            {filteredStudents.length} {filteredStudents.length !== 1 ? t("dashboard.studentCountPlural") : t("dashboard.studentCount")} {t("dashboard.found")}
          </p>
        </div>
        <button
          onClick={() => router.push("/students/new")}
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#335D63",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {t("dashboard.addNew")}
        </button>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {/* Search */}
        <input
          type="text"
          placeholder={t("dashboard.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: "1",
            minWidth: "200px",
            padding: "10px 14px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "14px",
            outline: "none",
            backgroundColor: "#ffffff",
            boxSizing: "border-box",
          }}
        />

        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "10px 14px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "14px",
            outline: "none",
            backgroundColor: "#ffffff",
            cursor: "pointer",
            minWidth: "150px",
          }}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? t("dashboard.allStatuses") : getStatusLabel(s)}
            </option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: "16px",
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

      {/* Table */}
      {loading ? (
        <div
          style={{
            padding: "60px 0",
            textAlign: "center",
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          {t("dashboard.loadingStudents")}
        </div>
      ) : filteredStudents.length === 0 ? (
        <div
          style={{
            padding: "60px 0",
            textAlign: "center",
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          {t("dashboard.noStudents")}
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            overflow: "hidden",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#f9fafb",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <th style={thStyle}>{t("dashboard.photo")}</th>
                <th style={{ ...thStyle, textAlign: "left" }}>{t("dashboard.name")}</th>
                <th style={thStyle}>{t("dashboard.age")}</th>
                <th style={thStyle}>{t("dashboard.grade")}</th>
                <th style={thStyle}>{t("dashboard.status")}</th>
                <th style={{ ...thStyle, textAlign: "left" }}>{t("dashboard.community")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => {
                const statusColor = STATUS_COLORS[student.status] || STATUS_COLORS.withdrawn;
                return (
                  <tr
                    key={student.id}
                    onClick={() => router.push(`/students/${student.id}`)}
                    style={{
                      borderBottom: "1px solid #e5e7eb",
                      cursor: "pointer",
                      transition: "background-color 0.1s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f9fafb")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <td style={{ ...tdStyle, textAlign: "center", width: "60px" }}>
                      {student.profilePhotoUrl ? (
                        <img
                          src={student.profilePhotoUrl}
                          alt={student.preferredName}
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            backgroundColor: "#e5e7eb",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#9ca3af",
                            fontSize: "14px",
                            fontWeight: 600,
                          }}
                        >
                          {student.preferredName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 500, color: "#271609" }}>
                        {student.fullName}
                      </div>
                      {student.preferredName !== student.fullName && (
                        <div style={{ color: "#6b7280", fontSize: "12px" }}>
                          &quot;{student.preferredName}&quot;
                        </div>
                      )}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      {student.age}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      {student.currentGrade}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 10px",
                          borderRadius: "9999px",
                          fontSize: "12px",
                          fontWeight: 500,
                          backgroundColor: statusColor.bg,
                          color: statusColor.text,
                        }}
                      >
                        {getStatusLabel(student.status)}
                      </span>
                    </td>
                    <td style={tdStyle}>{student.homeCommunity}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: "12px 16px",
  fontSize: "12px",
  fontWeight: 600,
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  textAlign: "center",
};

const tdStyle: React.CSSProperties = {
  padding: "12px 16px",
};
