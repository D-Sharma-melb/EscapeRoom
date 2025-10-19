/**
 * User Management API Routes
 * Base path: /api/users
 */

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import logger from "@/lib/logger";

/**
 * GET /api/users
 * Retrieves all users (excluding passwords for security)
 */
export async function GET(req: NextRequest) {
  try {
    logger.info("Fetching all users");

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    logger.info(`Successfully fetched ${users.length} users`);
    return NextResponse.json(users);
  } catch (error) {
    logger.error("Error fetching users", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users
 * Creates a new user account (signup)
 * @body {username: string, password: string, role: 'BUILDER' | 'PLAYER'}
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, role } = body;

    logger.info("User signup attempt", { username, role });

    // Input validation
    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      logger.warn("Signup failed: invalid username", { username });
      return NextResponse.json(
        { error: "Valid username is required" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 3) {
      logger.warn("Signup failed: password too short", { username });
      return NextResponse.json(
        { error: "Password must be at least 3 characters long" },
        { status: 400 }
      );
    }

    if (!role || !["BUILDER", "PLAYER"].includes(role)) {
      logger.warn("Signup failed: invalid role", { username, role });
      return NextResponse.json(
        { error: "Role must be either BUILDER or PLAYER" },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username: username.trim() },
    });

    if (existingUser) {
      logger.warn("Signup failed: username already exists", { username });
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        username: username.trim(),
        password,
        role,
      },
    });

    logger.info("User created successfully", {
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    logger.error("User signup error", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
