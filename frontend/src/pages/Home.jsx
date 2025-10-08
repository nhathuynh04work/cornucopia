import { useState } from "react";
import { api } from "../apis/axios.js";
import { useAuth } from "../contexts/AuthContext.jsx";
import { Upload } from "lucide-react";
import axios from "axios";

function Home() {
	const [file, setFile] = useState(null);
	const [imageUrl, setImageUrl] = useState(null);
	const { user } = useAuth();

	const handleFileChange = (e) => setFile(e.target.files[0]);
	const handleUpload = async () => {
		if (!file) return;

		// Step 1: request presigned URL
		const { data } = await api.post("/upload/presign", {
			fileName: file.name,
			fileType: file.type,
		});

		const { uploadUrl, fileUrl } = data;

		// Step 2: upload file to S3
		await axios.put(uploadUrl, file, {
			headers: { "Content-Type": file.type },
		});

		// Step 3: tell backend to save metadata
		const saveRes = await api.post("/upload/confirm", {
			userId: user.id,
			fileUrl,
			fileType: file.type,
		});

		// Optional: Get fetch URL
		const res = await api.get(
			`/upload/fetch-url?key=${saveRes.data.s3Key}`
		);
		setImageUrl(res.data.url);
	};

	return (
		<div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
			<div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
				<h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
					Upload a File
				</h1>

				<div className="flex flex-col items-center gap-4">
					{/* File input */}
					<label className="w-full cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition">
						<input
							type="file"
							onChange={handleFileChange}
							className="hidden"
						/>
						<Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
						<span className="text-sm text-gray-600">
							{file ? file.name : "Click to choose a file"}
						</span>
					</label>

					{/* Upload button */}
					<button
						onClick={handleUpload}
						disabled={!file}
						className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed">
						Upload
					</button>
				</div>

				<div>
					<p>Image</p>
					{imageUrl && <img src={imageUrl} alt="" />}
				</div>
			</div>
		</div>
	);
}

export default Home;
