import { Result } from "../../../../shared/infrastructures/result";
import { UserConfirmationRepository } from "../../infrastructure/repositories/user-confirmation.repository";
import { EmailService } from "../../infrastructure/services/email.service";
import { v4 as uuidv4 } from 'uuid';

export class ResendConfirmationUseCase {
    constructor(
        private userConfirmationRepository: UserConfirmationRepository,
        private emailService: EmailService
    ) {}

    async execute(email: string): Promise<Result<void>> {
        // Important: First check if confirmation exists and its status
        const confirmation = await this.userConfirmationRepository.findByEmail(email.toLowerCase());

        if (!confirmation) {
            return Result.fail('User not found');
        }

        // If already confirmed, return error - this fixes the 400 status issue
        if (confirmation.isConfirmed) {
            return Result.fail('Email already confirmed');
        }

        // Generate new code
        const newCode = uuidv4();

        // Update the code in database
        const updated = await this.userConfirmationRepository.updateCode(
            email.toLowerCase(),
            newCode
        );

        if (!updated) {
            return Result.fail('Failed to update confirmation code');
        }

        // Send new confirmation email
        const emailSent = await this.emailService.sendRegistrationEmail(
            email,
            newCode
        );

        if (!emailSent) {
            return Result.fail('Failed to send email');
        }

        return Result.ok();
    }
}