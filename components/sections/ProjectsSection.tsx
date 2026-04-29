'use client'

import { ContainerScroll } from '../ui/container-scroll-animation'
import { KernelErrorPrompt } from '../windows95/KernelErrorPrompt'

export function ProjectsSection() {
  return (
    <div className="relative flex flex-col overflow-hidden">
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
        <div className="w-full h-full relative">
          <KernelErrorPrompt />
        </div>
      </ContainerScroll>
    </div>
  )
}
