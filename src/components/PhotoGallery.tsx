"use client";

import { useState } from "react";
import { GalleryData } from "@/lib/computed";
import VideoEmbed, { getEmbedUrl } from "./VideoEmbed";

export default function PhotoGallery({ photos }: { photos: GalleryData[] }) {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryData | null>(null);

  if (!photos || photos.length === 0) return null;

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold text-npa-green-dark mb-4">
          Photo & Video Gallery
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <button
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="relative aspect-square overflow-hidden rounded-lg group"
            >
              {photo.videoUrl && !photo.photoUrl ? (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-12 h-12 text-npa-green opacity-60" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              ) : (
                <img
                  src={photo.photoUrl}
                  alt={photo.caption || "Gallery photo"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              {/* Video play indicator overlay */}
              {photo.videoUrl && photo.photoUrl && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center group-hover:bg-black/70 transition-colors">
                    <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
              {photo.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {photo.caption}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-10 right-0 text-white text-xl hover:opacity-80"
            >
              Close
            </button>
            {selectedPhoto.videoUrl && getEmbedUrl(selectedPhoto.videoUrl) ? (
              <VideoEmbed url={selectedPhoto.videoUrl} />
            ) : (
              <img
                src={selectedPhoto.photoUrl}
                alt={selectedPhoto.caption || "Gallery photo"}
                className="max-w-full max-h-[80vh] object-contain rounded-lg mx-auto"
              />
            )}
            {selectedPhoto.caption && (
              <p className="text-white text-center mt-3">
                {selectedPhoto.caption} ({selectedPhoto.year})
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
