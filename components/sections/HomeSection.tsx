"use client";

import { ThreeDCardDemo } from "./ThreeDCardDemo";
import { TypingAnimation } from "../magicui/typing-animation";
import { MorphingText } from "../magicui/morphing-text";
import { SocialLinks } from "../shared/SocialLinks";
import { publicPath } from "@/lib/utils";

export function HomeSection() {
  return (
    <div className="flex-wrap flex justify-center size-full">
      <div className="items-start w-full lg:w-5/10 text-6xl p-5 lg:pt-20 lg:pl-20">
        <div>
          <b>
            Hello , There! <br />
            你好
          </b>
        </div>
        <div className="mt-10 flex items-center">
          <img
            src={publicPath("/img/avatar1.jpg")}
            className="size-40 rounded-full m-[-15]"
            alt="avatar"
          />
          <div className="text-2xl lg:text-5xl pl-10">
            <b>
              I&apos;m
              <span className="px-2 text-blue-600 rounded-md">Blues Lee</span>
            </b>
            <div className="mt-5">
              <MorphingText texts={["Student", "Developer"]} />
            </div>
          </div>
        </div>

        <TypingAnimation
          duration={30}
          className="text-2xl flex justify-self-center items-center w-full text-wrap h-auto text-start my-5"
        >
          I am an undergraduate student majoring in computer science at
          Guangdong Pharmaceutical University Passionate about developing
          applications that combine purpose with aesthetics
        </TypingAnimation>

        <div className="text-2xl flex justify-self-center items-center w-full text-wrap h-auto text-start">
          我是广东药科大学的本科生，主修计算机科学
          <br />
          热衷于开发将目的与美学相结合的应用程序
        </div>

        <SocialLinks />
      </div>

      <div className="lg:w-5/10 w-full lg:pr-20">
        <ThreeDCardDemo />
      </div>
    </div>
  );
}
