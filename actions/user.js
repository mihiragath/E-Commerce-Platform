"use server";

import { prisma } from "@/prisma/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret";

export async function createUser({ email, name, password }) {
  if (!email || !password) throw new Error("Email and password are required");

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: { email, name, password: hashedPassword, role: "USER" },
  });

  const token = jwt.sign(
    { userId: newUser.id, role: newUser.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    message: "User created successfully",
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
  };
}

export async function authenticateUser({ email, password }) {
  if (!email || !password) throw new Error("Email and password are required");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid email or password");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid email or password");

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "1h",
  });

  return {
    message: "Authentication successful",
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}

export async function getCurrentUser(token) {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    if (!user) return null;

    return { id: user.id, name: user.name, email: user.email, role: user.role };
  } catch (err) {
    return null;
  }
}

export async function getUserFromToken(token) {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true },
    });
    return user || null;
  } catch (err) {
    console.error(err);
    return null;
  }
}