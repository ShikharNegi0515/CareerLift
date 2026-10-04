import { Link, useParams } from 'react-router-dom';
import { Calendar, Clock, User, Tag, ArrowLeft, Share2, Bookmark } from 'lucide-react';

const mockPost = {
  title: '10 Resume Tips That Will Get You Hired in 2026',
  category: 'Career Tips',
  author: 'Sarah Johnson',
  authorBio: 'Career Coach & HR Specialist with 10+ years of experience',
  publishedAt: 'October 1, 2026',
  readTime: '8 min read',
  content: `In today's competitive job market, your resume needs to stand out from hundreds of other applicants. Here are the top 10 resume tips that hiring managers swear by.

## 1. Tailor Your Resume for Each Application

One of the biggest mistakes job seekers make is sending the same generic resume to every employer. Take the time to customize your resume for each position by incorporating relevant keywords from the job description.

## 2. Lead with a Strong Summary

Your professional summary is the first thing recruiters see. Make it count. Write 2–3 sentences that highlight your most impressive qualifications and what makes you unique.

## 3. Quantify Your Achievements

Instead of listing duties, showcase your impact with numbers. "Increased sales by 35%" is far more compelling than "Responsible for sales growth."

## 4. Keep It Concise

Unless you have 15+ years of experience, keep your resume to one page. Recruiters spend an average of 6 seconds scanning a resume — make every word count.

## 5. Use Action Verbs

Start each bullet point with a strong action verb. Words like "Led," "Developed," "Implemented," and "Achieved" convey confidence and initiative.

## 6. Optimize for ATS

Most companies use Applicant Tracking Systems to filter resumes. Use standard headings, include relevant keywords, and avoid graphics or unusual formatting that can trip up these systems.

## 7. Highlight Relevant Skills

Create a dedicated skills section that matches the job requirements. Include both technical skills and soft skills that are relevant to the position.

## 8. Include a Clean, Professional Format

Use a clean, modern template with consistent fonts and adequate white space. Avoid flashy designs unless you're in a creative field.

## 9. Proofread Relentlessly

Typos and grammar errors are instant deal-breakers. Read your resume multiple times, use spell-check, and have someone else review it.

## 10. Update Your LinkedIn to Match

Make sure your LinkedIn profile aligns with your resume. Many recruiters check LinkedIn as a complement to your resume application.

Following these tips will significantly improve your chances of getting past the initial screening and landing that coveted interview.`,
  tags: ['Resume', 'Career Tips', 'Job Search', 'Hiring'],
  relatedPosts: [
    { id: '2', slug: 'post-2', title: 'How to Ace Your Technical Interview', category: 'Interview' },
    { id: '7', slug: 'post-7', title: 'How to Write a Killer Cover Letter', category: 'Career Tips' },
    { id: '5', slug: 'post-5', title: 'Building a Personal Brand on LinkedIn', category: 'Personal Brand' },
  ],
};

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = mockPost;

  // Simple markdown-like rendering
  const renderContent = (text: string) => {
    return text.split('\n\n').map((para, i) => {
      if (para.startsWith('## ')) {
        return <h2 key={i} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1.375rem', color: '#212529', margin: '1.75rem 0 0.75rem' }}>{para.replace('## ', '')}</h2>;
      }
      return <p key={i} style={{ color: '#495057', lineHeight: 1.8, marginBottom: '1rem' }}>{para}</p>;
    });
  };

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1 style={{ fontSize: '1.5rem' }}>{post.title}</h1>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item">/</li>
            <li className="breadcrumb-item"><Link to="/blog">Blog</Link></li>
            <li className="breadcrumb-item">/</li>
            <li className="breadcrumb-item active">Article</li>
          </ol>
        </div>
      </div>

      <section className="section-py" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '2rem', alignItems: 'start' }}>
            {/* Article */}
            <article className="card">
              <Link to="/blog" className="btn btn-light btn-sm" style={{ marginBottom: '1.5rem', display: 'inline-flex', gap: 6 }}>
                <ArrowLeft size={14} /> Back to Blog
              </Link>
              <span className="job-badge badge-primary" style={{ marginBottom: '1rem', display: 'inline-block' }}>
                <Tag size={11} style={{ marginRight: 4 }} />{post.category}
              </span>
              <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '2rem', color: '#212529', lineHeight: 1.3, marginBottom: '1.25rem' }}>
                {post.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e9ecef', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#0d6efd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.8rem' }}>SJ</div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#212529' }}>{post.author}</p>
                    <p style={{ fontSize: '0.75rem', color: '#6c757d' }}>{post.authorBio}</p>
                  </div>
                </div>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.875rem', color: '#6c757d' }}><Calendar size={14} /> {post.publishedAt}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.875rem', color: '#6c757d' }}><Clock size={14} /> {post.readTime}</span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-light btn-sm"><Bookmark size={14} /></button>
                  <button className="btn btn-light btn-sm"><Share2 size={14} /></button>
                </div>
              </div>

              <div style={{ fontSize: '1rem' }}>{renderContent(post.content)}</div>

              {/* Tags */}
              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e9ecef' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#212529', marginBottom: '0.5rem' }}>Tags:</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {post.tags.map((tag) => (
                    <span key={tag} className="job-badge badge-secondary">{tag}</span>
                  ))}
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <div>
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 className="card-title">About the Author</h3>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#0d6efd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.25rem', margin: '0 auto 0.75rem' }}>SJ</div>
                  <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: '#212529' }}>{post.author}</h4>
                  <p style={{ fontSize: '0.8125rem', color: '#6c757d', lineHeight: 1.5 }}>{post.authorBio}</p>
                </div>
              </div>
              <div className="card">
                <h3 className="card-title">Related Articles</h3>
                {post.relatedPosts.map((rp) => (
                  <div key={rp.id} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f0f0f0' }}>
                    <span className="job-badge badge-primary" style={{ marginBottom: '0.5rem', fontSize: '0.75rem' }}>{rp.category}</span>
                    <Link to={`/blog/${rp.slug}`} style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#212529', textDecoration: 'none', lineHeight: 1.4 }}>
                      {rp.title}
                    </Link>
                  </div>
                ))}
                <Link to="/blog" className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>View All Articles</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
