import { getServerSession } from "next-auth";

export async function requireAdmin() {
  const session = await getServerSession();
  if (!session || !(session as any).user || ((session as any).user as any).role !== "ADMIN") {
    throw new Error("NOT_ADMIN");
  }
  return session;
}