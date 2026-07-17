import joi from "joi";
import { generalValidationFields } from "../../common/validation.js";

const workingHourSchema = joi.object({
  day: joi
    .string()
    .valid(
      "Saturday",
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    )
    .required(),

  startTime: generalValidationFields.time.required(),

  endTime: generalValidationFields.time.required(),

  isActive: generalValidationFields.boolean,
});

export const createDoctor = {
  body: joi
    .object({
      name: generalValidationFields.name.required(),
      specialization: generalValidationFields.name.required(),
      description: generalValidationFields.description,
      experience: generalValidationFields.number.min(0),
      workingHours: joi.array().items(workingHourSchema),
      displayOrder: generalValidationFields.number,
      isActive: generalValidationFields.boolean,
    })
    .required(),
};

export const updateDoctor = {
  params: joi.object({
    id: generalValidationFields.id.required(),
  }),

  body: joi.object({
    name: generalValidationFields.name,
    specialization: generalValidationFields.name,
    description: generalValidationFields.description,
    experience: generalValidationFields.number.min(0),
    workingHours: joi.array().items(workingHourSchema),
    displayOrder: generalValidationFields.number,
    isActive: generalValidationFields.boolean,
  }),
};

export const deleteDoctor = {
  params: joi.object({
    id: generalValidationFields.id.required(),
  }),
};
