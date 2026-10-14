/**
 * Email HTML Template Generators
 * Clean, responsive transactional email designs for CareerLift
 */

export function getBaseEmailLayout(title: string, contentHtml: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
    .wrapper { width: 100%; table-layout: fixed; background-color: #f4f6f8; padding: 40px 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%); padding: 32px; text-align: center; }
    .logo { color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; text-decoration: none; }
    .content { padding: 36px 32px; color: #212529; line-height: 1.6; font-size: 15px; }
    .btn { display: inline-block; background-color: #0d6efd; color: #ffffff !important; font-weight: 600; font-size: 15px; padding: 12px 28px; text-decoration: none; border-radius: 8px; margin-top: 20px; box-shadow: 0 2px 4px rgba(13,110,253,0.2); }
    .footer { padding: 24px 32px; background-color: #f8f9fa; border-top: 1px solid #e9ecef; text-align: center; font-size: 13px; color: #6c757d; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-weight: 600; font-size: 13px; }
    .badge-applied { background-color: #cff4fc; color: #055160; }
    .badge-shortlisted { background-color: #d1e7dd; color: #0f5132; }
    .badge-rejected { background-color: #f8d7da; color: #842029; }
    .badge-hired { background-color: #d1e7dd; color: #0f5132; }
  </style>
</head>
<body>
  <div class="wrapper">
    <table class="container" role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td class="header">
          <div class="logo">🚀 CareerLift</div>
        </td>
      </tr>
      <tr>
        <td class="content">
          ${contentHtml}
        </td>
      </tr>
      <tr>
        <td class="footer">
          <p style="margin: 0 0 8px;">© ${new Date().getFullYear()} CareerLift Inc. All rights reserved.</p>
          <p style="margin: 0; font-size: 12px; color: #adb5bd;">Connecting talent with opportunity worldwide.</p>
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

