import withAuth from "./app/middlewares/withAuth";
import { NextRequest, NextResponse } from "next/server";

const authRoutes = ["/dashboard", "/editfail", "/inda"];

export function mainMiddleware(req: NextRequest) {
  const res = NextResponse.next();
  return res;
}

export default withAuth(mainMiddleware, authRoutes);
