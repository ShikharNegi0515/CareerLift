/**
 * Email HTML Template Generators
 * Clean, responsive transactional email designs for CareerLift
 */

export function getBaseEmailLayout(title: string, contentHtml: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f1f5f9;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    table { border-collapse: separate; }
    .wrapper {
      width: 100%;
      background-color: #f1f5f9;
      padding: 40px 16px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04);
    }
    .header-bar {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      padding: 28px 36px;
      text-align: left;
      border-bottom: 3px solid #3b82f6;
    }
    .logo-container {
      display: inline-flex;
      align-items: center;
      text-decoration: none;
    }
    .brand-name {
      color: #ffffff;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin-left: 10px;
      vertical-align: middle;
    }
    .brand-tagline {
      display: inline-block;
      float: right;
      font-size: 11px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 6px;
      font-weight: 600;
    }
    .content {
      padding: 40px 36px 32px;
      color: #334155;
      line-height: 1.65;
      font-size: 15px;
    }
    .btn-primary {
      display: inline-block;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: #ffffff !important;
      font-weight: 600;
      font-size: 15px;
      padding: 14px 34px;
      text-decoration: none;
      border-radius: 8px;
      text-align: center;
      letter-spacing: 0.2px;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
    }
    .footer {
      padding: 28px 36px;
      background-color: #f8fafc;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 12px;
      color: #64748b;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table class="container" role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td class="header-bar">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <span style="font-size: 22px; vertical-align: middle;">💼</span>
                <span class="brand-name">CareerLift</span>
              </td>
              <td align="right">
                <span class="brand-tagline">Talent & Hiring Network</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td class="content">
          ${contentHtml}
        </td>
      </tr>
      <tr>
        <td class="footer">
          <p style="margin: 0 0 6px; font-weight: 600; color: #475569;">CareerLift Recruiting & Hiring Platform</p>
          <p style="margin: 0 0 10px;">Connecting world-class engineering, product, and leadership talent with top teams.</p>
          <p style="margin: 0; color: #94a3b8; font-size: 11px;">
            © ${new Date().getFullYear()} CareerLift Inc. All rights reserved. • <a href="http://localhost:5173/privacy" style="color: #64748b; text-decoration: underline;">Privacy Policy</a> • <a href="http://localhost:5173/terms" style="color: #64748b; text-decoration: underline;">Terms of Service</a>
          </p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
  `.trim();
}

export function getWelcomeEmailHtml(name: string, role: string, frontendUrl: string): string {
  const isEmployer = role === 'employer';
  const actionUrl = isEmployer ? `${frontendUrl}/employer/dashboard` : `${frontendUrl}/seeker/jobs`;
  const actionText = isEmployer ? 'Post Your First Job' : 'Explore Open Roles';

  const body = `
    <h2 style="margin-top: 0; color: #1a1f36; font-size: 20px;">Welcome to CareerLift, ${name}! 🎉</h2>
    <p>We are thrilled to have you join our platform as a <strong>${isEmployer ? 'Hiring Employer' : 'Job Seeker'}</strong>.</p>
    <p>${
      isEmployer
        ? 'CareerLift empowers companies to discover top tech talent, manage applicant pipelines seamlessly, and build high-performing teams.'
        : 'CareerLift matches your unique skills with top tech companies, verified hiring managers, and career-defining opportunities.'
    }</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${actionUrl}" class="btn">${actionText}</a>
    </div>
    <p style="color: #6c757d; font-size: 13px;">If you ever have questions, reply to this email or visit our Help Center.</p>
  `;

  return getBaseEmailLayout(`Welcome to CareerLift, ${name}`, body);
}

export function getApplicationReceivedEmailHtml(
  candidateName: string,
  jobTitle: string,
  companyName: string,
  frontendUrl: string,
): string {
  const actionUrl = `${frontendUrl}/seeker/applications`;
  const body = `
    <h2 style="margin-top: 0; color: #1a1f36; font-size: 20px;">Application Submitted! 📄</h2>
    <p>Hi ${candidateName},</p>
    <p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been successfully received.</p>
    <div style="background-color: #f8f9fa; border-left: 4px solid #0d6efd; padding: 14px 18px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #495057;">
        <strong>Position:</strong> ${jobTitle}<br>
        <strong>Company:</strong> ${companyName}<br>
        <strong>Status:</strong> <span class="badge badge-applied">Applied</span>
      </p>
    </div>
    <p>The hiring team will review your credentials and profile shortly. You will receive updates as your application progresses.</p>
    <div style="text-align: center; margin: 28px 0;">
      <a href="${actionUrl}" class="btn">View Application Status</a>
    </div>
  `;

  return getBaseEmailLayout(`Application Received for ${jobTitle}`, body);
}

export function getApplicationStatusUpdatedEmailHtml(
  candidateName: string,
  jobTitle: string,
  companyName: string,
  newStatus: string,
  frontendUrl: string,
): string {
  const actionUrl = `${frontendUrl}/seeker/applications`;
  const badgeClass =
    newStatus === 'shortlisted'
      ? 'badge-shortlisted'
      : newStatus === 'rejected'
      ? 'badge-rejected'
      : newStatus === 'hired'
      ? 'badge-hired'
      : 'badge-applied';

  const body = `
    <h2 style="margin-top: 0; color: #1a1f36; font-size: 20px;">Application Status Update</h2>
    <p>Hi ${candidateName},</p>
    <p>There is an update on your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
    <div style="background-color: #f8f9fa; border-left: 4px solid #0d6efd; padding: 14px 18px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #495057;">
        <strong>Current Status:</strong> <span class="badge ${badgeClass}">${newStatus.replace('_', ' ').toUpperCase()}</span>
      </p>
    </div>
    <p>Log in to your CareerLift dashboard to review full application details and updates.</p>
    <div style="text-align: center; margin: 28px 0;">
      <a href="${actionUrl}" class="btn">Check Dashboard</a>
    </div>
  `;

  return getBaseEmailLayout(`Status Update: ${jobTitle}`, body);
}

export function getNewApplicantEmployerEmailHtml(
  employerName: string,
  candidateName: string,
  jobTitle: string,
  frontendUrl: string,
): string {
  const actionUrl = `${frontendUrl}/employer/applicants`;
  const body = `
    <h2 style="margin-top: 0; color: #1a1f36; font-size: 20px;">New Candidate Application 🎯</h2>
    <p>Hi ${employerName},</p>
    <p>Great news! A new candidate, <strong>${candidateName}</strong>, just submitted an application for your open role: <strong>${jobTitle}</strong>.</p>
    <div style="text-align: center; margin: 28px 0;">
      <a href="${actionUrl}" class="btn">Review Candidate Profile</a>
    </div>
    <p style="color: #6c757d; font-size: 13px;">Review candidate resumes, portfolio links, and move applicants through your hiring stages directly in CareerLift.</p>
  `;

  return getBaseEmailLayout(`New Applicant for ${jobTitle}`, body);
}

export function getPasswordResetEmailHtml(name: string, resetUrl: string): string {
  const body = `
    <h2 style="margin-top: 0; color: #1a1f36; font-size: 20px;">Reset Your Password 🔐</h2>
    <p>Hi ${name},</p>
    <p>We received a request to reset the password for your CareerLift account. Click the button below to create a new password.</p>
    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 14px 18px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 13px; color: #856404;">
        ⏱️ This link will expire in <strong>1 hour</strong>. If you did not request a password reset, you can safely ignore this email.
      </p>
    </div>
    <div style="text-align: center; margin: 28px 0;">
      <a href="${resetUrl}" class="btn" style="background-color: #dc3545;">Reset My Password</a>
    </div>
    <p style="color: #6c757d; font-size: 13px;">
      If the button above doesn't work, copy and paste this URL into your browser:<br>
      <span style="word-break: break-all; color: #0d6efd;">${resetUrl}</span>
    </p>
  `;
  return getBaseEmailLayout('Reset Your CareerLift Password', body);
}

export function getEmailVerificationHtml(name: string, verifyUrl: string): string {
  const body = `
    <h2 style="margin-top: 0; color: #1a1f36; font-size: 20px;">Verify Your Email Address ✉️</h2>
    <p>Hi ${name},</p>
    <p>Thanks for signing up! Please confirm your email address to activate your account and get full access to CareerLift features.</p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${verifyUrl}" class="btn" style="background-color: #198754;">Verify My Email</a>
    </div>
    <div style="background-color: #f8f9fa; border-left: 4px solid #198754; padding: 14px 18px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 13px; color: #495057;">
        ⏱️ This link will expire in <strong>24 hours</strong>.
      </p>
    </div>
    <p style="color: #6c757d; font-size: 13px;">If you did not create an account, no action is required.</p>
  `;
  return getBaseEmailLayout('Verify Your CareerLift Email', body);
}

export function getJobAlertDigestEmailHtml(
  name: string,
  jobs: Array<{ id: string; title: string; companyName: string; location: string; matchScore: number; matchReason: string }>,
  frontendUrl: string,
): string {
  const jobItemsHtml = jobs.map((j) => `
    <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 12px; background: #ffffff;">
      <div style="display: flex; justify-content: space-between; align-items: baseline;">
        <h3 style="margin: 0 0 6px 0; font-size: 16px; color: #1e293b;">
          <a href="${frontendUrl}/jobs/${j.id}" style="color: #2563eb; text-decoration: none;">${j.title}</a>
        </h3>
        <span style="background: #eff6ff; color: #1d4ed8; font-weight: 700; font-size: 12px; padding: 2px 8px; border-radius: 9999px;">
          ${j.matchScore}% Match
        </span>
      </div>
      <p style="margin: 0 0 6px 0; font-size: 13px; color: #64748b;">
        🏢 ${j.companyName} &nbsp;•&nbsp; 📍 ${j.location}
      </p>
      <p style="margin: 0; font-size: 12px; color: #059669; font-weight: 500;">
        ✨ ${j.matchReason}
      </p>
    </div>
  `).join('');

  const body = `
    <h2 style="margin-top: 0; color: #1a1f36; font-size: 20px;">Your Tailored Job Opportunities 🎯</h2>
    <p>Hi ${name},</p>
    <p>We found <strong>${jobs.length} new opportunities</strong> matching your skills and career preferences on CareerLift:</p>
    
    <div style="margin: 20px 0;">
      ${jobItemsHtml}
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${frontendUrl}/dashboard/recommendations" class="btn">Explore All Recommendations</a>
    </div>

    <p style="color: #6c757d; font-size: 12px; text-align: center; margin-top: 24px;">
      You received this email because you are registered as a job seeker on CareerLift.
    </p>
  `;

  return getBaseEmailLayout('New Job Matches for You', body);
}

export function getRecruiterInviteEmailHtml(
  contactName: string | null,
  companyName: string | null,
  inviteUrl: string,
  customMessage?: string | null,
): string {
  const greeting = contactName ? `Hi ${contactName},` : 'Hello,';
  const companyHighlight = companyName ? ` for <strong>${companyName}</strong>` : '';

  const body = `
    <div style="margin-bottom: 24px;">
      <span style="display: inline-block; background-color: #eff6ff; color: #1d4ed8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; padding: 4px 12px; border-radius: 9999px; border: 1px solid #bfdbfe; margin-bottom: 12px;">
        Direct Partner Invitation
      </span>
      <h1 style="margin: 0 0 10px; color: #0f172a; font-size: 24px; font-weight: 800; line-height: 1.3;">
        Partner with CareerLift to Hire Top Talent${companyName ? ` for ${companyName}` : ''}
      </h1>
      <p style="font-size: 15px; color: #475569; margin: 0; line-height: 1.6;">
        ${greeting} you've been invited to join CareerLift's curated employer network to streamline candidate discovery, technical evaluation, and direct hiring${companyHighlight}.
      </p>
    </div>

    ${
      customMessage
        ? `<div style="background-color: #f8fafc; border-left: 4px solid #2563eb; border: 1px solid #e2e8f0; border-left-width: 4px; padding: 16px 20px; margin: 24px 0; border-radius: 8px;">
            <p style="margin: 0 0 4px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.6px; font-weight: 700; color: #64748b;">Note from CareerLift Admin:</p>
            <p style="margin: 0; font-size: 14px; color: #1e293b; font-style: italic; line-height: 1.5;">"${customMessage}"</p>
          </div>`
        : ''
    }

    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin: 28px 0;">
      <h2 style="margin: 0 0 16px; font-size: 13px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.75px;">
        Key Platform Advantages
      </h2>

      <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px; line-height: 1.6;">
        <tr>
          <td style="padding: 8px 0; vertical-align: top; width: 28px;">
            <div style="width: 20px; height: 20px; background-color: #dbeafe; color: #1d4ed8; border-radius: 50%; text-align: center; line-height: 20px; font-size: 11px; font-weight: bold;">✓</div>
          </td>
          <td style="padding: 8px 0 8px 10px; vertical-align: top; color: #334155;">
            <strong style="color: #0f172a;">Active Candidate Pool:</strong> Reach 2.5M+ pre-vetted software engineers, product managers, and specialists actively seeking roles.
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; vertical-align: top; width: 28px;">
            <div style="width: 20px; height: 20px; background-color: #dbeafe; color: #1d4ed8; border-radius: 50%; text-align: center; line-height: 20px; font-size: 11px; font-weight: bold;">✓</div>
          </td>
          <td style="padding: 8px 0 8px 10px; vertical-align: top; color: #334155;">
            <strong style="color: #0f172a;">AI Skill Matching:</strong> Automatic algorithmic screening delivers high-relevance applicants with match ratings and structured skill breakdowns.
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; vertical-align: top; width: 28px;">
            <div style="width: 20px; height: 20px; background-color: #dbeafe; color: #1d4ed8; border-radius: 50%; text-align: center; line-height: 20px; font-size: 11px; font-weight: bold;">✓</div>
          </td>
          <td style="padding: 8px 0 8px 10px; vertical-align: top; color: #334155;">
            <strong style="color: #0f172a;">Real-Time Messaging & Interviews:</strong> Directly chat with applicants, schedule interviews, and track pipeline stages in one consolidated dashboard.
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; vertical-align: top; width: 28px;">
            <div style="width: 20px; height: 20px; background-color: #dbeafe; color: #1d4ed8; border-radius: 50%; text-align: center; line-height: 20px; font-size: 11px; font-weight: bold;">✓</div>
          </td>
          <td style="padding: 8px 0 8px 10px; vertical-align: top; color: #334155;">
            <strong style="color: #0f172a;">Complimentary Launch Credits:</strong> Priority listing and featured company profile privileges are enabled with this direct invitation.
          </td>
        </tr>
      </table>
    </div>

    <div style="text-align: center; margin: 36px 0 24px;">
      <a href="${inviteUrl}" class="btn-primary" style="display: inline-block; background-color: #2563eb; color: #ffffff !important; font-weight: 600; font-size: 15px; padding: 14px 36px; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 12px rgba(37,99,235,0.3);">
        Activate Recruiter Account & Post Jobs &rarr;
      </a>
    </div>

    <p style="color: #64748b; font-size: 12px; text-align: center; margin: 24px 0 0; line-height: 1.5;">
      Button not working? Copy and paste this URL into your browser:<br>
      <a href="${inviteUrl}" style="color: #2563eb; word-break: break-all; text-decoration: underline;">${inviteUrl}</a>
    </p>

    <div style="border-top: 1px solid #e2e8f0; margin-top: 28px; padding-top: 16px; text-align: center;">
      <p style="color: #94a3b8; font-size: 11px; margin: 0;">
        This invitation was intended for ${contactName ? contactName : 'hiring teams'}${companyName ? ` at ${companyName}` : ''}. If you are not actively hiring, you may disregard this notice.
      </p>
    </div>
  `;

  return getBaseEmailLayout(`Recruiter Invitation: Hire on CareerLift${companyName ? ` (${companyName})` : ''}`, body);
}

