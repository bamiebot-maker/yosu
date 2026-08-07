import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      gender,
      dateOfBirth,
      passportUrl,
      matricNumber,
      jambRegNumber,
      faculty,
      department,
      programme,
      level,
      phone,
      whatsapp,
      email,
      stateOfOrigin,
      lga,
      homeTown,
      residenceType,
      hallOfResidence,
      roomNumber,
      residentialAddress,
      areaCouncil,
      membershipCategory,
      emergencyContactName,
      emergencyContactRelationship,
      emergencyContactPhone,
    } = body;

    // 1. Required Fields Validation
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return NextResponse.json({ success: false, error: 'Full Name is required.' }, { status: 400 });
    }

    if (!matricNumber || typeof matricNumber !== 'string' || matricNumber.trim().length < 4) {
      return NextResponse.json({ success: false, error: 'Valid Matriculation Number is required.' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
      return NextResponse.json({ success: false, error: 'Please enter a valid telephone number.' }, { status: 400 });
    }

    if (!faculty || !department || !stateOfOrigin || !lga || !homeTown) {
      return NextResponse.json({ success: false, error: 'Academic and Origin details are required.' }, { status: 400 });
    }

    if (!emergencyContactName || !emergencyContactRelationship || !emergencyContactPhone) {
      return NextResponse.json({ success: false, error: 'Emergency contact information is required.' }, { status: 400 });
    }

    const cleanMatric = matricNumber.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    // 2. Duplicate Detection
    const existingMatric = await db.studentRegistration.findUnique({
      where: { matricNumber: cleanMatric },
    });
    if (existingMatric) {
      return NextResponse.json(
        { success: false, error: `A student record with Matriculation Number ${cleanMatric} already exists.` },
        { status: 409 }
      );
    }

    const existingEmail = await db.studentRegistration.findUnique({
      where: { email: cleanEmail },
    });
    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: `Email address ${cleanEmail} is already registered.` },
        { status: 409 }
      );
    }

    const existingPhone = await db.studentRegistration.findUnique({
      where: { phone: cleanPhone },
    });
    if (existingPhone) {
      return NextResponse.json(
        { success: false, error: `Phone number ${cleanPhone} is already registered.` },
        { status: 409 }
      );
    }

    // 3. Generate Sequential Registration Number (YOSU-2026-0000X)
    const count = await db.studentRegistration.count();
    const nextSeq = (count + 1).toString().padStart(5, '0');
    const currentYear = new Date().getFullYear();
    const regNumber = `YOSU-${currentYear}-${nextSeq}`;

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

    // 4. Save to Database
    const record = await db.studentRegistration.create({
      data: {
        regNumber,
        fullName: fullName.trim(),
        gender: gender || 'MALE',
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        passportUrl: passportUrl || null,
        matricNumber: cleanMatric,
        jambRegNumber: jambRegNumber ? jambRegNumber.trim().toUpperCase() : null,
        faculty: faculty.trim(),
        department: department.trim(),
        programme: (programme || 'B.Sc.').trim(),
        level: level || '100L',
        phone: cleanPhone,
        whatsapp: whatsapp ? whatsapp.trim() : cleanPhone,
        email: cleanEmail,
        stateOfOrigin: stateOfOrigin.trim(),
        lga: lga.trim(),
        homeTown: homeTown.trim(),
        residenceType: residenceType || 'On-Campus',
        hallOfResidence: hallOfResidence || null,
        roomNumber: roomNumber || null,
        residentialAddress: residentialAddress || null,
        areaCouncil: areaCouncil || 'Federal University Dutse Main Campus',
        membershipCategory: membershipCategory || 'Undergraduate',
        emergencyContactName: emergencyContactName.trim(),
        emergencyContactRelationship: emergencyContactRelationship.trim(),
        emergencyContactPhone: emergencyContactPhone.trim(),
        status: 'VERIFIED',
        ipAddress: ip,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Student Registration Completed Successfully!',
      data: {
        id: record.id,
        regNumber: record.regNumber,
        fullName: record.fullName,
        matricNumber: record.matricNumber,
        faculty: record.faculty,
        department: record.department,
        level: record.level,
        stateOfOrigin: record.stateOfOrigin,
        createdAt: record.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Student Registration Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An error occurred during registration.' },
      { status: 500 }
    );
  }
}
