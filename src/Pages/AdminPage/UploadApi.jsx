import React, { useState } from "react";
import useAxiosPrivate from "../../Hooks/useAxiosPrivate";

const UploadApi = () => {
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const axiosPrivate = useAxiosPrivate();


  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFileName(selectedFile.name);
      setFile(selectedFile);
      setUploadStatus(""); // Clear previous status
    } else {
      setFileName("");
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await axiosPrivate.post("/create-apis", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.status === 200) {
        setUploadStatus("✅ File uploaded successfully!");
      } else {
        setUploadStatus(`❌ Upload failed: ${response.statusText}`);
      }
    } catch (error) {
      setUploadStatus(`❌ Error: ${error.response?.data?.message || error.message}`);
    }
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
      {/* Modal */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload API File</h2>

        {/* File Upload Input */}
        <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center">
          <input
            type="file"
            accept=".xlsx, .xls"
            className="hidden"
            id="fileUpload"
            onChange={handleFileChange}
          />
          <label
            htmlFor="fileUpload"
            className="cursor-pointer block text-blue-600 font-semibold hover:underline"
          >
            Click to upload an Excel file
          </label>
          <p className="text-sm text-gray-500 mt-2">Only .xlsx and .xls files are allowed.</p>

          {/* Show uploaded file name */}
          {fileName && (
            <p className="mt-3 text-gray-700 font-medium">{fileName}</p>
          )}
        </div>

        {/* Upload Status */}
        {uploadStatus && (
          <p className={`mt-3 font-medium ${uploadStatus.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
            {uploadStatus}
          </p>
        )}

        {/* Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className={`px-4 py-2 rounded-lg transition ${
              fileName
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!fileName}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadApi;
