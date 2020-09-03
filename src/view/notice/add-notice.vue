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
      <el-form-item label="标题" prop="Title" style="width:1100px">
        <el-input v-model="temp.Title" placeholder="请填写标题" />
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
export default {
  name: "addproduct",
  components: {Tinymce},
  data() {
    return {
      temp: {
        Id: 0,
        Type:0,
        Title:'',
        Content: '', 
      },
      tinymceFlag:1,
      rules: {
        Title: [
          { required: true, message: "标题必须填写！", trigger: "blur" }
        ],
        Content: [
          { required: true, message: "内容必须填写！", trigger: "change" }
        ],
      },  
    };
  },
  created() {
    this.temp.Id = this.$route.query.id;
    if(this.temp.Id==0){
      this.temp.Title = '';
      this.temp.Content = '';
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
          this.temp.Title=response.Model.Title;
          this.temp.Content=response.Model.Content;
          this.$refs.editor.setContent(response.Model.Content);                
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
            Type:0,
            Title:this.temp.Title,
            Content:this.temp.Content
          }
          var data = this.$qs.stringify(param);
          request({
            url: "News/SetNews",
            method: "post",
            data
          }).then(response => {
            if (response.Status == 1) {  
              this.$bus.$emit("noticechange");
              this.$message({
                message: response.Msg,
                type: "success"
              });    
              if(this.temp.Id==0){
                this.temp.Title = '';
                this.temp.Content = '';
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
