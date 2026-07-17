import { Router } from "express";
import { successResponse } from "../../common/index.js";
import { validation } from "../../middleware/index.js";
import { uploadCloud, filedValidation } from "../../common/types/multer/index.js";
import * as validators from "./review.validation.js";
import * as reviewService from "./review.service.js";

const router = Router();

// ================================
// 📄 GET REVIEWS
// ================================
router.get("/", async (req, res) => {
  const data = await reviewService.getReviews();

  return successResponse({
    res,
    data,
  });
});

// ================================
// ➕ CREATE REVIEW (public site submission)
// ================================
router.post(
  "/",
  uploadCloud({ validation: filedValidation.image }).single("image"),
  validation(validators.createReview),
  async (req, res) => {
    const data = await reviewService.createReview(req.body, req.file);
    return successResponse({
      res,
      message: "Review submitted successfully",
      data,
    });
  }
);

// ================================
// ✏️ UPDATE REVIEW
// ================================
router.patch(
  "/:id",
  uploadCloud({ validation: filedValidation.image }).single("image"),
  validation(validators.updateReview),
  async (req, res) => {
    const data = await reviewService.updateReview(
      req.params.id,
      req.body,
      req.file
    );

    return successResponse({
      res,
      message: "Review updated successfully",
      data,
    });
  }
);

// ================================
// 🗑️ DELETE REVIEW
// ================================
router.delete(
  "/:id",
  validation(validators.deleteReview),
  async (req, res) => {
    const data = await reviewService.deleteReview(req.params.id);

    return successResponse({
      res,
      message: "Review deleted successfully",
      data,
    });
  }
);

export default router;
