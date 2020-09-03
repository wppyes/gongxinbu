<template>
<div>
    <el-upload
      ref="upLoadimg"
      list-type="picture-card"
      :show-file-list="true"
      accept=".jpg, .png"
      action
      :multiple="true"
      :limit="5"
      :on-remove="handleRemove"
      :http-request="upLoadimg"
      :on-change="changes"
      :file-list="piclist"
    >
      <i class="el-icon-plus avatar-uploader-icon"></i>            
    </el-upload>
</div>
</template>

<script>
import * as qiniu from "qiniu-js";
import request from "@/utils/request";
export default {
  name: 'loadread',
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
      piclist:[],
    }
  },
  computed: {
  },
  mounted(){
  },
  watch: {
    value(){
      let arr=JSON.parse(this.value);
      this.piclist=[];
      for(let i in arr){
        let param={
           url:arr[i]
        };
        this.piclist.push(param)
      }
    }
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
    handleRemove(file, fileList) {
      for(let i in this.piclist){
        if(this.piclist[i].url==file.url){
          this.piclist.splice(i,1);          
          this.getpicids();
          break
        }
      }
    },
    changes(file, fileList){
    },
    upLoadimg(param){
      let paramimg={
        url:''
      };  
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
          paramimg.url=this.qiniu.Domain+'/'+res.key;
          this.piclist.push(paramimg);            
          this.getpicids();
        },
      });
    },
    subimgs(){
      this.$refs.upLoadimg.submit();   
    },
    clearimgs(){
      this.$refs.upLoadimg.clearFiles();
    },
    getpicids(){
      var str=[];
      for(let i in this.piclist){
          str.push(this.piclist[i].url)
      };
      let sters=JSON.stringify(str)
      this.$emit('input', sters);
    },
  }
}
</script>

<style scoped>
.el-upload-list__item {
  transition: none !important;
}
</style>
