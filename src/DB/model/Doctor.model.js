import mongoose from "mongoose";

const workingHoursSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
      enum: [
        "Saturday",
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
    },

    startTime: {
      type: String,
      required: true,
      trim: true,
    },

    endTime: {
      type: String,
      required: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    specialization: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1500,
    },

    experience: {
      type: Number,
      default: 0,
      min: 0,
    },

    image: {
      secure_url: {
        type: String,
        default: "",
      },

      public_id: {
        type: String,
        default: "",
      },
    },

    workingHours: {
      type: [workingHoursSchema],
      default: [],
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

doctorSchema.index({ displayOrder: 1 });
doctorSchema.index({ isActive: 1 });
doctorSchema.index({ specialization: 1 });

const DoctorModel =
  mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);

export default DoctorModel;