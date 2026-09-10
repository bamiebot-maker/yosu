'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import crypto from 'crypto';

interface InitializePaymentParams {
  matricNumber: string;
  email: string;
}

export async function getDuesSettingsAction() {
  try {
    let settings = await db.registrationSettings.findFirst();
    if (!settings) {
      settings = await db.registrationSettings.create({
        data: {
          registrationOpen: true,
          academicSession: '2026/2027',
          duesAmount: 2000.0,
          duesPaymentEnabled: true,
        },
      });
    }
    return {
      success: true,
      duesAmount: settings.duesAmount || 2000.0,
      duesPaymentEnabled: settings.duesPaymentEnabled !== false,
      academicSession: settings.academicSession || '2026/2027',
    };
  } catch (error: any) {
    return {
      success: false,
      duesAmount: 2000.0,
      duesPaymentEnabled: true,
      academicSession: '2026/2027',
      error: error.message,
    };
  }
}

export async function updateDuesSettingsAction(formData: FormData) {
  try {
    const duesAmount = parseFloat((formData.get('duesAmount') as string) || '2000');
    const academicSession = (formData.get('academicSession') as string) || '2026/2027';
    const duesPaymentEnabled = formData.get('duesPaymentEnabled') === 'true';

    let settings = await db.registrationSettings.findFirst();

    if (settings) {
      await db.registrationSettings.update({
        where: { id: settings.id },
        data: {
          duesAmount,
          academicSession,
          duesPaymentEnabled,
        },
      });
    } else {
      await db.registrationSettings.create({
        data: {
          registrationOpen: true,
          duesAmount,
          academicSession,
          duesPaymentEnabled,
        },
      });
    }

    revalidatePath('/admin/payments');
    revalidatePath('/dues');
    revalidatePath('/admin/students');

    return { success: true, message: 'Yearly dues settings updated successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update dues settings' };
  }
}

