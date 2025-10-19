/**
 * User Authentication API Route
 * Path: /api/users/login
 */

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import logger from "@/lib/logger";

/**
 * POST /api/users/login
 * Authenticates a user with username and password
 * @body {username: string, password: string}
 * @returns User object on success, error on failure
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    logger.info("Login attempt", { username });

    // Input validation
    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      logger.warn("Login failed: invalid username", { username });
      return NextResponse.json(
        { error: "Valid username is required" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string') {
      logger.warn("Login failed: invalid password", { username });
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username: username.trim() },
    });

    // Verify credentials
    if (!user || user.password !== password) {
      logger.warn("Login failed: invalid credentials", { username });
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    logger.info("Login successful", {
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    return NextResponse.json(user);
  } catch (error) {
    logger.error("Login error", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
