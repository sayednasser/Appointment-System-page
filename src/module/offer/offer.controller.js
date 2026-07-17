import { Router } from "express";
import { successResponse } from "../../common/index.js";
import { validation } from "../../middleware/index.js";
import { uploadCloud, filedValidation } from "../../common/types/multer/index.js";
import * as validators from "./offer.validation.js";
import * as offerService from "./offer.service.js";

const router = Router();

// ================================
// 📄 GET OFFERS
// ================================
router.get("/", async (req, res) => {
  const data = await offerService.getOffers();

  return successResponse({
    res,
    data,
  });
});

// ================================
// ➕ CREATE OFFER
// ================================
router.post(
  "/",
  uploadCloud({ validation: filedValidation.image }).single("image"),
  validation(validators.createOffer),
  async (req, res) => {
    const data = await offerService.createOffer(req.body, req.file);

    return successResponse({
      res,
      message: "Offer created successfully",
      data,
    });
  }
);

// ================================
// ✏️ UPDATE OFFER
// ================================
router.patch(
  "/:id",
  uploadCloud({ validation: filedValidation.image }).single("image"),
  validation(validators.updateOffer),
  async (req, res) => {
    const data = await offerService.updateOffer(
      req.params.id,
      req.body,
      req.file
    );

    return successResponse({
      res,
      message: "Offer updated successfully",
      data,
    });
  }
);

// ================================
// 🗑️ DELETE OFFER
// ================================
router.delete(
  "/:id",
  validation(validators.deleteOffer),
  async (req, res) => {
    const data = await offerService.deleteOffer(req.params.id);

    return successResponse({
      res,
      message: "Offer deleted successfully",
      data,
    });
  }
);

export default router;
