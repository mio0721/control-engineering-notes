"""离线知识网站生成器 V3。

纯文件扫描: courses/<编号-名称>/{lesson,review,formulas}.md
可选课程专属交互: courses/<编号-名称>/demos/<名称>.js[.css]
可复用的通用交互: assets/demos/<名称>.js[.css]

在 Markdown 里引用：
:::demo response j=1 kp=16 kd=8
:::

无需修改本文件或 index.html；运行 python build.py 即可刷新全部导航。
"""
from __future__ import annotations
from dataclasses import dataclass
from pathlib import Path
from html import escape
import os
import re
import shlex
import json
from bs4 import BeautifulSoup, NavigableString
import mistune
from pygments import highlight
from pygments.formatters import HtmlFormatter
from pygments.lexers import get_lexer_by_name, TextLexer

ROOT = Path(__file__).resolve().parent
COURSES_DIR = ROOT / 'courses'
SECTIONS = (
    ('lesson', 'lessons', '课程讲解', '完整讲解'),
    ('review', 'reviews', '复习笔记', '精简复习'),
    ('formulas', 'formulas', '公式手册', '参数解释'),
)
MD = mistune.create_markdown(escape=False, plugins=['table', 'strikethrough'])
DEMO_START = re.compile(r'^:::demo\s+([a-zA-Z][\w-]*)([^\n]*)\n:::\s*$', re.M)
MATH_RE = re.compile(r'\$\$[\s\S]*?\$\$|(?<!\$)\$(?!\$)[^\n$]+\$(?!\$)')

@dataclass(frozen=True)
class Course:
    slug: str
    title: str
    number: int | None
    goal: str
    folder: Path
    available: tuple[str, ...]
    @property
    def number_text(self) -> str:
        return f'第 {self.number} 课' if self.number is not None else self.slug

def order(folder: Path) -> tuple[int, str]:
    prefix = folder.name.split('-', 1)[0]
    return (int(prefix) if prefix.isdigit() else 9999, folder.name)

def discover_courses() -> list[Course]:
    result=[]
    if not COURSES_DIR.is_dir():
        raise FileNotFoundError('courses/ 不存在')
    for directory in sorted((p for p in COURSES_DIR.iterdir() if p.is_dir() and not p.name.startswith('.')),key=order):
        available=tuple(section for section,*_ in SECTIONS if (directory/(section+'.md')).is_file())
        if not available:
            continue
        slug=directory.name
        n=slug.split('-',1)[0]
        number=int(n) if n.isdigit() else None
        fallback=slug.split('-',1)[-1]
        main=(directory/'lesson.md') if 'lesson' in available else directory/(available[0]+'.md')
        raw=main.read_text(encoding='utf-8')
        heading=next((line.lstrip('#').strip() for line in raw.splitlines() if line.startswith('# ')),fallback)
        title=re.sub(r'^第\s*\d+\s*课\s*[：:·-]\s*','',heading).strip() or fallback
        goal=next((line.lstrip('> ').strip() for line in raw.splitlines() if line.startswith('> ')), '课程笔记')
        result.append(Course(slug,title,number,goal,directory,available))
    if not result:
        raise ValueError('courses/ 中没有任何课程 Markdown 文件')
    return result

def rel(page: Path, target: Path) -> str:
    return os.path.relpath(target, page.parent).replace('\\', '/')

def output_path(course: Course, section: str) -> Path:
    return ROOT / next(webdir for name,webdir,*_ in SECTIONS if name==section) / f'{course.slug}.html'


