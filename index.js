module.exports = function renderer_image_plugin(md, option) {
  /*const option = { no option here };*/

  md.renderer.rules['image'] = function (tokens, idx, options, env, slf) {
    let endTagCont = '>';
    if (options.xhtmlOut) {
      endTagCont = ' />';
    }
    const token = tokens[idx];

    // See https://help.obsidian.md/Editing+and+formatting/Basic+formatting+syntax#External+images
    var obsidian_imgsize_RE = /\| *([0-9]+) *(x *([0-9]+))? *$/;
    let imgAlt_original = md.utils.escapeHtml(token.content)

    let imgAlt = imgAlt_original.replace(obsidian_imgsize_RE,"");
    let imgSrc = md.utils.escapeHtml(token.attrGet('src'));
    let imgTitle = md.utils.escapeHtml(token.attrGet('title'));
    let imgCont = '<img src="' + decodeURI(imgSrc) + '"' + endTagCont;
    imgCont = imgCont.replace(/( src=".*?")/, '$1 alt="' + imgAlt + '"');
    if (imgTitle) {
      imgCont = imgCont.replace(/( *?\/)?>$/, ' title="' + imgTitle + '"$1>');
    }

    let matchObj = imgAlt_original.match(obsidian_imgsize_RE)
    if(matchObj){
      let width,height;
      if(matchObj[2]){
        // e.g. ![img|100x200](/path/to/img)
        width = parseInt(matchObj[1]);
        height = parseInt(matchObj[3])
        token.attrJoin('width', width);
        token.attrJoin('height', height);
        imgCont = imgCont.replace(/( *?\/)?>$/, ` width="${width}px" height="${height}px"` + '$1>');
      }else{
        // e.g. ![img|100](/path/to/img)
        width = parseInt(matchObj[1]);
        token.attrJoin('width', width);
        imgCont = imgCont.replace(/( *?\/)?>$/, ` width="${width}px"` + '$1>');
      }
    }
    return imgCont;
  }
};
