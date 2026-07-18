import {
  NotFoundException,
  BadRequestException,
  ConflictException,
  getDayName,
  generateTimeSlots,
  telegramService,
} from "../../common/index.js";
import AppointmentModel from "../../DB/model/Appointment.model.js";
import DoctorModel from "../../DB/model/Doctor.model.js";

// ================================
// 📄 GET APPOINTMENTS
// ================================
export const getAppointments = async () => {
  return await AppointmentModel.find()
    .populate("doctor")
    .populate("service")
    .sort({ createdAt: -1 });
};

// ================================
// ➕ CREATE APPOINTMENT (public booking)
// ================================
export const createAppointment = async (inputs) => {
  const { doctor: doctorId, appointmentDate, appointmentTime } = inputs;

  const doctor = await DoctorModel.findById(doctorId);

  if (!doctor || !doctor.isActive) {
    throw NotFoundException({ message: "Doctor not found or not active" });
  }

  const dayName = getDayName(appointmentDate);
  

  const daySchedule = doctor.workingHours.find(
    (wh) => wh.day === dayName && wh.isActive
  );

  if (!daySchedule) {
    throw BadRequestException({
      message: "Doctor does not have working hours on this day",
    });
  }

  const availableSlots = generateTimeSlots({
    startTime: daySchedule.startTime,
    endTime: daySchedule.endTime,
  });

  const isSlotAvailable = availableSlots.some(
    (slot) => slot.startTime === appointmentTime
  );

  if (!isSlotAvailable) {
    throw BadRequestException({
      message: "Selected appointment time is not an available slot",
    });
  }

  const startOfDay = new Date(appointmentDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const conflict = await AppointmentModel.findOne({
    doctor: doctorId,
    appointmentDate: { $gte: startOfDay, $lt: endOfDay },
    appointmentTime,
    status: { $ne: "cancelled" },
  });

  if (conflict) {
    throw ConflictException({
      message: "This time slot is already booked for this doctor",
    });
  }

  const appointment = await AppointmentModel.create(inputs);

  try {
    await telegramService.notifyNewAppointment(appointment);
  } catch (err) {
    console.error("Telegram Error:", err);
  }

  return appointment;
};

// ================================
// ✏️ UPDATE APPOINTMENT (status changes, reschedule, etc.)
// ================================
export const updateAppointment = async (id, inputs) => {
  const appointment = await AppointmentModel.findById(id);

  if (!appointment) {
    throw NotFoundException({ message: "Appointment not found" });
  }

  Object.assign(appointment, inputs);

  await appointment.save();

  return await appointment.populate(["doctor", "service"]);
};

// ================================
// 🕒 GET BOOKED SLOTS FOR DOCTOR
// ================================
export const getBookedSlots = async (doctorId, date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const appointments = await AppointmentModel.find({
    doctor: doctorId,
    appointmentDate: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
    status: {
      $ne: "cancelled",
    },
  }).select("appointmentTime");

  return appointments.map(
    (appointment) => appointment.appointmentTime
  );
};