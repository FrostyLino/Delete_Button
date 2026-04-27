"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";

type FailureOs = "windows" | "mac" | "other";
type ErrorScreen = "windows" | "mac";

const buttonWidth = 144;

const confirmationSteps = [
  {
    label: "Impact review",
    title: "Delete request classified as existential",
    body: "The command has been escalated to the Catastrophic Interface Council for immediate theatrical review.",
    action: "Acknowledge severity",
  },
  {
    label: "Authority check",
    title: "Secondary deletion tribunal required",
    body: "Independent auditors have confirmed that this button contains at least one pixel of historic value.",
    action: "Proceed to tribunal",
  },
  {
    label: "Containment",
    title: "Emergency blast doors closing",
    body: "A screen shake has been authorized. Nearby layout elements are being asked to remain calm.",
    action: "Accept tremor",
  },
  {
    label: "Last warning",
    title: "This may alter an object of moderate importance",
    body: "Final confirmation will perform a tiny, local, almost insulting deletion.",
    action: "Open final popup",
  },
  {
    label: "Final popup",
    title: "Close this window to commit the irreversible micro-event",
    body: "Expected result: half of one Delete button will be removed from polite society.",
    action: "Close final popup",
  },
] as const;

const qrCells = Array.from({ length: 81 }, (_, index) => {
  const row = Math.floor(index / 9);
  const column = index % 9;
  const finder =
    (row < 3 && column < 3) ||
    (row < 3 && column > 5) ||
    (row > 5 && column < 3);

  return finder || (index * 7 + row * 3 + column) % 5 < 2;
});

function detectOs(): FailureOs {
  if (typeof navigator === "undefined") {
    return "other";
  }

  const nav = navigator as Navigator & {
    userAgentData?: { platform?: string };
  };
  const platform = `${nav.userAgentData?.platform ?? ""} ${navigator.platform} ${navigator.userAgent}`;
  const normalized = platform.toLowerCase();

  if (normalized.includes("mac")) {
    return "mac";
  }

  if (normalized.includes("win")) {
    return "windows";
  }

  return "other";
}

function detectNativeErrorScreen(): ErrorScreen {
  return detectOs() === "mac" ? "mac" : "windows";
}

