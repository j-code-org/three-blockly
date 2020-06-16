/**
 * blockly threejs support
 * Group Object の管理
 *
 * = new JCODE.object3d()
 * setColor()
 * setScale()
 * setSpeed()
 * setTransparent()
 * moveForward()
 * turnRight()
 * lookUpward()
 * AxisHelper()
 * clearGroup()
 * scene_add()
 * 
 */

var JCODE_three_toolbox;

var ParameterHue = 191;
var MovableHue = Blockly.Msg["MOVABLES_HUE"]; //"#00A51B";//130 1.-.60;
var EventHue = Blockly.Msg["EVENTS_HUE"]; //"#6C8B9A";//200 .30-.60;

var blocklist = {
  angle: {
    msg: "", 
    angle: 90 ,
    colour: ParameterHue
  },
  typeName: {
    msg: "", 
    colour: ParameterHue,
    dropdown:[
      [ "たま", "sphere" ],
      [ "ぴん", "pin" ],
      [ "はこ", "box" ],
      [ "降雪", "snowfall" ]
    ] ,
    code: function(operator, text) {
      return "var " + operator + " = new THREE.library['" + text + "']();\n";
    }
  },
  beginBlock: {
    msg: "最初だけ", 
    eventName: "beginBlock",
    colour: EventHue,
    code: function(branch) {
      return `// さいしょだけ
async function init() {
    ${branch}
}
init();
`
    }
  },
  onrun: {
    msg: "実行したとき", 
    eventName: "onrun",
    colour: EventHue,
    code: function(branch) {
      return `// 実行したとき
async function onrun() {
    ${branch}
}
window.addEventListener('onrun', function(e) {
	onrun();
}, false);
`
    }
  },
  disableBlock: {
    msg: "無効", 
    eventName: "disableBlock",
    colour: EventHue,
    code: function(branch) {
      return "// 無効です！\n"+
      'function dummy() {\n' + branch + '}\n';
    }
  },
  createNew: {
    msg: "%1 ＝ 新しい %2", 
    msg2: "var %1 = new JCODE.object3d( %2 );", 
    colour: MovableHue,
    code: function(operator, text) {
      return "" + operator + " = new THREE.library[" + text + "]();\n";
    }
  },
  setColor: {
    msg: "%1 の色は %2", 
    code: function(operator, text) {
      return operator + ".setColor(" + text + ");\n";
    }
  },
  setScale: {
    msg: "%1 の大きさは %2 倍", 
    code: function(operator, text) {
      return operator + ".setScale(" + text + ");\n";
    }
  },
  setSpeed: {
    msg: "%1 の速さは %2 倍", 
    code: function(operator, text) {
      return operator + ".setSpeed(" + text + ");\n";
    }
  },
  setTransparent: {
    msg: "%1 の とうめいどは %2 (0〜100)", 
    code: function(operator, text) {
      return operator + ".setTransparent(" + text + ");\n";
    }
  },
  moveForward: {
    msg: "%1 が前にうごく %2 センチ",
    msg2: "%1.moveForward( %2 );",
    code: function(operator, text) {
      return "await " + operator + ".moveForward(" + text + ");\n";
    }
  },
  turnRight: {
    msg: "%1 が右にまがる %2",
    code: function(operator, text) {
      return "await " + operator + ".turnRight(" + text + ");\n";
    }
  },
  lookUpward: {
    msg: "%1 が上を向く %2",
    code: function(operator, text) {
      return "await " + operator + ".lookUpward(" + text + ");\n";
    }
  },
  AxisHelper: {
    msg: " %1 は軸ヘルパーで長さは %2", 
    code: function(operator, text) {
      return "var " + operator + " = new THREE.AxisHelper(" + text + ");\n";
    }
  },
  clearGroup: {
    msg: "画面をクリアする %1", 
    pno: 0, 
    code: function(operator) {
      return "JCODE.clearGroup ('"+operator+"');\n";
    }
  },
  scene_add: {
    msg: "シーンに %1 を追加",
    pno: 0, 
    code: function(operator, text) {
      return "THREE.scene.add (" + operator + ");\n";
    }
  }
};
// Toolbox に Three ブロックの一覧を追加
if (true) {
  // CUSTOM toolbox
  JCODE_three_toolbox = function(workspace) {
    var prefix = "three_";
    var obj = blocklist;
    var xmlList = [];
    for (var p in obj) {
      var blockText = '<xml>' +
      '<block type="'+prefix+p+'">' +
      '</block>' +
      '</xml>';
      var block = Blockly.Xml.textToDom(blockText).firstChild;
      xmlList.push(block);
    }              
    return xmlList;
  };
  // カスタムツールボックス
 // Code.workspace.registerToolboxCategoryCallback('JCODE_THREE', JCODE_three_toolbox);


} else {
  // Blockly ブロック一覧
  JCODE.three.toolbox = function(workspace) {
    var xmlList = [];
      var blocks = Blockly.Blocks;
      for (var p in blocks) {
        if (/lists_/.test(p)) {
          var blockText = '<xml>' +
          '<block type="'+ p +'">' +
          '</block>' +
          '</xml>';
          var block = Blockly.Xml.textToDom(blockText).firstChild;
          xmlList.push(block);
    
        }
    }              
    console.log(xmlList);
    return xmlList;
  };
}

