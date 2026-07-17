import { Router } from "express";
import { successResponse } from "../../common/index.js";
import { validation } from "../../middleware/index.js";
import { uploadCloud, filedValidation } from "../../common/types/multer/index.js";
import * as validators from "./gallery.validation.js";
import * as galleryService from "./gallery.service.js";

const router = Router();

// ================================
// 📄 GET GALLERY ITEMS
// ================================
router.get("/", async (req, res) => {
  const data = await galleryService.getGalleryItems();

  return successResponse({
    res,
    data,
  });
});

// ================================
// ➕ CREATE GALLERY ITEM
// ================================
router.post("/",
  uploadCloud({ validation: filedValidation.image }).fields([
    { name: "beforeImage", maxCount: 1 },
    { name: "afterImage", maxCount: 1 },
  ]), validation(validators.createGallery),
  async (req, res) => {
    const data = await galleryService.createGalleryItem(req.body, req.files);
    return successResponse({
      res, message: "Gallery item created successfully", data,
    });
  }
);

// ================================
// ✏️ UPDATE GALLERY ITEM
// ================================
router.patch(
  "/:id",
  uploadCloud({ validation: filedValidation.image }).fields([
    { name: "beforeImage", maxCount: 1 },
    { name: "afterImage", maxCount: 1 },
  ]), validation(validators.updateGallery),
  async (req, res) => {
    const data = await galleryService.updateGalleryItem(
      req.params.id, req.body, req.files
    );

    return successResponse({
      res, message: "Gallery item updated successfully", data,
    });
  }
);

// ================================
// 🗑️ DELETE GALLERY ITEM
// ================================
router.delete(
  "/:id",
  validation(validators.deleteGallery),
  async (req, res) => {
    const data = await galleryService.deleteGalleryItem(req.params.id);

    return successResponse({
      res,
      message: "Gallery item deleted successfully",
      data,
    });
  }
);

export default router;
