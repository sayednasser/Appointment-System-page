import { NotFoundException, uploadFile, deleteFile } from "../../common/index.js";
import ServiceModel from "../../DB/model/Service.model.js";

const CLOUDINARY_FOLDER = "dentaflow/services";

// ================================
// 📄 GET SERVICES
// ================================
export const getServices = async () => {
  return await ServiceModel.find().sort({ displayOrder: 1 });
};

// ================================
// ➕ CREATE SERVICE
// ================================
export const createService = async (inputs, file) => {
  let image = { secure_url: "", public_id: "" };

  if (file) {
    const { secure_url, public_id } = await uploadFile({
      FilePath: file.path,
      folder: CLOUDINARY_FOLDER,
    });

    image = { secure_url, public_id };
  }

  const service = await ServiceModel.create({ ...inputs, image });

  return service;
};

// ================================
// ✏️ UPDATE SERVICE
// ================================
export const updateService = async (id, inputs, file) => {
  const service = await ServiceModel.findById(id);

  if (!service) {
    throw NotFoundException({ message: "Service not found" });
  }

  if (file) {
    if (service.image?.public_id) {
      await deleteFile(service.image.public_id);
    }

    const { secure_url, public_id } = await uploadFile({
      FilePath: file.path,
      folder: CLOUDINARY_FOLDER,
    });

    inputs.image = { secure_url, public_id };
  }

  Object.assign(service, inputs);

  await service.save();

  return service;
};

// ================================
// 🗑️ DELETE SERVICE
// ================================
export const deleteService = async (id) => {
  const service = await ServiceModel.findById(id);

  if (!service) {
    throw NotFoundException({ message: "Service not found" });
  }

  if (service.image?.public_id) {
    await deleteFile(service.image.public_id);
  }

  await service.deleteOne();

  return service;
};

// ================================
// 🔀 REORDER SERVICES
// ================================
export const reorderServices = async (orderedIds) => {
  const operations = orderedIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { displayOrder: index },
    },
  }));

  await ServiceModel.bulkWrite(operations);

  return await getServices();
};
