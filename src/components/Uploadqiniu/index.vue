<template>
<div>
    <el-upload
      ref="upLoadimg"
      list-type="picture-card"
      :show-file-list="true"
      accept=".jpg, .png"
      action
      :multiple="true"
      :limit="9"
      :on-remove="handleRemove"
      :http-request="upLoadimg"
      :on-change="changes"
      :auto-upload="false"
    >
      <i class="el-icon-plus avatar-uploader-icon"></i>            
    </el-upload>
</div>
</template>

<script>
import * as qiniu from "qiniu-js";
import request from "@/utils/request";
var imglegth,templength=0,str='';
export default {
  name: 'Tinymce',
  props: {
    Imgsub:Function,
    Img:Array
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
    handleRemove(file, fileList) {
      imglegth=fileList.length;
    },
    changes(file, fileList){
      imglegth=fileList.length;
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
          templength++;
          paramimg.url=this.qiniu.Domain+'/'+res.key;
          this.piclist.push(paramimg);            
          this.getpicids();
          if(imglegth==templength){
            this.Imgsub(str);
            imglegth=0;
            templength=0;
            this.piclist=[];
          }
        },
      });
    },
    subimgs(){
      if(imglegth==0){
        this.Imgsub('');
      }else{
        this.$refs.upLoadimg.submit();
      }      
    },
    clearimgs(){
      this.$refs.upLoadimg.clearFiles();
    },
    getpicids(){
      str='';
      for(let i in this.piclist){
          str+=this.piclist[i].url+','
      };
      str=str.substring(0,str.length-1);
    },
  }
}
</script>

<style scoped>
</style>
