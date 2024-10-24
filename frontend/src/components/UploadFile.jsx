import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button, Form } from "react-bootstrap";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist/webpack.mjs";
import { Helmet } from "react-helmet-async";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.js`;

function UploadFile() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [iconPositions, setIconPositions] = useState([]);
  const canvasRef = useRef(null);
  const [color, setColor] = useState("#9370DB");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError(null);
      setIconPositions([]);
    } else {
      setFile(null);
      setPreviewUrl(null);
      setError("No file selected.");
    }
  };

  const handleCanvasClick = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    // Check if the click is close to an existing icon
    const existingIconIndex = iconPositions.findIndex((icon) => {
      return (
        offsetX >= icon.x - 30 &&
        offsetX <= icon.x + 30 &&
        offsetY >= icon.y - 15 &&
        offsetY <= icon.y + 15
      );
    });

    if (existingIconIndex !== -1) {
      // If clicked on an existing icon, toggle its rotation
      const newIcons = [...iconPositions];
      newIcons[existingIconIndex].angle =
        (newIcons[existingIconIndex].angle + Math.PI / 2) % (2 * Math.PI); // Rotate 90 degrees
      setIconPositions(newIcons);
    } else {
      // Otherwise, create a new icon
      setIconPositions((prevIcons) => [
        ...prevIcons,
        { x: offsetX, y: offsetY, angle: 0 }, // Start with 0 rotation
      ]);
    }
  };

  const drawRotatedRectangle = useCallback(
    (context, x, y, width, height, angle) => {
      context.save(); // Save the current context
      context.translate(x, y); // Move the origin to the rectangle's position
      context.rotate(angle); // Rotate the context by the specified angle (in radians)

      context.fillStyle = color; // Set the fill color
      context.fillRect(-width / 2, -height / 2, width, height); // Draw the rectangle centered at the new origin

      context.restore(); // Restore the context to its original state
    },
    [color]
  ); // Add color as a dependency

  const renderSignature = useCallback(
    (context) => {
      if (isSaved) {
        const text = "APPROVED BY AC-COMMERCE";
        const textX = context.canvas.width - 520;
        const textY = 60;
        const padding = 10;
        context.font = "bold 27px Arial";

        const textMetrics = context.measureText(text);
        const textWidth = textMetrics.width;
        const textHeight = 27;

        context.strokeStyle = "grey";
        context.lineWidth = 2;
        context.fillStyle = "white";

        context.fillRect(
          textX - padding,
          textY - textHeight - padding / 2,
          textWidth + 2 * padding,
          textHeight + padding
        );

        context.strokeRect(
          textX - padding,
          textY - textHeight - padding / 2,
          textWidth + 2 * padding,
          textHeight + padding
        );

        context.fillStyle = "red";
        context.fillText(text, textX, textY);

        context.beginPath();
        context.setLineDash([]);

        context.stroke();
      }
    },
    [isSaved]
  );

  const renderPDFOnCanvas = useCallback(
    async (pdfData) => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const loadingTask = pdfjsLib.getDocument({ data: pdfData });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      await page.render(renderContext).promise;

      // Draw rectangles at icon positions
      iconPositions.forEach((icon) => {
        const rectWidth = 60; // Define the rectangle's width
        const rectHeight = 30; // Define the rectangle's height
        drawRotatedRectangle(
          context,
          icon.x,
          icon.y,
          rectWidth,
          rectHeight,
          icon.angle
        );
      });

      renderSignature(context);
    },
    [iconPositions, renderSignature, drawRotatedRectangle]
  );

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || !file) return;

    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (previewUrl) {
      const img = new Image();
      img.src = previewUrl;
      img.onload = () => {
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        iconPositions.forEach((icon) => {
          const rectWidth = 90;
          const rectHeight = 30;
          drawRotatedRectangle(
            context,
            icon.x,
            icon.y,
            rectWidth,
            rectHeight,
            icon.angle
          );
        });
        renderSignature(context);
      };
    }

    if (file.type === "application/pdf") {
      const fileReader = new FileReader();
      fileReader.onload = async function (e) {
        const pdfData = new Uint8Array(e.target.result);
        await renderPDFOnCanvas(pdfData);
      };
      fileReader.readAsArrayBuffer(file);
    }
  }, [
    iconPositions,
    file,
    previewUrl,
    renderPDFOnCanvas,
    renderSignature,
    drawRotatedRectangle,
  ]);

  const saveAsImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "annotated-image.png";
      link.click();
      setIsSaved(true);
    }
  };

  const saveAsPDF = async () => {
    if (file && file.type === "application/pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const page = pdfDoc.getPages()[0];
      const { width, height } = page.getSize();
      const pdfCanvas = canvasRef.current;

      if (pdfCanvas) {
        const imageData = pdfCanvas.toDataURL();
        const pngImage = await pdfDoc.embedPng(imageData);

        page.drawImage(pngImage, { x: 0, y: 0, width, height });
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "annotated-pdf.pdf";
        link.click();
        setIsSaved(true); // Mark file as saved for rendering signature
      }
    } else {
      setError("The selected file is not a PDF.");
    }
  };
  return (
    <div className="upload-file">
      <Helmet>
        <title>Measurement System</title>
      </Helmet>
      <Form className="btu-calculation-measure">
        <h1 className="mt-4 mb-4 title-measurement">Measurement Service System</h1>
        <Form.Label className="mb-4 label-upload">
          Upload file sample.{" "}
        </Form.Label>
        <p className="warning"><strong>
            *Supported: High Resolution Images & PDFs files. Recommended to
            place air conditioner (rectangle) above door in drawing.
          </strong></p>
          <p className="warning"><strong>
            *Click to rectangle (air conditioner) change its position on drawing (90').
          </strong></p>
        <Form.Control
          type="file"
          onChange={handleChange}
          accept="image/*,application/pdf"
        />
        <Form.Group className="mt-3">
          <Form.Label>Select Icon Color:</Form.Label>
          <Form.Control
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </Form.Group>
      </Form>

      <h3 className="mt-4 mb-4">Preview of selected file:</h3>
      {previewUrl && (
        <div>
          <canvas
            ref={canvasRef}
            width="1400"
            height="1750"
            onClick={handleCanvasClick}
            style={{
              backgroundImage: `url(${previewUrl})`,
              backgroundSize: "cover",
            }}
          />
        </div>
      )}
      {file && file.type.startsWith("image/") && (
        <Button variant="secondary" className="mt-2 mb-4" onClick={saveAsImage}>
          Save as Image
        </Button>
      )}

      {file && file.type === "application/pdf" && (
        <Button variant="secondary" onClick={saveAsPDF} className="mt-2 mb-4">
          Save as PDF
        </Button>
      )}
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
}

export default UploadFile;
