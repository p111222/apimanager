import React, { useState } from "react";
import { TextField, Button, Typography, IconButton, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";

const ParamsTab = () => {
  const [queryParams, setQueryParams] = useState([{ key: "", value: "" }]);
  const [pathParams, setPathParams] = useState([{ key: "", value: "" }]);

  const handleInputChange = (index, field, value, type) => {
    const newParams = type === "query" ? [...queryParams] : [...pathParams];
    newParams[index][field] = value;
    type === "query" ? setQueryParams(newParams) : setPathParams(newParams);
  };

  const addParam = (type) => {
    type === "query"
      ? setQueryParams([...queryParams, { key: "", value: "" }])
      : setPathParams([...pathParams, { key: "", value: "" }]);
  };

  const removeParam = (index, type) => {
    const newParams = type === "query"
      ? queryParams.filter((_, i) => i !== index)
      : pathParams.filter((_, i) => i !== index);

    type === "query" ? setQueryParams(newParams) : setPathParams(newParams);
  };

  return (
    <div style={{ padding: "0px", maxWidth: "600px" }}>

      <Accordion defaultExpanded sx={{ backgroundColor: "#f5f5f5", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", borderRadius: "8px" }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: "#f5f5f5" }}>
          <Typography variant="h6" fontWeight="bold">Query Parameters</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {queryParams.map((param, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <TextField
                label="Key"
                variant="outlined"
                size="small"
                value={param.key}
                onChange={(e) => handleInputChange(index, "key", e.target.value, "query")}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Value"
                variant="outlined"
                size="small"
                value={param.value}
                onChange={(e) => handleInputChange(index, "value", e.target.value, "query")}
                sx={{ flex: 1 }}
              />
              <IconButton color="error" onClick={() => removeParam(index, "query")}>
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => addParam("query")}
            sx={{ marginTop: "10px" }}
          >
            Add Query Param
          </Button>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded sx={{ backgroundColor: "#f5f5f5", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", borderRadius: "8px",marginTop: "20px"  }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: "#f5f5f5" }}>
          <Typography variant="h6" fontWeight="bold">Path Parameters</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {pathParams.map((param, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <TextField
                label="Key"
                variant="outlined"
                size="small"
                value={param.key}
                onChange={(e) => handleInputChange(index, "key", e.target.value, "path")}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Value"
                variant="outlined"
                size="small"
                value={param.value}
                onChange={(e) => handleInputChange(index, "value", e.target.value, "path")}
                sx={{ flex: 1 }}
              />
              <IconButton color="error" onClick={() => removeParam(index, "path")}>
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => addParam("path")}
            sx={{ marginTop: "10px" }}
          >
            Add Path Param
          </Button>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default ParamsTab;
