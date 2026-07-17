import { NotFoundException, uploadFile, deleteFile, telegramService } from "../../common/index.js";
import ReviewModel from "../../DB/model/Review.model.js";

const CLOUDINARY_FOLDER = "dentaflow/reviews";

// ================================
// 📄 GET REVIEWS
// ================================
export const getReviews = async () => {
  return await ReviewModel.find().sort({ createdAt: -1 });
};

// ================================
// ➕ CREATE REVIEW (public submission)
// ================================
export const createReview = async (inputs, file) => {
  let image = { secure_url: "", public_id: "" };

  if (file) {
    const { secure_url, public_id } = await uploadFile({
      FilePath: file.path,
      folder: CLOUDINARY_FOLDER,
    });

    image = { secure_url, public_id };
  }

  const review = await ReviewModel.create({
    ...inputs,
    status: "pending",
    image,
  });

  // fire-and-forget, never blocks the response
  telegramService.notifyNewReview(review);

  return review;
};

// ================================
// ✏️ UPDATE REVIEW (accepts any subset of fields, e.g. { status } only)
// ================================
export const updateReview = async (id, inputs, file) => {
  const review = await ReviewModel.findById(id);

  if (!review) {
    throw NotFoundException({ message: "Review not found" });
  }

  if (file) {
    if (review.image?.public_id) {
      await deleteFile(review.image.public_id);
    }

    const { secure_url, public_id } = await uploadFile({
      FilePath: file.path,
      folder: CLOUDINARY_FOLDER,
    });

    inputs.image = { secure_url, public_id };
  }

  if (inputs.status === "approved" && review.status !== "approved") {
    inputs.approvedAt = new Date();
  }

  Object.assign(review, inputs);

  await review.save();

  return review;
};

// ================================
// 🗑️ DELETE REVIEW
// ================================
export const deleteReview = async (id) => {
  const review = await ReviewModel.findById(id);

  if (!review) {
    throw NotFoundException({ message: "Review not found" });
  }

  if (review.image?.public_id) {
    await deleteFile(review.image.public_id);
  }

  await review.deleteOne();

  return review;
};
