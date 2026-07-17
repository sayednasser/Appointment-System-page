import { NotFoundException, uploadFile } from "../../common/index.js";
import SettingsModel from "../../DB/model/Settings.model.js";
const CLOUDINARY_FOLDER = "dentaflow/setting";

// ================================
// ⚙️ CREATE DEFAULT SETTINGS
// ================================
export const createDefaultSettings = async () => {
  const exist = await SettingsModel.findOne();

  if (exist) {
    return exist;
  }

  const settings = await SettingsModel.create({
    clinicName: "Dental Clinic",
  });

  return settings;
};

// ================================
// 📄 GET SETTINGS
// ================================
export const getSettings = async () => {
  let settings = await SettingsModel.findOne();

  if (!settings) {
    settings = await createDefaultSettings();
  }

  return settings;
};

// ================================
// ✏️ UPDATE SETTINGS
// ================================
export const updateSettings = async (inputs, file) => {
  console.log("FILE IN SERVICE:", file)

  let settings = await SettingsModel.findOne();

  if (!settings) {
    settings = await createDefaultSettings();
  }

  if (file) {
    const result = await uploadFile({
      FilePath: file.path,
      folder: CLOUDINARY_FOLDER,
    })

    inputs.heroImage = {
      secure_url: result.secure_url,
      public_id: result.public_id,
    }
  }

  Object.assign(settings, inputs);

  await settings.save();

  return settings;
};