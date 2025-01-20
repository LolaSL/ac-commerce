import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button, Form } from "react-bootstrap";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist/webpack.mjs";
import { Helmet } from "react-helmet-async";
// import RoomColorTable from "./RoomColorTable.jsx";

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
  // const [roomColors, setRoomColors] = useState([
  //   {
  //     name: "Living Room",
  //     x: 50,
  //     y: 50,
  //     width: 200,
  //     height: 150,
  //     color: "#FFFFFF",
  //   },
  //   {
  //     name: "Bedroom",
  //     x: 300,
  //     y: 50,
  //     width: 150,
  //     height: 150,
  //     color: "#FFFFFF",
  //   },
  //   {
  //     name: "Kitchen",
  //     x: 50,
  //     y: 250,
  //     width: 150,
  //     height: 100,
  //     color: "#FFFFFF",
  //   },
  //   {
  //     name: "Bathroom",
  //     x: 300,
  //     y: 250,
  //     width: 100,
  //     height: 100,
  //     color: "#FFFFFF",
  //   },
  //   {
  //     name: "Dining Room",
  //     x: 50,
  //     y: 400,
  //     width: 200,
  //     height: 100,
  //     color: "#FFFFFF",
  //   },
  // ]);
  // const [selectedColor] = useState("#FFD700");

  // const [
  //   rooms,

  // ] = useState([
  //   {
  //     id: 1,
  //     name: "Living Room",
  //     x: 50,
  //     y: 50,
  //     width: 200,
  //     height: 150,
  //     color: "#FFFFFF",
  //   },
  //   {
  //     id: 2,
  //     name: "Bedroom",
  //     x: 300,
  //     y: 50,
  //     width: 150,
  //     height: 100,
  //     color: "#FFFFFF",
  //   },
  // ]);

  const RECT_WIDTH = window.innerWidth < 768 ? 20 : 30;
  const RECT_HEIGHT = window.innerWidth < 768 ? 10 : 15;

  const handleChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError(null);
      setIconPositions([]);
      setComments([]);
    } else {
      setFile(null);
      setPreviewUrl(null);
      setError("No file selected.");
    }
  };

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    // const context = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    // context.beginPath();
    // context.arc(x, y, 10, 0, 2 * Math.PI);
    // context.fillStyle = 'green';
    // context.fill();
    // const updatedColors = roomColors.map((room) => {
    //   if (
    //     x >= room.x &&
    //     x <= room.x + room.width &&
    //     y >= room.y &&
    //     y <= room.y + room.height
    //   ) {
    //     return { ...room, color: selectedColor };
    //   }

    //   return room;
    // });

    // setRoomColors(updatedColors);

    // if (updatedColors) {
    //   const roomColor = prompt("Enter a color for this room (e.g., #ff0000):") || "#00ff00";

    //   setRooms((prevRooms) =>
    //     prevRooms.map((room) =>
    //       room.id === updatedColors.id ? { ...room, color: roomColor } : room
    //     )
    //   );
    // }
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

  const renderComments = useCallback(
    (context) => {
      context.font = "bold 16px Arial";
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
  // const handleColorChange = (updatedColors) => {
  //   setRoomColors(updatedColors);
  // };

  // const drawRoomWithColor = useCallback(
  //   (context) => {
  //     context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  //     roomColors.forEach((room) => {
  //       context.fillStyle = room.color;
  //       context.fillRect(room.x, room.y, room.width, room.height);
  //       context.strokeStyle = "#000000";
  //       context.strokeRect(room.x, room.y, room.width, room.height);
  //     });
  //   },
  //   [roomColors]
  // );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !file) return;
    // const context = canvas.getContext("2d");
    // drawRoomWithColor(context);
  }, [file]);

  const renderSignature = useCallback(
    (context) => {
      if (isSaved) {
        const text = "APPROVED";
        const textX = context.canvas.width - 180;
        const textY = 45;
        const padding = 10;
        context.font = "bold 18px Arial itallic";

        const textMetrics = context.measureText(text);
        const textWidth = textMetrics.width;
        const textHeight = 18;

        context.strokeStyle = "black";
        context.lineWidth = 2;
        context.fillStyle = "white";
        context.shadowColor = "grey";
        context.shadowBlur = 1;

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

        context.fillStyle = "#FF0000";
        context.fillText(text, textX, textY);

        context.beginPath();
        context.setLineDash([]);
        context.stroke();
      }
    },
    [isSaved]
  );

  // const renderRooms = useCallback(
  //   (context) => {
  //     rooms.forEach((room) => drawRoomWithColor(context, room));
  //   },
  //   [rooms, drawRoomWithColor]
  // );

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
          const rectWidth = 80;
          const rectHeight = 25;
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
    // renderRooms(context);
    // drawRoomWithColor(context, "Living Room", 50, 50, 100, 50);
    // drawRoomWithColor(context, "Bedroom", 200, 50, 100, 50);

    if (previewUrl) {
      const img = new Image();
      img.src = previewUrl;
      img.onload = () => {
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        iconPositions.forEach((icon) => {
          const rectWidth = 80;
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
        // drawRoomWithColor(context);

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
  }, [iconPositions, file, previewUrl, renderPDFOnCanvas, renderComments, renderSignature, drawRotatedRectangle]);

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
        setIsSaved(true);
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
        <h1 className="mt-4 mb-4 title-measurement">
          Measurement Service System
        </h1>
        <Form.Label className="mb-4 label-upload">
          Upload file sample.{" "}
        </Form.Label>
        <p className="warning fw-bold">
          *Supported: High Resolution Images & PDFs files. Recommended to place
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

      {/* <RoomColorTable
        roomColors={roomColors}
        onColorChange={handleColorChange}
      /> */}
      <h3 className="mt-4 mb-4">Preview of selected file:</h3>
      {previewUrl && (
        <div>
          <canvas
            id="my-canvas"
            ref={canvasRef}
            width={window.innerWidth * 0.9}
            height={window.innerHeight * 0.6}
            onTouchStart={handleCanvasTouch}
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
