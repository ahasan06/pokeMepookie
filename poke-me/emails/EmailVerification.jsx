
import { Html, Body, Container, Heading, Text, Button } from '@react-email/components';

function EmailVerification({ username, otp }) {
  return (
    <Html>
      <Body className="bg-gray-100">
        <Container className="max-w-xl mx-auto p-4 bg-white shadow-lg rounded-md">
          <Heading className="text-xl font-semibold text-center text-gray-800">Email Verification</Heading>
          <Text className="text-gray-600 mt-4">
            Hello {username},
          </Text>
          <Text className="text-gray-600 mt-2">
            Thank you for registering! Please use the following OTP code to verify your email address:
          </Text>
          <Text className="text-2xl font-bold text-center text-gray-800 mt-4">
            {otp}
          </Text>
          <Button
            href="#"
            className="mt-6 bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-center block mx-auto"
          >
            Verify Email
          </Button>
          <Text className="text-gray-600 mt-4 text-center">
            If you did not request this, please ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default EmailVerification;
