import { Request, Response } from 'express';
import {LoginUseCase} from "../application/use-cases/login.use-case";
import {LoginDTO} from "../application/interfaces/auth.interface";

export class AuthController {
    constructor(private loginUseCase: LoginUseCase) {}

    login = async (req: Request<{}, {}, LoginDTO>, res: Response) => {
        const result = await this.loginUseCase.execute(req.body);

        if (result.isFailure()) {
            return res.sendStatus(401);
        }

        return res.status(200).json({
            accessToken: result.getValue().accessToken
        });
    }
}