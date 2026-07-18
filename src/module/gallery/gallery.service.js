import { NotFoundException, uploadFile, deleteFile } from "../../common/index.js";
import GalleryModel from "../../DB/model/Gallery.model.js";

const CLOUDINARY_FOLDER = "dentaflow/gallery";

// ================================
// 📄 GET GALLERY ITEMS
// ================================
export const getGalleryItems = async () => {
  return await GalleryModel.find().sort({ displayOrder: 1 });
};

// ================================
// ➕ CREATE GALLERY ITEM
// ================================ 
export const createGalleryItem = async (inputs, files) => {
  let beforeImage = { secure_url: "", public_id: "" };
  let afterImage = { secure_url: "", public_id: "" };

  if (files?.beforeImage?.[0]) {
    const { secure_url, public_id } = await uploadFile({
      FilePath: files.beforeImage[0].path,
      folder: CLOUDINARY_FOLDER,
    });

    beforeImage = { secure_url, public_id };
  }

  if (files?.afterImage?.[0]) {
    const { secure_url, public_id } = await uploadFile({
      FilePath: files.afterImage[0].path,
      folder: CLOUDINARY_FOLDER,
    });

    afterImage = { secure_url, public_id };
  }

  const item = await GalleryModel.create({
    ...inputs,
    beforeImage,
    afterImage,
  });

  return item;
};

// ================================
// ✏️ UPDATE GALLERY ITEM
// ================================
export const updateGalleryItem = async (id, inputs, files) => {
  const item = await GalleryModel.findById(id);

  if (!item) {
    throw NotFoundException({ message: "Gallery item not found" });
  }

  if (files?.beforeImage?.[0]) {
    if (item.beforeImage?.public_id) {
      await deleteFile(item.beforeImage.public_id);
    }

    const { secure_url, public_id } = await uploadFile({
      FilePath: files.beforeImage[0].path,
      folder: CLOUDINARY_FOLDER,
    });

    inputs.beforeImage = { secure_url, public_id };
  }

  if (files?.afterImage?.[0]) {
    if (item.afterImage?.public_id) {
      await deleteFile(item.afterImage.public_id);
    }

    const { secure_url, public_id } = await uploadFile({
      FilePath: files.afterImage[0].path,
      folder: CLOUDINARY_FOLDER,
    });

    inputs.afterImage = { secure_url, public_id };
  }

  Object.assign(item, inputs);

  await item.save();

  return item;
};

// ================================
// 🗑️ DELETE GALLERY ITEM
// ================================
export const deleteGalleryItem = async (id) => {
  const item = await GalleryModel.findById(id);

  if (!item) {
    throw NotFoundException({ message: "Gallery item not found" });
  }

  if (item.beforeImage?.public_id) {
    await deleteFile(item.beforeImage.public_id);
  }

  if (item.afterImage?.public_id) {
    await deleteFile(item.afterImage.public_id);
  }

  await item.deleteOne();

  return item;
};