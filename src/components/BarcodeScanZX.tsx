import React, { useState, useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

interface BarcodeScannerProps {
	onDecode: (result: string) => void;
}

const BarcodeScanZX: React.FC<BarcodeScannerProps> = ({ onDecode }) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [scanning, setScanning] = useState(true);

	const codeReader = useRef(new BrowserMultiFormatReader());
	const stream = useRef<MediaStream | null>(null);

	const stopScanning = () => {
		codeReader.current.reset();
		if (stream.current) {
			stream.current.getTracks().forEach((track) => track.stop());
		}
		setScanning(false);
	};

	useEffect(() => {
		const accessCamera = async () => {
			try {
				stream.current = await navigator.mediaDevices.getUserMedia({
					video: { facingMode: "environment" },
				});

				if (videoRef.current) {
					videoRef.current.srcObject = stream.current;
					videoRef.current.setAttribute("playsinline", "true");
					videoRef.current.setAttribute("autoplay", "true");
					videoRef.current.onplay = () => {
						console.log("Video is playing");
						startScanning();
					};
				}
			} catch (err) {
				console.error("Error accessing camera: ", err);
			}
		};

		const startScanning = () => {
			codeReader.current
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

		return () => {};
	}, []);

	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			<video ref={videoRef} style={{ width: "320px", height: "240px" }} />
			<button onClick={stopScanning}>Turn Off Camera</button>
		</div>
	);
};

export default BarcodeScanZX;
