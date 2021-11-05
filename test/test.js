const assert = require('assert');
const fs = require('fs');
const md = require('markdown-it')();
const mdLazy = require('markdown-it')();
const mdPat = require('markdown-it')();
const mdRendererImage = require('../index.js');

md.use(mdRendererImage, {'scaleSuffix': true, 'resize': true});
mdLazy.use(mdRendererImage, {'scaleSuffix': true, 'lazyLoad': true});
mdPat.use(mdRendererImage, {'scaleSuffix': true, 'resize': true, 'mdPath': __dirname + '/examples.md'});

const example = __dirname + '/examples.txt';
let mdPath = __dirname + '/examples.md';
const exampleCont = fs.readFileSync(example, 'utf-8').trim();
let ms = [];
let ms0 = exampleCont.split(/\n*\[Markdown\]\n/);
let n = 1;
while(n < ms0.length) {
  let mhs = ms0[n].split(/\n+\[HTML[^\]]*?\]\n/);
  let i = 1;
  while (i < mhs.length) {
    if (mhs[i] === undefined) {
      mhs[i] = '';
    } else {
      mhs[i] = mhs[i].replace(/$/,'\n');
    }
    i++;
  }
  ms[n] = {
    "markdown": mhs[0],
    "html": mhs[1],
    "htmlLazy": mhs[2],
  };
  n++;
}

n = 1;

const h0 = md.render(fs.readFileSync('./test/test.md', 'utf-8').trim(), {'mdPath': './test/test.md'});
const c0 = '<p><img src="cat.jpg" alt="A cat" width="400" height="300"></p>\n';
try {
  assert.strictEqual(h0, c0);
} catch(e) {
  console.log('incorrect(0): ');
  console.log('H: ' + h0 +'C: ' + c0);
};

while(n < ms.length) {
  //if (n !== 1) { n++; continue };
  console.log('Test: ' + n + ' >>>');
  //console.log(ms[n].markdown);

  const m = ms[n].markdown;
  const renderEnv = {
    'mdPath': mdPath,
  }
  const h = md.render(m, renderEnv);
  try {
    assert.strictEqual(h, ms[n].html);
  } catch(e) {
    console.log('incorrect: ');
    console.log('H: ' + h +'C: ' + ms[n].html);
  };

  if (ms[n].htmlLazy !== undefined) {
    const hLazy = mdLazy.render(m, renderEnv);
    try {
      assert.strictEqual(hLazy, ms[n].htmlLazy);
    } catch(e) {
      console.log('incorrect(Lazy): ');
      console.log('H: ' + hLazy +'C: ' + ms[n].htmlLazy);
    };
  }

  if (ms[n].html !== undefined) {
    const hPat = mdPat.render(m);
    try {
      assert.strictEqual(hPat, ms[n].html);
    } catch(e) {
      console.log('incorrect(mdPath): ');
      console.log('H: ' + hPat +'C: ' + ms[n].html);
    };
  }

  n++;
}
