import fs from 'fs';
import path from 'path';

const files = [
  'applications/application.entity.ts',
  'jobs/job.entity.ts',
  'categories/job-category.entity.ts',
  'resumes/resume.entity.ts',
  'saved-jobs/saved-job.entity.ts',
  'auth/user.entity.ts',
  'users/job-seeker-profile.entity.ts',
  'users/employer-profile.entity.ts',
  'companies/company.entity.ts'
];

files.forEach(f => {
  const p = path.join('/home/shikhar/Projects/CareerLift/backend/src/modules', f);
  let content = fs.readFileSync(p, 'utf8');
  
  // Fix the invalid import syntax using split and join to avoid regex issues
  content = content.replace(/}\\s*,\\s*Relation\\s*} from 'typeorm';/g, "} from 'typeorm';");
  content = content.replace(/}\\s*,\\n\\s*Relation\\n} from 'typeorm';/g, "} from 'typeorm';");
  
  // Just a simple find and replace
  const brokenPart = "} ,\n  Relation\n} from 'typeorm';";
  if (content.includes(brokenPart)) {
    content = content.replace(brokenPart, ", Relation } from 'typeorm';");
  }

  const brokenPart2 = "} ,\n  Relation\n} from 'typeorm';";
  // The first replacement from the old script was: `,\n  Relation\n} from 'typeorm';` replacing `from 'typeorm';`
  // That resulted in `} ,\n  Relation\n} from 'typeorm';`
  
  // We can just find `} ,\n  Relation\n}` and replace it with `, Relation }`
  content = content.replace(/}\\s*,\\s*Relation\\s*}/g, ", Relation }");
  
  fs.writeFileSync(p, content);
});
console.log('Fixed imports again');
