import React, { useState } from "react";
import { Form } from "react-bootstrap";

function UploadFile() {
  const [file, setFile] = useState(null);          
  const [previewUrl, setPreviewUrl] = useState(null);  
  const [error, setError] = useState(null);      

  function handleChange(event) {
    const selectedFile = event.target.files[0];  

    if (selectedFile) {
      setFile(selectedFile); 
      setPreviewUrl(URL.createObjectURL(selectedFile));  
      setError(null); 
    } else {
      setFile(null);
      setPreviewUrl(null);
      setError('No file selected.');
    }
  }

  return (
    <div className="upload-file">
      <Form>
        <h1 className="mt-4 mb-4">Measurement service system</h1>
        <Form.Label className="mb-4">
          Upload file sample. <strong>*Supported: Images & PDFs</strong>
        </Form.Label>
        <Form.Control
          type="file"
          onChange={handleChange}
          accept="image/*,application/pdf" 
        />
      </Form>

      <h3 className="mt-4 mb-4">Preview of selected file:</h3>
      {previewUrl && (
        <div>
          {file && file.type.startsWith("image/") && (
            <img
              src={previewUrl}
              alt="Selected File"
              style={{width: "100%", height: "auto" }}
            />
          )}

          {file && file.type === "application/pdf" && (
            <iframe
              src={previewUrl}
              title="Selected PDF"
              width="1200"
              height="800"
            ></iframe>
          )}
        </div>
      )}


      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
}

export default UploadFile;
