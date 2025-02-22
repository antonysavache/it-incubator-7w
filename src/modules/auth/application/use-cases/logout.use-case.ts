import { Result } from "../../../../shared/infrastructures/result";
import { TokenCommandRepository } from "../../infrastructure/repositories/token-command.repository";

export class LogoutUseCase {
    constructor(
        private tokenCommandRepository: TokenCommandRepository
    ) {}

    async execute(refreshToken: string): Promise<Result<void>> {
        if (!refreshToken) {
            return Result.fail('Refresh token is required');
        }

        await this.tokenCommandRepository.invalidateToken(refreshToken);
        return Result.ok();
    }
}