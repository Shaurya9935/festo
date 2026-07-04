"use client";

import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";

export type StepDef = {
  id: number;
  title: string;
  description: string;
};

interface CreateEventStepperProps {
  steps: StepDef[];
  currentStep: number;
}

export function CreateEventStepper({ steps, currentStep }: CreateEventStepperProps) {
  return (
    <div className="w-[30%] h-full relative bg-[#4C3A51] overflow-hidden flex flex-col z-10 font-['Inter'] shrink-0">
      {/* Ambient glowing gradients */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] opacity-40 mix-blend-screen pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, #B25068 0%, transparent 40%), radial-gradient(circle at 80% 60%, #E7AB79 0%, transparent 50%), radial-gradient(circle at 50% 90%, #774360 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative z-10 flex flex-col h-full p-12 lg:p-20">
        {/* Brand */}
        <div className="flex items-center space-x-4 mb-24">
          <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20">
            <div className="w-3 h-3 bg-[#E7AB79] rounded-sm" />
          </div>
          <span className="text-2xl font-medium tracking-wide text-white font-['Hanken_Grotesk']">
            Festo
          </span>
        </div>

        {/* Stepper */}
        <div className="flex-1 flex flex-col justify-center space-y-16">
          {steps.map((step, index) => {
            const isActive = currentStep === step.id;
            const isPast = currentStep > step.id;

            return (
              <div key={step.id} className="flex items-start relative group">
                {/* Connecting line */}
                {index !== steps.length - 1 && (
                  <div
                    className={`absolute top-10 left-[11px] w-[1px] h-20 -ml-[0.5px] transition-colors duration-700 ${
                      isPast ? "bg-[#E7AB79]/40" : "bg-white/10"
                    }`}
                  />
                )}

                {/* Step indicator */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 mt-1 transition-all duration-700 ${
                    isActive
                      ? "bg-[#E7AB79] scale-125 shadow-[0_0_15px_rgba(231,171,121,0.5)]"
                      : isPast
                      ? "bg-transparent border border-[#E7AB79]/50"
                      : "bg-transparent border border-white/20"
                  }`}
                >
                  {isPast ? (
                    <Check className="w-3 h-3 text-[#E7AB79] stroke-[3]" />
                  ) : (
                    <div
                      className={`w-1.5 h-1.5 rounded-full transition-colors duration-700 ${
                        isActive ? "bg-[#4C3A51]" : "bg-transparent"
                      }`}
                    />
                  )}
                </div>

                {/* Step text */}
                <div className="ml-8 flex flex-col cursor-default">
                  <span
                    className={`text-base tracking-wide transition-all duration-500 font-['Hanken_Grotesk'] ${
                      isActive
                        ? "text-white font-medium"
                        : isPast
                        ? "text-white/60 font-light"
                        : "text-white/30 font-light"
                    }`}
                  >
                    {step.title}
                  </span>
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 4 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <span className="text-[#E7AB79]/80 text-xs tracking-wider uppercase">
                          {step.description}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center text-white/30 text-[10px] uppercase tracking-widest">
          <span className="w-1 h-1 rounded-full bg-green-400/50 mr-3" />
          Cloud Synced
        </div>
      </div>
    </div>
  );
}
