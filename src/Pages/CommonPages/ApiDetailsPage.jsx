//accordion view

// import React, { useContext, useEffect, useState } from 'react';
// import {
//     Typography, Box, Chip, Paper, Divider,
//     Accordion, AccordionSummary, AccordionDetails,
//     Button, Modal,
//     TextField,
//     IconButton
// } from '@mui/material';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useQuery } from 'react-query';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { useDropzone } from 'react-dropzone';
// import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
// import { Info, Security, Storage, Settings, CloudUpload } from '@mui/icons-material';
// import CircularProgress from '@mui/material/CircularProgress';
// import Snackbar from '@mui/material/Snackbar';
// import Alert from '@mui/material/Alert';
// import ApiView from './ApiView';
// import { ApiEndpointContext } from '../../Context/ApiEndpointContext';
// import { AuthContext } from '../../Context/AuthContext';
// import EditIcon from "@mui/icons-material/Edit";

// const ApiDetailsPage = () => {
//     const { user } = useContext(AuthContext);
//     const isAdmin = user?.roles?.includes("admin");
//     const axiosPrivate = useAxiosPrivate();
//     const navigate = useNavigate();
//     const [open, setOpen] = useState(false);
//     const [uploadedImage, setUploadedImage] = useState(null);
//     const [openSnackbar, setOpenSnackbar] = useState(false);
//     const { apiId } = useParams();
//     const { endpoint } = useContext(ApiEndpointContext);
//     const [editingDescription, setEditingDescription] = useState(false);
//     const [editedDescription, setEditedDescription] = useState('');
//     const { activeTab, setActiveTab } = useContext(ApiEndpointContext);
//     const [expanded, setExpanded] = useState('');
//     const operationsAccordionRef = React.useRef(null);
//     const { loginTime } = useContext(AuthContext);

//     useEffect(() => {
//         window.scrollTo(0, 0);
//     }, [activeTab]);

//     useEffect(() => {
//         if (apiId && endpoint && operationsAccordionRef.current) {
//             setTimeout(() => {
//                 operationsAccordionRef.current?.scrollIntoView({
//                     behavior: 'smooth',
//                     block: 'center'
//                 });
//                 setExpanded('operations');
//             }, 100);
//         }
//     }, [apiId, endpoint]);

//     useEffect(() => {
//         if (activeTab === 'operations') {
//             setExpanded('operations');
//         }
//     }, [activeTab]);

//     const handleAccordionChange = (panel) => (event, isExpanded) => {
//         setExpanded(isExpanded ? panel : false);
//     };

//     const handleSnackbarClose = (event, reason) => {
//         if (reason === 'clickaway') {
//             return;
//         }
//         setOpenSnackbar(false);
//     };

//     const handleUpload = () => {
//         setOpenSnackbar(true);
//         handleClose();
//     };

//     const handleOpen = () => setOpen(true);
//     const handleClose = () => setOpen(false);

//     const onDrop = (acceptedFiles) => {
//         const file = acceptedFiles[0];
//         const reader = new FileReader();
//         reader.onload = (event) => {
//             setUploadedImage(event.target.result);
//         };
//         reader.readAsDataURL(file);
//     };

//     const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

//     const { data: apiDetails, isLoading, error } = useQuery(['apiDetails', apiId], async () => {
//         const response = await axiosPrivate.get(`http://localhost:8081/api/getapi/${apiId}`);
//         // const response = await axiosPrivate.get(`/getapi/${apiId}`);
//         return response.data;
//     });

//     if (isLoading) return (
//         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//             <CircularProgress />
//         </Box>
//     );
//     if (error) return <div>Error fetching API details: {error.message}</div>;

//     const getBearerToken = async () => {
//         try {
//             const response = await axiosPrivate.get(
//                 "http://localhost:8083/token",
//                 // "/token",
//                 null,
//                 {
//                     headers: {
//                         "Content-Type": "application/x-www-form-urlencoded",
//                     },
//                 }
//             );
//             console.log("Generated Bearer Token:", response.data.access_token);
//             return response.data.access_token;
//         } catch (error) {
//             console.error("Error fetching Bearer token:", error.response?.data || error.message);
//             throw new Error("Failed to obtain Bearer token");
//         }
//     };

//     const handleUpdateDescription = async () => {
//         if (!apiId) {
//             console.error("API ID is not available.");
//             alert("API ID is missing. Unable to update.");
//             return;
//         }

//         try {
//             const token = await getBearerToken();

//             const name = apiDetails?.name || "Default API Name";
//             const version = apiDetails?.version || "1.0.0";
//             const context = apiDetails?.context || "/default-context";
//             const provider = apiDetails?.provider || "default-provider";
//             const lifeCycleStatus = apiDetails?.lifeCycleStatus || "PUBLISHED";
//             const description = editedDescription || apiDetails?.description || "No description available";

//             const operations = apiDetails?.operations || [];

//             if (operations.length === 0) {
//                 console.error("No valid operations found for the API.");
//                 alert("API must have at least one resource (path and method) defined.");
//                 return;
//             }

//             const updatedData = {
//                 name,
//                 description,
//                 context,
//                 version,
//                 provider,
//                 lifeCycleStatus,
//                 operations,
//             };

//             console.log("Updated Data Payload:", updatedData);

//             const response = await axiosPrivate.put(
//                 `http://localhost:8085/api/${apiId}`,
//                 // `/${apiId}`,
//                 updatedData,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         "Content-Type": "application/json",
//                     },
//                 }
//             );

//             console.log("API Updated Successfully:", response.data);
//             alert("API details updated successfully!");
//             setEditingDescription(false);

//         } catch (error) {
//             console.error("Error updating API:", error.response?.data || error.message);
//             alert("Error updating API details");
//         }
//     };

//     const handleTargetClick = (path, apiId) => {
//         const pathPrefix = window.location.pathname.startsWith("/admin") ? "admin" : "user";
//         if (path && apiId) {
//             navigate(`/${pathPrefix}/apiview?endpoint=${encodeURIComponent(path)}&apiId=${encodeURIComponent(apiId)}`);
//         }
//     };

//     return (
//         <Box
//             sx={{
//                 padding: 4,
//                 backgroundColor: '#f5f7fa',
//                 minHeight: '100vh',
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 flexDirection: 'column',
//                 gap: 3
//             }}
//         >
//             <Box
//                 sx={{
//                     width: '100%',
//                     maxWidth: 1200,
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     gap: 2
//                 }}
//             >

//                 <Paper
//                     elevation={3}
//                     sx={{
//                         flex: 1,
//                         borderRadius: 3,
//                         backgroundColor: '#ffffff',
//                         boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//                     }}
//                 >
//                     {/* <Accordion defaultExpanded expanded={true}>
//                         <AccordionSummary
//                             expandIcon={<ExpandMoreIcon />}
//                             // sx={{
//                             //     backgroundColor: '#ffecb3',
//                             //     minHeight: '48px !important',
//                             //     '& .MuiAccordionSummary-content': {
//                             //         margin: '8px 0'
//                             //     }
//                             // }}
//                             sx={{
//                                 backgroundColor: '#ffecb3',
//                                 minHeight: '48px !important',
//                                 '& .MuiAccordionSummary-content': {
//                                     margin: '8px 0'
//                                 },
//                                 '& .MuiAccordionSummary-expandIconWrapper': {
//                                     display: 'none' 
//                                 },
//                                 cursor: 'default !important', 
//                                 '&:hover': {
//                                     backgroundColor: '#ffecb3' 
//                                 }
//                             }}
//                         >
//                             <Security color="action" sx={{ marginRight: 1 }} />
//                             <Typography variant="h6" sx={{ fontWeight: 600 }}>Security & Access</Typography>
//                         </AccordionSummary>
//                         <AccordionDetails>
//                             <Typography variant="body2"><strong>Authorization Header:</strong> {apiDetails.authorizationHeader}</Typography>
//                             <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginTop: 1 }}>
//                                 {apiDetails.securityScheme?.map((scheme, index) => (
//                                     <Chip key={index} label={scheme}
//                                         sx={{
//                                             backgroundColor: '#4caf50',
//                                             color: '#fff',
//                                         }} />
//                                 ))}
//                             </Box>
//                         </AccordionDetails>
//                     </Accordion> */}
//                     <div className="w-full max-w-[1200px] rounded-xl bg-white shadow-[0_4px_8px_rgba(0,0,0,0.1)] overflow-hidden">
//                         {/* Header Section */}
//                         <div className="flex items-center min-h-12 px-4 bg-amber-100">
//                             <Security className="text-gray-400 mr-2" />
//                             <h6 className="text-lg font-semibold">Security & Access</h6>
//                         </div>

