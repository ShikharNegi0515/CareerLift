/**
 * Resume Parsing Utility
 * Extracts candidate skills, summary, phone, email, and experience signals from resume text.
 */

// Common tech, product, design, and business skills dictionary
const KNOWN_SKILLS = [
  // Languages & Runtimes
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Golang', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'SQL',
  // Frontend
  'React', 'React.js', 'Next.js', 'Vue', 'Vue.js', 'Angular', 'HTML5', 'CSS3', 'Sass', 'Tailwind CSS', 'Redux', 'GraphQL',
  // Backend & APIs
  'Node.js', 'Express', 'Express.js', 'NestJS', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'REST APIs', 'gRPC', 'Microservices',
  // Databases & Caches
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'DynamoDB', 'SQLite', 'Prisma', 'TypeORM',
  // DevOps & Cloud
  'Docker', 'Kubernetes', 'AWS', 'Amazon Web Services', 'Azure', 'GCP', 'Google Cloud', 'CI/CD', 'GitHub Actions', 'Terraform', 'Linux',
  // Data & AI
  'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Data Science', 'Pandas', 'NumPy', 'Scikit-learn', 'NLP', 'Computer Vision',
  // Testing & Tools
  'Git', 'GitHub', 'GitLab', 'Jest', 'Cypress', 'Playwright', 'Vitest', 'Postman', 'Jira', 'Agile', 'Scrum',
  // Product & Design
  'Figma', 'UI/UX', 'Wireframing', 'Product Management', 'Roadmapping', 'User Research'
];

export interface ParsedResumeResult {
  text: string;
  skills: string[];
  extractedEmail?: string;
  extractedPhone?: string;
}

export function extractSkillsFromText(text: string): string[] {
  if (!text) return [];

  const foundSkills = new Set<string>();
  const lowerText = text.toLowerCase();

  for (const skill of KNOWN_SKILLS) {
    // Regex word boundary matching, handling special characters like C++, C#, .js
    const escaped = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9_#+])${escaped}(?:$|[^a-zA-Z0-9_#+])`, 'i');

    if (regex.test(lowerText) || regex.test(text)) {
      foundSkills.add(skill);
    }
  }

  return Array.from(foundSkills);
}

export function extractEmail(text: string): string | undefined {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : undefined;
}

export function extractPhone(text: string): string | undefined {
  const match = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  return match ? match[0] : undefined;
}
