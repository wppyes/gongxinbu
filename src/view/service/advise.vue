<template>
  <div class="advise boxright">
    <div class="filter-container">
      <el-input
        placeholder="请输入标题"
        v-model="listQuery.title"
        style="width: 150px;"
        class="filter-item"
        clearable
      />  
      
      <el-select
        v-model="listQuery.type"
        placeholder="分类"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option v-for="item in CategoryList" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
      </el-select>
      <el-select
        v-model="listQuery.status"
        placeholder="状态"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option v-for="item in StatusList" :label="item.Text" :value="item.Value" :key="item.Value"></el-option>
      </el-select>
        <el-date-picker
        class="filter-item"
        v-model="times"
        type="daterange"
        align="left"
        unlink-panels
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
      ></el-date-picker>  
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>   
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="内容" align="left" prop="Details" width="400px"></el-table-column> 
      <el-table-column label="时间" align="center" prop="CreatedStr" width="180px"></el-table-column>
      <el-table-column label="状态" align="center" prop="ReplyTimeStr" width="180px">
        <template slot-scope="scope">
          <span v-text="setstatus(scope.row.Status)" :class="'status'+scope.row.Status"></span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handledel(scope.row,2,'受理')" v-if="scope.row.Status==1">
            受理
          </el-button>
          <el-button size="mini" type="primary" @click="handledel(scope.row,4,'完成')" v-if="scope.row.Status==3">
            确认完成
          </el-button>
          <el-button size="mini" type="primary" @click="huifu(scope.row)">
            回复
          </el-button>
          <el-button size="mini" type="danger" @click="handledel(scope.row,5,'删除')" >
            <i class="el-icon-delete"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table> 

    <pagination
      small
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
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
        type:'',
        title:'',
        starttime:'',
        endtime:'',
        status:''
      },
      times:'',
      isreplay:'',
      CategoryList:[],
      StatusList:[],
      imgs:[],
    };
  },
  created() {        
    request({
      url: "Complaint/GetDDL",
      method: "get",
      params: {}
    }).then(response => {
      if (response.Status == 1) {
        this.CategoryList=response.List;
        this.StatusList=response.StatusList;
      }
    });
    this.getList(); 
  },
  mounted () {
  },  
  watch: {
    times(val, oldval) {
      if(val){
        this.listQuery.starttime = val[0];
        this.listQuery.endtime = val[1];
      }else{
        this.listQuery.starttime='';
        this.listQuery.endtime='';
      }
    }
  },
  methods: {
    getList(){
      this.listLoading = true;
      request({
        url: "Complaint/GetComplaintList",
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
    setstatus(code){
      for(let i in this.StatusList){
        if(this.StatusList[i].Value == code){
          return this.StatusList[i].Text;
        }
      }
    },
    handleFilter() {
      this.listQuery.pageIndex = 1;
      this.getList();
    },   
    handledel(row,type,title) {
      var data = this.$qs.stringify({ Id: row.Id,status:type});
      this.$confirm("确定要"+title+"该意见吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "Complaint/Update",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              if(type==5){

                const index = this.list.indexOf(row);
                this.list.splice(index, 1);
              }else{
                row.Status=type;
              }
                this.$message({
                    message: response.Msg,
                    type: "success"
                });
            }
          });
        })
        .catch(() => {});
    }, 
    huifu(row){
      this.$router.push({
        path: "/service/advise/huifu",
        query: { id:row.Id }
      });
    },
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
}
</style>
