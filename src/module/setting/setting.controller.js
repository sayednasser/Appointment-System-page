import { Router } from "express";
import { successResponse } from "../../common/index.js";
import { validation } from "../../middleware/index.js";
import * as validators from "./setting.validation.js";
import * as settingService from "./setting.service.js";
import { uploadCloud } from "../../common/types/multer/cloud.multer.js";
import { filedValidation } from "../../common/types/multer/multer.validation.js";

const router = Router();

const parseJsonFields = (fields = []) => {
    return (req, res, next) => {
        fields.forEach((field) => {
            if (typeof req.body[field] === 'string') {
                try {
                    req.body[field] = JSON.parse(req.body[field])
                } catch { }
            }
        })

        next()
    }
}
// ================================
// 📄 GET SETTINGS
// ================================
router.get("/", async (req, res) => {
    const data = await settingService.getSettings();

    return successResponse({
        res,
        data,
    });
});

// ================================
// ✏️ UPDATE SETTINGS
// ================================
router.patch(
    "/",
    uploadCloud({ validation: filedValidation.image }).single("image"),
    parseJsonFields(['socialLinks']),
    validation(validators.updateSettings),
    async (req, res) => {
        
        const data = await settingService.updateSettings(req.body, req.file);
        return successResponse({ res, data, });
    }
);

router.post(
  "/admin-access",
  validation(validators.adminAccess),
  async (req, res) => {
    const success = await settingService.checkAdminAccess(req.body.code);

    return successResponse({
      res,
      data: {
        success,
      },
    });
  }
);  

export default router;

