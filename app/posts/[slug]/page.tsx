import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "../../components";
import { posts } from "../../data";

export async function generateStaticParams() { return posts.map(p => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const post = posts.find(p => p.slug === slug); return { title: post?.title ?? "文章", description: post?.description }; }

export default async function PostDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const post = posts.find(p => p.slug === slug); if (!post) notFound();
  const isUnet = post.slug === "unet-notes";
  return <PageShell><main className="article-shell"><Link className="back-link" href="/posts">← 返回文章列表</Link><header className="article-header"><div className="meta"><span>{post.category}</span><time>{post.date}</time><span>{post.read}</span></div><h1>{post.title}</h1><p>{post.description}</p><div className="tag-row">{post.tags.map(tag => <Link key={tag} href={`/posts?tag=${encodeURIComponent(tag)}`}>#{tag}</Link>)}</div></header>
    <div className="article-layout"><aside className="toc"><span className="eyebrow">本页目录</span><a href="#goal">学习目标</a><a href="#structure">关键结构</a><a href="#practice">实践记录</a><a href="#summary">个人总结</a></aside>
      <article className="prose"><p className="lead">{isUnet ? "U-Net 是医学图像分割领域里很难绕开的经典网络。这篇笔记不追求推导所有公式，而是回答：它为什么有效，以及复现时应该关注什么。" : "这是一篇用于展示 Markdown 阅读排版的示例文章。你可以在内容目录中替换为自己的完整记录。"}</p>
        <h2 id="goal">学习目标</h2><p>先建立整体结构感，再理解编码器与解码器之间的信息流动，最后用一个小实验验证自己的理解。</p><blockquote>好的学习笔记不是知识的搬运，而是把陌生内容转化为自己可以再次调用的线索。</blockquote>
        <h2 id="structure">关键结构</h2><p>网络左侧通过卷积与下采样提取语义信息，右侧逐步恢复空间分辨率。最有辨识度的设计，是把编码阶段的特征直接传递到对应的解码阶段。</p>
        <div className="concept-map"><div><b>输入图像</b><small>空间细节</small></div><span>→</span><div><b>编码器</b><small>提取语义</small></div><span>→</span><div><b>解码器</b><small>恢复定位</small></div></div>
        <h3>跳跃连接解决了什么？</h3><ul><li>补回下采样过程中损失的细节。</li><li>融合浅层定位信息和深层语义信息。</li><li>帮助分割边界更加精确。</li></ul>
        <h2 id="practice">实践记录</h2><p>第一次实验先固定随机种子，并保存训练配置。下面是一个最小化的思路示例：</p><pre><code>{`features = encoder(image)\nmask = decoder(features, skip_connections=True)\nloss = dice_loss(mask, target)`}</code></pre>
        <table><thead><tr><th>实验</th><th>输入尺寸</th><th>Dice</th></tr></thead><tbody><tr><td>基础 U-Net</td><td>256 × 256</td><td>0.842</td></tr><tr><td>加入增强</td><td>256 × 256</td><td>0.871</td></tr></tbody></table>
        <h2 id="summary">个人总结</h2><p>真正重要的不是背下网络图，而是理解不同尺度的特征为什么需要再次相遇。下一步会继续比较注意力机制与不同损失函数带来的影响。</p>
      </article></div>
    <nav className="article-nav"><Link href="/posts">← 全部文章</Link><Link href="/posts/spring-boot-review">下一篇：Spring Boot 复盘 →</Link></nav>
  </main></PageShell>;
}
