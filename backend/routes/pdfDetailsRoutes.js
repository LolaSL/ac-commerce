// import express from 'express';
// import PdfDetails from '../models/pdfDetails.js';

// const pdfDetailsRouter = express.Router();

// pdfDetailsRouter.post("/upload-files", upload.single("file"), async (req, res) => {
//     console.log(req.file);
//     const title = req.body.title;
//     const fileName = req.file.filename;
//     try {
//       await PdfDetails.create({ title: title, pdf: fileName });
//       res.send({ status: "ok" });
//     } catch (error) {
//       res.json({ status: error });
//     }
//   });
  
//   pdfDetailsRouter.get("/get-files", async (req, res) => {
//     try {
//      PdfDetails.find({}).then((data) => {
//         res.send({ status: "ok", data: data });
//       });
//     } catch (error) {
//         res.json({ status: error });
//     }
//   });

// export default pdfDetailsRouter;