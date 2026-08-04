import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testAuth() {
  const email = 'bamiebot@gmail.com';
  const inputPassword = 'Akidah22#';

  console.log(`[AUTH VERIFY] Testing authentication for: ${email}`);

  const user = await prisma.user.findFirst({
    where: { email: { equals: email } },
    include: {
      userRoles: { include: { role: true } },
    },
  });

  if (!user) {
    console.error('❌ User not found!');
    process.exit(1);
  }

  console.log(`✓ User found ID: ${user.id}`);
  console.log(`✓ Account Active: ${user.isActive}`);

  const roles = user.userRoles.map((ur) => ur.role.code);
  console.log(`✓ Roles assigned: ${roles.join(', ')}`);

  const isValidPassword = await bcrypt.compare(inputPassword, user.passwordHash);
  console.log(`✓ Password Match Result: ${isValidPassword}`);

  if (user.isActive && isValidPassword && roles.includes('SUPER_ADMIN')) {
    console.log('\n🎉 SUCCESS: Super Admin authentication fully verified and operational!');
  } else {
    console.error('\n❌ FAILURE: Authentication criteria not met.');
  }
}

testAuth()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
