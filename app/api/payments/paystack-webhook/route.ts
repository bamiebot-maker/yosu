import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const paystackSignature = req.headers.get('x-paystack-signature');

    const secret = process.env.PAYSTACK_WEBHOOK_SECRET || process.env.PAYSTACK_SECRET_KEY;

    // HMAC SHA-512 Security Verification
    if (secret) {
      const hash = crypto
        .createHmac('sha512', secret)
        .update(rawBody)
        .digest('hex');

      if (hash !== paystackSignature) {
        console.warn('⚠️ Webhook Signature Verification Failed! Potential spoofed request.');
        return NextResponse.json({ error: 'Unauthorized signature' }, { status: 401 });
      }
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'charge.success') {
      const data = event.data;
      const reference = data.reference;
      const amountInKobo = data.amount;

      const transaction = await db.paymentTransaction.findUnique({
        where: { reference },
      });

      if (transaction && transaction.status !== 'SUCCESS') {
        const expectedKobo = Math.round(transaction.amount * 100);

        // Verify amount matches expected fee strictly
        if (amountInKobo >= expectedKobo) {
          const receiptNumber = `YOSU-REC-${transaction.academicSession.replace('/', '-')}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

          await db.paymentTransaction.update({
            where: { id: transaction.id },
            data: {
              status: 'SUCCESS',
              paystackReference: data.id ? String(data.id) : null,
              paymentChannel: (data.channel || 'CARD').toUpperCase(),
              paystackPayload: JSON.stringify(data),
              receiptNumber,
              paidAt: new Date(),
            },
          });

          // Mark student as verified
          if (transaction.studentId) {
            await db.studentRegistration.update({
              where: { id: transaction.studentId },
              data: { status: 'VERIFIED' },
            });
          }

          console.log(`✅ Paystack Webhook successfully processed payment for ref ${reference}`);
        }
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error: any) {
    console.error('Paystack webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 });
  }
}
