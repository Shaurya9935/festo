import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

type VerifyEmailProps = {
  name: string;
  verificationUrl: string;
};

export default function VerifyEmail({
  name,
  verificationUrl,
}: VerifyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your Festo account</Preview>

      <Body>
        <Container>
          <Heading>Welcome to Festo 🎉</Heading>

          <Text>Hi {name},</Text>

          <Text>
            Click the button below to verify your email.
          </Text>

          <Button href={verificationUrl}>
            Verify Email
          </Button>
        </Container>
      </Body>
    </Html>
  );
}