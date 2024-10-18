import React, { useState, useRef, useEffect } from "react";
import { Form } from "react-bootstrap";
import { PDFDocument } from "pdf-lib";

function UploadFile() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [rectangles, setRectangles] = useState([]);
  const canvasRef = useRef(null);
  const [color, setColor] = useState("#9370DB");
  const [startPosition, setStartPosition] = useState(null);
  const [isDrawingSignature, setIsDrawingSignature] = useState(false);
  const [signaturePath, setSignaturePath] = useState([]);

  function handleChange(event) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError(null);
      setRectangles([]); // Reset rectangles when a new file is uploaded
      setSignaturePath([]); // Reset signature path when a new file is uploaded
    } else {
      setFile(null);
      setPreviewUrl(null);
      setError("No file selected.");
    }
  }

  function handleMouseDown(e) {
    const { offsetX, offsetY } = e.nativeEvent;
    setStartPosition({ x: offsetX, y: offsetY });
    setDrawing(true);

    if (isDrawingSignature) {
      setSignaturePath([{ x: offsetX, y: offsetY }]); // Start new signature path
    }
  }

  function handleMouseMove(e) {
    if (!drawing) return;

    const { offsetX, offsetY } = e.nativeEvent;

    if (isDrawingSignature) {
      // If drawing a signature
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext("2d");
        context.strokeStyle = color; // Use color for signature drawing
        context.lineWidth = 2; // Set signature stroke width
        context.lineJoin = "round";
        context.lineCap = "round";
        context.beginPath();
        context.moveTo(startPosition.x, startPosition.y);
        context.lineTo(offsetX, offsetY);
        context.stroke();
        setSignaturePath((prev) => [...prev, { x: offsetX, y: offsetY }]); // Add to signature path
        setStartPosition({ x: offsetX, y: offsetY }); // Update start position
      }
    } else {
      // Rectangle drawing logic
      const currentRect = {
        x: startPosition.x,
        y: startPosition.y,
        width: offsetX - startPosition.x,
        height: offsetY - startPosition.y,
        color: color,
      };
      setRectangles((prevRects) => [...prevRects.slice(0, -1), currentRect]);
    }
  }

  function handleMouseUp() {
    setDrawing(false);
    if (!isDrawingSignature) {
      // Commit the rectangle if not drawing a signature
      setRectangles((prevRects) => [
        ...prevRects,
        {
          x: startPosition.x,
          y: startPosition.y,
          width: prevRects[prevRects.length - 1]?.width || 0,
          height: prevRects[prevRects.length - 1]?.height || 0,
          color: color,
        },
      ]);
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // Ensure the canvas exists before trying to get its context
    const context = canvas.getContext("2d");

    // Clear the canvas before redrawing
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw the background image
    if (previewUrl) {
      const img = new Image();
      img.src = previewUrl;
      img.onload = () => {
        context.drawImage(img, 0, 0, canvas.width, canvas.height); // Draw the background

        // Redraw all rectangles
        rectangles.forEach((rect) => {
          context.fillStyle = rect.color;
          context.fillRect(rect.x, rect.y, rect.width, rect.height);
          context.strokeStyle = "black";
          context.lineWidth = 1;
          context.strokeRect(rect.x, rect.y, rect.width, rect.height);
        });

        // Redraw the signature path
        if (signaturePath.length > 0) {
          context.strokeStyle = color; // Use the same color for the signature
          context.lineWidth = 2; // Set signature stroke width
          context.lineJoin = "round";
          context.lineCap = "round";
          context.beginPath();
          context.moveTo(signaturePath[0].x, signaturePath[0].y);
          signaturePath.forEach((point) => {
            context.lineTo(point.x, point.y);
          });
          context.stroke();
        }
      };
    }
  }, [rectangles, signaturePath, previewUrl, color]);

  // Function to save the canvas as an image
  function saveAsImage() {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");

      // Redraw the background image
      const img = new Image();
      img.src = previewUrl; // Get the URL of the uploaded file
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        context.drawImage(img, 0, 0, canvas.width, canvas.height); // Draw the background

        // Redraw all rectangles
        rectangles.forEach((rect) => {
          context.fillStyle = rect.color;
          context.fillRect(rect.x, rect.y, rect.width, rect.height);
          context.strokeStyle = "black";
          context.lineWidth = 1;
          context.strokeRect(rect.x, rect.y, rect.width, rect.height);
        });

        // Redraw the signature path
        if (signaturePath.length > 0) {
          context.strokeStyle = color; // Use the same color for the signature
          context.lineWidth = 2; // Set signature stroke width
          context.lineJoin = "round";
          context.lineCap = "round";
          context.beginPath();
          context.moveTo(signaturePath[0].x, signaturePath[0].y);
          signaturePath.forEach((point) => {
            context.lineTo(point.x, point.y);
          });
          context.stroke();
        }

        // Create a download link
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "annotated-image.png";
        link.click();
      };
    }
  }

  // Function to save annotated PDF
  async function saveAsPDF() {
    const pdfDoc = await PDFDocument.load(file);
    const page = pdfDoc.getPages()[0]; // Assuming single page PDF for simplicity
    const { width, height } = page.getSize();
    const pdfCanvas = canvasRef.current;

    if (pdfCanvas) {
      const imageData = pdfCanvas.toDataURL();
      const pngImage = await pdfDoc.embedPng(imageData);

      // Adding image to PDF page
      page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: width,
        height: height,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "annotated-pdf.pdf";
      link.click();
    }
  }

  return (
    <div className="upload-file">
      <Form className="btu-calculation-measure">
        <h1 className="mt-4 mb-4">Measurement Service System</h1>
        <Form.Label className="mb-4">
          Upload file sample. <strong>*Supported: Hight Resolution Images & PDFs files. Recommended to place air conditioner above door in drawing.</strong>
        </Form.Label>
        <Form.Control
          type="file"
          onChange={handleChange}
          accept="image/*,application/pdf"
        />
        <Form.Group className="mt-3">
          <Form.Label>Select Rectangle Color:</Form.Label>
          <Form.Control
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Check
            type="checkbox"
            label="Enable Signature Drawing"
            onChange={(e) => setIsDrawingSignature(e.target.checked)}
          />
        </Form.Group>
      </Form>

      <h3 className="mt-4 mb-4">Preview of selected file:</h3>
      {previewUrl && (
        <div>
          {file && file.type.startsWith("image/") && (
            <div>
              <canvas
                ref={canvasRef}
                width="1400"
                height="1750"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{
                  backgroundImage: `url(${previewUrl})`,
                  backgroundSize: "cover",
                }}
              />
              <button onClick={saveAsImage}>Save as Image</button>
              <button onClick={saveAsPDF}>Save as PDF</button>
            </div>
          )}
          {file && file.type === "application/pdf" && (
            <canvas
              ref={canvasRef}
              width="1400"
              height="1750"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              style={{
                backgroundImage: `url(${previewUrl})`,
                backgroundSize: "cover",
              }}
            />
          )}
        </div>
      )}
           {error && <p style={{ color: "red" }}>Error: {error}</p>}{/* <i class="fal fa-air-conditioner"></i> */}
    </div>
  );
}

export default UploadFile;
