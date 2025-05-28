import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import useGetAllPosts from '../hooks/getAllPosts'
import useGetSuggestedUsers from '../hooks/useGetSuggestedUsers'

const Home = () => {
  useGetAllPosts();
  useGetSuggestedUsers();
  return (
    <div className='flex w-100%'>
      <div className='flex-grow '>
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  )
}

export default Home
