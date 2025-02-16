import { Result } from "../../../../shared/infrastructures/result";
import { UserConfirmationRepository } from "../../infrastructure/repositories/user-confirmation.repository";
import { EmailService } from "../../infrastructure/services/email.service";
import { v4 as uuidv4 } from 'uuid';
import { UsersQueryRepository } from "../../../users/domain/infrastructures/repositories/users-query.repository";

export class ResendConfirmationUseCase {
    constructor(
        private userConfirmationRepository: UserConfirmationRepository,
        private emailService: EmailService,
        private usersQueryRepository: UsersQueryRepository
    ) {}

    async execute(email: string): Promise<Result<void>> {
        const lowerEmail = email.toLowerCase();
        console.log('Executing resend confirmation for email:', lowerEmail);

        // Find user
        const user = await this.usersQueryRepository.findByFilter({ email: lowerEmail });
        if (!user) {
            console.log('User not found for email:', lowerEmail);
            return Result.fail('User not found');
        }

        // Find confirmation
        const confirmation = await this.userConfirmationRepository.findByEmail(lowerEmail);
        if (!confirmation) {
            console.log('Confirmation not found for email:', lowerEmail);
            return Result.fail('Confirmation not found');
        }

        if (confirmation.isConfirmed) {
            console.log('Email already confirmed:', lowerEmail);
            return Result.fail('Email already confirmed');
        }

        // Generate and update new code
        const newCode = uuidv4();
        console.log('Generated new code:', newCode);

        const updated = await this.userConfirmationRepository.updateCode(lowerEmail, newCode);
        console.log('Update confirmation result:', updated);

        if (!updated) {
            console.log('Failed to update confirmation code');
            return Result.fail('Failed to update confirmation code');
        }

        // Send email with new code
        console.log('Sending confirmation email...');
        const emailSent = await this.emailService.sendRegistrationEmail(lowerEmail, newCode);
        console.log('Email send result:', emailSent);

        if (!emailSent) {
            console.log('Failed to send email');
            return Result.fail('Failed to send email');
        }

        console.log('Successfully resent confirmation email');
        return Result.ok();
    }
}