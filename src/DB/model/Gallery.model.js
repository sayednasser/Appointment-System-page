import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "",
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },

    beforeImage: {
      secure_url: String,
      public_id: String,
    },

    afterImage: {
      secure_url: String,
      public_id: String,
    },

    displayOrder: {
      type: Number,
      default: 0,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

gallerySchema.index({ displayOrder: 1 });
gallerySchema.index({ isActive: 1 });

const GalleryModel =
  mongoose.models.Gallery || mongoose.model("Gallery", gallerySchema);

export default GalleryModel;