"use client"
import React from 'react';
import Navbar from '../components/Navbar';
import Link from 'next/link';

const VoteCompleted = () => {
    return(
        <div>
            <Navbar />
            <div className='absolute top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 text-center'>
                <h1 className='text-[#3B8501] text-3xl font-bold'>THANK YOU</h1>
                <p className='mt-4'>You have successfully casted your votes and <br /> your nominee(s) thank you for your support</p>
                <p className='mt-12'>Wanna vote again</p>
                <Link href="/">
                    <button className='bg-[#3B8501] text-white h-10 w-40 p-2 mt-4 rounded-lg'> Yes, I want to</button>
                </Link>
            </div>
        </div>
    )
}

export default VoteCompleted;