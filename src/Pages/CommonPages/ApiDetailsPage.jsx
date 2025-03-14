import React from 'react';
import { Typography, Box, Chip, Paper, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useAxiosPrivate from "../../Hooks/useAxiosPrivate";
import { Info, Security, Storage, Settings } from '@mui/icons-material';

const ApiDetailsPage = () => {
    const { apiId } = useParams();
    const axiosPrivate = useAxiosPrivate();
    console.log("apiId: " + apiId);

    const { data: apiDetails, isLoading, error } = useQuery(['apiDetails', apiId], async () => {
        const response = await axiosPrivate.get(`http://localhost:8081/api/getapi/${apiId}`);
        return response.data;
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching API details: {error.message}</div>;

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
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 'bold',
                    marginBottom: 2,
                    textAlign: 'left',
                    color: '#00796b',
                    width: '100%',
                    maxWidth: 1200,
                    fontSize: '28px'
                }}
            >
                API Details - {apiDetails.name}
            </Typography>

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
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#f1f8e9' }}>
                        <Info color="primary" sx={{ marginRight: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>General Information</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="body1"><strong>Name:</strong> {apiDetails.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{apiDetails.description || 'No description available.'}</Typography>
                        <Typography variant="body2"><strong>Provider:</strong> {apiDetails.provider}</Typography>
                        <Typography variant="body2"><strong>Type:</strong> {apiDetails.type}</Typography>
                        <Typography variant="body2"><strong>Version:</strong> {apiDetails.version}</Typography>
                        <Typography variant="body2"><strong>Status:</strong> {apiDetails.lifeCycleStatus}</Typography>
                        <Typography variant="body2"><strong>Visibility:</strong> {apiDetails.visibility}</Typography>
                    </AccordionDetails>
                </Accordion>

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

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#ffebee' }}>
                        <Settings color="success" sx={{ marginRight: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Operations</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {apiDetails.operations?.map((operation, index) => (
                            <Box key={index} sx={{ marginBottom: 1, padding: 1.5, backgroundColor: '#f1f8e9', borderRadius: 1 }}>
                                <Typography variant="body1"><strong>Target:</strong> {operation.target}</Typography>
                                <Typography variant="body2" color="text.secondary">Method: {operation.verb}</Typography>
                                <Typography variant="body2" color="text.secondary">Auth Type: {operation.authType}</Typography>
                                <Typography variant="body2" color="text.secondary">Throttling Policy: {operation.throttlingPolicy}</Typography>
                            </Box>
                        ))}
                    </AccordionDetails>
                </Accordion>
            </Paper>
        </Box>
    );
};

export default ApiDetailsPage;
