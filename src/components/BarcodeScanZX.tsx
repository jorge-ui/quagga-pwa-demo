import { BrowserMultiFormatReader } from "@zxing/library";
import React, { useEffect, useRef } from "react";

interface BarcodeScannerProps {
	onDecode: (result: string) => void;
}

const BarcodeScanZX: React.FC<BarcodeScannerProps> = ({ onDecode }) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const codeReader = useRef(new BrowserMultiFormatReader());
	const stream = useRef<MediaStream | null>(null);

	// Function to stop the ongoing scan
	const stopScanning = () => {
		codeReader.current.reset();
		if (stream.current) {
			stream.current.getTracks().forEach((track) => track.stop()); // Stop all video tracks
		}
	};

	useEffect(() => {
		// Function to request camera access and initiate scanning
		const accessCamera = async () => {
			try {
				const mediaStream = await navigator.mediaDevices.getUserMedia({
					video: { facingMode: "environment" },
				});

				stream.current = mediaStream;

				if (videoRef.current) {
					videoRef.current.srcObject = mediaStream;
					videoRef.current.setAttribute("playsinline", "true");
					videoRef.current.setAttribute("autoplay", "true");

					// Initiate scanning when video starts playing
					videoRef.current.onplay = () => {
						startScanning();
					};
				}
			} catch (err) {
				console.error("Error accessing camera: ", err);
				// Handle the error gracefully, maybe display an error message to the user
			}
		};

		// Function to start decoding from the video feed
		const startScanning = () => {
			codeReader.current
				.decodeFromVideoElement(videoRef.current!)
				.then((result) => {
					// send results from the scan to the parent component (onDecode function)
					onDecode(result.getText());
				})
				.catch((err) => {
					console.error("Decoding error:", err);
					// Handle decoding errors (e.g., display message to retry)
				});
		};

		accessCamera(); // Start the process

		// Cleanup on unmount (stop any ongoing scan and release camera resources)
		return () => {
			stopScanning();
		};
	}, []);

	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			<video ref={videoRef} style={{ width: "320px", height: "240px" }} />
			<button onClick={stopScanning}>Stop Scan</button>
		</div>
	);
};

export default BarcodeScanZX;
