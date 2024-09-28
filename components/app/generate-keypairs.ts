"use client"

import GenerateKeypairs from "../components/app/generate-keypairs";

export default function IntegratePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Generate Blink</h1>
      <GenerateKeypairs />
    </div>
  );
}