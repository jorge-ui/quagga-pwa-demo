import React, { useState, useEffect, useRef } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Quagga from "quagga"; // Assuming you've installed quaggaJS

interface BarcodeScannerProps {
  // You might add props for customization here if needed
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = () => {
  const [barcodeData, setBarcodeData] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const accessCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }, // Rear-facing camera
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", "true"); // For iOS support
          videoRef.current.play();

          scanBarcode();
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
      }
    };

    const scanBarcode = () => {
      Quagga.init(
        {
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: videoRef.current, // Pass the video element as the target for the live stream
          },
          decoder: {
            readers: ["code_128_reader"], // This is an example, you should adjust according to your barcode type
          },
        },
        function (err) {
          if (err) {
            console.error("Initialization error: ", err);
            return;
          }
          Quagga.start();
        }
      );

      Quagga.onDetected(function (data) {
        setBarcodeData(data.codeResult.code);
      });
    };

    accessCamera();
  }, []);

  return (
    <div>
      <video ref={videoRef} style={{ display: "none" }}></video>
      {barcodeData && <p>Scanned Data: {barcodeData}</p>}
    </div>
  );
};

export default BarcodeScanner;
