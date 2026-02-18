// src/steps/driverssteps.tsx
import React from "react";

interface DriverStepProps {
  step: number;
  license: string;
  vehicleType: string;
  vehicleInfo: string;
  licensePhoto: File | null;
  setStep: (step: number) => void;
  setLicense: (val: string) => void;
  setVehicleType: (val: string) => void;
  setVehicleInfo: (val: string) => void;
  setLicensePhoto: (val: File | null) => void;
  validateStep2: () => void;
  validateStep3: () => void;
}

export default function DriverSteps({
  step,
  license,
  vehicleType,
  vehicleInfo,
  licensePhoto,
  setStep,
  setLicense,
  setVehicleType,
  setVehicleInfo,
  setLicensePhoto,
  validateStep2,
  validateStep3,
}: DriverStepProps) {
  if (step === 2) {
    return (
      <>
        <h1 className="logo">Driver Signup</h1>
        <p>Enter your UK Driving License Number</p>
        <input
          type="text"
          placeholder="License #"
          value={license}
          onChange={(e) => setLicense(e.target.value)}
        />
        <div className="btnRow">
          <button onClick={() => setStep(1)}>Back</button>
          <button onClick={validateStep2}>Next</button>
        </div>
      </>
    );
  }

  if (step === 3) {
    return (
      <>
        <h1 className="logo">Vehicle Information</h1>
        <label>Vehicle Type:</label>
        <select
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
        >
          <option value="">Select type</option>
          <option value="Small">Small</option>
          <option value="Medium">Medium</option>
          <option value="Big">Big</option>
        </select>
        <input
          type="text"
          placeholder="Vehicle info (make/model/plate)"
          value={vehicleInfo}
          onChange={(e) => setVehicleInfo(e.target.value)}
        />
        <label>Upload Driving License Photo:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLicensePhoto(e.target.files?.[0] ?? null)}
        />
        <div className="btnRow">
          <button onClick={() => setStep(2)}>Back</button>
          <button onClick={validateStep3}>Next</button>
        </div>
      </>
    );
  }

  return null;
}
