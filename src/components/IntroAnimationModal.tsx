import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Upload,
  CheckCircle2,
  AlertCircle,
  Maximize2,
  Minimize2,
  ChevronRight,
  Film
} from "lucide-react";
import { saveCustomVideoBlob, getCustomVideoBlob, clearCustomVideoBlob } from "../utils/videoStorage";

interface IntroAnimationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IntroAnimationModal: React.FC<IntroAnimationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(6.5);
  const [isWhiteBloom, setIsWhiteBloom] = useState(false);
  const [fitMode, setFitMode] = useState<"cover" | "contain">("cover");
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideControlsTimer = useRef<NodeJS.Timeout | null>(null);

  const [autoPlayOnStart, setAutoPlayOnStart] = useState(() => {
    const saved = localStorage.getItem("smart_kitchen_autoplay_intro");
    return saved === null ? true : saved === "true";
  });

  const [videoSrc, setVideoSrc] = useState<string>("/intro.mp4");
  const [isCustomUserVideo, setIsCustomUserVideo] = useState(false);

  // Load custom video from IndexedDB on initial mount if available
  useEffect(() => {
    let objectUrl: string | null = null;
    (async () => {
      try {
        const blob = await getCustomVideoBlob();
        if (blob) {
          objectUrl = URL.createObjectURL(blob);
          setVideoSrc(objectUrl);
          setIsCustomUserVideo(true);
        }
      } catch (e) {
        console.warn("Failed to load custom video blob from IndexedDB:", e);
      }
    })();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, []);

  // Handle video autoplay whenever opened or source changes
  useEffect(() => {
    if (isOpen) {
      setIsWhiteBloom(false);
      setCurrentTime(0);
      setHasError(false);
      setControlsVisible(true);

      const v = videoRef.current;
      if (v) {
        // Enforce muted and playsInline for strict mobile browser autoplay policies
        v.muted = isMuted;
        v.defaultMuted = true;
        v.playsInline = true;
        const playPromise = v.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(() => {
              // Browser policy fallback: force mute
              v.muted = true;
              setIsMuted(true);
              v.play()
                .then(() => setIsPlaying(true))
                .catch(() => {
                  setIsPlaying(false);
                });
            });
        }
      }

      resetHideTimer();
    }
  }, [isOpen, videoSrc]);

  // Keyboard shortcut listener (Esc/Space to skip/pause)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        handleSkip();
      } else if (e.key === " " && e.target === document.body) {
        e.preventDefault();
        handleTogglePlay();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isPlaying]);

  const resetHideTimer = () => {
    setControlsVisible(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => {
      setControlsVisible(false);
    }, 3500);
  };

  const handleMouseMove = () => {
    resetHideTimer();
  };

  if (!isOpen) return null;

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 6.5;
    setCurrentTime(cur);
    setDuration(dur);

    // Near the end (last 0.6s), trigger white bloom transition
    if (dur > 0 && cur >= dur - 0.6 && !isWhiteBloom) {
      setIsWhiteBloom(true);
    }
  };

  const handleVideoEnded = () => {
    setIsWhiteBloom(true);
    setTimeout(() => {
      onClose();
    }, 450);
  };

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
          }
        });
    }
    resetHideTimer();
  };

  const handleToggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    resetHideTimer();
  };

  const handleReplay = () => {
    if (!videoRef.current) return;
    setIsWhiteBloom(false);
    videoRef.current.currentTime = 0;
    videoRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    resetHideTimer();
  };

  const handleSkip = () => {
    setIsWhiteBloom(true);
    setTimeout(() => {
      onClose();
    }, 250);
  };

  const handleToggleAutoPlay = (checked: boolean) => {
    setAutoPlayOnStart(checked);
    localStorage.setItem("smart_kitchen_autoplay_intro", checked ? "true" : "false");
  };

  // Process user's MP4 file (picked from device or dragged)
  const processUserMp4File = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".mp4") && !file.type.includes("video")) {
      setStatusMessage("請選擇 MP4 格式影片檔案！");
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }

    setIsUploading(true);
    setStatusMessage("正在載入並套用您的影片...");

    try {
      // 1. Immediately create local Object URL for instant 0-latency playback
      const localUrl = URL.createObjectURL(file);
      setVideoSrc(localUrl);
      setIsCustomUserVideo(true);
      setHasError(false);

      // 2. Persist in IndexedDB for permanent local storage across reloads
      await saveCustomVideoBlob(file);

      // 3. Upload to server `/public/intro.mp4` asynchronously
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          await fetch("/api/upload-intro-video", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ videoBase64: base64, filename: file.name }),
          });
          setStatusMessage(`✅ 已成功套用「${file.name}」為滿屏影片！`);
          setTimeout(() => setStatusMessage(null), 3000);
        } catch (err) {
          console.warn("Server upload fallback warning:", err);
        }
      };
      reader.readAsDataURL(file);

      // Restart playback with the new video
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
        }
      }, 100);
    } catch (err: any) {
      setStatusMessage("套用影片失敗: " + (err.message || "未知錯誤"));
      setTimeout(() => setStatusMessage(null), 3000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUserMp4File(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUserMp4File(file);
    }
  };

  const handleResetToDefault = async () => {
    await clearCustomVideoBlob();
    setVideoSrc(`/intro.mp4?t=${Date.now()}`);
    setIsCustomUserVideo(false);
    setHasError(false);
    setStatusMessage("已恢復為預設動畫影片");
    setTimeout(() => setStatusMessage(null), 2500);
    handleReplay();
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      onMouseMove={handleMouseMove}
      onTouchStart={resetHideTimer}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="fixed inset-0 w-screen h-screen z-[100] bg-black overflow-hidden flex items-center justify-center select-none"
    >
      {/* Hidden file input for MP4 upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Full-Screen Video Player */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        playsInline
        muted={isMuted}
        preload="auto"
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration || 6.5);
          }
        }}
        onCanPlay={() => {
          if (videoRef.current && isPlaying) {
            videoRef.current.muted = isMuted;
            videoRef.current.play().catch(() => {
              if (videoRef.current) {
                videoRef.current.muted = true;
                setIsMuted(true);
                videoRef.current.play().catch(() => setIsPlaying(false));
              }
            });
          }
        }}
        onError={() => {
          console.warn("Video failed to play / load");
          setHasError(true);
          setStatusMessage("影片載入中或無法播放，點擊右上方「進入系統」直接開始料理！");
        }}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnded}
        onClick={handleTogglePlay}
        className={`w-full h-full transition-all duration-300 ${
          fitMode === "cover" ? "object-cover" : "object-contain"
        } cursor-pointer`}
      />

      {/* Drag & Drop Visual Overlay */}
      {isDraggingOver && (
        <div className="absolute inset-0 bg-blue-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white border-4 border-dashed border-blue-400 z-50 pointer-events-none animate-in fade-in duration-150">
          <Film className="w-16 h-16 text-blue-300 animate-bounce mb-3" />
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">放開以套用您的 MP4 影片</h2>
          <p className="text-xs sm:text-sm text-blue-200 mt-1">
            將立即滿屏播放您的影片！
          </p>
        </div>
      )}

      {/* White bloom flash on video conclusion */}
      <div
        className={`absolute inset-0 bg-white pointer-events-none transition-opacity duration-500 z-60 ${
          isWhiteBloom ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Floating Center Play Icon when paused */}
      {!isPlaying && (
        <button
          onClick={handleTogglePlay}
          className="absolute inset-0 m-auto w-24 h-24 rounded-full bg-white/90 hover:bg-white text-slate-900 border-2 border-slate-850 flex flex-col items-center justify-center shadow-2xl hover:scale-105 transition-all cursor-pointer z-30"
          title="播放"
        >
          <Play className="w-9 h-9 ml-1 text-slate-900" />
          <span className="text-[10px] font-black text-slate-800 mt-0.5">點擊播放</span>
        </button>
      )}

      {/* Error or Status banner notification */}
      {(statusMessage || hasError) && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 text-white px-4 py-2.5 rounded-2xl border border-slate-700 shadow-2xl text-xs font-bold flex items-center gap-2.5 backdrop-blur-md animate-in fade-in slide-in-from-top duration-200 max-w-[90vw]">
          {hasError ? (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span className="truncate">{statusMessage || "影片需要點擊播放或進入系統"}</span>
          <button
            onClick={handleSkip}
            className="px-2.5 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black shrink-0 whitespace-nowrap text-[11px]"
          >
            直接進入
          </button>
        </div>
      )}

      {/* TOP FLOATING CINEMATIC BAR */}
      <div
        className={`absolute top-0 left-0 right-0 p-3 sm:p-5 flex items-center justify-between gap-2 sm:gap-3 z-30 transition-opacity duration-300 pointer-events-auto ${
          controlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Top Left: Pick user video button */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl bg-black/60 hover:bg-black/80 text-white text-xs font-bold border border-white/20 backdrop-blur-md flex items-center gap-1.5 shadow-xl transition-all cursor-pointer whitespace-nowrap"
            title="選擇手機或電腦中的 MP4 影片"
          >
            <Upload className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="text-[11px] sm:text-xs">
              {isUploading ? "載入中..." : "選擇影片"}
            </span>
          </button>

          {isCustomUserVideo && (
            <button
              onClick={handleResetToDefault}
              className="px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-2xl bg-black/60 hover:bg-black/80 text-slate-300 hover:text-white text-[11px] sm:text-xs border border-white/20 backdrop-blur-md flex items-center gap-1 shadow-xl transition-all cursor-pointer whitespace-nowrap"
              title="恢復預設動畫"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" />
              <span className="hidden sm:inline">恢復預設</span>
            </button>
          )}
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
          {/* Sound Toggle */}
          <button
            onClick={handleToggleMute}
            className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl bg-black/60 hover:bg-black/80 text-white text-xs font-bold border border-white/20 backdrop-blur-md flex items-center gap-1.5 shadow-xl transition-all cursor-pointer whitespace-nowrap"
            title={isMuted ? "點擊開啟聲音" : "靜音"}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-[11px] sm:text-xs">靜音</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[11px] sm:text-xs">開聲</span>
              </>
            )}
          </button>

          {/* Fit Mode Toggle (Cover / Contain) */}
          <button
            onClick={() => setFitMode(fitMode === "cover" ? "contain" : "cover")}
            className="p-1.5 sm:p-2 rounded-2xl bg-black/60 hover:bg-black/80 text-white text-xs border border-white/20 backdrop-blur-md shadow-xl transition-all cursor-pointer shrink-0"
            title={fitMode === "cover" ? "切換為等比例黑邊" : "切換為滿版填滿"}
          >
            {fitMode === "cover" ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Skip CTA Button */}
          <button
            onClick={handleSkip}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-white hover:bg-amber-100 text-slate-900 text-xs sm:text-sm font-black border-2 border-slate-900 shadow-xl flex items-center gap-1 hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap shrink-0"
            title="進入料理系統 (Esc)"
          >
            <span>進入系統</span>
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-900" />
          </button>
        </div>
      </div>

      {/* BOTTOM FLOATING CINEMATIC BAR */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-3 sm:p-5 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col gap-2 z-30 transition-opacity duration-300 pointer-events-auto ${
          controlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Full-width Timeline Progress Bar */}
        <div
          onClick={(e) => {
            if (!videoRef.current) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            videoRef.current.currentTime = pos * duration;
          }}
          className="relative w-full h-1.5 hover:h-2.5 rounded-full bg-white/20 overflow-hidden cursor-pointer transition-all"
        >
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-rose-400 to-sky-400 transition-all duration-75"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-2 text-white text-xs pt-1 flex-wrap">
          {/* Controls: Play/Pause/Replay & Time */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleTogglePlay}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </button>

            <button
              onClick={handleReplay}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
              title="重播"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <span className="font-mono text-[10px] sm:text-[11px] text-slate-300 font-bold ml-1">
              {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
            </span>
          </div>

          {/* Autoplay setting */}
          <div className="flex items-center gap-3 text-xs font-medium text-slate-300 ml-auto">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-200 cursor-pointer select-none whitespace-nowrap">
              <input
                type="checkbox"
                checked={autoPlayOnStart}
                onChange={(e) => handleToggleAutoPlay(e.target.checked)}
                className="rounded border-slate-500 text-amber-500 focus:ring-amber-400"
              />
              <span className="text-[10px] sm:text-xs">每次開啟網頁時播放</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
