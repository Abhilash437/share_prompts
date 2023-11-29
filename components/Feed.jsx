"use client";
import React from 'react'
import { useState, useEffect } from 'react'
import PromptCard from './PromptCard';

const PromptCardList = ({data, handleTagClick})=>{
  return (
    <div className='mt-16 prompt_layout'>
      {data?.map((post)=>(
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  )
}

const Feed = () => {

  const [searchText, setSearchText] = useState("");
  const [searchTimeOut, setSearchTimeOut] = useState(null);
  const [searchedResult, setSearchedResult] = useState([]);


  const [posts, setPosts] = useState([]);

  const filterPrompts = (searchText) => {
    const regx = new RegExp(searchText, 'i');
    return posts.filter((item)=>
      regx.test(item.creator.username)||
      regx.test(item.tag)||
      regx.test(item.prompt)
    )
  }

  const handleSearchChange = (e)=>{
    clearTimeout(searchTimeOut);
    setSearchText(e.target.value);

    setSearchTimeOut(()=>{
      setTimeout(()=>{
        const searchResult = filterPrompts(e.target.value);
        setSearchedResult(searchResult);
      },500)   
    })
  }

  useEffect(()=>{
    const fetchPosts = async () => {
      const response =  await fetch('/api/prompt')
      const data = await response.json();
      setPosts(data)
    }
    fetchPosts();
  });

  const handleTagClick = (tagName)=>{
    setSearchText(tagName);
    const searchResult = filterPrompts(tagName);
    setSearchedResult(searchResult);
  }

  return (
    <section 
      className='feed'
    >
      <form className='relative w-full flex-center'>
        <input
          type='text'
          placeholder='Search for a tag or username'
          value={searchText}
          onChange={handleSearchChange}
          required
          className='search_input peer'
        ></input>
      </form>
      {searchText ? (
        <PromptCardList 
          data={searchedResult}
          handleTagClick={handleTagClick}
        />
      ):(
        <PromptCardList
          data={posts}
          handleTagClick={handleTagClick}
        />
      )}
      
    </section>
  )
}

export default Feed