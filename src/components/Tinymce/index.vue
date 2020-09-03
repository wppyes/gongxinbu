<template>
<div>
    <textarea :id="tinymceId"></textarea>
</div>
</template>

<script>
import plugins from './plugins'
import toolbar from './toolbar'
import * as qiniu from "qiniu-js";
import request from "@/utils/request";
export default {
  name: 'Tinymce',
  props: {
    id: {
      type: String,
      default: function() {
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    menubar: {
      type: String,
      default: 'file edit insert view format table'
    },
    height: {
      type: [Number, String],
      required: false,
      default: 200
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    }
  },
  data() {
    return {
      tinymceFlag:1,
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      languageTypeList: {
        'en': 'en',
        'zh': 'zh_CN'
      },      
      qiniu:{
        token:'',
        Domain:''
      },
      flag:true
    }
  },
  created(){    
    this.getTocken();
  },
  computed: {
    containerWidth() {
      const width = this.width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
        return `${width}px`
      }
      return width
    }
  },
  watch: {
    value(val) {  
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() =>{
          window.tinymce.get(this.tinymceId).setContent(val || '')
      })}
    }
  },
  mounted() {
    this.initTinymce()
  },
  activated() {
    this.tinymceFlag++;
    if (window.tinymce) {
      this.initTinymce()
    }
  },
  deactivated() {
    this.destroyTinymce();
  },
  destroyed() {
    this.destroyTinymce()
  },
  methods: {
    init() {
    },
    initTinymce() {
      const _this = this
      tinymce.init({
        selector: `#${this.tinymceId}`,
        language: this.languageTypeList['zh'],
        height: this.height,
        body_class: 'panel-body ',
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        plugins: plugins,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 350,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        default_link_target: '_blank',
        link_title: false,
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        init_instance_callback: editor => {
          if (_this.value) {
            editor.setContent(_this.value)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('input', editor.getContent())
          })
        },
        setup(editor) {
          editor.on('FullscreenStateChanged', (e) => {
            _this.fullscreen = e.state
          })
        },
        images_upload_handler: function (blobInfo, succFun, failFun) {
            var xhr, formData;
            var file = blobInfo.blob();//转化为易于理解的file对象          
            var keys=''   
            const isJPG = file.type === "image/jpeg";
            const isPNG = file.type === "image/png";
            if(isJPG){
              keys=new Date().getTime()+'.jpg'
            } if(isPNG){
              keys=new Date().getTime()+'.png'
            }
            const key = keys;
            const token = _this.qiniu.token; //从服务器拿的并存在本地data里
            const putExtra = {
              fname: '',
              params: {},
              mimeType: ['image/png', 'image/jpeg', 'image/gif'],
            };
            const config = {
              useCdnDomain: true, //使用cdn加速
            };
            const observable = qiniu.upload(file, key, token, putExtra, config);
            observable.subscribe({
              next: (result) => {
                console.warn(result);
              },
              error: () => {
                this.$notify('上传图片失败');
              },
              complete: (res) => {
                var str=_this.qiniu.Domain+'/'+res.key;
                succFun(str);
              },
            });
        },
      })
    },    
    getTocken() {
       request({
          url: "Upload/GetToken",
          method: "get",
          params: {}
        }).then(response => {
          if (response.Status == 1) {
            this.qiniu.token=response.Token;
            this.qiniu.Domain=response.Domain;
          }
        });
    },
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId)
      if (this.fullscreen) {
        tinymce.execCommand('mceFullScreen')
      }

      if (tinymce) {
        tinymce.destroy()
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent()
    },
  }
}
</script>

<style scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}
.tinymce-container>>>.mce-fullscreen {
  z-index: 10000;
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}
.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}
.editor-upload-btn {
  display: inline-block;
}
</style>
