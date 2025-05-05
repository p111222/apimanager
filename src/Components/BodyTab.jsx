// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Tabs,
//   Tab,
//   TextField,
//   IconButton,
//   Typography
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

// const BodyTab = ({ apiDetails }) => {
//   const [bodyType, setBodyType] = useState("json");
//   const [jsonBody, setJsonBody] = useState("");
//   const [formFields, setFormFields] = useState([{ key: "", value: "" }]);

//   useEffect(() => {
//     if (apiDetails) {
//       const endpoint = Object.keys(apiDetails.paths)[0];
//       const operation = apiDetails.paths[endpoint].post || apiDetails.paths[endpoint].get;
//       const requestBody = operation?.requestBody?.content || {};

//       // Check if JSON body exists
//       if (requestBody["application/json"]) {
//         const jsonSchema = requestBody["application/json"].schema?.properties || {};
//         const jsonObject = Object.keys(jsonSchema).reduce((obj, key) => {
//           obj[key] = jsonSchema[key].example || "";
//           return obj;
//         }, {});
//         setJsonBody(JSON.stringify(jsonObject, null, 2));
//         setBodyType("json");
//       }

//       // Check if form-data or url-encoded exists
//       if (requestBody["multipart/form-data"] || requestBody["application/x-www-form-urlencoded"]) {
//         const formSchema = (requestBody["multipart/form-data"] || requestBody["application/x-www-form-urlencoded"]).schema?.properties || {};
//         const formFieldsArray = Object.keys(formSchema).map((key) => ({
//           key: key,
//           value: formSchema[key].example || ""
//         }));
//         setFormFields(formFieldsArray);
//         setBodyType(requestBody["multipart/form-data"] ? "formData" : "urlEncoded");
//       }
//     }
//   }, [apiDetails]);

//   const handleTabChange = (_, newValue) => setBodyType(newValue);

//   const handleJsonChange = (e) => setJsonBody(e.target.value);

//   const handleFormFieldChange = (index, field, value) => {
//     const updatedFields = [...formFields];
//     updatedFields[index][field] = value;
//     setFormFields(updatedFields);
//   };

//   const addFormField = () => setFormFields([...formFields, { key: "", value: "" }]);

//   const removeFormField = (index) => {
//     setFormFields(formFields.filter((_, i) => i !== index));
//   };

//   return (
//     <Box
//       sx={{
//         maxWidth: 600,
//         mx: "auto",
//         p: 3,
//         borderRadius: 2,
//         boxShadow: "0px 6px 16px rgba(0,0,0,0.3)",
//         backgroundColor: "#fff"
//       }}
//     >
//       <Tabs
//         value={bodyType}
//         onChange={handleTabChange}
//         variant="fullWidth"
//         sx={{ mb: 2 }}
//       >
//         <Tab label="JSON" value="json" />
//         <Tab label="Form-Data" value="formData" />
//         <Tab label="URL-Encoded" value="urlEncoded" />
//       </Tabs>

//       {bodyType === "json" && (
//         <TextField
//           fullWidth
//           multiline
//           rows={6}
//           variant="outlined"
//           value={jsonBody}
//           onChange={handleJsonChange}
//           sx={{
//             fontFamily: "monospace",
//             backgroundColor: "#f5f5f5",
//             borderRadius: "5px"
//           }}
//         />
//       )}

//       {(bodyType === "formData" || bodyType === "urlEncoded") && (
//         <Box>
//           {formFields.map((field, index) => (
//             <Box
//               key={index}
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 1,
//                 mb: 1
//               }}
//             >
//               <TextField
//                 label="Key"
//                 variant="outlined"
//                 size="small"
//                 value={field.key}
//                 onChange={(e) => handleFormFieldChange(index, "key", e.target.value)}
//                 sx={{ flex: 1 }}
//               />
//               <TextField
//                 label="Value"
//                 variant="outlined"
//                 size="small"
//                 value={field.value}
//                 onChange={(e) => handleFormFieldChange(index, "value", e.target.value)}
//                 sx={{ flex: 1 }}
//               />
//               <IconButton color="error" onClick={() => removeFormField(index)}>
//                 <DeleteIcon />
//               </IconButton>
//             </Box>
//           ))}
//           <Button
//             variant="contained"
//             startIcon={<AddCircleOutlineIcon />}
//             onClick={addFormField}
//             sx={{ mt: 2 }}
//           >
//             Add Field
//           </Button>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default BodyTab;



