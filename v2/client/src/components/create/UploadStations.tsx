"use client";

import React, { useState } from "react";
import { SourceType } from "./SourceSelector";

interface ImageFile {
  id: string;
  name: string;
  size: string;
}

interface VideoItem {
  id: string;
  name: string;
  size: string;
  status: string;
}

interface UploadStationsProps {
  activeSources: SourceType[];
}

export default function UploadStations({ activeSources }: UploadStationsProps) {
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([
    { id: "img-1", name: "mitosis_phases_diagram.png", size: "2.4 MB" },
    { id: "img-2", name: "lecture_whiteboard_03.jpg", size: "1.8 MB" },
  ]);

  const [videos, setVideos] = useState<VideoItem[]>([
    {
      id: "vid-1",
      name: "quantum_computing_principles_lecture04.mp4",
      size: "48.2 MB",
      status: "100% Ready",
    },
  ]);

  const [videoUrl, setVideoUrl] = useState("");

  const handleRemoveImage = (id: string) => {
    setImageFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleAddSampleImage = () => {
    const newId = `img-${Date.now()}`;
    setImageFiles((prev) => [
      ...prev,
      {
        id: newId,
        name: `lecture_slide_${prev.length + 1}.png`,
        size: "2.1 MB",
      },
    ]);
  };

  const handleRemoveVideo = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  const handleIngestUrl = () => {
    if (!videoUrl.trim()) return;
    const newId = `vid-${Date.now()}`;
    const name = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")
      ? `youtube_lecture_stream_${videos.length + 1}.mp4`
      : `streamed_video_${videos.length + 1}.mp4`;

    setVideos((prev) => [
      ...prev,
      {
        id: newId,
        name: name,
        size: "Stream Ingested",
        status: "100% Ready",
      },
    ]);
    setVideoUrl("");
  };

  const showImages = activeSources.includes("images");
  const showVideos = activeSources.includes("videos");

  if (!showImages && !showVideos) {
    return (
      <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest/60 p-8 text-center text-on-surface-variant font-label-code text-sm">
        <span className="material-symbols-outlined text-3xl mb-2 text-outline">
          touch_app
        </span>
        <p>Select Images or Videos above to configure multi-modal ingestion stations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Panel A: Upload Images (Emerald Glow Container) */}
      {showImages && (
        <div className="rounded-xl border border-emerald-500/30 bg-surface-container-lowest/60 backdrop-blur-md p-4 sm:p-6 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "16px" }}
                >
                  image
                </span>
              </div>
              <h3 className="font-headline-sm text-sm sm:text-base font-semibold text-on-surface">
                Upload Images
              </h3>
              <span className="font-label-code text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Active Ingestion
              </span>
            </div>

            {/* Choose Files Button */}
            <button
              onClick={handleAddSampleImage}
              className="self-start sm:self-auto bg-emerald-600 hover:bg-emerald-500 text-white font-headline-sm text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-950/50 cursor-pointer active:scale-95"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "18px" }}
              >
                add
              </span>
              <span>Choose Files</span>
            </button>
          </div>

          {/* Staged Files Preview / Dropzone Simulation */}
          <div className="mt-3 pt-2 border-t border-emerald-500/20 flex flex-wrap gap-2.5">
            {imageFiles.map((file) => (
              <div
                key={file.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-high/90 border border-emerald-500/30 font-label-code text-xs text-on-surface"
              >
                <span
                  className="material-symbols-outlined text-emerald-400"
                  style={{ fontSize: "16px" }}
                >
                  image
                </span>
                <span>{file.name}</span>
                <span className="text-outline text-[11px]">({file.size})</span>
                <button
                  onClick={() => handleRemoveImage(file.id)}
                  aria-label="Remove file"
                  className="text-outline hover:text-error transition-colors ml-1"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "14px" }}
                  >
                    close
                  </span>
                </button>
              </div>
            ))}

            <div
              onClick={handleAddSampleImage}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dashed border-outline-variant/60 text-outline hover:text-on-surface hover:border-outline text-[12px] font-label-code cursor-pointer transition-colors"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "14px" }}
              >
                upload_file
              </span>
              <span>Drop more images here...</span>
            </div>
          </div>
        </div>
      )}

      {/* Panel B: Upload Videos (Violet Glow Container) */}
      {showVideos && (
        <div className="rounded-xl border border-primary-container/30 bg-surface-container-lowest/60 backdrop-blur-md p-4 sm:p-6 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center border border-primary/30">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "16px" }}
                >
                  videocam
                </span>
              </div>
              <h3 className="font-headline-sm text-sm sm:text-base font-semibold text-on-surface">
                Upload Videos
              </h3>
              <span className="font-label-code text-[11px] text-primary bg-primary-container/10 px-2 py-0.5 rounded-full border border-primary/20">
                Neural Transcribe
              </span>
            </div>

            {/* Choose Files Button */}
            <button
              onClick={() => {
                const newId = `vid-${Date.now()}`;
                setVideos((prev) => [
                  ...prev,
                  {
                    id: newId,
                    name: `recorded_clip_${prev.length + 1}.mp4`,
                    size: "32.4 MB",
                    status: "100% Ready",
                  },
                ]);
              }}
              className="self-start sm:self-auto bg-primary-container hover:bg-primary-container/90 text-white font-headline-sm text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-sm border border-white/10 cursor-pointer active:scale-95"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "18px" }}
              >
                add
              </span>
              <span>Choose Files</span>
            </button>
          </div>

          {/* Direct URL quick-stream input & staged video */}
          <div className="mt-3 pt-2 border-t border-primary-container/20 space-y-2.5">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <span
                  className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                  style={{ fontSize: "16px" }}
                >
                  link
                </span>
                <input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleIngestUrl()}
                  className="w-full pl-9 pr-3 py-1.5 bg-surface-container-high/80 border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg font-body-sm text-xs sm:text-sm text-on-surface placeholder:text-outline/70 transition-all"
                  placeholder="Or paste YouTube / Loom / Panopto lecture URL..."
                  type="text"
                />
              </div>
              <button
                onClick={handleIngestUrl}
                className="px-3 py-1.5 rounded-lg bg-surface-container-highest hover:bg-surface-bright text-on-surface font-headline-sm text-xs font-medium border border-outline-variant/50 transition-colors"
              >
                Ingest URL
              </button>
            </div>

            {/* Staged Video Chips */}
            {videos.map((vid) => (
              <div
                key={vid.id}
                className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-high/80 border border-primary-container/20 font-label-code text-xs"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span
                    className="material-symbols-outlined text-primary shrink-0"
                    style={{ fontSize: "18px" }}
                  >
                    video_file
                  </span>
                  <span className="truncate text-on-surface">{vid.name}</span>
                  <span className="text-outline text-[11px] shrink-0">
                    ({vid.size})
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {vid.status}
                  </span>
                  <button
                    onClick={() => handleRemoveVideo(vid.id)}
                    aria-label="Remove video"
                    className="text-outline hover:text-error transition-colors"
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "16px" }}
                    >
                      close
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
