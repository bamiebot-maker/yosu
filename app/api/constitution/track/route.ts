import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { type, versionId } = await request.json();

    if (!versionId) {
      return NextResponse.json({ error: 'Missing version ID' }, { status: 400 });
    }

    if (type === 'download') {
      await db.constitutionVersion.update({
        where: { id: versionId },
        data: { downloadsCount: { increment: 1 } },
      });
      return NextResponse.json({ success: true, action: 'download_incremented' });
    }

    if (type === 'view') {
      await db.constitutionVersion.update({
        where: { id: versionId },
        data: { viewsCount: { increment: 1 } },
      });
      return NextResponse.json({ success: true, action: 'view_incremented' });
    }

    return NextResponse.json({ error: 'Invalid tracking type' }, { status: 400 });
  } catch (error) {
    console.error('Error tracking constitution analytics:', error);
    return NextResponse.json({ error: 'Failed to record tracking event' }, { status: 500 });
  }
}
