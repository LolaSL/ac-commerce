import Tesseract from 'tesseract.js';

/**
 * Paint rooms in a drawing with specified colors, using OCR to identify room names.
 * @param {Object[]} rooms - Array of room objects with details (name, shape, etc.).
 * @param {Object} canvas - The canvas context or drawing library instance.
 * @param {Object} extractedText - Extracted text from OCR, including room names and their positions.
 * @param {number} scaleFactor - Scale factor to adjust for real-world measurements.
 */
export const handleImageForOCR = async (image, canvasRef) => {
  try {
    const { data: { text, lines } } = await Tesseract.recognize(image, 'eng');
    console.log('Extracted text:', text);

    const extractedText = lines.map(line => ({
      text: line.text,
      x: line.bbox.x0,
      y: line.bbox.y0,
      height: line.bbox.y1 - line.bbox.y0
    }));

    if (extractedText.length > 0) {
      const canvas = canvasRef.current;
      paintRoomsWithOCR(canvas, extractedText);
    } else {
      console.error('No text extracted or invalid extractedText.');
    }
  } catch (error) {
    console.error('Error during OCR processing:', error);
  }
};

/**
 * Paint rooms with specified colors based on OCR-extracted text.
 * @param {HTMLCanvasElement} canvas - The canvas element.
 * @param {Object[]} extractedText - Array of extracted text objects from OCR.
 * @param {number} scaleFactor - Scale factor for canvas drawing.
 */
export const paintRoomsWithOCR = (canvas, extractedText, scaleFactor = 1) => {
  const context = canvas.getContext('2d');

  if (!Array.isArray(extractedText)) {
    console.error('Invalid extractedText:', extractedText);
    return;
  }

  // Define color mapping for room types
  const roomColors = {
    "Living": "rgba(255, 215, 0, 0.4)", // Light yellow
    "Dining": "rgba(106, 90, 208, 0.4)", // Lilac-blue
    "Patio": "rgba(238, 130, 238, 0.4)", // Light rose
    "Bedroom": "rgba(173, 216, 230, 0.4)", // Light blue
    "Kitchen": "rgba(144, 238, 144, 0.4)", // Light green
    "Terrace": "rgba(255, 160, 122, 0.4)", // Light coral
    "Family Room": "rgba(245, 148, 39, 0.4)", // Light orange
    "Lounge": "rgba(12, 76, 5, 0.4)", // Deep green
    "MasterBed": "rgba(173, 216, 230, 0.4)", // Light blue
    "Master Bedroom": "rgba(173, 216, 230, 0.4)", // Light blue
    "Second Bedroom": "rgba(173, 216, 230, 0.4)", // Light blue
    "Office": "rgba(89, 15, 121, 0.4)", // Deep lilac
    "Drawing Room": "rgba(23, 97, 89, 0.8)", // Teal
    "Hall": "rgba(122, 225, 22, 0.4)", // Lime green
    "Breakfast Room": "rgba(225, 22, 160, 0.4)", // Fuchsia
    "Bathroom": "rgba(211, 211, 211, 0.4)", // Light gray for unknown rooms
  };


  const blacklist = ["floor plan", "apartment", "title", "bedroom deluxe suite", "independent living", "assisted living"]; // Add more as needed
  const maxTitleHeight = 50; // Example threshold for title size


  extractedText.forEach(({ text, x, y, height }) => {
    const normalizedText = text.toLowerCase();

    // Skip blacklisted or oversized text
    if (height > maxTitleHeight || blacklist.some(keyword => normalizedText.includes(keyword))) {
      console.log(`Skipping text: ${text}`);
      return;
    }

    const roomType = getRoomTypeFromText(text);

    if (!roomType || !roomColors[roomType]) {
      console.warn(`Unrecognized room type: ${text}`);
      return;
    }

    const color = roomColors[roomType];

    // Fixed width and height for room rectangles
    const fixedWidth = 200;
    const fixedHeight = 60;
    const margin = 1;
    const padding = 3;

    // Scale coordinates and dimensions with margins
    const scaledX = x * scaleFactor + margin;
    const scaledY = y * scaleFactor + margin;
    const scaledWidth = fixedWidth * scaleFactor - margin * 2 - padding * 2;
    const scaledHeight = fixedHeight * scaleFactor - margin * 2 - padding * 2;

    // Fill the room with the corresponding color (adjusted for padding)
    context.fillStyle = color;
    context.fillRect(
      scaledX + padding,
      scaledY + padding,
      scaledWidth,
      scaledHeight
    );

    // Optional: Draw a border around the room (adjusted for margin)
    context.strokeStyle = "black"; // Black border for visibility
    context.lineWidth = 2;
    context.strokeRect(scaledX, scaledY, scaledWidth + padding * 2, scaledHeight + padding * 2);

    // Add text overlay for room label
    context.fillStyle = "black";
    context.font = "14px Arial";
    context.fillText(roomType, scaledX + padding + 5, scaledY + padding + 20);
  });
};

