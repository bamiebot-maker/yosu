import { PrismaClient, RoleCode } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'bamiebot@gmail.com'.toLowerCase().trim();
  const rawPassword = 'Akidah22#';
  const roleCode: RoleCode = 'SUPER_ADMIN';

  console.log(`[RECOVERY] Initiating Super Admin account recovery for: ${email}`);

  // Generate bcrypt hash
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(rawPassword, salt);

  // Ensure SUPER_ADMIN role exists in database
  let superAdminRole = await prisma.role.findUnique({
    where: { code: roleCode },
  });

  if (!superAdminRole) {
    console.log(`[RECOVERY] Creating missing SUPER_ADMIN role entry...`);
    superAdminRole = await prisma.role.create({
      data: {
        code: roleCode,
        name: 'Super Administrator',
        description: 'Full institutional administrative permissions across all CMS modules',
        isSystem: true,
      },
    });
  }

  // Check if target user exists (case-insensitive check)
  const existingUser = await prisma.user.findFirst({
    where: {
      email: {
        equals: email,
      },
    },
    include: {
      userRoles: true,
      person: true,
    },
  });

  if (existingUser) {
    console.log(`[RECOVERY] User ${email} found (ID: ${existingUser.id}). Updating credentials...`);

    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        email, // Standardize lowercase email
        passwordHash,
        isActive: true,
      },
    });

    // Ensure user has SUPER_ADMIN role
    const hasRole = existingUser.userRoles.some((ur) => ur.roleId === superAdminRole.id);
    if (!hasRole) {
      console.log(`[RECOVERY] Assigning SUPER_ADMIN role to user...`);
      await prisma.userRole.create({
        data: {
          userId: existingUser.id,
          roleId: superAdminRole.id,
        },
      });
    }

    console.log(`[SUCCESS] Super Admin account (${email}) password and permissions recovered successfully!`);
  } else {
    console.log(`[RECOVERY] User ${email} not found. Creating new Super Admin account...`);

    // Create associated Person record if missing
    let person = await prisma.person.findFirst({ where: { email } });
    if (!person) {
      person = await prisma.person.create({
        data: {
          fullName: 'Super Admin Secretariat',
          email,
          stateOfOrigin: 'Oyo',
        },
      });
    }

    // Create User record
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        isActive: true,
        personId: person.id,
      },
    });

    // Assign SUPER_ADMIN role
    await prisma.userRole.create({
      data: {
        userId: newUser.id,
        roleId: superAdminRole.id,
      },
    });

    console.log(`[SUCCESS] Super Admin account (${email}) created and provisioned successfully!`);
  }
}

main()
  .catch((e) => {
    console.error('[ERROR] Recovery failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
