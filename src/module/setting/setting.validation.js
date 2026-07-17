import joi from "joi";

export const updateSettings = {
  body: joi
    .object({
      clinicName: joi.string().min(2).max(100),

      heroTitle: joi.string().max(200),

      heroSubtitle: joi.string().max(300),

      heroDescription: joi.string().max(2000),

      phone: joi.string(),

  

      address: joi.string().max(300),

      googleMap: joi.string().uri(),

      socialLinks: joi.object({
        facebook: joi.string().allow(""),
        instagram: joi.string().allow(""),
        linkedin: joi.string().allow(""),
        tiktok: joi.string().allow(""),
        youtube: joi.string().allow(""),
        whatsapp: joi.string().allow(""),
      }),

      workingHours: joi.object({
        days: joi.string().allow(""),
        hours: joi.string().allow(""),
      }),

      footerText: joi.string().max(500),
    })
   
};
