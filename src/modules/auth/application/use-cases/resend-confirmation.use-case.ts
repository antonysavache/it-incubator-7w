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
        // First check if user exists
        const user = await this.usersQueryRepository.findByFilter({ email: email.toLowerCase() });
        if (!user) {
            return Result.fail('User with this email does not exist');
        }

        // Then check confirmation status
        const confirmation = await this.userConfirmationRepository.findByEmail(email.toLowerCase());
        if (!confirmation) {
            // Create new confirmation if doesn't exist
            const newCode = uuidv4();
            await this.userConfirmationRepository.save({
                userId: user._id.toString(),
                email: email.toLowerCase(),
                confirmationCode: newCode,
                expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
                isConfirmed: false
            });

            await this.emailService.sendRegistrationEmail(email, newCode);
            return Result.ok();
        }

        if (confirmation.isConfirmed) {
            return Result.fail('Email is already confirmed');
        }

        const newCode = uuidv4();
        const updated = await this.userConfirmationRepository.updateCode(
            email.toLowerCase(),
            newCode
        );

        if (!updated) {
            return Result.fail('Failed to update confirmation code');
        }

        const emailSent = await this.emailService.sendRegistrationEmail(email, newCode);
        if (!emailSent) {
            return Result.fail('Failed to send confirmation email');
        }

        return Result.ok();
    }
}