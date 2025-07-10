export declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
      personifikasi?: string | null; // ⬅️ Properti yang hilang
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
    personifikasi?: string | null;
  }

  interface JWT {
    id?: string | null;
    email?: string | null;
    name?: string | null;
    role?: string | null;
    image?: string | null;
    personifikasi?: string | null;
  }
}
