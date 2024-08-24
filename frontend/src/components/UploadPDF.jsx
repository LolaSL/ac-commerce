import React, { useRef, useEffect, useState } from "react";
import WebViewer from "@pdftron/webviewer";
import {PDFTron, pdfViewerInstance} from  "@pdftron/webviewer";
import BtuCalculator from "./BtuCalculator";
import { Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";

const UploadPDF = () => {
  const viewerDiv = useRef(null); // Ref for WebViewer container
  const beenInitialised = useRef(false); // Ref to track initialization status
  const [instance, setInstance] = useState(null);

  useEffect(() => {
    if (!beenInitialised.current) {
      beenInitialised.current = true; // Mark as initialized to prevent multiple initializations
      WebViewer(
        {
          path: "/lib",
          initialDoc:
            "https://pdftron.s3.amazonaws.com/downloads/pl/webviewer-demo.pdf", // Example initial document
          licenseKey:
            "demo:1724086098724:7e48ccef030000000029d75904e4c73f9ae2edceae82f126abeadb2ed2", // Your license key
        },
        viewerDiv.current // Pass the DOM element to WebViewer
      ).then((instance) => {
        setInstance(instance);

        const rooms = [
          { x: 100, y: 150, width: 150, height: 150, type: "Bedroom1" },
          { x: 100, y: 300, width: 150, height: 150, type: "Bedroom2" },
          { x: 390, y: 150, width: 150, height: 150, type: "Living Room" },
          { x: 370, y: 150, width: 150, height: 150, type: "Kitchen Room" },
        ];

        const roomColors = {
          Bedroom1: { r: 153, g: 255, b: 255 },
          Bedroom2: { r: 153, g: 255, b: 255 },
          "Living Room": { r: 204, g: 204, b: 255 },
          "Kitchen Room": { r: 153, g: 255, b: 153 },
        };

        instance.Core.documentViewer.addEventListener("documentLoaded", () => {
          const { annotationManager, Annotations } = instance.Core;

          rooms.forEach((room) => {
            const color = roomColors[room.type];
            const rectAnnot = new Annotations.RectangleAnnotation({
              PageNumber: 1,
              X: room.x,
              Y: room.y,
              Width: room.width,
              Height: room.height,
              StrokeColor: new Annotations.Color(0, 0, 0, 0), // No border color
              FillColor: new Annotations.Color(color.r, color.g, color.b, 0.4), // 40% transparency
              Author: annotationManager.getCurrentUser(),
            });

            annotationManager.addAnnotation(rectAnnot);
            annotationManager.redrawAnnotation(rectAnnot);
          });
        });
        const loadPDF = async (pdfPath) => {
            const document = await PDFTron.loadDocument(pdfPath); // or PDF.js equivalent
            return document;
          };

          const convertPdfPageToImage = async (pdfPage) => {
            // Set the desired scale for the image. Adjust according to your needs.
            const scale = 2;
            
            // Set up the viewport with the desired scale
            const viewport = pdfPage.getViewport({ scale });
          
            // Create a canvas element to render the PDF page
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
          
            // Set canvas dimensions to match the page size at the given scale
            canvas.width = viewport.width;
            canvas.height = viewport.height;
          
            // Render the PDF page into the canvas context
            const renderContext = {
              canvasContext: context,
              viewport: viewport,
            };
          
            await pdfPage.render(renderContext).promise;
          
            // Convert the canvas to an image data URL (optional)
            const imageDataURL = canvas.toDataURL('image/png');
          
            // Return the canvas image data
            return context.getImageData(0, 0, canvas.width, canvas.height);
          };

          let cv;

          const applyEdgeDetection = (imageData) => {
            // Create a Mat from ImageData
            const src = cv.matFromImageData(imageData);
            
            // Convert the image to grayscale
            let gray = new cv.Mat();
            cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
          
            // Apply Gaussian Blur to reduce noise and improve edge detection
            let blurred = new cv.Mat();
            cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
          
            // Apply Canny Edge Detection
            let edges = new cv.Mat();
            cv.Canny(blurred, edges, 100, 200);
          
            // Clean up matrices
            src.delete();
            gray.delete();
            blurred.delete();
          
            // Return the edges matrix
            return edges;
          };
          
          const findContours = (edges) => {
            // Prepare an array to store contours
            let contours = new cv.MatVector();
            let hierarchy = new cv.Mat();
          
            // Find contours from the edge-detected image
            cv.findContours(edges, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);
          
            // Convert contours to a JavaScript array for easier processing
            let contourArray = [];
            for (let i = 0; i < contours.size(); i++) {
              contourArray.push(contours.get(i));
            }
          
            // Clean up the hierarchy matrix
            hierarchy.delete();
          
            // Return the array of contours
            return contourArray;
          };
          
          const matchContoursToRooms = (contours) => {
            const roomTypes = {
              Bedroom: { minArea: 5000, maxArea: 20000 },
              Kitchen: { minArea: 2000, maxArea: 7000 },
              LivingRoom: { minArea: 10000, maxArea: 30000 },
              // Add more room types and corresponding area ranges as needed
            };
          
            return contours.map((contour) => {
              const area = cv.contourArea(contour);
              
              // Determine the room type based on area
              for (const [type, { minArea, maxArea }] of Object.entries(roomTypes)) {
                if (area >= minArea && area <= maxArea) {
                  return { contour, type };
                }
              }
          
              // Default to 'Unknown' if no match found
              return { contour, type: 'Unknown' };
            });
          };
          
          const calculateContourArea = (contour) => {
            // Calculate the area of the contour using OpenCV.js
            return cv.contourArea(contour);
          };
          
          const detectRooms = (pdfPage) => {
            // Convert page to an image
            const imageData = convertPdfPageToImage(pdfPage);
          
            // Apply edge detection to find room boundaries
            const edges = applyEdgeDetection(imageData);
          
            // Find contours that might represent rooms
            const contours = findContours(edges);
          
            // Identify rooms by matching contours to known room shapes or types
            const rooms = matchContoursToRooms(contours);
            return rooms;
          };


          const calculateRoomSizes = (rooms, scale) => {
            return rooms.map((room) => {
              const pixelArea = calculateContourArea(room.contour);
              const areaInSquareMeters = pixelArea * (scale ** 2);
              return { ...room, areaInSquareMeters };
            });
          };

          const assignColorsToRooms = (rooms) => {
            const roomColors = {
              Bedroom: { r: 153, g: 255, b: 255 },
              Kitchen: { r: 153, g: 255, b: 153 },
              // Add more room types and corresponding colors here
            };
          
            return rooms.map((room) => ({
              ...room,
              color: roomColors[room.type] || { r: 255, g: 255, b: 255 }, // Default to white if type not found
            }));
          };
          const addRectangleAnnotation = (pdfDocument, position) => {
            const { annotationManager, Annotations } = pdfDocument.Core;
          
            // Create a new rectangle annotation
            const rectAnnot = new Annotations.RectangleAnnotation({
              PageNumber: position.pageNumber,
              X: position.x,
              Y: position.y,
              Width: position.width,
              Height: position.height,
              StrokeColor: new Annotations.Color(0, 0, 0, 1),  // Black border color
              FillColor: new Annotations.Color(255, 0, 0, 0.5), // Red fill with 50% transparency
            });
          
            // Add the annotation to the document
            annotationManager.addAnnotation(rectAnnot);
            annotationManager.redrawAnnotation(rectAnnot);
          };

          const calculateACPosition = (room, index) => {
            const unitWidth = 50;  // Width of the AC unit annotation
            const unitHeight = 25; // Height of the AC unit annotation
            const padding = 10;    // Padding between AC units
          
            // Calculate positions to spread AC units evenly within the room
            const totalUnitsInRow = Math.floor(room.width / (unitWidth + padding));
            const row = Math.floor(index / totalUnitsInRow);
            const column = index % totalUnitsInRow;
          
            const x = room.x + padding + column * (unitWidth + padding);
            const y = room.y + padding + row * (unitHeight + padding);
          
            return {
              pageNumber: room.pageNumber,
              x,
              y,
              width: unitWidth,
              height: unitHeight,
            };
          };
          

          const calculateBTUAndPlaceAC = (rooms, pdfDocument) => {
            rooms.forEach((room) => {
              const requiredBTU = room.areaInSquareMeters * 900; // 900 BTU per square meter
              const acUnits = Math.ceil(requiredBTU / 9000); // Assuming each AC unit provides 9000 BTU
          
              // Place AC units in the room
              for (let i = 0; i < acUnits; i++) {
                const acPosition = calculateACPosition(room, i);
                addRectangleAnnotation(pdfDocument, acPosition);
              }
            });
          };

          const getPdfPage = async (pdfDocument, pageNumber) => {
            try {
              // Get the specific page from the PDF document using PDF.js
              const pdfPage = await pdfDocument.getPage(pageNumber);
              return pdfPage;
            } catch (error) {
              console.error(`Error fetching page ${pageNumber}:`, error);
              return null;
            }
          };
          

          const displayUpdatedPDF = (pdfDocument) => {
            pdfViewerInstance.loadDocument(pdfDocument);
          };

          const determineScale = (pdfPage) => {
            // Example: Assume there's a known reference object (like a door or window) on the page
            // Define the real-world length of the reference object (in meters or feet)
            const realWorldReferenceLength = 2; // e.g., 2 meters for a door
          
            // Extract a bounding box or another known size from the PDF page
            const referenceBoundingBox = pdfPage.getBoundingBoxForReferenceObject();
            const pdfReferenceLength = referenceBoundingBox.width; // Length in PDF points
          
            // Calculate the scale based on the real-world length and the PDF length
            const scale = realWorldReferenceLength / pdfReferenceLength;
          
            return scale; // This scale is used to convert PDF dimensions to real-world units
          };
          
        const processPDF = async (pdfPath) => {
            const document = await loadPDF(pdfPath);
            const pdfPage = getPdfPage(document, 1); // Process the first page
          
            const rooms = detectRooms(pdfPage);
            const scale = determineScale(pdfPage); // Assumed function to determine scale
            const roomsWithSizes = calculateRoomSizes(rooms, scale);
            const coloredRooms = assignColorsToRooms(roomsWithSizes);
          
            calculateBTUAndPlaceAC(coloredRooms, document);
            displayUpdatedPDF(document);
          };
          processPDF()
      });
    }
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && instance) {
      const fileUrl = URL.createObjectURL(file);
      instance.UI.loadDocument(fileUrl);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Measurement System</title>
      </Helmet>
      <div>
        <Form>
          <h1 className="header text-center fw-bold">Upload PDF file sample</h1>
          <Form.Group controlId="input">
            <Form.Label>Measurement System:</Form.Label>
            <Form.Control
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="form-control mb-3"
            />
          </Form.Group>
        </Form>
      </div>
      <div className="upload-pdf web-container">
        <div
          className="webViewer"
          ref={viewerDiv} // Attach the ref to the div for WebViewer
          style={{ height: "100vh" }}
        />
      </div>
      <div>
        <BtuCalculator />
      </div>
    </div>
  );
};

export default UploadPDF;
