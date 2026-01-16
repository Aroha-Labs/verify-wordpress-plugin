import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

// Step components
function Step1Download({ onNext }: { onNext: () => void }) {
  const downloadUrl = `${import.meta.env.VITE_API_URL}/download/plugin`;

  const handleDownload = () => {
    window.open(downloadUrl, "_blank");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <h1
          style={{
            fontFamily: "Geist, sans-serif",
            fontWeight: 600,
            fontSize: "32px",
            color: "#18181B",
            lineHeight: 1.2,
          }}
        >
          You're in! Let's get
          <br />
          FactPress plugin
          <br />
          installed.
        </h1>
        <p
          className="mt-4"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            color: "#6B7280",
          }}
        >
          Download the plugin file, then we'll install it
          <br />
          in WordPress Playground.
        </p>
      </div>

      <div className="mt-8 flex gap-3">
        <Button
          onClick={handleDownload}
          variant="outline"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "16px",
            borderRadius: "8px",
            height: "48px",
            paddingLeft: "24px",
            paddingRight: "24px",
          }}
        >
          Download Plugin
        </Button>
        <Button
          onClick={onNext}
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "16px",
            backgroundColor: "#18181B",
            color: "white",
            borderRadius: "8px",
            height: "48px",
            paddingLeft: "24px",
            paddingRight: "24px",
          }}
        >
          I have the file &rarr;
        </Button>
      </div>
    </div>
  );
}

function Step2Install({ onNext }: { onNext: () => void }) {
  const steps = [
    <>
      Open{" "}
      <a
        href="https://playground.wordpress.net"
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        playground.wordpress.net
      </a>{" "}
      &nearr;
    </>,
    <>
      Go to <strong>Plugins</strong> on the left sidebar
    </>,
    <>
      Click <strong>Add New Plugin</strong> &rarr; <strong>Upload Plugin</strong>
    </>,
    <>
      Choose <strong>factpress-plugin.zip</strong> from your device
    </>,
    <>
      Click <strong>Install Now</strong>, then <strong>Activate</strong>
    </>,
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <h1
          style={{
            fontFamily: "Geist, sans-serif",
            fontWeight: 600,
            fontSize: "32px",
            color: "#18181B",
            lineHeight: 1.2,
          }}
        >
          Open WordPress Playground
        </h1>
        <p
          className="mt-4"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            color: "#6B7280",
          }}
        >
          We'll install FactPress in a free WordPress
          <br />
          environment. No hosting needed.
        </p>

        <div className="mt-8 space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-3">
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white text-sm flex items-center justify-center"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
              >
                {index + 1}
              </span>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "15px",
                  color: "#18181B",
                }}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <Button
          onClick={onNext}
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "16px",
            backgroundColor: "#18181B",
            color: "white",
            borderRadius: "8px",
            height: "48px",
            paddingLeft: "24px",
            paddingRight: "24px",
          }}
        >
          I've activated it &rarr;
        </Button>
        <Button
          variant="outline"
          onClick={() => window.open("mailto:hello@factpress.ai", "_blank")}
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "16px",
            borderRadius: "8px",
            height: "48px",
            paddingLeft: "24px",
            paddingRight: "24px",
          }}
        >
          Get Support
        </Button>
      </div>
    </div>
  );
}

function Step3Connect({ onNext }: { onNext: () => void }) {
  const steps = [
    <>
      Go to <strong>Settings</strong> &rarr; <strong>FactPress</strong>
    </>,
    <>
      Paste the URL below into the field:
      <br />
      <strong className="text-blue-600">factpress.ai</strong>
    </>,
    <>
      Click <strong>Connect to Mira Verify</strong>
    </>,
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <h1
          style={{
            fontFamily: "Geist, sans-serif",
            fontWeight: 600,
            fontSize: "32px",
            color: "#18181B",
            lineHeight: 1.2,
          }}
        >
          Connect to FactPress
        </h1>
        <p
          className="mt-4"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            color: "#6B7280",
          }}
        >
          Last step, let's link your account.
        </p>

        <div className="mt-8 space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-3">
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white text-sm flex items-center justify-center"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
              >
                {index + 1}
              </span>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "15px",
                  color: "#18181B",
                }}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <Button
          onClick={onNext}
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "16px",
            backgroundColor: "#18181B",
            color: "white",
            borderRadius: "8px",
            height: "48px",
            paddingLeft: "24px",
            paddingRight: "24px",
          }}
        >
          I'm connected &rarr;
        </Button>
        <Button
          variant="outline"
          onClick={() => window.open("mailto:hello@factpress.ai", "_blank")}
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "16px",
            borderRadius: "8px",
            height: "48px",
            paddingLeft: "24px",
            paddingRight: "24px",
          }}
        >
          Get Support
        </Button>
      </div>
    </div>
  );
}

