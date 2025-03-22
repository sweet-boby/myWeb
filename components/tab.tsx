"use client";

import Image from "next/image";
import { Tabs } from "./ui/tabs";
import { useState } from "react";

export function TabsDemo() {

  const [animes, setAnimes] = useState([
    {src:'/img/animes/1.jpg',color:' bg-green-500'},
    {src:'/img/animes/2.jpg',color:' bg-blue-500'},
    {src:'/img/animes/7.jpg',color:' bg-amber-500'},
    {src:'/img/animes/4.jpg',color:' bg-red-500'},
    {src:'/img/animes/5.jpg',color:' bg-yellow-500'},
    {src:'/img/animes/6.jpg',color:' bg-teal-500'},
  ]);

  const [books, setBooks] = useState([
    {src:'/img/books/1.jpg',color:' bg-green-500'},
    {src:'/img/books/2.jpg',color:' bg-blue-500'},
    {src:'/img/books/3.jpg',color:' bg-amber-500'},
    {src:'/img/books/4.jpg',color:' bg-red-500'},
    {src:'/img/books/5.jpg',color:' bg-yellow-500'},
    {src:'/img/books/6.jpg',color:' bg-teal-500'},
  ]);

  const [games, setGames] = useState([
    {src:'/img/games/1.jpg',color:' bg-green-500'},
    {src:'/img/games/2.jpg',color:' bg-blue-500'},
    {src:'/img/games/3.jpg',color:' bg-amber-500'},
    {src:'/img/games/6.jpg',color:' bg-red-500'},
    {src:'/img/games/5.png',color:' bg-yellow-500'},
    {src:'/img/games/7.jpg',color:' bg-teal-500'},
  ]);

  const tabs = [
    {
      title: "Music",
      value: "Music",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-blue-600 to-blue-900">
          <p>音乐</p>
          <img  src="/img/Imok.jpg" className=" h-9/10 flex justify-self-center m-auto object-cover rounded-2xl duration-100 hover:scale-110 hover:-translate-y-5"/>
        </div>
      ),
    },
    {
      title: "Games",
      value: "Games",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-blue-600 to-blue-900">
          <p>游戏</p>
          <DummyContent src={games}/>
        </div>
      ),
    },
    {
      title: "Books",
      value: "Books",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-blue-600 to-blue-900">
          <p>书籍</p>
          <DummyContent src={books}/>
        </div>
      ),
    },
    {
      title: "Animes",
      value: "Animes",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-blue-600 to-blue-900">
          <p>动画</p>
          <DummyContent src={animes}/>
        </div>
      ),
    },
  ];

  return (
    <div className="h-[30rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col lg:max-w-5xl mx-auto w-full  items-start justify-start my-40">
      <Tabs tabs={tabs} />
    </div>
  );
}

interface src {
  src:string,
  color:string
}

const DummyContent = ({src}:{src:src[]}) => {

  return (
    <div className=" flex-col items-center justify-center size-full rounded-2xl p-5 grid grid-cols-2 lg:grid-cols-3 gap-5">

    {
      src.map((item, index) => {
        return (
          <div className="h-9/10 w-full relative " key={index}>
            <div className=" absolute -top-10 h-13/10 overflow-hidden">
              <div className={` ${item.color} absolute w-8/10 h-full -bottom-30 rotate-80 translate-17 rounded-2xl`}></div>
              <img className=" relative object-cover w-full scale-75 -rotate-12 rounded-lg hover:-translate-y-5 duration-100 shadow-2xl" src={item.src} alt="" />
              
            </div>
          </div>
        )
      })
    }

  </div>
  );
};
