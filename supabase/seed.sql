-- InnerCourt Seed Data
-- Demo data for testing

-- Note: This seed assumes you have a demo user in auth.users
-- Replace 'YOUR_DEMO_USER_UUID' with an actual UUID from auth.users
-- Or run this after creating a user through Supabase Auth

-- ============================================================
-- Demo User Profile
-- ============================================================

-- Example UUID (replace with real user after signup)
-- Demo user: demo@innercourt.app

INSERT INTO user_profiles (
  user_id,
  archetype_scores,
  dominant_archetype,
  wheel_of_life,
  birth_date,
  birth_location
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,  -- Replace with real auth.users UUID
  '{
    "SOL": 72,
    "HERO": 58,
    "SAGE": 81,
    "MOTHER": 45,
    "SHADOW": 67,
    "ANIMA": 53,
    "TRICKSTER": 39,
    "CHILD": 62
  }'::jsonb,
  'SAGE',
  '{
    "career": 75,
    "finance": 62,
    "health": 68,
    "relationships": 71,
    "personal": 80,
    "spiritual": 85,
    "recreation": 55,
    "environment": 70
  }'::jsonb,
  '1987-11-05',
  'Rio de Janeiro, Brazil'
)
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================
-- Demo Journal Entries
-- ============================================================

INSERT INTO journal_entries (
  user_id,
  title,
  content,
  archetype,
  mood,
  created_at
) VALUES
(
  '00000000-0000-0000-0000-000000000001'::uuid,
  'The Awakening',
  'Today I realized that my journey is not about becoming someone else, but about remembering who I truly am. The SAGE whispers ancient truths through synchronicities, the HERO pushes me to act on newfound clarity. I am both the question and the answer.',
  'SAGE',
  'transcendent',
  now() - interval '2 days'
),
(
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Shadow Work Session',
  'Confronted the SHADOW today - that part of myself I''ve been avoiding. The discomfort was real, but so was the liberation. Everything I judge in others is a mirror. The TRICKSTER laughed and showed me my own reflection.',
  'SHADOW',
  'transforming',
  now() - interval '1 day'
),
(
  '00000000-0000-0000-0000-000000000001'::uuid,
  NULL,
  'Quiet day. Felt the MOTHER archetype strongly - nurturing, patient, holding space. No need to force growth. Sometimes stillness is the practice.',
  'MOTHER',
  'peaceful',
  now() - interval '3 hours'
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- Demo Insights
-- ============================================================

INSERT INTO insights (
  user_id,
  insight_type,
  title,
  content,
  generated_at,
  viewed
) VALUES
(
  '00000000-0000-0000-0000-000000000001'::uuid,
  'DAILY',
  'Today''s Transmission',
  'Your SAGE (81) and SHADOW (67) are in dynamic tension. The wisdom you seek cannot bypass the darkness you avoid. Today: honor both. Read what makes you uncomfortable. Sit with the questions that have no answers. The TRICKSTER (39) is dormant - consider playing with chaos as medicine.',
  now() - interval '8 hours',
  false
),
(
  '00000000-0000-0000-0000-000000000001'::uuid,
  'ORACLE',
  'Pattern Recognition: The Hermit''s Return',
  'Your wheel of life shows spiritual (85) and personal (80) dimensions thriving while recreation (55) lags. This is the pattern of the hermit who forgets that play is sacred technology. The CHILD (62) knows this. Your assignment: do something purposeless and joyful within 48 hours. No productivity. No growth agenda. Pure delight.',
  now() - interval '1 day',
  true
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- Demo Connection (requires 2 users)
-- ============================================================

-- Uncomment and adjust UUIDs after creating second demo user

-- INSERT INTO connections (
--   user_id,
--   friend_id,
--   status,
--   created_at
-- ) VALUES
-- (
--   '00000000-0000-0000-0000-000000000001'::uuid,
--   '00000000-0000-0000-0000-000000000002'::uuid,
--   'accepted',
--   now() - interval '5 days'
-- )
-- ON CONFLICT DO NOTHING;

-- ============================================================
-- INSTRUCTIONS
-- ============================================================

-- 1. Create a demo user via Supabase Dashboard or Auth API:
--    Email: demo@innercourt.app
--    Password: (your choice)
--
-- 2. Get the user's UUID from auth.users:
--    SELECT id FROM auth.users WHERE email = 'demo@innercourt.app';
--
-- 3. Replace '00000000-0000-0000-0000-000000000001' with real UUID
--
-- 4. Run this seed:
--    Dashboard: SQL Editor → paste → Run
--    CLI: supabase db seed
