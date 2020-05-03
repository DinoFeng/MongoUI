<template lang="pug">
  //- <div class="ace-container">
  //-   <div class="ace-editor" ref="ace"></div>

  //-   <div class="config-panel" v-show="toggle">
  //-     <div>
  //-       <div class="item">
  //-         <label class="title">语言</label>
  //-         <el-select class="value" v-model="modePath" @change="handleModelPathChange" size="mini" value-key="name">
  //-           <el-option v-for="mode in modeArray" :key="mode.name" :label="mode.name" :value="mode.path"></el-option>
  //-         </el-select>
  //-       </div>

  //-       <div class="item">
  //-         <label class="title">换行</label>
  //-         <el-select class="value" v-model="wrap" @change="handleWrapChange" size="mini" value-key="name">
  //-           <el-option v-for="wrap in wrapArray" :key="wrap.name" :label="wrap.name" :value="wrap.value"></el-option>
  //-         </el-select>
  //-       </div>
  //-     </div>
  //-   </div>

  //-   <div class="bookmarklet" @click="toggleConfigPanel"></div>
  //- </div>
  .ace-container
    .ace-editor(ref='ace')
    //- .config-panel(v-show='toggle')
      div
        .item
          label.title language
          el-select.value(v-model='modePath', @change='handleModelPathChange', size='mini', value-key='name')
            el-option(v-for='mode in modeArray', :key='mode.name', :label='mode.name', :value='mode.path')
        .item
          label.title &#x6362;&#x884C;
          el-select.value(v-model='wrap', @change='handleWrapChange', size='mini', value-key='name')
            el-option(v-for='wrap in wrapArray', :key='wrap.name', :label='wrap.name', :value='wrap.value')
    //- .bookmarklet(@click='toggleConfigPanel')

</template>

<script>
// import ace from 'ace-builds'
// import 'ace-builds/src-noconflict/snippets/javascript'
// import 'ace-builds/src-noconflict/snippets/html'
// import 'ace-builds/src-noconflict/snippets/css'
// import 'ace-builds/src-noconflict/snippets/scss'
// import 'ace-builds/src-noconflict/snippets/json'
// import 'ace-builds/src-noconflict/snippets/java'
// import 'ace-builds/src-noconflict/snippets/text'
// import 'ace-builds/webpack-resolver'
// import 'ace-builds/src-noconflict/ext-language_tools'
// import 'ace-builds/src-noconflict/theme-monokai'
// import 'ace-builds/src-noconflict/mode-javascript'

// const themeArray = [{
//   name: 'monokai',
//   path: 'ace/theme/monokai'
// }]

// const wrapArray = [
//   {
//     name: '开启',
//     value: true,
//   },
//   {
//     name: '关闭',
//     value: false,
//   },
// ]

// const modeArray = [
//   {
//     name: 'JavaScript',
//     path: 'ace/mode/javascript',
//   },
//   {
//     name: 'HTML',
//     path: 'ace/mode/html',
//   },
//   {
//     name: 'CSS',
//     path: 'ace/mode/css',
//   },
//   {
//     name: 'SCSS',
//     path: 'ace/mode/scss',
//   },
//   {
//     name: 'Json',
//     path: 'ace/mode/json',
//   },
//   {
//     name: 'Java',
//     path: 'ace/mode/java',
//   },
//   {
//     name: 'Text',
//     path: 'ace/mode/text',
//   },
// ]

export default {
  name: 'aceEditor',
  props: {
    value: String,
    theme: String,
    mode: String,
    maxLines: Number,
    minLines: Number,
    fontSize: Number,
    wrap: Boolean,
    tabSize: Number,
    readonly: Boolean,
  },
  mounted() {
    const theme = this.theme || 'chrome'
    const mode = this.mode || 'javascript'
    const maxLines = this.maxLines || 20
    const minLines = this.minLines || 5
    const fontSize = this.fontSize || 14
    const wrap = this.wrap || false
    const tabSize = this.tabSize || 4
    const ace = require('ace-builds')
    require('ace-builds/webpack-resolver')
    require('ace-builds/src-noconflict/ext-language_tools')
    require(`ace-builds/src-noconflict/theme-${theme}`)
    require(`ace-builds/src-noconflict/mode-${mode}`)
    require(`ace-builds/src-noconflict/snippets/${mode}`)

    this.aceEditorSetting = {
      maxLines,
      minLines,
      fontSize,
      value: this.value ? this.value : '',
      theme: `ace/theme/${theme}`,
      mode: `ace/mode/${mode}`,
      wrap,
      tabSize,
    }
    // console.debug(this.aceEditorSetting)
    this.aceEditor = ace.edit(this.$refs.ace, this.aceEditorSetting)
    // 激活自动提示
    this.aceEditor.setOptions({
      enableSnippets: true,
      enableLiveAutocompletion: true,
      enableBasicAutocompletion: true,
    })
    this.aceEditor.setReadOnly(this.readonly)
    this.aceEditor.getSession().on('change', this.change)
  },
  data() {
    return {
      aceEditor: null,
      aceEditorSetting: {},
      // toggle: false,
      // themePath: 'ace/theme/clouds',
      // modePath: 'ace/mode/javascript',
      // modeArray: modeArray,
      // wrapArray: wrapArray,
    }
  },
  methods: {
    // toggleConfigPanel() {
    //   this.toggle = !this.toggle
    // },
    change() {
      this.$emit('input', this.aceEditor.getSession().getValue())
    },
    // handleModelPathChange(modelPath) {
    //   this.aceEditor.getSession().setMode(modelPath)
    // },
    // handleWrapChange(wrap) {
    //   this.aceEditor.getSession().setUseWrapMode(wrap)
    // },
  },
  watch: {
    maxLines: {
      handler: function(val) {
        const setting = Object.assign({}, this.aceEditorSetting, { maxLines: val })
        this.aceEditor.setOptions(setting)
        this.aceEditorSetting = setting
        // this.aceEditor.setOptions({ maxLines: val })
      },
    },
    minLines: {
      handler: function(val) {
        const setting = Object.assign({}, this.aceEditorSetting, { minLines: val })
        this.aceEditor.setOptions(setting)
        this.aceEditorSetting = setting
        // this.aceEditor.setOptions({ minLines: val })
      },
    },
    value: {
      handler: function(val, old) {
        // console.debug({ val })
        if (val !== old) {
          const position = this.aceEditor.getCursorPosition()
          this.aceEditor.getSession().setValue(val)
          this.aceEditor.moveCursorToPosition(position)
        }
        // this.aceEditor.setValue(val)
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.ace-container {
  position: relative;

  .config-panel {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 50%;
    height: 100%;
    overflow: scroll;
    box-shadow: grey -5px 2px 3px;
    background-color: rgba(255, 255, 255, 0.5);
    z-index: 1;

    .item {
      margin: 10px auto;
      text-align: center;

      .title {
        color: white;
        margin: 0 10px;
        font-size: 14px;
      }
    }
  }

  .bookmarklet {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 20px;
    height: 20px;
    z-index: 2;
    cursor: pointer;
    border-width: 9px;
    border-style: solid;
    border-color: lightblue gray gray rgb(206, 173, 230);
    border-image: initial;
  }
}
</style>
