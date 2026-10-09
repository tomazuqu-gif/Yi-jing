import { useEffect, useState } from "react";
import { Download, Share2, X } from "lucide-react";

declare global {
  interface Window {
    __installPrompt?: unknown;
  }
}

interface Props {
  darkMode: boolean;
}

function AndroidInstructions({ darkMode, onClose }: Props & { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-sm rounded-t-2xl p-6 pb-10 shadow-2xl ${
          darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-base">Install Yijing Awareness</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200/20">
            <X className="w-4 h-4" />
          </button>
        </div>
        <ol className="space-y-4 text-sm">
          <li className="flex items-start gap-3">
            <span
              className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                darkMode ? "bg-gray-600" : "bg-gray-100"
              }`}
            >
              1
            </span>
            <span>
              Open the <strong>browser menu</strong> (three dots) at the top of
              your browser.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span
              className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                darkMode ? "bg-gray-600" : "bg-gray-100"
              }`}
            >
              2
            </span>
            <span>
              Tap <strong>"Add to Home screen"</strong> or{" "}
              <strong>"Install app"</strong>.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span
              className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                darkMode ? "bg-gray-600" : "bg-gray-100"
              }`}
            >
              3
            </span>
            <span>
              Confirm by tapping <strong>"Add"</strong> or{" "}
              <strong>"Install"</strong>.
            </span>
          </li>
        </ol>
      </div>
    </div>
  );
}

function IosInstructions({ darkMode, onClose }: Props & { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-sm rounded-t-2xl p-6 pb-10 shadow-2xl ${
          darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-base">Install Yijing Awareness</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200/20">
            <X className="w-4 h-4" />
          </button>
        </div>
        <ol className="space-y-4 text-sm">
          <li className="flex items-start gap-3">
            <span
              className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                darkMode ? "bg-gray-600" : "bg-gray-100"
              }`}
            >
              1
            </span>
            <span>
              Tap the <strong>Share</strong> button{" "}
              <Share2 className="inline w-4 h-4 mb-0.5" /> at the bottom of your
              Safari browser.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span
              className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                darkMode ? "bg-gray-600" : "bg-gray-100"
              }`}
            >
              2
            </span>
            <span>
              Scroll down and tap <strong>"Add to Home Screen"</strong>.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span
              className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                darkMode ? "bg-gray-600" : "bg-gray-100"
              }`}
            >
              3
            </span>
            <span>
              Tap <strong>"Add"</strong> in the top right corner to install.
            </span>
          </li>
        </ol>
      </div>
    </div>
  );
}

export default function InstallButton({ darkMode }: Props) {
  const [installPrompt, setInstallPrompt] = useState<unknown>(null);
  const [installed, setInstalled] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | null>(null);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
      return;
    }
    if (window.__installPrompt) setInstallPrompt(window.__installPrompt);
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      window.__installPrompt = e;
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", () => {
      setInstalled(true);
      window.__installPrompt = null;
    });
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isAndroid = /android/i.test(navigator.userAgent);

  const handleClick = async () => {
    if (installPrompt) {
      const evt = installPrompt as Event & {
        prompt: () => Promise<void>;
        userChoice: Promise<{ outcome: string }>;
      };
      evt.prompt();
      const { outcome } = await evt.userChoice;
      if (outcome === "accepted") setInstalled(true);
      setInstallPrompt(null);
    } else {
      setPlatform(isIos ? "ios" : "android");
    }
  };

  if (installed) return null;

  return (
    <>
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 text-xs px-4 py-1.5 rounded-full font-medium transition-all bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg ${
          darkMode ? "" : "from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        }`}
      >
        <Download className="w-4 h-4" />
        Install App
      </button>
      {platform === "ios" && (
        <IosInstructions darkMode={darkMode} onClose={() => setPlatform(null)} />
      )}
      {platform === "android" && (
        <AndroidInstructions darkMode={darkMode} onClose={() => setPlatform(null)} />
      )}
    </>
  );
}