function Step4Complete() {
  const handleGoToPosts = () => {
    window.open("https://playground.wordpress.net/wp-admin/edit.php", "_blank");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <h1
          style={{
            fontFamily: "Geist, sans-serif",
            fontWeight: 600,
            fontSize: "32px",
            color: "#18181B",
            lineHeight: 1.2,
          }}
        >
          You're all set!
        </h1>
        <p
          className="mt-4"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            color: "#6B7280",
          }}
        >
          FactPress is ready. Head to Posts and you'll find the
          <br />
          fact-checker in the right sidebar of the editor.
        </p>
      </div>

      <div className="mt-8 flex gap-3">
        <Button
          onClick={handleGoToPosts}
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "16px",
            backgroundColor: "#18181B",
            color: "white",
            borderRadius: "8px",
            height: "48px",
            paddingLeft: "24px",
            paddingRight: "24px",
          }}
        >
          Go to Posts &rarr;
        </Button>
        <Button
          variant="outline"
          onClick={() => window.open("mailto:hello@factpress.ai", "_blank")}
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "16px",
            borderRadius: "8px",
            height: "48px",
            paddingLeft: "24px",
            paddingRight: "24px",
          }}
        >
          Get Support
        </Button>
      </div>
    </div>
  );
}

// Step images
const stepImages = [
  "/onboarding/1.jpg",
  "/onboarding/2.jpg",
  "/onboarding/3.jpg",
  "/onboarding/4.jpg",
];

interface OnboardingFlowProps {
  user: { name?: string | null; image?: string | null };
}

export function OnboardingFlow({ user }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <title>Get Started - FactPress</title>

      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid #E8E8E8" }}
      >
        <Link to="/" className="flex items-center gap-2">
          <img src="/FactPressLogo-black.svg" alt="" className="h-5" />
          <span
            style={{
              fontFamily: "Geist, sans-serif",
              fontWeight: 500,
              fontSize: "18px",
            }}
          >
            FactPress
          </span>
        </Link>
        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white overflow-hidden">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || ""}
              className="w-full h-full object-cover"
            />
          ) : (
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: "14px",
              }}
            >
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-8 py-12">
        <div
          className="w-full max-w-4xl flex gap-12"
          style={{ minHeight: "450px" }}
        >
          {/* Left side - Content */}
          <div className="flex-1 flex flex-col">
            {/* Step indicator */}
            <div className="mb-6">
              <span
                className="inline-flex items-center px-3 py-1 rounded-full border border-gray-200 text-sm"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <span className="font-semibold text-gray-900">Step {step}</span>
                <span className="text-gray-500 ml-1">of 4</span>
              </span>
            </div>

            {/* Step content */}
            {step === 1 && <Step1Download onNext={nextStep} />}
            {step === 2 && <Step2Install onNext={nextStep} />}
            {step === 3 && <Step3Connect onNext={nextStep} />}
            {step === 4 && <Step4Complete />}
          </div>

          {/* Right side - Image */}
          <div className="w-[280px] flex-shrink-0">
            <img
              src={stepImages[step - 1]}
              alt={`Step ${step} illustration`}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 flex justify-center">
        <img
          src="/powered-by-mira.svg"
          alt="powered by mira"
          style={{ opacity: 0.4 }}
        />
      </footer>
    </div>
  );
}