# Source folders and visible lesson headings use the same consecutive numbering.
# Explicit phase metadata keeps grouping independent from future added lessons.
PHASES = (
    ('stage0', '阶段 0｜经典控制基础与补桥', '第 1–16 课：反馈、PID、稳定性与频域设计'),
    ('stage1', '阶段 1｜数学与模型衔接', '第 17–19 课：矩阵、特征值、传递函数与状态空间'),
    ('stage2', '阶段 2｜现代线性控制核心', '第 20–31 课：状态响应、反馈、LQR、估计与离散综合'),
    ('stage3', '阶段 3｜非线性控制进阶', '后续计划：Lyapunov、LaSalle 与非线性控制'),
    ('stage4', '阶段 4｜机器人与车辆实践', '控制器综合设计、MATLAB 与 C++ 实现'),
)
def phase_key(course: Course) -> str:
    metadata=course.folder/'course.json'
    if metadata.is_file():
        phase=json.loads(metadata.read_text(encoding='utf8'))['phase']
        if phase not in {key for key,_,_ in PHASES}:
            raise ValueError(f'{metadata}: 未知阶段 {phase}')
        return phase
    return 'stage0'

def validate_math(markdown: str, path: Path) -> None:
    for expr in MATH_RE.findall(markdown):
        if re.search(r'(?<!\\)%',expr):
            raise ValueError(f'{path}: LaTeX 里的百分号必须写成 \\%')
        cleaned=re.sub(r'\\[{}]','',expr)
        if cleaned.count('{')!=cleaned.count('}'):
            raise ValueError(f'{path}: 检测到数学公式花括号不匹配')

def locate_demo(course: Course, name: str) -> Path:
    candidates=(course.folder/'demos'/f'{name}.js',ROOT/'assets'/'demos'/f'{name}.js')
    for candidate in candidates:
        if candidate.is_file():return candidate
    raise FileNotFoundError(f'演示 {name!r} 没有对应的 JS 文件。需创建 {candidates[0]} 或 {candidates[1]}')

def protect(markdown: str,course: Course, source: Path):
    """保护 MathJax 和 demo 占位符，避免 Markdown 破坏反斜杠和特殊标记。"""
    validate_math(markdown,source)
    math=[]
    def save_math(match):
        token=f'MATHTOKENZX{len(math)}ZX'
        math.append(match.group(0));return token
    text=MATH_RE.sub(save_math,markdown)
    demos=[]
    def save_demo(match):
        name=match.group(1)
        raw_args=match.group(2)
        attrs={}
        try: pieces=shlex.split(raw_args)
        except ValueError as err:raise ValueError(f'{source}: 演示参数无效：{err}') from err
        for item in pieces:
            if '=' not in item:raise ValueError(f'{source}: 演示参数必须采用 key=value: {item}')
            key,value=item.split('=',1)
            if not re.fullmatch(r'[a-z][\w-]*',key) or key in {'demo','class','style'}:
                raise ValueError(f'{source}: 非法演示参数名: {key}')
            attrs[key]=value
        script=locate_demo(course,name)
        # HTML 转义，data-demo 和 data-* 允许页面按模块加载。
        attr_text=' '.join(f'data-{escape(k,quote=True)}="{escape(v,quote=True)}"' for k,v in attrs.items())
        node=f'<div class="demo" data-demo="{name}" {attr_text}><p class="demo-note">此演示需要 JavaScript。若没有显示，请检查浏览器设置。</p></div>'
        token=f'DEMOTOKENZX{len(demos)}ZX'
        demos.append((token,node,script))
        return '\n\n'+token+'\n\n'
    text=DEMO_START.sub(save_demo,text)
    return text,math,demos

