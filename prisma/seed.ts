import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { BCRYPT_ROUNDS } from '../src/lib/constants';

// For seed script, we can create a new instance since it's a standalone script
const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env file. ' +
      'See .env.example for reference.'
    );
  }
  
  console.log('Creating admin user...');
  
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash, // Update password hash if user exists
    },
    create: {
      email,
      passwordHash,
    },
  });
  
  console.log('✅ Admin user created/updated!');
  console.log(`   Email: ${email}`);
  console.log('   ⚠️  Keep your credentials secure and never commit them to version control!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

