// src/configs/compositions/auth.composition.ts

import { LoginUseCase } from "../../modules/auth/application/use-cases/login.use-case";
import { AuthController } from "../../modules/auth/api/auth.controller";
import { RegisterUserUseCase } from "../../modules/auth/application/use-cases/register-user.use-case";
import { ConfirmRegistrationUseCase } from "../../modules/auth/application/use-cases/confirm-registration.use-case";
import { ResendConfirmationUseCase } from "../../modules/auth/application/use-cases/resend-confirmation.use-case";
import { EmailService } from "../../modules/auth/infrastructure/services/email.service";
import { AuthValidationMiddleware } from "../../modules/auth/api/auth-validation.middleware";
import {
    tokenCommandRepository, userConfirmationRepository,
    usersCommandRepository,
    usersQueryRepository
} from "./repositories";
import { userSpecification } from "./users-composition";

// Services
export const emailService = new EmailService();

// Use Cases
export const loginUseCase = new LoginUseCase(
    usersQueryRepository,
    tokenCommandRepository
);

export const registerUserUseCase = new RegisterUserUseCase(
    usersQueryRepository,
    usersCommandRepository,
    userSpecification,
    emailService,
    userConfirmationRepository
);

export const confirmRegistrationUseCase = new ConfirmRegistrationUseCase(
    userConfirmationRepository
);

export const resendConfirmationUseCase = new ResendConfirmationUseCase(
    userConfirmationRepository,
    emailService,
    usersQueryRepository
);

// Validation Middleware
export const authValidationMiddleware = new AuthValidationMiddleware(
    userConfirmationRepository,
    usersQueryRepository
);

// Controller
export const authController = new AuthController(
    loginUseCase,
    registerUserUseCase,
    confirmRegistrationUseCase,
    resendConfirmationUseCase
);