# p7d-markdown-it-renderer-image

A markdown-it plugin. This add width and height attributes to img elements.

## Use

```js
const fs = require('fs');
const md = require('markdown-it')();
const mdRendererImage = require('@peaceroad/markdown-it-renderer-image');
md.use(mdRendererImage);

const mdPath = '/tmp/markdown.md';
const mdCont = fs.readFileSync(mdPath, 'utf-8');
// ![The cat is sitting nearby.](cat.jpg "The photo taken by k_taka.")

console.log(md.render(mdCont, {'mdPath': mdPath}));
// If /tmp/cat.jpg is exists:
// <p><img src="cat.jpg" alt="The cat is sitting nearby." title="The photo taken by k_taka." width="400" height="300"></p>
```

Or,

```js
const fs = require('fs');
const md = require('markdown-it')();
const mdRendererImage = require('@peaceroad/markdown-it-renderer-image');
md.use(mdRendererImage, {'mdPath': mdPath});

const mdPath = '/tmp/markdown.md';
const mdCont = fs.readFileSync(mdPath, 'utf-8');

console.log(md.render(mdCont));
```

## Option

You can adjust the height and width attributes by using the option `{'scaleSuffix': true}`.

```js
md.use(mdRendererImage, {'scaleSuffix': true});

console.log(md.render('![A cat.](cat@2x.jpg)', {'mdPath': mdPath}));
// <p><img src="cat@2x.jpg" alt="A cat." width="200" height="150"></p>

console.log(md.render('![A cat.](cat_300dpi.jpg)', {'mdPath': mdPath}));
// <p><img src="cat_300dpi.jpg" alt="A cat." width="128" height="96"></p>

console.log(md.render('![A cat.](cat_300ppi.jpg)', {'mdPath': mdPath}));
// <p><img src="cat_300ppi.jpg" alt="A cat." width="128" height="96"></p>
```

This is identified by `imageFileName.match(/[@._-]([0-9]+)(x|dpi|ppi)$/)`

Also, by using `{'lazyLoad': true}`:

```js
md.use(mdRendererImage, {'lazyLoad': true});

console.log(md.render('![A cat.](cat@.jpg)', {'mdPath': mdPath}));
// <p><img src="cat.jpg" alt="A cat." width="400" height="300" loading="lazy"></p>
```
