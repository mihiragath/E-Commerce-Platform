"use server";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret";

async function getPrisma() {
  const mod = await import("@/prisma/prisma");
  return mod.prisma;
}

export async function createUser({ email, name, password }) {
  if (!email || !password) throw new Error("Email and password are required");

  const prisma = await getPrisma();
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

  const prisma = await getPrisma();
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
    const prisma = await getPrisma();
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
    const prisma = await getPrisma();
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

export async function getAllUsers() {
  const prisma = await getPrisma();
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
  });
  if (!users) throw new Error("No users found");
  return users;
}

export async function updateUserRole(id, role) {
  const prisma = await getPrisma();
  const user = await prisma.user.findUnique({ where: { id: Number(id) } });
  if (!user) throw new Error("User not found");
  return await prisma.user.update({
    where: { id: Number(id) },
    data: { role },
  });
}

export async function deleteUser(id) {
  const prisma = await getPrisma();
  const user = await prisma.user.findUnique({ where: { id: Number(id) } });
  if (!user) throw new Error("User not found");
  return await prisma.user.delete({ where: { id: Number(id) } });
}
