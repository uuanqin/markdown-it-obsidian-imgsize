# p7d-markdown-it-renderer-image

A markdown-it plugin. This add width and height attributes to img elements.

## Use

```js
const md = require('markdown-it')();
const mdRendererImage = require('@peaceroad/markdown-it-renderer-image');
md.use(mdRendererImage);
const str = '![The cat is sitting nearby.](cat.jpg "The photo taken by k_taka.")';

console.lor(md.render(str));
// <p><img src="cat.jpg" alt="The cat is sitting nearby." title="The photo taken by k_taka." width="400" height="300"></p>
```

You can adjust the height and width attributes by using the option `{'scaleSuffix': true}`.

```js
const md = require('markdown-it')();
const mdRendererImage = require('@peaceroad/markdown-it-renderer-image');
md.use(mdRendererImage, {'scaleSuffix': true});

console.lor(md.render('![A cat.](cat@2x.jpg)'));
// <p><img src="cat@2x.jpg" alt="A cat." width="200" height="150"></p>

console.lor(md.render('![A cat.](cat_300dpi.jpg)'));
// <p><img src="cat_300dpi.jpg" alt="A cat." width="128" height="96"></p>

console.lor(md.render('![A cat.](cat_300ppi.jpg)'));
// <p><img src="cat_300ppi.jpg" alt="A cat." width="128" height="96"></p>
```

This is identified by `imageFileName.match(/[@._-]([0-9]+)(x|dpi|ppi)$/)`

