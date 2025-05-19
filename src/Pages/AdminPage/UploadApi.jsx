// import React, { useState } from "react";
// import useAxiosPrivate from "../../Hooks/useAxiosPrivate";

// const UploadApi = () => {
//   const [fileName, setFileName] = useState("");
//   const [file, setFile] = useState(null);
//   const [uploadStatus, setUploadStatus] = useState("");
//   const axiosPrivate = useAxiosPrivate();


//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0];
//     if (selectedFile) {
//       setFileName(selectedFile.name);
//       setFile(selectedFile);
//       setUploadStatus(""); // Clear previous status
//     } else {
//       setFileName("");
//       setFile(null);
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       // const response = await axiosPrivate.post("http://127.0.0.1:5000/api/create-apis", formData, {
//       const response = await axiosPrivate.post("/create-apis", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       if (response.status === 200) {
//         setUploadStatus("✅ File uploaded successfully!");
//       } else {
//         setUploadStatus(`❌ Upload failed: ${response.statusText}`);
//       }
//     } catch (error) {
//       setUploadStatus(`❌ Error: ${error.response?.data?.message || error.message}`);
//     }
//   };


//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
//       {/* Modal */}
//       <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload API File</h2>

//         {/* File Upload Input */}
//         <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center">
//           <input
//             type="file"
//             accept=".xlsx, .xls"
//             className="hidden"
//             id="fileUpload"
//             onChange={handleFileChange}
//           />
//           <label
//             htmlFor="fileUpload"
//             className="cursor-pointer block text-blue-600 font-semibold hover:underline"
//           >
//             Click to upload an Excel file
//           </label>
//           <p className="text-sm text-gray-500 mt-2">Only .xlsx and .xls files are allowed.</p>

//           {/* Show uploaded file name */}
//           {fileName && (
//             <p className="mt-3 text-gray-700 font-medium">{fileName}</p>
//           )}
//         </div>

//         {/* Upload Status */}
//         {uploadStatus && (
//           <p className={`mt-3 font-medium ${uploadStatus.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
//             {uploadStatus}
//           </p>
//         )}

//         {/* Buttons */}
//         <div className="mt-6 flex justify-between">
//           <button
//             onClick={() => window.history.back()}
//             className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleUpload}
//             className={`px-4 py-2 rounded-lg transition ${
//               fileName
//                 ? "bg-blue-600 text-white hover:bg-blue-700"
//                 : "bg-gray-300 text-gray-500 cursor-not-allowed"
//             }`}
//             disabled={!fileName}
//           >
//             Upload
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UploadApi;


// import React, { useState } from "react";
// import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
// import {
//   Modal,
//   Box,
//   Typography,
//   Button,
//   CircularProgress
// } from "@mui/material";

// const UploadApi = () => {
//   const [fileName, setFileName] = useState("");
//   const [file, setFile] = useState(null);
//   const [uploadStatus, setUploadStatus] = useState("");
//   const [open, setOpen] = useState(true); // Modal open state
//   const [isUploading, setIsUploading] = useState(false);
//   const axiosPrivate = useAxiosPrivate();

//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0];
//     if (selectedFile) {
//       setFileName(selectedFile.name);
//       setFile(selectedFile);
//       setUploadStatus(""); // Clear previous status
//     } else {
//       setFileName("");
//       setFile(null);
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) return;

