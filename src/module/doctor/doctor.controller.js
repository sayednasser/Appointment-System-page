import { Router } from "express";
import { successResponse } from "../../common/index.js";
import { validation } from "../../middleware/index.js";
import { uploadCloud, filedValidation } from "../../common/types/multer/index.js";
import * as validators from "./doctor.validation.js";
import * as doctorService from "./doctor.service.js";

const router = Router();

// Multer parses multipart/form-data, so array/object fields (e.g. workingHours)
// arrive as JSON strings. Parse them back before validation runs.
const parseJsonFields = (fields = []) => {
  return (req, res, next) => {
    for (const field of fields) {
      if (typeof req.body[field] === "string") {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch {
          // leave as-is, validation will reject it with a clear error
        }
      }
    }
    next();
  };
};

// ================================
// 📄 GET DOCTORS
// ================================
router.get("/", async (req, res) => {
  const data = await doctorService.getDoctors();
  return successResponse({ res, data, });
});

// ================================
// ➕ CREATE DOCTOR
// ================================
router.post(
  "/",
  uploadCloud({ validation: filedValidation.image }).single("image"),
  parseJsonFields(["workingHours"]),
  validation(validators.createDoctor),
  async (req, res) => {
    const data = await doctorService.createDoctor(req.body, req.file);
    return successResponse({
      res,
      message: "Doctor created successfully",
      data,
    });
  }
);

// ================================
// ✏️ UPDATE DOCTOR
// ================================
router.patch(
  "/:id",
  uploadCloud({ validation: filedValidation.image }).single("image"),
  parseJsonFields(["workingHours"]),
  validation(validators.updateDoctor),
  async (req, res) => {
    const data = await doctorService.updateDoctor(
      req.params.id,
      req.body,
      req.file
    );

    return successResponse({
      res,
      message: "Doctor updated successfully",
      data,
    });
  }
);

// ================================
// 🗑️ DELETE DOCTOR
// ================================
router.delete(
  "/:id",
  validation(validators.deleteDoctor),
  async (req, res) => {
    const data = await doctorService.deleteDoctor(req.params.id);

    return successResponse({
      res,
      message: "Doctor deleted successfully",
      data,
    });
  }
);

export default router;
