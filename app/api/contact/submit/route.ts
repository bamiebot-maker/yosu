import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, institution, state, subject, category, message } = body;

    // 1. Server-side Validation
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Full Name is required (minimum 2 characters).' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid telephone number.' },
        { status: 400 }
      );
    }

    if (!subject || typeof subject !== 'string' || subject.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'Subject is required (minimum 3 characters).' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Message content is required (minimum 10 characters).' },
        { status: 400 }
      );
    }

    // 2. Simple IP Rate Limiting (Max 5 submissions per IP within 10 minutes)
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    const recentSubmissionsCount = await db.contactMessage.count({
      where: {
        ipAddress: ip,
        createdAt: { gte: tenMinutesAgo },
      },
    });

    if (recentSubmissionsCount >= 5) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please wait a few minutes before submitting another enquiry.',
        },
        { status: 429 }
      );
    }

    // 3. Generate Unique Reference Number
    const referenceNo = `YOSU-MSG-${Date.now().toString(36).toUpperCase()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    // 4. Save to Database
    const contactMessage = await db.contactMessage.create({
      data: {
        referenceNo,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        institution: (institution || 'Federal University Dutse').trim(),
        state: (state || 'General').trim(),
        subject: subject.trim(),
        category: (category || 'GENERAL').toUpperCase(),
        message: message.trim(),
        status: 'UNREAD',
        ipAddress: ip,
      },
    });

    // 5. Clean Decoupled Email Notification Architecture
    // Trigger async email dispatch if environment variables are configured
    if (process.env.RESEND_API_KEY || process.env.SMTP_HOST) {
      try {
        console.log(`[Email Service] Dispatching notification for ${referenceNo} to admin secretariat.`);
        // Placeholder for nodemailer or Resend SDK call using process.env
      } catch (err) {
        console.error('[Email Service Error]', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Your official enquiry has been submitted successfully!',
      referenceNo: contactMessage.referenceNo,
      estimatedResponse: '24 to 48 business hours',
    });
  } catch (error: any) {
    console.error('Contact Submission Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An error occurred while submitting your enquiry.' },
      { status: 500 }
    );
  }
}
