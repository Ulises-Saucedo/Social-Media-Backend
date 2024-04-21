import { z } from "zod";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const userSchema = z.object({
    name: z
        .string({
            required_error: "El nombre de usuario es requerido",
            invalid_type_error: "El nombre debe ser de tipo string",
        })
        .trim()
        .min(6, {
            message: "El nombre debe contener al menos 6 caracteres",
        })
        .max(50, {
            message: "El nombre no debe contener más de 50 caracteres",
        }),
    surname: z
        .string({
            invalid_type_error: "El apellido debe ser de tipo String",
        })
        .trim()
        .min(6, {
            message: "El apellido debe contener al menos 6 caracteres",
        })
        .max(50, {
            message: "El apellido no debe contener más de 50 caracteres",
        })
        .optional(),
    bio: z
        .string({
            invalid_type_error: "La biografía debe ser de tipo String",
        })
        .trim()
        .min(25, {
            message: "La biografía no debe contener más de 25 caracteres",
        })
        .max(255, {
            message: "La biografía no debe contener más de 255 caracteres",
        })
        .optional(),
    nick: z
        .string({
            required_error: "El nick es requerido",
            invalid_type_error: "El nick debe ser de tipo string",
        })
        .trim()
        .min(6, {
            message: "El nombre debe contener al menos 6 caracteres",
        })
        .max(50, {
            message: "El nombre no debe contener más de 50 caracteres",
        }),
    email: z
        .string({
            required_error: "El email es requerido",
            invalid_type_error: "El email debe ser de tipo email",
        })
        .email({
            message: "El email no es válido",
        }),
    password: z
        .string({
            required_error: "La contraseña es requerida",
            invalid_type_error: "La contraseña debe ser de tipo string",
        })
        .trim()
        .min(6, {
            message: "La contraseña debe contener al menos 6 caracteres",
        })
        .max(50, {
            message: "La contraseña no debe contener más de 50 caracteres",
        }),
    role: z
        .enum(["user_role", "admin_role"], {
            errorMap: (issue, ctx) => ({ message: "Rol no válido" }),
        })
        .optional(),
    image: z
        .any()
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file.mimetype),
            "Formato de imagen no soportado"
        )
        .optional(),
});

export const updateUserSchema = z.object({
    name: z
        .string({
            invalid_type_error: "El nombre debe ser de tipo string",
        })
        .trim()
        .min(6, {
            message: "El nombre debe contener al menos 6 caracteres",
        })
        .max(50, {
            message: "El nombre no debe contener más de 50 caracteres",
        })
        .optional(),
    surname: z
        .string({
            invalid_type_error: "El apellido debe ser de tipo String",
        })
        .trim()
        .min(6, {
            message: "El apellido debe contener al menos 6 caracteres",
        })
        .max(50, {
            message: "El apellido no debe contener más de 50 caracteres",
        })
        .optional(),
    bio: z
        .string({
            invalid_type_error: "La biografía debe ser de tipo String",
        })
        .trim()
        .min(25, {
            message: "La biografía no debe contener más de 25 caracteres",
        })
        .max(255, {
            message: "La biografía no debe contener más de 255 caracteres",
        })
        .optional(),
    nick: z
        .string({
            invalid_type_error: "El nick debe ser de tipo string",
        })
        .trim()
        .min(6, {
            message: "El nombre debe contener al menos 6 caracteres",
        })
        .max(50, {
            message: "El nombre no debe contener más de 50 caracteres",
        })
        .optional(),
    email: z
        .string({
            invalid_type_error: "El email debe ser de tipo email",
        })
        .email({
            message: "El email no es válido",
        })
        .optional(),
    password: z
        .string({
            invalid_type_error: "La contraseña debe ser de tipo string",
        })
        .trim()
        .min(6, {
            message: "La contraseña debe contener al menos 6 caracteres",
        })
        .max(50, {
            message: "La contraseña no debe contener más de 50 caracteres",
        })
        .optional(),
    role: z
        .enum(["user_role", "admin_role"], {
            errorMap: (issue, ctx) => ({ message: "Rol no válido" }),
        })
        .optional(),
    image: z
        .any()
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file.mimetype),
            "Formato de imagen no soportado"
        )
        .optional(),
});

export const loginSchema = z.object({
    email: z
        .string({
            required_error: "El email es requerido",
            invalid_type_error: "El email debe ser de tipo email",
        })
        .email({
            message: "El email no es válido",
        }),
    password: z
        .string({
            required_error: "La contraseña es requerida",
            invalid_type_error: "La contraseña debe ser de tipo string",
        })
        .trim()
        .min(6, {
            message: "La contraseña debe contener al menos 6 caracteres",
        })
        .max(50, {
            message: "La contraseña no debe contener más de 50 caracteres",
        }),
});
