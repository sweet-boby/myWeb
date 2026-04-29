export interface SkillItem {
  title: string
  description: string
  iconName: string
  colSpan?: boolean
}

export const skills: SkillItem[] = [
  { title: 'HTML', description: 'Semantic markup', iconName: 'FaHtml5' },
  { title: 'CSS', description: 'Styling and responsive design', iconName: 'FaCss3' },
  { title: 'JAVASCRIPT', description: 'Web development 网站开发', iconName: 'FaJs' },
  { title: 'TYPESCRIPT', description: 'Type-safe JS', iconName: 'SiTypescript', colSpan: true },
  { title: 'VUE/REACT', description: 'UI framework 前端框架', iconName: 'FaReact' },
  { title: 'NextJS', description: 'full stack framework 全栈框架', iconName: 'RiNextjsFill' },
  { title: 'PYTHON', description: 'Pandas, NumPy, Matplotlib, Seaborn, Scikit-learn, Keras, etc.', iconName: 'FaPython', colSpan: true },
  { title: 'SQL/NoSQL', description: 'Databases 数据库设计', iconName: 'PiFileSqlThin' },
  { title: 'Node.js', description: 'JavaScript runtime environment js运行环境', iconName: 'FaNodeJs' },
  { title: 'Matlab', description: 'Mathematical calculation tool 数学计算工具', iconName: 'PiMathOperationsFill' },
  { title: 'Java', description: 'object-oriented language 面向对象编程', iconName: 'FaJava' },
  { title: 'WeChatApp', description: '微信小程序', iconName: 'RiWechatFill' },
  { title: 'mathematical modeling', description: 'Classification, prediction, and optimization algorithms 分类、预测和优化算法', iconName: 'TbMathMaxMin' },
]
