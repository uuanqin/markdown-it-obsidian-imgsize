const path = require('path');
const fetch = require("sync-fetch");
const sizeOf = require('image-size');

module.exports = function renderer_image_plugin(md, option) {
  /*const option = {
    scaleSuffix: false,
    mdPath: '',
    lazyLoad: false,
    resize: false,
    asyncDecode: false,
  };*/

  function setImgSize(token, img, imgData) {
    if (!imgData) return token;

    let w = imgData.width;
    let h = imgData.height;
    //console.log('w: ' + w + ', h: ' + h);

    const imgName = path.basename(img, path.extname(img));
    if (option.scaleSuffix) {
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
    const imgTitle = token.attrGet('title');
    if (imgTitle && option.resize) {
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
      }
    }
    //console.log('w: ' + w + ', h: ' + h);
    token.attrJoin('width', w);
    token.attrJoin('height', h);
    return token;
  }

  function addAsyncDecode(imgCont) {
    imgCont = imgCont.replace(/( *?\/)?>$/, ' decoding="async"$1>');
    return imgCont;
  }

  function addLazyLoad(imgCont) {
    imgCont = imgCont.replace(/( *?\/)?>$/, ' loading="lazy"$1>');
    return imgCont;
  }

  function setLocalImgSrc(imgSrc, option, env) {
    let img = '';
    if (option.mdPath) {
      img = path.dirname(option.mdPath);
    } else {
      if (env !== undefined) {
        if (env.mdPath) {
          img = path.dirname(env.mdPath);
        }
      }
    }
    img += path.sep + imgSrc;
    img = decodeURI(img);
    return img;
  }

  md.renderer.rules['image'] = function (tokens, idx, options, env, slf) {
    let endTagCont = '>';
    if (options.xhtmlOut) {
      endTagCont = ' />';
    }
    const token = tokens[idx];
    let imgAlt = md.utils.escapeHtml(token.content);
    let imgSrc = md.utils.escapeHtml(token.attrGet('src'));
    let imgTitle = md.utils.escapeHtml(token.attrGet('title'));
    let imgCont = '<img src="' + decodeURI(imgSrc) + '"' + endTagCont;
    imgCont = imgCont.replace(/( src=".*?")/, '$1 alt="' + imgAlt + '"');
    if (imgTitle) {
      imgCont = imgCont.replace(/( *?\/)?>$/, ' title="' + imgTitle + '"$1>');
    }
    if (option.asyncDecode) {
      imgCont = addAsyncDecode(imgCont);
    }
    if (option.lazyLoad) {
      imgCont = addLazyLoad(imgCont);
    }

    let isNotLocal = /^https?:\/\//.test(imgSrc);
    let imgData = {};

    if (isNotLocal) {
      try {
        const response = fetch(imgSrc);
        const buffer = response.buffer();
        imgData = sizeOf(buffer);
      } catch {
        console.error('[renderder-image]No image: ' + imgSrc);
      }
      if (imgData.width !== undefined) {
        setImgSize(token, imgSrc, imgData);
        imgCont = imgCont.replace(/( *?\/)?>$/, ' width="' + token.attrGet('width') + '" height="' + token.attrGet('height') + '"$1>');
      }

    } else {
      imgSrc = setLocalImgSrc(imgSrc, option, env)
      try {
        imgData = sizeOf(imgSrc);
      } catch {
        console.error('[renderder-image]No image: ' + imgSrc);
      }
      if (imgData.width !== undefined) {
        setImgSize(token, imgSrc, imgData);
        imgCont = imgCont.replace(/( *?\/)?>$/, ' width="' + token.attrGet('width') + '" height="' + token.attrGet('height') + '"$1>');
      }
    }

    return imgCont;
  }
};
