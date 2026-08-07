import { NextResponse } from 'next/server';
import { getRegistrationWindowStatus } from '@/lib/registration-window';

export const revalidate = 0;

export async function GET() {
  try {
    const windowStatus = await getRegistrationWindowStatus();
    return NextResponse.json(windowStatus);
  } catch (error) {
    return NextResponse.json({ isOpen: true }, { status: 500 });
  }
}
