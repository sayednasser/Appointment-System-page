import joi from "joi";
import { generalValidationFields } from "../../common/validation.js";

export const createGallery = {
  body: joi
    .object({
      title: joi.string().max(100).allow(""),
      description: joi.string().max(1000).allow(""),
      displayOrder: generalValidationFields.number,
      isActive: generalValidationFields.boolean,
    })
    .required(),
};

export const updateGallery = {
  params: joi.object({
    id: generalValidationFields.id.required(),
  }),

  body: joi.object({
    title: joi.string().max(100).allow(""),
    description: joi.string().max(1000).allow(""),
    displayOrder: generalValidationFields.number,
    isActive: generalValidationFields.boolean,
  }),
};

export const deleteGallery = {
  params: joi.object({
    id: generalValidationFields.id.required(),
  }),
};