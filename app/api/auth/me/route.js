import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';

export async function GET(req) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  return NextResponse.json({ user });
}
