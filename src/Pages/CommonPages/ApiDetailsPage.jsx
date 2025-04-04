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
    const operationsAccordionRef = React.useRef(null);

    // useEffect(() => {
    //     if (apiId && endpoint && operationsAccordionRef.current) {
    //         setTimeout(() => {
    //             operationsAccordionRef.current.scrollIntoView({
    //                 behavior: 'smooth',
    //                 block: 'center'
    //             });
    //             setExpanded('operations');
    //         }, 100);
    //     }
    // }, [apiId, endpoint]);

    useEffect(() => {
        if (apiId && endpoint && operationsAccordionRef.current) {
            setTimeout(() => {
                operationsAccordionRef.current?.scrollIntoView({ // Added optional chaining
                    behavior: 'smooth',
                    block: 'center'
                });
                setExpanded('operations');
            }, 100);
        }
    }, [apiId, endpoint]);


    useEffect(() => {
        if (activeTab === 'operations') {
            setExpanded('operations');
        }
    }, [activeTab]);

    console.log("expanded" + expanded);


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
        const response = await axiosPrivate.get(`http://localhost:8081/api/getapi/${apiId}`);
        // const response = await axiosPrivate.get(`/getapi/${apiId}`);
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
                "http://localhost:8083/token",
                // "/token",  
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
            // `/am/publisher/v4/apis/${apiId}`,
            const response = await axiosPrivate.put(
                // `https://api.kriate.co.in:8344/api/am/publisher/v4/apis/${apiId}`,
                `http://localhost:8085/api/${apiId}`,
                // `/${apiId}`,
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
                    Upload Details
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
                        maxHeight: '80vh', // Limit modal height
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden' // Ensure content doesn't overflow modal
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
                            borderRadius: 1,
                            flexShrink: 0 // Prevent dropzone from shrinking
                        }}
                    >
                        <input {...getInputProps()} />
                        <Typography>Drag and drop an image here, or click to select one</Typography>
                    </Box>
                    {uploadedImage && (
                        <Box sx={{
                            mt: 2,
                            height: 300, // Fixed height for preview container
                            overflow: 'auto', // Add scroll for large images
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'flex-start' // Align to top for tall images
                        }}>
                            <Typography variant="body2" sx={{ position: 'absolute', top: 8, left: 8 }}>Preview:</Typography>
                            <img
                                src={uploadedImage}
                                alt="Preview"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain' // Maintain aspect ratio
                                }}
                            />
                        </Box>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{
                            mt: 2,
                            flexShrink: 0 // Keep button at bottom
                        }}
                        onClick={handleUpload}
                        fullWidth
                        disabled={!uploadedImage} // Disable if no image
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

                <Accordion
                    defaultExpanded
                    onChange={handleAccordionChange('general')}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#e1f5fe' }}
                    >
                        <Info color="primary" sx={{
                            marginRight: 1,
                            // fontSize: '28px',
                            color: '#00796b'
                        }} />
                        <Typography
                            variant="h6" sx={{ fontWeight: 600 }}
                        >
                            General Information
                        </Typography>
                    </AccordionSummary>

                    <AccordionDetails sx={{
                        padding: '24px 32px',
                        backgroundColor: '#f5f5f5',
                        borderTop: '1px solid #e0e0e0'
                    }}>
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: 'minmax(120px, max-content) 1fr',
                            gap: '12px 8px',
                            alignItems: 'baseline',
                        }}>
                            <Typography variant="body1" sx={{
                                fontWeight: 500,
                                color: '#00796b',
                                alignSelf: 'center',
                                textAlign: 'left',
                                display: 'block',
                            }}>
                                Name:
                            </Typography>
                            <Typography variant="body1" sx={{
                                color: '#424242',
                                paddingLeft: '4px',
                                textAlign: 'left',
                                display: 'block',
                            }}>
                                {apiDetails.name}
                            </Typography>

                            <Typography variant="body1" sx={{
                                fontWeight: 500,
                                color: '#00796b',
                                alignSelf: 'flex-start',
                                pt: 1,
                                textAlign: 'left',
                                display: 'block',
                            }}>
                                Description:
                            </Typography>
                            <Box sx={{
                                position: 'relative',
                                paddingLeft: '4px' // Reduced padding to move the value closer
                            }}>
                                {isAdmin && editingDescription ? (
                                    <Box>
                                        <TextField
                                            label="Description"
                                            value={editedDescription || apiDetails.description}
                                            onChange={(e) => setEditedDescription(e.target.value)}
                                            fullWidth
                                            multiline
                                            minRows={3}
                                            maxRows={8}
                                            variant="outlined"
                                            sx={{
                                                backgroundColor: '#ffffff',
                                                borderRadius: '8px',
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: '#b2dfdb',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#00796b',
                                                    },
                                                },
                                            }}
                                        />
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, gap: 1 }}>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => setEditingDescription(false)}
                                                sx={{
                                                    textTransform: 'none',
                                                    color: '#00796b',
                                                    borderColor: '#00796b'
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleUpdateDescription}
                                                sx={{
                                                    textTransform: 'none',
                                                    backgroundColor: '#00796b',
                                                    '&:hover': {
                                                        backgroundColor: '#00695c',
                                                    },
                                                }}
                                            >
                                                Save
                                            </Button>
                                        </Box>
                                    </Box>
                                ) : (
                                    <Box sx={{
                                        position: 'relative',
                                        paddingRight: isAdmin ? '32px' : '0'
                                    }}>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                // marginLeft: '35px',
                                                whiteSpace: 'pre-wrap',
                                                wordBreak: 'break-word',
                                                lineHeight: '1.8',
                                                color: '#424242',
                                                textAlign: 'left',
                                                display: 'block',
                                            }}
                                        >
                                            {apiDetails.description || "No description available"}
                                        </Typography>
                                        {isAdmin && !editingDescription && (
                                            <IconButton
                                                onClick={() => setEditingDescription(true)}
                                                size="small"
                                                sx={{
                                                    position: 'absolute',
                                                    right: '-10px',
                                                    top: 0,
                                                    backgroundColor: 'rgba(0, 121, 107, 0.1)',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(0, 121, 107, 0.2)',
                                                    },
                                                }}
                                            >
                                                <EditIcon fontSize="small" sx={{ color: '#00796b' }} />
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
                                    <Typography variant="body1" sx={{
                                        fontWeight: 500,
                                        color: '#00796b',
                                        alignSelf: 'center',
                                        textAlign: 'left',
                                        display: 'block',
                                    }}>
                                        {item.label}:
                                    </Typography>
                                    <Typography variant="body1" sx={{
                                        color: '#424242',
                                        paddingLeft: '4px',
                                        textAlign: 'left',
                                        display: 'block',
                                    }}>
                                        {item.value}
                                    </Typography>
                                </React.Fragment>
                            ))}
                        </Box>

                    </AccordionDetails>
                </Accordion>



                {uploadedImage && (
                    <>
                        <Divider sx={{ marginY: 2 }} />
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

                <Accordion defaultExpanded={Boolean(apiId && endpoint)} onChange={handleAccordionChange('operations')} expanded={expanded === 'operations'} ref={operationsAccordionRef}>
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

