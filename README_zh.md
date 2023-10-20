# markdown-it-obsidian-imgsize

语言: [English](./README.md) | 中文

为图像元素增加width属性（以及height属性）的markdown-it插件。

根据 [Obsidian的图片大小设置语法](https://help.obsidian.md/Editing+and+formatting/Basic+formatting+syntax#External+images)
，插件将以下内容
```markdown
![A cat|100](cat.jpg)
![A cat|100x200](cat.jpg)
```
转化为
```html
<p><img src="cat.jpg" alt="A cat" width="100px"></p>
<p><img src="cat.jpg" alt="A cat" width="100px" height="200px"></p>
```

更多例子详见[examples.txt](./test/examples.txt)。与插件[markdown-it-renderer-image](https://www.npmjs.com/package/@peaceroad/markdown-it-renderer-image)不同的是，
本插件在处理网络图片时无需联网。

## 安装

```bash
npm i markdown-it-obsidian-imgsize --save
```

## 使用

```js
const md = require('markdown-it')();
const mdImgSizePlg = require('markdown-it-obsidian-imgsize');
md.use(mdImgSizePlg);

const content = '![A cat|100](cat.jpg)';
console.log(md.render(content));
// <p><img src="cat.jpg" alt="A cat" width="100px"></p>
// 更多例子详见 './test/examples.txt'
```

## 相关插件

[markdown-it-renderer-image](https://www.npmjs.com/package/@peaceroad/markdown-it-renderer-image)

[markdown-it-obsidian-images](https://www.npmjs.com/package/markdown-it-obsidian-images)

## 许可证
MIT



