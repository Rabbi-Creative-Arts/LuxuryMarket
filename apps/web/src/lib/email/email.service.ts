import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

const resend = apiKey
  ? new Resend(apiKey)
  : null;

const FROM_EMAIL =
  process.env.EMAIL_FROM ||
  "UdoLuxury <onboarding@resend.dev>";

export type BrandApplicationEmailType =
  | "received"
  | "approved"
  | "rejected"
  | "suspended"
  | "under_review";

interface SendBrandApplicationEmailParams {
  to: string;
  brandName: string;
  applicantName: string;
  type: BrandApplicationEmailType;
  adminNotes?: string | null;
}

function getEmailContent({
  brandName,
  applicantName,
  type,
  adminNotes,
}: Omit<
  SendBrandApplicationEmailParams,
  "to"
>) {
  switch (type) {
    case "received":
      return {
        subject:
          "UdoLuxury — Your Brand Application Has Been Received",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 640px; margin: auto; color: #111;">
            <h1>APPLICATION RECEIVED</h1>

            <p>Dear ${applicantName},</p>

            <p>
              Thank you for applying to become a brand on UdoLuxury.
            </p>

            <p>
              We have successfully received the application for
              <strong>${brandName}</strong>.
            </p>

            <div style="padding: 20px; margin: 24px 0; background: #f5f5f5; border-radius: 12px;">
              <strong>STATUS: PENDING REVIEW</strong>

              <p style="margin-bottom: 0;">
                Our administration team will review your application.
                Please allow up to <strong>48 hours</strong> for the
                initial review.
              </p>
            </div>

            <p>
              You will be contacted using the email address provided
              in your application.
            </p>

            <p>
              Thank you for choosing UdoLuxury.
            </p>

            <p>
              <strong>UdoLuxury Administration</strong>
            </p>
          </div>
        `,
      };

    case "approved":
      return {
        subject:
          "UdoLuxury — Your Brand Application Has Been Approved",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 640px; margin: auto; color: #111;">
            <h1>APPLICATION APPROVED</h1>

            <p>Dear ${applicantName},</p>

            <p>
              We are pleased to inform you that your application for
              <strong>${brandName}</strong> has been
              <strong>approved</strong> by UdoLuxury Administration.
            </p>

            <div style="padding: 20px; margin: 24px 0; background: #ecfdf5; border-radius: 12px;">
              <strong style="color: #047857;">
                STATUS: APPROVED
              </strong>

              <p style="margin-bottom: 0;">
                Your brand has been approved to continue with the
                UdoLuxury onboarding process.
              </p>
            </div>

            <p>
              The next step is to access your brand account and begin
              submitting products for administrative approval.
            </p>

            <p>
              Please note that products must be approved by UdoLuxury
              before they become publicly available.
            </p>

            ${
              adminNotes
                ? `
                  <div style="padding: 16px; margin: 24px 0; background: #f5f5f5; border-radius: 12px;">
                    <strong>Administration Notes</strong>
                    <p>${adminNotes}</p>
                  </div>
                `
                : ""
            }

            <p>
              Welcome to UdoLuxury.
            </p>

            <p>
              <strong>UdoLuxury Administration</strong>
            </p>
          </div>
        `,
      };

    case "rejected":
      return {
        subject:
          "UdoLuxury — Update Regarding Your Brand Application",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 640px; margin: auto; color: #111;">
            <h1>APPLICATION UPDATE</h1>

            <p>Dear ${applicantName},</p>

            <p>
              Thank you for your interest in becoming a brand on
              UdoLuxury.
            </p>

            <p>
              After reviewing your application for
              <strong>${brandName}</strong>, our administration team
              has decided not to approve the application at this time.
            </p>

            <div style="padding: 20px; margin: 24px 0; background: #fef2f2; border-radius: 12px;">
              <strong style="color: #b91c1c;">
                STATUS: REJECTED
              </strong>
            </div>

            ${
              adminNotes
                ? `
                  <div style="padding: 16px; margin: 24px 0; background: #f5f5f5; border-radius: 12px;">
                    <strong>Administration Notes</strong>
                    <p>${adminNotes}</p>
                  </div>
                `
                : ""
            }

            <p>
              If you believe additional information could support a
              future application, you may contact UdoLuxury
              Administration.
            </p>

            <p>
              <strong>UdoLuxury Administration</strong>
            </p>
          </div>
        `,
      };

    case "suspended":
      return {
        subject:
          "UdoLuxury — Your Brand Application Status Has Changed",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 640px; margin: auto; color: #111;">
            <h1>APPLICATION STATUS UPDATE</h1>

            <p>Dear ${applicantName},</p>

            <p>
              The status of your application for
              <strong>${brandName}</strong> has been changed.
            </p>

            <div style="padding: 20px; margin: 24px 0; background: #f3f4f6; border-radius: 12px;">
              <strong>
                STATUS: SUSPENDED
              </strong>

              <p style="margin-bottom: 0;">
                Your application/account is currently suspended
                pending further administrative action.
              </p>
            </div>

            ${
              adminNotes
                ? `
                  <div style="padding: 16px; margin: 24px 0; background: #f5f5f5; border-radius: 12px;">
                    <strong>Administration Notes</strong>
                    <p>${adminNotes}</p>
                  </div>
                `
                : ""
            }

            <p>
              UdoLuxury Administration will contact you if further
              information or action is required.
            </p>

            <p>
              <strong>UdoLuxury Administration</strong>
            </p>
          </div>
        `,
      };

    case "under_review":
      return {
        subject:
          "UdoLuxury — Your Brand Application Is Under Review",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 640px; margin: auto; color: #111;">
            <h1>APPLICATION UNDER REVIEW</h1>

            <p>Dear ${applicantName},</p>

            <p>
              Your application for
              <strong>${brandName}</strong> is currently being
              reviewed by UdoLuxury Administration.
            </p>

            <div style="padding: 20px; margin: 24px 0; background: #eff6ff; border-radius: 12px;">
              <strong style="color: #1d4ed8;">
                STATUS: UNDER REVIEW
              </strong>
            </div>

            ${
              adminNotes
                ? `
                  <div style="padding: 16px; margin: 24px 0; background: #f5f5f5; border-radius: 12px;">
                    <strong>Administration Notes</strong>
                    <p>${adminNotes}</p>
                  </div>
                `
                : ""
            }

            <p>
              We will contact you when the review process has been
              completed.
            </p>

            <p>
              <strong>UdoLuxury Administration</strong>
            </p>
          </div>
        `,
      };
  }
}

export async function sendBrandApplicationEmail({
  to,
  brandName,
  applicantName,
  type,
  adminNotes,
}: SendBrandApplicationEmailParams) {
  if (!resend) {
    console.warn(
      "[UdoLuxury Email] RESEND_API_KEY is not configured. Email was not sent."
    );

    return {
      success: false,
      skipped: true,
      error: "RESEND_API_KEY is not configured.",
    };
  }

  const content = getEmailContent({
    brandName,
    applicantName,
    type,
    adminNotes,
  });

  try {
    const { data, error } =
      await resend.emails.send({
        from: FROM_EMAIL,
        to: [to],
        subject: content.subject,
        html: content.html,
      });

    if (error) {
      console.error(
        "[UdoLuxury Email] Resend error:",
        error
      );

      return {
        success: false,
        skipped: false,
        error: error.message,
      };
    }

    console.log(
      `[UdoLuxury Email] Sent ${type} email to ${to}. ID: ${data?.id}`
    );

    return {
      success: true,
      skipped: false,
      id: data?.id,
    };
  } catch (error) {
    console.error(
      "[UdoLuxury Email] Unexpected error:",
      error
    );

    return {
      success: false,
      skipped: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown email error.",
    };
  }
}