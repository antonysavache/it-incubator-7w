import { Request, Response } from 'express';
import { LoginUseCase } from "../application/use-cases/login.use-case";
import { RegisterUserUseCase } from '../application/use-cases/register-user.use-case';
import { ConfirmRegistrationUseCase } from '../application/use-cases/confirm-registration.use-case';
import { ResendConfirmationUseCase } from '../application/use-cases/resend-confirmation.use-case';
import { LoginDTO } from "../application/interfaces/auth.interface";
import {RefreshTokenUseCase} from "../application/use-cases/refresh-token.use-case";
import {LogoutUseCase} from "../application/use-cases/logout.use-case";
import {GetMeUseCase} from "../application/use-cases/get-me.use-case";
import {TOKEN_SETTINGS} from "../domain/interfaces/token.interface";
import {RequestWithUser} from "../../../shared/types/express";

export class AuthController {
    constructor(
        private loginUseCase: LoginUseCase,
        private registerUserUseCase: RegisterUserUseCase,
        private confirmRegistrationUseCase: ConfirmRegistrationUseCase,
        private resendConfirmationUseCase: ResendConfirmationUseCase,
        private refreshTokenUseCase: RefreshTokenUseCase,
        private logoutUseCase: LogoutUseCase,
        private getMeUseCase: GetMeUseCase
    ) {}

    login = async (req: Request<{}, {}, LoginDTO>, res: Response) => {
        const result = await this.loginUseCase.execute(req.body);

        if (result.isFailure()) {
            return res.sendStatus(401);
        }

        const { accessToken, refreshToken } = result.getValue();

        res.cookie('refreshToken', refreshToken, TOKEN_SETTINGS.REFRESH_TOKEN_COOKIE);
        return res.status(200).json({ accessToken });
    }

    refreshToken = async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.sendStatus(401);
        }

        const result = await this.refreshTokenUseCase.execute(refreshToken);

        if (result.isFailure()) {
            return res.sendStatus(401);
        }

        const { accessToken, newRefreshToken } = result.getValue();

        res.cookie('refreshToken', newRefreshToken, TOKEN_SETTINGS.REFRESH_TOKEN_COOKIE);
        return res.status(200).json({ accessToken });
    }

    logout = async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.sendStatus(401);
        }

        const result = await this.logoutUseCase.execute(refreshToken);

        if (result.isFailure()) {
            return res.sendStatus(401);
        }

        res.clearCookie('refreshToken');
        return res.sendStatus(204);
    }

    getMe = async (req: RequestWithUser, res: Response) => {
        const result = await this.getMeUseCase.execute(req.user.id);

        if (result.isFailure()) {
            return res.sendStatus(401);
        }

        return res.status(200).json(result.getValue());
    }

    register = async (req: Request, res: Response) => {
        const result = await this.registerUserUseCase.execute(req.body);

        if (result.isFailure()) {
            const error = result.getError();
            if (typeof error === 'object' && 'errorsMessages' in error) {
                return res.status(400).json(error);
            }
            return res.status(400).json({
                errorsMessages: [{ message: error as string, field: 'none' }]
            });
        }

        return res.sendStatus(204);
    }

    confirmRegistration = async (req: Request, res: Response) => {
        const result = await this.confirmRegistrationUseCase.execute(req.body.code);

        if (result.isFailure()) {
            return res.status(400).json({
                errorsMessages: [{
                    message: result.getError(),
                    field: 'code'
                }]
            });
        }

        return res.sendStatus(204);
    }

    resendConfirmation = async (req: Request, res: Response) => {
        const result = await this.resendConfirmationUseCase.execute(req.body.email);

        if (result.isFailure()) {
            const error = result.getError();
            return res.status(400).json({
                errorsMessages: [{
                    message: error,
                    field: 'email'
                }]
            });
        }

        return res.sendStatus(204);
    }
}