import { z } from "zod";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const publicationSchema = z.object({
    text: z
        .string({
            required_error: "El texto es requerido",
            invalid_type_error: "El texto debe ser de tipo string",
        })
        .trim()
        .min(6, {
            message: "El texto debe contener al menos 6 caracteres",
        })
        .max(255, {
            message: "El texto no debe contener más de 255 caracteres",
        }),
    file: z
        .any()
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file.mimetype),
            "Formato de imagen no soportado"
        )
        .optional(),
});
