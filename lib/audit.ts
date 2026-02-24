import { getDb } from "./db"

export async function logAudit(
  actorUserId: string,
  action: string,
  targetType: string,
  targetId?: string,
  meta?: Record<string, unknown>
) {
  const sql = getDb()
  await sql`
    INSERT INTO audit_logs (actor_user_id, action, target_type, target_id, meta)
    VALUES (${actorUserId}, ${action}, ${targetType}, ${targetId || null}, ${meta ? JSON.stringify(meta) : null})
  `
}
