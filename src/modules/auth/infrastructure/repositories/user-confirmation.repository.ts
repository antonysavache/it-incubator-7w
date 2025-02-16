// src/modules/auth/infrastructure/repositories/user-confirmation.repository.ts

import { BaseCommandRepository } from "../../../../shared/infrastructures/repositories/base-command.repository";
import { UserConfirmationModel } from "../../domain/interfaces/user-confirmation.interface";
import { ObjectId } from "mongodb";

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
        return this.collection.findOne({ email: email.toLowerCase() });
    }

    async updateConfirmationStatus(id: string, isConfirmed: boolean): Promise<boolean> {
        this.checkInit();
        const result = await this.collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { isConfirmed } }
        );
        return result.modifiedCount === 1;
    }

    async save(dto: Omit<UserConfirmationModel, '_id'>): Promise<string> {
        this.checkInit();
        const newConfirmation = {
            _id: new ObjectId(),
            ...dto
        };
        await this.collection.insertOne(newConfirmation);
        return newConfirmation._id.toString();
    }

    async updateCode(email: string, confirmationCode: string): Promise<boolean> {
        this.checkInit();
        const result = await this.collection.updateOne(
            { email: email.toLowerCase() },
            {
                $set: {
                    confirmationCode,
                    expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
                }
            }
        );
        return result.modifiedCount === 1;
    }
}