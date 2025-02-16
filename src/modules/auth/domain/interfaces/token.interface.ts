import { ObjectId } from 'mongodb';

export interface TokenCreateModel {
    token: string;
    userId: string;
    issuedAt: Date;
    expiresAt: Date;
}

export interface TokenDatabaseModel {
    _id: ObjectId;
    token: string;
    userId: string;
    issuedAt: Date;
    expiresAt: Date;
}
export interface LoginSuccessViewModel {
    accessToken: string
}