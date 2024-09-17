import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import BtuCalculator from "./BtuCalculator";
import Tesseract from "tesseract.js";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/webpack.mjs";
import * as pdfjsLib from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const ExtractPdf = () => {
  const [extractedText, setExtractedText] = useState("");
  const [classifiedData, setClassifiedData] = useState([]);
  const [error, setError] = useState("");

  function extractText(event) {
    const file = event.target.files[0];
    if (file) {
      console.log("File uploaded:", file.name);

      const reader = new FileReader();
      reader.onload = function () {
        const typedarray = new Uint8Array(reader.result);

        // Load the PDF with pdfjs-dist
        getDocument(typedarray)
          .promise.then((pdf) => {
            console.log("PDF loaded");

            pdf.getPage(1).then((page) => {
              const scale = 4;
              const viewport = page.getViewport({ scale });

              const canvas = document.createElement("canvas");
              const context = canvas.getContext("2d");
              canvas.height = viewport.height;
              canvas.width = viewport.width;

              const renderContext = {
                canvasContext: context,
                viewport: viewport,
              };
              page.render(renderContext).promise.then(() => {
                console.log("Page rendered");

                Tesseract.recognize(canvas.toDataURL(), "eng", {
                  logger: (m) => console.log(m),
                })
                  .then(({ data: { text } }) => {
                    console.log("Extracted Text:", text);
                    setExtractedText(text);
                    const classifiedTable = classifyAndExtractData(text);
                    setClassifiedData(classifiedTable);
                  })
                  .catch((err) => {
                    console.error("Error extracting text with OCR:", err);
                    setError("Failed to extract text using OCR.");
                  });
              });
            });
          })
          .catch((err) => {
            console.error("Error loading PDF:", err);
            setError("Failed to load PDF.");
          });
      };
      reader.readAsArrayBuffer(file);
    } else {
      setError("No file uploaded.");
    }
  }

  // Function to classify and extract room types and dimensions, output JSON structure
  const classifyAndExtractData = (text) => {
    const roomPatterns = {
      bedroom: /bed\s?room|br|bdrm/i,
      livingRoom: /living\s?room|lobby|lr|outdoor\s?living/i,
      kitchen: /kitchen|kit/i,
      toilet: /toilet|bath\s?room|wc/i,
      diningRoom: /dining\s?room|dr/i,
      drawingRoom: /drawing\s?room|study|studyroom/i,
      breakfastRoom: /breakfast\s?room|brkfst/i,
      familyRoom: /family\s?room/i,
      lounge: /lounge|l|mstr\s?suite/i,
      hall: /hall/i, // Added hall pattern
    };

    // Adjusted dimension pattern to handle more variations of foot and inch marks
    const dimensionPattern =
      /(\d{1,2})['’]?(\d{1,2})?"?\s*[xX]\s*(\d{1,2})['’]?(\d{1,2})?["”]?/g;

    // Preprocess text: clean up invalid characters
    const cleanedText = text
      .replace(/[^\w\s.'"\dXx]/g, "") // Remove special characters
      .replace(/\s{2,}/g, " ") // Replace multiple spaces with single space
      .trim();

    const lines = cleanedText.split("\n");
    let table = [];

    lines.forEach((line) => {
      console.log("Processing line:", line);
      let roomType = null;

      // Classify room type
      for (const [key, pattern] of Object.entries(roomPatterns)) {
        if (pattern.test(line)) {
          roomType = key;
          console.log("Matched room type:", roomType);
          break;
        }
      }

      // Extract dimensions
      const dimensions = line.match(dimensionPattern);
      console.log("Matched dimensions:", dimensions);

      if (roomType && dimensions) {
        dimensions.forEach((dim) => {
          const [width, height] = dim
            .split(/[xX]/)
            .map((measure) => convertToFeet(measure.trim()));

          // Skip invalid dimensions, e.g., kitchen size mismatch like 15'0"x12'0"
          if (width > 100 || height > 100) {
            console.warn("Suspicious dimension detected:", { width, height });
            return; // Skip overly large dimensions
          }

          const areaSqFt = width * height;
          const areaSqM = areaSqFt * 0.092903;

          table.push({
            roomType,
            width: `${width.toFixed(2)} ft`,
            height: `${height.toFixed(2)} ft`,
            areaSqFt: `${areaSqFt.toFixed(2)} sqft`,
            areaSqM: `${areaSqM.toFixed(2)} sqm`,
          });
        });
      } else {
        console.log(`No dimensions found for ${roomType}`);
      }
    });

    return table;
  };

  // Function to convert measurements to feet
  const convertToFeet = (measure) => {
    const quotePattern = /(\d+)'(\d+)?"/; // For patterns like 12'8"
    const simplePattern = /\d+/; // For simple patterns like 12 or 10X12

    if (quotePattern.test(measure)) {
      const parts = measure.match(quotePattern);
      const feet = parseInt(parts[1], 10);
      const inches = parts[2] ? parseInt(parts[2], 10) : 0;
      return feet + inches / 12;
    } else if (simplePattern.test(measure)) {
      return parseFloat(measure); // Treat the value as feet directly
    }
    return 0; // Default case if no pattern matches
  };

  // Function to download extracted data as JSON
  const downloadJson = () => {
    const jsonContent = JSON.stringify(classifiedData, null, 2); // Convert data to JSON
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "extracted_data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up
  };

  return (
    <div>
      <Helmet>
        <title>UploadPDF</title>
      </Helmet>
      <div>
        <Form>
          <h1 className="measure-header text-center fw-bold mb-4">
            Measurement System
          </h1>
          <Form.Group controlId="input">
            <Form.Label className="mb-4">
              Upload PDF file sample.{" "}
              <strong>*Please, use higher image resolution</strong>
            </Form.Label>
            <Form.Control
              type="file"
              accept="application/pdf"
              onChange={extractText}
              className="form-control mb-3"
            />
          </Form.Group>
        </Form>
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {/* Display the extracted text */}
      <div>
        <h2>Extracted Text:</h2>
        <pre>{extractedText}</pre>
      </div>
      <div>
        <h2>Classified Data:</h2>
        <table className="table table-bordered">
          <thead>
            <tr>
              <td>N/N</td>
              <th>Room Type</th>
              <th>Width (ft)</th>
              <th>Height (ft)</th>
              <th>Area (sqft)</th>
              <th>Area (sqm)</th>
            </tr>
          </thead>
          <tbody>
            {classifiedData.map((item, index) => (
              <tr key={index}>
                <td>{index}</td>
                <td>{item.roomType}</td>
                <td>{item.width}</td>
                <td>{item.height}</td>
                <td>{item.areaSqFt}</td>
                <td>{item.areaSqM}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="my-3">
        <button onClick={downloadJson} className="btn btn-primary">
          Download JSON
        </button>
      </div>
      <div>
        <BtuCalculator />
      </div>
    </div>
  );
};

export default ExtractPdf;
