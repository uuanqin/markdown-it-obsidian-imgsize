/*
  TEST.JS

  Run test: npm run test

  You can add more cases on examples.md
  Written By wuanqin (wuanqin@mail.ustc.edu.cn), base on k_taka's work.
 */

const assert = require('assert');
const fs = require('fs');
const md = require('markdown-it')();
const mdImgSizePlg = require('../index.js');

md.use(mdImgSizePlg);

const example_path = __dirname + '/examples.md';
var content = fs.readFileSync(example_path, 'utf-8').trim();
// Identify comments
const comments_RE = /# .*\n/gm;
content = content.replace(comments_RE,"");


let cases = [];
let cases_texts = content.split(/\n*\[Markdown\]\n/);
// cases_texts[0] is an empty string or a blank string
for(let i = 1;i < cases_texts.length;i++) {
  let text_segments = cases_texts[i].split(/\n+\[HTML[^\]]*?\]\n/); // 可以删掉问号的
  for (let j=1;j < text_segments.length;j++) {
    if (text_segments[j] === undefined) {
      text_segments[j] = '';
    } else {
      text_segments[j] = text_segments[j].replace(/$/,'\n');
    }
  }
  cases[i] = {
    markdown: text_segments[0],
    html: text_segments[1],
  };
}

var success_num = 0;
for(let i=1;i < cases.length;i++) {
  console.log('Test: ' + i + ' >>>');

  const html_text = md.render(cases[i].markdown);
  try {
    assert.strictEqual(html_text, cases[i].html);
  } catch(e) {
    console.log('RESULT: ' + html_text +'EXPECT: ' + cases[i].html);
    continue;
  };
  success_num++;
  console.log('Pass.\n');
}

console.log(`${success_num}/${cases.length-1} Case(s) Pass.\n`);
