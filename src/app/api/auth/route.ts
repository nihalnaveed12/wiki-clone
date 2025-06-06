import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Use `auth()` to get the user's ID in App Router
    const { userId } = await auth()
    console.log(request)
    // Protect the route by checking if the user is signed in
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Initialize the Backend SDK
    const client = await clerkClient()

    // Get the user's full `Backend User` object
    const user = await client.users.getUser(userId)

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Auth route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Use `auth()` to get the user's ID in App Router
    const { userId } = await auth()

    // Protect the route by checking if the user is signed in
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Handle POST request logic here
    const body = await request.json()

    // Initialize the Backend SDK
    const client = await clerkClient()

    // Get the user's full `Backend User` object
    const user = await client.users.getUser(userId)

    return NextResponse.json({ user, body })
  } catch (error) {
    console.error('Auth route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}