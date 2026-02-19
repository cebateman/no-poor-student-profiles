"use client";

import { SnapshotData } from "@/lib/computed";

export default function JourneyTimeline({
  snapshots,
}: {
  snapshots: SnapshotData[];
}) {
  if (!snapshots || snapshots.length === 0) return null;

  return (
    <div className="relative">
      <h2 className="text-2xl font-semibold text-npa-green-dark mb-6">
        Her Journey
      </h2>
      <div className="relative pl-8 border-l-2 border-npa-green-lighter space-y-8">
        {snapshots.map((snapshot, index) => (
          <div key={snapshot.id} className="relative">
            {/* Timeline dot */}
            <div
              className={`absolute -left-[2.55rem] w-4 h-4 rounded-full border-2 border-npa-green-lighter ${
                index === snapshots.length - 1
                  ? "bg-npa-green"
                  : "bg-white"
              }`}
            />

            <div className="card p-5">
              <div className="flex items-start gap-4">
                {snapshot.photoUrl && (
                  <img
                    src={snapshot.photoUrl}
                    alt={`Year ${snapshot.year}`}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-semibold text-npa-green">
                      {snapshot.year}
                    </span>
                    <span className="text-sm text-gray-500">
                      Grade {snapshot.gradeAtTime}
                    </span>
                    {snapshot.favoriteSubject && (
                      <span className="text-xs bg-npa-green/10 text-npa-green px-2 py-0.5 rounded-full">
                        Loves {snapshot.favoriteSubject}
                      </span>
                    )}
                  </div>

                  {snapshot.storyTranslation ? (
                    <p className="text-gray-700 text-sm leading-relaxed italic">
                      &ldquo;{snapshot.storyTranslation}&rdquo;
                    </p>
                  ) : snapshot.storyText ? (
                    <p className="text-gray-700 text-sm leading-relaxed italic">
                      &ldquo;{snapshot.storyText}&rdquo;
                    </p>
                  ) : null}

                  {snapshot.dreamCareer && (
                    <p className="mt-2 text-sm text-npa-green font-medium">
                      Dream: {snapshot.dreamCareer}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
