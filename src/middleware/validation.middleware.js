import { BadRequestException } from "../common/index.js";

// export const validation = (schema) => {
//     return (req, res, next) => {

//         const keys = Object.keys(schema) || []
//         const errors = []
//         for (const key of keys) {
//             const validResult = schema[key].validate(req[key], { abortEarly: false })
//             if (validResult.error) {
//                 errors.push({ key, details: validResult.error.details?.map(ele => { return { message: ele.message, path:ele.path } }) })
//             }
//         }
//         if (errors.length) {
//             throw BadRequestException({ message: "validation errors", extra: { errors } })
//         }
//         next()

//     }


// }
export const validation = (schema) => {
  return (req, res, next) => {
    const keys = Object.keys(schema) || []
    const errors = []

    for (const key of keys) {
      const validResult = schema[key].validate(req[key], {
        abortEarly: false,
      })

      if (validResult.error) {
        console.log(
          `VALIDATION ERROR IN ${key}:`,
          JSON.stringify(validResult.error.details, null, 2)
        )

        errors.push({
          key,
          details: validResult.error.details?.map((ele) => ({
            message: ele.message,
            path: ele.path,
          })),
        })
      }
    }

    if (errors.length) {
      console.log(JSON.stringify(errors, null, 2))

      throw BadRequestException({
        message: 'validation errors',
        extra: { errors },
      })
    }

    next()
  }
}