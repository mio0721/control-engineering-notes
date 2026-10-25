"""自动化回归：模拟新增课程、引用专属/共享演示、图片、缺失资源。"""
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from shutil import copy2

BASE=Path(__file__).resolve().parents[1]

class SiteBuildTest(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root=Path(self.tmp.name)
        copy2(BASE/'build.py',self.root/'build.py')
        (self.root/'courses'/'01-示例').mkdir(parents=True)
        (self.root/'assets'/'demos').mkdir(parents=True)
        copy2(BASE/'assets'/'demo-core.js',self.root/'assets'/'demo-core.js')
        (self.root/'assets'/'demos'/'shared.js').write_text("window.NoteDemos.register('shared',()=>{});",encoding='utf8')
        (self.root/'courses'/'01-示例'/'lesson.md').write_text('# 第 1 课：示例\n\n## 开始\n\n公式：$e=q_d-q$\n',encoding='utf8')
    def build(self,expected_success=True):
        r=subprocess.run([sys.executable,str(self.root/'build.py')],capture_output=True,text=True,cwd=self.root)
        if expected_success and r.returncode!=0:self.fail(r.stderr)
        return r
    def test_basic_nav_and_partial_sections(self):
        self.build()
        self.assertTrue((self.root/'index.html').exists())
        self.assertTrue((self.root/'lessons'/'01-示例.html').exists())
        self.assertFalse((self.root/'reviews'/'01-示例.html').exists())
        index=(self.root/'index.html').read_text(encoding='utf8')
        self.assertIn('第 1 课',index)
        self.assertNotIn('reviews/01-示例.html',index)
    def test_course_auto_discovery_with_local_and_shared_modules(self):
        second=self.root/'courses'/'05-新课程'
        (second/'demos').mkdir(parents=True)
        (second/'media').mkdir()
        (second/'demos'/'local.js').write_text("window.NoteDemos.register('local',()=>{});",encoding='utf8')
        (second/'demos'/'local.css').write_text('.demo { border-radius: 2px; }',encoding='utf8')
        (second/'media'/'figure.svg').write_text('<svg/>',encoding='utf8')
        (second/'lesson.md').write_text('# 第 5 课：新课程\n\n## 示例\n\n![图](media/figure.svg)\n\n:::demo local x=3\n:::\n\n:::demo shared y=2\n:::\n',encoding='utf8')
        (second/'review.md').write_text('# 第 5 课：复习\n\n测试',encoding='utf8')
        (second/'formulas.md').write_text('# 第 5 课：公式\n\n$\\alpha=1$',encoding='utf8')
        self.build()
        index=(self.root/'index.html').read_text(encoding='utf8')
        self.assertIn('第 5 课',index)
        html=(self.root/'lessons'/'05-新课程.html').read_text(encoding='utf8')
        self.assertIn('data-demo-module="local"',html)
        self.assertIn('data-demo-module="shared"',html)
        self.assertIn('../courses/05-新课程/demos/local.css',html)
        self.assertIn('../courses/05-新课程/media/figure.svg',html)
        self.assertNotIn('<p><div class="demo"',html)
        self.assertIn('data-x="3"',html)
        self.assertTrue((self.root/'reviews'/'05-新课程.html').exists())
        self.assertIn('下一课', (self.root/'lessons'/'01-示例.html').read_text(encoding='utf8'))
    def test_missing_demo_fails_instead_of_silent_broken_page(self):
        (self.root/'courses'/'01-示例'/'lesson.md').write_text('# 测试\n\n:::demo missing\n:::\n',encoding='utf8')
        result=self.build(expected_success=False)
        self.assertNotEqual(result.returncode,0)
        self.assertIn('missing',result.stderr)
    def test_math_latex_percent_check(self):
        (self.root/'courses'/'01-示例'/'lesson.md').write_text('# 测试\n\n$100%$\n',encoding='utf8')
        result=self.build(expected_success=False)
        self.assertNotEqual(result.returncode,0)
        self.assertIn('百分号',result.stderr)
    def test_shared_demo_loaded_once_when_repeated(self):
        (self.root/'courses'/'01-示例'/'lesson.md').write_text('# 测试\n\n:::demo shared x=1\n:::\n\n:::demo shared x=2\n:::\n',encoding='utf8')
        self.build()
        html=(self.root/'lessons'/'01-示例.html').read_text(encoding='utf8')
        self.assertEqual(html.count('data-demo-module="shared"'),1)
        self.assertEqual(html.count('data-demo="shared"'),2)

if __name__=='__main__':unittest.main()
