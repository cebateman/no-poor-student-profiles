"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

interface Snapshot {
  id: string;
  year: number;
  gradeAtTime: number;
  photoUrl: string | null;
  videoUrl: string | null;
  storyText: string | null;
  storyLanguage: string;
  storyTranslation: string | null;
  dreamCareer: string | null;
  favoriteSubject: string | null;
  academicNotes: string | null;
  extraData: Record<string, unknown> | null;
  createdAt: string;
}

interface GalleryItem {
  id: string;
  year: number;
  photoUrl: string;
  videoUrl: string | null;
  caption: string | null;
  isFeatured: boolean;
}

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
  graduationYear: number | null;
  isPublic: boolean;
  age: number;
  currentGrade: number;
  yearsInProgram: number;
  snapshots?: Snapshot[];
  gallery?: GalleryItem[];
}

const STATUS_OPTIONS = ["active", "graduated", "alumni", "withdrawn"];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  active: { bg: "#E0EDEA", text: "#335D63" },
  graduated: { bg: "#dbeafe", text: "#1e40af" },
  alumni: { bg: "#f3e8ff", text: "#7c3aed" },
  withdrawn: { bg: "#f3f4f6", text: "#6b7280" },
};

export default function StudentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;
  const { t, getStatusLabel } = useLanguage();

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Editable fields
  const [fullName, setFullName] = useState("");
  const [preferredName, setPreferredName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [enrollmentYear, setEnrollmentYear] = useState("");
  const [enrollmentGrade, setEnrollmentGrade] = useState("");
  const [homeCommunity, setHomeCommunity] = useState("");
  const [status, setStatus] = useState("active");
  const [graduationYear, setGraduationYear] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  // Photo upload
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Snapshot tab
  const [activeSnapshotYear, setActiveSnapshotYear] = useState<number | null>(null);

  const authHeaders = useCallback(() => {
    return {
      Authorization: `Bearer ${localStorage.getItem("npa_token")}`,
    };
  }, []);

  const fetchStudent = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/students/${studentId}`, {
        headers: authHeaders(),
      });

      if (res.status === 401) {
        localStorage.removeItem("npa_token");
        router.replace("/login");
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch student");

      const data: Student = await res.json();
      setStudent(data);
      setFullName(data.fullName);
      setPreferredName(data.preferredName);
      setDateOfBirth(data.dateOfBirth);
      setEnrollmentYear(data.enrollmentYear.toString());
      setEnrollmentGrade(data.enrollmentGrade.toString());
      setHomeCommunity(data.homeCommunity);
      setStatus(data.status);
      setGraduationYear(data.graduationYear?.toString() || "");
      setIsPublic(data.isPublic);

      if (data.snapshots && data.snapshots.length > 0) {
        setActiveSnapshotYear(data.snapshots[data.snapshots.length - 1].year);
      }
    } catch {
      setError(t("studentDetail.failedLoad"));
    } finally {
      setLoading(false);
    }
  }, [studentId, authHeaders, router, t]);

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/admin/students/${studentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          preferredName: preferredName.trim(),
          dateOfBirth,
          enrollmentYear: parseInt(enrollmentYear),
          enrollmentGrade: parseInt(enrollmentGrade),
          homeCommunity: homeCommunity.trim(),
          status,
          graduationYear: graduationYear ? parseInt(graduationYear) : null,
          isPublic,
        }),
      });

      if (res.status === 401) {
        localStorage.removeItem("npa_token");
        router.replace("/login");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      const data = await res.json();
      setStudent(data);
      setSuccessMsg(t("studentDetail.savedSuccess"));
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("studentDetail.failedSave"));
    } finally {
      setSaving(false);
    }
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const res = await fetch(`/api/admin/students/${studentId}/photo`, {
        method: "POST",
        headers: authHeaders(),
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setStudent((prev) =>
        prev ? { ...prev, profilePhotoUrl: data.profilePhotoUrl } : prev
      );
      setSuccessMsg(t("studentDetail.photoUpdated"));
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      setError(t("studentDetail.failedPhoto"));
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingGallery(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("photo", file);
      formData.append("year", new Date().getFullYear().toString());

      const res = await fetch(`/api/admin/students/${studentId}/gallery`, {
        method: "POST",
        headers: authHeaders(),
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      // Refresh student data to get updated gallery
      await fetchStudent();
      setSuccessMsg(t("studentDetail.galleryAdded"));
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      setError(t("studentDetail.failedGallery"));
    } finally {
      setUploadingGallery(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "60px 0", textAlign: "center", color: "#6b7280" }}>
        {t("studentDetail.loadingStudent")}
      </div>
    );
  }

  if (!student) {
    return (
      <div style={{ padding: "60px 0", textAlign: "center", color: "#6b7280" }}>
        {t("studentDetail.notFound")}
      </div>
    );
  }

  const statusColor = STATUS_COLORS[student.status] || STATUS_COLORS.withdrawn;
  const activeSnapshot = student.snapshots?.find(
    (s) => s.year === activeSnapshotYear
  );

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ marginBottom: "24px" }}>
        <Link
          href="/"
          style={{
            color: "#6b7280",
            textDecoration: "none",
            fontSize: "14px",
          }}
        >
          {t("nav.dashboard")}
        </Link>
        <span style={{ color: "#d1d5db", margin: "0 8px", fontSize: "14px" }}>/</span>
        <span style={{ color: "#271609", fontSize: "14px", fontWeight: 500 }}>
          {student.preferredName}
        </span>
      </div>

      {/* Messages */}
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
      {successMsg && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: "16px",
            borderRadius: "8px",
            backgroundColor: "#E8F0EC",
            border: "1px solid #B0CFC0",
            color: "#335D63",
            fontSize: "14px",
          }}
        >
          {successMsg}
        </div>
      )}

      {/* Header Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        {/* Profile Photo */}
        <div style={{ position: "relative" }}>
          {student.profilePhotoUrl ? (
            <img
              src={student.profilePhotoUrl}
              alt={student.preferredName}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #e5e7eb",
              }}
            />
          ) : (
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "#e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9ca3af",
                fontSize: "28px",
                fontWeight: 600,
              }}
            >
              {student.preferredName.charAt(0).toUpperCase()}
            </div>
          )}
          <label
            style={{
              position: "absolute",
              bottom: "-4px",
              right: "-4px",
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              backgroundColor: "#335D63",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: uploadingPhoto ? "not-allowed" : "pointer",
              fontSize: "14px",
              border: "2px solid #ffffff",
            }}
            title={t("studentDetail.uploadPhoto")}
          >
            {uploadingPhoto ? "..." : "\u270E"}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={uploadingPhoto}
              style={{ display: "none" }}
            />
          </label>
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: "#271609" }}>
            {student.fullName}
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginTop: "6px",
            }}
          >
            <span
              style={{
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
            <span style={{ fontSize: "14px", color: "#6b7280" }}>
              {t("studentDetail.ageLabel")} {student.age} &middot; {t("studentDetail.gradeLabel")} {student.currentGrade} &middot;{" "}
              {student.yearsInProgram} {t("studentDetail.yrsInProgram")}
            </span>
          </div>
        </div>
      </div>

      {/* Editable Fields Card */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          padding: "28px",
          marginBottom: "24px",
        }}
      >
        <h2 style={sectionTitleStyle}>{t("studentDetail.info")}</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div>
            <label style={labelStyle}>{t("form.fullName")}</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>{t("form.preferredName")}</label>
            <input
              type="text"
              value={preferredName}
              onChange={(e) => setPreferredName(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>{t("form.dateOfBirth")}</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>{t("form.homeCommunity")}</label>
            <input
              type="text"
              value={homeCommunity}
              onChange={(e) => setHomeCommunity(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>{t("form.enrollmentYear")}</label>
            <input
              type="number"
              value={enrollmentYear}
              onChange={(e) => setEnrollmentYear(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>{t("form.enrollmentGrade")}</label>
            <select
              value={enrollmentGrade}
              onChange={(e) => setEnrollmentGrade(e.target.value)}
              style={inputStyle}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                <option key={g} value={g}>
                  {t("form.grade")} {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>{t("form.status")}</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={inputStyle}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {getStatusLabel(s)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>{t("form.graduationYear")}</label>
            <input
              type="number"
              value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)}
              placeholder={t("form.graduationYearPlaceholder")}
              style={inputStyle}
            />
          </div>
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
                  accentColor: "#335D63",
                  cursor: "pointer",
                }}
              />
              {t("form.isPublic")}
            </label>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "24px",
            paddingTop: "20px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: "10px 24px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: saving ? "#8FBFC4" : "#335D63",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 600,
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? t("form.saving") : t("form.save")}
          </button>
        </div>
      </div>

      {/* Annual Snapshots */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          padding: "28px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ ...sectionTitleStyle, marginBottom: 0 }}>{t("snapshot.title")}</h2>
          <button
            onClick={() =>
              router.push(`/students/${studentId}/snapshot`)
            }
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#335D63",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t("snapshot.addUpdate")}
          </button>
        </div>

        {!student.snapshots || student.snapshots.length === 0 ? (
          <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
            {t("snapshot.noSnapshots")}
          </p>
        ) : (
          <>
            {/* Year Tabs */}
            <div
              style={{
                display: "flex",
                gap: "4px",
                marginBottom: "20px",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "0",
              }}
            >
              {student.snapshots.map((snap) => (
                <button
                  key={snap.year}
                  onClick={() => setActiveSnapshotYear(snap.year)}
                  style={{
                    padding: "8px 16px",
                    border: "none",
                    borderBottom:
                      activeSnapshotYear === snap.year
                        ? "2px solid #335D63"
                        : "2px solid transparent",
                    backgroundColor: "transparent",
                    color:
                      activeSnapshotYear === snap.year ? "#335D63" : "#6b7280",
                    fontWeight: activeSnapshotYear === snap.year ? 600 : 400,
                    fontSize: "14px",
                    cursor: "pointer",
                    marginBottom: "-1px",
                  }}
                >
                  {snap.year}
                </button>
              ))}
            </div>

            {/* Snapshot Detail */}
            {activeSnapshot && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: activeSnapshot.photoUrl
                    ? "160px 1fr"
                    : "1fr",
                  gap: "24px",
                }}
              >
                {activeSnapshot.photoUrl && (
                  <img
                    src={activeSnapshot.photoUrl}
                    alt={`${student.preferredName} in ${activeSnapshot.year}`}
                    style={{
                      width: "160px",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                    }}
                  />
                )}
                <div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
                      marginBottom: "16px",
                    }}
                  >
                    <div>
                      <span style={detailLabelStyle}>{t("snapshot.gradeAtTime")}</span>
                      <span style={detailValueStyle}>
                        {t("form.grade")} {activeSnapshot.gradeAtTime}
                      </span>
                    </div>
                    {activeSnapshot.dreamCareer && (
                      <div>
                        <span style={detailLabelStyle}>{t("snapshot.dreamCareer")}</span>
                        <span style={detailValueStyle}>
                          {activeSnapshot.dreamCareer}
                        </span>
                      </div>
                    )}
                    {activeSnapshot.favoriteSubject && (
                      <div>
                        <span style={detailLabelStyle}>{t("snapshot.favoriteSubject")}</span>
                        <span style={detailValueStyle}>
                          {activeSnapshot.favoriteSubject}
                        </span>
                      </div>
                    )}
                    <div>
                      <span style={detailLabelStyle}>{t("snapshot.storyLanguage")}</span>
                      <span style={detailValueStyle}>
                        {activeSnapshot.storyLanguage}
                      </span>
                    </div>
                  </div>

                  {activeSnapshot.storyText && (
                    <div style={{ marginBottom: "12px" }}>
                      <span style={detailLabelStyle}>{t("snapshot.storyOriginal")}</span>
                      <p
                        style={{
                          margin: "4px 0 0",
                          fontSize: "14px",
                          color: "#374151",
                          lineHeight: "1.6",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {activeSnapshot.storyText}
                      </p>
                    </div>
                  )}

                  {activeSnapshot.storyTranslation && (
                    <div style={{ marginBottom: "12px" }}>
                      <span style={detailLabelStyle}>{t("snapshot.storyEnglish")}</span>
                      <p
                        style={{
                          margin: "4px 0 0",
                          fontSize: "14px",
                          color: "#374151",
                          lineHeight: "1.6",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {activeSnapshot.storyTranslation}
                      </p>
                    </div>
                  )}

                  {activeSnapshot.academicNotes && (
                    <div style={{ marginBottom: "12px" }}>
                      <span style={detailLabelStyle}>
                        {t("snapshot.academicNotes")}
                      </span>
                      <p
                        style={{
                          margin: "4px 0 0",
                          fontSize: "14px",
                          color: "#374151",
                          lineHeight: "1.6",
                          fontStyle: "italic",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {activeSnapshot.academicNotes}
                      </p>
                    </div>
                  )}

                  {activeSnapshot.extraData &&
                    Object.keys(activeSnapshot.extraData).length > 0 && (
                      <div>
                        <span style={detailLabelStyle}>{t("snapshot.extraData")}</span>
                        <div
                          style={{
                            marginTop: "4px",
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                          }}
                        >
                          {Object.entries(activeSnapshot.extraData).map(
                            ([key, value]) => (
                              <span
                                key={key}
                                style={{
                                  padding: "4px 10px",
                                  borderRadius: "6px",
                                  backgroundColor: "#f3f4f6",
                                  fontSize: "13px",
                                  color: "#374151",
                                }}
                              >
                                <strong>{key}:</strong> {String(value)}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {activeSnapshot.videoUrl && (
                    <div style={{ marginTop: "12px" }}>
                      <span style={detailLabelStyle}>Video</span>
                      <a
                        href={activeSnapshot.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: "14px", color: "#335D63" }}
                      >
                        {activeSnapshot.videoUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Photo Gallery */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          padding: "28px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ ...sectionTitleStyle, marginBottom: 0 }}>{t("gallery.title")}</h2>
          <label
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: uploadingGallery ? "#8FBFC4" : "#335D63",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 600,
              cursor: uploadingGallery ? "not-allowed" : "pointer",
              display: "inline-block",
            }}
          >
            {uploadingGallery ? t("gallery.uploading") : t("gallery.addPhoto")}
            <input
              type="file"
              accept="image/*"
              onChange={handleGalleryUpload}
              disabled={uploadingGallery}
              style={{ display: "none" }}
            />
          </label>
        </div>

        {!student.gallery || student.gallery.length === 0 ? (
          <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
            {t("gallery.noPhotos")}
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: "12px",
            }}
          >
            {student.gallery.map((item) => (
              <div
                key={item.id}
                style={{
                  position: "relative",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid #e5e7eb",
                }}
              >
                <img
                  src={item.photoUrl}
                  alt={item.caption || `Photo from ${item.year}`}
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <div
                  style={{
                    padding: "8px 10px",
                    backgroundColor: "#f9fafb",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#374151",
                    }}
                  >
                    {item.year}
                    {item.isFeatured && (
                      <span
                        style={{
                          marginLeft: "6px",
                          padding: "1px 6px",
                          borderRadius: "4px",
                          backgroundColor: "#fef3c7",
                          color: "#92400e",
                          fontSize: "10px",
                          fontWeight: 500,
                        }}
                      >
                        {t("gallery.featured")}
                      </span>
                    )}
                  </div>
                  {item.caption && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        marginTop: "2px",
                      }}
                    >
                      {item.caption}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const sectionTitleStyle: React.CSSProperties = {
  margin: "0 0 20px",
  fontSize: "17px",
  fontWeight: 600,
  color: "#271609",
};

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

const detailLabelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: 600,
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: "2px",
};

const detailValueStyle: React.CSSProperties = {
  display: "block",
  fontSize: "14px",
  color: "#271609",
};
