import { PrismaClient, RoleCode } from '@prisma/client';
import { hashPassword } from '../lib/password';

const prisma = new PrismaClient();

async function main() {
  const email = 'bamiebot@gmail.com'.toLowerCase().trim();
  const rawPassword = 'Akidah22#';
  const roleCode: RoleCode = 'SUPER_ADMIN';

  const dbUrl = process.env.DATABASE_URL || 'NOT_SET';
  const dbHost = dbUrl.includes('@') ? dbUrl.split('@')[1].split('/')[0] : 'Local/SQLite';

  console.log('===========================================================');
  console.log(`[RECOVERY] YOSU Platform Super Admin Account Recovery`);
  console.log(`[DATABASE] Target Database Host: ${dbHost}`);
  console.log(`[TARGET EMAIL]: ${email}`);
  console.log('===========================================================');

  // Hash password using unified hashPassword helper
  const passwordHash = await hashPassword(rawPassword);

  // 1. Ensure SUPER_ADMIN Role exists
  let superAdminRole = await prisma.role.findUnique({
    where: { code: roleCode },
  });

  if (!superAdminRole) {
    console.log(`[RECOVERY] Creating missing SUPER_ADMIN role...`);
    superAdminRole = await prisma.role.create({
      data: {
        code: roleCode,
        name: 'Super Administrator',
        description: 'Full institutional administrative permissions across all CMS modules',
        isSystem: true,
      },
    });
  }

  // 2. Ensure Person record exists
  let person = await prisma.person.findFirst({
    where: { email },
  });

  if (!person) {
    console.log(`[RECOVERY] Creating Person record for ${email}...`);
    person = await prisma.person.create({
      data: {
        fullName: 'Super Admin Secretariat',
        email,
        stateOfOrigin: 'Oyo',
      },
    });
  }

  // 3. Upsert User account
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      isActive: true,
      personId: person.id,
      deletedAt: null,
    },
    create: {
      email,
      passwordHash,
      isActive: true,
      personId: person.id,
    },
  });

  console.log(`[RECOVERY] User record verified (ID: ${user.id}, Status: ACTIVE).`);

  // 4. Ensure SUPER_ADMIN UserRole binding exists
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: user.id,
        roleId: superAdminRole.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      roleId: superAdminRole.id,
    },
  });

  console.log(`[RECOVERY] SUPER_ADMIN role assignment verified.`);
  console.log('-----------------------------------------------------------');
  console.log(`[SUCCESS] Account ${email} is now ACTIVE with SUPER_ADMIN role.`);
  console.log(`[CREDENTIALS] Email: ${email} | Password: ${rawPassword}`);
  console.log('===========================================================');
}

main()
  .catch((e) => {
    console.error('[ERROR] Super Admin Recovery failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
