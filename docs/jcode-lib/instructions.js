/*
インストラクションのヘルパー
JCODE.instruction
JCODE.balloon
*/

// インストラクション ブロックの定義
JCODE.jcodeInstractionCallback = function(workspace) {
  var list = [
    "function_caller",
    "function_declaration",
    "THREE_constr_blocks",
    "THREE_method_blocks",
    "THREE_accessor_blocks",
    "THREE_prop_blocks",
    "JS_method_blocks",
    "CANVAS_method_blocks",
    "CANVAS_prop_blocks",
    "CONTEXT_prop_blocks",
    "JQUERY_constr_blocks",
    "JCODE_instruction_new",
      "JCODE_instruction_html",
      "JCODE_instruction_click"
  ];
  var xmlList = [];
  for (var i = 0; i < list.length; i++) {
    var blockText = '<xml>' +
        '<block type="'+list[i]+'">' +
        '</block>' +
        '</xml>';
    var block = Blockly.Xml.textToDom(blockText).firstChild;
    xmlList.push(block);

  }
  var blockText = '<xml><button text="A button" callbackKey="myFirstButtonPressed"></button></xml>';
  var block = Blockly.Xml.textToDom(blockText).firstChild;
  xmlList.push(block);
  workspace.registerButtonCallback("myFirstButtonPressed", function(){
    Blockly.Variables.createVariable(workspace, null, 'THREE');
  });
  return xmlList;
};

