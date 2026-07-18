import Link from "next/link";
import { PageShell } from "./components";
export default function NotFound() { return <PageShell><main className="not-found shell"><span>404</span><h1>这一页还没有长出来。</h1><p>可能是地址写错了，也可能这篇记录暂时还未公开。</p><div><Link className="button primary" href="/">返回首页</Link><Link className="button ghost" href="/posts">浏览文章</Link></div></main></PageShell>; }
