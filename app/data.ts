export const profile = { name: "你的名字", initials: "YN", role: "计算机专业研究生", direction: "人工智能 · 医学图像 · 后端开发", intro: "把学习、研究和生活里的微小进步，认真地留在这里。" };

export const posts = [
  { slug: "unet-notes", title: "读懂 U-Net：从结构到跳跃连接", description: "梳理经典医学图像分割网络的基本结构，以及第一次复现时踩过的坑。", date: "2026-07-18", category: "研究生生活", categoryKey: "graduate", tags: ["论文阅读", "医学图像分割"], tone: "sage", read: "8 分钟" },
  { slug: "spring-boot-review", title: "Spring Boot 学习路线复盘", description: "从接口设计、数据持久化到测试，把三个月的后端学习重新整理成一张地图。", date: "2026-07-12", category: "学习记录", categoryKey: "study", tags: ["Java", "Spring Boot"], tone: "amber", read: "6 分钟" },
  { slug: "july-campus", title: "七月的校园与一些慢思考", description: "雨后的操场、晚归的实验室，以及给忙碌生活留一点空白。", date: "2026-07-06", category: "日常记录", categoryKey: "life", tags: ["校园生活", "随笔"], tone: "blue", read: "4 分钟" },
  { slug: "game-journey", title: "《远旅》通关后的情绪地图", description: "一次关于探索、选择与告别的游戏体验记录。", date: "2026-06-28", category: "游戏记录", categoryKey: "games", tags: ["游戏体验", "独立游戏"], tone: "violet", read: "5 分钟" },
];

export const projects = [
  { slug: "growth-journal", title: "个人成长记录站", description: "一个以 Markdown 为核心、低维护成本的个人数字花园。", status: "进行中", stack: ["Next.js", "Markdown", "Cloudflare"], year: "2026", tone: "sage" },
  { slug: "med-seg-lab", title: "医学图像分割实验台", description: "集中管理数据预处理、训练配置与实验结论的小工具。", status: "进行中", stack: ["Python", "PyTorch", "U-Net"], year: "2026", tone: "blue" },
  { slug: "study-map", title: "研究生学习地图", description: "把课程、论文与技能目标串联起来的可视化知识索引。", status: "已完成", stack: ["TypeScript", "Canvas"], year: "2025", tone: "amber" },
];

export const resources = [
  { title: "论文阅读笔记模板", description: "适合计算机与医学影像方向的结构化阅读模板。", category: "学习资料", type: "MD", size: "4 KB", updated: "2026-07-15" },
  { title: "研究生月度复盘清单", description: "从研究进展、技能成长到生活状态的月度检查表。", category: "效率工具", type: "PDF", size: "128 KB", updated: "2026-07-10" },
  { title: "Spring Boot 路线图", description: "个人整理的后端学习主题与实践项目建议。", category: "学习资料", type: "PDF", size: "356 KB", updated: "2026-06-30" },
];