(function (){

  ////////////////////////////////////////////
  // METHOD
  var proplist = [
     [" =",   "="],
     ["+=",  "+="],
     ["?",   "?"]
   ];

  function setupMethod2Blocks(config) {
    var config = config;

    // プロパティ　ブロック
    // インストラクションの初期化
    Blockly.Blocks[config.blockname] = {
    
      init: function() {
    
        if (config.type=="method") {
          this.appendDummyInput().appendField(new Blockly.FieldCheckbox('FALSE'),'OUTPUT');
        }
        if (config.objects) {
          this.appendValueInput('OBJECT');
        }
        this.appendDummyInput().appendField('', 'LABEL1');
        this.appendDummyInput().appendField(new Blockly.FieldDropdown(getOptions(config.list)), 'CODE');
        this.appendDummyInput().appendField('', 'LABEL2');
        if (config.type=="property") {
          this.appendDummyInput().appendField(new Blockly.FieldDropdown(proplist), 'OPERAND');
        }
        this.appendValueInput('ARG0');
        this.appendDummyInput().appendField('', 'LABEL3');

        if (config.type=="constr") {
          this.setOutput(true);
        } else {
          this.setPreviousStatement(true);
          this.setNextStatement(true);
        }

        this.jsonInit({
          "inputsInline": true,
          "colour": config.color,
          "mutator": config.mutatorname
        });
        // Assign 'this' to a variable for use in the tooltip closure below.
        var thisBlock = this;
      }
    };
    
    Blockly.JavaScript[config.blockname] = function(block) {
      var obj = Blockly.JavaScript.valueToCode(block, 'OBJECT', Blockly.JavaScript.ORDER_MEMBER);
      var method = this.getFieldValue('CODE');
      var args = '';
      var comma = false;
      for (var n = 0; n < 6; n++) {
        if (!! this.getInput('ARG'+n)) {
          if (comma){
            args += ', ';
          }
          args += Blockly.JavaScript.valueToCode(block, 'ARG'+n, Blockly.JavaScript.ORDER_MEMBER);
          comma = true;
        }
      }
       if (config.type == "property") {
        var op = this.getFieldValue('OPERAND');
        if (op !== '?') {
          var code = obj + method + ' ' + op + ' ' + args + ';\n';
          return code;
        } else {
          var code = obj + method;
          return [code, Blockly.JavaScript.ORDER_MEMBER];
        }
    
      } else {
        args = '(' + args + ')';
        if (! this.outputConnection) {
          var code = obj + method + args + ';\n';
          return code;
        } else {
          var code = obj + method + args;
          return [code, Blockly.JavaScript.ORDER_MEMBER];
        }
      }
    };

    Blockly.Extensions.registerMutator(config.mutatorname, {
      output_: false,
      method: "error",
      argsNumber_: 1,
      
      checkOperand_: function(op) {
       var ret = {};
        if (op == "?") { // 
          this.output_ = true;
          this.argsNumber_ = 0;
        } else {
          this.output_ = false;
          this.argsNumber_ = 1;
        }
        //console.log("prop!!!:",op,this.output_,this.argsNumber_);
        return ret;
      },
      getArgs: function() {
        var args = config.args;
        if (config.configs && config.configs[this.method]) {
          if (config.configs[this.method].hasOwnProperty('args')) {
            args = config.configs[this.method].args;
          }
        }
        this.argsNumber_ = args;
        return args;
      },

      checkCode_: function(method) {
        this.method = method;
        if (config.type == "property") {
        } else {
          this.getArgs();
        }
        this.updateStatement_();
      },
      checkOutput_: function(op) {
        if (op) {
          this.output_ = true;
        } else {
          this.output_ = false;
        }
        this.updateStatement_();
      },
      /**
       * Create XML to represent whether the 'divisorInput' should be present.
       * @return {Element} XML storage element.
       * @this Blockly.Block
       */
      mutationToDom: function() {
        var container = document.createElement('mutation');

        if (config.type=="property") {
          this.checkOperand_(this.getFieldValue('OPERAND'));
        }
        if (this.output_) {
          container.setAttribute('output', this.output_);
        }
        if (this.argsNumber_) {
          container.setAttribute('args', this.argsNumber_);
        }
        //if (this.method) {
        //  container.setAttribute('method', this.method);
        //}
        this.checkCode_(this.getFieldValue('CODE'));
        if (config.type == "method") {
          this.checkOutput_(this.getFieldValue('OUTPUT')=="TRUE");
         }
 
        return container;
      },
      /**
       * Parse XML to restore the 'divisorInput'.
       * @param {!Element} xmlElement XML storage element.
       * @this Blockly.Block
       */
      domToMutation: function(xmlElement) {
        var a = xmlElement.getAttribute('output');
        if (a && a === "true") {
          this.output_ = true;
        }
        //var a = xmlElement.getAttribute('method');
        //if (a) {
        //  this.method = a;
        //}
        var a = (xmlElement.getAttribute('args'));
        if (a) {
          this.argsNumber_ = a;
        }
        //console.log("domToMutation:",this.output_);
        
        this.updateStatement_();
      },
      /**
       * Modify this block to have (or not have) an input for 'is divisible by'.
       * @param {boolean} divisorInput True if this block has a divisor input.
       * @private
       * @this Blockly.Block
       */
      // newStatement == true 値を返す関数
      updateStatement_: function() {

        //var method = this.method;
        var method = this.method;
        var label = getLabels(config.list, method);

       // console.log("method:",method);

        this.getField('LABEL1').setText(label[1]);
        this.getField('LABEL3').setText(label[3]);
        
        if (config.type == "constr") {

        } else {
          var newStatement = this.output_;
          var oldStatement = !! this.outputConnection;
          if (newStatement != oldStatement) {
            this.unplug(true, true);
            //console.log("unplug");
            if (newStatement) {
              this.setPreviousStatement(false);
              this.setNextStatement(false);
              this.setOutput(true);
            } else {
              this.setOutput(false);
              this.setPreviousStatement(true);
              this.setNextStatement(true);
            }
          }
  
        }
    
        //console.log("update:",this.output_, this.method, this.argsNumber_);

        //this.render();
        for (var n = 0; n < 6; n++) {
          var newStatement = (n < this.argsNumber_);
          var oldStatement = this.getInput('ARG'+n) ? "1": "0";
            if (newStatement != oldStatement) {
            //console.log("ccc");
            if (newStatement == "0") {
              this.removeInput('ARG'+n, true);
            } else {
              this.appendValueInput('ARG'+n)
              .appendField("v:");
            }
          }
  
        }
      }
    },
    function() {
      this.getField('CODE').setValidator(function(option) {
        this.sourceBlock_.checkCode_(option);
        this.sourceBlock_.updateStatement_();
      });
      if (config.type == "method") {
        this.getField('OUTPUT').setValidator(function(option) {
          this.sourceBlock_.checkOutput_(option);
          this.sourceBlock_.updateStatement_();
        });
      }
      if (config.type == "property") {
        this.getField('OPERAND').setValidator(function(option) {
          console.log("validator",option);
          this.sourceBlock_.checkOperand_(option);
          this.sourceBlock_.updateStatement_();
        });
      }
    });
  }

  ////////////////////////////////////////////
  // PROP
  function setupProp2Blocks(config) {
    var config = config;

// プロパティ　ブロック
// インストラクションの初期化
Blockly.Blocks[config.blockname] = {
  init: function() {
    this.jsonInit({
      "message0": "%1",
      "args0": [
        {"type": "input_value", "name": "OBJECT"},
      ],
      "message1": "の %1 は",
      "args1": [{
          "type": "field_dropdown",
          "name": "PROP",
          "options": getOptions(config.list)
        },
       ],
       "message2": "%1",
       "args2": [{
         "type": "field_dropdown",
         "name": "OPERAND",
         "options": [
          [" =",   "="],
          ["+=",  "+="],
          ["?",   "?"]
        ]},
       ],
        "message3": "%1",
       "args3": [
         {"type": "input_value", "name": 'ARG0'}
       ],
      "inputsInline": true,
      "output": null,
      "colour": config.color,
      "mutator": config.mutatorname
    });
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
  }
};
Blockly.JavaScript[config.blockname] = function(block) {
  var obj = Blockly.JavaScript.valueToCode(block, 'OBJECT', Blockly.JavaScript.ORDER_MEMBER);
  var prop = this.getFieldValue('PROP');
  var op = this.getFieldValue('OPERAND');
  if (op !== '?') {
    var value = Blockly.JavaScript.valueToCode(block, 'ARG0', Blockly.JavaScript.ORDER_MEMBER);
    var code = obj + prop + ' ' + op + ' ' + value + ';\n';
    //console.log(code);
    return code;
  } else {
    var code = obj + prop;
    //console.log(code);
    return [code, Blockly.JavaScript.ORDER_MEMBER];
  }
};

/**
 * Mixin for mutator functions in the 'math_is_divisibleby_mutator'
 * extension.
 * @mixin
 * @augments Blockly.Block
 * @package
 */
Blockly.Extensions.registerMutator(config.mutatorname,
  {
    checkOperand_: function(op) {

      var ret = {};
      if (op == "?") {
        ret.return_output = true;
        ret.param_num = "0";
      } else {
        ret.return_output = false;
        ret.param_num = "1";
      }
      ret.new_constructor = false;
      return ret;
    },
    /**
     * Create XML to represent whether the 'divisorInput' should be present.
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function() {
      var container = document.createElement('mutation');
      var ret = (this.checkOperand_(this.getFieldValue('OPERAND')));
      container.setAttribute('output', ret.return_output);
      container.setAttribute('value', ret.param_num);
      return container;
    },
    /**
     * Parse XML to restore the 'divisorInput'.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function(xmlElement) {
      var ret = {};
      ret.return_output = (xmlElement.getAttribute('output') == 'true');
      ret.param_num = (xmlElement.getAttribute('value'));
      this.updateStatement_(ret);
    },
    /**
     * Modify this block to have (or not have) an input for 'is divisible by'.
     * @param {boolean} divisorInput True if this block has a divisor input.
     * @private
     * @this Blockly.Block
     */
    // newStatement == true 値を返す関数
    updateStatement_: function(inp) {
      var newStatement = inp.return_output;
      var oldStatement = !! this.outputConnection;
      if (newStatement != oldStatement) {
        this.unplug(true, true);
        //console.log("unplug");
        if (newStatement) {
          this.setPreviousStatement(false);
          this.setNextStatement(false);
          this.setOutput(true);
        } else {
          this.setOutput(false);
          this.setPreviousStatement(true);
          this.setNextStatement(true);
        }
      }

      if (false) {
        var newStatement = inp.new_constructor;
        var oldStatement = ! this.getInput('OBJECT');
        if (newStatement != oldStatement) {
          if (newStatement) {
            this.removeInput('OBJECT');
           } else {
            console.log("appppp");
            this.appendValueInput('OBJECT');
            //this.moveInputBefore('OBJECT', "METHOD");
            //this.appendField('obj');
          }
        }
  
      }
      
      var newStatement = inp.param_num || "0";
      var oldStatement = this.getInput('ARG0') ? "1": "0";
       if (newStatement != oldStatement) {
        console.log("ccc");
        if (newStatement == "0") {
          this.removeInput('ARG0', true);
        } else {
          this.appendValueInput('ARG0');
          //this.appendDummyInput('DUMMY')
          //.appendField('とする');
        }
      }
      //this.render();

    }
  },
  function() {
    this.getField('OPERAND').setValidator(function(option) {
      console.log("option",option);
      var ret = this.sourceBlock_.checkOperand_(option);
      this.sourceBlock_.updateStatement_(ret);
    });
  });
}


  function getOptions(list){
    var a = [];
    for (var prop in list) {
      a.push([list[prop][0], prop]);
    }
    return a;
  }

  function getLabels(list, method){
    var r = [];
    if (list[method]) {
      r = list[method][1].split('%');
    }
    return r;
  }

  var THREE_BLOCKS_COLOR = 90;
  var CANVAS_BLOCKS_COLOR = 40;
  var CONTEXT_BLOCKS_COLOR = 40;
  var JQUERY_BLOCKS_COLOR = 60;
  var JS_BLOCKS_COLOR = 160;

  setupMethod2Blocks({
    type:"constr",
    objects: 0, args: 1, color:THREE_BLOCKS_COLOR,
    blockname:'THREE_constr_blocks', mutatorname:'THREE_constr_mutator',
    list: {
      "new JCODE.object3d": ["新しく作る", "%%%"],
      "new THREE.box": ["新しい はこ", "%%%"],
      "new THREE.Texture": ["新しいテクスチャ", "%%%"],
      "new THREE.MeshPhongMaterial": ["新しいマテリアル", "%%%"],
      "new THREE.BoxGeometry": ["はこのジオメトリ", "%%%"],
      "new THREE.Mesh": ["Mesh", "%%%"]
    },
    configs: {
      "new THREE.MeshPhongMaterial": {args: 0},
      "new THREE.BoxGeometry": {args: 3},
      "new THREE.Mesh": {args: 2}
    }
  });
  setupMethod2Blocks({
    type:"constr",
    objects: 0, args: 1, color:JQUERY_BLOCKS_COLOR,
    blockname:'JQUERY_constr_blocks', mutatorname:'JQUERY_constr_mutator',
    list: {
      "$": ["$", "%%%"]
    }
  });

  setupMethod2Blocks({
    type:"method",
    objects: 1, args: 1, color:CANVAS_BLOCKS_COLOR,
    blockname:'CANVAS_method_blocks', mutatorname:'CANVAS_method_mutator',
    list: {
      ".getContext":  ["の コンテキスト は", "%% %"],
      ".fillRect":  ["に 四角くをかく", "%% %"],
      ".fillText":  ["に 字をかく", "%% %"],
    },
    configs: {
      ".fillRect": {args: 4},
      ".fillText": {args: 3}
    }
  });
  // CONTEXT Prop
  setupProp2Blocks({
    type:"property",
    objects: 1, args: 1, color:CONTEXT_BLOCKS_COLOR,
    blockname:'CONTEXT_prop_blocks', mutatorname:'CONTEXT_prop_mutator',
    list: {
      ".fillStyle":    ["の 色 は", "%% %"],
    }
  });

  setupMethod2Blocks({
    type:"property",
    objects: 1, args: 1, color:CANVAS_BLOCKS_COLOR,
    blockname:'CANVAS_prop_blocks', mutatorname:'CANVAS_prop_mutator',
    list: {
      ".width":    ["の はば は", "%% %"],
      ".height":    ["の 高さ は", "%% %"],
    }
  });

  setupProp2Blocks({
    type:"property",
    objects: 1, args: 1, color:THREE_BLOCKS_COLOR,
    blockname:'THREE_prop_blocks', mutatorname:'THREE_prop_mutator',
    list: {
      ".map": ["マテリアルのマップ", "%の% %"],
      ".needsUpdate": ["のアップデート", "%の% %"],
      ".castShadow": ["の影の生成", "%の% %"],
      ".position.x": ["X座標", "%の% %"],
      ".position.y": ["Y座標", "%の% %"],
      ".position.z": ["Z座標", "%の% %"]
    }
  });

  setupMethod2Blocks({
    type:"method",
    objects: 1, args: 1, color:THREE_BLOCKS_COLOR,
    blockname:'THREE_method_blocks', mutatorname:'THREE_method_mutator',
    list: {
      ".moveForward": ["を 前にうごかす", "%%%センチ"],
      ".turnRight":   ["を 右に向かせる", "%%%度"],
      ".lookUpward":  ["を 上に向かせる", "%%%度"]
    }
  });

  setupMethod2Blocks({
    type:"method",
    objects: 1, args: 1, color:THREE_BLOCKS_COLOR,
    blockname:'THREE_accessor_blocks', mutatorname:'THREE_accessor_mutator',
    list: {
      ".setColor":    ["の 色 は", "%% %"],
      ".setScale":    ["の 大きさ は", "%% %倍"],
      ".setSpeed":    ["の 速さ は", "%% %倍"],
      ".setTransparent": ["の とうめいど は", "%% %％"],
      }
  });

  setupMethod2Blocks({
    type:"method",
    objects: 0, args: 1, color:JS_BLOCKS_COLOR,
    blockname:'JS_method_blocks', mutatorname:'JS_method_mutator',
    list: {
      "console.log": ["コンソールログ", "%%%"],
      "document.createElement": ["新しい要素をつくる", "%%%"],
      "document.getElementById": ["IDで要素をさがす", "%%%"]
    }
  });
})();