export async function initializeDuesPaymentAction({ matricNumber, email }: InitializePaymentParams) {
  try {
    const cleanMatric = matricNumber.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();

    // 1. Verify student exists in registration database
    const student = await db.studentRegistration.findFirst({
      where: {
        OR: [
          { matricNumber: cleanMatric },
          { email: cleanEmail },
        ],
      },
    });

    if (!student) {
      return {
        success: false,
        error: 'Student record not found. Please register as a YOSU member first.',
      };
    }

    // 2. Fetch official fee strictly from database (Server-enforced price, zero client trust)
    const duesInfo = await getDuesSettingsAction();
    if (!duesInfo.duesPaymentEnabled) {
      return {
        success: false,
        error: 'Yearly dues payment collection is currently paused by the Executive Secretariat.',
      };
    }

    const amountInNaira = duesInfo.duesAmount;
    const academicSession = duesInfo.academicSession;

    // Check if student has already paid for this session
    const existingPaid = await db.paymentTransaction.findFirst({
      where: {
        matricNumber: student.matricNumber,
        academicSession,
        status: 'SUCCESS',
      },
    });

    if (existingPaid) {
      return {
        success: false,
        alreadyPaid: true,
        receiptNumber: existingPaid.receiptNumber,
        message: `Dues already paid for session ${academicSession}.`,
      };
    }

    // 3. Generate unique transaction reference
    const timestamp = Date.now();
    const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase();
    const reference = `YOSU-DUES-${academicSession.replace('/', '-')}-${randomHex}`;

    // 4. Create pending transaction in DB
    const transaction = await db.paymentTransaction.create({
      data: {
        reference,
        studentId: student.id,
        matricNumber: student.matricNumber,
        email: student.email,
        fullName: student.fullName,
        amount: amountInNaira,
        academicSession,
        status: 'PENDING',
      },
    });

    // 5. Paystack API Initialization
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    const paystackPublicKey = process.env.PAYSTACK_PUBLIC_KEY || 'pk_test_yosu_demo';

    if (paystackSecret && !paystackSecret.includes('demo')) {
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: student.email,
          amount: Math.round(amountInNaira * 100), // Paystack requires amount in Kobo
          reference: transaction.reference,
          currency: 'NGN',
          callback_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/portal/dues-receipt?ref=${transaction.reference}`,
          metadata: {
            studentId: student.id,
            matricNumber: student.matricNumber,
            academicSession,
            fullName: student.fullName,
          },
        }),
      });

      const data = await response.json();
      if (data.status) {
        return {
          success: true,
          reference: transaction.reference,
          authorizationUrl: data.data.authorization_url,
          accessCode: data.data.access_code,
          publicKey: paystackPublicKey,
          amount: amountInNaira,
          studentName: student.fullName,
          matricNumber: student.matricNumber,
        };
      }
    }

    // Fallback Sandbox Payment Initialization (when live key is not set yet)
    return {
      success: true,
      reference: transaction.reference,
      isSandbox: true,
      publicKey: paystackPublicKey,
      amount: amountInNaira,
      studentName: student.fullName,
      matricNumber: student.matricNumber,
    };
  } catch (error: any) {
    console.error('Error initializing dues payment:', error);
    return { success: false, error: error.message || 'Failed to initialize dues payment' };
  }
}

export async function verifyPaymentAction(reference: string) {
  try {
    const transaction = await db.paymentTransaction.findUnique({
      where: { reference },
      include: { student: true },
    });

    if (!transaction) {
      return { success: false, error: 'Transaction reference not found' };
    }

    if (transaction.status === 'SUCCESS') {
      return {
        success: true,
        verified: true,
        receiptNumber: transaction.receiptNumber,
        transaction,
      };
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;

    let isPaymentVerified = false;
    let paymentChannel = 'CARD';

    if (paystackSecret && !paystackSecret.includes('demo')) {
      // Direct Server-to-Server Verification Call
      const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
        },
      });

      const data = await res.json();
      if (data.status && data.data.status === 'success') {
        const expectedAmountKobo = Math.round(transaction.amount * 100);
        if (data.data.amount >= expectedAmountKobo) {
          isPaymentVerified = true;
          paymentChannel = (data.data.channel || 'CARD').toUpperCase();
        }
      }
    } else {
      // Sandbox mode verification
      isPaymentVerified = true;
      paymentChannel = 'SANDBOX_ONLINE_TRANSFER';
    }

    if (isPaymentVerified) {
      const receiptNumber = `YOSU-REC-${transaction.academicSession.replace('/', '-')}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
      
      const updated = await db.paymentTransaction.update({
        where: { id: transaction.id },
        data: {
          status: 'SUCCESS',
          paymentChannel,
          receiptNumber,
          paidAt: new Date(),
        },
      });

      // Update student status to VERIFIED if pending
      if (transaction.studentId) {
        await db.studentRegistration.update({
          where: { id: transaction.studentId },
          data: { status: 'VERIFIED' },
        });
      }

      revalidatePath('/admin/payments');
      revalidatePath('/admin/students');

      return {
        success: true,
        verified: true,
        receiptNumber,
        transaction: updated,
      };
    }

    return {
      success: false,
      error: 'Payment verification failed or payment has not been completed yet.',
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Payment verification failed' };
  }
}

export async function getStudentDuesStatusAction(matricNumber: string) {
  try {
    const cleanMatric = matricNumber.trim().toUpperCase();

    const duesInfo = await getDuesSettingsAction();
    const currentSession = duesInfo.academicSession;

    const payment = await db.paymentTransaction.findFirst({
      where: {
        matricNumber: cleanMatric,
        academicSession: currentSession,
        status: 'SUCCESS',
      },
    });

    return {
      success: true,
      hasPaid: !!payment,
      payment,
      duesAmount: duesInfo.duesAmount,
      academicSession: currentSession,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllPaymentTransactionsAction() {
  try {
    const transactions = await db.paymentTransaction.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return { success: true, transactions };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
