<template>
  <div class="advise boxright">
    <div class="back">
      <span @click="backto">
        <i class="el-icon-arrow-left"></i>返回
      </span>
    </div>
    <div class="neirong">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>意见内容</span>
        </div>
        <div>{{Model.Details}}</div>
        <div>
            <el-image v-for="item in imgs"
                style="width: 80px; height: 80px; margin:10px"
                :src="item" 
                :key="item"
                :preview-src-list="imgs">
              </el-image>
        </div>
        <div style="color:#999; font-size:12px;">{{Model.CreatedStr}}</div>
        <el-divider content-position="left">处理进度</el-divider>
          <el-steps :active="Model.Status" align-center="">
            <el-step title="已提交" :description="Model.Status>0?Model.CreatedStr:'' "></el-step>
            <el-step title="已受理" :description="Model.Status>1?Model.GoTimeStr:'' "></el-step>
            <el-step title="处理中" :description="Model.Status>2?Model.HandleTimeStr:'' "></el-step>
            <el-step title="已完成" :description="Model.Status>3?Model.EndTimeStr:'' "></el-step>
          </el-steps>
      </el-card>
      <el-card class="box-card1">
        <div slot="header" class="clearfix">
          <el-button type="primary" @click="huifu">回复</el-button>  
        </div>   
        <ul class="huifu-ul">
          <li v-for="item in list">
            <div><b :class="item.Type==0?'status1':'status3'">{{item.Type==0?'用户':'系统'}}</b>：{{item.Content}}</div> 
            {{item.CreatedStr}} 
            <span><i class="el-icon-delete" @click="handledel(item)"></i></span>
          </li>  
        </ul>           
          <pagination
            small
            :total="total"
            :page.sync="listQuery.pageIndex"
            :limit.sync="listQuery.pageSize"
            @pagination="getList"
          />
      </el-card>
    </div>

    
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="710px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 600px; margin-left:10px;"
      >
        <el-form-item label="回复：" prop="Content">
          <el-input type="textarea" v-model="temp.Content" placeholder="请填写回复内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="subreplay">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import Pagination from "@/components/Pagination";
export default {
  name: "advise",
  components: { Pagination },
  data() {
    return {
      list: [], //列表
      total:0,//总数量
      listLoading: false, //列表加载
      listQuery: {
        pageIndex: 1,
        pageSize: 15,
        cid:''
      },
      Model:{},
      dialogFormVisible:false,
      dialogStatus:'',
      imgs:[],
      temp:{
        CId:'',
        Content:''
      },      
      rules: {
        Content: [
          { required: true, message: "回复内容必须填写！", trigger: "blur" }
        ],
      }
    };
  },
  created() {      
    this.listQuery.cid=this.$route.query.id;
    this.temp.CId=this.$route.query.id;
    request({
      url: "Complaint/GetComplaint",
      method: "get",
      params: {id:this.$route.query.id}
    }).then(response => {
      if (response.Status == 1) {
        this.Model=response.Model;        
        if(this.Model.Img){
          this.imgs=JSON.parse(this.Model.Img)
        }
      }
    });
    this.getList(); 
  },
  mounted () {
  }, 
  methods: {
    getList(){
      this.listLoading = true;
      request({
        url: "Complaint/GetComplaintReplyList",
        method: "get",
        params: this.listQuery
      }).then(response => {
        if (response.Status == 1) {
          this.list = response.List;
          this.total = response.PageCount;
          this.listLoading = false;
        }
      });
    },
    handleFilter() {
      this.listQuery.pageIndex = 1;
      this.getList();
    },   
    handledel(row,type,title) {
      var data = this.$qs.stringify({ Id: row.Id});
      this.$confirm("确定要删除该回复吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "Complaint/Del",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              const index = this.list.indexOf(row);
                this.list.splice(index, 1);
                this.$message({
                    message: response.Msg,
                    type: "success"
                });
            }
          });
        })
        .catch(() => {});
    }, 
    backto() {      
      this.$router.go(-1);
    },
    huifu(){
      this.temp.Content='';
      this.dialogFormVisible=true;
      this.dialogStatus='回复';
       this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    subreplay(){      
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var data = this.$qs.stringify(this.temp);
          request({
            url: "Complaint/SetComplaintReply",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              var param={
                Id:response.Id,
                CID:this.temp.CID,
                Content:this.temp.Content,
                CreatedStr:'刚刚'
              }
              this.list.unshift(param)
              this.dialogFormVisible = false;
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.advise{
  .status3{color:#F56C6C;}
  .status0{color:#67C23A;}
  .status1{color:#E6A23C;}
  .status2{color:#409EFF;}
  .status4{color:#909399;}
  .neirong{line-height: 28px; display: flex; justify-content: space-between;}
  .box-card{width: 40%;}
  .box-card1{width: 58%;}
  .huifu-ul{list-style: none; color: #999; font-size: 13px;}
  .huifu-ul div{color: #333; font-size: 14px;}
  .huifu-ul li{border-bottom: 1px solid #ebebeb; position: relative; padding: 10px 0;}
  .huifu-ul li span{position: absolute; right: 0; bottom: 0; color: #F56C6C; cursor: pointer;}
}
</style>
