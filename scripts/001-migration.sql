-- ICESecurity Portal Database Migration
-- Creates all required tables, indexes, and seed data

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

-- Cases table
CREATE TABLE IF NOT EXISTS cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id text UNIQUE NOT NULL,
  title text NOT NULL,
  category text NOT NULL,
  location_tag text,
  status text NOT NULL DEFAULT 'Open',
  person_name text NOT NULL,
  person_photo_url text,
  reason_summary text,
  offence_category text,
  offence_description text,
  summary_public text,
  summary_internal text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Case participants
CREATE TABLE IF NOT EXISTS case_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES cases(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(case_id, user_id)
);

-- Access requests
CREATE TABLE IF NOT EXISTS access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES cases(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  requested_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES users(id),
  note text,
  UNIQUE(case_id, user_id)
);

-- Reports
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_ref text UNIQUE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  related_case_uuid uuid REFERENCES cases(id),
  report_type text NOT NULL,
  location_tag text,
  incident_datetime timestamptz,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'received',
  created_at timestamptz DEFAULT now()
);

-- Attachments
CREATE TABLE IF NOT EXISTS attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type text NOT NULL,
  owner_id uuid NOT NULL,
  file_url text NOT NULL,
  file_name text,
  mime_type text,
  created_at timestamptz DEFAULT now()
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES cases(id) ON DELETE CASCADE,
  sender_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  sender_role text NOT NULL,
  body text NOT NULL,
  is_internal_note boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid REFERENCES users(id),
  action text NOT NULL,
  target_type text NOT NULL,
  target_id uuid,
  meta jsonb,
  created_at timestamptz DEFAULT now()
);

-- Branding assets
CREATE TABLE IF NOT EXISTS branding_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text NOT NULL,
  placement text NOT NULL,
  alt_text text,
  created_at timestamptz DEFAULT now()
);

-- Branding config
CREATE TABLE IF NOT EXISTS branding_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  landing_hero_asset_id uuid REFERENCES branding_assets(id),
  auth_bg_asset_id uuid REFERENCES branding_assets(id),
  user_bg_asset_id uuid REFERENCES branding_assets(id),
  admin_bg_asset_id uuid REFERENCES branding_assets(id),
  header_texture_asset_id uuid REFERENCES branding_assets(id),
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Sessions table for cookie auth
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cases_case_id ON cases(case_id);
CREATE INDEX IF NOT EXISTS idx_messages_case_id ON messages(case_id);
CREATE INDEX IF NOT EXISTS idx_access_requests_status ON access_requests(status);
CREATE INDEX IF NOT EXISTS idx_reports_report_ref ON reports(report_ref);
CREATE INDEX IF NOT EXISTS idx_case_participants_user_case ON case_participants(user_id, case_id);
CREATE INDEX IF NOT EXISTS idx_branding_assets_placement ON branding_assets(placement);
CREATE INDEX IF NOT EXISTS idx_branding_config_active ON branding_config(is_active);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
