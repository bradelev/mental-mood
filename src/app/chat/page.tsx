"use client";

import Stepper from "../components/Stepper";

export default function Chat() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-blue-900">
          Chat
        </h1>
        <Stepper currentStep={2} />
      </div>
    </div>
  );
}