// three_ Block の生成定義
(function() {
  var prefix = "three_";
  var obj = blocklist;
  for (var p in obj) {
    if (obj[p].dropdown) {
      //JCODE.createDropdown(obj, prefix, p, MovableHue);
    } else if (obj[p].angle) {
      //  JCODE.createAngle(obj, prefix, p, MovableHue);
    } else if (obj[p].eventName) {
      createEvent(obj[p], prefix, p, obj[p].colour);
    } else {
      createBlock(obj, prefix, p, MovableHue);
    }
  }              

  function createEvent(obj, prefix, funcname, colour) {
    var blockid = prefix + funcname;
    Blockly.Blocks[blockid] = {
      init: function() {
        this.jsonInit({
          "message0": obj.msg + "%1",
          "args0": [
            {"type": "input_dummy" }
          ],
          "message1": "%1",
          "args1": [
            {"type": "input_statement", "name": "DO"}
          ],
          "nextStatement": null,
          "colour": colour
        });
      }
    };
    Blockly.JavaScript[blockid] = function(block) {
      var branch = Blockly.JavaScript.statementToCode(block, 'DO');
      return obj.code(branch);
    };
  }
  /*
  *  オブジェクトの値を返さない JCODE.obj.withoutReturn();
  */

  function createBlock(obj, prefix, funcname, color) {
    var colour = obj[funcname].colour || color;
    var blockid = prefix + funcname;
    var pno = (typeof obj[funcname].pno === "undefined") ? 1 : obj[funcname].pno;
    var args = [];
    args.push({"type": "field_variable", "name": "VAR", "variable": "obj"});
    if (pno) {
      args.push({"type": "input_value", "name": "VALUE"});
    }
    Blockly.Blocks[blockid] = {
      init: function() {
        this.jsonInit({
          "message0": obj[funcname].msg,
          "args0": args,
          "previousStatement": null,
          "nextStatement": null,
          "colour": colour
        });
        this.setInputsInline(true);
        // Assign 'this' to a variable for use in the tooltip closure below.
        var thisBlock = this;
        this.setTooltip(function() {
          return 'へんすう "%1"　にオブジェクトをわりあて.'.replace('%1',
              thisBlock.getFieldValue('VAR'));
        });
      }
    };
    Blockly.JavaScript[blockid] = function(block) {
      var text = Blockly.JavaScript.valueToCode(block, 'VALUE',
      Blockly.JavaScript.ORDER_MEMBER) || '\'\'';
      var operator = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
      var subString = "substr";
      //console.log(text);
      var code = obj[funcname].code(operator, text);
      return code ;
    };
  };
})();
