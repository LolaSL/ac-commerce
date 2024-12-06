import cv2
from PIL import Image
import fitz  # PyMuPDF for handling PDFs


def annotate_pdf(filename):
    """
    Annotates a PDF file by drawing rectangles and circles around predefined room centers.
    """
    # Open the PDF file
    doc = fitz.open(filename)
    
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        
        # Example: Predefined room center coordinates
        room_centers = [(100, 200), (300, 400)]
        
        for (center_x, center_y) in room_centers:
            rect = fitz.Rect(center_x - 20, center_y - 20, center_x + 20, center_y + 20)
            page.draw_rect(rect, color=(0, 0, 255), width=2)  # Blue rectangle with width 2
            page.draw_circle(fitz.Point(center_x, center_y), radius=10, color=(255, 0, 0))  # Red circle

    # Save the annotated file in the 'annotated_uploads' folder
    annotated_filename = f"annotated_{os.path.basename(filename)}"
    annotated_filepath = os.path.join(ANNOTATED_UPLOAD_FOLDER, annotated_filename)
    doc.save(annotated_filepath)

    return annotated_filename

    

def annotate_image(file_path):
    # Open image
    image = cv2.imread(file_path)
    # Example: Detect features (rooms) and annotate the center (pseudo code)
    # Use OpenCV to detect objects or rooms (you may need custom room detection logic)
    center = (image.shape[1] // 2, image.shape[0] // 2)  # Just an example (center of the image)
    cv2.circle(image, center, 10, (0, 255, 0), -1)  # Draw a circle in the center
    # Save the annotated image
    output_path = file_path.replace(".jpg", "_annotated.jpg")
    cv2.imwrite(output_path, image)
    return output_path

