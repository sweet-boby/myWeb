'use client'

import { BentoGridDemo } from './BentoGridSection'
import { TimelineDemo } from '../timeline'
import { publicPath } from '@/lib/utils'

export function SkillsSection() {
  return (
    <div>
      <div className="text-5xl justify-self-center items-center lg:w-5xl text-wrap text-center my-35">
        <img src={publicPath('/img/myskill.png')} />
      </div>
      <div>
        <BentoGridDemo />
      </div>
      <div>
        <TimelineDemo />
      </div>
    </div>
  )
}
