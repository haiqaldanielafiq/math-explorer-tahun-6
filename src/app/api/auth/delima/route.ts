import { NextResponse } from 'next/server';
import { createAdminToken, isAuthorizedTeacherEmail } from '@/lib/auth';
import { createRemoteJWKSet, jwtVerify } from 'jose';

const GOOGLE_JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));

export async function POST(request: Request) {
  try {
    const { credential } = await request.json();

    if (!credential) {
      return NextResponse.json(
        { success: false, error: 'Token pengesahan Google / DELIMa tidak disertakan.' },
        { status: 400 }
      );
    }

    let email = '';
    let name = 'Akaun DELIMa';
    let picture = '';

    // Cryptographic verification of Google ID Token using Google's public JWKS
    try {
      const { payload } = await jwtVerify(credential, GOOGLE_JWKS, {
        issuer: ['https://accounts.google.com', 'accounts.google.com'],
      });
      email = String(payload.email || '');
      name = String(payload.name || name);
      picture = String(payload.picture || '');
    } catch (e) {
      return NextResponse.json(
        { success: false, error: 'Pengesahan token Google gagal atau token tidak sah.' },
        { status: 401 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'E-mel DELIMa / Google tidak dijumpai dalam token.' },
        { status: 400 }
      );
    }

    // Role Verification: Check if authenticated email is strictly in authorized teacher allowlist
    const isTeacher = isAuthorizedTeacherEmail(email);
    const isDelimaDomain = email.endsWith('@moe-dl.edu.my') || email.endsWith('@dl.moe.edu.my');
    const role = isTeacher ? 'ADMIN' : 'STUDENT';

    // Generate signed JWT session token
    const token = await createAdminToken({
      name,
      email,
      role,
      isDelima: isDelimaDomain,
      picture,
    });

    const redirectUrl = isTeacher ? '/admin/dashboard' : '/';

    const response = NextResponse.json({
      success: true,
      message: isTeacher ? 'Log masuk Guru DELIMa berjaya!' : 'Log masuk Murid DELIMa berjaya!',
      role,
      isDelimaDomain,
      redirectUrl,
      user: { name, email, role, picture },
    });

    // Set cookie for session persistence (ADMIN or STUDENT)
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Ralat pelayan semasa pengesahan DELIMa.' },
      { status: 500 }
    );
  }
}
