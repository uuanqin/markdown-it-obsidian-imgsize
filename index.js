'use strict';

const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');

module.exports = function renderer_image_plugin(md, option) {

  let opt = {
    scaleSuffix: false,
  };
  if (option !== undefined) {
    for (let o in option) {
        opt[o] = option[o];
    }
  }

  function setImgSize(imgToken, img) {
    if (imgToken.attrIndex('src') === undefined) return;
    const imgSize = sizeOf(img);
    let w = imgSize.width;
    let h = imgSize.height;
    if (imgSize === undefined) return;
    const imgName = path.basename(img, path.extname(img));
    if (opt.scaleSuffix) {
      const reg = /[@._-]([0-9]+)(x|dpi|ppi)$/;
      const rs = imgName.match(reg);
      if (rs) {
        if (rs[2] === 'x') {
          w = Math.round(w / rs[1]);
          h = Math.round(h / rs[1]);
        }
        if (/(dpi|ppi)/.test(rs[2])) {
          w = Math.round(w * 96 / rs[1]);
          h = Math.round(h * 96 / rs[1]);
        }
      }
    }
    imgToken.attrJoin('width', w);
    imgToken.attrJoin('height', h);
    return;
  }

  md.renderer.rules['image'] = function (tokens, idx, options, env, slf) {
    const token = tokens[idx];
    let imgCont = '<img src="' + token.attrGet('src') + '" alt="' + token.content + '">';
    if (token.attrGet('title')) {
      imgCont = imgCont.replace(/>$/, ' title="' + token.attrGet('title') + '">');
    }
    let img = '';
    if (env === undefined) return imgCont;
    if (env.md === undefined) return imgCont;
    img = path.dirname(env.md) + path.sep + token.attrGet('src');
    if(!fs.existsSync(img)) return imgCont;
    setImgSize(token, img);
    if (!token.attrGet('width')) token.attrSet('width', '');
    if (!token.attrGet('height')) token.attrSet('height', '');
    imgCont = imgCont.replace(/>$/, ' width="' + token.attrGet('width') + '" height="' + token.attrGet('height') + '">');
    return imgCont;
  }
};
