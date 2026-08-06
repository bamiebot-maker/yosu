import { PrismaClient } from '@prisma/client';
import { hashPassword, verifyPassword } from '../lib/password';

const prisma = new PrismaClient();

async function main() {
  const testEmail = `testadmin_${Date.now()}@yosufud.org`.toLowerCase().trim();
  const testPassword = 'TestAdminPass2026!';
  const roleCode = 'SECRETARY_GENERAL';

  console.log(`[VERIFY CREATION] Creating new administrator: ${testEmail}`);

  // 1. Create Person
  const person = await prisma.person.create({
    data: {
      fullName: 'Test Executive Secretariat',
      email: testEmail,
      stateOfOrigin: 'Oyo',
    },
  });

  // 2. Hash Password using lib/password
  const passwordHash = await hashPassword(testPassword);

  // 3. Create Role if missing
  let role = await prisma.role.findFirst({ where: { code: roleCode as any } });
  if (!role) {
    role = await prisma.role.create({
      data: {
        code: roleCode as any,
        name: 'Secretary General',
        description: 'Secretariat administrator',
      },
    });
  }

  // 4. Create User
  const user = await prisma.user.create({
    data: {
      email: testEmail,
      passwordHash,
      personId: person.id,
      isActive: true,
    },
  });

  // 5. Assign Role
  await prisma.userRole.create({
    data: {
      userId: user.id,
      roleId: role.id,
    },
  });

  // 6. Fetch created user with relations to audit every field
  const createdUser = await prisma.user.findUnique({
    where: { email: testEmail },
    include: {
      person: true,
      userRoles: { include: { role: true } },
    },
  });

  if (!createdUser) throw new Error('Failed to retrieve newly created user.');

  const isValidBcryptFormat = createdUser.passwordHash.startsWith('$2a$') || createdUser.passwordHash.startsWith('$2b$');
  const loginSuccess = await verifyPassword(testPassword, createdUser.passwordHash);
  const assignedRoles = createdUser.userRoles.map((ur) => ur.role.code).join(', ');

  console.log('\n--- VERIFICATION AUDIT OUTPUT ---');
  console.log(`Email: ${createdUser.email}`);
  console.log(`Password hash exists: ${Boolean(createdUser.passwordHash)}`);
  console.log(`Password hash starts with $2: ${isValidBcryptFormat}`);
  console.log(`isActive: ${createdUser.isActive}`);
  console.log(`Person exists: ${Boolean(createdUser.person)}`);
  console.log(`Roles assigned: ${assignedRoles}`);
  console.log(`Login test passed: ${loginSuccess && createdUser.isActive}`);
  console.log('---------------------------------\n');
}

main()
  .catch((err) => {
    console.error('Verification failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
