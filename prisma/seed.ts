const { PrismaClient } = require('@prisma/client');
const acronyms = require('./acronyms.json');

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: 'email@example.com',
      password: '$2a$10$r3eeaXEhhegkSKyIPd7DSOEaFRLPDojuTaQ5o6Z8AQbciqnT89Qji', // value: example
    },
  });

  await prisma.acronym.createMany({
    data: acronyms.map((item: { [key: string]: string }, index: number) => {
      const key = Object.keys(item)[0];
      return { id: index + 1, acronym: key, word: item[key] };
    })
  });
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })