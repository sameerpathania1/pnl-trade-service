import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateSchema = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: result.error.format(),
    });
  }

  req.body = result.data;
  next();
};