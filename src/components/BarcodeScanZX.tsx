import React, { useState, useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

interface BarcodeScannerProps {
	onDecode: (result: string) => void;
}

const BarcodeScanZX: React.FC<BarcodeScannerProps> = ({ onDecode }) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [scanning, setScanning] = useState(false);

	useEffect(() => {
		const codeReader = new BrowserMultiFormatReader();

		const accessCamera = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: { facingMode: "environment" },
				});

				if (videoRef.current) {
					videoRef.current.srcObject = stream;
					videoRef.current.setAttribute("playsinline", "true");
					videoRef.current.play();

					startScanning();
				}
			} catch (err) {
				console.error("Error accessing camera: ", err);
			}
		};

		const startScanning = () => {
			codeReader
				.decodeFromVideoElement(videoRef.current!)
				.then((result) => {
					onDecode(result.getText());
					setScanning(false); // You might want to stop here or continue scanning
				})
				.catch((err) => {
					console.error("Decoding error:", err);
				});
		};

		accessCamera();

		return () => {
			// Cleanup on unmount (stop any ongoing scan)
			codeReader.reset();
		};
	}, []);

	return (
		<div>
			<video ref={videoRef} style={{ width: "320px", height: "240px" }} />
		</div>
	);
};

export default BarcodeScanZX;
