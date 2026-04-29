"use client";

import Image from "next/image";
import { Timeline } from "@/components/ui/timeline";
import { publicPath } from "@/lib/utils";
import { experienceData } from "@/data/experience";

const imgClass =
  "hover:scale-120 duration-300 rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]";

const imgClassContain =
  "hover:scale-120 duration-300 rounded-lg object-contain h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]";

const isMathModeling = (title: string) => title.includes("数学建模");

export function TimelineDemo() {
  const data = experienceData.map((entry) => ({
    title: entry.date,
    content: (
      <div>
        {entry.descriptions.map((desc, i) => (
          <p
            key={i}
            className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8"
          >
            {desc}
          </p>
        ))}
        <div className="grid grid-cols-2 gap-4">
          {entry.images.map((src, i) => (
            <Image
              key={i}
              src={publicPath(src)}
              alt="experience image"
              width={500}
              height={500}
              className={
                isMathModeling(entry.title) ? imgClass : imgClassContain
              }
            />
          ))}
        </div>
      </div>
    ),
  }));

  return (
    <div className="w-full">
      <Timeline data={data} />
    </div>
  );
}
