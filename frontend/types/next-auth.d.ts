import 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user?: {
      id?: string |null;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }
}

export interface ExtendedSession extends Session {
  accessToken: string;
} 