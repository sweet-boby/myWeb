"use client";

import React, { useState, useEffect, useRef } from "react";

export function KernelErrorPrompt() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [clones, setClones] = useState<{ x: number; y: number }[]>([]);
  const dragOffset = useRef({ x: 0, y: 0 });
  const promptRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 初始化居中定位
  // useEffect(() => {
  //   if (containerRef.current && promptRef.current) {
  //     const containerRect = containerRef.current.getBoundingClientRect();
  //     const promptWidth = promptRef.current.offsetWidth;
  //     const promptHeight = promptRef.current.offsetHeight;
      
  //     setPosition({
  //       x: containerRect.width / 2 - promptWidth / 2,
  //       y: containerRect.height / 2 - promptHeight / 2
  //     });
  //   }
  // }, []);

  // 鼠标按下事件处理函数
  // 鼠标按下事件处理函数
    // 获取容器和提示框的矩形边界
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // 获取容器和提示框的矩形边界
    const containerRect = containerRef.current?.getBoundingClientRect();
    // 如果容器和提示框的矩形边界存在
    const promptRect = promptRef.current?.getBoundingClientRect();
      // 设置拖拽状态为true
    
    // 如果容器和提示框的矩形边界存在
    if (containerRect && promptRect) {
      setIsDragging(true);
      // 计算相对于容器的偏移量
      dragOffset.current = {
        x: e.clientX - containerRect.left - (promptRect.left - containerRect.left),
        y: e.clientY - containerRect.top - (promptRect.top - containerRect.top)
      };
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && containerRef.current && promptRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      // 计算相对于容器的位置
      const newX = e.clientX - containerRect.left - dragOffset.current.x;
      const newY = e.clientY - containerRect.top - dragOffset.current.y;
      
      setPosition({ x: newX, y: newY });
      
      if (clones.length === 0 || 
          Math.abs(clones[clones.length-1].x - newX) > 10 ||
          Math.abs(clones[clones.length-1].y - newY) > 10) {
        setClones(prev => [...prev, { x: newX, y: newY }]);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setClones([]);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className="relative flex items-center justify-center bg-[#0D7073] select-none  h-full w-full"
    >
      {/* Watermark */}
      <div className="pointer-events-none text-[20vh] leading-[0.8] text-white opacity-10 whitespace-pre text-center">
        Windows{'\n'}95
      </div>

      {/* Clones */}
      {clones.map((clone, i) => (
        <div
          key={i}
          className="absolute w-[300px] h-[142px] bg-[#BFBFBF] p-px shadow-[2px_2px_0_0_rgba(0,0,0,0.25)]"
          style={{
            left: clone.x + "px",
            top: clone.y + "px",
            transform: `translate(${i*2}px, ${i*2}px)`
          }}
        >
          <div className="w-full bg-[#00007F] text-white p-[3px_4px] font-bold">
            Kernel Error
          </div>
          <div className="mt-3 h-[100px] flex flex-col justify-around items-center">
              I swear AI will replace humans
            <button className="relative w-[120px] h-6 bg-[#BFBFBF] text-sm">
              <span>OK</span>
              <BorderOverlay />
            </button>
          </div>
        </div>
      ))}

      {/* Main Prompt */}
      <div
        ref={promptRef}
        className="absolute bottom-0  w-[300px] h-[142px] bg-[#BFBFBF] p-px shadow-[2px_2px_0_0_rgba(0,0,0,0.25)]"
        style={{ 
          left: position.x + "px",
          top: position.y + "px"
        }}
      >
        <div 
          className="w-full bg-[#00007F] text-white p-[3px_4px] font-bold cursor-move"
          onMouseDown={handleMouseDown}
        >
          Kernel Error
        </div>
        <div className="mt-3 h-[100px] flex flex-col justify-around items-center">
          I swear AI will replace humans
          <button className="relative w-[120px] h-6 bg-[#BFBFBF] text-sm">
            <span>OK</span>
            <BorderOverlay />
          </button>
        </div>
        <BorderOverlay />
      </div>
    </div>
  );
}

const BorderOverlay = () => (
  <>
    <div className="absolute inset-[-2px] border-2 border-t-[#dfdfdf] border-l-[#dfdfdf] border-b-black border-r-black pointer-events-none" />
    <div className="absolute inset-[-1px] border border-t-white border-l-white border-b-[#7f7f7f] border-r-[#7f7f7f] pointer-events-none" />
  </>
);