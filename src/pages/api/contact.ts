import type { APIRoute } from "astro";
import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request, redirect }) => {
  const data = await request.formData();

  const name    = data.get("name")?.toString().trim();
  const email   = data.get("email")?.toString().trim();
  const company = data.get("company")?.toString().trim();
  const message = data.get("message")?.toString().trim();

  // Basic validation
  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
    });
  }

  try {
    await resend.emails.send({
      from:    "Re.Dzinr Contact <contact@yourdomain.com>", // ← must be a domain you verify in Resend
      to:      "grow@redzinr.com",                            // ← your inbox
      replyTo: email,
      subject: `New enquiry from ${name}${company ? ` · ${company}` : ""}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0a0a0a; border-bottom: 2px solid #3185ff; padding-bottom: 8px;">
            New Contact Form Submission
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 100px; font-weight: 600;">Name</td>
              <td style="padding: 8px 0; color: #0a0a0a;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: 600;">Email</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #3185ff;">${email}</a></td>
            </tr>
            ${company ? `
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: 600;">Company</td>
              <td style="padding: 8px 0; color: #0a0a0a;">${company}</td>
            </tr>` : ""}
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: 600; vertical-align: top;">Message</td>
              <td style="padding: 8px 0; color: #0a0a0a; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>
        </div>
      `,
    });

    // Redirect to thank-you page on success
    return redirect("/thank-you", 303);

  } catch (err) {
    console.error("Resend error:", err);
    return new Response(JSON.stringify({ error: "Failed to send message" }), {
      status: 500,
    });
  }
};