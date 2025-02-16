import { Request, Response } from 'express';
import { LoginUseCase } from "../application/use-cases/login.use-case";
import { RegisterUserUseCase } from '../application/use-cases/register-user.use-case';
import { ConfirmRegistrationUseCase } from '../application/use-cases/confirm-registration.use-case';
import { ResendConfirmationUseCase } from '../application/use-cases/resend-confirmation.use-case';
import { LoginDTO } from "../application/interfaces/auth.interface";

export class AuthController {
    constructor(
        private loginUseCase: LoginUseCase,
        private registerUserUseCase: RegisterUserUseCase,
        private confirmRegistrationUseCase: ConfirmRegistrationUseCase,
        private resendConfirmationUseCase: ResendConfirmationUseCase
    ) {}

    login = async (req: Request<{}, {}, LoginDTO>, res: Response) => {
        const result = await this.loginUseCase.execute(req.body);

        if (result.isFailure()) {
            return res.sendStatus(401);
        }

        return res.status(200).json({
            accessToken: result.getValue().accessToken
        });
    }

    register = async (req: Request, res: Response) => {
        const result = await this.registerUserUseCase.execute(req.body);

        if (result.isFailure()) {
            const error = result.getError();
            if (typeof error === 'string') {
                return res.status(400).json({
                    errorsMessages: [{ message: error, field: 'none' }]
                });
            }
            return res.status(400).json(error);
        }

        return res.sendStatus(204);
    }

    confirmRegistration = async (req: Request, res: Response) => {
        const result = await this.confirmRegistrationUseCase.execute(req.query.code as string);

        if (result.isFailure()) {
            return res.status(400).json({
                errorsMessages: [{ message: result.getError(), field: 'code' }]
            });
        }

        return res.sendStatus(204);
    }

    resendConfirmation = async (req: Request, res: Response) => {
        const result = await this.resendConfirmationUseCase.execute(req.body.email);

        if (result.isFailure()) {
            return res.status(400).json({
                errorsMessages: [{ message: result.getError(), field: 'email' }]
            });
        }

        return res.sendStatus(204);
    }
}