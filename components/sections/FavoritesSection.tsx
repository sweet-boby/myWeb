"use client";

import { HdScroll } from "../hd";
import { TabsDemo } from "./TabsSection";
import { publicPath } from "@/lib/utils";

export function FavoritesSection() {
  return (
    <div>
      <div className="text-5xl justify-self-center items-center lg:w-5xl text-wrap text-center my-10">
        <img src={publicPath("/img/myfavourite.png")} alt="" />
      </div>
      <HdScroll />
      <TabsDemo />
    </div>
  );
}
