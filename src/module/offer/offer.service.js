import {
  NotFoundException,
  BadRequestException,
  uploadFile,
  deleteFile,
  telegramService,
} from "../../common/index.js";
import OfferModel from "../../DB/model/Offer.model.js";

const CLOUDINARY_FOLDER = "dentaflow/offers";

const assertValidPricingAndDates = ({ oldPrice, newPrice, startDate, endDate }) => {
  if (newPrice > oldPrice) {
    throw BadRequestException({
      message: "newPrice must be less than or equal to oldPrice",
    });
  }

  if (new Date(endDate) <= new Date(startDate)) {
    throw BadRequestException({
      message: "endDate must be after startDate",
    });
  }
};

// ================================
// 📄 GET OFFERS
// ================================
export const getOffers = async () => {
  return await OfferModel.find().populate("service").sort({ createdAt: -1 });
};

// ================================
// ➕ CREATE OFFER
// ================================
export const createOffer = async (inputs, file) => {
  assertValidPricingAndDates(inputs);

  let image = { secure_url: "", public_id: "" };

  if (file) {
    const { secure_url, public_id } = await uploadFile({
      FilePath: file.path,
      folder: CLOUDINARY_FOLDER,
    });

    image = { secure_url, public_id };
  }

  const offer = await OfferModel.create({ ...inputs, image });

  // fire-and-forget, never blocks the response
  telegramService.notifyOfferPublished(offer);

  return offer;
};

// ================================
// ✏️ UPDATE OFFER
// ================================
export const updateOffer = async (id, inputs, file) => {
  const offer = await OfferModel.findById(id);

  if (!offer) {
    throw NotFoundException({ message: "Offer not found" });
  }

  assertValidPricingAndDates({
    oldPrice: inputs.oldPrice ?? offer.oldPrice,
    newPrice: inputs.newPrice ?? offer.newPrice,
    startDate: inputs.startDate ?? offer.startDate,
    endDate: inputs.endDate ?? offer.endDate,
  });

  if (file) {
    if (offer.image?.public_id) {
      await deleteFile(offer.image.public_id);
    }

    const { secure_url, public_id } = await uploadFile({
      FilePath: file.path,
      folder: CLOUDINARY_FOLDER,
    });

    inputs.image = { secure_url, public_id };
  }

  const wasActive = offer.isActive;

  Object.assign(offer, inputs);

  await offer.save();

  // If this update just activated the offer, notify Telegram too.
  if (!wasActive && offer.isActive) {
    telegramService.notifyOfferPublished(offer);
  }

  return offer;
};

// ================================
// 🗑️ DELETE OFFER
// ================================
export const deleteOffer = async (id) => {
  const offer = await OfferModel.findById(id);

  if (!offer) {
    throw NotFoundException({ message: "Offer not found" });
  }

  if (offer.image?.public_id) {
    await deleteFile(offer.image.public_id);
  }

  await offer.deleteOne();

  return offer;
};
