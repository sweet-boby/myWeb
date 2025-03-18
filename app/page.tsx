import Image from "next/image";
import {  ThreeDCardDemo} from '../components/3dc'
import { MarqueeDemo } from '../components/mq'

import { ScratchToRevealDemo } from '../components/str'

import { BentoGridDemo } from '../components/btg'
import { KernelErrorPrompt } from '../components/WindowsPrompt'
import { HeroScrollDemo } from '../components/csa';
import { TimelineDemo } from '../components/timeline';
import { TabsDemo } from '../components/tab';

import { HdScroll } from '../components/hd'
import { TypingAnimation } from "../components/magicui/typing-animation";
import { TextAnimate } from "../components/magicui/text-animate";
import { MorphingText } from "../components/magicui/morphing-text";
export default function Home() {
  return (
   <>

    <TopHome/>
    <div className={"text-5xl justify-self-center items-center lg:w-5xl text-wrap text-center my-35"}>
      <img src="/img/myskill.png"/>        
        {/* <b>
          my code and exprence
        </b> */}
    </div>
    <div>
      <BentoGridDemo></BentoGridDemo>
    </div>
    <div>
      <TimelineDemo></TimelineDemo>
    </div>

    <div className={" text-5xl justify-self-center items-center lg:w-5xl text-wrap text-center my-10"}>
        <img src="/img/myfavourite.png"/>
      {/* <b>
        my favorty
      </b> */}
    </div>
  <HdScroll></HdScroll>
  <HeroScrollDemo></HeroScrollDemo>

    <TabsDemo></TabsDemo>

    <div className={"text-5xl justify-self-center items-center lg:w-5xl w-full text-wrap text-center my-10"}>
    Contact Me
    </div>
    </>
  );
}

const TopHome = () => {
  return(
  <div className="flex-wrap flex justify-center size-full">
    <div className={'items-start w-full lg:w-5/10 text-6xl p-5 lg:pt-20 lg:pl-20'}>
      <div>
            <b>
            Hello , There! <br/>你好
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
            <MorphingText texts={['Student','Developer']} />
          </div>
          
        </div>
      </div>


      <TypingAnimation duration={30} className={"text-2xl flex justify-self-center items-center w-full text-wrap h-auto text-start my-5"}>
          I'm an undergraduate student at University of Minnesota Twin Cities majoring in Computer Science. 
          Passionate about developing applications that merge purpose with aesthetics.
      </TypingAnimation>
      <div className={"text-2xl flex justify-self-center items-center w-full text-wrap h-auto text-start"}>
        我是明尼苏达大学双城分校的本科生，主修计算机科学<br/>
        热衷于开发将目的与美学相结合的应用程序
      </div>
      <div>
        <div className="text-xl">
           exprence 我的经历
        </div>
        <div className="text-xl">
           favourite 我的喜好
        </div>
        <div className="text-xl">
           project 我的项目
        </div>
      </div>
      <div className="text-xl">github csdn bilibil</div>
    </div>
    <div className="lg:w-5/10 w-full lg:pr-20">
        <ThreeDCardDemo></ThreeDCardDemo>
    </div>
     
      
   </div>

  )
}
