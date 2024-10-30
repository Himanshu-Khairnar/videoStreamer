import React from 'react'
import { Button } from './ui/button'
import { FolderClosed, Home, House, MessageCircleQuestion, Settings, ThumbsUp, User, Video } from 'lucide-react'


const siderbarContent = {
  House: ' Home',
  ThumbsUp: ' Liked Videos',
  Video: ' My Content',
  FolderClosed: ' Collections',
  User: ' Subscribers'
}
const siderbarControls = {
  MessageCircleQuestion: ' Supports',
  Settings: ' Settings',
}


const SideBar = () => {
  return (
    <div className='max-h-screen h-[82vh] flex flex-col md:transition-all transition-all justify-between items-center border-r-2 border-white md:w-[10rem] w-[3rem] ease-in	'>
      <div className='text-left '>

        {Object.entries(siderbarContent).map(([key, value]) => {
          return <Button key={key} variant="ghost" className='text-left w-[10rem] h-[3rem] md:flex md:justify-start md:items-center  gap-2'>
            {key === 'House' ? <Home /> : key === 'ThumbsUp' ? <ThumbsUp /> : key === 'Video' ? <Video /> : key === 'FolderClosed' ? <FolderClosed /> : <User />}

            <p className='md:block   hidden '> {value}</p>
          </Button >
        })}

      </div>
      <div>
        {
          Object.entries(siderbarControls).map(([key, value]) => {
            return <Button key={key} variant="ghost" className='text-left w-[10rem] h-[3rem] md:flex md:justify-start md:items-center  gap-2 '>
              {key === 'MessageCircleQuestion' ? <MessageCircleQuestion /> : <Settings />}
              <p className='md:block hidden  '> {value}</p>
            </Button >
          })
        }
      </div>
    </div>
  )
}

export default SideBar
