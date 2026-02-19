"use client";

import { useState, useEffect, useCallback } from "react";
import FilterBar from "@/components/FilterBar";
import StudentCard from "@/components/StudentCard";
import { StudentWithComputed } from "@/lib/computed";

export default function HomePage() {
  const [students, setStudents] = useState<StudentWithComputed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchStudents = useCallback(async (status: string) => {
    setLoading(true);
    setError(null);
    try {
      // For "all", fetch both active and graduated
      if (status === "all") {
        const [activeRes, graduatedRes] = await Promise.all([
          fetch("/api/students?status=active"),
          fetch("/api/students?status=graduated"),
        ]);
        if (!activeRes.ok || !graduatedRes.ok) {
          throw new Error("Failed to fetch students");
        }
        const activeData: StudentWithComputed[] = await activeRes.json();
        const graduatedData: StudentWithComputed[] = await graduatedRes.json();
        const combined = [...activeData, ...graduatedData].sort((a, b) =>
          a.preferredName.localeCompare(b.preferredName)
        );
        setStudents(combined);
      } else {
        const res = await fetch(`/api/students?status=${status}`);
        if (!res.ok) {
          throw new Error("Failed to fetch students");
        }
        const data: StudentWithComputed[] = await res.json();
        setStudents(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents(activeFilter);
  }, [activeFilter, fetchStudents]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setSearchQuery("");
  };

  const filteredStudents = searchQuery
    ? students.filter((s) =>
        s.preferredName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : students;

  return (
    <div className="min-h-screen bg-npa-cream">
      {/* Hero Section */}
      <header className="relative bg-npa-green-dark overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-npa-green-lighter rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-npa-accent rounded-full translate-y-1/3 -translate-x-1/4" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <p className="text-npa-green-lighter text-sm font-medium tracking-widest uppercase mb-4">
            No Poor Africa
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6 font-serif">
            Meet our girls.
            <br />
            <span className="text-npa-green-lighter">
              Every girl has a story, a dream,
            </span>
            <br />
            and a future worth investing in.
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            We invest in girls&apos; education in Mozambique, walking alongside them
            from primary school through graduation and beyond. Get to know the
            young women whose futures you help shape.
          </p>
          <a
            href="https://nopoorafrica.org/donate/"
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
            Support a Girl
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Bar */}
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-npa-green-lighter border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-500 text-sm">Loading student profiles...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-400"
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
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => fetchStudents(activeFilter)}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredStudents.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-npa-green/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-npa-green"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {searchQuery
                ? "No students match your search"
                : "No student profiles to display"}
            </h3>
            <p className="text-sm text-gray-500">
              {searchQuery
                ? "Try adjusting your search or changing the filter."
                : "Check back soon as profiles are added."}
            </p>
          </div>
        )}

        {/* Student Grid */}
        {!loading && !error && filteredStudents.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        )}

        {/* Results count */}
        {!loading && !error && filteredStudents.length > 0 && (
          <p className="text-center text-sm text-gray-400 mt-8">
            Showing {filteredStudents.length}{" "}
            {filteredStudents.length === 1 ? "girl" : "girls"}
          </p>
        )}
      </main>

      {/* Bottom CTA */}
      <section className="bg-npa-warmWhite border-t border-npa-accent/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-npa-green-dark mb-4 font-serif">
            Change a girl&apos;s story
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-8">
            Your sponsorship covers school fees, uniforms, supplies, and
            mentorship -- everything a girl needs to stay in school and
            reach her dreams.
          </p>
          <a
            href="https://nopoorafrica.org/donate/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-npa-green text-white px-8 py-3.5 rounded-full font-semibold text-lg hover:bg-npa-green-light transition-colors duration-200 shadow-lg"
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
            Support a Girl
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-npa-green-dark text-white">
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
                href="https://nopoorafrica.org"
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
