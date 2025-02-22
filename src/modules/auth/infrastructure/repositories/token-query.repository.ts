import { BaseQueryRepository } from "../../../../shared/infrastructures/repositories/base-query.repository";
import { TokenDatabaseModel } from "../../domain/interfaces/token.interface";

export class TokenQueryRepository extends BaseQueryRepository<TokenDatabaseModel> {
    constructor() {
        super('tokens');
    }

    async findValidToken(token: string, type: 'ACCESS' | 'REFRESH'): Promise<TokenDatabaseModel | null> {
        this.checkInit();
        return this.collection.findOne({
            token,
            tokenType: type,
            isValid: true,
            expiresAt: { $gt: new Date() }
        });
    }
}