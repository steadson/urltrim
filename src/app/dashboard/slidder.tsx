import { useEffect } from "react";

export default function SlidePanel({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  useEffect(
    () => {
      if (isOpen) {
        document.body.style.overflow = "hidden"; // Prevent scrolling when panel is open
      } else {
        document.body.style.overflow = "auto";
      }
    },
    [isOpen]
  );

  return (
    <div
      className={`fixed inset-0 z-50 transition-transform duration-300 ease-in-out ${isOpen
        ? "translate-x-0"
        : "translate-x-full"}`}
    >
      <div
        className="absolute inset-0 bg-opacity-50"
        onClick={onClose}
      />
      <div className="absolute right-0 h-full w-full md:w-1/2 bg-white shadow-lg p-4">
        <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
          ✕ Close
        </button>
        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>
  );
}
