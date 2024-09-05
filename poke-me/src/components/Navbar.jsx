'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from './ui/button'

function Navbar() {
    const { data: session } = useSession()
    const user = session?.user
    console.log("User session in navbar:",user);
    
    return (
        <nav className="bg-gray-900 text-white px-6 py-4">
            <div className="flex justify-between items-center">
                {/* Logo/Brand */}
                <a href="/" className="text-2xl font-bold text-yellow-500">
                    Poke me Pookie
                </a>
                {/* Navigation Links or User Info */}
                <div className="flex items-center space-x-4">
                    {
                        session ? (
                            <>
                                <span className="text-gray-300">
                                    Welcome, {user?.username || user?.email}
                                </span>
                                <Button 
                                    onClick={() => signOut()} 
                                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Link href='/sign-in'>
                                <Button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">
                                    Login
                                </Button>
                            </Link>
                        )
                    }
                </div>
            </div>
        </nav>
    )
}

export default Navbar
