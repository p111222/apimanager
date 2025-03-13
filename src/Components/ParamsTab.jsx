import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";

const ParamsTab = ({ apiDetails }) => {
  const [queryParams, setQueryParams] = useState([]);
  const [pathParams, setPathParams] = useState([]);
  const [cookieParams, setCookieParams] = useState([]);

  // Initialize parameters from apiDetails
  useEffect(() => {
    if (apiDetails) {
      const endpoint = Object.keys(apiDetails.paths)[0];
      const operation = apiDetails.paths[endpoint]?.post || apiDetails.paths[endpoint]?.get;

      const queryParamsFromApi = operation?.parameters?.filter((param) => param.in === "query") || [];
      const pathParamsFromApi = operation?.parameters?.filter((param) => param.in === "path") || [];
      const cookieParamsFromApi = operation?.parameters?.filter((param) => param.in === "cookie") || [];

      const formattedQueryParams = queryParamsFromApi.map((param) => ({
        key: param.name,
        value: param.schema?.example || "",
      }));

      const formattedPathParams = pathParamsFromApi.map((param) => ({
        key: param.name,
        value: param.schema?.example || "",
      }));

      const formattedCookieParams = cookieParamsFromApi.map((param) => ({
        key: param.name,
        value: param.schema?.example || "",
      }));

      setQueryParams(formattedQueryParams);
      setPathParams(formattedPathParams);
      setCookieParams(formattedCookieParams);
    }
  }, [apiDetails]);

  const handleInputChange = (index, field, value, type) => {
    const newParams =
      type === "query" ? [...queryParams] :
      type === "path" ? [...pathParams] :
      [...cookieParams];

    newParams[index][field] = value;

    if (type === "query") setQueryParams(newParams);
    else if (type === "path") setPathParams(newParams);
    else setCookieParams(newParams);
  };

  const addParam = (type) => {
    const newParam = { key: "", value: "" };
    if (type === "query") setQueryParams([...queryParams, newParam]);
    else if (type === "path") setPathParams([...pathParams, newParam]);
    else setCookieParams([...cookieParams, newParam]);
  };

  const removeParam = (index, type) => {
    const newParams =
      type === "query" ? queryParams.filter((_, i) => i !== index) :
      type === "path" ? pathParams.filter((_, i) => i !== index) :
      cookieParams.filter((_, i) => i !== index);

    if (type === "query") setQueryParams(newParams);
    else if (type === "path") setPathParams(newParams);
    else setCookieParams(newParams);
  };

  // Function to render each parameter section
  const renderParams = (title, params, type) => (
    <Accordion
      defaultExpanded
      sx={{
        backgroundColor: "#f5f5f5",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
        borderRadius: "8px",
        marginTop: "20px",
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: "#f5f5f5" }}>
        <Typography variant="h6" fontWeight="bold">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {params.length > 0 ? (
          params.map((param, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              <TextField
                label="Key"
                variant="outlined"
                size="small"
                value={param.key}
                onChange={(e) => handleInputChange(index, "key", e.target.value, type)}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Value"
                variant="outlined"
                size="small"
                value={param.value}
                onChange={(e) => handleInputChange(index, "value", e.target.value, type)}
                sx={{ flex: 1 }}
              />
              <IconButton color="error" onClick={() => removeParam(index, type)}>
                <DeleteIcon />
              </IconButton>
            </div>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No {title.toLowerCase()} available.
          </Typography>
        )}
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => addParam(type)}
          sx={{ marginTop: "10px" }}
        >
          Add {title.replace(" Parameters", "")} Param
        </Button>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <div style={{ padding: "0px", maxWidth: "600px" }}>
      {renderParams("Query Parameters", queryParams, "query")}
      {renderParams("Path Parameters", pathParams, "path")}
      {renderParams("Cookie Parameters", cookieParams, "cookie")}
    </div>
  );
};

export default ParamsTab;
