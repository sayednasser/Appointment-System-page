import mongoose from "mongoose";

const socialLinksSchema = new mongoose.Schema(
  {
    facebook: {
      type: String,
      trim: true,
      default: "",
    },
    instagram: {
      type: String,
      trim: true,
      default: "",
    },
    linkedin: {
      type: String,
      trim: true,
      default: "",
    },
    tiktok: {
      type: String,
      trim: true,
      default: "",
    },
    youtube: {
      type: String,
      trim: true,
      default: "",
    },
    whatsapp: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }
);

const workingHoursSchema = new mongoose.Schema(
  {
    days: {
      type: String,
      trim: true,
      default: "",
    },
    hours: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }
);

const settingsSchema = new mongoose.Schema(
  {
    clinicName: {
      type: String,
      required: true,
      trim: true,
    },

    heroImage: {
      secure_url: String,
      public_id: String,
    },

    favicon: {
      secure_url: String,
      public_id: String,
    },

    heroTitle: {
      type: String,
      trim: true,
      default: "",
    },

    heroSubtitle: {
      type: String,
      trim: true,
      default: "",
    },

    heroDescription: {
      type: String,
      trim: true,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

   

    address: {
      type: String,
      trim: true,
      default: "",
    },

    googleMap: {
      type: String,
      trim: true,
      default: "",
    },

    socialLinks: socialLinksSchema,

    workingHours: workingHoursSchema,

    footerText: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const SettingsModel =
  mongoose.models.Settings || mongoose.model("Settings", settingsSchema);

export default SettingsModel;