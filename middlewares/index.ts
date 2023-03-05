import { Request, NextFunction } from "express";

export function authorMiddleware(req: Request, res: any, next: NextFunction) {
    res.author  = {
      name: 'Jose',
      lastname: 'Lopez'
    }
    next();
}
