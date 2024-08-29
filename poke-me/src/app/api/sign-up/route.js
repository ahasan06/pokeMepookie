import { dbConnect } from "@/lib/dbConnect";
import User from "@/model/User";
import bycrypt from 'bcryptjs'
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextResponse } from "next/server";
await dbConnect()
export async function POST(request) {
    try {
        const reqBody = await request.json()
        console.log("Post request for signup", reqBody);
        const { username, email, password } = reqBody

        const existingUserVerifiedByUsername = await User.findOne({
            username,
            isVerified: true
        })
        console.log("Existing user :", existingUserVerifiedByUsername);
        if (existingUserVerifiedByUsername) {
            return NextResponse.json(
                {
                    success: false, // u cant to register this mail.already has taken
                    message: "username is already taken!"
                }
            )
        }

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("verifyCode 6 digit: ", verifyCode);


        const existingUserByEmail = await User.findOne({ email })
        if (existingUserByEmail) {
            
            if (existingUserByEmail.isVerified) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "user already exist with this email.Try with another email"
    
                    }, { status: 400 }
                )
            }
            else{ // email exist but not verifed
            const salt = await bycrypt.genSalt(10)
            const hashPassword = await bycrypt.hash(password, salt)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)
            //suppose he know the email but forget the password
            existingUserByEmail.password = hashPassword
            existingUserByEmail.verifyCode = verifyCode
            existingUserByEmail.verifyCodeExpiry = expiryDate
            await existingUserByEmail.save()
            }
        }
        else {
            const salt = await bycrypt.genSalt(10)
            const hashPassword = await bycrypt.hash(password, salt)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new User({
                username,
                email,
                password: hashPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: []
            })
            const saveUser = await newUser.save()
            console.log("New user created", saveUser);
        }

        //send verfication email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )
        console.log("email response : ", emailResponse);

        if (!emailResponse.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: emailResponse.message,

                }, { status: 500 }
            )
        }
        return NextResponse.json(
            {
                success: true,
                message: "User registered successfully! please verify your email",

            }, { status: 200 }
        )



    } catch (error) {
        console.error("Error registring user", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error registring user"
            },
            {
                status: 500
            }
        )
    }
}