import { Result } from "../../../../shared/infrastructures/result";
import { TokenCommandRepository } from "../../infrastructure/repositories/token-command.repository";
import { TokenQueryRepository } from "../../infrastructure/repositories/token-query.repository";
import { TOKEN_SETTINGS } from "../../domain/interfaces/token.interface";
import {JwtService} from "../../../../shared/services/jwt.service";

export class RefreshTokenUseCase {
    constructor(
        private tokenCommandRepository: TokenCommandRepository,
        private tokenQueryRepository: TokenQueryRepository
    ) {}

    async execute(refreshToken: string): Promise<Result<{ accessToken: string, newRefreshToken: string }>> {
        const token = await this.tokenQueryRepository.findValidToken(refreshToken, 'REFRESH');

        if (!token) {
            return Result.fail('Invalid refresh token');
        }

        // Invalidate the current refresh token
        await this.tokenCommandRepository.invalidateToken(refreshToken);

        // Generate new tokens
        const newAccessToken = JwtService.createJWT(
            token.userId,
            TOKEN_SETTINGS.ACCESS_TOKEN_EXPIRATION
        );
        const newRefreshToken = JwtService.createJWT(
            token.userId,
            TOKEN_SETTINGS.REFRESH_TOKEN_EXPIRATION
        );

        // Save new tokens
        await this.tokenCommandRepository.saveTokens(token.userId, newAccessToken, newRefreshToken);

        return Result.ok({
            accessToken: newAccessToken,
            newRefreshToken
        });
    }
}
