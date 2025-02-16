import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {UsersQueryRepository} from "../../../users/domain/infrastructures/repositories/users-query.repository";
import {Result} from "../../../../shared/infrastructures/result";
import {TokenCommandRepository} from "../../infrastructure/repositories/token-command.repository";
import {SETTINGS} from "../../../../configs/settings";
import {LoginDTO, LoginResponseDTO} from "../interfaces/auth.interface";

export class LoginUseCase {
    constructor(
        private usersQueryRepository: UsersQueryRepository,
        private tokenCommandRepository: TokenCommandRepository
    ) {}

    async execute(dto: LoginDTO): Promise<Result<{ accessToken: string }>> {
        const { loginOrEmail, password } = dto;

        const user = await this.usersQueryRepository.findByFilter({
            $or: [
                { login: loginOrEmail },
                { email: loginOrEmail }
            ]
        });

        if (!user) {
            return Result.fail('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return Result.fail('Invalid credentials');
        }

        const token = jwt.sign(
            {
                userId: user._id.toString(),
                userLogin: user.login
            },
            SETTINGS.JWT_SECRET,
            { expiresIn: '24h' }
        );

        await this.tokenCommandRepository.saveToken(user._id.toString(), token);

        return Result.ok({ accessToken: token });
    }
}