//     setIsUploading(true);
//     setUploadStatus("");

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await axiosPrivate.post("/create-apis", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       if (response.status === 200) {
//         setUploadStatus("✅ File uploaded successfully!");
//       } else {
//         setUploadStatus(`❌ Upload failed: ${response.statusText}`);
//       }
//     } catch (error) {
//       setUploadStatus(`❌ Error: ${error.response?.data?.message || error.message}`);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleClose = () => {
//     setOpen(false);
//     // Optionally navigate back or handle close differently
//     window.history.back();
//   };

//   return (
//     <Modal open={open} onClose={handleClose}>
//       <Box sx={{
//         position: 'absolute',
//         top: '50%',
//         left: '50%',
//         transform: 'translate(-50%, -50%)',
//         width: 400,
//         bgcolor: 'background.paper',
//         boxShadow: 24,
//         p: 4,
//         borderRadius: 2,
//         outline: 'none'
//       }}>
//         <Typography variant="h6" sx={{ mb: 3 }}>Upload API File</Typography>

//         {/* File Upload Area */}
//         <Box 
//           sx={{
//             border: '2px dashed #90caf9',
//             p: 4,
//             textAlign: 'center',
//             backgroundColor: '#e3f2fd',
//             cursor: 'pointer',
//             borderRadius: 1,
//             mb: 2
//           }}
//           onClick={() => document.getElementById('fileUpload').click()}
//         >
//           <input
//             type="file"
//             accept=".xlsx, .xls"
//             className="hidden"
//             id="fileUpload"
//             onChange={handleFileChange}
//           />
//           <Typography variant="body1" sx={{ color: '#1976d2' }}>
//             Click to upload an Excel file
//           </Typography>
//           <Typography variant="caption" sx={{ color: '#757575', display: 'block', mt: 1 }}>
//             Only .xlsx and .xls files are allowed
//           </Typography>
//         </Box>

//         {/* Selected file name */}
//         {fileName && (
//           <Typography variant="body2" sx={{ 
//             mt: 1,
//             p: 1,
//             backgroundColor: '#f5f5f5',
//             borderRadius: 1,
//             textAlign: 'center'
//           }}>
//             {fileName}
//           </Typography>
//         )}

//         {/* Upload Status */}
//         {uploadStatus && (
//           <Typography 
//             variant="body2" 
//             sx={{ 
//               mt: 2,
//               fontWeight: 'medium',
//               color: uploadStatus.startsWith("✅") ? 'success.main' : 'error.main',
//               textAlign: 'center'
//             }}
//           >
//             {uploadStatus}
//           </Typography>
//         )}

//         {/* Buttons */}
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
//           <Button
//             variant="outlined"
//             onClick={handleClose}
//             sx={{ mr: 1 }}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             onClick={handleUpload}
//             disabled={!fileName || isUploading}
//             sx={{ ml: 1 }}
//           >
//             {isUploading ? (
//               <>
//                 <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
//                 Uploading...
//               </>
//             ) : 'Upload'}
//           </Button>
//         </Box>
//       </Box>
//     </Modal>
//   );
// };

// export default UploadApi;



import React, { useState } from "react";
import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
import {
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse
} from "@mui/material";
import { Check, Close, Info } from "@mui/icons-material";
import Loader from '../../Assets/loader2.gif';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


const UploadApi = () => {
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [open, setOpen] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.name.match(/\.(xlsx|xls)$/i)) {
        setFileName(selectedFile.name);
        setFile(selectedFile);
        setUploadStatus("");
        setResults([]);
      } else {
        setUploadStatus("❌ Only Excel files (.xlsx, .xls) are allowed");
      }
    } else {
      setFileName("");
      setFile(null);
    }
  };

  // const handleUpload = async () => {
  //   if (!file) return;

  //   setIsUploading(true);
  //   setUploadStatus("");
  //   setResults([]);

  //   const formData = new FormData();
  //   formData.append("file", file);

  //   try {
  //     const response = await axiosPrivate.post("http://localhost:5000/bulk-create-apis", formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     if (response.data?.results) {
  //       setResults(response.data.results);
  //       const successCount = response.data.results.filter(r => r.status === "success").length;
  //       const errorCount = response.data.results.filter(r => r.status === "failed").length;

  //       setUploadStatus(
  //         `✅ ${successCount} APIs created successfully${errorCount > 0 ? `, ❌ ${errorCount} failed` : ''}`
  //       );
  //     } else {
  //       setUploadStatus("❌ Unexpected response format from server");
  //     }
  //   } catch (error) {
  //     setUploadStatus(
  //       `❌ Error: ${error.response?.data?.error || error.message}`
  //     );
  //   } finally {
  //     setIsUploading(false);
  //   }
  // };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadStatus("");
    setResults([]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axiosPrivate.post(
        "http://127.0.0.1:8000/upload_excel/",
        // "/upload_excel/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.results) {
        setResults(response.data.results);
        const successCount = response.data.results.filter(r =>
          r.status === "success").length;
        const errorCount = response.data.results.filter(r =>
          r.status === "failed").length;

        setUploadStatus(
          `✅ ${successCount} APIs processed successfully` +
          (errorCount > 0 ? `, ❌ ${errorCount} failed` : '')
        );
      }
    } catch (error) {
      console.log("Full error:", error); // Check console for details

      // Improved error handling
      let errorMessage = "Upload failed";
      if (error.response) {
        // Server responded with error status (4xx, 5xx)
        errorMessage = error.response.data?.error ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "No response from server (CORS or network issue)";
      } else {
        // Other errors
        errorMessage = error.message;
      }

      setUploadStatus(`❌ ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    window.history.back();
    window.location.reload();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        maxHeight: '80vh',
        overflow: 'auto',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        outline: 'none'
      }}>
        <Typography variant="h6" sx={{ mb: 3 }}>Upload API File</Typography>

        {/* File Upload Area */}
        <Box
          sx={{
            border: '2px dashed #90caf9',
            p: 4,
            textAlign: 'center',
            backgroundColor: '#e3f2fd',
            cursor: 'pointer',
            borderRadius: 1,
            mb: 2
          }}
          onClick={() => document.getElementById('fileUpload').click()}
        >
          <input
            type="file"
            accept=".xlsx, .xls"
            className="hidden"
            id="fileUpload"
            onChange={handleFileChange}
          />
          <Typography variant="body1" sx={{ color: '#1976d2' }}>
            Click to upload an Excel file
          </Typography>
          <Typography variant="caption" sx={{ color: '#757575', display: 'block', mt: 1 }}>
            Only .xlsx and .xls files are allowed
          </Typography>
        </Box>

        {/* Selected file name */}
        {fileName && (
          <Typography variant="body2" sx={{
            mt: 1,
            p: 1,
            backgroundColor: '#f5f5f5',
            borderRadius: 1,
            textAlign: 'center'
          }}>
            {fileName}
          </Typography>
        )}

        {/* Upload Status */}
        {uploadStatus && (
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              fontWeight: 'medium',
              color: uploadStatus.includes("✅") ? 'success.main' : 'error.main',
              textAlign: 'center'
            }}
          >
            {uploadStatus}
          </Typography>
        )}

        {/* Results Details */}
        {results.length > 0 && (
          <>
            <Button
              size="small"
              onClick={() => setShowDetails(!showDetails)}
              sx={{ mt: 2 }}
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
            <Collapse in={showDetails}>
              <List dense sx={{ mt: 1, maxHeight: 200, overflow: 'auto' }}>
                {results.map((result, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {result.status === "success" ? (
                        <Check color="success" />
                      ) : (
                        <Close color="error" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={result.api_name}
                      secondary={result.error || `API ID: ${result.api_id}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </>
        )}

        {/* Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!fileName || isUploading}
            sx={{ ml: 1 }}
          >
            {isUploading ? (
              <>
                <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                Uploading...
              </>
            ) : 'Upload'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UploadApi;