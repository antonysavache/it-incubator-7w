import { Router } from "express";
import { authController } from "../../../configs/compositions/auth.composition";
import { authValidationMiddleware } from "../../../configs/compositions/auth.composition";

export const authRouter = Router();

authRouter.post('/login', authController.login);

authRouter.post('/registration',
    authValidationMiddleware.registration,
    authController.register
);

authRouter.post('/registration-confirmation',
    authValidationMiddleware.confirmRegistration,
    authController.confirmRegistration
);

authRouter.post('/registration-email-resending',
    authValidationMiddleware.resendEmail,
    authController.resendConfirmation
);