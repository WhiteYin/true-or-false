# Vercel 部署说明

本文件描述当前首页体验版的部署配置。真实搜索、模型、图片识别、数据库及后台任务尚未接通。

## 仓库与项目设置

在 Vercel 新建或选择项目，通过 Git 导入 [WhiteYin/true-or-false](https://github.com/WhiteYin/true-or-false)。确认以下设置：

| 设置 | 值 |
|---|---|
| Root Directory | 仓库根目录，不选 `src/` |
| Framework Preset | Next.js |
| Production Branch | `master` |
| Node.js Version | 22.x，由 `package.json` 的 `engines.node` 固定 |
| Install Command | `npx --yes pnpm@8.15.4 install --frozen-lockfile` |
| Build Command | `npm run build` |
| Output Directory | 保留 Next.js 默认值，不手动填写 `out` 或 `public` |
| Environment Variables | 当前首页不需要 |

安装和构建命令已写入根目录 `vercel.json`。Vercel 的项目归属、Git 连接、生产分支和域名设置需在对应 Vercel 项目中确认，这些账户设置不由本仓库配置文件创建。

## 配置依据

- `framework: "nextjs"` 使用 Vercel 原生 Next.js 构建流程。当前项目不需要手工 rewrites、旧版 `builds` 或自定义静态输出目录。[官方配置文档](https://vercel.com/docs/project-configuration/vercel-json)
- `package.json` 的 `engines.node` 使用 `22.x`，与已验证的本地 Node.js 主版本一致，避免宽泛的 `>=22` 在云端自动选用更高主版本。[Node.js 版本说明](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
- 安装命令显式指定 pnpm 8.15.4；冻结锁文件用于检查 `package.json` 与 `pnpm-lock.yaml` 是否一致。Vercel 在覆写安装命令时可能选择较老的预装 pnpm，因此不使用不带版本约束的 `pnpm install`。构建通过 `npm run build` 执行现有的 `next build`，不额外安装依赖。[包管理器说明](https://vercel.com/docs/package-managers)
- `.vercelignore` 排除本地依赖、构建产物、测试文件、设计文档和本地环境文件；`.gitignore` 排除 `.vercel/`，避免把本机项目绑定状态提交到 Git。[文件排除说明](https://vercel.com/docs/deployments/vercel-ignore)

## 部署后检查

1. 在 Vercel 构建日志确认 Node.js 22.x、pnpm 8.15.4、依赖安装与 Next.js 构建成功。
2. 打开 Vercel 返回的真实部署地址，确认桌面和手机布局。
3. 验证示例填入、空提交、图片预览、图片移除及提示弹窗。
4. 确认页面仍显示“核查服务尚未接通”，不把首页原型当作已上线的新闻核查服务。

## 本次验证

- 从当前源码准备无现有依赖和构建产物的副本，实际执行配置中的 `npx --yes pnpm@8.15.4 install --frozen-lockfile`，安装成功，锁文件未修改。
- 在上述副本中执行配置中的 `npm run build`，生产构建成功；随后 `npm run typecheck` 通过。
- 下载 Vercel 官方 JSON Schema，按原始字段定义逐项验证本配置实际使用的 5 个顶层字段，全部通过。完整官方 Schema 中未使用的实验性字段存在草案兼容问题，因此此项验证不声称整份远程 Schema 通过校验。
- 上述安装与构建验证运行于本地 Windows 环境；未执行 Vercel 云端构建或域名绑定，也未操作 Vercel 账户中的项目绑定。

仓库配置完成与云端部署成功是两项独立状态。后续在 Vercel 导入仓库后，以该项目的实际构建日志和部署地址为最终部署依据。
