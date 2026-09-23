import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'math-explorer-tahun-6-super-secret-key-2025'
);

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'cikgu';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'cikgu123';

export async function verifyCredentials(u: string, p: string): Promise<boolean> {
  return u === ADMIN_USERNAME && p === ADMIN_PASSWORD;
}

export async function createAdminToken(): Promise<string> {
  return await new SignJWT({ role: 'admin', user: ADMIN_USERNAME })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(SECRET_KEY);
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return null;
  const isValid = await verifyAdminToken(token);
  if (!isValid) return null;
  return { role: 'admin', user: ADMIN_USERNAME };
}
