import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Nom d\'utilisateur', type: 'text', placeholder: 'Votre nom d\'utilisateur' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: credentials.username,
            password: credentials.password,
          }),
        });

        const user = await res.json();
        //console.log(user); 

       
        if (res.ok && user.access) {
       
          const userInfoRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${user.access}`,  
              'Content-Type': 'application/json',
            },
          });

          const userInfo = await userInfoRes.json();
          //console.log(userInfo);  

          return {
            accessToken: user.access,
            refreshToken: user.refresh,
            name: userInfo.username,  
            image: userInfo.profile || null,    
          };
        } else {
          throw new Error(user.message || 'Échec de la connexion');
        }
      },
    }),
  ],
  pages: {
    signIn: '/page.tsx',  
  },
  callbacks: {
    async jwt({ token, user }) {
      
      if (user) {
        token.accessToken = user.accessToken;
        console.log(token.access)
        token.refreshToken = user.refreshToken;
        token.username = user.username;   
        token.profile = user.profile;     
      }
      return token;
    },
    async session({ session, token }) {
      
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.username = token.username;  
      session.profile = token.profile;    
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 900,
  },
  secret: process.env.NEXTAUTH_SECRET,  
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
