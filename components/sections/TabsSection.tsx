"use client";

import { Tabs } from "../ui/tabs";
import { publicPath } from "@/lib/utils";
import { animeImages, bookImages, gameImages } from "@/data/favorites";
import { FavoriteImage } from "@/data/favorites";

function DummyContent({ images }: { images: FavoriteImage[] }) {
  return (
    <div className="flex-col items-center justify-center size-full rounded-2xl p-5 grid grid-cols-2 lg:grid-cols-3 gap-5">
      {images.map((item, index) => (
        <div className="h-9/10 w-full relative" key={index}>
          <div className="absolute -top-10 h-13/10 overflow-hidden">
            <div
              className={`${item.color} absolute w-8/10 h-full -bottom-30 rotate-80 translate-17 rounded-2xl`}
            />
            <img
              className="relative object-cover w-full scale-75 -rotate-12 rounded-lg hover:-translate-y-5 duration-100 shadow-2xl"
              src={item.src}
              alt=""
            />
          </div>
        </div>
      ))}
    </div>
  );
}

const tabs = [
  {
    title: "Music",
    value: "Music",
    content: (
      <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-blue-600 to-blue-900">
        <p>音乐</p>
        <img
          src={publicPath("/img/Imok.jpg")}
          className="h-9/10 flex justify-self-center m-auto object-cover rounded-2xl duration-100 hover:scale-110 hover:-translate-y-5"
        />
      </div>
    ),
  },
  {
    title: "Games",
    value: "Games",
    content: (
      <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-blue-600 to-blue-900">
        <p>游戏</p>
        <DummyContent images={gameImages} />
      </div>
    ),
  },
  {
    title: "Books",
    value: "Books",
    content: (
      <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-blue-600 to-blue-900">
        <p>书籍</p>
        <DummyContent images={bookImages} />
      </div>
    ),
  },
  {
    title: "Animes",
    value: "Animes",
    content: (
      <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-blue-600 to-blue-900">
        <p>动画</p>
        <DummyContent images={animeImages} />
      </div>
    ),
  },
];

export function TabsDemo() {
  return (
    <div className="h-[30rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col lg:max-w-5xl mx-auto w-full items-start justify-start my-40">
      <Tabs tabs={tabs} />
    </div>
  );
}
