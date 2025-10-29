import Image from 'next/image'
import TopMenuItem from './TopMenuItem'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
// import { Link } from '@mui/material'
import Link from 'next/link'

export default async function TopMenu() {

    const session = await getServerSession(authOptions)
    return (
        <div className="w-full flex items-center justify-end gap-6 px-8 py-5 bg-gradient-to-r from-white to-gray-50 shadow-lg border-b border-gray-100">
            <TopMenuItem title='Booking' pageRef='/booking'/>
            <TopMenuItem title='My Booking' pageRef='/mybooking'/>
            <div className="relative">
                <Image 
                    src="/img/logo.png" 
                    alt="logo" 
                    width={80} 
                    height={80} 
                    className="h-full w-auto object-contain drop-shadow-sm hover:scale-105 transition-transform duration-200"
                />
            </div>
            {
                session? <Link href="/api/auth/signout">
                    <div className="flex items-center absolute left-10 px-2 text-cyan-600 text-sm">
                    Sign-Out of {session.user?.name} </div></Link>
                : <Link href="/api/auth/signin"><div className="flex items-center absolute left-10 px-2 text-cyan-600 text-sm">
                    Sign-In</div>
                    </Link>
            }
        </div>
    )
}