import joi from "joi";
import { generalValidationFields } from "../../common/validation.js";

export const createOffer = {
  body: joi
    .object({
      title: generalValidationFields.title.required(),
      description: generalValidationFields.description.required(),
      service: generalValidationFields.id,
      oldPrice: generalValidationFields.number.min(0).required(),
      newPrice: generalValidationFields.number.min(0).required(),
      discountPercentage: generalValidationFields.number.min(0).max(100),
      startDate: generalValidationFields.date.required(),
      endDate: generalValidationFields.date.required(),
      isActive: generalValidationFields.boolean,
    })
    .required(),
};

export const updateOffer = {
  params: joi.object({
    id: generalValidationFields.id.required(),
  }),

  body: joi.object({
    title: generalValidationFields.title,
    description: generalValidationFields.description,
    service: generalValidationFields.id,
    oldPrice: generalValidationFields.number.min(0),
    newPrice: generalValidationFields.number.min(0),
    discountPercentage: generalValidationFields.number.min(0).max(100),
    startDate: generalValidationFields.date,
    endDate: generalValidationFields.date,
    isActive: generalValidationFields.boolean,
  }),
};

export const deleteOffer = {
  params: joi.object({
    id: generalValidationFields.id.required(),
  }),
};
