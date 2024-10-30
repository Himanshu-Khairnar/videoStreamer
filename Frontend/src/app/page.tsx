import HomePageVideos from '@/Components/HomePageVideos'
import Navbar from '@/Components/Navbar'
import SideBar from '@/Components/HomePageSideBar'
import React from 'react'

const Home = () => {
  return (
    <div className='p-[1rem]'>
      <Navbar />
      <div className='flex h-full'>
        <SideBar   />
        <HomePageVideos />
      </div>
    </div>
  )
}

export default Home
