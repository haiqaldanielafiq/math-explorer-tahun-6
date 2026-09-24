import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/auth';

export async function GET() {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
  return NextResponse.json({ authenticated: true, user: session }, { status: 200 });
}
