import 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user?: {
      email?: string | null;
      name?: string | null;
      image?: string | null;
      is_sadhaka?: boolean;
    };
  }
}

export interface ExtendedSession extends Session {
  accessToken: string;
} 