"use client";

import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import { skills } from "@/data/skills";
import {
  FaHtml5,
  FaCss3,
  FaJs,
  FaReact,
  FaPython,
  FaNodeJs,
  FaJava,
} from "react-icons/fa";
import { SiTypescript } from "react-icons/si";
import { RiNextjsFill, RiWechatFill } from "react-icons/ri";
import { PiFileSqlThin, PiMathOperationsFill } from "react-icons/pi";
import { TbMathMaxMin } from "react-icons/tb";
import { IconType } from "react-icons";

const iconMap: Record<string, IconType> = {
  FaHtml5,
  FaCss3,
  FaJs,
  FaReact,
  FaPython,
  FaNodeJs,
  FaJava,
  SiTypescript,
  RiNextjsFill,
  RiWechatFill,
  PiFileSqlThin,
  PiMathOperationsFill,
  TbMathMaxMin,
};

const Skeleton = () => <div className="h-10" />;

export function BentoGridDemo() {
  return (
    <BentoGrid className="max-w-5xl mx-auto">
      {skills.map((item) => {
        const Icon = iconMap[item.iconName];
        return (
          <BentoGridItem
            key={item.title}
            title={item.title}
            description={item.description}
            header={<Skeleton />}
            icon={
              Icon ? <Icon className="h-10 w-10 text-blue-500" /> : undefined
            }
            className={item.colSpan ? "md:col-span-2" : ""}
          />
        );
      })}
    </BentoGrid>
  );
}