import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Tabs,
  Tab,
  TextField,
  IconButton,
  Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const BodyTab = ({ apiDetails }) => {
  const [bodyType, setBodyType] = useState("none");
  const [jsonBody, setJsonBody] = useState("");
  const [formFields, setFormFields] = useState([{ key: "", value: "" }]);

  useEffect(() => {
    if (apiDetails?.paths) {
      const endpoint = Object.keys(apiDetails.paths)[0];
      const operation = apiDetails.paths[endpoint]?.put; // Using PUT to match your API
      const requestBody = operation?.requestBody?.content || {};

      // Determine the body type based on available content types
      if (requestBody["application/json"]) {
        const jsonSchema = requestBody["application/json"].schema?.properties || {};
        const jsonObject = Object.keys(jsonSchema).reduce((obj, key) => {
          obj[key] = jsonSchema[key].example || "";
          return obj;
        }, {});
        setJsonBody(JSON.stringify(jsonObject, null, 2));
        setBodyType("json");
      } 
      else if (requestBody["multipart/form-data"]) {
        const formSchema = requestBody["multipart/form-data"].schema?.properties || {};
        const formFieldsArray = Object.keys(formSchema).map((key) => ({
          key: key,
          value: formSchema[key].example || ""
        }));
        setFormFields(formFieldsArray.length > 0 ? formFieldsArray : [{ key: "", value: "" }]);
        setBodyType("formData");
      }
      else if (requestBody["application/x-www-form-urlencoded"]) {
        const formSchema = requestBody["application/x-www-form-urlencoded"].schema?.properties || {};
        const formFieldsArray = Object.keys(formSchema).map((key) => ({
          key: key,
          value: formSchema[key].example || ""
        }));
        setFormFields(formFieldsArray.length > 0 ? formFieldsArray : [{ key: "", value: "" }]);
        setBodyType("urlEncoded");
      }
      else {
        setBodyType("none");
      }
    }
  }, [apiDetails]);

  const handleTabChange = (_, newValue) => setBodyType(newValue);

  const handleJsonChange = (e) => setJsonBody(e.target.value);

  const handleFormFieldChange = (index, field, value) => {
    const updatedFields = [...formFields];
    updatedFields[index][field] = value;
    setFormFields(updatedFields);
  };

  const addFormField = () => setFormFields([...formFields, { key: "", value: "" }]);

  const removeFormField = (index) => {
    setFormFields(formFields.filter((_, i) => i !== index));
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        p: 3,
        borderRadius: 2,
        boxShadow: "0px 6px 16px rgba(0,0,0,0.3)",
        backgroundColor: "#fff"
      }}
    >
      <Tabs
        value={bodyType}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ mb: 2 }}
      >
        <Tab label="JSON" value="json" disabled={bodyType === "none"} />
        <Tab label="Form-Data" value="formData" disabled={bodyType === "none"} />
        <Tab label="URL-Encoded" value="urlEncoded" disabled={bodyType === "none"} />
      </Tabs>

      {bodyType === "json" && (
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          value={jsonBody}
          onChange={handleJsonChange}
          sx={{
            fontFamily: "monospace",
            backgroundColor: "#f5f5f5",
            borderRadius: "5px"
          }}
        />
      )}

      {(bodyType === "formData" || bodyType === "urlEncoded") && (
        <Box>
          {formFields.map((field, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1
              }}
            >
              <TextField
                label="Key"
                variant="outlined"
                size="small"
                value={field.key}
                onChange={(e) => handleFormFieldChange(index, "key", e.target.value)}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Value"
                variant="outlined"
                size="small"
                value={field.value}
                onChange={(e) => handleFormFieldChange(index, "value", e.target.value)}
                sx={{ flex: 1 }}
              />
              <IconButton color="error" onClick={() => removeFormField(index)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={addFormField}
            sx={{ mt: 2 }}
          >
            Add Field
          </Button>
        </Box>
      )}

      {bodyType === "none" && (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
          No request body required for this endpoint
        </Typography>
      )}
    </Box>
  );
};

export default BodyTab;