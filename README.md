# p7d-markdown-it-renderer-image

A markdown-it plugin. This add width and height attributes to img elements.

## Use

```js
const fs = require('fs');
const md = require('markdown-it')();
const mdRendererImage = require('@peaceroad/markdown-it-renderer-image');
md.use(mdRendererImage);

const mdPat = '/tmp/markdown.md';
const mdCont = fs.readFileSync(mdPat, 'utf-8');
// ![The cat is sitting nearby.](cat.jpg "The photo taken by k_taka.")

console.log(md.render(mdCont, {mdPath: mdPat}));
// If /tmp/cat.jpg is exists:
// <p><img src="cat.jpg" alt="The cat is sitting nearby." title="The photo taken by k_taka." width="400" height="300"></p>
```

Or,

```js
const fs = require('fs');
const md = require('markdown-it')();
const mdRendererImage = require('@peaceroad/markdown-it-renderer-image');
const mdPat = '/tmp/markdown.md';
md.use(mdRendererImage, {mdPath: mdPat});
const mdCont = fs.readFileSync(mdPat, 'utf-8');

console.log(md.render(mdCont));
```

## Option

### Setting dpi by filename scale suffix

You can adjust the height and width attributes by using the option `{scaleSuffix: true}`.

```js
md.use(mdRendererImage, {scaleSuffix: true});

console.log(md.render('![A cat.](cat@2x.jpg)', {mdPath: mdPat}));
// <p><img src="cat@2x.jpg" alt="A cat." width="200" height="150"></p>

console.log(md.render('![A cat.](cat_300dpi.jpg)', {mdPath: mdPat}));
// <p><img src="cat_300dpi.jpg" alt="A cat." width="128" height="96"></p>

console.log(md.render('![A cat.](cat_300ppi.jpg)', {mdPath: mdPat}));
// <p><img src="cat_300ppi.jpg" alt="A cat." width="128" height="96"></p>
```

This is identified by `imageFileName.match(/[@._-]([0-9]+)(x|dpi|ppi)$/)`


### Resizing layout image by title attribute

Option to resize based on the value of the title attribute: `{resize: true}`

```js
md.use(mdRendererImage, {resize: true});

console.log(md.render('![A cat.](cat.jpg "Resize:50%")', {mdPath: mdPat}));
// <p><img src="cat.jpg" alt="A cat." width="200" height="150"></p>

console.log(md.render('![A cat.](cat.jpg "リサイズ：50%")', {mdPath: mdPat}));
// <p><img src="cat.jpg" alt="A cat." width="200" height="150"></p>

console.log(md.render('![A cat.](cat.jpg "サイズ変更：50%")', {mdPath: mdPat}));
// <p><img src="cat.jpg" alt="A cat." width="200" height="150"></p>

console.log(md.render('![A cat.](cat.jpg "The photo taken by k_taka. The shown photo have been resized to 50%.")', {mdPath: mdPat}));
// <p><img src="cat.jpg" alt="A cat." title="The photo taken by k_taka. The shown photo have been resized to 50%." width="200" height="150"></p>

console.log(md.render('![Figure](cat.jpg "resize:320px")', {mdPath: mdPat}));
// <p><img src="cat.jpg" alt="Figure" title="resize:320px" width="320" height="240"></p>

console.log(md.render('![Figure](cat@2x.jpg "resize:320px"))', {mdPath: mdPat}));
// <p><img src="cat@2x.jpg" alt="Figure" title="resize:320px" width="320" height="240"></p>
```

This is identified by `imageTitleAttribute.match(/(?:(?:(?:大きさ|サイズ)の?変更|リサイズ|resize(?:d to)?)? *[:：]? *([0-9]+)([%％]|px)|([0-9]+)([%％]|px)に(?:(?:大きさ|サイズ)を?変更|リサイズ))/i)`

If `px` is specified, the numerical value is treated as the width after resizing.

Notice: Other Markdown extended notations may specify a caption in the title attribute. Therefore, think carefully about whether to enable this option.

### Setting lazy load

By using `{lazyLoad: true}`, it can have `loading="lazy"` attribute.

```js
md.use(mdRendererImage, {lazyLoad: true});

console.log(md.render('![A cat.](cat@.jpg)', {mdPath: mdPat}));
// <p><img src="cat.jpg" alt="A cat." width="400" height="300" loading="lazy"></p>
```
