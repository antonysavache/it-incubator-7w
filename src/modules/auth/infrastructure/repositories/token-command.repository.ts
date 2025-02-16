import {BaseCommandRepository} from "../../../../shared/infrastructures/repositories/base-command.repository";
import {TokenCreateModel, TokenDatabaseModel} from "../../domain/interfaces/token.interface";

export class TokenCommandRepository extends BaseCommandRepository<TokenDatabaseModel, TokenCreateModel> {
    constructor() {
        super('tokens');
    }

    async saveToken(userId: string, token: string): Promise<string> {
        const tokenData: TokenCreateModel = {
            token,
            userId,
            issuedAt: new Date(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        };

        return this.create(tokenData);
    }
}