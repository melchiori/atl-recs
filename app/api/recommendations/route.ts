import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, address, categoryId, website, imageUrl } = body

    const recommendation = await prisma.recommendation.create({
      data: {
        title,
        description,
        address,
        categoryId,
        website: website || null,
        imageUrl: imageUrl || null,
      },
    })

    return NextResponse.json(recommendation)
  } catch (error) {
    console.error('Error creating recommendation:', error)
    return NextResponse.json(
      { error: 'Failed to create recommendation' },
      { status: 500 }
    )
  }
} 