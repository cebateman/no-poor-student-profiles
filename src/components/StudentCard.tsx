"use client";

import Link from "next/link";
import { StudentWithComputed } from "@/lib/computed";

function PlaceholderAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-full aspect-square bg-gradient-to-br from-npa-green to-npa-green-light flex items-center justify-center">
      <span className="text-white text-4xl font-bold">{initials}</span>
    </div>
  );
}

export default function StudentCard({
  student,
}: {
  student: StudentWithComputed;
}) {
  const latestSnapshot = student.snapshots?.[0];

  return (
    <Link href={`/students/${student.id}`}>
      <div className="card overflow-hidden cursor-pointer group">
        <div className="relative overflow-hidden">
          {student.profilePhotoUrl ? (
            <img
              src={student.profilePhotoUrl}
              alt={student.preferredName}
              className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <PlaceholderAvatar name={student.preferredName} />
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <h3 className="text-white text-xl font-semibold">
              {student.preferredName}
            </h3>
          </div>
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Age {student.age}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Grade {student.currentGrade}
            </span>
          </div>
          <p className="text-sm text-gray-500">{student.homeCommunity}</p>
          {latestSnapshot?.dreamCareer && (
            <p className="text-sm text-npa-green italic">
              &ldquo;I want to be a {latestSnapshot.dreamCareer}&rdquo;
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
