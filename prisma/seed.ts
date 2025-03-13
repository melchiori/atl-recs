import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create initial categories
  const categories = [
    'Restaurants',
    'Bars',
    'Coffee Shops',
    'Parks',
    'Museums',
    'Shopping',
    'Entertainment'
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category },
      update: {},
      create: { name: category },
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 