def render_markdown(raw: str,course: Course,source: Path):
    protected,math,demos=protect(raw,course,source)
    soup=BeautifulSoup(MD(protected),'html.parser')
    replacements={f'MATHTOKENZX{i}ZX':formula for i,formula in enumerate(math)}
    replacements.update({token:node for token,node,_ in demos})
    for fragment in list(soup.find_all(string=lambda s: any(t in str(s) for t in replacements))):
        segment=str(fragment)
        for token,text in replacements.items():segment=segment.replace(token,text)
        replacement=BeautifulSoup(segment,'html.parser')
        # 一整段只有演示标记时，把外层 <p> 换成块级 <div>，避免无效 HTML 嵌套。
        if str(fragment).strip() in {token for token,_,_ in demos} and fragment.parent.name=='p' and fragment.parent.get_text(strip=True)==str(fragment).strip():
            fragment.parent.replace_with(replacement)
        else:
            fragment.replace_with(replacement)
    for pre in list(soup.find_all('pre')):
        code=pre.find('code')
        if code is None:continue
        language=next((item[9:] for item in code.get('class',[]) if item.startswith('language-')),'text')
        if language.lower() not in {'matlab','python','cpp','c++','javascript','js','bash','shell','json','html','css'}:
            continue
        try: lexer=get_lexer_by_name(language,stripall=False)
        except Exception: lexer=TextLexer()
        colored=highlight(code.get_text(),lexer,HtmlFormatter(nowrap=True)).rstrip('\n')
        panel=BeautifulSoup(f'<div class="code-panel"><div class="code-label">{escape(language.upper())}</div><pre class="code-highlight"><code>{colored}</code></pre></div>','html.parser')
        pre.replace_with(panel)
    for anchor in soup.find_all('a'):
        href=anchor.get('href','')
        if href.lower().startswith(('javascript:','data:')):
            del anchor['href']
    # 各课图像/附件存放在 courses/<slug>/media/，生成 HTML 时自动改相对路径。
    # 只有确实存在的本地文件会被改写；公式、锚点、远程 URL 保持不变。
    for tag,attr in [('img','src'),('video','poster'),('source','src'),('a','href')]:
        for element in soup.find_all(tag):
            path=element.get(attr,'')
            if not path or path.startswith(('#','/','\\')) or re.match(r'^[a-zA-Z][a-zA-Z0-9+.-]*:',path):
                continue
            if '..' in Path(path).parts:continue
            local=course.folder/path
            if local.is_file():
                element[attr]=str(local.resolve())  # shell 层再转换成相对路径
    toc=[]
    for i,heading in enumerate(soup.find_all(['h2','h3']),1):
        heading['id']=f'section-{i}'
        toc.append((heading['id'],heading.get_text(' ',strip=True),heading.name))
    scripts=[]
    seen=set()
    for _,_,script in demos:
        if script not in seen:scripts.append(script);seen.add(script)
    return str(soup),toc,scripts

