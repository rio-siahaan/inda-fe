export declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      personifikasi?: string | null; // ⬅️ Properti yang hilang
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    personifikasi?: string | null;
  }

  interface JWT {
    id?: string;
    email?: string;
    name?: string;
    role?: string;
    image?: string;
    personifikasi?: string | null;
  }
}
