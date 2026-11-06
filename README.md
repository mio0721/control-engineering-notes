# 控制工程学习笔记

这是包含完整讲解、复习笔记、公式手册和交互实验的静态课程网站。目前正式课程共 46 课，按阶段 0～4 保存；阶段 5 暂留作工程实现与综合实验。另有两份旧版实践材料保存在 `archive/courses/`，不参与网站构建。

## 直接使用

解压后，双击根目录的 `index.html` 即可。在 Chrome / Edge 等浏览器中可阅读全部笔记、离线渲染公式、使用响应曲线与极点演示。阅读网页无需安装 Python，也不需要联网。右上角有日间/夜间切换；页面保持原版字号、宽度与左右目录布局。

## 文件布局

```text
Control-Engineering-Notes/
├── index.html                   # 自动生成的总目录，勿手工修改
├── lessons/                     # 自动生成的各课讲解 HTML
├── reviews/                     # 自动生成的各课复习 HTML
├── formulas/                    # 自动生成的各课公式 HTML
├── courses/                     # 唯一课程内容来源
│   ├── stage-0/                 # 01～16：经典控制基础与补桥
│   ├── stage-1/                 # 17～19：数学与模型衔接
│   ├── stage-2/                 # 20～31：现代线性控制核心
│   ├── stage-3/                 # 32～37：非线性控制进阶
│   └── stage-4/                 # 38～46：状态估计与约束控制
│       └── 46-EKF与MPC车辆跟踪综合实验/
│           ├── course.json      # 阶段元数据
│           ├── lesson.md        # 完整讲解
│           ├── review.md        # 精简复习
│           ├── formulas.md      # 公式、参数及单位
│           ├── media/           # 本课图片与附件
│           └── simulation.py    # 仿真（按需提供）
├── archive/courses/             # 两份旧版实践材料，不参与构建
├── docs/                        # 目录索引、课程路线与发布说明
├── assets/
│   ├── style.css                # 全站一致的文档风格
│   ├── theme.js                 # 日夜切换
│   ├── mathjax-tex-svg.js       # 离线公式渲染
│   ├── demo-core.js             # JS 动画注册与共享计算工具
│   └── demos/
│       └── response.js          # 可供任意课程引用的通用演示
├── tools/                       # 构建与维护工具集中保存
│   ├── build.py                 # 自动发现课程及演示，生成网页与导航
│   ├── requirements.txt         # 构建依赖
│   ├── 更新网站.bat              # Windows 一键构建
│   └── 更新网站.sh               # macOS/Linux 构建
└── tests/                       # 扩展能力自动检查
```

**只维护 `courses/` 中的 Markdown 和可选 `demos/` 文件，网页 HTML 由 `build.py` 生成。** 修改首页、左右导航或之前章节的 HTML 都不是新增课程的必要步骤。

完整目录见 [文件夹索引](docs/文件夹索引.md)，课程阶段见 [课程整理说明](docs/课程整理说明.md)。课程源文件按阶段归类，但生成的 `lessons/`、`reviews/`、`formulas/` 网址保持原有形式。

## 新增一课（有无动画都适用）

直接创建下面三个文件：

```text
courses/stage-0/05-新课程/
├── lesson.md
├── review.md
└── formulas.md
```

每个文件第一行是 `# 第 5 课：标题`。可只先建 `lesson.md`，没有的分栏不会出现失效链接。

然后执行：

- Windows：双击 `tools/更新网站.bat`
- macOS / Linux：`bash tools/更新网站.sh`
- 或直接：`python tools/build.py`

构建脚本会扫描全部课程目录，自动排序并更新：首页课程列表、左侧导航、每章三个页签、上一课/下一课、本章目录，并将演示 JS 嵌入需要的 HTML 页面、按需引用演示 CSS。

> 为了确保脱机 `file://` 打开时稳定可用，新建或修改 Markdown 后需要运行一次构建脚本；浏览器自身不会遍历本地文件夹，**无法只复制文件而无需重新构建就自动更新菜单**。

## 在 Markdown 中插入互动演示

第 2 课已有以下实际用法：

```text
:::demo response j=1 kp=16 kd=1
:::
```

构建脚本按此顺序查找同名 JS 模块：

1. `courses/stage-N/本课目录/demos/response.js`（课程专属，优先）
2. `assets/demos/response.js`（全站共享、可复用）

找到后，构建程序会按顺序**将共享引擎与所需 JS 自动嵌入该课程 HTML 底部**，避免本地 `file://` 浏览器对外部脚本的加载/执行顺序产生影响。JS **源文件仍然独立维护**，不必在 Markdown 中粘贴代码。如果模块旁有同名 CSS（例如 `response.css`），也会自动关联。同一演示在同一页用多次，脚本只嵌入一次；不同课程可复用共享模块。

### 新写一个演示模块

假设要创建第 5 课专属的 `pid-tuning`：