//                         {/* Content Section */}
//                         <div className="p-4">
//                             <p className="text-sm">
//                                 <span className="font-bold">Authorization Header:</span> {apiDetails.authorizationHeader}
//                             </p>
//                             <div className="flex flex-wrap gap-2 mt-2">
//                                 {apiDetails.securityScheme?.map((scheme, index) => (
//                                     <span
//                                         key={index}
//                                         className="px-3 py-1 text-sm text-white bg-green-600 rounded-full"
//                                     >
//                                         {scheme}
//                                     </span>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </Paper>

//                 <Button
//                     variant="contained"
//                     color="primary"
//                     startIcon={<CloudUpload />}
//                     onClick={handleOpen}
//                     sx={{
//                         height: '48px',
//                         alignSelf: 'flex-start',
//                         marginTop: '40px'
//                     }}
//                 >
//                     Upload Details
//                 </Button>
//             </Box>

//             <Modal open={open} onClose={handleClose}>
//                 <Box
//                     sx={{
//                         position: 'absolute',
//                         top: '50%',
//                         left: '50%',
//                         transform: 'translate(-50%, -50%)',
//                         width: 400,
//                         maxHeight: '80vh',
//                         bgcolor: 'background.paper',
//                         boxShadow: 24,
//                         p: 4,
//                         borderRadius: 2,
//                         display: 'flex',
//                         flexDirection: 'column',
//                         overflow: 'hidden'
//                     }}
//                 >
//                     <Typography variant="h6" sx={{ mb: 2 }}>Upload API Architecture Image</Typography>
//                     <Box
//                         {...getRootProps()}
//                         sx={{
//                             border: '2px dashed #90caf9',
//                             padding: 4,
//                             textAlign: 'center',
//                             backgroundColor: '#e3f2fd',
//                             cursor: 'pointer',
//                             borderRadius: 1,
//                             flexShrink: 0
//                         }}
//                     >
//                         <input {...getInputProps()} />
//                         <Typography>Drag and drop an image here, or click to select one</Typography>
//                     </Box>
//                     {uploadedImage && (
//                         <Box sx={{
//                             mt: 2,
//                             height: 300,
//                             overflow: 'auto',
//                             border: '1px solid #e0e0e0',
//                             borderRadius: 1,
//                             display: 'flex',
//                             justifyContent: 'center',
//                             alignItems: 'flex-start'
//                         }}>
//                             <Typography variant="body2" sx={{ position: 'absolute', top: 8, left: 8 }}>Preview:</Typography>
//                             <img
//                                 src={uploadedImage}
//                                 alt="Preview"
//                                 style={{
//                                     maxWidth: '100%',
//                                     maxHeight: '100%',
//                                     objectFit: 'contain'
//                                 }}
//                             />
//                         </Box>
//                     )}
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         sx={{
//                             mt: 2,
//                             flexShrink: 0
//                         }}
//                         onClick={handleUpload}
//                         fullWidth
//                         disabled={!uploadedImage}
//                     >
//                         Upload
//                     </Button>
//                 </Box>
//             </Modal>

//             <Paper
//                 elevation={3}
//                 sx={{
//                     width: '100%',
//                     maxWidth: 1200,
//                     padding: 3,
//                     borderRadius: 3,
//                     backgroundColor: '#ffffff',
//                     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//                 }}
//             >
//                 <Accordion
//                     onChange={handleAccordionChange('general')}
//                 >
//                     <AccordionSummary
//                         expandIcon={<ExpandMoreIcon />}
//                         sx={{ backgroundColor: '#e1f5fe' }}
//                     >
//                         <Info color="primary" sx={{
//                             marginRight: 1,
//                             color: '#00796b'
//                         }} />
//                         <Typography
//                             variant="h6"
//                             sx={{ fontWeight: 600 }}
//                         >
//                             General Information
//                         </Typography>
//                     </AccordionSummary>

//                     <AccordionDetails sx={{
//                         padding: '24px 32px',
//                         backgroundColor: '#f5f5f5',
//                         borderTop: '1px solid #e0e0e0'
//                     }}>
//                         <Box sx={{
//                             display: 'grid',
//                             gridTemplateColumns: 'minmax(120px, max-content) 1fr',
//                             gap: '12px 8px',
//                             alignItems: 'baseline',
//                         }}>
//                             <Typography variant="body1" sx={{
//                                 fontWeight: 500,
//                                 color: '#00796b',
//                                 alignSelf: 'center',
//                                 textAlign: 'left',
//                                 display: 'block',
//                             }}>
//                                 Name:
//                             </Typography>
//                             <Typography variant="body1" sx={{
//                                 color: '#424242',
//                                 paddingLeft: '4px',
//                                 textAlign: 'left',
//                                 display: 'block',
//                             }}>
//                                 {apiDetails.name}
//                             </Typography>

//                             <Typography variant="body1" sx={{
//                                 fontWeight: 500,
//                                 color: '#00796b',
//                                 alignSelf: 'flex-start',
//                                 pt: 1,
//                                 textAlign: 'left',
//                                 display: 'block',
//                             }}>
//                                 Description:
//                             </Typography>
//                             <Box sx={{
//                                 position: 'relative',
//                                 paddingLeft: '4px'
//                             }}>
//                                 {isAdmin && editingDescription ? (
//                                     <Box>
//                                         <TextField
//                                             label="Description"
//                                             value={editedDescription || apiDetails.description}
//                                             onChange={(e) => setEditedDescription(e.target.value)}
//                                             fullWidth
//                                             multiline
//                                             minRows={3}
//                                             maxRows={8}
//                                             variant="outlined"
//                                             sx={{
//                                                 backgroundColor: '#ffffff',
//                                                 borderRadius: '8px',
//                                                 '& .MuiOutlinedInput-root': {
//                                                     '& fieldset': {
//                                                         borderColor: '#b2dfdb',
//                                                     },
//                                                     '&:hover fieldset': {
//                                                         borderColor: '#00796b',
//                                                     },
//                                                 },
//                                             }}
//                                         />
//                                         <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, gap: 1 }}>
//                                             <Button
//                                                 variant="outlined"
//                                                 color="primary"
//                                                 onClick={() => setEditingDescription(false)}
//                                                 sx={{
//                                                     textTransform: 'none',
//                                                     color: '#00796b',
//                                                     borderColor: '#00796b'
//                                                 }}
//                                             >
//                                                 Cancel
//                                             </Button>
//                                             <Button
//                                                 variant="contained"
//                                                 color="primary"
//                                                 onClick={handleUpdateDescription}
//                                                 sx={{
//                                                     textTransform: 'none',
//                                                     backgroundColor: '#00796b',
//                                                     '&:hover': {
//                                                         backgroundColor: '#00695c',
//                                                     },
//                                                 }}
//                                             >
//                                                 Save
//                                             </Button>
//                                         </Box>
//                                     </Box>
//                                 ) : (
//                                     <Box sx={{
//                                         position: 'relative',
//                                         paddingRight: isAdmin ? '32px' : '0'
//                                     }}>
//                                         <Typography
//                                             variant="body1"
//                                             sx={{
//                                                 whiteSpace: 'pre-wrap',
//                                                 wordBreak: 'break-word',
//                                                 lineHeight: '1.8',
//                                                 color: '#424242',
//                                                 textAlign: 'left',
//                                                 display: 'block',
//                                             }}
//                                         >
//                                             {apiDetails.description || "No description available"}
//                                         </Typography>
//                                         {isAdmin && !editingDescription && (
//                                             <IconButton
//                                                 onClick={() => setEditingDescription(true)}
//                                                 size="small"
//                                                 sx={{
//                                                     position: 'absolute',
//                                                     right: '-10px',
//                                                     top: 0,
//                                                     backgroundColor: 'rgba(0, 121, 107, 0.1)',
//                                                     '&:hover': {
//                                                         backgroundColor: 'rgba(0, 121, 107, 0.2)',
//                                                     },
//                                                 }}
//                                             >
//                                                 <EditIcon fontSize="small" sx={{ color: '#00796b' }} />
//                                             </IconButton>
//                                         )}
//                                     </Box>
//                                 )}
//                             </Box>

//                             {[
//                                 { label: 'Provider', value: apiDetails.provider },
//                                 { label: 'Type', value: apiDetails.type },
//                                 { label: 'Version', value: apiDetails.version },
//                                 { label: 'Status', value: apiDetails.lifeCycleStatus },
//                                 { label: 'Visibility', value: apiDetails.visibility }
//                             ].map((item, index) => (
//                                 <React.Fragment key={index}>
//                                     <Typography variant="body1" sx={{
//                                         fontWeight: 500,
//                                         color: '#00796b',
//                                         alignSelf: 'center',
//                                         textAlign: 'left',
//                                         display: 'block',
//                                     }}>
//                                         {item.label}:
//                                     </Typography>
//                                     <Typography variant="body1" sx={{
//                                         color: '#424242',
//                                         paddingLeft: '4px',
//                                         textAlign: 'left',
//                                         display: 'block',
//                                     }}>
//                                         {item.value}
//                                     </Typography>
//                                 </React.Fragment>
//                             ))}
//                         </Box>
//                     </AccordionDetails>
//                 </Accordion>

//                 {uploadedImage && (
//                     <>
//                         <Divider sx={{ marginY: 2 }} />
//                         <Accordion defaultExpanded onChange={handleAccordionChange('apiFlow')}>
//                             <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#e1f5fe' }}>
//                                 <Settings color="info" sx={{ marginRight: 1 }} />
//                                 <Typography variant="h6" sx={{ fontWeight: 600 }}>API Architecture Flow</Typography>
//                             </AccordionSummary>
//                             <AccordionDetails>
//                                 <Box sx={{ display: 'flex', justifyContent: 'center' }}>
//                                     <img
//                                         src={uploadedImage}
//                                         alt="API Architecture"
//                                         style={{ maxWidth: '100%', borderRadius: 8 }}
//                                     />
//                                 </Box>
//                             </AccordionDetails>
//                         </Accordion>
//                     </>
//                 )}

//                 <Divider sx={{ marginY: 2 }} />

//                 <Accordion defaultExpanded={Boolean(apiId && endpoint)} onChange={handleAccordionChange('operations')} expanded={expanded === 'operations'} ref={operationsAccordionRef}>
//                     <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#ffebee' }}>
//                         <Settings color="success" sx={{ marginRight: 1 }} />
//                         <Typography variant="h6" sx={{ fontWeight: 600 }}>Operations</Typography>
//                     </AccordionSummary>
//                     <AccordionDetails style={{ maxHeight: '500px', overflow: 'auto' }}>
//                         {apiId && endpoint && (
//                             <ApiView apiId={apiId} endpoint={endpoint} />
//                         )}
//                     </AccordionDetails>
//                 </Accordion>

//                 <Divider sx={{ marginY: 2 }} />

//                 <Accordion>
//                     <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#e3f2fd' }}>
//                         <Storage color="secondary" sx={{ marginRight: 1 }} />
//                         <Typography variant="h6" sx={{ fontWeight: 600 }}>Endpoints</Typography>
//                     </AccordionSummary>
//                     <AccordionDetails>
//                         <Typography variant="body2"><strong>Sandbox Endpoint:</strong></Typography>
//                         <Paper sx={{ padding: 1, backgroundColor: '#e8f5e9', marginBottom: 1 }}>
//                             {apiDetails.endpointConfig?.sandbox_endpoints?.url || 'N/A'}
//                         </Paper>
//                         <Typography variant="body2"><strong>Production Endpoint:</strong></Typography>
//                         <Paper sx={{ padding: 1, backgroundColor: '#e8f5e9' }}>
//                             {apiDetails.endpointConfig?.production_endpoints?.url || 'N/A'}
//                         </Paper>
//                     </AccordionDetails>
//                 </Accordion>
//             </Paper>

//             <Snackbar
//                 open={openSnackbar}
//                 autoHideDuration={3000}
//                 onClose={handleSnackbarClose}
//                 anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//             >
//                 <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
//                     Image uploaded successfully!
//                 </Alert>
//             </Snackbar>
//         </Box>
//     );
// };

// export default ApiDetailsPage;


//Api navigation view 

// import React, { useContext, useEffect, useState } from 'react';
// import {
//     Typography, Box, Chip, Paper, Divider,
//     Button, Modal, TextField, IconButton,
//     List, ListItem, ListItemButton, ListItemIcon, ListItemText
// } from '@mui/material';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useQuery } from 'react-query';
// import { useDropzone } from 'react-dropzone';
// import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
// import { Info, Security, Storage, Settings, CloudUpload, Edit } from '@mui/icons-material';
// import CircularProgress from '@mui/material/CircularProgress';
// import Snackbar from '@mui/material/Snackbar';
// import Alert from '@mui/material/Alert';
// import ApiView from './ApiView';
// import { ApiEndpointContext } from '../../Context/ApiEndpointContext';
// import { AuthContext } from '../../Context/AuthContext';

// const ApiDetailsPage = () => {
//     const { user } = useContext(AuthContext);
//     const isAdmin = user?.roles?.includes("admin");
//     const axiosPrivate = useAxiosPrivate();
//     const navigate = useNavigate();
//     const { apiId } = useParams();
//     const { endpoint } = useContext(ApiEndpointContext);

//     const [activeSection, setActiveSection] = useState('general');
//     const [open, setOpen] = useState(false);
//     const [uploadedImage, setUploadedImage] = useState(null);
//     const [openSnackbar, setOpenSnackbar] = useState(false);
//     const [editingDescription, setEditingDescription] = useState(false);
//     const [editedDescription, setEditedDescription] = useState('');

//     const { data: apiDetails, isLoading, error } = useQuery(['apiDetails', apiId], async () => {
//         const response = await axiosPrivate.get(`http://localhost:8081/api/getapi/${apiId}`);
//         // const response = await axiosPrivate.get(`/getapi/${apiId}`);
//         return response.data;
//     });

//     const handleSnackbarClose = (event, reason) => {
//         if (reason === 'clickaway') return;
//         setOpenSnackbar(false);
//     };

//     const handleUpload = () => {
//         setOpenSnackbar(true);
//         setOpen(false);
//     };

//     const onDrop = (acceptedFiles) => {
//         const file = acceptedFiles[0];
//         const reader = new FileReader();
//         reader.onload = (event) => {
//             setUploadedImage(event.target.result);
//         };
//         reader.readAsDataURL(file);
//     };

//     const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

//     const getBearerToken = async () => {
//         try {
//             const response = await axiosPrivate.get(
//                 "http://localhost:8083/token",
//                 // "/token",
//                 null,
//                 { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
//             );
//             return response.data.access_token;
//         } catch (error) {
//             console.error("Error fetching Bearer token:", error.response?.data || error.message);
//             throw new Error("Failed to obtain Bearer token");
//         }
//     };

//     const handleUpdateDescription = async () => {
//         if (!apiId) {
//             alert("API ID is missing. Unable to update.");
//             return;
//         }

//         try {
//             const token = await getBearerToken();
//             const updatedData = {
//                 name: apiDetails?.name || "Default API Name",
//                 description: editedDescription || apiDetails?.description || "No description available",
//                 context: apiDetails?.context || "/default-context",
//                 version: apiDetails?.version || "1.0.0",
//                 provider: apiDetails?.provider || "default-provider",
//                 lifeCycleStatus: apiDetails?.lifeCycleStatus || "PUBLISHED",
//                 operations: apiDetails?.operations || []
//             };

//             await axiosPrivate.put(
//                 `http://localhost:8085/api/${apiId}`,
//                 // `/${apiId}`,
//                 updatedData,
//                 { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
//             );

//             alert("API details updated successfully!");
//             setEditingDescription(false);
//         } catch (error) {
//             console.error("Error updating API:", error.response?.data || error.message);
//             alert("Error updating API details");
//         }
//     };

//     if (isLoading) return (
//         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//             <CircularProgress />
//         </Box>
//     );
//     if (error) return <div>Error fetching API details: {error.message}</div>;

//     return (
//         <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
//             {/* Top Section - Security & Access and Upload Button */}
//             <Box sx={{
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 p: 3,
//                 backgroundColor: '#ffffff',
//                 boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//                 zIndex: 1
//             }}>
//                 <Paper sx={{
//                     flex: 1,
//                     borderRadius: 3,
//                     backgroundColor: '#ffffff',
//                     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//                 }}>
//                     <div className="w-full max-w-[1200px] rounded-xl bg-white shadow-[0_4px_8px_rgba(0,0,0,0.1)] overflow-hidden">
//                         <div className="flex items-center min-h-12 px-4 bg-amber-100">
//                             <Security className="text-gray-400 mr-2" />
//                             <h6 className="text-lg font-semibold">Security & Access</h6>
//                         </div>
//                         <div className="p-4">
//                             <p className="text-sm">
//                                 <span className="font-bold">Authorization Header:</span> {apiDetails.authorizationHeader}
//                             </p>
//                             <div className="flex flex-wrap gap-2 mt-2">
//                                 {apiDetails.securityScheme?.map((scheme, index) => (
//                                     <span
//                                         key={index}
//                                         className="px-3 py-1 text-sm text-white bg-green-600 rounded-full"
//                                     >
//                                         {scheme}
//                                     </span>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </Paper>

//                 <Button
//                     variant="contained"
//                     color="primary"
//                     startIcon={<CloudUpload />}
//                     onClick={() => setOpen(true)}
//                     sx={{
//                         height: '48px',
//                         marginLeft: 2
//                     }}
//                 >
//                     Upload Details
//                 </Button>
//             </Box>

//             {/* Main Content Area (Sidebar + Content) */}
//             <Box sx={{ display: 'flex', flex: 1 }}>
//                 {/* Left Sidebar Navigation */}
//                 <Paper sx={{
//                     width: 250,
//                     padding: 2,
//                     borderRadius: 0,
//                     boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
//                     backgroundColor: '#ffffff'
//                 }}>
//                     <Typography variant="h6" sx={{ padding: 2, fontWeight: 'bold' }}>
//                         API Navigation
//                     </Typography>
//                     <List>
//                         {[
//                             { id: 'general', label: 'General Information', icon: <Info /> },
//                             { id: 'operations', label: 'Operations', icon: <Settings /> },
//                             { id: 'endpoints', label: 'Endpoints', icon: <Storage /> },
//                             ...(uploadedImage ? [{ id: 'flow', label: 'API Flow', icon: <Settings /> }] : [])
//                         ].map((item) => (
//                             <ListItem key={item.id} disablePadding>
//                                 <ListItemButton
//                                     selected={activeSection === item.id}
//                                     onClick={() => setActiveSection(item.id)}
//                                     sx={{
//                                         borderRadius: 1,
//                                         '&.Mui-selected': {
//                                             backgroundColor: '#e3f2fd',
//                                             color: '#1976d2'
//                                         },
//                                         '&.Mui-selected:hover': {
//                                             backgroundColor: '#bbdefb'
//                                         }
//                                     }}
//                                 >
//                                     <ListItemIcon sx={{ color: activeSection === item.id ? '#1976d2' : 'inherit' }}>
//                                         {item.icon}
//                                     </ListItemIcon>
//                                     <ListItemText primary={item.label} />
//                                 </ListItemButton>
//                             </ListItem>
//                         ))}
//                     </List>
//                 </Paper>

//                 {/* Main Content Area */}
//                 <Box sx={{ flex: 1, p: 3 }}>
//                     {/* General Information Section */}
//                     {activeSection === 'general' && (
//                         <Paper sx={{ p: 3, mb: 3 }}>
//                             <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'left' }}>
//                                 General Information
//                             </Typography>
//                             <Box sx={{
//                                 display: 'grid',
//                                 gridTemplateColumns: 'minmax(120px, max-content) 1fr',
//                                 gap: '12px 8px',
//                                 alignItems: 'baseline',
//                                 p: 2
//                             }}>
//                                 <Typography variant="body1" sx={{ fontWeight: 500, color: '#00796b', textAlign: 'left' }}>
//                                     Name:
//                                 </Typography>
//                                 <Typography variant="body1" sx={{ textAlign: 'left' }}>{apiDetails.name}</Typography>

//                                 <Typography variant="body1" sx={{ fontWeight: 500, color: '#00796b', textAlign: 'left' }}>
//                                     Description:
//                                 </Typography>
//                                 <Box sx={{ position: 'relative', textAlign: 'left' }}>
//                                     {isAdmin && editingDescription ? (
//                                         <Box>
//                                             <TextField
//                                                 label="Description"
//                                                 value={editedDescription || apiDetails.description}
//                                                 onChange={(e) => setEditedDescription(e.target.value)}
//                                                 fullWidth
//                                                 multiline
//                                                 minRows={3}
//                                                 maxRows={8}
//                                                 variant="outlined"
//                                                 sx={{
//                                                     backgroundColor: '#ffffff',
//                                                     borderRadius: '8px',
//                                                     '& .MuiOutlinedInput-root': {
//                                                         '& fieldset': { borderColor: '#b2dfdb' },
//                                                         '&:hover fieldset': { borderColor: '#00796b' }
//                                                     }
//                                                 }}
//                                             />
//                                             <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, gap: 1 }}>
//                                                 <Button
//                                                     variant="outlined"
//                                                     color="primary"
//                                                     onClick={() => setEditingDescription(false)}
//                                                     sx={{ textTransform: 'none' }}
//                                                 >
//                                                     Cancel
//                                                 </Button>
//                                                 <Button
//                                                     variant="contained"
//                                                     color="primary"
//                                                     onClick={handleUpdateDescription}
//                                                     sx={{ textTransform: 'none' }}
//                                                 >
//                                                     Save
//                                                 </Button>
//                                             </Box>
//                                         </Box>
//                                     ) : (
//                                         <Box sx={{ position: 'relative', pr: isAdmin ? '32px' : '0' }}>
//                                             <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
//                                                 {apiDetails.description || "No description available"}
//                                             </Typography>
//                                             {isAdmin && !editingDescription && (
//                                                 <IconButton
//                                                     onClick={() => setEditingDescription(true)}
//                                                     size="small"
//                                                     sx={{
//                                                         position: 'absolute',
//                                                         right: -10,
//                                                         top: 0,
//                                                         backgroundColor: 'rgba(0, 121, 107, 0.1)',
//                                                         '&:hover': { backgroundColor: 'rgba(0, 121, 107, 0.2)' }
//                                                     }}
//                                                 >
//                                                     <Edit fontSize="small" sx={{ color: '#00796b' }} />
//                                                 </IconButton>
//                                             )}
//                                         </Box>
//                                     )}
//                                 </Box>

//                                 {[
//                                     { label: 'Provider', value: apiDetails.provider },
//                                     { label: 'Type', value: apiDetails.type },
//                                     { label: 'Version', value: apiDetails.version },
//                                     { label: 'Status', value: apiDetails.lifeCycleStatus },
//                                     { label: 'Visibility', value: apiDetails.visibility }
//                                 ].map((item, index) => (
//                                     <React.Fragment key={index}>
//                                         <Typography variant="body1" sx={{ fontWeight: 500, color: '#00796b', textAlign: 'left' }}>
//                                             {item.label}:
//                                         </Typography>
//                                         <Typography variant="body1" sx={{ textAlign: 'left' }}>{item.value}</Typography>
//                                     </React.Fragment>
//                                 ))}
//                             </Box>
//                         </Paper>
//                     )}
//                     {/* Operations Section */}
//                     {activeSection === 'operations' && (
//                         <Paper sx={{ p: 3, mb: 3 }}>
//                             <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
//                                 Operations
//                             </Typography>
//                             {apiId && endpoint && (
//                                 <Box sx={{ maxHeight: '500px', overflow: 'auto' }}>
//                                     <ApiView apiId={apiId} endpoint={endpoint} />
//                                 </Box>
//                             )}
//                         </Paper>
//                     )}

//                     {/* Endpoints Section */}
//                     {activeSection === 'endpoints' && (
//                         <Paper sx={{ p: 3, mb: 3 }}>
//                             <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
//                                 Endpoints
//                             </Typography>
//                             <Box sx={{ p: 2 }}>
//                                 <Typography variant="body2"><strong>Sandbox Endpoint:</strong></Typography>
//                                 <Paper sx={{ p: 2, backgroundColor: '#e8f5e9', mb: 2 }}>
//                                     {apiDetails.endpointConfig?.sandbox_endpoints?.url || 'N/A'}
//                                 </Paper>
//                                 <Typography variant="body2"><strong>Production Endpoint:</strong></Typography>
//                                 <Paper sx={{ p: 2, backgroundColor: '#e8f5e9' }}>
//                                     {apiDetails.endpointConfig?.production_endpoints?.url || 'N/A'}
//                                 </Paper>
//                             </Box>
//                         </Paper>
//                     )}

//                     {/* API Flow Section */}
//                     {activeSection === 'flow' && uploadedImage && (
//                         <Paper sx={{ p: 3 }}>
//                             <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
//                                 API Architecture Flow
//                             </Typography>
//                             <Box sx={{ display: 'flex', justifyContent: 'center' }}>
//                                 <img
//                                     src={uploadedImage}
//                                     alt="API Architecture"
//                                     style={{ maxWidth: '100%', borderRadius: 8 }}
//                                 />
//                             </Box>
//                         </Paper>
//                     )}
//                 </Box>
//             </Box>

//             {/* Upload Modal */}
//             <Modal open={open} onClose={() => setOpen(false)}>
//                 <Box sx={{
//                     position: 'absolute',
//                     top: '50%',
//                     left: '50%',
//                     transform: 'translate(-50%, -50%)',
//                     width: 400,
//                     bgcolor: 'background.paper',
//                     boxShadow: 24,
//                     p: 4,
//                     borderRadius: 2
//                 }}>
//                     <Typography variant="h6" sx={{ mb: 2 }}>Upload API Architecture Image</Typography>
//                     <Box {...getRootProps()} sx={{
//                         border: '2px dashed #90caf9',
//                         p: 4,
//                         textAlign: 'center',
//                         backgroundColor: '#e3f2fd',
//                         cursor: 'pointer',
//                         borderRadius: 1
//                     }}>
//                         <input {...getInputProps()} />
//                         <Typography>Drag and drop an image here, or click to select one</Typography>
//                     </Box>
//                     {uploadedImage && (
//                         <Box sx={{ mt: 2, height: 300, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 1 }}>
//                             <Typography variant="body2" sx={{ position: 'absolute', top: 8, left: 8 }}>Preview:</Typography>
//                             <img src={uploadedImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
//                         </Box>
//                     )}
//                     <Button
//                         variant="contained"
//                         fullWidth
//                         sx={{ mt: 2 }}
//                         onClick={handleUpload}
//                         disabled={!uploadedImage}
//                     >
//                         Upload
//                     </Button>
//                 </Box>
//             </Modal>

//             <Snackbar
//                 open={openSnackbar}
//                 autoHideDuration={3000}
//                 onClose={handleSnackbarClose}
//                 anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//             >
//                 <Alert onClose={handleSnackbarClose} severity="success">
//                     Image uploaded successfully!
//                 </Alert>
//             </Snackbar>
//         </Box>
//     );
// };

// export default ApiDetailsPage;


//card view

import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    Typography, Box, Chip, Paper, Divider,
    Button, Modal, TextField, IconButton,
    List, ListItem, ListItemButton, ListItemIcon, ListItemText, Card, CardContent
} from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useDropzone } from 'react-dropzone';
import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
import { Info, Security, Storage, Settings, CloudUpload, Edit, Lock } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ApiView from './ApiView';
import { ApiEndpointContext } from '../../Context/ApiEndpointContext';
import { AuthContext } from '../../Context/AuthContext';
import Loader from '../../Assets/loader2.gif';
import BreadcrumbComponent from '../../Components/BreadcrumbComponent';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


