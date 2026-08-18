/**
 * 个人博客统一配置
 * 修改这里的文字后，首页、导航、关于页、页脚和分享信息会同步更新。
 */
export const siteConfig = {
  // 网站基础信息
  siteName: "Yang's Blog",
  siteUrl: "https://y0ung031225.github.io",
  basePath: "/yang-blog",
  language: "zh-CN",
  heroTitle: "Welcome to Yang's Blog",
  description:
    "A personal technical blog about AI, deep learning, backend development and graduate research.",
  shortDescription: "AI · Deep Learning · Backend",
  footerText: "Built for learning, research and code.",
  launchedAt: "2026-07-18",

  // 个人信息
  ownerName: "Yang",
  initials: "Y",
  role: "计算机专业研究生",
  direction: "人工智能 · 后端开发",
  intro: "把学习、研究和生活里的微小进步，认真地留在这里。",
  aboutIntro:
    "一名正在摸索研究方向的计算机专业研究生。喜欢把复杂问题慢慢拆开，也愿意记录那些暂时没有答案的时刻。",
  currentFocus:
    "目前关注人工智能方向，同时持续补齐 Java 后端开发和工程实践能力。我希望自己既能理解模型，也能把想法做成真正可用的产品。",
  nextGoal:
    "完成一个扎实的研究课题，建立稳定的阅读与输出习惯，并让这个网站忠实记录一路上的变化。",

  // 头像放入 public 文件夹后填写，例如 "/avatar.jpg"；留空则不显示
  avatar: "/touxiang.png",

  // 联系方式留空时不会显示
  contact: {
    email: "2130228174@qq.com",
    github: "https://github.com/Y0unG031225",
    bilibili: "",
  },

  education: [
    {
      period: "2026 — 至今",
      title: "计算机相关专业 · 硕士研究生",
      detail: "研究方向探索、论文阅读与实验实践",
    },
    {
      period: "2022 — 2026",
      title: "本科阶段",
      detail: "软件开发基础、算法与项目实践",
    },
  ],

  interests: ["📚 深度阅读", "🎮 独立游戏", "📷 校园与旅行", "☕ 安静地写代码"],
} as const;
