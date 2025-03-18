"use client";
import React, { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion, MotionValue, px, calcLength, animate } from "framer-motion";
import { BoxIcon } from "@radix-ui/react-icons";
export function HdScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const { scrollYProgress ,scrollY } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = React.useState(false);
  const [scrollY_distance,setScrollY_distance] = React.useState(0)
  // const [scrollX_distance,setScrollX_distance] = React.useState(0)
  const scrollX_distance = useTransform(scrollYProgress, [0, 1], [innerWidth, box.current?.offsetWidth]);
  const [isTran, setIsTran] = React.useState(false)
  
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    // let timer:any =null
    window.addEventListener("scroll", () => {
        if(scrollYProgress.get() > 0 && scrollYProgress.get() < 1){
          setIsTran(true)
          // infinite()
          // console.log({scrollY_distance})
          // animate(box.current!, {
          //   backgroundColor: ['#ff0000','#000000']
          // }
          // )
                // 定时替换函数（每隔2秒执行一次）
      //  timer = setInterval(() => {
      //   // 创建新元素并填充内容
      //   const newDiv = document.createElement('div');
      //   newDiv.innerHTML = contents[currentIndex];
        
      //   if(target){// 替换原元素
      //     target.replaceWith(newDiv);
      //     target = newDiv; // 更新引用
      //   }
  
      //   // 循环索引
      //   currentIndex = (currentIndex + 1) % contents.length;
      // }, 100);


          if(card.current){
            setScrollY_distance(scrollYProgress.get() * card.current.offsetWidth * 0.6)
            if(box.current){
              // box.current.style.left = `${scrollX_distance.get()}px`
              box.current.style.position = "fixed"
              // box.current.style.left = `50%`
              // box.current.style.top = `50%`
              // box.current.style.transform = "translate(-50%, -50%)"
            }
          }
          
        }
        else if(scrollYProgress.get() == 0)
        {
          if(box.current){
            // box.current.style.left = `${scrollX_distance.get()}px`
            box.current.style.position = "absolute"
            // box.current.style.left = `50%`
            box.current.style.top = `0%`
            box.current.style.transform = ""
            box.current.style.bottom = ``
            // box.current.style.transform = `translateY(${{scrollY_distance}}px)`
            // clearTimeout(timer)
            setIsTran(false)
          }
        }else{
          if(box.current){
            // box.current.style.left = `${scrollX_distance.get()}px`
            box.current.style.position = "absolute"
            // box.current.style.left = `50%`
            box.current.style.bottom = `0%`
            box.current.style.top = ``
            box.current.style.transform = ""
            // clearTimeout(timer)
            setIsTran(false)
          }
        }
        
      });
      

         const contents = [
        "第一段内容",
        "第二段内容",
        "第三段内容"
      ];
  


     
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
    
  }, [scrollY_distance]);

  // const scaleDimensions = () => {
  //   return isMobile ? [0.7, 0.9] : [1.05, 1];
  // };

  // const rotate = useTransform(scrollYProgress, [0, 1], [20, -20]);
  // const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  // const translate = useTransform(scrollYProgress, [0, 1], [window.innerWidth, -window.innerWidth]);

  return (
    <motion.div ref={containerRef} className="bg-[#F3F4F6] relative min-w-full" style={{ height: isMobile ? "5970px" : "3970px" }}
        initial={{ backgroundColor: "#F3F4F6" }} // 初始颜色
        whileInView={{ backgroundColor: "#000000" }} // 进入视口变色
        viewport={{ once: false, margin: "-30% 0px" }} // 滚动到视口中央30%区域触发
        transition={{ 
          duration: 0.8, 
          ease: "anticipate" 
        }}
        onViewportLeave={() => { // 离开视口回调
          animate(containerRef.current!, { 
            backgroundColor: "#F3F4F6" 
          }, { duration: 0.5 })
        }}
    >
      {/* {scrollY_distance} */}
      <motion.div  ref={box}  className="h-screen w-screen md:px-4 overflow-hidden" 
              transition={{
                duration: 2,         // 总持续时间3秒
                times: [0, 0.5, 1], // 时间节点分配：红→黑(1.5秒)/黑→蓝(1.5秒)
                ease: [
                  "easeIn", 
                  "easeOut"          // 分段设置缓动曲线[1](@ref)
                ]
              }}
      >
        <motion.div
              ref={card}
              className={`h-8/10 w-full md:w-900 flex m-auto absolute top-0 bottom-0 left-0 ${isMobile ? 'flex-col px-4' : ''}`}
               
      transition={{
        duration:0.5,
      }}
      style={{
        // width:'200vh'
        // backgroundColor:'blue',
        // borderRadius:'20px',
        // translateX:scrollX_distance,
      }}
      // whileHover={{
      //   backgroundColor: 'black',
        
      // }}
      animate={
    {
      // x:[10,1000], // 向右移动50px
      x: isMobile ? 0 : -scrollY_distance, // 小屏设备不需要横向滑动
      y: isMobile ? -scrollY_distance : 0, // 小屏设备改为纵向滑动
    }
  }
      >
        <motion.div className={`absolute ${isMobile ? 'flex flex-col' : 'flex'} w-full h-full justify-between z-160`}
          animate={{
            // x:[10,1000], // 向右移动50px
            x: isMobile ? 0 : scrollY_distance*0.05, // 小屏设备取消横向移动
            y: isMobile ? scrollY_distance*0.05 : 0, // 小屏设备改为纵向移动
          }} 
        >

          <motion.div className={`${isMobile ? 'w-full h-[30vh] mb-8' : 'w-4/13'} relative`}
              initial={{opacity:0}}
              whileInView={{ opacity: isTran ? 1 : 0 }}
              viewport={{ once: false, margin: "-30% 0px" }}
          >
                  <img src="/img/1030.png" className={`absolute z-100 ${isMobile ? 'w-7/10 left-0' : 'w-5/10'} translate-y-[-30%]`}></img>
                  <TransformText mycontents={
                ["/img/feiji.png","/img/feiji4.png","/img/feiji5.png"]
              } isTran={isTran} speed={300} className={`absolute z-100 text-amber-300 ${isMobile ? 'h-60 w-7/10 right-0' : 'h-78 w-5/10 right-15'} top-0 translate-y-[-35%]`}/>
                  <img src="/img/10302.png" className={`absolute z-100 ${isMobile ? 'w-7/10' : 'w-5/10'} right-0 top-0 translate-y-[100%] translate-x-[15%]`}></img>
                  <img src="/img/10303.png" className={`absolute z-100 ${isMobile ? 'w-8/10' : 'w-6/10'} right-0 bottom-0 translate-y-[60%]`}></img>
          </motion.div>


          <motion.div className={`${isMobile ? 'w-full h-[30vh] mb-8' : 'w-4/13'} relative`}
              initial={{opacity:0}}
              whileInView={{ opacity: isTran ? 1 : 0 }}
              viewport={{ once: false, margin: "-30% 0px" }}
          >
            <img src="/img/bb.png" className={`absolute z-100 ${isMobile ? 'w-9/10 left-0' : 'w-8/10'} translate-y-[-30%]`}></img>
              <TransformText mycontents={
                ["/img/ai1.png","/img/ai2.png","/img/ai3.png"]
              } isTran={isTran} speed={100} className={`absolute z-100 text-amber-300 ${isMobile ? 'h-80 w-3/10' : 'h-100 w-2/10'} right-15 top-0 translate-y-[-35%]`}/>
            <img src="/img/bb2.png" className={`absolute z-100 ${isMobile ? 'w-8/10' : 'w-7/10'} bottom-0 translate-y-[60%]`}></img>
            <TransformText mycontents={
                ["/img/zl1.png","/img/zl2.png","/img/zl3.png"]
              } isTran={isTran} speed={100} className={`absolute z-100 text-amber-300 ${isMobile ? 'h-80 w-4/10' : 'h-100 w-3/10'} right-15 bottom-0 translate-y-[50%]`}/>
          </motion.div>


          <motion.div className={`${isMobile ? 'w-full h-[30vh] mb-8' : 'w-4/13'} relative`}
              initial={{opacity:0}}
              whileInView={{ opacity: isTran ? 1 : 0 }}
              viewport={{ once: false, margin: "-30% 0px" }}
              transition={{
                duration:1,
              }}
          >
              <img src="/img/tz1.png" className={`absolute z-100 ${isMobile ? 'w-9/10 left-0' : 'w-8/10'} translate-y-[-40%]`}></img>
              <img src="/img/tz2.png" className={`absolute z-100 ${isMobile ? 'w-9/10' : 'w-8/10'} right-0 bottom-0 z-155 translate-y-[40%]`}></img>
          </motion.div>
        </motion.div>

        
        <div className={`${isMobile ? 'w-full h-[80vh] ml-0 mb-[2rem] px-4' : 'h-full w-4/13 ml-[5rem]'} bg-amber-300 rounded-4xl truncate relative`}>
        <img src="/img/taozhe3.jpg" alt="" className="h-full w-full object-cover absolute top-0 bottom-0 left-0 right-0 z-5"/>
        <p className={`${isMobile ? 'text-7xl' : 'text-9xl'} text-red-300 absolute top-10 right-5 z-10 font-extrabold text-white`}>1997</p>
        <motion.img src="/img/Davidtao.jpg" alt="" className={`${isMobile ? 'h-40 w-40' : 'h-50 w-50'} object-cover absolute bottom-0 z-6`}
            style={
              {
                // left:'calc(-200% + -10rem)'
              }
            }
            animate={
              {
                x: isMobile ? 0 : scrollY_distance *1.2, // 小屏设备取消横向移动
                y: isMobile ? scrollY_distance * 0.2 : 0, // 小屏设备改为纵向移动
              }
            }
            transition={{
              duration:0.5,
            }}
          />
        </div>
        <div className={`${isMobile ? 'w-full h-[80vh] ml-0 mb-[2rem] px-4' : 'h-full w-4/13 ml-[5rem]'} bg-cyan-800 rounded-4xl truncate relative`}>
        <img src="/img/taozhe2.jpg" alt="" className="h-full w-full object-cover absolute top-0 bottom-0 left-0 right-0 z-5"/>
        <p className={`${isMobile ? 'text-7xl' : 'text-9xl'} text-red-300 absolute top-10 right-5 z-10 font-extrabold text-white`}>1999</p>
        <motion.img src="/img/Imok.jpg" alt="" className={`${isMobile ? 'h-40 w-40' : 'h-50 w-50'} object-cover absolute bottom-0 z-6`}
            style={
              {
                left: isMobile ? '0' : 'calc(-100% + -5rem)' // 小屏设备重置初始位置
              }
            }
            animate={
              {
                x: isMobile ? 0 : scrollY_distance *1.2, // 小屏设备取消横向移动
                y: isMobile ? scrollY_distance * 0.2 : 0, // 小屏设备改为纵向移动
              }
            }
            transition={{
              duration:0.5,
            }}
          />
        </div>
        <div className={`${isMobile ? 'w-full h-[80vh] ml-0 mb-[2rem] px-4' : 'h-full w-4/13 ml-[5rem]'} bg-amber-100 rounded-4xl truncate relative`}>
          <img src="/img/taozhe1.jpg" alt="" className="h-full w-full object-cover absolute top-0 bottom-0 left-0 right-0 z-5"/>
          <p className={`${isMobile ? 'text-7xl' : 'text-9xl'} text-red-300 absolute top-10 right-5 z-10 font-extrabold text-white`}>2002</p>
          <motion.img src="/img/Heiseliuding.jpg" alt="" className={`${isMobile ? 'h-40 w-40' : 'h-50 w-50'} object-cover absolute bottom-0 z-6`}
            style={
              {
                left: isMobile ? '0' : 'calc(-200% + -10rem)' // 小屏设备重置初始位置
              }
            }
            animate={
              {
                x: isMobile ? 0 : scrollY_distance *1.2, // 小屏设备取消横向移动
                y: isMobile ? scrollY_distance * 0.2 : 0, // 小屏设备改为纵向移动
              }
            }
            transition={{
              duration:0.5,
            }}
          />
        </div>
        </motion.div>
      </motion.div>

    </motion.div>
  )
};

const TransformText = ({ isTran ,className,speed,mycontents}: { isTran: boolean , className? : string , speed? : number,mycontents? : string[]}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const contents = mycontents

  useEffect(() => {
    if (isTran) {
      timerRef.current = setInterval(() => {
        if(contents)
        setCurrentIndex((prev: number) => (prev + 1) % contents.length)
      }, speed)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isTran])

  // 使用React控制的内容渲染
  return <div className={className}>
        {
          contents?.map((item,index) => {
            return (<img src={item} key={index} className={`${index === currentIndex ? 'block' : 'hidden'} object-cover h-full`}></img>)
          })
        }
    </div>
}