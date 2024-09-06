// import React, { useRef, useEffect, useState } from "react";
// import WebViewer from "@pdftron/webviewer";
// import { Form } from "react-bootstrap";
// import { Helmet } from "react-helmet-async";
// import BtuCalculator from "./BtuCalculator";


// const UploadPDF = () => {
//   const viewerDiv = useRef(null); // Ref for WebViewer container
//   const beenInitialized = useRef(false); // Ref to track initialization status
//   const [instance, setInstance] = useState(null);
//   const [cvReady, setCvReady] = useState(false);
//   const cvRef = useRef(null);

//   useEffect(() => {
//     const loadOpenCV = () => {
//       if (window.cv) {
//         cvRef.current = window.cv; // Assign window.cv to cvRef.current
//         setCvReady(true);
//       } else {
//         window.Module = {
//           onRuntimeInitialized: () => {
//             cvRef.current = window.cv; // Assign window.cv to cvRef.current after initialization
//             setCvReady(true);
//           },
//         };
//       }
//     };

//     loadOpenCV();
//   }, []); // Run once on component mount

//   useEffect(() => {
//     const initializeViewer = async () => {
//       if (!beenInitialized.current && cvReady) {
//         beenInitialized.current = true;

//         const instance = await WebViewer(
//           {
//             path: "/lib",
//             initialDoc: "https://pdftron.s3.amazonaws.com/downloads/pl/webviewer-demo.pdf",
//             licenseKey: "demo:1724086098724:7e48ccef030000000029d75904e4c73f9ae2edceae82f126abeadb2ed2",
//           },
//           viewerDiv.current
//         );

//         setInstance(instance);

//         instance.Core.documentViewer.addEventListener("documentLoaded", () => {
//           if (!cvReady) {
//             console.warn("OpenCV.js is not ready yet.");
//             return;
//           }

//           const rooms = [
//             { x: 100, y: 150, width: 150, height: 150, type: "Bedroom1" },
//             { x: 100, y: 300, width: 150, height: 150, type: "Bedroom2" },
//             { x: 390, y: 150, width: 150, height: 150, type: "Living Room" },
//             { x: 370, y: 150, width: 150, height: 150, type: "Kitchen Room" },
//           ];

//           annotateRooms(instance, rooms);
//         });

//         if (cvReady) {
//           processPDF(instance);
//         }
//       }
//     };

//     initializeViewer();
//   }, [cvReady]); // Depend on cvReady to ensure initialization after OpenCV loads

//   const annotateRooms = (instance, rooms) => {
//     const { annotationManager, Annotations } = instance.Core;
//     const roomColors = {
//       Bedroom1: { r: 153, g: 255, b: 255 },
//       Bedroom2: { r: 153, g: 255, b: 255 },
//       "Living Room": { r: 204, g: 204, b: 255 },
//       "Kitchen Room": { r: 153, g: 255, b: 153 },
//     };

//     rooms.forEach((room) => {
//       const color = roomColors[room.type] || { r: 255, g: 255, b: 255 }; // Default to white
//       const rectAnnot = new Annotations.RectangleAnnotation({
//         PageNumber: 1,
//         X: room.x,
//         Y: room.y,
//         Width: room.width,
//         Height: room.height,
//         StrokeColor: new Annotations.Color(0, 0, 0, 0),
//         FillColor: new Annotations.Color(color.r, color.g, color.b, 0.4),
//         Author: annotationManager.getCurrentUser(),
//       });

//       annotationManager.addAnnotation(rectAnnot);
//       annotationManager.redrawAnnotation(rectAnnot);
//     });
//   };
// // Add this function to your code
// const determineScale = (pdfPage) => {
//   // Assuming you have a known reference in the PDF, like a ruler or a specific dimension
//   // For example, let's say you know that a certain length in the PDF (in points) corresponds to a real-world measurement (in meters or feet).
  
//   const knownPdfLengthInPoints = 100; // Example: known length in PDF in points
//   const realWorldLengthInMeters = 1;  // Example: this length corresponds to 1 meter in the real world

//   // The scale factor is the ratio of real-world length to the length in the PDF
//   const scale = realWorldLengthInMeters / knownPdfLengthInPoints;

//   return scale;
// };

//   const processPDF = async (instance) => {
//     try {
//       const pdfDoc = instance.Core.documentViewer.getDocument();
//       const pdfPage = await getPdfPage(pdfDoc, 1);
//       const imageData = await convertPdfPageToImage(pdfPage);

//       const edges = applyEdgeDetection(imageData);
//       const contours = findContours(edges);
//       const rooms = matchContoursToRooms(contours);

//       const scale = determineScale(pdfPage);
//       const roomsWithSizes = calculateRoomSizes(rooms, scale);
//       const coloredRooms = assignColorsToRooms(roomsWithSizes);

//       calculateBTUAndPlaceAC(coloredRooms, instance);
//     } catch (error) {
//       console.error("Error processing PDF:", error);
//     }
//   };

//   const getPdfPage = async (pdfDocument, pageNumber) => {
//     try {
//       const pdfPage = await pdfDocument.getPage(pageNumber);
//       return pdfPage;
//     } catch (error) {
//       console.error("Error getting PDF page:", error);
//       return null;
//     }
//   };

