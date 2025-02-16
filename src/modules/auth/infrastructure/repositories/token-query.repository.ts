import {BaseQueryRepository} from "../../../../shared/infrastructures/repositories/base-query.repository";
import {TokenDatabaseModel} from "../../domain/interfaces/token.interface";

export class TokenQueryRepository extends BaseQueryRepository<TokenDatabaseModel> {
    constructor() {
        super('tokens');
    }

    async findValidToken(token: string): Promise<TokenDatabaseModel | null> {
        this.checkInit();
        return this.collection.findOne({
            token,
            expiresAt: { $gt: new Date() }
        });
    }
}