/**
 * Email HTML Template Generators
 * World-Class, High-Conversion Transactional & Newsletter Email Designs for CareerLift
 * Optimized for Gmail, Apple Mail, Outlook, mobile & desktop clients
 */

export function getBaseEmailLayout(
  title: string,
  contentHtml: string,
  previewSnippet: string = 'CareerLift Curated Updates & Insights',
): string {
  return `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${title}</title>
  <!--[if mso]>
  <style>
    table, td, div, p, a, span { font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif !important; }
  </style>
  <![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      background-color: #0b1120;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    table { border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
    
    .external-preheader {
      display: none !important;
      visibility: hidden;
      mso-hide: all;
      font-size: 1px;
      line-height: 1px;
      max-height: 0px;
      max-width: 0px;
      opacity: 0;
      overflow: hidden;
    }

    a { text-decoration: none; }
    
    @media only screen and (max-width: 620px) {
      .email-container {
        width: 100% !important;
        margin: 0 auto !important;
        border-radius: 0px !important;
      }
      .mobile-padding {
        padding-left: 20px !important;
        padding-right: 20px !important;
      }
      .mobile-stack {
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      .mobile-center {
        text-align: center !important;
      }
      .mobile-btn {
        display: block !important;
        width: 100% !important;
        text-align: center !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0b1120; color: #1e293b;">
  <!-- Preheader text for inbox preview snippet -->
  <span class="external-preheader">${previewSnippet} &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847;</span>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0b1120; background: radial-gradient(circle at 50% 0%, #172554 0%, #0b1120 70%); min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 32px 12px 48px;">
        <!-- Email Card Wrapper -->
        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08);">
          
          <!-- Top Gradient Accent Strip -->
          <tr>
            <td height="5" style="background: linear-gradient(90deg, #00d2df 0%, #00a7b5 30%, #3b82f6 70%, #6366f1 100%); line-height: 5px; font-size: 5px;">&nbsp;</td>
          </tr>

          <!-- Sleek Modern Brand Header -->
          <tr>
            <td style="padding: 30px 36px 26px; background-color: #ffffff; border-bottom: 1px solid #f1f5f9;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left" style="vertical-align: middle;">
                    <a href="https://careerlift.io" target="_blank" style="text-decoration: none; display: inline-flex; align-items: center;">
                      <table role="presentation" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="width: 36px; height: 36px; background: linear-gradient(135deg, #00a7b5 0%, #007d88 100%); border-radius: 10px; text-align: center; vertical-align: middle; box-shadow: 0 4px 12px rgba(0, 167, 181, 0.35);">
                            <span style="font-size: 19px; line-height: 36px;">⚡</span>
                          </td>
                          <td style="padding-left: 12px;">
                            <span style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 21px; font-weight: 800; color: #0f172a; letter-spacing: -0.6px;">
                              Career<span style="color: #00a7b5;">Lift</span>
                            </span>
                          </td>
                        </tr>
                      </table>
                    </a>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span style="display: inline-block; background-color: #f0fdfa; border: 1px solid #ccfbf1; color: #0f766e; font-size: 11px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; padding: 5px 12px; border-radius: 9999px;">
                      ✦ Elite Network
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Dynamic Body Content -->
          <tr>
            <td class="mobile-padding" style="padding: 36px 36px 32px; background-color: #ffffff;">
              ${contentHtml}
            </td>
          </tr>

          <!-- High-End Signature Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 32px 36px 36px; text-align: center;">
              <!-- Trust Badges Row -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 22px;">
                <tr>
                  <td align="center">
                    <span style="display: inline-block; font-size: 12px; color: #64748b; font-weight: 600; margin: 0 8px;">✓ Verified Tech Teams</span>
                    <span style="color: #cbd5e1;">•</span>
                    <span style="display: inline-block; font-size: 12px; color: #64748b; font-weight: 600; margin: 0 8px;">🔒 Direct Screening</span>
                    <span style="color: #cbd5e1;">•</span>
                    <span style="display: inline-block; font-size: 12px; color: #64748b; font-weight: 600; margin: 0 8px;">🚀 Top 1% Roles</span>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 10px; font-size: 12px; font-weight: 700; color: #334155; letter-spacing: -0.2px;">
                CareerLift Inc. • Connecting Ambition With Opportunity
              </p>
              <p style="margin: 0 0 16px; font-size: 12px; color: #94a3b8; line-height: 1.6;">
                123 Career Street, Floor 14, New York, NY 10001 • Sent with pride from CareerLift Core Engine
              </p>

              <table role="presentation" align="center" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <a href="http://localhost:5173/privacy-policy" target="_blank" style="font-size: 11px; font-weight: 600; color: #64748b; text-decoration: underline; margin: 0 6px;">Privacy Policy</a>
                  </td>
                  <td style="color: #cbd5e1; font-size: 11px;">•</td>
                  <td>
                    <a href="http://localhost:5173/terms" target="_blank" style="font-size: 11px; font-weight: 600; color: #64748b; text-decoration: underline; margin: 0 6px;">Terms of Service</a>
                  </td>
                  <td style="color: #cbd5e1; font-size: 11px;">•</td>
                  <td>
                    <a href="http://localhost:5173/contact" target="_blank" style="font-size: 11px; font-weight: 600; color: #64748b; text-decoration: underline; margin: 0 6px;">Help &amp; Support</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * 1. HIGH-CONVERSION WELCOME EMAIL
 */
export function getWelcomeEmailHtml(name: string, role: string, frontendUrl: string): string {
  const isEmployer = role === 'employer';
  const actionUrl = isEmployer ? `${frontendUrl}/employer` : `${frontendUrl}/jobs`;
  const actionText = isEmployer ? 'Access Employer Dashboard & Post Role' : 'Explore High-Impact Openings';

  const body = `
    <!-- Hero Greeting Header -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 26px;">
      <tr>
        <td align="center">
          <div style="display: inline-block; width: 64px; height: 64px; line-height: 64px; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); border-radius: 20px; font-size: 32px; text-align: center; margin-bottom: 18px; box-shadow: 0 8px 20px rgba(59, 130, 246, 0.15);">
            ${isEmployer ? '💼' : '🚀'}
          </div>
          <span style="display: block; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #00a7b5; margin-bottom: 8px;">
            ${isEmployer ? 'Hiring Partner Onboarding' : 'Welcome to the Top 1% Talent Pool'}
          </span>
          <h1 style="margin: 0 0 12px; font-size: 26px; font-weight: 800; color: #0f172a; line-height: 1.25; letter-spacing: -0.8px;">
            You're in, ${name}! Let's Accelerate Your Journey.
          </h1>
          <p style="margin: 0 auto; max-width: 480px; font-size: 15px; color: #475569; line-height: 1.6;">
            ${
              isEmployer
                ? 'Welcome to the fastest way to source, interview, and hire battle-tested engineers and product specialists without recruiter friction.'
                : 'Your profile is now live on CareerLift. We connect you directly with tech leads and hiring managers paying top-market compensation.'
            }
          </p>
        </td>
      </tr>
    </table>

    <!-- 3 Action Pillars Card -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 18px; padding: 24px; margin: 26px 0;">
      <h3 style="margin: 0 0 16px; font-size: 13px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.8px;">
        ${isEmployer ? 'What You Can Do Right Now' : '3 Quick Steps to Stand Out'}
      </h3>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px; line-height: 1.55;">
        <tr>
          <td style="padding: 10px 0; vertical-align: top; width: 32px;">
            <div style="width: 24px; height: 24px; background: #00a7b5; color: #ffffff; border-radius: 8px; text-align: center; line-height: 24px; font-size: 12px; font-weight: 800;">1</div>
          </td>
          <td style="padding: 10px 0 10px 12px; vertical-align: top; color: #334155;">
            <strong style="color: #0f172a;">${isEmployer ? 'Complete Company Profile:' : 'Polish Your Digital Resume:'}</strong> 
            ${isEmployer ? 'Add your tech stack, perks, and funding stage to attract high-intent seniors.' : 'Upload your PDF resume or build one with our instant parser.'}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; vertical-align: top; width: 32px;">
            <div style="width: 24px; height: 24px; background: #00a7b5; color: #ffffff; border-radius: 8px; text-align: center; line-height: 24px; font-size: 12px; font-weight: 800;">2</div>
          </td>
          <td style="padding: 10px 0 10px 12px; vertical-align: top; color: #334155;">
            <strong style="color: #0f172a;">${isEmployer ? 'Publish First Role:' : 'Set Skill Preferences:'}</strong> 
            ${isEmployer ? 'Post in under 3 minutes with transparent salary tiers to get 2.8x more applications.' : 'Highlight skills like React, TypeScript, Python, or Go for automated match alerts.'}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; vertical-align: top; width: 32px;">
            <div style="width: 24px; height: 24px; background: #00a7b5; color: #ffffff; border-radius: 8px; text-align: center; line-height: 24px; font-size: 12px; font-weight: 800;">3</div>
          </td>
          <td style="padding: 10px 0 10px 12px; vertical-align: top; color: #334155;">
            <strong style="color: #0f172a;">${isEmployer ? 'Direct Kanban Pipeline:' : 'One-Click Fast Apply:'}</strong> 
            ${isEmployer ? 'Manage applicants in a drag-and-drop Jira-style pipeline and schedule calls seamlessly.' : 'Apply in seconds without filling repetitive 50-field external forms.'}
          </td>
        </tr>
      </table>
    </div>

    <!-- High Impact Glowing CTA Button -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0 20px;">
      <tr>
        <td align="center">
          <a href="${actionUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #00a7b5 0%, #008793 100%); color: #ffffff !important; font-size: 15px; font-weight: 700; text-decoration: none; padding: 16px 36px; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0, 167, 181, 0.45); letter-spacing: -0.2px;">
            ${actionText} &rarr;
          </a>
        </td>
      </tr>
    </table>

    <p style="text-align: center; margin: 20px 0 0; font-size: 13px; color: #64748b;">
      Questions? Just reply to this email directly — our member team is always here for you.
    </p>
  `;

  return getBaseEmailLayout(`Welcome to CareerLift, ${name}! 🚀`, body, `Welcome to CareerLift, ${name}! Your career launchpad is ready.`);
}

/**
 * 2. HIGH-CONVERSION JOB SEEKER NEWSLETTER DIGEST
 * Designed like a premium tech job alert with salary tags, match badges, and urgency triggers
 */
export function getJobSeekerNewsletterHtml(
  name: string,
  frontendUrl: string,
  latestJobs: Array<{
    title: string;
    companyName: string;
    location: string;
    salaryMin?: number;
    salaryMax?: number;
    slug: string;
    type?: string;
  }>,
  customHeadline?: string,
  customMessage?: string,
  unsubscribeUrl?: string,
): string {
  const jobsListHtml =
    latestJobs && latestJobs.length > 0
      ? latestJobs
          .map((job, idx) => {
            const isFirst = idx === 0;
            const salaryText =
              job.salaryMin && job.salaryMax
                ? `$${Math.round(job.salaryMin / 1000)}k - $${Math.round(job.salaryMax / 1000)}k / yr`
                : 'Verified Top-Tier Compensation';

            const jobTypeClean = (job.type || 'Full Time').replace('_', ' ').toUpperCase();

            return `
        <!-- Single Job Card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 14px; background: #ffffff; border: 1px solid ${isFirst ? '#99f6e4' : '#e2e8f0'}; border-radius: 16px; overflow: hidden; box-shadow: ${isFirst ? '0 10px 25px -5px rgba(0, 167, 181, 0.12), 0 0 0 1px #00a7b5' : '0 2px 5px rgba(0,0,0,0.03)'}; transition: all 0.2s ease;">
          ${
            isFirst
              ? `<tr>
                  <td colspan="2" style="background: linear-gradient(90deg, #00a7b5 0%, #0284c7 100%); padding: 5px 16px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #ffffff;">
                    ★ HIGHEST MATCH THIS WEEK
                  </td>
                </tr>`
              : ''
          }
          <tr>
            <td style="padding: 20px 20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left" style="vertical-align: top;">
                    <!-- Badge row -->
                    <div style="margin-bottom: 8px;">
                      <span style="display: inline-block; background-color: #f0fdfa; color: #0d9488; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 6px; letter-spacing: 0.5px; border: 1px solid #ccfbf1; margin-right: 6px;">
                        ${jobTypeClean}
                      </span>
                      <span style="display: inline-block; background-color: #eff6ff; color: #2563eb; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 6px; letter-spacing: 0.3px;">
                        📍 ${job.location || 'Remote Available'}
                      </span>
                    </div>

                    <!-- Job Title -->
                    <a href="${frontendUrl}/jobs/${job.slug}" target="_blank" style="font-size: 16px; font-weight: 800; color: #0f172a; text-decoration: none; line-height: 1.35; display: block; margin-bottom: 4px;">
                      ${job.title}
                    </a>

                    <!-- Company and Salary -->
                    <div style="font-size: 13px; color: #64748b;">
                      <strong style="color: #334155;">${job.companyName}</strong> 
                      <span style="color: #cbd5e1; margin: 0 4px;">•</span> 
                      <span style="color: #059669; font-weight: 700;">${salaryText}</span>
                    </div>
                  </td>

                  <!-- Apply Button Right Column -->
                  <td align="right" style="vertical-align: middle; width: 110px; padding-left: 12px;">
                    <a href="${frontendUrl}/jobs/${job.slug}" target="_blank" style="display: inline-block; background: ${isFirst ? 'linear-gradient(135deg, #00a7b5 0%, #0891b2 100%)' : '#0f172a'}; color: #ffffff !important; font-size: 12px; font-weight: 700; padding: 10px 18px; border-radius: 10px; text-decoration: none; white-space: nowrap; box-shadow: 0 4px 10px rgba(0,0,0,0.12);">
                      Apply Now &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `;
          })
          .join('')
      : `
        <div style="text-align: center; padding: 36px 20px; background: #f8fafc; border-radius: 16px; border: 1px dashed #cbd5e1;">
          <p style="font-size: 15px; font-weight: 600; color: #475569; margin: 0 0 6px;">Fresh roles are dropping daily!</p>
          <p style="font-size: 13px; color: #94a3b8; margin: 0 0 16px;">Over 120+ tech teams are currently screening candidates on CareerLift.</p>
          <a href="${frontendUrl}/jobs" style="display: inline-block; background: #00a7b5; color: #fff; padding: 10px 24px; border-radius: 8px; font-size: 13px; font-weight: 700;">Browse All Jobs</a>
        </div>
      `;

  const body = `
    <!-- Eye-catching Top Banner Badge -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
      <tr>
        <td align="center">
          <div style="display: inline-block; background: linear-gradient(135deg, #e6f7f8 0%, #cffafe 100%); border: 1px solid #a5f3fc; padding: 6px 16px; border-radius: 9999px; margin-bottom: 14px;">
            <span style="font-size: 12px; font-weight: 800; color: #0891b2; letter-spacing: 0.5px; text-transform: uppercase;">
              🔥 YOUR WEEKLY CURATED OPPORTUNITIES
            </span>
          </div>
          <h1 style="margin: 0 0 10px; font-size: 26px; font-weight: 800; color: #0f172a; line-height: 1.25; letter-spacing: -0.7px;">
            ${customHeadline || 'High-Paying Roles Matching Your Expertise'}
          </h1>
          <p style="margin: 0 auto; max-width: 500px; font-size: 15px; color: #475569; line-height: 1.6;">
            Hi ${name || 'there'}, we scanned open engineering &amp; tech roles this week. Here are the top verified opportunities ready for your application.
          </p>
        </td>
      </tr>
    </table>

    <!-- Admin Announcement Callout if present -->
    ${
      customMessage
        ? `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
          <tr>
            <td style="background: #f0fdf4; border: 1px solid #bbf7d0; border-left: 5px solid #16a34a; border-radius: 12px; padding: 16px 20px;">
              <span style="display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #15803d; margin-bottom: 4px;">
                📢 Editor's Highlight
              </span>
              <p style="margin: 0; font-size: 14px; color: #166534; line-height: 1.6;">${customMessage}</p>
            </td>
          </tr>
        </table>
        `
        : ''
    }

    <!-- Curated Job Cards Section -->
    <div style="margin-bottom: 30px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 14px;">
        <tr>
          <td align="left">
            <h2 style="margin: 0; font-size: 14px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.8px;">
              🔥 Featured Openings This Week
            </h2>
          </td>
          <td align="right">
            <a href="${frontendUrl}/jobs" target="_blank" style="font-size: 12px; font-weight: 700; color: #00a7b5; text-decoration: underline;">
              View all 200+ &rarr;
            </a>
          </td>
        </tr>
      </table>

      ${jobsListHtml}
    </div>

    <!-- Career Booster Box -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 20px; overflow: hidden; margin: 32px 0 20px; box-shadow: 0 15px 30px -10px rgba(15, 23, 42, 0.4);">
      <tr>
        <td style="padding: 28px 24px; text-align: center; color: #ffffff;">
          <span style="font-size: 26px; display: inline-block; margin-bottom: 8px;">🎯</span>
          <h3 style="margin: 0 0 8px; font-size: 18px; font-weight: 800; color: #ffffff; letter-spacing: -0.3px;">
            Want hiring managers to reach out to you first?
          </h3>
          <p style="margin: 0 auto 20px; font-size: 13px; color: #94a3b8; max-width: 440px; line-height: 1.6;">
            Candidates with updated resumes and verified portfolio links get <strong>4.2x more direct interview requests</strong> from founders and engineering leaders.
          </p>
          <a href="${frontendUrl}/dashboard/resumes" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #00a7b5 0%, #008f9c 100%); color: #ffffff !important; font-size: 13px; font-weight: 700; padding: 12px 28px; border-radius: 10px; text-decoration: none; box-shadow: 0 4px 14px rgba(0, 167, 181, 0.4);">
            Update Your Resume Profile &rarr;
          </a>
        </td>
      </tr>
    </table>

    <!-- Unsubscribe footer notes -->
    ${
      unsubscribeUrl
        ? `
        <p style="text-align: center; font-size: 11px; color: #94a3b8; margin: 24px 0 0; line-height: 1.5;">
          You are receiving this digest because you are subscribed to CareerLift Job Updates.<br>
          <a href="${unsubscribeUrl}" target="_blank" style="color: #64748b; text-decoration: underline;">One-click Unsubscribe from newsletter</a>
        </p>
        `
        : ''
    }
  `;

  return getBaseEmailLayout(
    '⚡ Hot Tech Openings Picked Just For You | CareerLift',
    body,
    `Top high-paying tech openings handpicked for ${name || 'you'} this week on CareerLift.`,
  );
}

/**
 * 3. HIGH-CONVERSION EMPLOYER / RECRUITER NEWSLETTER DIGEST
 * Designed with dynamic executive dashboard metrics, candidate skills analytics, and immediate hiring CTAs
 */
export function getEmployerNewsletterHtml(
  name: string,
  frontendUrl: string,
  stats: {
    activeSeekersCount?: number;
    recentApplicationsCount?: number;
    popularSkills?: string[];
  },
  customHeadline?: string,
  customMessage?: string,
  unsubscribeUrl?: string,
): string {
  const seekersCount = (stats.activeSeekersCount && stats.activeSeekersCount > 0) ? `${stats.activeSeekersCount.toLocaleString()}+` : '3,200+';
  const appsCount = (stats.recentApplicationsCount && stats.recentApplicationsCount > 0) ? `${stats.recentApplicationsCount}` : '140+';

  const skills = stats.popularSkills?.length
    ? stats.popularSkills
    : ['React', 'TypeScript', 'Node.js', 'Next.js', 'Python', 'DevOps', 'AWS', 'System Design'];

  const skillsBadges = skills
    .map(
      (s) =>
        `<span style="display: inline-block; background-color: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; margin: 3px 4px 3px 0; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">${s}</span>`,
    )
    .join(' ');

  const body = `
    <!-- Top Recruiter Header -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 26px;">
      <tr>
        <td align="center">
          <div style="display: inline-block; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 1px solid #bfdbfe; padding: 6px 16px; border-radius: 9999px; margin-bottom: 14px;">
            <span style="font-size: 12px; font-weight: 800; color: #1d4ed8; letter-spacing: 0.5px; text-transform: uppercase;">
              📊 TALENT PIPELINE &amp; MARKET PULSE
            </span>
          </div>
          <h1 style="margin: 0 0 10px; font-size: 26px; font-weight: 800; color: #0f172a; line-height: 1.25; letter-spacing: -0.7px;">
            ${customHeadline || 'Weekly Recruiter Intelligence & Candidate Dynamics'}
          </h1>
          <p style="margin: 0 auto; max-width: 500px; font-size: 15px; color: #475569; line-height: 1.6;">
            Hi ${name || 'Hiring Leader'}, here is your snapshot of active candidate availability, response velocity, and top tech skills entering the market this week.
          </p>
        </td>
      </tr>
    </table>

    ${
      customMessage
        ? `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
          <tr>
            <td style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 5px solid #2563eb; border-radius: 12px; padding: 16px 20px;">
              <span style="display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #2563eb; margin-bottom: 4px;">
                💡 Priority Bulletin
              </span>
              <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.6;">${customMessage}</p>
            </td>
          </tr>
        </table>
        `
        : ''
    }

    <!-- High-Impact Analytics Bento Grid -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; margin-bottom: 28px;">
      <h3 style="margin: 0 0 16px; font-size: 12px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.9px;">
        Platform Candidate Metrics (Last 7 Days)
      </h3>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
        <tr>
          <!-- Metric 1 -->
          <td width="32%" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px 14px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
            <div style="font-size: 26px; font-weight: 800; color: #00a7b5; line-height: 1;">${seekersCount}</div>
            <div style="font-size: 11px; font-weight: 700; color: #475569; margin-top: 6px; text-transform: uppercase; letter-spacing: 0.4px;">Active Candidates</div>
          </td>
          <td width="2%">&nbsp;</td>
          <!-- Metric 2 -->
          <td width="32%" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px 14px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
            <div style="font-size: 26px; font-weight: 800; color: #2563eb; line-height: 1;">&lt; 24h</div>
            <div style="font-size: 11px; font-weight: 700; color: #475569; margin-top: 6px; text-transform: uppercase; letter-spacing: 0.4px;">Avg. Response</div>
          </td>
          <td width="2%">&nbsp;</td>
          <!-- Metric 3 -->
          <td width="32%" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px 14px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
            <div style="font-size: 26px; font-weight: 800; color: #16a34a; line-height: 1;">94.2%</div>
            <div style="font-size: 11px; font-weight: 700; color: #475569; margin-top: 6px; text-transform: uppercase; letter-spacing: 0.4px;">Verified Profiles</div>
          </td>
        </tr>
      </table>

      <!-- Hot Skills Cloud -->
      <div style="background-color: #f1f5f9; border-radius: 12px; padding: 16px; margin-top: 10px;">
        <span style="display: block; font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
          ⚡ High-Demand Technical Skills Available Now:
        </span>
        <div>${skillsBadges}</div>
      </div>
    </div>

    <!-- Recruiter Growth Tip Card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px; border: 1px solid #fed7aa; background: #fffaf5; border-radius: 16px;">
      <tr>
        <td style="padding: 20px 22px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="vertical-align: top; width: 36px;">
                <div style="width: 28px; height: 28px; background: #ea580c; color: #ffffff; border-radius: 8px; text-align: center; line-height: 28px; font-size: 14px;">💡</div>
              </td>
              <td style="vertical-align: top; padding-left: 10px;">
                <h4 style="margin: 0 0 4px; font-size: 14px; font-weight: 800; color: #9a3412;">
                  Recruiter Strategy for Faster Closes:
                </h4>
                <p style="margin: 0; font-size: 13px; color: #7c2d12; line-height: 1.6;">
                  Positions listing explicit compensation bands fill in <strong>11.4 fewer days</strong> than undisclosed roles. Drag-and-drop candidates directly inside your Kanban dashboard to initiate interviews within 48 hours.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Primary Action Center Buttons -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0 20px;">
      <tr>
        <td align="center">
          <a href="${frontendUrl}/employer/jobs/new" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #00a7b5 0%, #008793 100%); color: #ffffff !important; font-size: 15px; font-weight: 700; text-decoration: none; padding: 15px 36px; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0, 167, 181, 0.45); letter-spacing: -0.2px;">
            Post a New Position Now &rarr;
          </a>
          <div style="margin-top: 14px;">
            <a href="${frontendUrl}/employer" target="_blank" style="font-size: 13px; font-weight: 700; color: #475569; text-decoration: underline;">
              Open Employer Pipeline Dashboard
            </a>
          </div>
        </td>
      </tr>
    </table>

    ${
      unsubscribeUrl
        ? `
        <p style="text-align: center; font-size: 11px; color: #94a3b8; margin: 24px 0 0; line-height: 1.5;">
          You received this bulletin because you manage an Employer account on CareerLift.<br>
          <a href="${unsubscribeUrl}" target="_blank" style="color: #64748b; text-decoration: underline;">Unsubscribe from employer digests</a>
        </p>
        `
        : ''
    }
  `;

  return getBaseEmailLayout(
    '💼 Candidate Availability & Hiring Pulse | CareerLift Recruiter Digest',
    body,
    `Weekly hiring intelligence: active talent metrics and in-demand tech profiles on CareerLift.`,
  );
}

/**
 * 4. RECRUITER INVITATION / PARTNER EMAIL
 */
export function getRecruiterInviteEmailHtml(
  contactName: string | null,
  companyName: string | null,
  inviteUrl: string,
  customMessage?: string | null,
): string {
  const greeting = contactName ? `Hi ${contactName},` : 'Hello,';
  const companyHighlight = companyName ? ` for <strong>${companyName}</strong>` : '';

  const body = `
    <!-- Top Partner Pill -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
      <tr>
        <td align="center">
          <div style="display: inline-block; background: #eff6ff; border: 1px solid #bfdbfe; padding: 6px 16px; border-radius: 9999px; margin-bottom: 14px;">
            <span style="font-size: 12px; font-weight: 800; color: #1d4ed8; letter-spacing: 0.5px; text-transform: uppercase;">
              ✦ EXCLUSIVE HIRING PARTNERSHIP INVITATION
            </span>
          </div>
          <h1 style="margin: 0 0 10px; font-size: 26px; font-weight: 800; color: #0f172a; line-height: 1.25; letter-spacing: -0.7px;">
            Hire Elite Software Engineers &amp; Product Talent${companyName ? ` at ${companyName}` : ''}
          </h1>
          <p style="margin: 0 auto; max-width: 500px; font-size: 15px; color: #475569; line-height: 1.6;">
            ${greeting} you've been extended an invitation to partner with CareerLift's curated tech hiring network${companyHighlight}.
          </p>
        </td>
      </tr>
    </table>

    ${
      customMessage
        ? `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
          <tr>
            <td style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 5px solid #00a7b5; border-radius: 12px; padding: 16px 20px;">
              <span style="display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #00a7b5; margin-bottom: 4px;">
                Note From CareerLift Team
              </span>
              <p style="margin: 0; font-size: 14px; color: #1e293b; font-style: italic; line-height: 1.6;">"${customMessage}"</p>
            </td>
          </tr>
        </table>
        `
        : ''
    }

    <!-- 4 Key Value Pillars -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 18px; padding: 24px; margin: 26px 0;">
      <h3 style="margin: 0 0 16px; font-size: 13px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.8px;">
        Why World-Class Teams Hire on CareerLift
      </h3>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px; line-height: 1.6;">
        <tr>
          <td style="padding: 10px 0; vertical-align: top; width: 32px;">
            <div style="width: 22px; height: 22px; background: #e0f2fe; color: #0284c7; border-radius: 50%; text-align: center; line-height: 22px; font-size: 12px; font-weight: bold;">✓</div>
          </td>
          <td style="padding: 10px 0 10px 12px; vertical-align: top; color: #334155;">
            <strong style="color: #0f172a;">Pre-Vetted Senior Engineers:</strong> Direct access to candidates specializing in modern stacks (React, TypeScript, Go, Python, Cloud).
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; vertical-align: top; width: 32px;">
            <div style="width: 22px; height: 22px; background: #e0f2fe; color: #0284c7; border-radius: 50%; text-align: center; line-height: 22px; font-size: 12px; font-weight: bold;">✓</div>
          </td>
          <td style="padding: 10px 0 10px 12px; vertical-align: top; color: #334155;">
            <strong style="color: #0f172a;">Built-in Kanban Pipeline:</strong> Eliminate chaotic spreadsheets with instant drag-and-drop stage tracking.
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; vertical-align: top; width: 32px;">
            <div style="width: 22px; height: 22px; background: #e0f2fe; color: #0284c7; border-radius: 50%; text-align: center; line-height: 22px; font-size: 12px; font-weight: bold;">✓</div>
          </td>
          <td style="padding: 10px 0 10px 12px; vertical-align: top; color: #334155;">
            <strong style="color: #0f172a;">Direct Chat &amp; Interviews:</strong> Message candidates directly and schedule interviews without waiting on external middle-men.
          </td>
        </tr>
      </table>
    </div>

    <!-- Glowing Action Button -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 34px 0 24px;">
      <tr>
        <td align="center">
          <a href="${inviteUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #00a7b5 0%, #008793 100%); color: #ffffff !important; font-size: 15px; font-weight: 700; text-decoration: none; padding: 16px 40px; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0, 167, 181, 0.45); letter-spacing: -0.2px;">
            Activate Recruiter Account &amp; Post Free &rarr;
          </a>
        </td>
      </tr>
    </table>

    <p style="color: #64748b; font-size: 12px; text-align: center; margin: 20px 0 0; line-height: 1.5;">
      Button not opening? Copy &amp; paste this link into your browser:<br>
      <a href="${inviteUrl}" target="_blank" style="color: #00a7b5; word-break: break-all; text-decoration: underline;">${inviteUrl}</a>
    </p>
  `;

  return getBaseEmailLayout(
    `Exclusive Partner Invitation: Hire on CareerLift${companyName ? ` (${companyName})` : ''}`,
    body,
    `Partner invitation for ${contactName ? contactName : 'hiring leaders'} to access CareerLift's talent network.`,
  );
}