//   const convertPdfPageToImage = async (pdfPage) => {
//     const scale = 2;
//     const viewport = pdfPage.getViewport({ scale });
//     const canvas = document.createElement("canvas");
//     const context = canvas.getContext("2d");
//     canvas.width = viewport.width;
//     canvas.height = viewport.height;
//     const renderContext = { canvasContext: context, viewport: viewport };
//     await pdfPage.render(renderContext).promise;
//     return context.getImageData(0, 0, canvas.width, canvas.height);
//   };

//   const applyEdgeDetection = (imageData) => {
//     const src = cvRef.current.matFromImageData(imageData);
//     const gray = new cvRef.current.Mat();
//     cvRef.current.cvtColor(src, gray, cvRef.current.COLOR_RGBA2GRAY, 0);
//     const blurred = new cvRef.current.Mat();
//     cvRef.current.GaussianBlur(gray, blurred, new cvRef.current.Size(5, 5), 0);
//     const edges = new cvRef.current.Mat();
//     cvRef.current.Canny(blurred, edges, 100, 200);
//     src.delete();
//     gray.delete();
//     blurred.delete();
//     return edges;
//   };

//   const findContours = (edges) => {
//     const contours = new cvRef.current.MatVector();
//     const hierarchy = new cvRef.current.Mat();
//     cvRef.current.findContours(edges, contours, hierarchy, cvRef.current.RETR_TREE, cvRef.current.CHAIN_APPROX_SIMPLE);
//     const contourArray = [];
//     for (let i = 0; i < contours.size(); i++) {
//       contourArray.push(contours.get(i));
//     }
//     hierarchy.delete();
//     return contourArray;
//   };

//   const matchContoursToRooms = (contours) => {
//     const roomTypes = {
//       Bedroom: { minArea: 5000, maxArea: 20000 },
//       Kitchen: { minArea: 2000, maxArea: 7000 },
//       LivingRoom: { minArea: 10000, maxArea: 30000 },
//     };

//     return contours.map((contour) => {
//       const area = cvRef.current.contourArea(contour);
//       for (const [type, { minArea, maxArea }] of Object.entries(roomTypes)) {
//         if (area >= minArea && area <= maxArea) {
//           return { contour, type };
//         }
//       }
//       return { contour, type: "Unknown" };
//     });
//   };

//   const calculateRoomSizes = (rooms, scale) => {
//     return rooms.map((room) => {
//       const pixelArea = cvRef.current.contourArea(room.contour);
//       const areaInSquareMeters = pixelArea * scale ** 2;
//       return { ...room, areaInSquareMeters };
//     });
//   };

//   const assignColorsToRooms = (rooms) => {
//     const roomColors = {
//       Bedroom: { r: 153, g: 255, b: 255 },
//       Kitchen: { r: 153, g: 255, b: 153 },
//     };

//     return rooms.map((room) => ({
//       ...room,
//       color: roomColors[room.type] || { r: 255, g: 255, b: 255 },
//     }));
//   };

//   const calculateBTUAndPlaceAC = (rooms, instance) => {
//     rooms.forEach((room) => {
//       const requiredBTU = room.areaInSquareMeters * 900;
//       const acUnits = Math.ceil(requiredBTU / 9000);
//       for (let i = 0; i < acUnits; i++) {
//         const acPosition = calculateACPosition(room, i);
//         addRectangleAnnotation(instance, acPosition);
//       }
//     });
//   };

//   const calculateACPosition = (room, index) => {
//     const unitWidth = 50;
//     const unitHeight = 25;
//     const padding = 10;
//     const totalUnitsInRow = Math.floor(room.width / (unitWidth + padding));
//     const row = Math.floor(index / totalUnitsInRow);
//     const column = index % totalUnitsInRow;
//     const x = room.x + padding + column * (unitWidth + padding);
//     const y = room.y + padding + row * (unitHeight + padding);
//     return { pageNumber: room.pageNumber, x, y, width: unitWidth, height: unitHeight };
//   };

//   const addRectangleAnnotation = (instance, position) => {
//     const { annotationManager, Annotations } = instance.Core;
//     const rectAnnot = new Annotations.RectangleAnnotation({
//       PageNumber: position.pageNumber,
//       X: position.x,
//       Y: position.y,
//       Width: position.width,
//       Height: position.height,
//       StrokeColor: new Annotations.Color(255, 0, 0, 1),
//       FillColor: new Annotations.Color(255, 0, 0, 0.4),
//       Author: annotationManager.getCurrentUser(),
//     });

//     annotationManager.addAnnotation(rectAnnot);
//     annotationManager.redrawAnnotation(rectAnnot);
//   };
//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file && instance) {
//       const fileUrl = URL.createObjectURL(file);
//       instance.UI.loadDocument(fileUrl);
//     }
//   };

//   return (
//     <div>
//       <Helmet>
//         <title>UploadPDF</title>
//       </Helmet>
//       <div>
//         <Form>
//           <h1 className="header text-center fw-bold">Measurement System</h1>
//           <Form.Group controlId="input">
//             <Form.Label>Upload PDF file sample</Form.Label>
//             <Form.Control
//               type="file"
//               accept=".pdf"
//               onChange={handleFileChange}
//               className="form-control mb-3"
//             />
//           </Form.Group>
//         </Form>
//       </div>
//       <Form.Group>
//         <Form.Label>Upload PDF</Form.Label>
//         <div className="webviewer" ref={viewerDiv} style={{ height: "100vh" }}></div>
//       </Form.Group>
//       <div>
//         <BtuCalculator />
//       </div>
//     </div>
//   );
// };

// export default UploadPDF;
