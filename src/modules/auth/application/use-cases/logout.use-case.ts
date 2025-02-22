import { Result } from "../../../../shared/infrastructures/result";
import { TokenCommandRepository } from "../../infrastructure/repositories/token-command.repository";
import { TokenQueryRepository } from "../../infrastructure/repositories/token-query.repository";

export class LogoutUseCase {
    constructor(
        private tokenCommandRepository: TokenCommandRepository,
        private tokenQueryRepository: TokenQueryRepository
    ) {}

    async execute(refreshToken: string): Promise<Result<void>> {
        try {
            if (!refreshToken) {
                return Result.fail('Refresh token is required');
            }

            const token = await this.tokenQueryRepository.findValidToken(refreshToken, 'REFRESH');
            if (!token) {
                return Result.fail('Invalid refresh token');
            }

            const invalidated = await this.tokenCommandRepository.invalidateToken(refreshToken);
            if (!invalidated) {
                return Result.fail('Failed to logout');
            }

            return Result.ok();
        } catch (error) {
            console.error('Logout error:', error);
            return Result.fail('Failed to logout');
        }
    }
}