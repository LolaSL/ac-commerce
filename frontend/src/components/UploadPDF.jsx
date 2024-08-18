import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import axios from "axios";
import "pdfjs-dist/build/pdf.worker.min.mjs";

pdfjs.GlobalWorkerOptions.workerSrc = "/js/pdf.worker.min.js";

function PdfComp({ pdfFile }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="pdf-div">
      <p>
        Page {pageNumber} of {numPages}
      </p>
      <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        ))}
      </Document>
    </div>
  );
}

function UploadPDF() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [allFiles, setAllFiles] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    getPdf();
  }, []);

  const getPdf = async () => {
    try {
      const result = await axios.get("/api/upload/get-files", {
      });
      setAllFiles(result.data.data);
    } catch (error) {
      console.error("Error fetching PDFs:", error);
    }
  };

  const submitFile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    try {
      const result = await axios.post("/api/upload/upload-files", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (result.data.status === "ok") {
        alert("Uploaded Successfully!");
        getPdf();
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    }
  };
  const showPdf = (pdf) => {
    // window.open(`http://localhost:5030/files/${pdf}`, "_blank", "noreferrer");
    setPdfFile(`/files/${pdf}`);
  };

  return (
    <div className="upload-pdf">
      <form className="formData" onSubmit={submitFile}>
        <h4>Upload PDF</h4>
        <br />
        <input
          type="text"
          className="form-control"
          placeholder="Title"
          required
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <input
          type="file"
          className="form-control"
          accept="application/pdf"
          required
          onChange={(e) => setFile(e.target.files[0])}
        />
        <br />
        <button className="btn btn-secondary" type="submit">
          Submit
        </button>
      </form>
      <div className="uploaded responsive">
        <h4>Uploaded PDFs:</h4>
        <div className="output-div">
          {allFiles.map((data) => (
            <div className="inner-div responsive" key={data._id}>
              <h6>Title: {data.title}</h6>
              <button
                className="btn btn-secondary me-2"
                onClick={() => showPdf(data.pdf)}
              >
                Show PDF
              </button>
            </div>
          ))}
        </div>
      </div>
      {pdfFile && <PdfComp pdfFile={pdfFile} />}
    </div>
  );
}

export default UploadPDF;
