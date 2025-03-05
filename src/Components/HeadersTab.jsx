import React, { useState } from "react";
import { TextField, Button, Typography, IconButton, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";

const HeadersTab = () => {
    const [headers, setHeaders] = useState([{ key: "", value: "" }]);

    const handleInputChange = (index, field, value) => {
        const newHeaders = [...headers];
        newHeaders[index][field] = value;
        setHeaders(newHeaders);
    };

    const addHeader = () => {
        setHeaders([...headers, { key: "", value: "" }]);
    };

    const removeHeader = (index) => {
        const newHeaders = headers.filter((_, i) => i !== index);
        setHeaders(newHeaders);
    };

    return (
        <div style={{ padding: "0px", maxWidth: "600px" }}>
            <Accordion defaultExpanded sx={{ backgroundColor: "#f5f5f5", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", borderRadius: "8px" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: "#f5f5f5" }}>
                    <Typography variant="h6" fontWeight="bold">Request Headers</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {headers.map((header, index) => (
                        <div key={index} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                            <TextField
                                label="Header Name"
                                variant="outlined"
                                size="small"
                                value={header.key}
                                onChange={(e) => handleInputChange(index, "key", e.target.value)}
                                sx={{ flex: 1 }}
                            />
                            <TextField
                                label="Header Value"
                                variant="outlined"
                                size="small"
                                value={header.value}
                                onChange={(e) => handleInputChange(index, "value", e.target.value)}
                                sx={{ flex: 1 }}
                            />
                            <IconButton color="error" onClick={() => removeHeader(index)}>
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    ))}
                    <Button
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={addHeader}
                        sx={{ marginTop: "10px" }}
                    >
                        Add Header
                    </Button>
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export default HeadersTab;