def generate_shell(page:Path,title:str,crumb:str,body:str,toc:list,course:Course|None,section:str|None,scripts:list[Path],courses:list[Course])->str:
    stylesheet=rel(page,ROOT/'assets/style.css')
    theme_script=rel(page,ROOT/'assets/theme.js')
    math_script=rel(page,ROOT/'assets/mathjax-tex-svg.js')
    demo_core=rel(page,ROOT/'assets/demo-core.js')
    section_titles={"lesson":"讲解","review":"复习","formulas":"公式"}
    nav=[f'<a class="nav-home" href="{rel(page,ROOT/"index.html")}">首页 · 课程目录</a>',
         '<div class="group-label">按学习阶段浏览</div>']
    grouped={key:[item for item in courses if phase_key(item)==key] for key,_,_ in PHASES}
    for key,phase_title,phase_note in PHASES:
        items=grouped[key]
        phase_open=any(item==course for item in items)
        nav.append(f'<details class="nav-phase"{" open" if phase_open else ""}>'
                   f'<summary><span class="phase-title">{escape(phase_title)}</span>'
                   f'<small>{escape(phase_note)}</small></summary>')
        if not items:
            nav.append('<div class="phase-coming">该阶段课程将在学习进度推进后加入。</div>')
        for item in items:
            open_attr=' open' if course==item else ''
            nav.append(f'<details class="nav-course"{open_attr}>'
                       f'<summary><span class="course-number">{escape(item.number_text)}</span>'
                       f'<span class="course-title">{escape(item.title)}</span></summary>'
                       f'<div class="nav-course-links">')
            for typ,_,label,_ in SECTIONS:
                if typ in item.available:
                    css='active' if course==item and section==typ else ''
                    short_label=section_titles.get(typ,label)
                    nav.append(f'<a class="{css}" href="{rel(page,output_path(item,typ))}">{short_label}</a>')
            nav.append('</div></details>')
        nav.append('</details>')
    nav_html=''.join(nav)
    if course:
        tabs=''.join(f'<a class="{"active" if typ==section else ""}" href="{rel(page,output_path(course,typ))}">{label}</a>' for typ,_,label,_ in SECTIONS if typ in course.available)
        tabs=f'<div class="chapter-tabs">{tabs}</div>'
        index=courses.index(course)
        older=next((item for item in reversed(courses[:index]) if section in item.available),None)
        newer=next((item for item in courses[index+1:] if section in item.available),None)
        footer=''.join((f'<a href="{rel(page,output_path(item,section))}">{text}</a>' for item,text in ((older,'← 上一课'),(newer,'下一课 →')) if item))
    else:
        tabs=''
        first=next((item for item in courses if 'lesson' in item.available),None)
        footer=f'<a href="{rel(page,output_path(first,"lesson"))}">开始阶段 0 →</a>' if first else ''
    toc_html=''.join(f'<a class="{tag}" href="#{hid}">{escape(text)}</a>' for hid,text,tag in toc)
    if not toc_html:toc_html='<span class="empty-toc">本页暂无章节目录</span>'
    # 仅在有演示的课程里，在文档末尾按严格顺序将 JS 源文件内联到 HTML。
    # 这能避免 file:// 场景里依赖多份本地脚本请求或 defer 执行顺序。
    # 源文件仍然独立维护；新增/修改模块只需重跑 build.py。
    def inline_js(file: Path) -> str:
        source=file.read_text(encoding='utf8')
        # 防止 JS 源中的字符串意外闭合 HTML script 标签。
        return source.replace('</script', '<\\/script').replace('</SCRIPT', '<\\/SCRIPT')
    if scripts:
        blocks=[ROOT/'assets/demo-core.js', *scripts]
        demo_includes='\n'.join(f'<script data-demo-module="{escape(src.stem,quote=True)}">\n{inline_js(src)}\n</script>' for src in blocks)
    else:
        demo_includes=''
    demo_css=''.join(f'<link rel="stylesheet" href="{rel(page,p.with_suffix(".css"))}">' for p in scripts if p.with_suffix('.css').is_file())
    return f'''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark">
<title>{escape(title)}｜机器人控制理论笔记</title>
<script>try{{document.documentElement.dataset.theme=localStorage.getItem('robot-note-theme')||'light'}}catch(e){{document.documentElement.dataset.theme='light'}}</script>
<link rel="stylesheet" href="{stylesheet}">{demo_css}
<script>window.MathJax={{tex:{{inlineMath:[['$','$']],displayMath:[['$$','$$']],processEscapes:true,packages:{{'[+]':['base','ams']}}}},svg:{{fontCache:'local'}},options:{{skipHtmlTags:['script','noscript','style','textarea','pre','code']}}}};</script>
<script defer src="{math_script}"></script><script defer src="{theme_script}"></script>
</head><body>
<header class="mast"><div class="mast-inner"><a class="brand" href="{rel(page,ROOT/'index.html')}">机器人控制理论笔记 <small>持续更新 · 离线 HTML</small></a><div class="top-actions"><span class="top-indicator">已整理 {sum('lesson' in x.available for x in courses)} 课</span><button id="themeToggle" type="button" class="theme-toggle" aria-label="切换日间与夜间模式" aria-pressed="false"><span class="theme-icon" aria-hidden="true">☾</span><span class="theme-label">夜间模式</span></button></div></div></header>
<div class="layout">
<aside class="toc" aria-label="本章目录"><div class="toc-label">本章目录</div>{toc_html}</aside>
<main class="main" id="content"><div class="eyebrow">{escape(crumb)}</div>{tabs}<article class="prose">{body}</article><div class="page-footer">{footer}</div></main>
<nav class="sidebar" aria-label="课程总目录"><div class="sidebar-title">课程总目录</div>{nav_html}</nav>
</div>{demo_includes}</body></html>'''

