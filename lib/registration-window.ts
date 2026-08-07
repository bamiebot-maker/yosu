import { db } from '@/lib/db';

export interface RegistrationWindowStatus {
  isOpen: boolean;
  registrationOpen: boolean;
  opensAt: string | null;
  closesAt: string | null;
  notice: string | null;
  closedMessage: string | null;
  academicSession: string;
}

export async function getRegistrationWindowStatus(): Promise<RegistrationWindowStatus> {
  try {
    const settings = await db.registrationSettings.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    if (!settings) {
      return {
        isOpen: true,
        registrationOpen: true,
        opensAt: null,
        closesAt: null,
        notice:
          'Registration for the 2026/2027 Academic Session is currently open. Eligible students are advised to complete their registration before the deadline.',
        closedMessage:
          'Registration has closed. Follow our official communication channels for future registration exercises.',
        academicSession: '2026/2027',
      };
    }

    const now = new Date();
    let isClosedByDate = false;

    if (settings.closesAt) {
      const closeDate = new Date(settings.closesAt);
      closeDate.setHours(23, 59, 59, 999);
      if (now > closeDate) {
        isClosedByDate = true;
      }
    }

    if (settings.opensAt) {
      const openDate = new Date(settings.opensAt);
      openDate.setHours(0, 0, 0, 0);
      if (now < openDate) {
        isClosedByDate = true;
      }
    }

    const isOpen = settings.registrationOpen && !isClosedByDate;

    return {
      isOpen,
      registrationOpen: settings.registrationOpen,
      opensAt: settings.opensAt ? settings.opensAt.toISOString().split('T')[0] : null,
      closesAt: settings.closesAt ? settings.closesAt.toISOString().split('T')[0] : null,
      notice:
        settings.notice ||
        'Registration for the 2026/2027 Academic Session is currently open. Eligible students are advised to complete their registration before the deadline.',
      closedMessage:
        settings.closedMessage ||
        'Registration has closed. Follow our official communication channels for future registration exercises.',
      academicSession: settings.academicSession || '2026/2027',
    };
  } catch (error) {
    console.error('Error fetching registration window status:', error);
    return {
      isOpen: true,
      registrationOpen: true,
      opensAt: null,
      closesAt: null,
      notice: 'Registration is open.',
      closedMessage: 'Registration is closed.',
      academicSession: '2026/2027',
    };
  }
}
