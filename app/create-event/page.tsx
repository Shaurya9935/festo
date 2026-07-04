"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { CreateEventStepper, type StepDef } from "@/components/CreateEventStepper";
import {
  Step1Details,
  Step2GuestList,
  Step3Badges,
  Step4Review,
  Step5Launchpad,
  type Step1Data,
} from "@/components/CreateEventSteps";

// ─── Step definitions ─────────────────────────────────────────────────────────
const STEPS: StepDef[] = [
  { id: 1, title: "Event Details", description: "The basics" },
  { id: 2, title: "Guest List", description: "Upload attendees" },
  { id: 3, title: "Badge Design", description: "Visual identity" },
  { id: 4, title: "Review", description: "Final checks" },
  { id: 5, title: "Launchpad", description: "Event is live" },
];

// ─── Form state shape ─────────────────────────────────────────────────────────
type FormErrors = Partial<Record<keyof Step1Data, string>>;

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CreateEventPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | undefined>(undefined);

  // Step 1 data
  const [step1, setStep1] = useState<Step1Data>({
    eventName: "",
    eventVenue: "",
    eventStartAt: "",
    eventEndAt: "",
    eventDescription: "",
  });
  const [step1Errors, setStep1Errors] = useState<FormErrors>({});

  // Step 2 data
  const [guestFileName, setGuestFileName] = useState<string | null>(null);

  // Step 3 data
  const [selectedTemplate, setSelectedTemplate] = useState(2);

  // ─── Validation ─────────────────────────────────────────────────────────────
  const validateStep1 = (): boolean => {
    const errs: FormErrors = {};

    if (!step1.eventName.trim()) errs.eventName = "Event name is required";
    else if (step1.eventName.trim().length < 3) errs.eventName = "Must be at least 3 characters";
    else if (step1.eventName.trim().length > 50) errs.eventName = "Max 50 characters";

    if (!step1.eventVenue.trim()) errs.eventVenue = "Venue is required";
    else if (step1.eventVenue.trim().length < 3) errs.eventVenue = "Must be at least 3 characters";

    if (!step1.eventDescription.trim()) errs.eventDescription = "Description is required";
    else if (step1.eventDescription.trim().length < 3) errs.eventDescription = "Must be at least 3 characters";

    if (!step1.eventStartAt) errs.eventStartAt = "Start date is required";
    if (!step1.eventEndAt) errs.eventEndAt = "End date is required";
    if (step1.eventStartAt && step1.eventEndAt) {
      const start = new Date(step1.eventStartAt);
      const end = new Date(step1.eventEndAt);
      const now = new Date();
      if (start <= now) errs.eventStartAt = "Start time must be in the future";
      else if (end <= start) errs.eventEndAt = "End time must be after start time";
    }

    setStep1Errors(errs);
    return Object.keys(errs).length === 0;
  };

  // ─── Navigation ──────────────────────────────────────────────────────────────
  const handleContinue = () => {
    if (currentStep === 1 && !validateStep1()) return;
    setCurrentStep((s) => Math.min(s + 1, STEPS.length));
  };

  // ─── Submit ──────────────────────────────────────────────────────────────────
  const handlePublish = async () => {
    setLoading(true);
    setApiError(undefined);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName: step1.eventName.trim(),
          eventDescription: step1.eventDescription.trim(),
          eventVenue: step1.eventVenue.trim(),
          eventStartAt: new Date(step1.eventStartAt).toISOString(),
          eventEndAt: new Date(step1.eventEndAt).toISOString(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setApiError(
          res.status === 401
            ? "You must be logged in to publish an event."
            : data.message || "Something went wrong. Please try again."
        );
        return;
      }
      // Advance to launchpad
      setCurrentStep(5);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Network error.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#fdf5fa]">
      {/* Left sidebar stepper */}
      <CreateEventStepper steps={STEPS} currentStep={currentStep} />

      {/* Right canvas */}
      <div className="flex-1 h-full overflow-y-auto flex flex-col relative z-0">
        {/* Content area */}
        <div className="flex-1 px-16 lg:px-32 xl:px-48 pt-24 pb-48 flex flex-col justify-center min-h-max relative">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <Step1Details
                key="step1"
                data={step1}
                errors={step1Errors}
                onChange={(key, val) => {
                  setStep1((prev) => ({ ...prev, [key]: val }));
                  // Clear error on change
                  if (step1Errors[key]) {
                    setStep1Errors((prev) => ({ ...prev, [key]: undefined }));
                  }
                }}
              />
            )}
            {currentStep === 2 && (
              <Step2GuestList
                key="step2"
                fileName={guestFileName}
                onFile={setGuestFileName}
              />
            )}
            {currentStep === 3 && (
              <Step3Badges
                key="step3"
                selectedTemplate={selectedTemplate}
                onSelect={setSelectedTemplate}
              />
            )}
            {currentStep === 4 && (
              <Step4Review
                key="step4"
                eventName={step1.eventName}
                eventVenue={step1.eventVenue}
                eventStartAt={step1.eventStartAt}
                eventEndAt={step1.eventEndAt}
                guestFileName={guestFileName}
                selectedTemplate={selectedTemplate}
                onPublish={handlePublish}
                loading={loading}
                error={apiError}
              />
            )}
            {currentStep === 5 && (
              <Step5Launchpad key="step5" eventName={step1.eventName} />
            )}
          </AnimatePresence>
        </div>

        {/* Global navigation footer — hidden on steps 4 & 5 */}
        <AnimatePresence>
          {currentStep < 4 && (
            <motion.div
              key="footer-nav"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-0 right-0 w-[70%] bg-gradient-to-t from-[#fdf5fa] via-[#fdf5fa]/90 to-transparent p-8 lg:p-12 pb-12 lg:pb-16 flex justify-end px-16 lg:px-32 xl:px-48 pointer-events-none"
            >
              <button
                onClick={handleContinue}
                className="pointer-events-auto flex items-center bg-[#4C3A51] text-white px-8 py-4 rounded-full text-sm font-semibold tracking-widest uppercase transition-all duration-500 hover:bg-[#774360] hover:scale-105 hover:shadow-[0_10px_30px_-10px_rgba(76,58,81,0.5)] focus:outline-none group font-['Inter']"
              >
                Continue
                <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
