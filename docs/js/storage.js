/**
 * @fileoverview Loading and saving blocks with localStorage and cloud storage.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

// Create a namespace.
var BlocklyStorage = {};

/*
local strage:
  project.json // プロジェクト全体の定義
  main.xml // 編集中のブロック
*/

// default "project.json"
BlocklyStorage.project = {
  version: "1.0",
  selectedIndex: 0,
	render : [
		{name: "render", path: "./assets/scene.js"},
	],
	modules: [
		{name: "snowfall", path: "./assets/snowfall.js"},
		{name: "sphere", path: "./assets/sphere.js"},
		{name: "pin", path: "./assets/pin.js"},
		{name: "floor", path: "./assets/floor.js", inactive: true},
		{name: "grass", path: "./assets/grass.js"},
		{name: "skydome", path: "./assets/skydome.js"},
		{name: "light", path: "./assets/light.js"},
		{name: "box", path: "./assets/cube.js"},
	],
	codes: [
		{name: "background", path: "./assets/background.js"},
		{name: "demo", path: "./assets/demo.js", inactive: true},
	],
	blocks: [
    {name: "main", path: "main.xml"},
	],
}

// ブロックをテキスト形式のXMLで返す。保存可能な形式。
BlocklyStorage.getWorkspaceXml = function() {
  var xmlDom = Blockly.Xml.workspaceToDom(Code.workspace);
  return Blockly.Xml.domToPrettyText(xmlDom);
}

// ブロックをテキスト形式のXMLでワークスペースに入れ込む。
BlocklyStorage.putWorkspaceXml = function(defaultXml) {
  Code.workspace.clear();
  if (defaultXml) {
    var xml = Blockly.Xml.textToDom(defaultXml);
    Blockly.Xml.domToWorkspace(xml, Code.workspace);
  }
 }
// ファイル名でファイルを読み出す
BlocklyStorage.readLocalStrage= function(filename) {
  if ('localStorage' in window && window.localStorage[filename]) {
    var filestr = window.localStorage[filename]
    return filestr;
  } else {
    return null; // error
  }
}
// ファイル名でファイルを書き込む
BlocklyStorage.writeLocalStrage= function(filename, filestr) {
  if ('localStorage' in window) {
    window.localStorage.setItem(filename, filestr);
    return filestr;
  } else {
    return null; // error
  }
}

// プロジェクトをオープンする
// project.json が無い場合は、デフォルトを使用する
BlocklyStorage.openProject = function(id) {
  var projectId = id;
  var project = null;
  try {
    project = JSON.parse(BlocklyStorage.readLocalStrage("project.json"));
  } catch (e) {
    console.log("cannot restore:");
  }
  if (project && project.version == "1.0") {
    BlocklyStorage.project = project;
  }
}
/*
BlocklyStorage.readModule = function(mod){
  return `<xml xmlns="https://developers.google.com/blockly/xml">
  <variables>
    <variable >obj</variable>
  </variables>
  <block type="three_createNew"  x="88" y="63">
    <field name="VAR" >obj</field>
    <value name="VALUE">
      <shadow type="three_typeName" >
        <field name="FIELDNAME">sphere</field>
      </shadow>
    </value>
    <next>
      <block type="three_scene_add" >
        <field name="VAR" >obj</field>
        <next>
          <block type="three_moveForward" >
            <field name="VAR" >obj</field>
            <value name="VALUE">
              <shadow type="math_number" >
                <field name="NUM">5</field>
              </shadow>
            </value>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>
`
}
*/

// メニューの更新
function updateProgramMenu() {
  var programs = BlocklyStorage.project.blocks;
  programMenu.options.length = 0;
  for (var i = 0; i < programs.length; i++) {
    var option = new Option(programs[i].name, i);
    if (i == BlocklyStorage.project.selectedIndex) {
      option.selected = true;
    }
    programMenu.options.add(option);
  }
  programMenu.options.add(new Option('（新しく作る）', i));

  // メニュー更新時の処理
  programMenu.addEventListener('change', function(){
    console.log("///////////////change")
    return;
    var programs = BlocklyStorage.project.children;
    console.log("change program：", programMenu.selectedIndex);
    //saveWorkspace();
    BlocklyStorage.project.selectedIndex = programMenu.selectedIndex;
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
      Blockly.loadBlocks();
    }
  }, true);
}

BlocklyStorage.initparam = null;

// ストレージの初期化＆最後の状態を復旧
// programMenu DOM
// canvas DOM
BlocklyStorage.projectInit = function(initparam) {
  console.log(" projectInit !")

  // Populate the language selection menu.
  var programMenu = initparam.selector //: document.getElementById('programMenu'),

  // ワークスペースの初期化
  //Code.workspace.clear();
  BlocklyStorage.openProject(null) // null は「現在のローカルストレージの続き」
  BlocklyStorage.initparam = initparam
  BlocklyStorage.loadProject(BlocklyStorage.initparam.canvas); // プロジェクトの中身を読み込む

  // unload の時に保存する
  window.addEventListener('unload', function() {
    BlocklyStorage.writeLocalStrage("project.json", JSON.stringify(BlocklyStorage.project))
    BlocklyStorage.writeLocalStrage("main.xml", BlocklyStorage.getWorkspaceXml())
  }
  , false);
}

// ファイル - 新規
BlocklyStorage.createnewproject = function(initparam) {
  console.log(" createnewproject !")

  window.localStorage.clear();  // ローカルストレージをクリア
  BlocklyStorage.openProject(null) // null は「現在のローカルストレージの続き」
  BlocklyStorage.loadProject(BlocklyStorage.initparam.canvas); // プロジェクトの中身を読み込む
}

// project の読み込み
BlocklyStorage.loadProject = async function (domElement) {
  console.log("loadBlocks !")
  var projectJson = BlocklyStorage.project;
  var pathprefix = "../"
  // THREE の初期化
  const render = await import(pathprefix + projectJson.render[0].path);
  const scene = render.default(domElement);

  // モジュールをロードする
  THREE.library = {};
  projectJson.modules.forEach(async function(mod) {
    if (!mod.inactive) {
      console.log("load modules:", mod.path)
      var imp = await import(pathprefix + mod.path);
      THREE.library[mod.name] = imp.default;
    }
  });

  // ソースコードを実行する
  projectJson.codes.forEach(async function(mod) {
    if (!mod.inactive) {
      console.log("load codes:", mod.path)
      var group = new THREE.Group();
      var imp = await import(pathprefix + mod.path);
      imp.default(group); // 即時実行
      scene.add(group)
    }
  });
  // canvas を書き直す
  function redrawCanvas() {
    var group = new THREE.Group()
    scene.add(group)

    THREE.scene = group;
    window.addEventListener('onreset', function(e) {
      console.log("onreset!"); // 画面のリセット書き直し
      scene.remove(group);
      //delete group;
      redrawCanvas();
    }, false);
  }
  setTimeout(function() {
    console.log("redrawCanvas !")
    redrawCanvas(); // さいしょの一回目呼び出し
  }, 100);
  // Blockを読み込む
  // ソースコードを実行する
  projectJson.blocks.forEach(async function(mod) {
    if (!mod.inactive) {
      console.log("load blocks:", mod.path)
      var xml = BlocklyStorage.readLocalStrage(mod.path);
      BlocklyStorage.putWorkspaceXml( xml );
    }
  });
}
