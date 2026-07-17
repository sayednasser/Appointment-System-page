import { Router } from "express";
import { successResponse } from "../../common/index.js";
import { validation } from "../../middleware/index.js";
import * as validators from "./appointment.validation.js";
import * as appointmentService from "./appointment.service.js";

const router = Router();


// ================================
// 🕒 GET BOOKED SLOTS
// ================================
router.get("/booked-slots", async (req, res) => {
  const { doctor, date } = req.query;

  const data = await appointmentService.getBookedSlots(
    doctor,
    date
  );

  return successResponse({
    res,
    data,
  });
});
// ================================
// 📄 GET APPOINTMENTS
// ================================
router.get("/", async (req, res) => {
  const data = await appointmentService.getAppointments();
  return successResponse({
    res,
    data,
  });
});

// ================================
// ➕ CREATE APPOINTMENT (public booking)
// ================================
router.post(
  "/",
  validation(validators.createAppointment),
  async (req, res) => {
    const data = await appointmentService.createAppointment(req.body);

    return successResponse({
      res,
      message: "Appointment booked successfully",
      data,
    });
  }
);

// ================================
// ✏️ UPDATE APPOINTMENT
// ================================
router.patch(
  "/:id",
  validation(validators.updateAppointment),
  async (req, res) => {
    const data = await appointmentService.updateAppointment(
      req.params.id,
      req.body
    );

    return successResponse({
      res,
      message: "Appointment updated successfully",
      data,
    });
  }
);

export default router;
