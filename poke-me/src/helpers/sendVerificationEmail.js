import resend from '@/lib/reSend';
import EmailVerification from '../../emails/EmailVerification'


export async function sendVerificationEmail(email, username, verifyCode) {
    try {
        const emailContent = EmailVerification({ username, otp: verifyCode });

        console.log("Sending email to (testing):", email);
        const result = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email, 
            subject: 'Verify Your Email Address for using poke me pookie',
            react: emailContent,
        });
        console.log("Email send result:", result);

        // Check if there is data and no error to determine success
        if (result.data && !result.error) {
            return {
                success: true,
                message: 'Verification email sent successfully!.',
            };
        } else {
            return {
                success: false,
                message: 'Failed to send verification email.',
            };
        }
    } catch (error) {
        console.error("Error occurred while sending verification email:", error.message);
        return {
            success: false,
            message: `An error occurred failed to send verification: ${error.message}`,
        };
    }
}
