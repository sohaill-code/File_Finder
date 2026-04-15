import { prisma } from "@/lib/prisma";

type AuditAction =
  | "CREATE_PARTY"
  | "UPDATE_PARTY"
  | "DELETE_PARTY"
  | "SUBSCRIBE"
  | "SUBSCRIPTION_CHARGED"
  | "SUBSCRIPTION_CANCELLED"
  | "SUBSCRIPTION_HALTED"
  | "ROLE_CHANGE"
  | "LOGIN"
  | "EXPORT";

interface AuditOptions {
  userId: string;
  action: AuditAction;
  target?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
}

export async function logAudit(opts: AuditOptions): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: opts.userId,
        action: opts.action,
        target: opts.target,
        targetId: opts.targetId,
        metadata: opts.metadata ? JSON.stringify(opts.metadata) : undefined,
        ip: opts.ip,
      },
    });
  } catch (err) {
    // Don't let audit failures break the main flow
    console.error("[AuditLog] Failed to write:", err);
  }
}
