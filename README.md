# 真的假的.com

按《首页设计与实施要求》和《首页样式规范 v1.0》初始化的本地首页体验版。

## 启动

环境：Node.js 22.x、pnpm 8.15.4。无需 Docker、数据库或 API 密钥。

```powershell
pnpm install
pnpm dev
```

打开 http://localhost:3000 或终端打印的地址。端口占用时 Next.js 会提示新端口。

```powershell
pnpm typecheck
pnpm build
pnpm start
```

`pnpm-lock.yaml` 锁定安装版本；后续安装可使用 `pnpm install --frozen-lockfile`。

## 本轮功能

- 明黄、墨黑、暖白的响应式首页，适配 320px 及以上屏宽。
- 真实多行输入，最多 2,000 字符，Enter 换行、自动增高和字数显示。
- JPEG、PNG、WebP 截图选择与拖放，最多 3 张，每张不超过 10MB；校验格式、大小和解码结果。
- 本地截图预览、移除与重新选择，释放预览对象 URL。
- 示例填入后聚焦输入框；不自动提交。
- 空输入校验；文字、链接或仅图片均可打开提交提示。
- 原生模态弹窗、焦点约束、Escape 关闭、关闭后恢复按钮焦点。
- 键盘焦点、读屏标签、错误提示与减少动态效果支持。

当前未接通检索、OCR、图片鉴伪、模型判断、数据库和后台任务。点击“辨真假”只显示“内容已准备好”的提示，不发送核查请求。截图只保存在当前页面的浏览器内存，刷新页面会清除；不上传、不写入本地存储。

## 结构

```text
src/app/                  页面入口、元数据、统一样式变量
src/components/brand.tsx   文字品牌
src/components/check-home.tsx  首页与输入流程
src/components/image-previews.tsx  本地图片预览
src/components/ready-dialog.tsx    提交提示弹窗
src/components/icons.tsx   统一线性图标
src/lib/check-input.ts     输入限制与示例
docs/                     范围说明与实际验收记录
```

后续真实核查能力应通过服务端接口接入。不要把 API 密钥放进客户端组件或 `NEXT_PUBLIC_*` 变量中，也不要把当前提示替换为模拟核查结果。

原始需求见 [首页实施要求](docs/home-spec.md) 和 [样式规范](docs/style-guide.md)；已完成检查、截图及尚未验证的项目见 [实际验证记录](docs/verification.md)。

## Vercel 部署

仓库：[WhiteYin/true-or-false](https://github.com/WhiteYin/true-or-false)，生产分支为 `master`。

项目已包含 `vercel.json`，指定 Next.js 框架、pnpm 8.15.4 的冻结锁文件安装命令和生产构建命令。Node.js 固定为 22.x；首页无需环境变量即可构建。首次部署时在 Vercel 导入本仓库，根目录选择仓库根目录，输出目录保留框架默认值。

详细导入设置和验证范围见 [Vercel 部署说明](docs/vercel-deployment.md)。
