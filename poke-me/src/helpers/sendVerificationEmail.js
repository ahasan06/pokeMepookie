import resend from '@/lib/reSend'
import EmailVerification from '../../emails/EmailVerification'
import ApiResponse from '@/types/ApiResponse'


export async function sendVerificationEmail(email, username, verifyCode) {

    try {
        const emailContent = EmailVerification({ username, otp: verifyCode });
        const result = await resend.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Verify Your Email Address',
            react: emailContent,
        })
        if (result.success) {
            return {
                success: true,
                message: 'Verification email sent successfully.',
            }
        }
        else {

            return {
                success: false,
                message: 'Failed to send verification email.',
            };
        }

    } catch (error) {
        return {
            success: false,
            message: `An error occurred failed to send verification: ${error.message}`,
        };
    }

}