export function DeleteButtonDemo() {
  const [overstateOpen, setOverstateOpen] = useState(false);
  const [confirmationStep, setConfirmationStep] = useState(0);
  const [overstateCuts, setOverstateCuts] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [failureOs, setFailureOs] = useState<ErrorScreen | null>(null);
  const [selectedErrorScreen, setSelectedErrorScreen] =
    useState<ErrorScreen>("windows");

  useEffect(() => {
    const detectionTimer = window.setTimeout(() => {
      setSelectedErrorScreen(detectNativeErrorScreen());
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOverstateOpen(false);
        setFailureOs(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(detectionTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function startScreenShake() {
    setShaking(true);
    window.setTimeout(() => setShaking(false), 780);
  }

  function openOverstatementFlow() {
    setConfirmationStep(0);
    setOverstateOpen(true);
    startScreenShake();
  }

  function advanceConfirmation() {
    if (confirmationStep < confirmationSteps.length - 1) {
      setConfirmationStep((step) => step + 1);
      startScreenShake();
      return;
    }

    setOverstateOpen(false);
    setOverstateCuts((cuts) => cuts + 1);
  }

  const overstateVisibleWidth = Math.max(
    1,
    Math.round(buttonWidth / 2 ** overstateCuts),
  );

  return (
    <main
      className={`relative min-h-screen overflow-x-hidden bg-background text-foreground ${shaking ? "screen-shake" : ""}`}
    >
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="flex flex-col items-center gap-10 sm:flex-row sm:gap-16">
          <DeleteButton
            visibleWidth={overstateVisibleWidth}
            onClick={openOverstatementFlow}
            variant="danger"
          />
          <DeleteButton
            visibleWidth={buttonWidth}
            onClick={() => setFailureOs(selectedErrorScreen)}
            variant="quiet"
          />
        </div>
      </div>

      <Link
        href="/info"
        aria-label="Information"
        title="Information"
        className="fixed bottom-4 left-4 grid size-8 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-400 shadow-sm transition hover:border-zinc-300 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2"
      >
        <Info className="size-4" aria-hidden="true" />
      </Link>

      <ErrorScreenSelector
        value={selectedErrorScreen}
        onChange={setSelectedErrorScreen}
      />

      {overstateOpen ? (
        <OverstatementDialogs
          activeStep={confirmationStep}
          onAdvance={advanceConfirmation}
          onCancel={() => setOverstateOpen(false)}
        />
      ) : null}

      {failureOs ? (
        <SystemFailureScreen os={failureOs} onReset={() => setFailureOs(null)} />
      ) : null}
    </main>
  );
}

function ErrorScreenSelector({
  value,
  onChange,
}: {
  value: ErrorScreen;
  onChange: (value: ErrorScreen) => void;
}) {
  return (
    <div
      className="fixed bottom-4 right-4 inline-flex rounded-full border border-zinc-200 bg-white/80 p-1 shadow-sm backdrop-blur-sm"
      aria-label="Error screen selector"
    >
      {(["windows", "mac"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`h-6 min-w-9 rounded-full px-2 text-[11px] font-medium transition focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 ${
            value === option
              ? "bg-zinc-900 text-white"
              : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
          }`}
          aria-pressed={value === option}
          aria-label={`${option === "windows" ? "Windows" : "macOS"} error screen`}
          title={`${option === "windows" ? "Windows" : "macOS"} error screen`}
        >
          {option === "windows" ? "Win" : "Mac"}
        </button>
      ))}
    </div>
  );
}

function DeleteButton({
  visibleWidth,
  onClick,
  variant,
}: {
  visibleWidth: number;
  onClick: () => void;
  variant: "danger" | "quiet";
}) {
  const buttonClasses =
    variant === "danger"
      ? "border-red-600 bg-red-600 text-white hover:bg-red-500 focus:ring-red-400"
      : "border-zinc-300 bg-zinc-100 text-black hover:bg-zinc-200 focus:ring-zinc-400";

  const button = (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-11 w-36 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white ${buttonClasses}`}
      aria-label="Delete"
    >
      <Trash2 className="size-4" aria-hidden="true" />
      Delete
    </button>
  );

  if (visibleWidth >= buttonWidth) {
    return button;
  }

  return (
    <div
      className="h-11 w-36 overflow-hidden rounded-md"
      aria-label="Partially deleted Delete button"
    >
      <div
        className="overflow-hidden transition-[width] duration-300 ease-out"
        style={{ width: visibleWidth }}
      >
        {button}
      </div>
    </div>
  );
}

function OverstatementDialogs({
  activeStep,
  onAdvance,
  onCancel,
}: {
  activeStep: number;
  onAdvance: () => void;
  onCancel: () => void;
}) {
  const visibleSteps = confirmationSteps.slice(0, activeStep + 1);

  return (
    <div className="fixed inset-0 z-40 grid place-items-center overflow-hidden bg-black/80 p-4 backdrop-blur-md">
      <div className="absolute inset-0 danger-flash" />
      <div className="absolute top-6 flex items-center gap-2 rounded-md border border-red-400/30 bg-red-950/60 px-3 py-2 text-sm font-medium text-red-100">
        <AlertTriangle className="size-4" aria-hidden="true" />
        Catastrophic confirmation cascade
      </div>

      <div className="relative h-[420px] w-full max-w-[560px] sm:h-[390px]">
        {visibleSteps.map((step, index) => {
          const isActive = index === activeStep;
          const offset = activeStep - index;

          return (
            <section
              key={step.label}
              aria-hidden={!isActive}
              className={`absolute left-1/2 top-1/2 w-[min(100%,520px)] rounded-lg border bg-[#0b0b0d] p-5 shadow-2xl transition ${
                isActive
                  ? "border-red-300/40 shadow-red-950/50"
                  : "pointer-events-none border-white/10 opacity-60"
              }`}
              style={{
                zIndex: 20 + index,
                transform: `translate(calc(-50% - ${offset * 16}px), calc(-50% - ${offset * 14}px)) rotate(${-offset * 1.5}deg)`,
              }}
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-md border border-red-400/30 bg-red-500/15 text-red-200">
                    <AlertTriangle className="size-6" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-red-200">
                      {step.label}
                    </p>
                    <h2 className="mt-1 text-xl font-medium leading-7 text-white">
                      {step.title}
                    </h2>
                  </div>
                </div>
                {isActive ? (
                  <button
                    type="button"
                    onClick={onCancel}
                    className="grid size-8 place-items-center rounded-md border border-white/10 text-zinc-400 transition hover:bg-white/10 hover:text-white"
                    aria-label="Close confirmation flow"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                ) : null}
              </div>

              <p className="min-h-16 text-sm leading-6 text-zinc-300">
                {step.body}
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
                <div className="flex gap-1.5">
                  {confirmationSteps.map((item, dotIndex) => (
                    <span
                      key={item.label}
                      className={`h-1.5 w-7 rounded-full ${
                        dotIndex <= activeStep ? "bg-red-300" : "bg-white/15"
                      }`}
                    />
                  ))}
                </div>
                {isActive ? (
                  <button
                    type="button"
                    onClick={onAdvance}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-medium text-black transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-black"
                  >
                    {activeStep === confirmationSteps.length - 1 ? (
                      <CheckCircle2 className="size-4" aria-hidden="true" />
                    ) : (
                      <AlertTriangle className="size-4" aria-hidden="true" />
                    )}
                    {step.action}
                  </button>
                ) : null}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function SystemFailureScreen({
  os,
  onReset,
}: {
  os: ErrorScreen;
  onReset: () => void;
}) {
  if (os === "mac") {
    return <MacFailureScreen onReset={onReset} />;
  }

  return <WindowsFailureScreen os={os} onReset={onReset} />;
}

function WindowsFailureScreen({
  os,
  onReset,
}: {
  os: ErrorScreen;
  onReset: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-[#0078d7] text-white">
      <div className="flex min-h-screen flex-col justify-center px-[11vw] py-12">
        <div className="mb-8 text-8xl font-light leading-none">:(</div>
        <div className="max-w-4xl space-y-7">
          <p className="text-3xl font-light leading-tight md:text-4xl">
            Your {os === "windows" ? "PC" : "system"} was deleted by a button
            that did not mention scope. The operation is irreversible.
          </p>
          <p className="text-2xl font-light">0% recoverable</p>
          <div className="flex flex-col gap-5 pt-2 sm:flex-row sm:items-end">
            <div className="grid size-28 grid-cols-9 gap-1 bg-white p-2">
              {qrCells.map((active, index) => (
                <span
                  key={index}
                  className={active ? "bg-[#0078d7]" : "bg-white"}
                />
              ))}
            </div>
            <div className="max-w-2xl space-y-3 text-sm leading-5">
              <p>
                The deletion engine removed system files, restore points,
                recovery partitions, and all comforting metaphors.
              </p>
              <p>
                If you contact support, give them this info:
                <br />
                Stop code: TOTAL_SYSTEM_ABSENCE
              </p>
              <button
                type="button"
                onClick={onReset}
                className="mt-2 inline-flex h-9 items-center gap-2 rounded-md border border-white/35 bg-white/10 px-3 text-sm transition hover:bg-white/20"
              >
                <RefreshCw className="size-4" aria-hidden="true" />
                Restart demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MacFailureScreen({ onReset }: { onReset: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#111311] px-4 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.08),transparent_28%),linear-gradient(110deg,rgba(255,255,255,0.04),transparent_36%,rgba(0,0,0,0.35)_78%)]" />
      <div className="relative w-full max-w-[560px] rounded-[16px] border border-[#6c7172] bg-[#2b3030]/96 px-8 pb-6 pt-10 text-center shadow-[0_26px_70px_rgba(0,0,0,0.72),inset_0_1px_0_rgba(255,255,255,0.08)]">
        <button
          type="button"
          aria-label="Help"
          className="absolute right-6 top-6 grid size-8 place-items-center rounded-full bg-[#7f8585] text-[22px] font-semibold leading-none text-white/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]"
        >
          ?
        </button>

        <div className="mx-auto mb-9 grid size-[88px] place-items-center">
          <svg
            viewBox="0 0 96 86"
            className="size-[88px] drop-shadow-[0_2px_2px_rgba(0,0,0,0.45)]"
            aria-hidden="true"
          >
            <path
              d="M48 5.5 91 80.5H5L48 5.5Z"
              fill="#f6c51a"
              stroke="#f4f4ef"
              strokeWidth="7"
              strokeLinejoin="round"
            />
            <path
              d="M48 28V54"
              stroke="#fff7d4"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <circle cx="48" cy="67" r="5.2" fill="#fff7d4" />
          </svg>
        </div>

        <h2 className="mx-auto max-w-[420px] text-[23px] font-[800] leading-[1.18] tracking-[-0.01em] text-white">
          The version of macOS on the selected disk has been deleted permanently.
        </h2>
        <p className="mx-auto mt-5 max-w-[440px] text-[19px] font-semibold leading-6 text-[#898f8f]">
          Recovery found no startup disk, no snapshots, and no remaining chance
          of recoverability.
        </p>

        <div className="mx-auto mt-7 grid max-w-[376px] gap-2">
          <button
            type="button"
            onClick={onReset}
            className="h-[47px] rounded-[8px] border border-[#0e6fd1] bg-[linear-gradient(#2f9bfd,#116bdc)] px-3 text-[21px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]"
          >
            Recovery...
          </button>
          <button
            type="button"
            className="h-[47px] rounded-[8px] border border-[#777d7d] bg-[#737878] px-3 text-[21px] font-medium text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.09)]"
          >
            Startup Disk...
          </button>
          <label className="mt-4 flex items-center gap-3 text-left text-[22px] font-semibold leading-none text-white">
            <span className="grid size-[23px] place-items-center rounded-[6px] bg-[linear-gradient(#49a4ff,#1774df)] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
              <svg
                viewBox="0 0 18 18"
                className="size-[17px]"
                aria-hidden="true"
              >
                <path
                  d="m4 9 3 3.4L14 5"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            Report malware to Apple to protect other users
          </label>
        </div>
      </div>
    </div>
  );
}
