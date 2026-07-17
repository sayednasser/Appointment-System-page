import { NotFoundException, uploadFile, deleteFile } from "../../common/index.js";
import DoctorModel from "../../DB/model/Doctor.model.js";

const CLOUDINARY_FOLDER = "dentaflow/doctors";

// ================================
// 📄 GET DOCTORS
// ================================
export const getDoctors = async () => {
  return await DoctorModel.find().sort({ displayOrder: 1 });
};

// ================================
// ➕ CREATE DOCTOR
// ================================
export const createDoctor = async (inputs, file) => {
  let image = { secure_url: "", public_id: "" };

  if (file) {
    const { secure_url, public_id } = await uploadFile({
      FilePath: file.path,
      folder: CLOUDINARY_FOLDER,
    });

    image = { secure_url, public_id };
  }

  const doctor = await DoctorModel.create({ ...inputs, image });

  return doctor;
};

// ================================
// ✏️ UPDATE DOCTOR
// ================================
export const updateDoctor = async (id, inputs, file) => {
  const doctor = await DoctorModel.findById(id);

  if (!doctor) {
    throw NotFoundException({ message: "Doctor not found" });
  }

  if (file) {
    if (doctor.image?.public_id) {
      await deleteFile(doctor.image.public_id);
    }

    const { secure_url, public_id } = await uploadFile({
      FilePath: file.path,
      folder: CLOUDINARY_FOLDER,
    });

    inputs.image = { secure_url, public_id };
  }

  Object.assign(doctor, inputs);

  await doctor.save();

  return doctor;
};

// ================================
// 🗑️ DELETE DOCTOR
// ================================
export const deleteDoctor = async (id) => {
  const doctor = await DoctorModel.findById(id);

  if (!doctor) {
    throw NotFoundException({ message: "Doctor not found" });
  }

  if (doctor.image?.public_id) {
    await deleteFile(doctor.image.public_id);
  }

  await doctor.deleteOne();

  return doctor;
};
