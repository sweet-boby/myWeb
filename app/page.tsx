'use client'
import { ThreeDCardDemo } from '../components/3dc'
import { BentoGridDemo } from '../components/btg'
import { HeroScrollDemo } from '../components/csa';
import { TimelineDemo } from '../components/timeline';
import { TabsDemo } from '../components/tab';

import { HdScroll } from '../components/hd'
import { TypingAnimation } from "../components/magicui/typing-animation";
import { MorphingText } from "../components/magicui/morphing-text";
import { FaGithub } from "react-icons/fa";
import { SiCsdn } from "react-icons/si";
import UserAvatar from "../components/UserAvatar";


export default function Home() {
  return (
    <>

      <nav className=" sticky top-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm w-full">
        <div className="container mx-auto px-4">
          <div className="flex justify-self-center items-center justify-between h-16">
            <div className="flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors">
                首页
              </a>
              <a href="#skills" className="text-gray-700 hover:text-blue-600 transition-colors">
                技能
              </a>
              <a href="#projects" className="text-gray-700 hover:text-blue-600 transition-colors">
                项目
              </a>
              <a href="#favorites" className="text-gray-700 hover:text-blue-600 transition-colors">
                爱好
              </a>
              {/* <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              联系我
            </a> */}
            </div>
          </div>
        </div>
      </nav>

      {/* <UserAvatar /> */}
      <section id="home">
        <TopHome />
      </section>

      <section id="skills">
        <Myskill />
      </section>

      <section id="projects">
        <HeroScrollDemo></HeroScrollDemo>
      </section>

      <section id="favorites">
        <Myfavourite />
      </section>

      {/* <section id="contact">
      <div className={"text-5xl justify-self-center items-center lg:w-5xl w-full text-wrap text-center my-10"}>
        Contact Me
      </div>
    </section> */}

      <footer className="mt-20 py-6 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-600">
          © 2025 Blues Lee. All rights reserved.
        </div>
      </footer>
    </>
  );
}

const Myfavourite = () => {
  return (
    <div>
      <div className={" text-5xl justify-self-center items-center lg:w-5xl text-wrap text-center my-10"}>
        <img src="/img/myfavourite.png" />
      </div>
      <HdScroll></HdScroll>
      <TabsDemo></TabsDemo>
    </div>
  )
}

const Myskill = () => {
  return (
    <div>
      <div className={"text-5xl justify-self-center items-center lg:w-5xl text-wrap text-center my-35"}>
        <img src="/img/myskill.png" />
      </div>
      <div>
        <BentoGridDemo></BentoGridDemo>
      </div>
      <div>
        <TimelineDemo></TimelineDemo>
      </div>
    </div>
  )
}

const TopHome = () => {
  return (
    <div className="flex-wrap flex justify-center size-full">
      <div className={'items-start w-full lg:w-5/10 text-6xl p-5 lg:pt-20 lg:pl-20'}>
        <div>
          <b>
            Hello , There! <br />你好
          </b>
        </div>
        <div className="mt-10 flex items-center ">
          <img src="/img/avatar1.jpg" className="size-40 rounded-full  m-[-15] " />
          <div className="text-2xl lg:text-5xl pl-10">
            <b>
              I'm
              <span className=" px-2 text-blue-600 rounded-md">
                Blues Lee
              </span>
            </b>
            <div className="mt-5">
              <MorphingText texts={['Student', 'Developer']} />
            </div>

          </div>
        </div>


        <TypingAnimation duration={30} className={"text-2xl flex justify-self-center items-center w-full text-wrap h-auto text-start my-5"}>
          I am an undergraduate student majoring in computer science at Guangdong Pharmaceutical University
          Passionate about developing applications that combine purpose with aesthetics
        </TypingAnimation>
        <div className={"text-2xl flex justify-self-center items-center w-full text-wrap h-auto text-start"}>
          我是广东药科大学的本科生，主修计算机科学<br />
          热衷于开发将目的与美学相结合的应用程序
        </div>

        <div className="text-xl flex items-center py-5" >
          <FaGithub className="hover:text-blue-500 cursor-pointer" onClick={() => { window.open('https://github.com/sweet-boby') }} size={30} />
          <SiCsdn className="hover:text-blue-500 ml-5 cursor-pointer" onClick={() => { window.open('https://blog.csdn.net/2302_80902795?spm=1000.2115.3001.5343') }} size={30} />
        </div>
      </div>
      <div className="lg:w-5/10 w-full lg:pr-20">
        <ThreeDCardDemo></ThreeDCardDemo>
      </div>


    </div>

  )
}
