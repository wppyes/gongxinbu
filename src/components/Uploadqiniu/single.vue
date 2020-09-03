<template>
<div>
    <el-upload
      class="avatar-uploader"
      ref="upload"
      :show-file-list="false"
      accept=".jpg, .png"
      action
      :http-request="upLoad" 
    >
      <img v-if="value" :src="value" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
</div>
</template>

<script>
import * as qiniu from "qiniu-js";
import request from "@/utils/request";
export default {
  name: 'uploadone',
  props: {
    value: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      qiniu:{
        token:'',
        Domain:''
      },
    }
  },
  computed: {
  },
  watch: {    
  },
  created() {
    this.getTocken();
  },
  methods: {
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
    upLoad(param){
      var keys=''   
      const isJPG = param.file.type === "image/jpeg";
      const isPNG = param.file.type === "image/png";
      if(isJPG){
        keys=new Date().getTime()+'.jpg'
      } if(isPNG){
        keys=new Date().getTime()+'.png'
      }
      const key = keys;
      const token = this.qiniu.token; //从服务器拿的并存在本地data里
      const putExtra = {
        fname: '',
        params: {},
        mimeType: ['image/png', 'image/jpeg', 'image/gif'],
      };
      const config = {
        useCdnDomain: true, //使用cdn加速
      };
      const observable = qiniu.upload(param.file, key, token, putExtra, config);
      observable.subscribe({
        next: (result) => {
          console.warn(result);
        },
        error: () => {
          this.$notify('上传图片失败');
        },
        complete: (res) => {
          var str=this.qiniu.Domain+'/'+res.key;
          this.$emit('input', str)
        },
      });
    },
    subimgs(){
      this.$refs.upload.submit();   
    },
    clearimgs(){
      this.$refs.upload.clearFiles();
    },
  }
}
</script>

<style scoped>
</style>
