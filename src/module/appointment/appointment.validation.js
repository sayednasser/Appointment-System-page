  import joi from "joi";
  import { generalValidationFields } from "../../common/validation.js";

  export const createAppointment = {
    body: joi
      .object({
        patientName: generalValidationFields.name.required(),
        phone: generalValidationFields.phone.required(),
        doctor: generalValidationFields.id.required(),
        service: generalValidationFields.id.required(),
        appointmentDate: generalValidationFields.date.required(),
        appointmentTime: generalValidationFields.time.required(),
        notes: joi.string().max(1000).allow(""),
      })
      .required(),
  };

  export const updateAppointment = {
    params: joi.object({
      id: generalValidationFields.id.required(),
    }),

    body: joi.object({
      patientName: generalValidationFields.name,
      phone: generalValidationFields.phone,
      doctor: generalValidationFields.id,
      service: generalValidationFields.id,
      appointmentDate: generalValidationFields.date,
      appointmentTime: generalValidationFields.time,
      notes: joi.string().max(1000).allow(""),
      status: joi.string().valid("pending", "confirmed", "completed", "cancelled"),
      isActive: generalValidationFields.boolean,
    }),
  };
