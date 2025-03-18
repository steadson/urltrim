 export  const handleCopy = async (shortenedUrl) => {
    if (!shortenedUrl) return;

    try {
      // Try the Clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shortenedUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } else {
        // Fallback for mobile browsers that don't support Clipboard API
        const textArea = document.createElement("textarea");
        textArea.value = shortenedUrl;
        textArea.style.position = "fixed"; // Make it invisible
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (successful) {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        } else {
          throw new Error("Copy failed");
        }
      }
    } catch (err) {
      console.error("Copy failed:", err);
      // Inform user that copy failed
      setError("Copy failed. Please select and copy the URL manually.");
    }
  };

  export const handleShare = async (shortenedUrl) => {
    if (!shortenedUrl) return;

    // Check if Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Shortened URL",
          text: "Check out this shortened URL!",
          url: shortenedUrl
        });
        // Optionally show success message
        // setShareSuccess(true);
        // setTimeout(() => setShareSuccess(false), 2000);
      } catch (error) {
        console.error("Error sharing:", error);
        // Only show error if it's not an AbortError (user canceled)
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setError("Couldn't share the URL. Please try copying it instead.");
        }
      }
    } else {
      // Fallback for devices/browsers that don't support Web Share API
      // You could either show an error message or automatically fall back to copy
      handleCopy();
      setError(
        "Direct sharing not supported on this device. URL copied to clipboard instead."
      );
    }
  };

  // QR Code Modal component
 export const QrCodeModal = (showQrCode) => {
    if (!showQrCode) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">QR Code for your URL</h3>
            <button
              onClick={() => setShowQrCode(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="flex justify-center mb-4 qr-code-container">
            <QRCodeSVG
              value={shortenedUrl || ""}
              size={250}
              level={"H"}
              includeMargin={true}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <button
              onClick={() => handleQrCodeClick("svg")}
              className={`p-2 rounded ${qrCodeSize === "svg"
                ? "bg-green-600 text-white"
                : "bg-gray-200"}`}
            >
              SVG
            </button>
            <button
              onClick={() => handleQrCodeClick("png")}
              className={`p-2 rounded ${qrCodeSize === "png"
                ? "bg-green-600 text-white"
                : "bg-gray-200"}`}
            >
              PNG
            </button>
            <button
              onClick={() => handleQrCodeClick("png1200")}
              className={`p-2 rounded ${qrCodeSize === "png1200"
                ? "bg-green-600 text-white"
                : "bg-gray-200"}`}
            >
              PNG 1200
            </button>
          </div>

          <div className="flex justify-between">
            <button
              onClick={downloadQrCode}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Download
            </button>
            <button
              onClick={() => setShowQrCode(false)}
              className="bg-gray-300 py-2 px-4 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };