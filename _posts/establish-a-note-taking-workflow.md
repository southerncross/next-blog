---
title: '建立ZK笔记工作流'
date: '2024-04-14T23:46:00+08:00'
---

这一篇我们来聊聊ZK笔记法的基础：笔记工作流。

## 三个盒子

ZK笔记法，也就是卡片盒笔记法，是通过若干个盒子实现笔记工作流的。

一共有三个盒子：`Inbox`、`Slip box`和`Out box`。

**Inbox里记录的是零散的想法**。任何时候当你想到什么有意思的东西，都可以在这里面新增一条笔记。笔记的内容和格式没有任何要求，甚至只有一句话或者一个标题都可以（只要你自己能看懂）。Inbox这里的笔记也被称作是“闪念笔记”（Fleeting notes）。

![inbox](/assets/posts/inbox.svg)

**Inbox中的笔记经过加工整理归档到Slip box**。这个加工整理的过程，就好像是反刍动作。你可能会删掉没用的笔记，或者将几篇内容相似的笔记合并成一个，或者给笔记补充更多内容。Slip box中的笔记也被称作“永久笔记”（Permanent notes）。

![slip box](/assets/posts/slipbox.svg)

**对外输出的内容并保存在Out box**。Inbox和Slip box是对内的，而Out box中保存的是需要对外输出的内容，比如写一篇博客、文档、等等。这里不是要把笔记从Slip box中转移到Out box，而是把Slip box中的笔记当成参考资料，产出一篇新的笔记并放在Out box中。Out box中的笔记也被称作“项目笔记”（Project notes）。

![out box](/assets/posts/outbox.svg)

汇总起来就是这样：

![zk workflow](/assets/posts/zk-workflow.svg)

## 配置Obsidian

可以在Obsidian中建立三个目录，代表这三个盒子，就像这样（前面的数字是为了方便排序）：

![Three boxes](/assets/posts/obsidian-three-boxes.webp)

然后去Obsidian的配置中将Inbox目录设置为笔记默认创建的位置：

![Default notes folder](/assets/posts/obsidian-notes-default-folder.webp)

接下来可以安装一个叫“Templater”的社区插件（其实Obsidian原生也自带模板功能，但功能比较有限）。安装完成后别忘了enable：

![Templater plugin](/assets/posts/obsidian-templater.webp)

为了方便管理，我们可以专门新建一个目录用来保管模板文件：

![Inbox notes template](/assets/posts/obsidian-inbox-note-template.webp)

模板文件的内容如下：

```markdown
---
tags:
---

<% await tp.file.rename(tp.date.now("MM-DD HHmmss "))%>
```

其中`<%`和`%>`之间的部分是一段js代码，效果是给文件名添加日期前缀。

然后去Templater插件完成剩余的配置，如下图所示：

![Templater configuration](/assets/posts/obsidian-templater-config-1.webp)

![Templater configuration](/assets/posts/obsidian-templater-config-2.webp)

做完上面的配置，使用快捷键`ctrl`+`n`或者`meta`+`n`即可将笔记自动创建在Inbox目录下面，并且给文件名称添加日期前缀（方便后续整理笔记的时候按照时间队列排序）：

![Inbox demo](/assets/posts/obsidian-inbox-demo.webp)

如果想在笔记中插入图片，也非常简单。建议单独创建一个目录用来保存图片之类的附件：

![Assets folder](/assets/posts/20240414211605830.webp)

然后在Obsidian中将其设置为默认的附件目录：

![Obsidian config](/assets/posts/20240414211720478.webp)

这样如果想插入图片，直接复制粘贴即可，图片会自动保存在刚才设置的目录下（在Obsidian中重命名图片会自动更新对应的笔记）。

这里顺便推荐安装一款叫“Image Converter”的插件，可以自动将插入的图片转换为webp格式，减小图片体积。

![Image Converter](/assets/posts/20240414212506864.webp)

## 定期整理

形成笔记工作流的最后一步，而且也是至关重要的一步，就是形成定期整理笔记的习惯。

很多人在实践ZK笔记法犯的毛病就是Inbox里记了一堆，但是很少往Slip box中整理。这很正常，因为通常我们都是按照优先级顺序去做事，先做高优先级的，后做低优先级的，整理笔记对于大多数人来说就属于低优先级的那一类。但在ZK笔记法中，**整理笔记是特别重要的一个动作**。如果没有整理笔记，相当于流程就没有跑起来。

举个自己的例子，刚开始我是每周日的固定时间整理当周的Inbox笔记。但是执行了两次感觉很煎熬，因为数量太多了，一次要整理好几十篇笔记，往往要花费好几个小时。后来我调整了一下策略，把整理笔记分散在了每天的各个时间段，利用空闲零散的时间少量多次地整理。比如连续工作一段时间，暂停休息一下，整理一篇笔记，换换脑子。或者利用吃饭后休息的时间整理上几篇笔记。基本上能够保证整理笔记的速度跟得上新增的速度。

你也可以调整自己的策略，找到适合自己的整理节奏。切记一定要养成定期整理笔记的习惯。

## 总结

以上就是关于建立“笔记法工作流”的基本介绍。

- 笔记工作流的核心是三个盒子：Inbox、Slip box、Out box，分别对应笔记的流转阶段。
- 可以对Obsidian做一些简单配置让笔记自动创建到Inbox中。
- 一定要养成定期整理笔记的习惯。

至于如何整理笔记，怎么给笔记打tag，怎么创建笔记间的链接，之后再分享吧。
