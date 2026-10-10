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
  
  if (!content.includes('Relation')) {
    content = content.replace(/from 'typeorm';/, ",\n  Relation\n} from 'typeorm';");
  }
  
  const relationTypes = ['User', 'JobSeekerProfile', 'EmployerProfile', 'Job', 'Company', 'JobCategory', 'Application', 'SavedJob', 'Resume'];
  
  relationTypes.forEach(type => {
    // Single relations
    const regexSingle = new RegExp(': ' + type + ';', 'g');
    content = content.replace(regexSingle, ': Relation<' + type + '>;');
    
    // Array relations
    const regexArray = new RegExp(': ' + type + '\\\\[\\\\];', 'g');
    content = content.replace(regexArray, ': Relation<' + type + '[]>;');
  });
  
  fs.writeFileSync(p, content);
});
console.log('Fixed TypeORM circular dependencies');
