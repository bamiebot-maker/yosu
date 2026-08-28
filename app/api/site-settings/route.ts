import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const settings = await db.siteSetting.findMany().catch(() => []);
    const map = settings.reduce<Record<string, string>>((acc, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {});

    return NextResponse.json({
      address: map['contact_address'] || 'Federal University Dutse, PMB 7156, Dutse, Jigawa State, Nigeria',
      email: map['contact_email'] || 'info@yosu.fud.edu.ng',
      phone: map['contact_phone'] || '+234 801 234 5678',
      whatsapp: map['contact_whatsapp'] || '+234 801 234 5678',
      facebook: map['social_facebook'] || null,
      instagram: map['social_instagram'] || null,
      twitter: map['social_twitter'] || null,
    });
  } catch (error) {
    return NextResponse.json({
      address: 'Federal University Dutse, PMB 7156, Dutse, Jigawa State, Nigeria',
      email: 'info@yosu.fud.edu.ng',
      phone: '+234 801 234 5678',
    });
  }
}
