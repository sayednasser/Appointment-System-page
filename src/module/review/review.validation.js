import joi from "joi";
import { generalValidationFields } from "../../common/validation.js";

export const createReview = {
  body: joi
    .object({
      name: generalValidationFields.name.required(),
      rating: joi.number().integer().min(1).max(5).required(),
      comment: generalValidationFields.description.required(),
      image: joi.any(),
    })
    .required(),
};

export const updateReview = {
  params: joi.object({
    id: generalValidationFields.id.required(),
  }),

  body: joi.object({
    name: generalValidationFields.name,
    rating: joi.number().integer().min(1).max(5),
    comment: generalValidationFields.description,
    status: joi.string().valid("pending", "approved", "rejected"),
    image: joi.any(),
  }),
};

export const deleteReview = {
  params: joi.object({
    id: generalValidationFields.id.required(),
  }),
};