'use client'

import Image from "next/image";
import React from "react";
import { Timeline } from "@/components/ui/timeline";
import Link from 'next/link';
export function TimelineDemo() {
  const data = [
    {
      title: "2023.9.10",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
          Participating in the mathematical modeling competition, I was fortunate to find a reliable partner. After three days of hard work, I finally won the provincial second prize.
After processing 88w pieces of data with Python, everyone was numb and didn't sleep well for three days.
Finally, using the time series forecast and the optimization formula in the paper, the problem was finally solved, and I could finally get a good night's sleep
          </p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                参加数学建模竞赛，很幸运找到了靠谱的伙伴，外面奋战了三天，最终获得了省二等奖。
            用python处理了88w条数据，人都麻了，三天没睡好觉。
            最后，用时间序列预测和论文上看来的优化公式，也是把题做出来了，终于能睡个好觉了
          </p>
          <div className="grid grid-cols-2 gap-4">
          {/* <Link href="https://www.baidu.com">
            <a target="_blank" rel="noopener noreferrer">跳转到百度</a>
          </Link> */}
            <Image
              src="/img/experience/sxjm1.jpg"
              alt="startup template"
              width={500}
              height={500}
              onClick={()=>window.open("https://www.baidu.com")}
              className="hover:scale-120 hover:duration-300 rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"

            />
            <Image
              src="/img/experience/sxjm4.jpg"
              alt="startup template"
              width={500}
              height={500}
              onClick={()=>window.open("https://www.baidu.com")}
              className="hover:scale-120 hover:duration-300 rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"

            />
            <Image
              src="/img/experience/sxjm2.png"
              alt="startup template"
              width={500}
              height={500}
              onClick={()=>window.open("https://www.baidu.com")}
              className="hover:scale-120 hover:duration-300 rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"

            />
            <Image
              src="/img/experience/sxjm3.jpg"
              alt="startup template"
              width={500}
              height={500}
              onClick={()=>window.open("https://www.baidu.com")}
              className="hover:scale-120 hover:duration-300 rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "2024.2",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
          Strike while the iron is hot to participate in the Mathematical Modeling American Competition, and he didn't sleep for four days. Fortunately, this time I encountered a similar problem before, and it was successfully completed.
          I learned to solve differential equations with matlab, and finally won an h prize. It is also the experience of the prize competition that has been written into a post on csdn, hoping to provide some reference for future students.
          </p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            趁热打铁参加了数学建模美赛，又是四天没没合眼，还好这次题目之前有碰到类似的，很顺利做出来了。
            学习了用matlab解微分方程，最后拿了个h奖。也是把比赛的经验写成了帖子发在了csdn上，希望能供后来的同学一些参考吧。
          </p>
          <div className="grid grid-cols-2 gap-4">
          <Image
              src="/img/experience/sxjm7.jpg"
              alt="startup template"
              width={500}
              height={500}
              onClick={()=>window.open("https://www.baidu.com")}
              className="hover:scale-120 hover:duration-300 rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <Image
              src="/img/experience/sxjm6.jpg"
              alt="startup template"
              width={500}
              height={500}
              onClick={()=>window.open("https://www.baidu.com")}
              className="hover:scale-120 hover:duration-300 rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <Image
              src="/img/experience/sxjm9.png"
              alt="startup template"
              width={500}
              height={500}
              onClick={()=>window.open("https://www.baidu.com")}
              className="hover:scale-120 hover:duration-300 rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <Image
              src="/img/experience/sxjm8.png"
              alt="startup template"
              width={500}
              height={500}
              onClick={()=>window.open("https://www.baidu.com")}
              className="hover:scale-120 hover:duration-300 rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "2024.5",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
          I participated in the school's club activities, mainly doing publicity and some offline activities. At that time, I learned to make posters and designs,
           and experienced the fun of helping classmates
          </p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
            参加了学校的社团活动，主要是做宣传和一些线下的活动，那个时候学会了做海报和做设计，体验了帮助同学的乐趣
          </p>
          <div className="grid grid-cols-2 gap-4">
          <Image
              src="/img/experience/st1.png"
              alt="startup template"
              width={500}
              height={500}
              onClick={()=>window.open("https://www.baidu.com")}
              className="hover:scale-120 hover:duration-300 rounded-lg object-contain h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
                 <Image
              src="/img/experience/st2.jpg"
              alt="startup template"
              width={500}
              height={500}
              onClick={()=>window.open("https://www.baidu.com")}
              className=" object-contain hover:scale-120 hover:duration-300 rounded-lg  h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <Image
              src="/img/experience/st3.jpg"
              alt="startup template"
              width={500}
              height={500}
              onClick={()=>window.open("https://www.baidu.com")}
              className="hover:scale-120 hover:duration-300 rounded-lg object-contain h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <Image
              src="/img/experience/st4.jpg"
              alt="startup template"
              width={500}
              height={500}
              onClick={()=>window.open("https://www.baidu.com")}
              className="hover:scale-120 hover:duration-300 rounded-lg object-contain h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <Image
              src="/img/experience/st5.jpg"
              alt="startup template"
              width={500}
              height={500}
              onClick={()=>window.open("https://www.baidu.com")}
              className="hover:scale-120 hover:duration-300 rounded-lg object-contain h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <Image
              src="/img/experience/st6.jpg"
              alt="startup template"
              width={500}
              height={500}
              onClick={()=>window.open("https://www.baidu.com")}
              className="hover:scale-120 hover:duration-300 rounded-lg object-contain h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "2025.3",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
          Attended my long-awaited Tao Zhe concert in Hong Kong. After 22 years, his first concert was in 2003, before I was born.
          22 is really too long, enough for me to go from birth to society. Time can really change so many things. On the day of the concert, the news came that Fang Datong passed away, and he was also a singer I liked very much.
          Look, this is fate. Fortunately, 22 years later, Tao Zhe can still return to Hong Kong to give concerts, become popular, be liked, and do what he likes.
          Not everyone has this opportunity, this is simply the best luck in the world.
          I hope I can still do what I love in 22 years
          </p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
            参加了我期待已久的陶喆香港演唱会。时隔22年啊，他第一次开演唱会是2003年，那时我还没出生。
            22年真的太长了，足够我从出生到步入社会。时间真的能够改变太多东西，就在演唱会当天，传来了方大同离世的消息，也是一位我很喜欢的歌手。
            看，这就是命运弄人。还好还好，22年后陶喆还能回香港开演唱会，还能翻红，还能被人喜欢，还能做自己喜欢的事情。
            不是谁都有这机会，这简直就是世界上一等一的幸运。
            希望我22年后还能做自己喜欢的事
          </p>
          <div className="grid grid-cols-2 gap-4">
          <Image
              src="/img/experience/xg.jpg"
              alt="startup template"
              width={500}
              height={500}
              onClick={()=>window.open("https://www.baidu.com")}
              className="hover:scale-120 hover:duration-300 rounded-lg object-contain h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <Image
              src="/img/experience/xg2.jpg"
              alt="startup template"
              width={500}
              height={500}
              onClick={()=>window.open("https://www.baidu.com")}
              className="hover:scale-120 hover:duration-300 rounded-lg object-contain h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <Image
              src="/img/experience/xg3.jpg"
              alt="startup template"
              width={500}
              height={500}
              onClick={()=>window.open("https://www.baidu.com")}
              className="hover:scale-120 hover:duration-300 rounded-lg object-contain h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <Image
              src="/img/experience/xg4.jpg"
              alt="startup template"
              width={500}
              height={500}
              onClick={()=>window.open("https://www.baidu.com")}
              className="hover:scale-120 hover:duration-300 rounded-lg object-contain h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full">
      <Timeline data={data} />
    </div>
  );
}
