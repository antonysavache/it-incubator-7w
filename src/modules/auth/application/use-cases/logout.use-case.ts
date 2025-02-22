import { Result } from "../../../../shared/infrastructures/result";
import { TokenCommandRepository } from "../../infrastructure/repositories/token-command.repository";

export class LogoutUseCase {
    constructor(
        private tokenCommandRepository: TokenCommandRepository
    ) {}

    async execute(refreshToken: string): Promise<Result<void>> {
        const invalidated = await this.tokenCommandRepository.invalidateToken(refreshToken);

        if (!invalidated) {
            return Result.fail('Failed to logout');
        }

        return Result.ok();
    }
}