import { createSessionToken } from "@/app/lib/auth";
import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Email requerido" }, { status: 400 });
  }

  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql`
    SELECT e.id, e.name, e.email, r.is_admin
    FROM employee e
    JOIN roles r ON r.id = e.role_id
    WHERE e.email = ${email} AND e.active = true
  `;

  if (rows.length === 0) {
    return NextResponse.json(
      { error: "Error while logging in" },
      { status: 401 },
    );
  }

  const employee = rows[0];

  if (employee.is_admin) {
    if (!password) {
      return NextResponse.json(
        { error: "Error while logging in" },
        { status: 401 },
      );
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Error while logging in" },
        { status: 401 },
      );
    }
  }

  if (!employee.active) {
    return NextResponse.json(
      { error: "Error while logging in" },
      { status: 401 },
    );
  }

  const role: "admin" | "viewer" = employee.is_admin ? "admin" : "viewer";

  const token = await createSessionToken({
    userId: employee.id,
    email: employee.email,
    name: employee.name,
    role,
  });

  const res = NextResponse.json({ name: employee.name, role });
  res.cookies.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}
