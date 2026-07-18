---
title: Spring Boot 学习路线复盘
description: 从接口设计、数据持久化到测试，把三个月的后端学习重新整理成一张地图。
date: 2026-07-12
category: 学习记录
categoryKey: study
tags: [Java, Spring Boot]
tone: amber
read: 6 分钟
draft: false
---

这三个月断断续续学习了 Spring Boot。回头看，真正让我形成整体认识的并不是记住多少注解，而是完成了一条从请求到数据的完整链路。

## 从一条请求开始

我先用最小接口理解 Controller、Service 和 Repository 的分工，再逐步加入参数校验、异常处理和日志。

```java
@GetMapping("/notes/{id}")
public NoteDetail getNote(@PathVariable Long id) {
    return noteService.findById(id);
}
```

## 数据持久化

数据库部分重点记录了三个问题：实体边界怎么划分、查询如何避免重复、事务应该放在哪一层。

### 复盘清单

- 接口是否有清晰的输入与输出？
- 失败情况是否返回稳定的错误结构？
- 数据库操作是否处于正确的事务范围？
- 核心逻辑是否能独立测试？

## 下一步

下一阶段会用一个小型项目补齐缓存、鉴权和部署流程，把零散知识连接成真正可维护的应用。
