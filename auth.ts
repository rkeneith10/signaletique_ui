import axios from 'axios';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { authConfig } from './auth.config';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ username: z.string(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { username, password } = parsedCredentials.data;
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/login/`,
            {
              username,
              password,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          const user = res.data;


          if (res.status == 200 && user.access) {
            const userInfoRes = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/`, {
              headers: {
                Authorization: `Bearer ${user.access}`,
                'Content-Type': 'application/json',
              },
            });
            const userInfo = userInfoRes.data;
            console.log(userInfo)
            const cookieStore = await cookies()
            cookieStore.set('accessToken', `${user.access}`, { httpOnly: false });
            cookieStore.set('refreshToken', `${user.refresh}`, { httpOnly: false });
            cookieStore.set('image', `${userInfo.profile || null}`, { httpOnly: false });
            cookieStore.set('name', `${userInfo.username || null}`, { httpOnly: false })
            return {
              accessToken: user.access,
              refreshToken: user.refresh,
              name: userInfo.username,
              image: userInfo.profile || null,
            };
          } else if (!user) { return null }
        }
        return null;
      },
    }),
  ],
});