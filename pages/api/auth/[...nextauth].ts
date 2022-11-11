
import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { dbUsers } from "../../../database";


export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
        Credentials({
            name: 'Custom Login',
            credentials: {
                email: { label: 'Correo:', type: 'email', placeholder: 'correo@example.com' },
                password: { label: 'Contraseña:', type: 'password', placeholder: '***********' }
            },
            async authorize(credentials, req) {
                console.log(credentials)
                // return { name: 'jean', corre: 'hola', admin: 'client' };
                return await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password)
            }
        }),

        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        // ...add more providers here
    ],

    //Custom pages
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/register',
    },

    jwt: {
        //Antes se usaba para pordere generar el token con esa palabra secreta
        //secret: process.env.JWT_SECRET_SEED, 
        //ahora solo hay que definir en el .env NEXT_AUTH_SECRET y lo toma de ahi 
    },

    session: {
        maxAge: 2592000, //30 dias 
        strategy: 'jwt',
        updateAge: 86400, //se actualiza cada día el token
    },
    //Callbacks
    callbacks: {
        async jwt({ token, account, user }: any) {
            // console.log({ token, account, user })
            if (account) {
                token.accessToken = account.access_token;
                // console.log({ jwtAccountAccessToken: account.access_token })
                switch (account.type) {
                    case 'oauth':
                        //todo crear usuario o verificar si existe en la base de datos
                        token.user = await dbUsers.oAuthToDbUser(user?.email || '', user?.name || '');
                        break;

                    case 'credentials':
                        token.user = user;
                        break;
                }
            }
            // console.log({ jwt: token })
            return token;
        },

        async session({ session, token, user }: any) {
            // console.log({ session, token, user })
            session.accessToken = token.accessToken;
            session.user = token.user;
            // console.log({ session })
            return session;
        }
    }
}
export default NextAuth(authOptions)