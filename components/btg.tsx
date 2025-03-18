import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import {
  IconArrowWaveRightUp,
  IconBoxAlignRightFilled,
  IconBoxAlignTopLeft,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";

import { FaHtml5,FaCss3,FaJs,FaReact ,FaPython,FaNodeJs ,FaJava     } from "react-icons/fa";
import { SiTypescript } from "react-icons/si";
import { RiNextjsFill,RiWechatFill  } from "react-icons/ri";
import { PiFileSqlThin,PiMathOperationsFill  } from "react-icons/pi";
import { TbMathMaxMin } from "react-icons/tb";


export function BentoGridDemo() {
  return (
    <BentoGrid className="max-w-5xl mx-auto">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          icon={item.icon}
          className={i === 3 || i === 6 ? "md:col-span-2" : ""}
        />
      ))}
    </BentoGrid>
  );
}
const Skeleton = () => (
  <div className="h-10"></div>
);
const items = [
  {
    title: "HTML",
    description: "Semantic markup",
    header: <Skeleton />,
    icon: <FaHtml5 className="h-10 w-10 text-blue-500" />,
  },
  {
    title: "CSS",
    description: "Styling and responsive design",
    header: <Skeleton />,
    icon: <FaCss3 className="h-10 w-10 text-blue-500" />,
  },
  {
    title: "JAVASCRRIPT",
    description: "Web development 网站开发",
    header: <Skeleton />,
    icon: <FaJs className="h-10 w-10 text-blue-500" />,
  },
  {
    title: "TYPESCRIPT",
    description:
      "Type-safe JS ",
    header: <Skeleton />,
    icon: <SiTypescript className="h-10 w-10 text-blue-500" />,
  },
  {
    title: "VUE/REACT",
    description: "UI framework 前端框架",
    header: <Skeleton />,
    icon: <FaReact  className="h-10 w-10 text-blue-500" />,
  },
  {
    title: "NextJS",
    description: "full stack framework 全栈框架",
    header: <Skeleton />,
    icon: <RiNextjsFill className="h-10 w-10 text-blue-500" />,
  },
  {
    title: "PYTHON",
    description: "Pandas, NumPy, Matplotlib, Seaborn, Scikit-learn, Keras, etc.",
    header: <Skeleton />,
    icon: <FaPython  className="h-10 w-10 text-blue-500" />,
  },
  {
    title: "SQL/NoSQL",
    description: "Databases 数据库设计",
    header: <Skeleton />,
    icon: <PiFileSqlThin className="h-10 w-10 text-blue-500" />,
  },
  {
    title: "Node.js",
    description: "JavaScript runtime environment js运行环境",
    header: <Skeleton />,
    icon: <FaNodeJs className="h-10 w-10 text-blue-500" />,
  },
  {
    title: "Matlab",
    description: "Mathematical calculation tool 数学计算工具",
    header: <Skeleton />,
    icon: <PiMathOperationsFill className="h-10 w-10 text-blue-500" />,
  },
  {
    title: "Java",
    description: "object-oriented language 面向对象编程",
    header: <Skeleton />,
    icon: <FaJava  className="h-10 w-10 text-blue-500" />,
  },
  {
    title: "WeChatApp",
    description: "微信小程序",
    header: <Skeleton />,
    icon: <RiWechatFill  className="h-10 w-10 text-blue-500" />,
  },
  {
    title: "mathematical modeling",
    description: "Classification, prediction, and optimization algorithms 分类、预测和优化算法",
    header: <Skeleton />,
    icon: <TbMathMaxMin className="h-10 w-10 text-blue-500" />,
  },

];
