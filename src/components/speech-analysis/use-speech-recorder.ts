"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  0: { transcript: string };
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
};

type SpeechRecognitionErrorLike = { error: string };

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

// Feature-detecting the Web Speech API differs between server (never available)
// and client, so it's read via useSyncExternalStore rather than state+effect —
// this avoids a hydration mismatch without an extra post-mount render.
function subscribeNoop() {
  return () => {};
}
function getClientSnapshot() {
  return getRecognitionCtor() !== null;
}
function getServerSnapshot() {
  return false;
}

function errorMessage(code: string): string {
  if (code === "not-allowed" || code === "permission-denied") {
    return "Microphone access was denied. Check your browser permissions and try again.";
  }
  if (code === "no-speech") {
    return "No speech detected — try again a little closer to the microphone.";
  }
  return "Recording stopped due to an unexpected error.";
}

export function useSpeechRecorder() {
  const supported = useSyncExternalStore(subscribeNoop, getClientSnapshot, getServerSnapshot);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const finalTranscriptRef = useRef("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function start() {
    if (recording) return;
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setError("Voice recording isn't supported in this browser — paste your speech instead.");
      return;
    }

    setError(null);
    finalTranscriptRef.current = "";
    setTranscript("");
    setInterim("");
    setElapsedSeconds(0);

    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscriptRef.current += `${result[0].transcript.trim()} `;
        } else {
          interimText += result[0].transcript;
        }
      }
      setTranscript(finalTranscriptRef.current.trim());
      setInterim(interimText);
    };

    recognition.onerror = (event) => {
      setError(errorMessage(event.error));
      setRecording(false);
      stopTimer();
    };

    recognition.onend = () => {
      setRecording(false);
      stopTimer();
    };

    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);

    timerRef.current = setInterval(() => {
      setElapsedSeconds((t) => t + 1);
    }, 1000);
  }

  function stop() {
    recognitionRef.current?.stop();
    stopTimer();
    setRecording(false);
  }

  return { supported, recording, transcript, interim, elapsedSeconds, error, start, stop };
}
