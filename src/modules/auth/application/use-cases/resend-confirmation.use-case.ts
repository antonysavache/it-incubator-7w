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

        const user = await this.usersQueryRepository.findByFilter({ email: lowerEmail });
        if (!user) {
            return Result.fail('User not found');
        }

        const confirmation = await this.userConfirmationRepository.findByEmail(lowerEmail);
        if (!confirmation) {
            return Result.fail('Confirmation not found');
        }

        if (confirmation.isConfirmed) {
            return Result.fail('Email already confirmed');
        }

        const newCode = uuidv4();

        const updated = await this.userConfirmationRepository.updateCode(
            lowerEmail,
            newCode
        );

        if (!updated) {
            return Result.fail('Failed to update confirmation code');
        }

        const emailSent = await this.emailService.sendRegistrationEmail(
            lowerEmail,
            newCode
        );

        if (!emailSent) {
            return Result.fail('Failed to send email');
        }

        return Result.ok();
    }
}