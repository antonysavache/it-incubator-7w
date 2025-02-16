import {UserConfirmationRepository} from "../../infrastructure/repositories/user-confirmation.repository";
import {EmailService} from "../../infrastructure/services/email.service";
import {Result} from "../../../../shared/infrastructures/result";
import { v4 as uuidv4 } from 'uuid';

export class ResendConfirmationUseCase {
    constructor(
        private userConfirmationRepository: UserConfirmationRepository,
        private emailService: EmailService
    ) {}

    async execute(email: string): Promise<Result<void>> {
        const confirmation = await this.userConfirmationRepository.findByEmail(email);

        if (!confirmation) {
            return Result.fail('No pending confirmation found for this email');
        }

        if (confirmation.isConfirmed) {
            return Result.fail('Email already confirmed');
        }

        const newCode = uuidv4();
        const updated = await this.userConfirmationRepository.update(
            confirmation._id.toString(),
            {
                ...confirmation,
                confirmationCode: newCode,
                expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
            }
        );

        if (!updated) {
            return Result.fail('Failed to update confirmation');
        }

        const emailSent = await this.emailService.sendRegistrationEmail(email, newCode);
        if (!emailSent) {
            return Result.fail('Failed to send confirmation email');
        }

        return Result.ok();
    }
}