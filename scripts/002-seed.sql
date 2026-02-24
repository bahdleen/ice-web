-- Seed: Admin user (password: admin123 - bcrypt hash)
INSERT INTO users (id, full_name, email, password_hash, role)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'System Administrator',
  'admin@ice-portal.gov',
  '$2b$10$8K1p/a0dL1LXMIgoEDFrwOfMQkf9xH8K2jXb3gN6mR.rM1s6NhKHi',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Seed: Demo user (password: user123)
INSERT INTO users (id, full_name, email, password_hash, role)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  'Jane Citizen',
  'user@example.com',
  '$2b$10$8K1p/a0dL1LXMIgoEDFrwOfMQkf9xH8K2jXb3gN6mR.rM1s6NhKHi',
  'user'
) ON CONFLICT (email) DO NOTHING;

-- Seed: Demo cases
INSERT INTO cases (id, case_id, title, category, location_tag, status, person_name, reason_summary, offence_category, offence_description, summary_public, summary_internal)
VALUES
  ('c0000000-0000-0000-0000-000000000001', 'ICE-2026-000001', 'Documentation Review - Martinez', 'documentation', 'Southwest Region', 'Open', 'Carlos Martinez', 'Pending documentation review for residency status verification.', 'documentation', 'Expired visa documentation requiring review and verification of current status.', 'Case open for documentation review.', 'Full review pending supervisor approval. Documents received 2026-01-15.'),
  ('c0000000-0000-0000-0000-000000000002', 'ICE-2026-000002', 'Customs Inquiry - Chen', 'customs', 'Pacific Northwest', 'Under Review', 'Wei Chen', 'Customs declaration discrepancy flagged during routine inspection.', 'customs', 'Commercial goods import documentation mismatch identified during port inspection.', 'Case under review for customs inquiry.', 'Discrepancy between declared and inspected goods. Awaiting importer response.'),
  ('c0000000-0000-0000-0000-000000000003', 'ICE-2026-000003', 'Detention Status - Nguyen', 'detention', 'Southeast Region', 'Escalated', 'Linh Nguyen', 'Detention status review following initial hearing.', 'detention', 'Subject in administrative detention pending immigration court hearing.', 'Case escalated for review.', 'Bond hearing scheduled. Legal representation confirmed. Medical screening complete.')
ON CONFLICT (case_id) DO NOTHING;

-- Seed: Demo report
INSERT INTO reports (id, report_ref, user_id, report_type, location_tag, description, status)
VALUES (
  'd0000000-0000-0000-0000-000000000001',
  'REP-2026-000001',
  'b0000000-0000-0000-0000-000000000001',
  'tip',
  'Midwest Region',
  'Suspicious activity observed near port of entry. Multiple unmarked vehicles.',
  'received'
) ON CONFLICT (report_ref) DO NOTHING;
