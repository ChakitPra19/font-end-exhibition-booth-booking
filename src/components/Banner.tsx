'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './banner.module.css'
import Image from 'next/image';
import { useSession } from 'next-auth/react'

export default function Banner () {
    const covers = [
        '/img/cover.jpg',
        '/img/cover2.jpg',
        '/img/cover3.jpg',
        '/img/cover4.jpg'
    ];
    const [index, setIndex] = useState(0);
    const router = useRouter();

    // const { data: session } = useSession()

    return(
       <div className="block p-1 m-0 w-screen h-[80vh] relative max-h-[500px]" onClick={ ()=>{ setIndex(index+1) } }>
            <Image src={covers[index%4]}
            alt='cover'
            fill= {true}
            priority
            objectFit='cover'
            />
            <div className="relative top-[100px] z-20 text-center">
                <h1>where every event finds its venue</h1>
                <h3>Explore Your World with Us</h3>
            </div>
            {/* {
                session? <div className="z-30 absolute top-5 right-10 font-semibold text-cyan-800 text-xl">Welcome {session.user?.name}</div>
                : null
            } */}
            <button
                className="absolute bottom-6 right-6 z-30 bg-blue-700 text-white px-4 py-2 rounded shadow hover:bg-blue-900"
                onClick={e => {
                    e.stopPropagation();
                    router.push('/venue');
                }}
            >
                Select Venue
            </button>
       </div>
    );
}