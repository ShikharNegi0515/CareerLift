import SeekerSettings from '../seeker/SeekerSettings';

export default function EmployerSettings() {
  // We can reuse the same layout/component as SeekerSettings for MVP, 
  // since the core account & password features are the same.
  // In a real app, this might have billing or team management tabs.
  return <SeekerSettings />;
}
