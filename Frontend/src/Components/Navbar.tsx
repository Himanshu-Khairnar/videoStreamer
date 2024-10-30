'use client'

import React, { useState } from 'react';
import { Button } from "./ui/button";
import Image from 'next/image';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { ListBulletIcon } from '@radix-ui/react-icons';

const Navbar = () => {
    const [toggle,settoggle]=useState(false)
    return (
        <div className='flex items-center justify-between p-4 border-b-2 border-white '>
            {/* Logo */}
            <Image
                src='/logo.svg'
                height={50}
                width={50}
                alt='logo'
                className='mr-4'
            />
            {/* Search Input and Button */}
            <div className='flex items-center w-[60rem] min-w-[5rem] gap-3'>
                <Input type='search' placeholder='Search...' className='flex-grow h-[2rem]  ml-1' />
                <Button variant='ghost' className='hidden md:block'>
                    <Search />
                </Button>
            </div>
            {/* Buttons Container */}
            <div className='flex items-center gap-4 min-w-[2rem]'>
                {/* Login Button */}
                <Button variant="ghost" className='hidden md:block text-base'>
                    Log in &rarr;
                </Button>
                {/* List Bullet Icon Button */}
                <Button variant='ghost' className='md:hidden ' onClick={() => settoggle( !toggle)}>
                    <ListBulletIcon className='h-6 w-6' />
                </Button>
                {toggle && (
                    <ul className='absolute top-[5rem] right-[2rem] bg-gray-800 text-white border border-gray-700 rounded-md shadow-lg z-50'>
                        <li className='px-4 py-2 hover:bg-gray-700 rounded-md cursor-pointer'>Liked Videos</li>
                        <li className='px-4 py-2 hover:bg-gray-700 rounded-md cursor-pointer'>My Content</li>
                        <li className='px-4 py-2 hover:bg-gray-700 rounded-md cursor-pointer'>Settings</li>
                    </ul>
                )}

            </div>
        </div>
    );
}

export default Navbar;
