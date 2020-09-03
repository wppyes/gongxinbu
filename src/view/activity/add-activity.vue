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
        <el-input v-model="temp.Title" placeholder="请填写标题" :disabled="type==1" />
      </el-form-item>     
      <el-form-item label="图片：" prop="Img">   
        <Uploadimgs v-model="temp.Img" ref="upLoadimg" :disabled="type==1"></Uploadimgs>
        <div class="chicun">尺寸：170*170</div>
      </el-form-item>  
      <el-form-item label="报名区间" prop="StartTime">   
        <el-date-picker
          class="filter-item"
          v-model="baomingtime"
          :disabled="type==1"
          type="daterange"
          align="left"
          unlink-panels
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker> 
      </el-form-item>
      <el-form-item label="活动区间" prop="AStartTime">   
        <el-date-picker
          class="filter-item"
          v-model="huodongtime"
          type="daterange"
          align="left"
          unlink-panels
          :disabled="type==1"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker> 
      </el-form-item>
      <el-form-item label="人数" prop="LimitNum" style="width:500px">
        <el-input v-model="temp.LimitNum" placeholder="请填写可参与人数"  :disabled="type==1" />
      </el-form-item> 
      <el-form-item label="选择地址" prop="County">
          <el-select
            v-model="temp.Province"
            placeholder="省"
            clearable
            style="width: 130px"
            class="filter-item" :disabled="type==1"
            @change="getshi()"
          >
            <el-option v-for="item in citys" :label="item.name" :value="item.code" :key="item.code"></el-option>
          </el-select> 
          <el-select
            v-model="temp.City"
            placeholder="市"
            clearable
            style="width: 130px" :disabled="type==1"
            class="filter-item"
            @change="getqu()"
          >
            <el-option v-for="item in shi" :label="item.name" :value="item.code" :key="item.code"></el-option>
          </el-select> 
          <el-select
            v-model="temp.County"
            placeholder="区"
            clearable
            style="width: 130px" :disabled="type==1"
            class="filter-item"
          >
            <el-option v-for="item in qu" :label="item.name" :value="item.code" :key="item.code"></el-option>
          </el-select> 
      </el-form-item>
      <el-form-item label="地址" prop="Address">
        <el-input v-model="temp.Address" placeholder="请填写地址" :disabled="type==1"/>
      </el-form-item>  
      <el-form-item label="分享图：" prop="CoverImg">   
        <Uploadimgs v-model="temp.CoverImg" ref="upLoadimg" :disabled="type==1"></Uploadimgs>
        <div class="chicun">尺寸：170*170</div>
      </el-form-item>  
      <el-form-item label="分享内容：" prop="ShareContent">
        <el-input v-model="temp.ShareContent" type="textarea" :disabled="type==1" placeholder="请填写分享内容"/>
      </el-form-item>  
      <el-form-item label="提交信息：" prop="DynamicField">
        <el-tag
          v-for="tag in subinfolist"
          :key="tag"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)">
          {{tag}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 提交信息</el-button>
        
        <div class="chicun">默认提交信息为姓名，手机号码，其它需要添加的可以点击后面【+ 提交信息】按钮自助添加</div>
      </el-form-item>
      <el-form-item label="内容" prop="Describe" style="width:1100px" :disabled="type==1">
        <Tinymce ref="editor" v-model="temp.Describe" :key="tinymceFlag" :height="500" />
      </el-form-item>
    </el-form>
    <el-button type="primary" style="margin-left:170px"@click="createData" v-if="type!=1">确定</el-button>
  </div>
</template>
<script>
import request from "@/utils/request";
import Tinymce from '@/components/Tinymce';
import Uploadimgs from '@/components/Uploadqiniu/single';
import citys from '@/utils/city.json'
export default {
  name: "addproduct",
  components: {Tinymce,Uploadimgs },
  data() {
    return {
      temp: {
        Id: 0,
        Title:'',
        Img:'',
        StartTime:'',
        EndTime:'',
        AStartTime:'',
        AEndTime:'',
        LimitNum:'',
        Province:'',
        City:'',
        County:'',
        Address:'',
        Describe:'',
        CoverImg:'',
        ShareContent:'',
        DynamicField: '', 
      },
      type:'',
      tinymceFlag:1,
      baomingtime:'',
      huodongtime:'',
      rules: {
        Title: [
          { required: true, message: "标题必须填写！", trigger: "blur" }
        ],
        Img: [
          { required: true, message: "图片必须填写！", trigger: "blur" }
        ],
        StartTime: [
          { required: true, message: "活动报名区间必须选择！", trigger: "blur" }
        ],
        AStartTime: [
          { required: true, message: "活动举行区间必须选择！", trigger: "blur" }
        ],
        LimitNum: [
          { required: true, message: "参与人数必须填写！", trigger: "blur" }
        ],
        County: [
          { required: true, message: "地址必须选择！", trigger: "blur" }
        ],
        Address: [
          { required: true, message: "详细地点必须填写！", trigger: "blur" }
        ],
        Describe: [
          { required: true, message: "内容必须填写！", trigger: "change" }
        ],
        CoverImg: [
          { required: true, message: "分享图片必须上传！", trigger: "blur" }
        ],
        ShareContent: [
          { required: true, message: "分享内容必须填写！", trigger: "blur" }
        ],
        DynamicField: [
          { required: true, message: "用户需要提交的信息必须添加！", trigger: "blur" }
        ],
      },  
      citys:[],
      shi:[],
      qu:[], 
      subinfolist:["姓名","手机号码"],
      inputVisible: false,
      inputValue: ''
    };
  },
  created() {
    this.temp.Id = this.$route.query.id; 
    this.type=this.$route.query.type;
    this.citys=citys;
    if(this.temp.Id==0){
      this.temp.Title = '';
      this.temp.Img = '';
      this.temp.StartTime = '';
      this.temp.EndTime = '';
      this.temp.AStartTime = '';
      this.temp.AEndTime = '';
      this.temp.LimitNum = '';
      this.temp.Province = '';
      this.temp.City = '';
      this.temp.County = '';
      this.temp.Address = '';
      this.temp.Describe = '';
      this.temp.CoverImg = '';
      this.temp.ShareContent = '';
      this.temp.DynamicField = '';
    }else{
      this.getdetail()
    }
  },
  watch: {
    baomingtime(val, oldval) {
      if(val){
        this.temp.StartTime = val[0];
        this.temp.EndTime = val[1];
      }else{
        this.temp.StartTime='';
        this.temp.EndTime='';
      }
    },
    huodongtime(val, oldval) {
      if(val){
        this.temp.AStartTime = val[0];
        this.temp.AEndTime = val[1];
      }else{
        this.temp.AStartTime='';
        this.temp.AEndTime='';
      }
    }
  },
  methods: {
    handleClose(tag) {
      this.subinfolist.splice(this.subinfolist.indexOf(tag), 1);      
      this.temp.DynamicField = JSON.stringify(this.subinfolist);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.subinfolist.push(inputValue);        
        this.temp.DynamicField = JSON.stringify(this.subinfolist);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    getdetail() {
      request({
        url: "Activity/GetActivity",
        method: "get",
        params: { id: this.temp.Id }
      }).then(response => {
        if (response.Status == 1) {
          this.temp.Title=response.Model.Title;  
          this.temp.Img = response.Model.Img;
          this.temp.StartTime = response.Model.StartTimeStr;
          this.temp.EndTime = response.Model.EndTimeStr;
          this.temp.AStartTime = response.Model.AStartTimeStr;
          this.temp.AEndTime = response.Model.AEndTimeStr;
          this.temp.LimitNum = response.Model.LimitNum;
          this.temp.Province = response.Model.Province.toString();
          this.temp.Address = response.Model.Address;
          this.temp.Describe = response.Model.Describe;
          this.temp.CoverImg = response.Model.CoverImg;
          this.temp.ShareContent = response.Model.ShareContent;
          this.temp.DynamicField = response.Model.DynamicField;  
          this.subinfolist=JSON.parse(this.temp.DynamicField);
          this.baomingtime=[new Date(response.Model.StartTimeStr),new Date(response.Model.EndTimeStr)]; 
          this.huodongtime=[new Date(response.Model.AStartTimeStr),new Date(response.Model.AEndTimeStr)];   
          this.$refs.editor.setContent(response.Model.Describe);          
          this.getshi(true);
          this.temp.City =response.Model.City.toString();
          this.getqu(true);
          this.temp.County = response.Model.County.toString();
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        }
      });
    },    
    getshi(bo){      
      for(let i in this.citys){
        if(this.citys[i].code==this.temp.Province){
          this.shi=this.citys[i].cityList;  
          if(!bo){
            this.temp.City='';
            this.temp.County='';
          }
          break;
        }
      }
    },
    getqu(bo){
      for(let i in this.shi){
        if(this.shi[i].code==this.temp.City){
          this.qu=this.shi[i].areaList;
           if(!bo){
            this.temp.County='';
          }
          break;
        }        
      }
    },
    backto() {   
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.$router.go(-1);
    },
    createData() {
      this.temp.DynamicField = JSON.stringify(this.subinfolist);
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var data = this.$qs.stringify(this.temp);
          request({
            url: "Activity/SetActivity",
            method: "post",
            data
          }).then(response => {
            if (response.Status == 1) {  
              this.$bus.$emit("activitychange");
              this.$message({
                message: response.Msg,
                type: "success"
              });                 
              if(this.temp.Id==0){
                this.temp.Title = '';
                this.temp.Img = '';
                this.temp.StartTime = '';
                this.temp.EndTime = '';
                this.temp.AStartTime = '';
                this.temp.AEndTime = '';
                this.temp.LimitNum = '';
                this.temp.Province = '';
                this.temp.City = '';
                this.temp.County = '';
                this.temp.Address = '';
                this.temp.Describe = '';
                this.temp.CoverImg = '';
                this.temp.ShareContent = '';
                this.temp.DynamicField = '';
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
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  
  .chicun {
    color: #f00;
  }
}
</style>
