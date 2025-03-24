import React, { useContext, useEffect, useState } from 'react';
import {
    Typography, Box, Chip, Paper, Divider,
    Accordion, AccordionSummary, AccordionDetails,
    Button, Modal,
    TextField,
    IconButton
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDropzone } from 'react-dropzone';
import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
import { Info, Security, Storage, Settings, CloudUpload } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ApiView from './ApiView';
import { ApiEndpointContext } from '../../Context/ApiEndpointContext';
import { AuthContext } from '../../Context/AuthContext';
import EditIcon from "@mui/icons-material/Edit";

const ApiDetailsPage = () => {
    // const { apiId } = useParams();
    const { user } = useContext(AuthContext);
    const isAdmin = user?.roles?.includes("admin");
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const { apiId } = useParams();
    const { endpoint } = useContext(ApiEndpointContext);
    const [editingDescription, setEditingDescription] = useState(false);
    const [editedDescription, setEditedDescription] = useState('');
    const { activeTab, setActiveTab } = useContext(ApiEndpointContext);
    const [expanded, setExpanded] = useState('');

    useEffect(() => {
        if (activeTab === 'operations') {
            setExpanded('operations');
        }
    }, [activeTab]);

    console.log("expanded"+ expanded);
    

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleUpload = () => {
        setOpenSnackbar(true);
        handleClose();
    };


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            setUploadedImage(event.target.result);
        };
        reader.readAsDataURL(file);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

    const { data: apiDetails, isLoading, error } = useQuery(['apiDetails', apiId], async () => {
        // const response = await axiosPrivate.get(`http://localhost:8081/api/getapi/${apiId}`);
        const response = await axiosPrivate.get(`/getapi/${apiId}`);
        return response.data;
    });

    // if (isLoading) return <div>Loading...</div>;
    if (isLoading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </Box>
    );
    if (error) return <div>Error fetching API details: {error.message}</div>;

    const getBearerToken = async () => {
        try {
            const response = await axiosPrivate.get(
                // "http://localhost:8083/token",
                "/token",  
                null,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );
            console.log("Generated Bearer Token:", response.data.access_token);  // Print the token
            return response.data.access_token;
        } catch (error) {
            console.error("Error fetching Bearer token:", error.response?.data || error.message);
            throw new Error("Failed to obtain Bearer token");
        }
    };

    const handleUpdateDescription = async () => {
        if (!apiId) {
            console.error("API ID is not available.");
            alert("API ID is missing. Unable to update.");
            return;
        }

        try {
            const token = await getBearerToken();

            // Fallback values for essential fields
            const name = apiDetails?.name || "Default API Name";
            const version = apiDetails?.version || "1.0.0";
            const context = apiDetails?.context || "/default-context";
            const provider = apiDetails?.provider || "default-provider";
            const lifeCycleStatus = apiDetails?.lifeCycleStatus || "PUBLISHED";
            const description = editedDescription || apiDetails?.description || "No description available"; // Use edited description if available

            // Extracting operations from apiDetails.operations
            const operations = apiDetails?.operations || [];

            // If no valid operations are found, handle gracefully
            if (operations.length === 0) {
                console.error("No valid operations found for the API.");
                alert("API must have at least one resource (path and method) defined.");
                return;  // Stop the update if no valid operations are present
            }

            const updatedData = {
                name,
                description,
                context,
                version,
                provider,
                lifeCycleStatus,
                operations,
            };

            console.log("Updated Data Payload:", updatedData);

            // Send PUT request to update API details
            const response = await axiosPrivate.put(
                // `https://api.kriate.co.in:8344/api/am/publisher/v4/apis/${apiId}`,
                `/am/publisher/v4/apis/${apiId}`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("API Updated Successfully:", response.data);
            alert("API details updated successfully!");

            setEditingDescription(false);  // Close the editing mode

            // Optionally, you can fetch the updated API details here
            // const updatedApiDetails = await axiosPrivate.get(`https://api.kriate.co.in:8344/api/am/publisher/v4/apis/${apiId}`);
            // setApiDetails(updatedApiDetails.data);

        } catch (error) {
            console.error("Error updating API:", error.response?.data || error.message);
            alert("Error updating API details");
        }
    };


    const handleTargetClick = (path, apiId) => {
        const pathPrefix = window.location.pathname.startsWith("/admin") ? "admin" : "user";
        if (path && apiId) {
            navigate(`/${pathPrefix}/apiview?endpoint=${encodeURIComponent(path)}&apiId=${encodeURIComponent(apiId)}`);
        }
    };

    return (
        <Box
            sx={{
                padding: 4,
                backgroundColor: '#f5f7fa',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                gap: 3
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: 1200
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        marginBottom: 2,
                        textAlign: 'left',
                        color: '#00796b',
                        fontSize: '28px'
                    }}
                >
                    API Details - {apiDetails.name}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CloudUpload />}
                    onClick={handleOpen}
                >
                    Upload Architecture
                </Button>
            </Box>

            {/* Upload Image Modal */}
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 2 }}>Upload API Architecture Image</Typography>
                    <Box
                        {...getRootProps()}
                        sx={{
                            border: '2px dashed #90caf9',
                            padding: 4,
                            textAlign: 'center',
                            backgroundColor: '#e3f2fd',
                            cursor: 'pointer',
                            borderRadius: 1
                        }}
                    >
                        <input {...getInputProps()} />
                        <Typography>Drag and drop an image here, or click to select one</Typography>
                    </Box>
                    {uploadedImage && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2">Preview:</Typography>
                            <img
                                src={uploadedImage}
                                alt="Preview"
                                style={{ width: '100%', borderRadius: 8, marginTop: 8 }}
                            />
                        </Box>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={handleUpload}
                        fullWidth
                    >
                        Upload
                    </Button>
                </Box>
            </Modal>

            <Paper
                elevation={3}
                sx={{
                    width: '100%',
                    maxWidth: 1200,
                    padding: 3,
                    borderRadius: 3,
                    backgroundColor: '#ffffff',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
            >

                <Accordion defaultExpanded onChange={handleAccordionChange('general')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                            backgroundColor: '#e0f2f1',
                            borderRadius: 1,
                            padding: '12px 20px',
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                            '&:hover': {
                                backgroundColor: '#b2dfdb', // Slight hover effect
                            },
                        }}
                    >
                        <Info color="primary" sx={{ marginRight: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '18px' }}>
                            General Information
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ padding: '16px 20px' }}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                <strong>Name:</strong> {apiDetails.name}
                            </Typography>
                        </Box>

                        {/* Description Section */}
                        <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
                            {isAdmin && editingDescription ? (
                                <>
                                    <TextField
                                        label="Description"
                                        value={editedDescription || apiDetails.description}
                                        onChange={(e) => setEditedDescription(e.target.value)}
                                        fullWidth
                                        multiline
                                        maxRows={4}
                                        variant="outlined"
                                        sx={{
                                            backgroundColor: '#ffffff',
                                            borderRadius: 1,
                                            '& .MuiOutlinedInput-root': {
                                                borderColor: '#90caf9',
                                            },
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleUpdateDescription}
                                        sx={{ ml: 2, height: '100%' }}
                                    >
                                        Update
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                                        {apiDetails.description || "No description available"}
                                    </Typography>
                                    {isAdmin && !editingDescription && (
                                        <IconButton
                                            onClick={() => setEditingDescription(true)}
                                            size="small"
                                            sx={{ ml: 1 }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    )}
                                </>
                            )}
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                <strong>Provider:</strong> {apiDetails.provider}
                            </Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                <strong>Type:</strong> {apiDetails.type}
                            </Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                <strong>Version:</strong> {apiDetails.version}
                            </Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                <strong>Status:</strong> {apiDetails.lifeCycleStatus}
                            </Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                <strong>Visibility:</strong> {apiDetails.visibility}
                            </Typography>
                        </Box>
                    </AccordionDetails>
                </Accordion>


                <Divider sx={{ marginY: 2 }} />

                {uploadedImage && (
                    <>
                        <Accordion defaultExpanded onChange={handleAccordionChange('apiFlow')}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#e1f5fe' }}>
                                <Settings color="info" sx={{ marginRight: 1 }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>API Architecture Flow</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <img
                                        src={uploadedImage}
                                        alt="API Architecture"
                                        style={{ maxWidth: '100%', borderRadius: 8 }}
                                    />
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                        <Divider sx={{ marginY: 2 }} />
                    </>
                )}

                <Divider sx={{ marginY: 2 }} />

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#e3f2fd' }}>
                        <Storage color="secondary" sx={{ marginRight: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Endpoints</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="body2"><strong>Sandbox Endpoint:</strong></Typography>
                        <Paper sx={{ padding: 1, backgroundColor: '#e8f5e9', marginBottom: 1 }}>
                            {apiDetails.endpointConfig?.sandbox_endpoints?.url || 'N/A'}
                        </Paper>
                        <Typography variant="body2"><strong>Production Endpoint:</strong></Typography>
                        <Paper sx={{ padding: 1, backgroundColor: '#e8f5e9' }}>
                            {apiDetails.endpointConfig?.production_endpoints?.url || 'N/A'}
                        </Paper>
                    </AccordionDetails>
                </Accordion>

                <Divider sx={{ marginY: 2 }} />

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#ffecb3' }}>
                        <Security color="action" sx={{ marginRight: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Security & Access</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="body2"><strong>Authorization Header:</strong> {apiDetails.authorizationHeader}</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginTop: 1 }}>
                            {apiDetails.securityScheme?.map((scheme, index) => (
                                <Chip key={index} label={scheme} color="primary" />
                            ))}
                        </Box>
                    </AccordionDetails>
                </Accordion>

                <Divider sx={{ marginY: 2 }} />

                <Accordion defaultExpanded={Boolean(apiId && endpoint)} onChange={handleAccordionChange('operations')} expanded={expanded === 'operations'}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#ffebee' }}>
                        <Settings color="success" sx={{ marginRight: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Operations</Typography>
                    </AccordionSummary>
                    <AccordionDetails style={{ maxHeight: '500px', overflow: 'auto' }}>
                        {apiId && endpoint && (
                            <ApiView apiId={apiId} endpoint={endpoint} />
                        )}
                    </AccordionDetails>
                </Accordion>

            </Paper>

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
};

export default ApiDetailsPage;

