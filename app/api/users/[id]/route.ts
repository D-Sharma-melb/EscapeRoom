/**
 * User Management API Routes (By ID)
 * Path: /api/users/[id]
 */

import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import logger from "@/lib/logger";

/**
 * @param id - User ID from URL params
 * @returns User object (excluding password)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    logger.info("Fetching user by ID", { userId: id });

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password
      },
    });

    if (!user) {
      logger.warn("User not found", { userId: id });
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    logger.info("User fetched successfully", { userId: id });
    return NextResponse.json(user);
  } catch (error) {
    logger.error("Error fetching user", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/users/[id]
 * Updates user information
 * @param id - User ID from URL params
 * @body {username?: string, password?: string, role?: 'BUILDER' | 'PLAYER'}
 * @returns Updated user object
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    logger.info("Updating user", { userId: id });

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      logger.warn("User not found for update", { userId: id });
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Build update data object
    const updateData: any = {};

    if (body.username !== undefined) {
      if (typeof body.username !== 'string' || body.username.trim().length === 0) {
        logger.warn("Invalid username in update", { userId: id });
        return NextResponse.json(
          { error: "Valid username is required" },
          { status: 400 }
        );
      }

      // Check if new username already exists (for another user)
      const usernameExists = await prisma.user.findFirst({
        where: {
          username: body.username.trim(),
          NOT: { id },
        },
      });

      if (usernameExists) {
        logger.warn("Username already exists", { userId: id, username: body.username });
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 409 }
        );
      }

      updateData.username = body.username.trim();
    }

    if (body.password !== undefined) {
      if (typeof body.password !== 'string' || body.password.length < 3) {
        logger.warn("Invalid password in update", { userId: id });
        return NextResponse.json(
          { error: "Password must be at least 3 characters long" },
          { status: 400 }
        );
      }
      updateData.password = body.password;
    }

    if (body.role !== undefined) {
      if (!["BUILDER", "PLAYER"].includes(body.role)) {
        logger.warn("Invalid role in update", { userId: id, role: body.role });
        return NextResponse.json(
          { error: "Role must be either BUILDER or PLAYER" },
          { status: 400 }
        );
      }
      updateData.role = body.role;
    }

    // Perform update
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    logger.info("User updated successfully", {
      userId: id,
      updatedFields: Object.keys(updateData),
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    logger.error("Error updating user", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users/[id]
 * Deletes a user by ID
 * @param id - User ID from URL params
 * @returns Success message
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    logger.info("Deleting user", { userId: id });

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      logger.warn("User not found for deletion", { userId: id });
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Delete user
    await prisma.user.delete({
      where: { id },
    });

    logger.info("User deleted successfully", {
      userId: id,
      username: existingUser.username,
    });

    return NextResponse.json({
      message: "User deleted successfully",
      deletedUser: {
        id: existingUser.id,
        username: existingUser.username,
      },
    });
  } catch (error) {
    logger.error("Error deleting user", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
