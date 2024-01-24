import bcrypt from "bcrypt";
import prisma from "@/utils/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    // Destructure data from the request body
    const body = await req.json();
    const { email, password } = body;
    console.log(body);
    // Check if any field is missing
    if (!email || !password) {
      throw new Error("Please fill in all the credentials");
    }

    // Check if a user with the given email already exists
    const existOrNot = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existOrNot) {
      throw new Error("A user with that email and or username already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });

    // Respond with the new user data
    return NextResponse.json({ message: "User registered" }, { status: 201 });
  } catch (error: any) {
    // Handle errors and respond with a JSON error message
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