/**
 * Other transactional email helpers
 */
export function getApplicationReceivedEmailHtml(
  candidateName: string,
  jobTitle: string,
  companyName: string,
  frontendUrl: string,
): string {
  const actionUrl = `${frontendUrl}/dashboard/applications`;
  const body = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
      <tr>
        <td align="center">
          <div style="display: inline-block; width: 60px; height: 60px; line-height: 60px; background: #e0f2fe; border-radius: 18px; font-size: 28px; text-align: center; margin-bottom: 14px;">
            📄
          </div>
          <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 800; color: #0f172a;">Application Submitted!</h1>
          <p style="margin: 0; font-size: 14px; color: #64748b;">Hi ${candidateName}, your profile was transmitted successfully.</p>
        </td>
      </tr>
    </table>

    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin-bottom: 26px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 6px 0; font-size: 14px; color: #64748b;">Target Position:</td>
          <td align="right" style="padding: 6px 0; font-size: 14px; font-weight: 700; color: #0f172a;">${jobTitle}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-size: 14px; color: #64748b;">Company:</td>
          <td align="right" style="padding: 6px 0; font-size: 14px; font-weight: 700; color: #0f172a;">${companyName}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-size: 14px; color: #64748b;">Current Stage:</td>
          <td align="right" style="padding: 6px 0;">
            <span style="background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 800; text-transform: uppercase;">Applied</span>
          </td>
        </tr>
      </table>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${actionUrl}" target="_blank" style="display: inline-block; background: #00a7b5; color: #ffffff !important; font-size: 14px; font-weight: 700; padding: 14px 32px; border-radius: 10px; text-decoration: none;">
        Track Application in Real-Time &rarr;
      </a>
    </div>
  `;

  return getBaseEmailLayout(`Application Received for ${jobTitle}`, body, `Application submitted for ${jobTitle} at ${companyName}`);
}

export function getApplicationStatusUpdatedEmailHtml(
  candidateName: string,
  jobTitle: string,
  companyName: string,
  newStatus: string,
  frontendUrl: string,
): string {
  const actionUrl = `${frontendUrl}/dashboard/applications`;
  const body = `
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 800; color: #0f172a;">Status Update on Your Application</h1>
      <p style="margin: 0; font-size: 14px; color: #64748b;">Hi ${candidateName}, there is progress on your candidacy.</p>
    </div>

    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 22px; margin-bottom: 26px; text-align: center;">
      <div style="font-size: 13px; color: #64748b; margin-bottom: 6px;">${companyName} updated your stage for <strong>${jobTitle}</strong> to:</div>
      <div style="display: inline-block; background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; font-size: 14px; font-weight: 800; text-transform: uppercase; padding: 8px 18px; border-radius: 8px;">
        ${newStatus.toUpperCase()}
      </div>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${actionUrl}" target="_blank" style="display: inline-block; background: #00a7b5; color: #ffffff !important; font-size: 14px; font-weight: 700; padding: 14px 32px; border-radius: 10px; text-decoration: none;">
        View Next Steps &rarr;
      </a>
    </div>
  `;

  return getBaseEmailLayout(`Application Update: ${jobTitle} at ${companyName}`, body);
}

export function getNewApplicantEmployerEmailHtml(
  employerName: string,
  candidateName: string,
  jobTitle: string,
  frontendUrl: string,
): string {
  const actionUrl = `${frontendUrl}/employer/applicants`;
  const body = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; width: 56px; height: 56px; line-height: 56px; background: #dcfce7; border-radius: 16px; font-size: 26px; margin-bottom: 12px;">
        ⚡
      </div>
      <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 800; color: #0f172a;">New Candidate Applied!</h1>
      <p style="margin: 0; font-size: 14px; color: #64748b;">Hi ${employerName}, an applicant just entered your hiring pipeline.</p>
    </div>

    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin-bottom: 26px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 6px 0; font-size: 14px; color: #64748b;">Candidate Name:</td>
          <td align="right" style="padding: 6px 0; font-size: 14px; font-weight: 700; color: #0f172a;">${candidateName}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-size: 14px; color: #64748b;">Role Applied:</td>
          <td align="right" style="padding: 6px 0; font-size: 14px; font-weight: 700; color: #00a7b5;">${jobTitle}</td>
        </tr>
      </table>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${actionUrl}" target="_blank" style="display: inline-block; background: #00a7b5; color: #ffffff !important; font-size: 14px; font-weight: 700; padding: 14px 34px; border-radius: 10px; text-decoration: none;">
        Review Resume &amp; Profile &rarr;
      </a>
    </div>
  `;

  return getBaseEmailLayout(`New Applicant: ${candidateName} for ${jobTitle}`, body);
}