Blockly.Blocks['JCODE_instruction_new'] = {
    init: function() {
      this.jsonInit({
        "message0": "インストラクション %1 です",
        "args0": [
            {"type": "input_value", "name": 'ARG0'}
        ],
        "output": null,
        "colour": 60
      });
      // Assign 'this' to a variable for use in the tooltip closure below.
      var thisBlock = this;
    }
};
Blockly.JavaScript['JCODE_instruction_new'] = function(block) {
  var args = '(';
  if (!! this.getInput('ARG0')) {
    args += Blockly.JavaScript.valueToCode(block, 'ARG0', Blockly.JavaScript.ORDER_MEMBER);
  }
  if (!! this.getInput('ARG1')) {
    args += ',';
    args += Blockly.JavaScript.valueToCode(block, 'ARG1', Blockly.JavaScript.ORDER_MEMBER);
  }
  args += ')';
   var code = 'new JCODE.instruction(' + text + ')';
    return [code, Blockly.JavaScript.ORDER_MEMBER];
};

// インストラクションに文を追加
Blockly.Blocks['JCODE_instruction_html'] = {
    init: function() {
      this.jsonInit({
        "message0": "%1 に、インストラクション %2 を追加",
        "args0": [
            {"type": "field_variable", "name": "VAR", "variable": "inst"},
            {"type": "input_value", "name": 'ARG0'}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 60
      });
      // Assign 'this' to a variable for use in the tooltip closure below.
      var thisBlock = this;
    }
};
Blockly.JavaScript['JCODE_instruction_html'] = function(block) {
    var obj = this.getFieldValue('VAR');
    var text = Blockly.JavaScript.valueToCode(block, 'ARG0', Blockly.JavaScript.ORDER_MEMBER)
    var code = obj + '.html(' + text + ')';
    return code + ";\n";
};

// インストラクションのボタンに関数を割当
Blockly.Blocks['JCODE_instruction_click'] = {
    init: function() {
      this.jsonInit({
        "message0": "%1 がクリックされたら %2 を実行",
        "args0": [
            {"type": "field_variable", "name": "VAR", "variable": "inst"},
            {"type": "input_value", "name": 'ARG0'}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 60
      });
      // Assign 'this' to a variable for use in the tooltip closure below.
      var thisBlock = this;
    }
};
Blockly.JavaScript['JCODE_instruction_click'] = function(block) {
    var obj = this.getFieldValue('VAR');
    //var text = this.getFieldValue('FIELDNAME');
   //var text = this.getFieldValue('ARG0');
   var text = Blockly.JavaScript.valueToCode(block, 'ARG0', Blockly.JavaScript.ORDER_MEMBER);
   text = text.replace(/\(\)/, ""); // += "a"; // TODO: 関数名の後ろの()を取り除く
   //var text = Blockly.JavaScript.getFieldValue(block, 'ARG0', Blockly.JavaScript.ORDER_MEMBER);
    var code = obj + '.click(' + text + ')';
    return code + ";\n";
};

JCODE.instruction = function(html) {
    this.$inst = $('#JCODE-instruction');
    if (html) {
        $('<p>').html(html).appendTo(this.$inst);
    }
    return this;
} 

JCODE.instruction.prototype.add = function(html) {
    console.log(html);
    $('<p>').html(html).appendTo(this.$inst);
    //this.$inst.html(html);  
}


JCODE.instruction.prototype.click = function( f ) {
    $(this.$inst).find("button").click(function(e) {
       f(e);
    }); 
}

// balloon （吹)き出し）ヘルパーの初期化
JCODE.balloon = function() {
    var p = $('<div>').css("position","absolute").css("z-index",1000).prependTo("body");
    var b = $('<div id="ballon-layer">').css("position","relative").prependTo( p );
    this.$balloon = $('<div class="balloon">baloon</div>').css("position","fixed").css("left","100px").css("top","250px").appendTo ( b );
    return this;
};
// 吹き出しの文字を変更
JCODE.balloon.prototype.html = function(html) {
    this.$balloon.html(html);
}

function test() {
    //JCODE.instruction.add("こんにちは、ようこそ<br />ここに注目を見てください。そして<button>ここ</button>をクリックして。");
    var b = new JCODE.balloon();
    b.html("ここに注目");
    var i = new JCODE.instruction();
    i.html("こんにちは、ようこそ<br />ここに注目を見てください。そして<button>ここ</button>をクリックして。");
    i.click(test2);
}
function test2() {
    var i = new JCODE.instruction();
    i.html("わかりましたね！そしたら<button>ここ</button>をクリックして。");
    i.click(test3);
}
function test3() {
    var i = new JCODE.instruction();
    i.html("おわり");
}