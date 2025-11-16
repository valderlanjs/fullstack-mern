// routes/certificationRoute.js
import express from "express";
import { 
  getCertificationSection, 
  updateCertificationSection 
} from "../controllers/certificationController.js";
import { upload, handleMulterError } from "../middleware/multer.js";

const certificationRouter = express.Router();

certificationRouter.get("/", getCertificationSection);
certificationRouter.put("/", 
  upload.fields([
    { name: 'fscImage', maxCount: 1 },
    { name: 'dofImage', maxCount: 1 }
  ]), 
  updateCertificationSection
);

export default certificationRouter;