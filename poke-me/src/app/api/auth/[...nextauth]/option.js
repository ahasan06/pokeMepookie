import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/dbConnect';
import User from '@/model/User';

export const authOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {
                identifier: { label: "Email or Username", type: "text" }, // Renamed field
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                try {
                    console.log("Authorize function called");
                    console.log("Credentials received:", credentials);
                    
                    await dbConnect();

                    // Use `identifier` to search both `email` and `username`
                    const user = await User.findOne({
                        $or: [
                            { email: credentials.identifier }, // Check email
                            { username: credentials.identifier } // Check username
                        ]
                    });

                    console.log("User found:", user);

                    if (!user) {
                        console.error("No user found with this email or username");
                        throw new Error("No user found with this email or username");
                    }
                    if (!user.isVerified) {
                        console.error("User not verified:", user);
                        throw new Error("Please verify your account before login");
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    console.log("Password match:", isPasswordCorrect);

                    if (isPasswordCorrect) {
                        return user;
                    } else {
                        console.error("Incorrect password");
                        throw new Error("Incorrect password");
                    }
                } catch (error) {
                    console.error("Error in authorize function:", error);
                    throw new Error(error.message);
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            console.log("Session callback called");
            console.log("Token received:", token);

            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }

            console.log("Session object:", session);
            return session;
        },
        async jwt({ token, user }) {
            console.log("JWT callback called");
            console.log("User received:", user);
            console.log("Token before modification:", token);

            if (user) {
                token._id = user._id.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }

            console.log("Token after modification:", token);
            return token;
        }
    },
    pages: {
        signIn: '/signin',
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key",
};
