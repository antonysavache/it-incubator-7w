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

    async execute(refreshToken: string): Promise<Result<{ accessToken: string, refreshToken: string }>> {
        try {
            if (!refreshToken) {
                return Result.fail('Refresh token is required');
            }

            const payload = JwtService.verifyToken(refreshToken);
            if (!payload) {
                return Result.fail('Invalid refresh token');
            }

            const tokenDoc = await this.tokenQueryRepository.findValidToken(refreshToken, 'REFRESH');
            if (!tokenDoc) {
                return Result.fail('Invalid or expired refresh token');
            }

            await this.tokenCommandRepository.invalidateToken(refreshToken);

            const newAccessToken = JwtService.createJWT(
                tokenDoc.userId,
                TOKEN_SETTINGS.ACCESS_TOKEN_EXPIRATION
            );

            const newRefreshToken = JwtService.createJWT(
                tokenDoc.userId,
                TOKEN_SETTINGS.REFRESH_TOKEN_EXPIRATION
            );

            await this.tokenCommandRepository.saveTokens(
                tokenDoc.userId,
                newAccessToken,
                newRefreshToken
            );

            return Result.ok({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            });
        } catch (error) {
            console.error('RefreshToken error:', error);
            return Result.fail('Invalid refresh token');
        }
    }
}