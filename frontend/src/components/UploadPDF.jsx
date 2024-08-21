import React, { useRef, useEffect, useState } from "react";
import WebViewer from "@pdftron/webviewer";
import BtuCalculator from "./BtuCalculator";

const UploadPDF = () => {
  const viewer = useRef(null);
  const [instance, setInstance] = useState(null);

  useEffect(() => {
    if (viewer.current && !instance) {
      WebViewer(
        {
          path: "/lib",
          licenseKey: "my-api-key", // Your license key
        },
        viewer.current
      ).then((inst) => {
        setInstance(inst);

        // Example room data with coordinates and types
        const rooms = [
          { x: 100, y: 150, width: 150, height: 150, type: "Bedroom1" },
          { x: 100, y: 300, width: 150, height: 150, type: "Bedroom2" },
          { x: 250, y: 300, width: 150, height: 150, type: "Bedroom3" },
          { x: 350, y: 150, width: 150, height: 150, type: "Living Room" },
          { x: 370, y: 150, width: 150, height: 150, type: "Kitchen Room" },
        ];

        const roomColors = {
          Bedroom1: { r: 255, g: 221, b: 193 },
          Bedroom2: { r: 255, g: 221, b: 193 },
          Bedroom3: { r: 255, g: 221, b: 193 },
          "Living Room": { r: 209, g: 247, b: 196 },
          "kitchen Room": { r: 209, g: 247, b: 196 },
          // Add more room types and corresponding colors here
        };

        inst.Core.documentViewer.addEventListener("documentLoaded", () => {
          const { annotationManager, Annotations } = inst.Core;

          rooms.forEach((room) => {
            const color = roomColors[room.type];
            const rectAnnot = new Annotations.RectangleAnnotation({
              PageNumber: 1,
              X: room.x,
              Y: room.y,
              Width: room.width,
              Height: room.height,
              StrokeColor: new Annotations.Color(0, 0, 0, 0), // No border color
              FillColor: new Annotations.Color(color.r, color.g, color.b, 0.4), // 0.5 for 50% transparency
              Author: annotationManager.getCurrentUser(),
            });

            annotationManager.addAnnotation(rectAnnot);
            annotationManager.redrawAnnotation(rectAnnot);
          });
        });
      });
    }
  }, [instance]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && instance) {
      const fileUrl = URL.createObjectURL(file);
      instance.UI.loadDocument(fileUrl);
    }
  };

  return (
    <>
      <div className="upload-pdf container">
        <h1 className="header text-center fw-bold">Upload PDF file sample</h1>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="form-control mb-3"
        />
        <div
          className="webviewer"
          ref={viewer}
          style={{ height: "600px" }}
        ></div>
      </div>
      <div>
        <BtuCalculator />
      </div>
    </>
  );
};

export default UploadPDF;
