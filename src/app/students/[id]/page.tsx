"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import JourneyTimeline from "@/components/JourneyTimeline";
import PhotoGallery from "@/components/PhotoGallery";
import { StudentWithComputed, SnapshotData } from "@/lib/computed";

export default function StudentProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const [student, setStudent] = useState<StudentWithComputed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOriginalLanguage, setShowOriginalLanguage] = useState(false);
  const [heroBackgroundUrl, setHeroBackgroundUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchStudent() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/students/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Student profile not found");
          }
          throw new Error("Failed to load student profile");
        }
        const data: StudentWithComputed = await res.json();
        setStudent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchStudent();
  }, [id]);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setHeroBackgroundUrl(data.heroBackgroundUrl || null))
      .catch(() => {});
  }, []);

  // Get the latest snapshot for the "Her Story" section
  const latestSnapshot: SnapshotData | undefined = student?.snapshots
    ?.slice()
    .sort((a, b) => b.year - a.year)[0];

  const hasTranslation =
    latestSnapshot?.storyTranslation &&
    latestSnapshot?.storyLanguage !== "en" &&
    latestSnapshot?.storyLanguage !== "English";

  const storyText = showOriginalLanguage
    ? latestSnapshot?.storyText
    : latestSnapshot?.storyTranslation || latestSnapshot?.storyText;

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-npa-cream flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-npa-green-lighter border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 text-sm">Loading profile...</p>
      </div>
    );
  }

  // Error State
  if (error || !student) {
    return (
      <div className="min-h-screen bg-npa-cream flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          {error || "Profile not found"}
        </h2>
        <p className="text-gray-500 mb-6 text-center">
          We could not load this student&apos;s profile. She may no longer be
          publicly listed.
        </p>
        <Link
          href="/"
          className="btn-primary inline-flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to All Girls
        </Link>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-npa-cream bg-cover bg-center bg-fixed"
      style={heroBackgroundUrl ? { backgroundImage: `url(${heroBackgroundUrl})` } : undefined}
    >
      {/* Hero Section with Photo */}
      <header className="relative bg-npa-green-dark">
        {/* Back Link */}
        <div className="absolute top-4 left-4 z-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            All Girls
          </Link>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative aspect-[16/9] sm:aspect-[2/1] md:aspect-[5/2] overflow-hidden">
            {student.profilePhotoUrl ? (
              <img
                src={student.profilePhotoUrl}
                alt={student.preferredName}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-npa-green to-npa-green-light flex items-center justify-center">
                <span className="text-white text-7xl font-bold opacity-40">
                  {student.preferredName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              </div>
            )}

            {/* Gradient overlay with name */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-serif">
                {student.preferredName}
              </h1>
              {student.preferredName !== student.fullName && (
                <p className="text-white/70 text-sm mt-1">
                  {student.fullName}
                </p>
              )}
              {student.status === "graduated" && (
                <span className="inline-block mt-2 bg-npa-accent text-npa-dark text-xs font-semibold px-3 py-1 rounded-full">
                  Graduate {student.graduationYear && `- Class of ${student.graduationYear}`}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Quick Stats Bar */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100">
            {/* Age */}
            <div className="flex items-center gap-3 py-5 px-4">
              <div className="w-10 h-10 rounded-full bg-npa-green/10 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-npa-green"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Age</p>
                <p className="text-lg font-semibold text-npa-green-dark">
                  {student.age}
                </p>
              </div>
            </div>

            {/* Grade */}
            <div className="flex items-center gap-3 py-5 px-4">
              <div className="w-10 h-10 rounded-full bg-npa-green/10 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-npa-green"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Grade</p>
                <p className="text-lg font-semibold text-npa-green-dark">
                  {student.currentGrade}
                </p>
              </div>
            </div>

            {/* Years in Program */}
            <div className="flex items-center gap-3 py-5 px-4">
              <div className="w-10 h-10 rounded-full bg-npa-green/10 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-npa-green"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Years in Program
                </p>
                <p className="text-lg font-semibold text-npa-green-dark">
                  {student.yearsInProgram}
                </p>
              </div>
            </div>

            {/* Home Community */}
            <div className="flex items-center gap-3 py-5 px-4">
              <div className="w-10 h-10 rounded-full bg-npa-green/10 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-npa-green"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Community
                </p>
                <p className="text-lg font-semibold text-npa-green-dark">
                  {student.homeCommunity}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 bg-npa-cream/90 backdrop-blur-sm">
        {/* Her Story Section */}
        {storyText && (
          <section>
            <h2 className="text-2xl font-semibold text-npa-green-dark mb-6">
              Her Story
            </h2>
            <div className="bg-npa-warmWhite rounded-2xl p-6 sm:p-8 border border-npa-accent/20">
              <div className="relative">
                {/* Decorative quote mark */}
                <span className="absolute -top-2 -left-1 text-npa-accent/30 text-6xl font-serif leading-none select-none">
                  &ldquo;
                </span>
                <blockquote className="relative pl-6 text-gray-700 text-lg leading-relaxed italic font-serif">
                  {storyText}
                </blockquote>
              </div>

              {/* Translation toggle */}
              {hasTranslation && (
                <div className="mt-4 pt-4 border-t border-npa-accent/10">
                  <button
                    onClick={() => setShowOriginalLanguage(!showOriginalLanguage)}
                    className="text-sm text-npa-green hover:text-npa-green-light transition-colors flex items-center gap-1.5"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                      />
                    </svg>
                    {showOriginalLanguage
                      ? "Show English translation"
                      : `Show original (${latestSnapshot?.storyLanguage})`}
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Dream Career Callout */}
        {latestSnapshot?.dreamCareer && (
          <section>
            <div className="bg-gradient-to-r from-npa-accent/10 to-npa-warmWhite rounded-2xl p-6 sm:p-8 border border-npa-accent/20 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-npa-accent/20 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-npa-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-npa-green uppercase tracking-wide mb-1">
                  Her Dream
                </p>
                <p className="text-xl font-semibold text-npa-green-dark font-serif">
                  &ldquo;I want to be a {latestSnapshot.dreamCareer}&rdquo;
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Journey Timeline */}
        {student.snapshots && student.snapshots.length > 0 && (
          <section>
            <JourneyTimeline snapshots={student.snapshots} />
          </section>
        )}

        {/* Photo Gallery */}
        {student.gallery && student.gallery.length > 0 && (
          <section>
            <PhotoGallery photos={student.gallery} />
          </section>
        )}

        {/* Support CTA */}
        <section className="text-center">
          <div className="bg-npa-green-dark rounded-2xl p-8 sm:p-12 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-npa-green-lighter/10 rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-npa-accent/10 rounded-full translate-y-1/3 -translate-x-1/4" />

            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 font-serif">
                Support {student.preferredName}&apos;s Future
              </h2>
              <p className="text-gray-300 max-w-lg mx-auto mb-8">
                Your sponsorship helps cover school fees, uniforms, supplies,
                and mentorship -- everything {student.preferredName} needs to
                stay in school and chase her dreams.
              </p>
              <a
                href="https://www.nopoorafrica.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-npa-accent text-npa-dark px-8 py-3.5 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity duration-200 shadow-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Support This Girl
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-npa-green-dark/95 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-semibold text-lg">No Poor Africa</p>
              <p className="text-sm text-gray-300 mt-1">
                Investing in girls&apos; education in Mozambique
              </p>
            </div>
            <div className="text-center md:text-right">
              <a
                href="https://www.nopoorafrica.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-npa-green-lighter hover:text-white transition-colors text-sm"
              >
                nopoorafrica.org
              </a>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-6">
            <p className="text-xs text-gray-400 text-center leading-relaxed max-w-2xl mx-auto">
              All student profiles are shared with the informed consent of the
              students and their families. Personal information is limited to what
              the families have approved for public display. If you have questions
              about our privacy practices, please contact us at{" "}
              <a
                href="mailto:info@nopoorafrica.org"
                className="underline hover:text-white"
              >
                info@nopoorafrica.org
              </a>
              .
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
