import { NextResponse } from 'next/server';
import { createAdminToken, isAuthorizedTeacherEmail } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { credential, email: mockEmail, name: mockName } = await request.json();

    let email = mockEmail || '';
    let name = mockName || 'Akaun DELIMa';

    // If a Google ID Token credential was supplied, attempt to parse basic payload
    if (credential) {
      try {
        const parts = credential.split('.');
        if (parts.length === 3) {
          const payloadJson = Buffer.from(parts[1], 'base64').toString('utf-8');
          const payload = JSON.parse(payloadJson);
          email = payload.email || email;
          name = payload.name || name;
        }
      } catch {
        // payload parse fallback
      }
    }

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'E-mel DELIMa / Google tidak dijumpai.' },
        { status: 400 }
      );
    }

    const isTeacher = isAuthorizedTeacherEmail(email);
    const isDelimaDomain = email.endsWith('@moe-dl.edu.my') || email.endsWith('@dl.moe.edu.my');

    const role = isTeacher ? 'ADMIN' : 'STUDENT';
    const token = await createAdminToken({
      name,
      email,
      role,
      isDelima: isDelimaDomain,
    });

    const response = NextResponse.json({
      success: true,
      message: isTeacher ? 'Log masuk Guru DELIMa berjaya!' : 'Log masuk Murid DELIMa berjaya!',
      role,
      isDelimaDomain,
      user: { name, email, role },
    });

    // Only set administrative session cookie if account is an authorized ADMIN teacher
    if (isTeacher) {
      response.cookies.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
      });
    }

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Ralat pelayan semasa pengesahan DELIMa.' },
      { status: 500 }
    );
  }
}