1. 在该课新建 `demos/pid-tuning.js`（可选 `demos/pid-tuning.css`）。
2. 在 `lesson.md` 中写：

```text
:::demo pid-tuning kp=16 kd=8
:::
```

3. JS 使用全局注册函数：

```javascript
(function () {
  window.NoteDemos.register('pid-tuning', (node, utils) => {
    // 这里创建输入控件、Canvas / SVG / DOM 动画。
    // node.dataset.kp、node.dataset.kd 可读取 Markdown 中的参数。
    node.textContent = '请在此实现 PID 动画';
  });
})();
```

4. 运行 `python tools/build.py`。无需改 `index.html`、`build.py` 或 `theme.js`。

推荐复杂动画也遵循这个注册接口，构建后演示脚本会自动嵌入生成的 HTML，因而可以通过 `file://` 离线运行。`demo-core.js` 提供 `utils.color(light,dark)`、`utils.canvasReady(canvas)` 等辅助函数；现有 `response.js`、`poles.js` 是可复用的完整例子。动画在切换日夜模式时可以监听 `robot-theme-changed` 事件重绘。

**出错处理**：如果 Markdown 指向的 JS 不存在，构建立即报错；如果浏览器运行时某演示失败，其他课程内容仍可正常阅读。

## 图表、图片、附件与静态动画

每课还可以增加 `media/` 文件夹：

```text
courses/stage-0/05-新课程/
├── lesson.md
└── media/
    ├── structure.svg
    └── explanation.png
```

在 `lesson.md` 里写 `![结构示意](media/structure.svg)`，构建脚本会改写为实际可访问的相对路径。普通 SVG/PNG/GIF 可以直接离线显示。对 Three.js 等复杂 3D 模型，如果依赖浏览器禁止在 `file://` 读取的外部文件请求，应改用内嵌数据或本地 HTTP 服务器；**此版不会声称所有 3D 模型都能直接双击运行**。

## 笔记写作规范

- 详细讲解：背景问题 → 模型假设 → 公式逐步推导 → 实例 → MATLAB/C++ 代码 → 检查题。
- 复习笔记：精简概念、常见错误、两三道自测，不简单复制整节课程。
- 公式手册：公式用途、符号定义、单位、适用条件和易错点。
- 行内公式 `$...$`，独立公式 `$$...$$`；公式里的 `%` 应写成 `\%`。
- 代码使用带语言标识的围栏，例如 ` ```matlab `、` ```cpp `，生成后自动高亮。
- 交互演示只放在帮助理解的位置，不要为动画牺牲内容完整性。

## 构建环境、验证

只在更新网站时需要 Python 3.9+：

```bash
python -m pip install -r tools/requirements.txt
python tools/build.py
python -m unittest discover -s tests -v
```

Python 仅负责编译 Markdown、构建导航和引用模块。浏览器打开生成的 HTML 不依赖这些 Python 包。构建使用 `mistune`、`beautifulsoup4`、`Pygments`；公式渲染库已经打包在 `assets/`。

## V3.1 修复说明

修复了部分本地浏览器中出现的“演示加载失败：模块没有注册”问题：构建时把演示引擎及用到的模块以确定顺序内嵌到 HTML，而不是依赖多个外部 JS 文件在离线模式下的加载顺序。无需改变 `courses/` 文件结构或 `:::demo` 语法。改动模块后运行一次 `build.py` 即可重新嵌入。已通过真实浏览器的内嵌页面交互验证（第 1、2、4 课滑块均可更新结果）。

## 发布为 GitHub Pages

详细步骤见 [发布到GitHub.md](docs/发布到GitHub.md)。本项目已经生成静态HTML，可以直接使用仓库的 `main` 分支根目录发布，无需安装Jekyll。

仓库根目录必须直接包含 `index.html`、`assets/`、`courses/`、`lessons/`、`reviews/`、`formulas/`；不要再套一层课程文件夹。`courses/` 里包含HTML引用的SVG图片和部分样式，发布时必须保留。

仓库中已放入 `.nojekyll`。`Settings → Pages` 选择 `Deploy from a branch`、`main`、`/(root)`，保存后查看部署状态。

### 更新线上内容

1. 修改 `courses/` 下的课程Markdown。
2. 运行 `python tools/build.py` 重新生成HTML。
3. 提交课程源文件、图片、交互代码和生成的HTML，再推送到 `main`。
4. GitHub Pages收到推送后重新部署。

阅读者只需浏览器；Python仅供维护者构建网页使用。所有资源使用相对路径，支持项目仓库的子路径部署和离线阅读。


窄屏导航：宽度不超过1100px时，目录与侧栏内容改为顶部按钮入口。打开面板后只滚动面板内部，锁定背景课程位置；支持触摸、Esc关闭、面板内链接跳转，以及恢复桌面侧栏布局。共同交互实现保存在 `assets/mobile-panels.js` 和 `assets/mobile-panels.css`。
