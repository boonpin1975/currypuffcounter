import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, signToken, TOKEN_NAME } from '@/lib/auth';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password & create user
    const password_hash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password_hash,
      },
      select: {
        id: true,
        email: true,
        created_at: true,
      },
    });

    // Create default sample vendor so user has immediate vendor options
    await prisma.vendor.create({
      data: {
        name: "Main Cafe Vendor",
        user_id: user.id
      }
    });

    // Sign token & set cookie
    const token = signToken(user);
    const response = NextResponse.json({
      message: 'Account created successfully',
      user,
    });

    response.cookies.set({
      name: TOKEN_NAME,
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during registration' },
      { status: 500 }
    );
  }
}
