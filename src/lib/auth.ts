import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'math-explorer-tahun-6-super-secret-key-2025'
);

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'cikgu';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'cikgu123';

// Authorized teacher/admin emails for DELIMa Google Workspace login
const AUTHORIZED_TEACHER_EMAILS = (
  process.env.AUTHORIZED_TEACHER_EMAILS || 'cikgu@moe-dl.edu.my,admin@moe-dl.edu.my,cikgu@dl.moe.edu.my'
).split(',').map((e) => e.trim().toLowerCase());

export interface SessionUser {
  name: string;
  email: string;
  role: 'ADMIN' | 'STUDENT';
  isDelima: boolean;
}

export async function verifyCredentials(u: string, p: string): Promise<boolean> {
  return u === ADMIN_USERNAME && p === ADMIN_PASSWORD;
}

export async function createAdminToken(userObj?: Partial<SessionUser>): Promise<string> {
  const payload = {
    role: userObj?.role || 'ADMIN',
    user: userObj?.name || ADMIN_USERNAME,
    email: userObj?.email || `${ADMIN_USERNAME}@moe-dl.edu.my`,
    isDelima: userObj?.isDelima ?? false,
  };

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(SECRET_KEY);
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload.role === 'ADMIN' || payload.role === 'admin';
  } catch {
    return false;
  }
}

export async function getAdminSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    const role = (payload.role === 'ADMIN' || payload.role === 'admin') ? 'ADMIN' : 'STUDENT';
    if (role !== 'ADMIN') return null;

    return {
      name: (payload.user as string) || ADMIN_USERNAME,
      email: (payload.email as string) || `${ADMIN_USERNAME}@moe-dl.edu.my`,
      role: 'ADMIN',
      isDelima: Boolean(payload.isDelima),
    };
  } catch {
    return null;
  }
}

export function isAuthorizedTeacherEmail(email: string): boolean {
  if (!email) return false;
  const lower = email.toLowerCase().trim();

  // Strict email allowlist check against configured AUTHORIZED_TEACHER_EMAILS
  return AUTHORIZED_TEACHER_EMAILS.includes(lower);
}