/**
 * Determine the room type based on the OCR-extracted text.
 * @param {string} text - Extracted text from OCR.
 * @returns {string|null} Room type or null if unrecognized.
 */
const getRoomTypeFromText = (text) => {
  const normalizedText = text.toLowerCase();

  const roomRegex = {
    "Living": /\b(living|iving|livin|lvin)\b/i,
    "Dining": /\b(dining|dine|dnng)\b/i,
    "Patio": /patio/i,
    "Bedroom": /bed\s?room|br|bdrm|master\s?bedroom|primary\s?bedroom/i,
    "Kitchen": /\b(kitchen|kit|kichen|kitcen|kithcn)\b/i, // Added "kithcn" as an OCR-like typo
    "Terrace": /terrace/i,
    "Family Room": /family\s?room/i,
    "Lounge": /lounge|mstr\s?suite/i,
    "MasterBed": /master\s?bed\s?room|primary\s?bedroom/i,
    "Master Bedroom": /master\s*bed\s*room/i,
    "Second Bedroom": /second\s*bed\s*room/i,
    "Office": /office|home\s?office|study|workspace/i,
    "Drawing Room": /drawing\s?room|study|pooja/i,
    "Hall": /hall|living\s?hall|parking/i,
    "Breakfast Room": /breakfast\s?room|brkfst/i,
    "Bathroom": /\b(bathroom|bath|bthroom|bathrm)\b/i, // Added "bathrm" for OCR-like variations
  };

  for (const [roomType, regex] of Object.entries(roomRegex)) {
    if (regex.test(normalizedText)) {
      return roomType;
    }
  }


  const roomsFound = [];

  for (const [roomType, regex] of Object.entries(roomRegex)) {
    const matches = text.match(regex);
    if (matches) {
      console.log(`Matched ${roomType}:`, matches);
    }
    if (regex.test(text)) {
      roomsFound.push(roomType);
    }
  }

  console.log(roomsFound); // ["Second Bedroom", "Master Bedroom"]
  console.log("Text extracted:", text);
  console.log("Regex Matches:", roomsFound);

  return null;
};

/**
 * Example usage:
 * 
 * const rooms = [
 *   { type: "Living Room", shape: [[10, 20], [210, 20], [210, 170], [10, 170]] },  // Polygon shape
 *   { type: "Bedroom", boundingBox: { x: 250, y: 20, width: 150, height: 150 } },     // Rectangular shape
 *   { type: "Kitchen", shape: [[10, 200], [210, 200], [210, 300], [10, 300]] },      // Polygon shape
 * ];
 * 
 * const extractedText = [
 *   { text: "Living Room", x: 10, y: 20, width: 70, height: 25 },
 *   { text: "Bedroom", x: 250, y: 20, width: 70, height: 25 },
 *   { text: "Kitchen", x: 10, y: 200, width: 70, height: 25 },
 *   { text: "Bedroom", x: 400, y: 20, width: 70, height: 25 },
 *   { text: "Bedroom", x: 550, y: 20, width: 70, height: 25 },
 * ];
 * 
 * const canvasElement = document.getElementById('drawingCanvas');
 * const ctx = canvasElement.getContext('2d');
 * 
 * const scaleFactor = 1; // Adjust scale factor as needed
 * paintRoomsWithOCR(canvasElement, extractedText, scaleFactor);
 */
