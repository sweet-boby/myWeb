"use client";
import React from "react";
import { ContainerScroll } from "./ui/container-scroll-animation";
import Image from "next/image";
import { KernelErrorPrompt } from '../components/WindowsPrompt'
export function HeroScrollDemo() {
  return (
    <div className="relative  flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Unleash the power of <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Windows 95
              </span>
            </h1>
          </>
        }
      >
        {/* <Image
          src={`/linear.webp`}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        /> */}
            <div className="w-full h-full relative" >
          <KernelErrorPrompt></KernelErrorPrompt>
        </div>
      </ContainerScroll>
    </div>
  );
}
