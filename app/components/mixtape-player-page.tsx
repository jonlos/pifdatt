"use client";

import { startTransition, useEffect, useId, useRef, useState } from "react";
import type { Mixtape, Track } from "@/app/data/mixtape";

const STORAGE_KEY = "datpif-player-state-v1";

type PersistedPlayerState = {
  trackId: string;
  currentTime: number;
  volume: number;
  muted: boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatTimer(totalSeconds: number) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return "--:--";
  }

  const safeSeconds = Math.floor(totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();
  return (
    target.isContentEditable ||
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select"
  );
}

function getTrackIndex(tracks: Track[], trackId: string | null) {
  return tracks.findIndex((track) => track.id === trackId);
}

export default function MixtapePlayerPage({ mixtape }: { mixtape: Mixtape }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const pendingSeekRef = useRef<number | null>(null);
  const shouldAutoplayRef = useRef(false);
  const lastSavedSecondRef = useRef(-1);
  const progressId = useId();
  const volumeId = useId();

  const [activeTrackId, setActiveTrackId] = useState<string | null>(
    mixtape.tracks[0]?.id ?? null,
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [erroredTrackIds, setErroredTrackIds] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState(
    "Wybierz utwór i odpal mixtape.",
  );

  const activeTrackIndex = getTrackIndex(mixtape.tracks, activeTrackId);
  const activeTrack = activeTrackIndex >= 0 ? mixtape.tracks[activeTrackIndex] : null;
  const hasPreviousTrack = activeTrackIndex > 0;
  const hasNextTrack =
    activeTrackIndex >= 0 && activeTrackIndex < mixtape.tracks.length - 1;

  const saveSession = (overrides?: Partial<PersistedPlayerState>) => {
    if (typeof window === "undefined" || !activeTrackId) {
      return;
    }

    const nextState: PersistedPlayerState = {
      trackId: activeTrackId,
      currentTime,
      volume,
      muted: isMuted,
      ...overrides,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  };

  const playCurrentAudio = async () => {
    const audio = audioRef.current;
    if (!audio || !activeTrack) {
      return;
    }

    try {
      await audio.play();
      setStatusMessage(`Teraz gra: ${activeTrack.title}.`);
    } catch {
      setIsPlaying(false);
      setStatusMessage("Przeglądarka wymaga kliknięcia, żeby zacząć odtwarzanie.");
    }
  };

  const pauseCurrentAudio = () => {
    const audio = audioRef.current;
    if (!audio || !activeTrack) {
      return;
    }

    audio.pause();
    setStatusMessage(`Pauza: ${activeTrack.title}.`);
  };

  const skipToTrack = (trackIndex: number, autoplay = true) => {
    const nextTrack = mixtape.tracks[trackIndex];
    if (!nextTrack) {
      return;
    }

    shouldAutoplayRef.current = autoplay;
    pendingSeekRef.current = 0;
    setCurrentTime(0);
    setDuration(0);
    setActiveTrackId(nextTrack.id);
    setErroredTrackIds((currentErrors) =>
      currentErrors.filter((trackId) => trackId !== nextTrack.id),
    );
    setStatusMessage(`Ładowanie: ${nextTrack.title}...`);
  };

  const toggleTrackPlayback = async (trackId: string) => {
    const requestedTrackIndex = getTrackIndex(mixtape.tracks, trackId);
    if (requestedTrackIndex < 0) {
      return;
    }

    if (trackId === activeTrackId) {
      if (isPlaying) {
        pauseCurrentAudio();
      } else {
        await playCurrentAudio();
      }
      return;
    }

    skipToTrack(requestedTrackIndex, true);
  };

  const playMixtape = async () => {
    if (activeTrackId) {
      await toggleTrackPlayback(activeTrackId);
      return;
    }

    if (mixtape.tracks[0]) {
      skipToTrack(0, true);
    }
  };

  const stepTrack = (direction: -1 | 1) => {
    if (activeTrackIndex < 0) {
      return;
    }

    const nextIndex = activeTrackIndex + direction;
    if (nextIndex < 0 || nextIndex >= mixtape.tracks.length) {
      return;
    }

    skipToTrack(nextIndex, true);
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const rawSession = window.localStorage.getItem(STORAGE_KEY);
    if (!rawSession) {
      return;
    }

    try {
      const parsedSession = JSON.parse(rawSession) as Partial<PersistedPlayerState>;
      const storedTrackId =
        typeof parsedSession.trackId === "string" ? parsedSession.trackId : null;
      const storedTrackExists = mixtape.tracks.some(
        (track) => track.id === storedTrackId,
      );
      const nextTrackId = storedTrackExists && storedTrackId ? storedTrackId : null;
      const nextCurrentTime =
        typeof parsedSession.currentTime === "number" ? parsedSession.currentTime : null;
      const nextVolume =
        typeof parsedSession.volume === "number" &&
        parsedSession.volume >= 0 &&
        parsedSession.volume <= 1
          ? parsedSession.volume
          : null;
      const nextMuted =
        typeof parsedSession.muted === "boolean" ? parsedSession.muted : null;

      if (nextCurrentTime !== null) {
        pendingSeekRef.current = nextCurrentTime;
      }

      let restoredStatusMessage: string | null = null;
      if (nextTrackId) {
        const restoredTrack = mixtape.tracks.find(
          (track) => track.id === nextTrackId,
        );
        if (restoredTrack) {
          restoredStatusMessage = `Gotowe do wznowienia — ${restoredTrack.title}.`;
        }
      }

      queueMicrotask(() => {
        startTransition(() => {
          if (nextTrackId) {
            setActiveTrackId(nextTrackId);
          }

          if (nextCurrentTime !== null) {
            setCurrentTime(nextCurrentTime);
          }

          if (nextVolume !== null) {
            setVolume(nextVolume);
          }

          if (nextMuted !== null) {
            setIsMuted(nextMuted);
          }

          if (restoredStatusMessage) {
            setStatusMessage(restoredStatusMessage);
          }
        });
      });
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [mixtape.tracks]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.volume = volume;
    audio.muted = isMuted;
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeTrack) {
      return;
    }

    audio.pause();
    audio.load();

    if (shouldAutoplayRef.current) {
          void audio
            .play()
            .then(() => {
              setStatusMessage(`Teraz gra: ${activeTrack.title}.`);
            })
            .catch(() => {
              setIsPlaying(false);
              setStatusMessage("Przeglądarka wymaga kliknięcia, żeby zacząć odtwarzanie.");
            });
      shouldAutoplayRef.current = false;
    }
  }, [activeTrack]);

  useEffect(() => {
    const persistScrubTime = (nextTime: number) => {
      if (typeof window === "undefined" || !activeTrackId) {
        return;
      }

      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          trackId: activeTrackId,
          currentTime: nextTime,
          volume,
          muted: isMuted,
        } satisfies PersistedPlayerState),
      );
    };

    const onGlobalKeyDown = (event: KeyboardEvent) => {
      const audio = audioRef.current;

      if (isEditableTarget(event.target)) {
        return;
      }

      if (event.code === "Space") {
        event.preventDefault();

        if (!activeTrack) {
          if (mixtape.tracks[0]) {
            shouldAutoplayRef.current = true;
            pendingSeekRef.current = 0;
            setCurrentTime(0);
            setDuration(0);
            setActiveTrackId(mixtape.tracks[0].id);
            setStatusMessage(`Ładowanie: ${mixtape.tracks[0].title}...`);
          }
          return;
        }

        if (isPlaying) {
          audio?.pause();
          setStatusMessage(`Pauza: ${activeTrack.title}.`);
          return;
        }

        if (audio) {
          void audio
            .play()
            .then(() => {
              setStatusMessage(`Teraz gra: ${activeTrack.title}.`);
            })
            .catch(() => {
              setStatusMessage("Przeglądarka wymaga kliknięcia, żeby zacząć odtwarzanie.");
            });
        }
        return;
      }

      if (event.shiftKey && event.key === "ArrowRight") {
        event.preventDefault();

        const nextTrack = mixtape.tracks[activeTrackIndex + 1];
        if (nextTrack) {
          shouldAutoplayRef.current = true;
          pendingSeekRef.current = 0;
          setCurrentTime(0);
          setDuration(0);
          setActiveTrackId(nextTrack.id);
          setErroredTrackIds((currentErrors) =>
            currentErrors.filter((trackId) => trackId !== nextTrack.id),
          );
          setStatusMessage(`Ładowanie: ${nextTrack.title}...`);
        }
        return;
      }

      if (event.shiftKey && event.key === "ArrowLeft") {
        event.preventDefault();

        const previousTrack = mixtape.tracks[activeTrackIndex - 1];
        if (previousTrack) {
          shouldAutoplayRef.current = true;
          pendingSeekRef.current = 0;
          setCurrentTime(0);
          setDuration(0);
          setActiveTrackId(previousTrack.id);
          setErroredTrackIds((currentErrors) =>
            currentErrors.filter((trackId) => trackId !== previousTrack.id),
          );
          setStatusMessage(`Ładowanie: ${previousTrack.title}...`);
        }
        return;
      }

      if (event.key === "ArrowRight" && audio && Number.isFinite(audio.duration)) {
        event.preventDefault();
        const nextTime = clamp(audio.currentTime + 5, 0, audio.duration);
        audio.currentTime = nextTime;
        setCurrentTime(nextTime);
        persistScrubTime(nextTime);
        return;
      }

      if (event.key === "ArrowLeft" && audio && Number.isFinite(audio.duration)) {
        event.preventDefault();
        const nextTime = clamp(audio.currentTime - 5, 0, audio.duration);
        audio.currentTime = nextTime;
        setCurrentTime(nextTime);
        persistScrubTime(nextTime);
      }
    };

    window.addEventListener("keydown", onGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", onGlobalKeyDown);
    };
  }, [
    activeTrack,
    activeTrackId,
    activeTrackIndex,
    isMuted,
    isPlaying,
    mixtape.tracks,
    volume,
  ]);

  const activeElapsed = formatTimer(currentTime);
  const activeDuration = formatTimer(duration);

  return (
    <div className="mixtape-page">
      <section className="hero-panel">
        <div className="cover-card" aria-hidden="true">
          <div className="cover-card__exclusive">Exclusive</div>
          <div className="cover-card__stamp">PIFDATT</div>
          <div className="cover-card__body">
            <p className="cover-card__kicker">{mixtape.artist}</p>
            <h2 className="cover-card__title">{mixtape.title}</h2>
            <p className="cover-card__meta">{mixtape.eraLabel}</p>
          </div>
          <div className="cover-card__footer">{mixtape.artist}</div>
        </div>

        <div className="hero-copy">
          <div className="eyebrow-row">
            <span className="eyebrow-pill">Mixtape</span>
            <span className="eyebrow-pill eyebrow-pill--muted">11 utworów</span>
          </div>
          <h1 className="hero-title">{mixtape.title}</h1>
          <p className="hero-artist">{mixtape.artist}</p>
          <p className="hero-description">{mixtape.description}</p>

          <div className="hero-actions">
            <button
              className="hero-play-button"
              type="button"
              onClick={() => void playMixtape()}
            >
              {isPlaying ? "Pauza" : "Odtwórz"}
            </button>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <div className="track-panel" id="tracklist">
          <div className="panel-heading">
            <div>
              <p className="panel-heading__eyebrow">Tracklista</p>
              <h2 className="panel-heading__title">Wybierz numer</h2>
            </div>
            <p className="panel-heading__hint">Kliknij utwór, żeby od razu odtworzyć.</p>
          </div>

          <div className="tracklist" role="list">
            {mixtape.tracks.map((track) => {
              const isActive = track.id === activeTrackId;
              const isErrored = erroredTrackIds.includes(track.id);
              const rowState = isErrored
                ? "error"
                : isActive && isPlaying
                  ? "playing"
                  : isActive
                    ? "ready"
                    : "idle";

              return (
                <button
                  key={track.id}
                  type="button"
                  className="track-row"
                  data-active={isActive}
                  data-state={rowState}
                  aria-pressed={isActive && isPlaying}
                  onClick={() => void toggleTrackPlayback(track.id)}
                >
                  <span className="track-row__play" aria-hidden="true">
                    {isActive && isPlaying ? "II" : ">"}
                  </span>
                  <span className="track-row__number">
                    {track.number.toString().padStart(2, "0")}
                  </span>
                  <span className="track-row__copy">
                    <strong className="track-row__title">{track.title}</strong>
                    <span className="track-row__artist">{track.artist ?? mixtape.artist}</span>
                  </span>
                  <span className="track-row__status">
                    {isErrored
                      ? "Blad"
                      : isActive && isPlaying
                        ? "Gra"
                        : isActive
                          ? "Pauza"
                          : "Odtwórz"}
                  </span>
                  <span className="track-row__time">{track.duration ?? "--:--"}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="sticky-player-shell"
        id="player"
        aria-label="Sticky mixtape player"
      >
        <div className="sticky-player">
          <div className="sticky-player__track">
            <p className="sticky-player__label">Teraz</p>
            <strong className="sticky-player__title">
              {activeTrack?.title ?? "Nie wybrano utworu"}
            </strong>
            <span className="sticky-player__artist">
              {activeTrack?.artist ?? mixtape.artist}
            </span>
          </div>

          <div className="sticky-player__transport">
            <div className="transport-buttons">
              <button
                type="button"
                className="transport-button"
                onClick={() => stepTrack(-1)}
                disabled={!hasPreviousTrack}
              >
                Wstecz
              </button>
              <button
                type="button"
                className="transport-button transport-button--primary"
                onClick={() => void playMixtape()}
                disabled={!activeTrack}
              >
                {isPlaying ? "Pauza" : "Play"}
              </button>
              <button
                type="button"
                className="transport-button"
                onClick={() => stepTrack(1)}
                disabled={!hasNextTrack}
              >
                Dalej
              </button>
            </div>

            <div className="progress-block">
              <label className="sr-only" htmlFor={progressId}>
                Track progress
              </label>
              <span className="progress-time">{activeElapsed}</span>
              <input
                id={progressId}
                className="progress-slider"
                type="range"
                min={0}
                max={duration || 0}
                step={1}
                value={Math.min(currentTime, duration || 0)}
                disabled={!duration}
                onChange={(event) => {
                  const audio = audioRef.current;
                  if (!audio || !duration) {
                    return;
                  }

                  const nextTime = Number(event.target.value);
                  audio.currentTime = nextTime;
                  setCurrentTime(nextTime);
                  saveSession({ currentTime: nextTime });
                }}
              />
              <span className="progress-time">{activeDuration}</span>
            </div>
          </div>

          <div className="sticky-player__meta">
            <div className="volume-block">
              <button
                type="button"
                className="transport-button transport-button--quiet"
                onClick={() => setIsMuted((currentMuted) => !currentMuted)}
              >
                {isMuted ? "Unmute" : "Mute"}
              </button>
              <label className="sr-only" htmlFor={volumeId}>
                Volume
              </label>
              <input
                id={volumeId}
                className="volume-slider"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(event) => {
                  const nextVolume = Number(event.target.value);
                  setVolume(nextVolume);
                  setIsMuted(nextVolume === 0);
                  saveSession({ volume: nextVolume, muted: nextVolume === 0 });
                }}
              />
            </div>
            <p className="sticky-player__status">{statusMessage}</p>
          </div>
        </div>
      </section>

      <audio
        ref={audioRef}
        src={activeTrack?.mp3Url}
        preload="metadata"
        onLoadedMetadata={(event) => {
          const audio = event.currentTarget;
          const restoredTime = pendingSeekRef.current;

          if (restoredTime !== null) {
            audio.currentTime = clamp(
              restoredTime,
              0,
              Number.isFinite(audio.duration) ? audio.duration : restoredTime,
            );
            pendingSeekRef.current = null;
          }

          lastSavedSecondRef.current = Math.floor(audio.currentTime);
          setCurrentTime(audio.currentTime);
          setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
        }}
        onPlay={() => {
          setIsPlaying(true);
        }}
        onPause={() => {
          setIsPlaying(false);
        }}
        onTimeUpdate={(event) => {
          const nextTime = event.currentTarget.currentTime;
          setCurrentTime(nextTime);

          const roundedSeconds = Math.floor(nextTime);
          if (roundedSeconds !== lastSavedSecondRef.current) {
            lastSavedSecondRef.current = roundedSeconds;
            saveSession({ currentTime: nextTime });
          }
        }}
        onVolumeChange={(event) => {
          setVolume(event.currentTarget.volume);
          setIsMuted(event.currentTarget.muted);
        }}
        onEnded={() => {
          if (hasNextTrack) {
            stepTrack(1);
            return;
          }

          setIsPlaying(false);
          setStatusMessage("Koniec mixtape'u.");
        }}
        onError={() => {
          if (!activeTrack) {
            return;
          }

          setErroredTrackIds((currentErrors) =>
            currentErrors.includes(activeTrack.id)
              ? currentErrors
              : [...currentErrors, activeTrack.id],
          );

          if (hasNextTrack) {
            setStatusMessage(
              `${activeTrack.title} nie załadował się. Przechodzę dalej.`,
            );
            stepTrack(1);
            return;
          }

          setIsPlaying(false);
          setStatusMessage(`${activeTrack.title} nie załadował się.`);
        }}
      />
    </div>
  );
}
