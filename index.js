'use strict';

const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');

module.exports = function renderer_image_plugin(md, option) {

  let opt = {
    scaleSuffix: false,
    mdPath: '',
    lazyLoad: false,
    resize: false,
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
    const imgTitle = imgToken.attrGet('title');
    if (imgTitle && opt.resize) {
      const resizeReg = /(?:(?:(?:大きさ|サイズ)の?変更|リサイズ|resize(?:d to)?)? *[:：]? *([0-9]+)([%％]|px)|([0-9]+)([%％]|px)に(?:(?:大きさ|サイズ)を?変更|リサイズ))/i;
      const hasResizeSetting = imgTitle.match(resizeReg);
      if(hasResizeSetting) {
        const resizeValue = +hasResizeSetting[1];
        const resizeUnit = hasResizeSetting[2];
        //console.log('w: ' + w + ', h: ' + h);
        if (resizeUnit.match(/[%％]/)) {
          w = Math.round(w * resizeValue / 100);
          h = Math.round(h * resizeValue / 100);
        }
        if (resizeUnit.match(/px/)) {
          const bw = w;
          w = Math.round(resizeValue);
          h = Math.round(h * resizeValue / bw);
        }
        //console.log('w: ' + w + ', h: ' + h);
      }
    }
    imgToken.attrJoin('width', w);
    imgToken.attrJoin('height', h);
    return;
  }

  function addLazyLoad(imgCont) {
    imgCont = imgCont.replace(/>$/, ' loading="lazy">');
    return imgCont;
  }

  md.renderer.rules['image'] = function (tokens, idx, options, env, slf) {
    const token = tokens[idx];
    let imgCont = '<img src="' + md.utils.escapeHtml(token.attrGet('src')) + '" alt="' + md.utils.escapeHtml(token.content) + '">';
    if (token.attrGet('title')) {
      imgCont = imgCont.replace(/>$/, ' title="' + md.utils.escapeHtml(token.attrGet('title')) + '">');
    }
    let img = '';
    if (opt.mdPath) {
      img = path.dirname(opt.mdPath);
    } else {
      if (env !== undefined) {
        if (env.mdPath !== undefined) {
          img = path.dirname(env.mdPath);
        }
      }
    }
    if(!img) {
      if (opt.lazyLoad) {
        imgCont = addLazyLoad(imgCont);
      }
      return imgCont;
    }

    img += path.sep + token.attrGet('src');
    if(!fs.existsSync(img)) {
      if (opt.lazyLoad) {
        imgCont = addLazyLoad(imgCont);
      }
      return imgCont;
    }
    setImgSize(token, img);
    if (!token.attrGet('width')) token.attrSet('width', '');
    if (!token.attrGet('height')) token.attrSet('height', '');
    imgCont = imgCont.replace(/>$/, ' width="' + token.attrGet('width') + '" height="' + token.attrGet('height') + '">');
    if (opt.lazyLoad) {
      imgCont = addLazyLoad(imgCont);
    }
    return imgCont;
  }
};
