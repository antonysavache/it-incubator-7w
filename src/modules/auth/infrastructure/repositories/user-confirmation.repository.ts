import {BaseCommandRepository} from "../../../../shared/infrastructures/repositories/base-command.repository";
import {UserConfirmationModel} from "../../domain/interfaces/user-confirmation.interface";
import {ObjectId} from "mongodb";

export class UserConfirmationRepository extends BaseCommandRepository<UserConfirmationModel, Omit<UserConfirmationModel, '_id'>> {
    constructor() {
        super('userConfirmations');
    }

    async findByCode(code: string): Promise<UserConfirmationModel | null> {
        this.checkInit();
        return this.collection.findOne({ confirmationCode: code });
    }

    async findByEmail(email: string): Promise<UserConfirmationModel | null> {
        this.checkInit();
        return this.collection.findOne({ email, isConfirmed: false });
    }

    async updateConfirmationStatus(id: string, isConfirmed: boolean): Promise<boolean> {
        this.checkInit();
        const result = await this.collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { isConfirmed } }
        );
        return result.modifiedCount === 1;
    }
}