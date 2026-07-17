import joi from "joi";
import { generalValidationFields } from "../../common/validation.js";

export const createService = {
  body: joi
    .object({
      name: generalValidationFields.name.required(),
      description: generalValidationFields.description.required(),
      icon: joi.string().allow(""),
      displayOrder: generalValidationFields.number,
      isActive: generalValidationFields.boolean,
    })
    .required(),
};

export const updateService = {
  params: joi.object({
    id: generalValidationFields.id.required(),
  }),

  body: joi.object({
    name: generalValidationFields.name,
    description: generalValidationFields.description,
    icon: joi.string().allow(""),
    displayOrder: generalValidationFields.number,
    isActive: generalValidationFields.boolean,
  }),
};

export const deleteService = {
  params: joi.object({
    id: generalValidationFields.id.required(),
  }),
};

export const reorderServices = {
  body: joi
    .object({
      orderedIds: joi
        .array()
        .items(generalValidationFields.id.required())
        .min(1)
        .required(),
    })
    .required(),
};
