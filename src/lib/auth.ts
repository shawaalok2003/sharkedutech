import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user) return null;

                // Handle OTP login (passwordless)
                if (credentials.password === "" && user.password === "") {
                    return { 
                        id: user.id, 
                        email: user.email, 
                        name: user.name, 
                        role: user.role,
                        adminPermissions: user.adminPermissions 
                    };
                }

                if (!credentials.password) return null;

                const isValid = await bcrypt.compare(credentials.password, user.password);

                if (!isValid) return null;

                return { 
                    id: user.id, 
                    email: user.email, 
                    name: user.name, 
                    role: user.role,
                    adminPermissions: user.adminPermissions 
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.role = user.role;
                token.adminPermissions = user.adminPermissions;
            } else if (token?.sub && (token.role === 'ADMIN' || token.role === 'SUPER_ADMIN') && token.adminPermissions === undefined) {
                // Auto-fetch adminPermissions for pre-existing JWT sessions
                try {
                    const dbUser = await prisma.user.findUnique({
                        where: { id: token.sub },
                        select: { adminPermissions: true, role: true }
                    });
                    if (dbUser) {
                        token.role = dbUser.role;
                        token.adminPermissions = dbUser.adminPermissions;
                    }
                } catch (e) {
                    console.error("JWT adminPermissions fetch error:", e);
                }
            }
            return token;
        },
        async session({ session, token }: any) {
            if (session?.user) {
                session.user.role = token.role;
                session.user.adminPermissions = token.adminPermissions;
                session.user.id = token.sub;
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/signin',
    },
    session: {
        strategy: "jwt" as const,
    },
    secret: process.env.NEXTAUTH_SECRET,
};
