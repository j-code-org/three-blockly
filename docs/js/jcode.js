/*
  jcode ver 0.0.1
*/
// resize window
(function($){ 
  $.fn.funcResizeBox = function(userOptions) {
    var elements = this;
    var defaults = {
      minWidth: 0,
      minHeight: 0,
      maxWidth: 10000,
      maxHeight: 10000,
      mouseRange: 5,
      isWidthResize:true,
      isHeightResize:true};
    var option = $.extend(defaults,userOptions);

    $(this).css('resize', 'none'); 
    $(this).css('overflow', 'auto'); 
    var pos_left = $(this).offset().left;
    var pos_top = $(this).get(0).offsetTop;
    var pos_right = $(this).outerWidth() + pos_left;
    var pos_bottom = $(this).outerHeight() + pos_top;
    var right_min = pos_right - option.mouseRange;
    var bottom_min = pos_bottom - option.mouseRange;
    var right_flg = false;
    var bottom_flg = false;
    var $box = $(this);
    var resize_flg = false;
      
    $(this).mousemove(function(e){

      if(resize_flg) return;
      
      right_flg = false;
      bottom_flg = false;

      pos_left = $box.offset().left;
      pos_top = $box.offset().top;
      pos_right = $box.outerWidth() + pos_left;
      pos_bottom = $box.outerHeight() + pos_top;
      right_min = pos_right - option.mouseRange;
      bottom_min = pos_bottom - option.mouseRange;
      
      var pagex = window.event.clientX + (document.body.scrollLeft || document.documentElement.scrollLeft); 
      var pagey = window.event.clientY + (document.body.scrollTop || document.documentElement.scrollTop); 
      
      // right
      if(pagex <= pos_right && right_min <= pagex
          && pos_top <= pagey && pagey <= pos_bottom && option.isWidthResize)
      {
          right_flg = true;
      }
      // bottom
      if(pagex <= pos_right && pos_left <= pagex
          && bottom_min <= pagey && pagey <= pos_bottom && option.isHeightResize)
      {
          bottom_flg = true;
      }

      if(right_flg && bottom_flg)
      {
          $(this).css('cursor','se-resize');
      }
      else if(right_flg)
      {
          $(this).css('cursor','e-resize'); 
      }
      else if(bottom_flg)
      {
          $(this).css('cursor','n-resize');
      }
      else{
          $(this).css('cursor','auto');
      }
    });

    $(this).mousedown(function(e){
          
      var resize_right_flg = false;
      var resize_bottom_flg = false;
      
      var pagex = e.pageX;
      var pagey = e.pageY;
      var boxWidth = $box.width();
      var boxHeight = $box.height();
      
      if(right_flg){
          resize_right_flg = true;
      }
      
      if(bottom_flg){
          resize_bottom_flg = true;
      }
      $(document).mousemove(function(e){

        if(!resize_right_flg && !resize_bottom_flg)
            return;   
        
        $('body').css('cursor', $box.css('cursor'));
        resize_flg = true;

        var addWidth = e.pageX - pagex;
        var resize_width = boxWidth + addWidth
        if(resize_right_flg && resize_width <= option.maxWidth 
                                && option.minWidth <= resize_width){
            $box.width(resize_width);
        }
        
        var addheight = e.pageY - pagey;
        var resize_height = boxHeight + addheight
        if(resize_bottom_flg && resize_height <= option.maxHeight 
                                && option.minHeight <= resize_height){
            $box.height(resize_height);
        }
        JCODE.resizeEvent();

      }).mouseup(function(){
        $(document).off("mousemove");
        resize_bottom_flg = false;
        resize_right_flg = false;
        resize_flg = false;
        $('body').css('cursor','auto');
      });
    });
    return(this);
  };
})(jQuery);

/**
 * Create a namespace for the application.
 */
var JCODE = {};

JCODE.scene = null;

JCODE.resizeEvent = function() {
  var event = document.createEvent('HTMLEvents');
  event.initEvent('resize', true, false);
  window.dispatchEvent(event);
}

JCODE.project = {
  selectedIndex: 0,
  name: "テスト",
  type: "project",
  children:[
    {
      name: "プログラム1",
      type: "jsxml",
      xml:"",
    }
  ]
};

// ブロックをテキスト形式のＸＭＬで返す。保存可能な形式。
JCODE.getWorkspaceXml = function() {
  var xmlDom = Blockly.Xml.workspaceToDom(Code.workspace);
  return Blockly.Xml.domToPrettyText(xmlDom);
}
// ブロックをテキスト形式のＸＭＬでワークスペースに入れ込む。
JCODE.putWorkspaceXml = function(defaultXml) {
  Code.workspace.clear();
  var xml = Blockly.Xml.textToDom(defaultXml);
  Blockly.Xml.domToWorkspace(xml, Code.workspace);
}

JCODE.projectInit = function() {

  // Populate the language selection menu.
  var programMenu = document.getElementById('programMenu');

  // ワークスペースの初期化
  //Code.workspace.clear();
  function saveWorkspace() {
    //var xmlDom = Blockly.Xml.workspaceToDom(Code.workspace);
    //var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
    if (!JCODE.project.selectedIndex) {
      JCODE.project.selectedIndex = 0;
    }
    if (JCODE.project.children) {
      JCODE.project.children[JCODE.project.selectedIndex].xml = JCODE.getWorkspaceXml();
    }
  }
  function loadBlocks() {
    JCODE.putWorkspaceXml(JCODE.project.children[JCODE.project.selectedIndex].xml);
  }
  function　restoreBlocks() {
    var url = window.location.href.split('#')[0];
    if ('localStorage' in window && window.localStorage[url]) {
      var json = null;
      try {
        json = JSON.parse(window.localStorage[url]);
      } catch (e) {
        console.log("cannot restore:", url);
      }
      if (json && json.type && json.type == "project") {
        JCODE.project = json;
        loadBlocks();
        if (!JCODE.project.selectedIndex) {
          JCODE.project.selectedIndex = 0;
        }
        console.log("restore:", url, JCODE.project.selectedIndex);
      }
    }
  }
  restoreBlocks();

  function updateProgramMenu() {
    var programs = JCODE.project.children;
    programMenu.options.length = 0;
    for (var i = 0; i < programs.length; i++) {
      var option = new Option(programs[i].name, i);
      if (i == JCODE.project.selectedIndex) {
        option.selected = true;
      }
      programMenu.options.add(option);
    }
    programMenu.options.add(new Option('（新しく作る）', i));
  }
  updateProgramMenu();
  
  window.addEventListener('unload', function() {
    var url = window.location.href.split('#')[0];
    console.log("backup:", url, JCODE.project.selectedIndex);
    saveWorkspace();
    if ('localStorage' in window) {
      //var xml = Blockly.Xml.workspaceToDom(workspace);
      // Gets the current URL, not including the hash.
      var url = window.location.href.split('#')[0];
      window.localStorage.setItem(url, JSON.stringify(JCODE.project));
     }
  }
  , false);

  programMenu.addEventListener('change', function(){
    var programs = JCODE.project.children;
    console.log("change program：", programMenu.selectedIndex);
    saveWorkspace();
    JCODE.project.selectedIndex = programMenu.selectedIndex;
    if (programs.length < (programMenu.selectedIndex+1)) {
      console.log("push", programMenu.selectedIndex);
      programs.push({
        name: "プログラム"+(programMenu.selectedIndex+1),
        type: "jsxml",
        xml:"",
      });
      Code.workspace.clear();
      updateProgramMenu();
      
    } else {
      loadBlocks();
    }
  }, true);

}
