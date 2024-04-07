import { useState } from "react";
import "./App.css";
import BarcodeScanZX from "./components/BarcodeScanZX";

function App() {
	const [scanData, setScanData] = useState<string | null>(null);

	function handleBarcode(data: string) {
		console.log("Received barcode data from scanner:", data);
		// Do something with the barcode data here
		setScanData(data);
	}
	return (
		<>
			<h3>Barcode Scanner</h3>
			<h4>Scan Data: {scanData}</h4>
			<BarcodeScanZX onDecode={handleBarcode} />
		</>
	);
}

export default App;
