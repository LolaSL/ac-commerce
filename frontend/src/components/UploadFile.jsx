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
  const [color, setColor] = useState("#ee1169");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [comments, setComments] = useState([]);
  const RECT_WIDTH = window.innerWidth < 768 ? 20 : 30;
  const RECT_HEIGHT = window.innerWidth < 768 ? 10 : 15;

  const handleChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      if (fileType === "application/pdf") {
        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
        setError(null);
        setIconPositions([]);
        setComments([]);
      } else {
        setFile(null);
        setPreviewUrl(null);
        setError("Only PDF files are allowed.");
      }
    } else {
      setFile(null);
      setPreviewUrl(null);
      setError("No file selected.");
    }
  };

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (event.detail === 2) {
      handleIconDoubleClick(x, y);
    } else {
      const isNewIcon = handleIconClick(x, y);
      if (isNewIcon) {
        const commentText = prompt("Enter your comment:");
        if (commentText) {
          setComments((prevComments) => [
            ...prevComments,
            { text: commentText, x: x + 50, y: y - 30 },
          ]);
        }
      }
    }
  };

  const handleIconDoubleClick = (offsetX, offsetY) => {
    const existingIconIndex = iconPositions.findIndex((icon) => {
      return (
        offsetX >= icon.x - RECT_WIDTH &&
        offsetX <= icon.x + RECT_WIDTH &&
        offsetY >= icon.y - RECT_HEIGHT &&
        offsetY <= icon.y + RECT_HEIGHT
      );
    });

    if (existingIconIndex !== -1) {
      setIconPositions((prevIcons) =>
        prevIcons.filter((_, index) => index !== existingIconIndex)
      );
      setComments((prevComments) =>
        prevComments.filter((_, index) => index !== existingIconIndex)
      );
    }
  };

  const handleIconClick = (offsetX, offsetY) => {
    const existingIconIndex = iconPositions.findIndex((icon) => {
      return (
        offsetX >= icon.x - 30 &&
        offsetX <= icon.x + 30 &&
        offsetY >= icon.y - 15 &&
        offsetY <= icon.y + 15
      );
    });

    if (existingIconIndex !== -1) {
      const newIcons = [...iconPositions];
      newIcons[existingIconIndex].angle =
        (newIcons[existingIconIndex].angle + Math.PI / 2) % (2 * Math.PI);
      setIconPositions(newIcons);
      return false;
    } else {
      setIconPositions((prevIcons) => [
        ...prevIcons,
        { x: offsetX, y: offsetY, angle: 0 },
      ]);
      return true;
    }
  };


  const handleCanvasTouch = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const offsetX = touch.clientX - e.target.offsetLeft;
    const offsetY = touch.clientY - e.target.offsetTop;

    if (e.detail === 2) {
      handleIconDoubleClick(offsetX, offsetY);
    } else {
      handleIconClick(offsetX, offsetY);
    }
  };

  const handleCanvasEvent = (e) => {
    if (window.innerWidth > 768) {
      handleCanvasClick(e);
    } else {
      handleCanvasTouch(e);
    }
  };

  // const handleCanvasEvent = (e) => {
  //   // if (window.innerWidth > 768) {
  //   handleCanvasClick(e);
  //   // }
  //   // else {
  //   //   handleCanvasTouch(e);
  //   // }
  // };

  const renderComments = useCallback(
    (context) => {
      context.font = "bold 18px Arial";
      context.lineWidth = 2;
      context.shadowColor = "grey";
      context.shadowBlur = 1;
      const canvasWidth = context.canvas.width;
      const canvasHeight = context.canvas.height;
      comments.forEach((comment) => {
        const padding = 10;
        const lineHeight = 20;
        const maxWidth = 200;
        const words = comment.text.split(" ");
        let line = "";
        let lines = [];
        let yOffset = comment.y;
        words.forEach((word) => {
          const testLine = line + word + " ";
          const testWidth = context.measureText(testLine).width;
          if (testWidth > maxWidth) {
            lines.push(line);
            line = word + " ";
          } else {
            line = testLine;
          }
        });
        lines.push(line);

        const longestLineWidth = Math.max(
          ...lines.map((line) => context.measureText(line).width)
        );
        const frameWidth = Math.min(longestLineWidth + padding * 2, maxWidth);
        const textBlockHeight = lines.length * lineHeight;
        const frameHeight = textBlockHeight + padding;

        let adjustedX = comment.x;
        let adjustedY = yOffset - textBlockHeight;

        if (adjustedX + frameWidth > canvasWidth) {
          adjustedX = canvasWidth - frameWidth - padding;
        }

        if (adjustedY + frameHeight > canvasHeight) {
          adjustedY = canvasHeight - frameHeight - padding;
        }

        context.fillStyle = "rgba(255, 255, 224, 0.5)";
        context.fillRect(adjustedX, adjustedY, frameWidth, frameHeight);

        context.strokeStyle = "grey";
        context.strokeRect(adjustedX, adjustedY, frameWidth, frameHeight);

        context.fillStyle = "deeppink";
        lines.forEach((line, index) => {
          context.fillText(
            line,
            adjustedX + padding,
            adjustedY + (index + 1) * lineHeight
          );
        });
      });
    },
    [comments]
  );

  const drawRotatedRectangle = useCallback(
    (context, x, y, width, height, angle) => {
      context.save();
      context.translate(x, y);
      context.rotate(angle);
      context.fillStyle = color;
      context.fillRect(-width / 2, -height / 2, width, height);
      context.restore();
    },
    [color]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !file) return;
  }, [file]);

  const renderSignature = useCallback(
    (context) => {
      if (isSaved) {
        const text = "APPROVED";
        const padding = 10;
        const fontSize = 14;
        context.font = `bold ${fontSize}px Calibri italic`;

        const textMetrics = context.measureText(text);
        const textWidth = textMetrics.width;
        const textHeight = fontSize;

        const textX = context.canvas.width - textWidth - padding - 500;
        const textY = 100 + textHeight + padding;

        const drawRoundedRect = (x, y, width, height, radius) => {
          context.beginPath();
          context.moveTo(x + radius, y);
          context.lineTo(x + width - radius, y);
          context.quadraticCurveTo(x + width, y, x + width, y + radius);
          context.lineTo(x + width, y + height - radius);
          context.quadraticCurveTo(
            x + width,
            y + height,
            x + width - radius,
            y + height
          );
          context.lineTo(x + radius, y + height);
          context.quadraticCurveTo(x, y + height, x, y + height - radius);
          context.lineTo(x, y + radius);
          context.quadraticCurveTo(x, y, x + radius, y);
          context.closePath();
        };

        context.fillStyle = "white";
        drawRoundedRect(
          textX - padding,
          textY - textHeight - padding / 2,
          textWidth + 2 * padding,
          textHeight + padding,
          10
        );
        context.fill();

        context.strokeStyle = "#0933ce";
        context.lineWidth = 1.5;
        context.setLineDash([5, 5]);
        context.stroke();

        context.shadowColor = "rgba(0, 0, 0, 0.5)";
        context.shadowBlur = 4;
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;

        context.fillStyle = "#ce092d";
        context.fillText(text, textX, textY);

        context.shadowColor = "transparent";
        context.shadowBlur = 0;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.setLineDash([]);
      }
    },
    [isSaved]
  );

  const renderPDFOnCanvas = useCallback(
    async (pdfData) => {
      const canvas = canvasRef.current;
      if (!canvas || !file) return;
      const context = canvas.getContext("2d");

      const loadingTask = pdfjsLib.getDocument({ data: pdfData });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const reader = new FileReader();
      reader.onload = async () => {
        const typedArray = new Uint8Array(reader.result);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1 });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;

        iconPositions.forEach((icon) => {
          const rectWidth = 45;
          const rectHeight = 11;
          drawRotatedRectangle(
            context,
            icon.x,
            icon.y,
            rectWidth,
            rectHeight,
            icon.angle
          );
        });
        renderComments(context);
        renderSignature(context);
      };
      reader.readAsArrayBuffer(file);
    },
    [file, iconPositions, renderSignature, drawRotatedRectangle, renderComments]
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
          const rectWidth = 65;
          const rectHeight = 15;
          drawRotatedRectangle(
            context,
            icon.x,
            icon.y,
            rectWidth,
            rectHeight,
            icon.angle
          );
        });
        renderComments(context);
        renderSignature(context);
      };
    }

    if (file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = async function (e) {
        const pdfData = new Uint8Array(e.target.result);
        await renderPDFOnCanvas(pdfData);
      };
      reader.readAsArrayBuffer(file);
    }
  }, [
    iconPositions,
    file,
    previewUrl,
    renderPDFOnCanvas,
    renderComments,
    renderSignature,
    drawRotatedRectangle,
  ]);

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
        setIsSaved(true);
      }
    } else {
      setError("The selected file is not a PDF.");
    }
  };
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    setIconPositions([]);
    setPreviewUrl(null);
    setIsSaved(false);
  };

  return (
    <div className="upload-file">
      <Helmet>
        <title>Measurement System</title>
      </Helmet>
      <Form className="btu-calculation-measure">
        <h1 className="mt-4 mb-4 title-measurement">
          Measurement Service System
        </h1>
        <Form.Label className="mb-4 label-upload">
          Upload file sample.{" "}
        </Form.Label>
        <p className="warning fw-bold">
          *Supported: High Resolution PDFs files (.pdf). Recommended to place
          air conditioner (rectangle) above door in drawing.
        </p>
        <p className="warning fw-bold">
          *Add rectangle: <kbd>Click on empty area</kbd>
        </p>
        <p className="warning fw-bold">
          *Rotate rectangle: <kbd>Click</kbd>
        </p>
        <p className="warning fw-bold">
          *Delete rectangle: <kbd>Double Click</kbd>
        </p>
        <Form.Control
          className="mt-4"
          type="file"
          onChange={handleChange}
          accept="application/pdf"
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
      <h2 className="mt-4 mb-4">Preview of selected file:</h2>
      {previewUrl && (
        <div>
          <canvas
            id="my-canvas"
            ref={canvasRef}
            width={window.innerWidth * 0.9}
            height={window.innerHeight * 0.6}
            onClick={handleCanvasEvent}
            style={{
              backgroundImage: `url(${previewUrl})`,
              backgroundSize: "cover",
              cursor: "pointer",
              display: "block",
              margin: "0 auto",
            }}
          />
        </div>
      )}
      <div className="d-flex">
        {file && file.type === "application/pdf" && (
          <>
            <Button
              variant="secondary"
              onClick={saveAsPDF}
              className="mt-2 me-2"
            >
              Save as PDF
            </Button>
            <Button variant="secondary" className="mt-2" onClick={clearCanvas}>
              Clear
            </Button>
          </>
        )}
      </div>
      {error && <p className="error-message mt-4">{error}</p>}
    </div>
  );
}

export default UploadFile;