def make_index(courses:list[Course]):
    page=ROOT/'index.html'
    cards=[]
    for course in courses:
        links=''.join(f'<a href="{rel(page,output_path(course,typ))}">{label} →</a>' for typ,_,label,_ in SECTIONS if typ in course.available)
        cards.append(f'<div class="course-row"><div><span class="chapter-index">{escape(course.number_text)}</span><h3>{escape(course.title)}</h3><p>{escape(course.goal)}</p></div><div class="course-links">{links}</div></div>')
    body='<h1>控制工程 · 总课程路线</h1><p>阶段 0、1、2 已整理；阶段 3 为后续非线性进阶计划，阶段 4 保留机器人与车辆实践材料。网页存在不表示已经学完。</p>'
    body+='<div class="banner"><strong>按阶段顺序学习</strong><p>经典控制 → 数学衔接 → 现代线性控制 → 非线性进阶 → 机器人与车辆实践。左侧阶段可折叠；页底上一课、下一课按此路线前进。课号按学习顺序连续排列。</p></div>'
    body+='<h2 id="course-index">分阶段课程目录</h2>'
    for key,title,note in PHASES:
        items=[(c,card) for c,card in zip(courses,cards) if phase_key(c)==key]
        body+=f'<section><h3>{escape(title)}</h3><p>{escape(note)}</p><div class="course-list">'+''.join(card for c,card in items)+'</div>'
        if not items: body+='<p>规划中：完成前置学习后继续补充。</p>'
        body+='</section>'
    body+='<h2 id="usage">使用方式</h2><ol><li>按顺序阅读完整讲解，结合 MATLAB 程序和交互演示理解公式。</li><li>用每课的复习笔记回顾核心知识。</li><li>通过独立公式手册查询参数定义、单位与适用条件。</li></ol>'
    toc=[('course-index','课程列表','h2'),('usage','使用方式','h2')]
    page.write_text(generate_shell(page,'课程总目录','课程总目录',body,toc,None,None,[],courses),encoding='utf8')


def clean_stale(courses:list[Course]):
    expected={output_path(item,typ) for item in courses for typ in item.available}
    for _,webdir,_,_ in SECTIONS:
        folder=ROOT/webdir
        folder.mkdir(exist_ok=True)
        for html in folder.glob('*.html'):
            if html not in expected:html.unlink()

def main():
    courses=discover_courses()
    clean_stale(courses)
    n=0;demos=set()
    for course in courses:
        for section,_,label,_ in SECTIONS:
            if section not in course.available:continue
            src=course.folder/(section+'.md')
            out=output_path(course,section)
            text,toc,scripts=render_markdown(src.read_text(encoding='utf8'),course,src)
            # 将内容中使用的本地课程资源统一转换为目标页面可访问的相对 URL。
            course_prefix=str(course.folder.resolve()) + os.sep
            text=re.sub(r'(?P<q>["\'])(?P<p>'+re.escape(course_prefix)+r'[^"\']+)(?P=q)',
                        lambda m: m.group('q')+rel(out,Path(m.group('p')))+m.group('q'), text)
            doc=generate_shell(out,f'{course.number_text} · {course.title} · {label}',f'{course.number_text} / {label}',text,toc,course,section,scripts,courses)
            out.parent.mkdir(parents=True,exist_ok=True)
            out.write_text(doc,encoding='utf8')
            n+=1;demos.update(scripts)
    make_index(courses)
    print(f'构建成功：{len(courses)} 课，{n+1} 个 HTML 页面，{len(demos)} 个独立演示模块。')

if __name__=='__main__':main()
