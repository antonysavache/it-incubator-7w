import nodemailer from 'nodemailer';
import { SETTINGS } from '../../../../configs/settings';

export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: SETTINGS.EMAIL.SMTP.HOST,
            port: SETTINGS.EMAIL.SMTP.PORT,
            secure: SETTINGS.EMAIL.SMTP.SECURE,
            auth: {
                user: SETTINGS.EMAIL.SMTP.USER,
                pass: SETTINGS.EMAIL.SMTP.PASS
            }
        });
    }

    async sendRegistrationEmail(email: string, confirmationCode: string): Promise<boolean> {
        try {
            const confirmationLink = `${SETTINGS.CLIENT_URL}/confirm-email?code=${confirmationCode}`;

            await this.transporter.sendMail({
                from: SETTINGS.EMAIL.SMTP.FROM,
                to: email,
                subject: 'Complete Your Registration',
                html: `
                    <h1>Thank you for your registration</h1>
                    <p>To finish registration please follow the link below:
                        <a href='${confirmationLink}'>complete registration</a>
                    </p>
                `
            });

            return true;
        } catch (error) {
            console.error('Failed to send email:', error);
            return false;
        }
    }
}