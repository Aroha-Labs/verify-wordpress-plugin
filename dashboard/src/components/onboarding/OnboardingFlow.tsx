import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight } from "lucide-react";

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
            fontWeight: 500,
            fontSize: "32px",
            color: "rgba(24, 24, 27, 1)",
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
            fontWeight: 500,
            fontSize: "13px",
            color: "rgba(24, 24, 27, 0.6)",
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
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "14px",
            backgroundColor: "rgba(24, 24, 27, 1)",
            color: "white",
            borderRadius: "50px",
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          Download Plugin
        </Button>
        <Button
          onClick={onNext}
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "14px",
            backgroundColor: "transparent",
            color: "rgba(24, 24, 27, 1)",
            border: "2px solid rgba(24, 24, 27, 1)",
            borderRadius: "50px",
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          I have the file <ArrowRight className="inline h-4 w-4 ml-1" />
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
        playground.wordpress.net <ArrowUpRight className="inline h-4 w-4" />
      </a>
    </>,
    <>
      Go to <strong>Plugins</strong> on the left sidebar
    </>,
    <>
      Click <strong>Add New Plugin</strong> <ArrowRight className="inline h-4 w-4" /> <strong>Upload Plugin</strong>
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
            fontWeight: 500,
            fontSize: "24px",
            color: "rgba(24, 24, 27, 1)",
            lineHeight: 1.2,
          }}
        >
          Open WordPress Playground
        </h1>
        <p
          className="mt-4"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "13px",
            color: "rgba(24, 24, 27, 0.6)",
          }}
        >
          We'll install FactPress in a free WordPress
          <br />
          environment. No hosting needed.
        </p>

        <div style={{ marginTop: "36px", marginBottom: "36px", padding: "12px", display: "flex", flexDirection: "column", gap: "24px" }}>
          {steps.map((step, index) => (
            <div key={index} className="flex items-start" style={{ gap: "8px" }}>
              <span
                className="flex-shrink-0 bg-gray-900 text-white text-sm flex items-center justify-center"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, width: "24px", height: "24px", borderRadius: "100%" }}
              >
                {index + 1}
              </span>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  color: "#18181B",
                  paddingTop: "3px",
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
            fontWeight: 600,
            fontSize: "14px",
            backgroundColor: "rgba(24, 24, 27, 1)",
            color: "white",
            borderRadius: "50px",
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          I've activated it <ArrowRight className="inline h-4 w-4 ml-1" />
        </Button>
        <Button
          onClick={() => window.open("mailto:hello@factpress.ai", "_blank")}
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "14px",
            backgroundColor: "transparent",
            color: "rgba(24, 24, 27, 1)",
            border: "2px solid rgba(24, 24, 27, 1)",
            borderRadius: "50px",
            padding: "8px 16px",
            cursor: "pointer",
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
            fontWeight: 500,
            fontSize: "24px",
            color: "rgba(24, 24, 27, 1)",
            lineHeight: 1.2,
          }}
        >
          Connect to FactPress
        </h1>
        <p
          className="mt-4"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "13px",
            color: "rgba(24, 24, 27, 0.6)",
          }}
        >
          Last step, let's link your account.
        </p>

        <div style={{ marginTop: "36px", marginBottom: "36px", padding: "12px", display: "flex", flexDirection: "column", gap: "24px" }}>
          {steps.map((step, index) => (
            <div key={index} className="flex items-start" style={{ gap: "8px" }}>
              <span
                className="flex-shrink-0 bg-gray-900 text-white text-sm flex items-center justify-center"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, width: "24px", height: "24px", borderRadius: "100%" }}
              >
                {index + 1}
              </span>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  color: "#18181B",
                  paddingTop: "3px",
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
            fontWeight: 600,
            fontSize: "14px",
            backgroundColor: "rgba(24, 24, 27, 1)",
            color: "white",
            borderRadius: "50px",
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          I'm connected <ArrowRight className="inline h-4 w-4 ml-1" />
        </Button>
        <Button
          onClick={() => window.open("mailto:hello@factpress.ai", "_blank")}
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "14px",
            backgroundColor: "transparent",
            color: "rgba(24, 24, 27, 1)",
            border: "2px solid rgba(24, 24, 27, 1)",
            borderRadius: "50px",
            padding: "8px 16px",
            cursor: "pointer",
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
            fontWeight: 500,
            fontSize: "24px",
            color: "rgba(24, 24, 27, 1)",
            lineHeight: 1.2,
          }}
        >
          You're all set!
        </h1>
        <p
          className="mt-4"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "13px",
            color: "rgba(24, 24, 27, 0.6)",
          }}
        >
          FactPress is ready. Head to Posts and you'll find the fact-checker in the right sidebar of the editor.
        </p>
      </div>

      <div className="mt-8 flex gap-3">
        <Button
          onClick={handleGoToPosts}
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "14px",
            backgroundColor: "rgba(24, 24, 27, 1)",
            color: "white",
            borderRadius: "50px",
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          Go to Posts <ArrowRight className="inline h-4 w-4 ml-1" />
        </Button>
        <Button
          onClick={() => window.open("mailto:hello@factpress.ai", "_blank")}
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "14px",
            backgroundColor: "transparent",
            color: "rgba(24, 24, 27, 1)",
            border: "2px solid rgba(24, 24, 27, 1)",
            borderRadius: "50px",
            padding: "8px 16px",
            cursor: "pointer",
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
          className="w-full flex"
          style={{
            maxWidth: "700px",
            backgroundColor: "#F7F7F7",
            padding: "24px",
            gap: "32px",
          }}
        >
          {/* Left side - Content */}
          <div className="flex-1 flex flex-col">
            {/* Step indicator */}
            <div style={{ marginBottom: "12px" }}>
              <span
                className="inline-flex items-center"
                style={{
                  background: "linear-gradient(138.21deg, #B2DCF4 44.48%, #DCF0FB 69.07%, #DBEEFC 100.98%)",
                  padding: "6px 12px",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "12px",
                }}
              >
                <span style={{ color: "#18181B" }}>Step {step}</span>
                <span style={{ color: "rgba(24, 24, 27, 0.5)", marginLeft: "4px" }}>of 4</span>
              </span>
            </div>

            {/* Step content */}
            {step === 1 && <Step1Download onNext={nextStep} />}
            {step === 2 && <Step2Install onNext={nextStep} />}
            {step === 3 && <Step3Connect onNext={nextStep} />}
            {step === 4 && <Step4Complete />}
          </div>

          {/* Right side - Image */}
          <div className="flex-1">
            <img
              src={stepImages[step - 1]}
              alt={`Step ${step} illustration`}
              className="w-full h-full object-cover"
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