const ApiDetailsPage = () => {
    const { user } = useContext(AuthContext);
    const isAdmin = user?.roles?.includes("admin");
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const { apiId } = useParams();
    const { endpoint } = useContext(ApiEndpointContext);
    const [activeTab, setActiveTab] = useState('general');
    const [activeSection, setActiveSection] = useState('general');
    const [open, setOpen] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [editingDescription, setEditingDescription] = useState(false);
    const [editedDescription, setEditedDescription] = useState('');
    const architectureFlowRef = useRef(null);
    const location = useLocation();

    // useEffect(() => {
    //     if (location.state?.shouldScrollToOperations && operationsRef.current) {
    //         const timer = setTimeout(() => {
    //             operationsRef.current.scrollIntoView({ 
    //                 behavior: 'smooth',
    //                 block: 'start'
    //             });
    //             // Clear the state after scrolling
    //             navigate(location.pathname, { replace: true, state: {} });
    //         }, 300); // Small delay to ensure component renders

    //         return () => clearTimeout(timer);
    //     }
    // }, [location.state, navigate, location.pathname]);

    useEffect(() => {
        if (location.state?.shouldScrollToOperations && operationsRef.current) {
            const timer = setTimeout(() => {
                operationsRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Clear the state after scrolling
                navigate(location.pathname, { replace: true, state: {} });
            }, 300); // Small delay to ensure component renders

            return () => clearTimeout(timer);
        }
    }, [location.state, navigate, location.pathname]);

    useEffect(() => {
        window.scrollTo(0, 0);
        setActiveSection('general');
    }, [apiId]);

    const { data: apiDetails, isLoading, error } = useQuery(['apiDetails', apiId], async () => {
        // const response = await axiosPrivate.get(`http://localhost:8081/api/getapi/${apiId}`);
        const response = await axiosPrivate.get(`/getapi/${apiId}`);
        return response.data;
    });

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpenSnackbar(false);
    };

    const handleUpload = () => {
        setOpenSnackbar(true);
        setOpen(false);
        setActiveSection('architecture');
        setTimeout(() => {
            scrollToSection(architectureFlowRef);
        }, 100);
    };

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            setUploadedImage(event.target.result);
        };
        reader.readAsDataURL(file);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

    const getBearerToken = async () => {
        try {
            const response = await axiosPrivate.get(
                // "http://localhost:8083/token",
                "/token",
                null,
                { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
            );
            return response.data.access_token;
        } catch (error) {
            console.error("Error fetching Bearer token:", error.response?.data || error.message);
            throw new Error("Failed to obtain Bearer token");
        }
    };

    const handleUpdateDescription = async () => {
        if (!apiId) {
            alert("API ID is missing. Unable to update.");
            return;
        }

        try {
            const token = await getBearerToken();
            const updatedData = {
                name: apiDetails?.name || "Default API Name",
                description: editedDescription || apiDetails?.description || "No description available",
                context: apiDetails?.context || "/default-context",
                version: apiDetails?.version || "1.0.0",
                provider: apiDetails?.provider || "default-provider",
                lifeCycleStatus: apiDetails?.lifeCycleStatus || "PUBLISHED",
                operations: apiDetails?.operations || []
            };

            await axiosPrivate.put(
                // `http://localhost:8085/api/${apiId}`,
                `/${apiId}`,
                updatedData,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );

            alert("API details updated successfully!");
            setEditingDescription(false);
        } catch (error) {
            console.error("Error updating API:", error.response?.data || error.message);
            alert("Error updating API details");
        }
    };

    const generalInfoRef = useRef(null);
    const operationsRef = useRef(null);
    const endpointsRef = useRef(null);

    // const scrollToSection = (ref) => {
    //     ref.current.scrollIntoView({ behavior: 'smooth' });
    // };

    const scrollToSection = (ref) => {
        if (ref?.current) {
            ref.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    if (isLoading) return (
        // <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        //     <CircularProgress />
        // </Box>

        // <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'background.default' }}>
        //     <img
        //         src={Loader}
        //         alt="Loading..."
        //         style={{
        //             width: '250px',
        //             height: '250px'
        //         }}
        //     />

        // </Box>

        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <DotLottieReact
                src="https://lottie.host/daa52b92-4f61-46f3-b628-4e8763f992f0/uxk1wFWwXN.lottie"
                className="w-[150px] h-[150px]"
                loop
                autoplay
            />
        </div>
    );
    if (error) return <div>Error fetching API details: {error.message}</div>;

    return (
        <Box sx={{
            // p: 3,
            // backgroundColor: '#f5f7fa', 
            minHeight: '100vh'
        }}>
            <Box sx={{
                position: 'sticky',
                top: 65,
                zIndex: 600,
                backgroundColor: '#f8fafc',
                // pb: 1,
                // p: 1,
                pt: 2,
                pb: 1,
                mb: 2,
                borderBottom: '1px solid #e0e0e0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <BreadcrumbComponent />
            </Box>
            {/* Keep Security & Access and Upload button exactly the same */}
            <div className='flex mb-6 gap-2'>
                <Paper sx={{
                    flex: 1,
                    borderRadius: 3,
                    backgroundColor: '#ffffff',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}>

                    {/* <div className="w-full max-w-[1200px] rounded-xl bg-white shadow-[0_8px_10px_rgba(0,0,0,0.2)] overflow-hidden">
                        <div className="flex items-center min-h-12 px-4 bg-amber-100">
                            <Security className="text-gray-400 mr-2" />
                            <h6 className="text-lg font-semibold">Security & Endpoints</h6>
                        </div>

                        <div className="p-4 text-left">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <p className="text-sm font-semibold text-slate-600 mb-1">Sandbox Endpoint</p>
                                    <div className="p-2 bg-green-50 rounded border border-green-200">
                                        <code className="text-green-800 font-mono text-sm">
                                            {apiDetails.endpointConfig?.sandbox_endpoints?.url || 'N/A'}
                                        </code>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-600 mb-1">Production Endpoint</p>
                                    <div className="p-2 bg-green-50 rounded border border-green-200">
                                        <code className="text-green-800 font-mono text-sm">
                                            {apiDetails.endpointConfig?.production_endpoints?.url || 'N/A'}
                                        </code>
                                    </div>
                                </div>
                            </div>

                            <div >
                                <p className="text-sm">
                                    <span className="font-bold">Authorization Header:</span> {apiDetails.authorizationHeader}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {apiDetails.securityScheme?.map((scheme, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 text-sm text-white bg-green-600 rounded-full"
                                        >
                                            {scheme}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <div className="w-full max-w-[1200px] rounded-xl bg-white shadow-[0_8px_10px_rgba(0,0,0,0.2)] overflow-hidden">
                        <div className="flex items-center min-h-12 px-4 bg-amber-100">
                            <Security className="text-gray-400 mr-2" />
                            <h6 className="text-lg font-semibold">Security & Endpoints</h6>
                        </div>

                        <div className="p-4 text-left">
                            {/* Authorization Header */}
                            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-3 items-baseline">
                                <div className="sm:col-span-1">
                                    <p className="text-xs font-semibold text-slate-600">Authorization Header</p>
                                </div>
                                <div className="sm:col-span-4">
                                    <div className="flex flex-wrap gap-2">
                                        {apiDetails.securityScheme?.length > 0 ? (
                                            apiDetails.securityScheme.map((scheme, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 text-xs text-white bg-green-600 rounded-full whitespace-nowrap"
                                                >
                                                    {scheme}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-slate-400">-</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Sandbox Endpoint */}
                            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-3 items-baseline">
                                <div className="sm:col-span-1">
                                    <p className="text-xs font-semibold text-slate-600">Sandbox Endpoint</p>
                                </div>
                                <div className="sm:col-span-4">
                                    <code className="text-xs text-slate-800 break-all">
                                        {apiDetails.endpointConfig?.sandbox_endpoints?.url || 'NA'}
                                    </code>
                                </div>
                            </div>

                            {/* Production Endpoint */}
                            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-3 items-baseline">
                                <div className="sm:col-span-1">
                                    <p className="text-xs font-semibold text-slate-600">Production Endpoint</p>
                                </div>
                                <div className="sm:col-span-4">
                                    <code className="text-xs text-slate-800 break-all">
                                        {apiDetails.endpointConfig?.production_endpoints?.url || 'NA'}
                                    </code>
                                </div>
                            </div>

                            {/* Rate Limit */}
                            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-3 items-baseline">
                                <div className="sm:col-span-1">
                                    <p className="text-xs font-semibold text-slate-600">Rate Limit</p>
                                </div>
                                <div className="sm:col-span-4">
                                    <code className="text-xs text-slate-800 break-all">
                                        {apiDetails.rateLimit || 'NA'}
                                    </code>
                                </div>
                            </div>

                            {/* Last Updated On */}
                            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-3 items-baseline">
                                <div className="sm:col-span-1">
                                    <p className="text-xs font-semibold text-slate-600">Last Updated On</p>
                                </div>
                                <div className="sm:col-span-4">
                                    <code className="text-xs text-slate-800 break-all">
                                        {apiDetails.lastUpdated || 'NA'}
                                    </code>
                                </div>
                            </div>
                        </div>
                    </div>
                </Paper>

                <div className="flex items-center">
                    <button
                        onClick={() => setOpen(true)}
                        className="ml-2 h-12 px-6 bg-orange-400 hover:bg-orange-500 text-white font-medium rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 flex items-center space-x-2"
                    >
                        <CloudUpload className="w-5 h-5" />
                        <span>Upload Details</span>
                    </button>
                </div>
            </div>

            {/* New Tab Navigation - Modern Design */}
            <Box sx={{
                display: 'flex',
                gap: 1,
                mb: 4,
                position: 'sticky',
                top: 0,
                zIndex: 10,
                backgroundColor: '#f8fafc',
                pt: 2,
                pb: 1,
                borderBottom: '1px solid #e2e8f0'
            }}>
                <Button
                    onClick={() => {
                        setActiveSection('general');
                        scrollToSection(generalInfoRef);
                    }}
                    sx={{
                        fontSize: '15px',
                        px: 3,
                        py: 1.5,
                        borderRadius: '8px 8px 0 0',
                        backgroundColor: activeSection === 'general' ? 'white' : 'transparent',
                        color: activeSection === 'general' ? '#e65c00' : 'text.secondary',
                        border: activeSection === 'general' ? '1px solid #e2e8f0' : 'none',
                        borderBottom: activeSection === 'general' ? '1px solid #e65c00' : '1px solid #e2e8f0',
                        '&:hover': {
                            backgroundColor: activeSection === 'general' ? 'white' : 'grey.100'
                        },
                        transition: 'all 0.2s ease',
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: 'none',
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: activeSection === 'general' ? '3px' : 0,
                            backgroundColor: '#e65c00',
                            borderRadius: '3px 3px 0 0'
                        }
                    }}
                >
                    General Information
                </Button>
                <Button
                    onClick={() => {
                        setActiveSection('operations');
                        scrollToSection(operationsRef);
                    }}
                    sx={{
                        fontSize: '15px',
                        px: 3,
                        py: 1.5,
                        borderRadius: '8px 8px 0 0',
                        backgroundColor: activeSection === 'operations' ? 'white' : 'transparent',
                        color: activeSection === 'operations' ? '#e65c00' : 'text.secondary',
                        border: activeSection === 'operations' ? '1px solid #e2e8f0' : 'none',
                        borderBottom: activeSection === 'operations' ? '1px solid #e65c00' : '1px solid #e2e8f0',
                        '&:hover': {
                            backgroundColor: activeSection === 'operations' ? 'white' : 'grey.100'
                        },
                        transition: 'all 0.2s ease',
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: 'none',
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: activeSection === 'operations' ? '3px' : 0,
                            backgroundColor: '#e65c00',
                            borderRadius: '3px 3px 0 0'
                        }
                    }}
                >
                    Operations
                </Button>
                <Button
                    onClick={() => {
                        setActiveSection('architecture');
                        scrollToSection(architectureFlowRef);
                    }}
                    sx={{
                        fontSize: '15px',
                        px: 3,
                        py: 1.5,
                        borderRadius: '8px 8px 0 0',
                        backgroundColor: activeSection === 'architecture' ? 'white' : 'transparent',
                        color: activeSection === 'architecture' ? '#e65c00' : 'text.secondary',
                        border: activeSection === 'architecture' ? '1px solid #e2e8f0' : 'none',
                        borderBottom: activeSection === 'architecture' ? '1px solid #e65c00' : '1px solid #e2e8f0',
                        '&:hover': {
                            backgroundColor: activeSection === 'architecture' ? 'white' : 'grey.100'
                        },
                        transition: 'all 0.2s ease',
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: 'none',
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: activeSection === 'architecture' ? '3px' : 0,
                            backgroundColor: '#e65c00',
                            borderRadius: '3px 3px 0 0'
                        }
                    }}
                >
                    Architecture Flow
                </Button>
            </Box>

            {/* General Information Section - Modern Design */}
            <Box
                ref={generalInfoRef}
                sx={{
                    mb: 4,
                    // p: 4,
                    backgroundColor: 'white',
                    borderRadius: 2,
                    boxShadow: '0 8px 10px rgba(0,0,0,0.2)',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        boxShadow: '0 8px 10px rgba(0,0,0,0.2)'
                    }
                }}
            >

                <div className="flex items-center min-h-12 px-4 bg-amber-100">
                    <Info className="text-sky-500 mr-2" />
                    <h6 className="text-lg font-semibold">General Information</h6>
                </div>
                {/* </Box> */}

                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '150px 1fr' },
                    gap: 2,
                    p: 3,
                    // alignItems: 'center',
                    textAlign: 'left'
                }}>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#64748b' }}>
                        Name:
                    </Typography>
                    <Typography sx={{
                        textAlign: 'left',
                        fontWeight: 500,
                        color: '#0f172a'
                    }}>
                        {apiDetails.name}
                    </Typography>

                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#64748b' }}>
                        Description:
                    </Typography>
                    <Box sx={{ position: 'relative', textAlign: 'left' }}>
                        {isAdmin && editingDescription ? (
                            <Box>
                                <TextField
                                    label="Description"
                                    // value={editedDescription || apiDetails.description}
                                    value={editedDescription}
                                    onChange={(e) => setEditedDescription(e.target.value)}
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    maxRows={8}
                                    variant="outlined"
                                    sx={{ textAlign: 'left' }}
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1, gap: 1 }}>
                                    <Button
                                        variant="outlined"
                                        // onClick={() => setEditingDescription(false)}
                                        onClick={() => {
                                            setEditingDescription(false);
                                            // setEditedDescription(apiDetails.description); 
                                            setEditedDescription('');
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleUpdateDescription}
                                    >
                                        Save
                                    </Button>
                                </Box>
                            </Box>
                        ) : (
                            <Box sx={{ position: 'relative', pr: isAdmin ? '32px' : '0', textAlign: 'left' }}>
                                <Typography variant="body1" sx={{
                                    whiteSpace: 'pre-wrap',
                                    color: '#334155'
                                }}>
                                    {apiDetails.description || "No description available"}
                                </Typography>
                                {isAdmin && !editingDescription && (
                                    <IconButton
                                        // onClick={() => setEditingDescription(true)}
                                        onClick={() => {
                                            setEditingDescription(true);
                                            setEditedDescription(apiDetails.description); // Initialize with current description
                                        }}
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            right: -10,
                                            top: 0,
                                            backgroundColor: 'rgba(14, 165, 233, 0.1)',
                                            '&:hover': { backgroundColor: 'rgba(14, 165, 233, 0.2)' }
                                        }}
                                    >
                                        <Edit fontSize="small" sx={{ color: '#0ea5e9' }} />
                                    </IconButton>
                                )}
                            </Box>
                        )}
                    </Box>

                    {[
                        { label: 'Provider', value: apiDetails.provider },
                        { label: 'Type', value: apiDetails.type },
                        { label: 'Version', value: apiDetails.version },
                        { label: 'Status', value: apiDetails.lifeCycleStatus },
                        { label: 'Visibility', value: apiDetails.visibility }
                    ].map((item, index) => (
                        <React.Fragment key={index}>
                            <Typography variant="body1" sx={{ fontWeight: 500, color: '#64748b' }}>
                                {item.label}:
                            </Typography>
                            <Typography sx={{
                                textAlign: 'left',
                                fontWeight: 500,
                                color: '#0f172a'
                            }}>
                                {item.value}
                            </Typography>
                        </React.Fragment>
                    ))}
                </Box>
            </Box>

            {/* Operations Section - Modern Design */}
            <Box
                ref={operationsRef}
                sx={{
                    mb: 4,
                    // p: 4,
                    backgroundColor: 'white',
                    borderRadius: 2,
                    boxShadow: '0 8px 10px rgba(0,0,0,0.2)',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s ease',
                }}
            >

                <div className="flex items-center min-h-12 px-4 bg-amber-100">
                    <Settings className="text-lime-600 mr-2" />
                    <h6 className="text-lg font-semibold">Operations</h6>
                </div>

                {apiId && endpoint ? (
                    <Box sx={{
                        // maxHeight: '500px',
                        overflow: 'auto',
                        borderRadius: 1,
                        p: 3,
                        border: '1px solid #e2e8f0'
                    }}>
                        <ApiView apiId={apiId} endpoint={endpoint} />
                    </Box>
                ) : (
                    <div className="flex items-center justify-center min-h-[80px] rounded border border-gray-200 p-2 text-gray-500">
                        <p>Please select an endpoint</p>
                    </div>
                )}
            </Box>

            <div ref={architectureFlowRef} className="mb-4 bg-white rounded-xl shadow-[0_8px_10px_rgba(0,0,0,0.2)] border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="flex items-center min-h-12 px-4 bg-amber-100">
                    <Storage className="text-purple-600 mr-2" />
                    <h6 className="text-lg font-semibold">API Architecture Flow</h6>
                </div>

                {/* Image Container */}
                <div className="p-4 flex flex-col items-center justify-center">
                    {uploadedImage ? (
                        <img
                            src={uploadedImage}
                            alt="API Architecture"
                            className="max-w-full rounded-lg border border-gray-200 shadow-sm"
                        />
                    ) : (
                        <div className="text-center p-8 w-full border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                            <CloudUpload className="mx-auto h-12 w-12 text-gray-400" />
                            <h4 className="mt-2 text-lg font-medium text-gray-700">No API Flow Image</h4>
                            <p className="mt-1 text-sm text-gray-500">
                                Please upload the API architecture flow image
                            </p>
                            <button
                                onClick={() => setOpen(true)}
                                className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
                            >
                                Upload Image
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Keep the Modal and Snackbar exactly the same */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2
                }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Upload API Architecture Image</Typography>
                    <Box {...getRootProps()} sx={{
                        border: '2px dashed #90caf9',
                        p: 4,
                        textAlign: 'center',
                        backgroundColor: '#e3f2fd',
                        cursor: 'pointer',
                        borderRadius: 1
                    }}>
                        <input {...getInputProps()} />
                        <Typography>Drag and drop an image here, or click to select one</Typography>
                    </Box>
                    {uploadedImage && (
                        <Box sx={{ mt: 2, height: 300, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 1 }}>
                            <Typography variant="body2" sx={{ position: 'absolute', top: 8, left: 8 }}>Preview:</Typography>
                            <img src={uploadedImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                        </Box>
                    )}
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={handleUpload}
                        disabled={!uploadedImage}
                    >
                        Upload
                    </Button>
                </Box>
            </Modal>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    Image uploaded successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default ApiDetailsPage;



// import React, { useContext, useEffect, useState } from 'react';
// import {
//     Typography, Box, Chip, Paper, Divider,
//     Button, Modal, TextField, IconButton,
//     List, ListItem, ListItemButton, ListItemIcon, ListItemText, Card, CardContent
// } from '@mui/material';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useQuery } from 'react-query';
// import { useDropzone } from 'react-dropzone';
// import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
// import { Info, Security, Storage, Settings, CloudUpload, Edit } from '@mui/icons-material';
// import CircularProgress from '@mui/material/CircularProgress';
// import Snackbar from '@mui/material/Snackbar';
// import Alert from '@mui/material/Alert';
// import ApiView from './ApiView';
// import { ApiEndpointContext } from '../../Context/ApiEndpointContext';
// import { AuthContext } from '../../Context/AuthContext';

// const ApiDetailsPage = () => {
//     const { user } = useContext(AuthContext);
//     const isAdmin = user?.roles?.includes("admin");
//     const axiosPrivate = useAxiosPrivate();
//     const navigate = useNavigate();
//     const { apiId } = useParams();
//     const { endpoint } = useContext(ApiEndpointContext);

//     const [activeSection, setActiveSection] = useState('general');
//     const [open, setOpen] = useState(false);
//     const [uploadedImage, setUploadedImage] = useState(null);
//     const [openSnackbar, setOpenSnackbar] = useState(false);
//     const [editingDescription, setEditingDescription] = useState(false);
//     const [editedDescription, setEditedDescription] = useState('');

//     const { data: apiDetails, isLoading, error } = useQuery(['apiDetails', apiId], async () => {
//         const response = await axiosPrivate.get(`http://localhost:8081/api/getapi/${apiId}`);
//         // const response = await axiosPrivate.get(`/getapi/${apiId}`);
//         return response.data;
//     });

//     const handleSnackbarClose = (event, reason) => {
//         if (reason === 'clickaway') return;
//         setOpenSnackbar(false);
//     };

//     const handleUpload = () => {
//         setOpenSnackbar(true);
//         setOpen(false);
//     };

//     const onDrop = (acceptedFiles) => {
//         const file = acceptedFiles[0];
//         const reader = new FileReader();
//         reader.onload = (event) => {
//             setUploadedImage(event.target.result);
//         };
//         reader.readAsDataURL(file);
//     };

//     const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

//     const getBearerToken = async () => {
//         try {
//             const response = await axiosPrivate.get(
//                 "http://localhost:8083/token",
//                 // "/token",
//                 null,
//                 { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
//             );
//             return response.data.access_token;
//         } catch (error) {
//             console.error("Error fetching Bearer token:", error.response?.data || error.message);
//             throw new Error("Failed to obtain Bearer token");
//         }
//     };

//     const handleUpdateDescription = async () => {
//         if (!apiId) {
//             alert("API ID is missing. Unable to update.");
//             return;
//         }

//         try {
//             const token = await getBearerToken();
//             const updatedData = {
//                 name: apiDetails?.name || "Default API Name",
//                 description: editedDescription || apiDetails?.description || "No description available",
//                 context: apiDetails?.context || "/default-context",
//                 version: apiDetails?.version || "1.0.0",
//                 provider: apiDetails?.provider || "default-provider",
//                 lifeCycleStatus: apiDetails?.lifeCycleStatus || "PUBLISHED",
//                 operations: apiDetails?.operations || []
//             };

//             await axiosPrivate.put(
//                 `http://localhost:8085/api/${apiId}`,
//                 // `/${apiId}`,
//                 updatedData,
//                 { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
//             );

//             alert("API details updated successfully!");
//             setEditingDescription(false);
//         } catch (error) {
//             console.error("Error updating API:", error.response?.data || error.message);
//             alert("Error updating API details");
//         }
//     };

//     if (isLoading) return (
//         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//             <CircularProgress />
//         </Box>
//     );
//     if (error) return <div>Error fetching API details: {error.message}</div>;

//     return (

//         <Box sx={{ p: 3, backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
//             <div className='flex mb-6'>
//                 <Paper sx={{
//                     flex: 1,
//                     borderRadius: 3,
//                     backgroundColor: '#ffffff',
//                     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//                 }}>
//                     <div className="w-full max-w-[1200px] rounded-xl bg-white shadow-[0_4px_8px_rgba(0,0,0,0.1)] overflow-hidden">
//                         <div className="flex items-center min-h-12 px-4 bg-amber-100">
//                             <Security className="text-gray-400 mr-2" />
//                             <h6 className="text-lg font-semibold">Security & Access</h6>
//                         </div>
//                         <div className="p-4">
//                             <p className="text-sm">
//                                 <span className="font-bold">Authorization Header:</span> {apiDetails.authorizationHeader}
//                             </p>
//                             <div className="flex flex-wrap gap-2 mt-2">
//                                 {apiDetails.securityScheme?.map((scheme, index) => (
//                                     <span
//                                         key={index}
//                                         className="px-3 py-1 text-sm text-white bg-green-600 rounded-full"
//                                     >
//                                         {scheme}
//                                     </span>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </Paper>

//                 <div className='flex items-center'>
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         startIcon={<CloudUpload />}
//                         onClick={() => setOpen(true)}
//                         sx={{
//                             height: '48px',
//                             marginLeft: 2
//                         }}
//                     >
//                         Upload Details
//                     </Button>
//                 </div>


//             </div>

//             {/* General Information Card */}
//             <Card sx={{ mb: 3, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
//                 <CardContent>
//                     <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
//                         General Information
//                     </Typography>
//                     <Box sx={{
//                         display: 'grid',
//                         gridTemplateColumns: '150px 1fr',
//                         gap: 2,
//                         alignItems: 'center',
//                         textAlign: 'left'
//                     }}>
//                         <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.secondary' }}>
//                             Name:
//                         </Typography>
//                         <Typography sx={{ textAlign: 'left' }}>{apiDetails.name}</Typography>

//                         <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.secondary' }}>
//                             Description:
//                         </Typography>
//                         <Box sx={{ position: 'relative', textAlign: 'left' }}>
//                             {isAdmin && editingDescription ? (
//                                 <Box>
//                                     <TextField
//                                         label="Description"
//                                         value={editedDescription || apiDetails.description}
//                                         onChange={(e) => setEditedDescription(e.target.value)}
//                                         fullWidth
//                                         multiline
//                                         minRows={3}
//                                         maxRows={8}
//                                         variant="outlined"
//                                         sx={{ textAlign: 'left' }}
//                                     />
//                                     <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1, gap: 1 }}>
//                                         <Button
//                                             variant="outlined"
//                                             onClick={() => setEditingDescription(false)}
//                                         >
//                                             Cancel
//                                         </Button>
//                                         <Button
//                                             variant="contained"
//                                             color="primary"
//                                             onClick={handleUpdateDescription}
//                                         >
//                                             Save
//                                         </Button>
//                                     </Box>
//                                 </Box>
//                             ) : (
//                                 <Box sx={{ position: 'relative', pr: isAdmin ? '32px' : '0', textAlign: 'left' }}>
//                                     <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
//                                         {apiDetails.description || "No description available"}
//                                     </Typography>
//                                     {isAdmin && !editingDescription && (
//                                         <IconButton
//                                             onClick={() => setEditingDescription(true)}
//                                             size="small"
//                                             sx={{
//                                                 position: 'absolute',
//                                                 right: -10,
//                                                 top: 0,
//                                                 backgroundColor: 'rgba(0, 121, 107, 0.1)',
//                                                 '&:hover': { backgroundColor: 'rgba(0, 121, 107, 0.2)' }
//                                             }}
//                                         >
//                                             <Edit fontSize="small" sx={{ color: 'primary.main' }} />
//                                         </IconButton>
//                                     )}
//                                 </Box>
//                             )}
//                         </Box>

//                         {[
//                             { label: 'Provider', value: apiDetails.provider },
//                             { label: 'Type', value: apiDetails.type },
//                             { label: 'Version', value: apiDetails.version },
//                             { label: 'Status', value: apiDetails.lifeCycleStatus },
//                             { label: 'Visibility', value: apiDetails.visibility }
//                         ].map((item, index) => (
//                             <React.Fragment key={index}>
//                                 <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.secondary' }}>
//                                     {item.label}:
//                                 </Typography>
//                                 <Typography sx={{ textAlign: 'left' }}>{item.value}</Typography>
//                             </React.Fragment>
//                         ))}
//                     </Box>
//                 </CardContent>
//             </Card>
//             {/* Operations Card */}
//             <Card sx={{ mb: 3, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
//                 <CardContent>
//                     <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
//                         Operations
//                     </Typography>
//                     {apiId && endpoint && (
//                         <Box sx={{ maxHeight: '500px', overflow: 'auto' }}>
//                             <ApiView apiId={apiId} endpoint={endpoint} />
//                         </Box>
//                     )}
//                 </CardContent>
//             </Card>

//             {/* Endpoints Card */}
//             <Card sx={{ mb: 3, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
//                 <CardContent>
//                     <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
//                         Endpoints
//                     </Typography>
//                     <Typography variant="body2" gutterBottom sx={{ fontWeight: 600 }}>
//                         Sandbox Endpoint:
//                     </Typography>
//                     <Box sx={{ p: 2, backgroundColor: '#e8f5e9', mb: 2, borderRadius: 1 }}>
//                         <Typography fontFamily="monospace">
//                             {apiDetails.endpointConfig?.sandbox_endpoints?.url || 'N/A'}
//                         </Typography>
//                     </Box>
//                     <Typography variant="body2" gutterBottom sx={{ fontWeight: 600 }}>
//                         Production Endpoint:
//                     </Typography>
//                     <Box sx={{ p: 2, backgroundColor: '#e8f5e9', borderRadius: 1 }}>
//                         <Typography fontFamily="monospace">
//                             {apiDetails.endpointConfig?.production_endpoints?.url || 'N/A'}
//                         </Typography>
//                     </Box>
//                 </CardContent>
//             </Card>

//             {/* API Flow Card (if image uploaded) */}
//             {uploadedImage && (
//                 <Card sx={{ mb: 3, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
//                     <CardContent>
//                         <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
//                             API Architecture Flow
//                         </Typography>
//                         <Box sx={{ display: 'flex', justifyContent: 'center' }}>
//                             <img
//                                 src={uploadedImage}
//                                 alt="API Architecture"
//                                 style={{ maxWidth: '100%', borderRadius: 8 }}
//                             />
//                         </Box>
//                     </CardContent>
//                 </Card>
//             )}

//             {/* Upload Modal (keep exactly the same) */}
//             <Modal open={open} onClose={() => setOpen(false)}>
//                 <Box sx={{
//                     position: 'absolute',
//                     top: '50%',
//                     left: '50%',
//                     transform: 'translate(-50%, -50%)',
//                     width: 400,
//                     bgcolor: 'background.paper',
//                     boxShadow: 24,
//                     p: 4,
//                     borderRadius: 2
//                 }}>
//                     <Typography variant="h6" sx={{ mb: 2 }}>Upload API Architecture Image</Typography>
//                     <Box {...getRootProps()} sx={{
//                         border: '2px dashed #90caf9',
//                         p: 4,
//                         textAlign: 'center',
//                         backgroundColor: '#e3f2fd',
//                         cursor: 'pointer',
//                         borderRadius: 1
//                     }}>
//                         <input {...getInputProps()} />
//                         <Typography>Drag and drop an image here, or click to select one</Typography>
//                     </Box>
//                     {uploadedImage && (
//                         <Box sx={{ mt: 2, height: 300, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 1 }}>
//                             <Typography variant="body2" sx={{ position: 'absolute', top: 8, left: 8 }}>Preview:</Typography>
//                             <img src={uploadedImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
//                         </Box>
//                     )}
//                     <Button
//                         variant="contained"
//                         fullWidth
//                         sx={{ mt: 2 }}
//                         onClick={handleUpload}
//                         disabled={!uploadedImage}
//                     >
//                         Upload
//                     </Button>
//                 </Box>
//             </Modal>

//             <Snackbar
//                 open={openSnackbar}
//                 autoHideDuration={3000}
//                 onClose={handleSnackbarClose}
//                 anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//             >
//                 <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
//                     Image uploaded successfully!
//                 </Alert>
//             </Snackbar>
//         </Box>
//     );
// };

// export default ApiDetailsPage;