export function getPasswordResetEmailHtml(name: string, resetUrl: string): string {
  const body = `
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 800; color: #0f172a;">Reset Your Password</h1>
      <p style="margin: 0; font-size: 14px; color: #64748b;">Hi ${name}, click below to set a new secure password.</p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" target="_blank" style="display: inline-block; background: #00a7b5; color: #ffffff !important; font-size: 14px; font-weight: 700; padding: 14px 36px; border-radius: 10px; text-decoration: none;">
        Reset Password &rarr;
      </a>
    </div>

    <p style="font-size: 12px; color: #94a3b8; text-align: center;">
      This link will expire in 60 minutes. If you did not request this, please disregard this email.
    </p>
  `;

  return getBaseEmailLayout('Reset Your CareerLift Password', body);
}

export function getEmailVerificationHtml(name: string, verifyUrl: string): string {
  const body = `
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 800; color: #0f172a;">Verify Your Email Address</h1>
      <p style="margin: 0; font-size: 14px; color: #64748b;">Hi ${name}, please confirm your email to activate your account.</p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${verifyUrl}" target="_blank" style="display: inline-block; background: #00a7b5; color: #ffffff !important; font-size: 14px; font-weight: 700; padding: 14px 36px; border-radius: 10px; text-decoration: none;">
        Verify Email Address &rarr;
      </a>
    </div>
  `;

  return getBaseEmailLayout('Verify Your CareerLift Account', body);
}

export function getJobAlertDigestEmailHtml(
  name: string,
  jobs: Array<{ title: string; companyName: string; location: string; slug?: string }>,
  frontendUrl: string,
): string {
  const formatted = jobs.map(j => ({ ...j, slug: j.slug || '' }));
  return getJobSeekerNewsletterHtml(name, frontendUrl, formatted as any);
}

