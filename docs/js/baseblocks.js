'use strict';
/*
 * ブロック定義関数
 */
(function() {
  var ParameterHue = 191;
  var blockid = 'three_angle';
  Blockly.Blocks[blockid] = {
    init: function() {
      this.jsonInit({
        "output": null,
        "colour": ParameterHue
      });
      this.appendDummyInput()
      .appendField("")
      .appendField(new Blockly.FieldAngle(90), 'FIELDNAME');
    }
  };
  Blockly.JavaScript[blockid] = function(block) {
    var text = parseFloat(block.getFieldValue('FIELDNAME'));
    return [text, Blockly.JavaScript.ORDER_ATOMIC];
  };
})();

(function(){
  var ParameterHue = 191;
  var blockid = 'three_typeName';
  Blockly.Blocks[blockid] = {
    init: function() {
      this.jsonInit({
        "output": null,
        "colour": ParameterHue
      });
      this.appendDummyInput()
      .appendField("")
      .appendField(new Blockly.FieldDropdown(
        [
          [ "たま", "sphere" ],
          [ "ぴん", "pin" ],
          [ "はこ", "box" ],
          [ "降雪", "snowfall" ]
        ]
      ), 'FIELDNAME');
    }
  };
  Blockly.JavaScript[blockid] = function(block) {
    var text = this.getFieldValue('FIELDNAME');
    var code = '"' + text + '"';
    return [code, Blockly.JavaScript.ORDER_MEMBER];
  };
})()

