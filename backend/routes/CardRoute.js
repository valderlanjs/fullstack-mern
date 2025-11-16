import express from "express";
import {
  createCardGroup,
  getCards,
  deleteCard,
  updateSectionTitle,
} from "../controllers/CardController.js";
import {upload} from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const cardRoute = express.Router();

cardRoute.post(
  "/group",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),
  createCardGroup
);

cardRoute.get("/", getCards);
cardRoute.delete("/:id", adminAuth, deleteCard);

// ✅ Nova rota para atualizar título
cardRoute.post("/title", adminAuth, updateSectionTitle);

export default cardRoute;
