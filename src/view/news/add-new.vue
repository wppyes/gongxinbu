<template>
  <div class="addproduct boxright">
    <div class="back">
      <span @click="backto">
        <i class="el-icon-arrow-left"></i>返回
      </span>
    </div>
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="left"
      label-width="150px"
      style="width: 1100px; margin-left:20px;"
    >    
      <el-form-item label="分类" prop="Classify" style="width:500px">
        <el-select
          v-model="temp.Classify"
          placeholder="选择分类"
          clearable
          style="width: 150px"
          class="filter-item"
        >
          <el-option v-for="item in CategoryList" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="Title" style="width:1100px">
        <el-input v-model="temp.Title" placeholder="请填写标题" />
      </el-form-item>   
      <el-form-item label="描述" prop="Details" style="width:1100px">
        <el-input type="textarea" v-model="temp.Details" placeholder="请填写描述" />
      </el-form-item>          
      <el-form-item label="图片：" prop="Img" v-if="temp.Classify==2">   
        <Uploadimgs v-model="temp.Img" ref="upLoadimg"></Uploadimgs>
        <div class="chicun">尺寸：170*170</div>
      </el-form-item>
      <el-form-item label="内容" prop="Content" style="width:1100px">
        <Tinymce ref="editor" v-model="temp.Content" :key="tinymceFlag" :height="500" />
      </el-form-item>
    </el-form>
    <el-button type="primary" style="margin-left:170px" @click="createData">确定</el-button>
  </div>
</template>
<script>
import request from "@/utils/request";
import Tinymce from '@/components/Tinymce';
import Uploadimgs from '@/components/Uploadqiniu/single';
export default {
  name: "addproduct",
  components: {Tinymce,Uploadimgs},
  data() {
    return {
      temp: {
        Id: 0,
        Type:1,
        Title:'',
        Content: '', 
        Classify:'',
        Img:'',
        Details:''
      },
      tinymceFlag:1,
      rules: {        
        Classify: [
          { required: true, message: "分类必须选择！", trigger: "blur" }
        ],
        Title: [
          { required: true, message: "标题必须填写！", trigger: "blur" }
        ],
        Content: [
          { required: true, message: "内容必须填写！", trigger: "change" }
        ],
        Details: [
          { required: true, message: "描述必须填写！", trigger: "change" }
        ],
        Img: [
          { required: true, message: "图片必须上传！", trigger: "change" }
        ],
      },       
      CategoryList:[] 
    };
  },
  created() {       
    request({
      url: "News/GetDDL",
      method: "get",
      params: {}
    }).then(response => {
      if (response.Status == 1) {
        this.CategoryList=response.List;
      }
    });
    this.temp.Id = this.$route.query.id;
    if(this.temp.Id==0){
      this.temp.Title = '';
      this.temp.Content = '';
      this.temp.Classify = '';
      this.temp.Img = '';
      this.temp.Details = '';      
    }else{
      this.getdetail()
    }
  },
  methods: {
    getdetail() {
      request({
        url: "News/GetNews",
        method: "get",
        params: { id: this.temp.Id }
      }).then(response => {
        if (response.Status == 1) {
          if(response.Model.Title){            
            this.temp.Title=response.Model.Title;
            this.temp.Content=response.Model.Content;     
            this.temp.Details=response.Model.Details;     
            this.temp.Classify=response.Model.Classify.toString();    
            this.temp.Img = response.Model.Img;  
            this.$refs.editor.setContent(response.Model.Content);  
          } 
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        }
      });
    },
    backto() {        
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.$router.go(-1);
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var param={
            Id: this.temp.Id,
            Type:this.temp.Type,
            Title:this.temp.Title,
            Content:this.temp.Content,
            Img:this.temp.Img,
            Details:this.temp.Details
          }
          var data = this.$qs.stringify(param);
          request({
            url: "News/SetNews",
            method: "post",
            data
          }).then(response => {
            if (response.Status == 1) {  
              this.$bus.$emit("newschange");
              this.$message({
                message: response.Msg,
                type: "success"
              }); 
              if(this.temp.Id==0){
                this.temp.Title = '';
                this.temp.Content = '';
                this.temp.Classify = '';
                this.temp.Img = '';
                this.temp.Details = '';  
                this.$refs.editor.setContent('');
              }   
              this.backto();
            }
          });
        }
      });
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.addproduct {
  .chicun {
    color: #f00;
  }
  .ql-container {
    height: 180px;
  }
  .imgs li{list-style: none; position: relative; display: inline-block; margin: 0 20px 10px 0;}
  .imgs li img{width: 100px; height: 100px; border: 1px solid #f2f2f2;}
  .imgs .el-icon-delete{position:absolute; right: -5px; top: -5px; cursor: pointer; color: #f00;} 
  .imgs{display: flex; flex-wrap: wrap;}
  .margin-top{margin-top: 20px;}
  .height1{height: 10px;}
  .inpput-out{display: inline-block; margin: 0 10px 10px 0; position: relative;}
  .guige .el-icon-delete{position:absolute; right: -5px; top: -5px; cursor: pointer; color: #f00;}
  .el-upload-list__item {
    transition: none !important;
  } 
}
</style>
