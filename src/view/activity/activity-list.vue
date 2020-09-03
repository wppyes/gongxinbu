<template>
  <div class="activity boxright">
    <div class="filter-container">
      <div class="filter-item" style="margin-right:20px;">
        <el-button type="primary" @click="linktoadd(0)">
          <i class="el-icon-circle-plus"></i> 增加活动
        </el-button>
      </div>
      <el-input
        placeholder="请输入标题"
        v-model="listQuery.title"
        style="width: 150px;"
        class="filter-item"
        clearable
      />  
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
      <el-table-column label="标题" align="left" prop="Title" width="350px"></el-table-column>
      <el-table-column label="可参加人数" align="center" prop="LimitNum" width="100px"></el-table-column> 
      <el-table-column label="已参加人数" align="center" prop="Count" width="100px"></el-table-column> 
      <el-table-column label="报名时间" align="center" prop="Count" width="180px">
        <template slot-scope="scope">
          {{scope.row.StartTimeStr +' - '+scope.row.EndTimeStr}}
        </template>
      </el-table-column>  
      <el-table-column label="参加时间" align="center" prop="Count" width="180px">
        <template slot-scope="scope">
          {{scope.row.AStartTimeStr +' - '+scope.row.AEndTimeStr}}
        </template>
      </el-table-column> 
      <el-table-column label="状态" align="center" prop="Count" width="130px">
        <template slot-scope="scope">
          <span v-text="setstatus(scope.row.Status)" :class="'status'+scope.row.Status"></span>
        </template>
      </el-table-column> 
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="linktoadd(scope.row.Id)" v-if="scope.row.Status!=4">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button size="mini" type="primary" @click="show(scope.row)" >
            预览
          </el-button>
          <el-button size="mini" type="danger" @click="handledel(scope.row)" >
            <i class="el-icon-delete"></i>
          </el-button>
          <el-button size="mini" type="primary" @click="handlerenyuan(scope.row)" >
            人员
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
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="710px">
      <div>
        <ul class="ulstyle">
          <li>
            活动报名时间：{{item.StartTimeStr}} - {{item.EndTimeStr}}
          </li>
          <li>
            活动进行时间：{{item.AStartTimeStr}} - {{item.AStartTimeStr}}
          </li>
          <li>
            报名人数限制：{{item.LimitNum}}
          </li>
          <li>
            地址：{{item.Address}}
          </li>
          <li>
            详情：<div v-html="item.Describe"></div>
          </li>
        </ul>

      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import Pagination from "@/components/Pagination";
export default {
  name: "activity",
  components: { Pagination},
  data() {
    return {
      list: [], //列表
      total:0,//总数量
      listLoading: false, //列表加载
      listQuery: {
        pageIndex: 1,
        pageSize: 15,
        title:'',
        starttime:'',
        endtime:'',
      },
      times:'',
      item:{},
      dialogStatus:'',
      dialogFormVisible:false,
      CategoryList:[],
      Model:[{Value:'0',Text:'活动报名未开始'},{Value:'1',Text:'活动报名中'},{Value:'2',Text:'活动未开始'},{Value:'3',Text:'活动进行中'},{Value:'4',Text:'活动结束'}]
    };
  },
  created() {     
    this.getList(); 
  },
  mounted () {
    this.$bus.$on('activitychange', ()=> {
      this.getList()
    })
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
    show(row){
      this.dialogFormVisible=true;
      this.dialogStatus=row.Title;
      this.item=row;
    },
    getList(){
      this.listLoading = true;
      request({
        url: "Activity/GetActivityList",
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
      for(let i in this.Model){
        if(this.Model[i].Value == code){
          return this.Model[i].Text;
        }
      }
    },
    handleFilter() {
      this.listQuery.pageIndex = 1;
      this.getList();
    },   
    handledel(row) {
      var data = this.$qs.stringify({ Id: row.Id});
      this.$confirm("确定要删除该活动吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "Activity/Del",
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
    linktoadd(id){
      this.$router.push({
        path: "/activity/activity-list/add-activity",
        query: { id:id }
      });
    },
    handlerenyuan(row){
       this.$router.push({
        path: "/activity/activity-list/activity-renyuan",
        query: { id:row.Id }
      });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.activity{
  .status3{color:#F56C6C;}
  .status0{color:#67C23A;}
  .status1{color:#E6A23C;}
  .status2{color:#409EFF;}
  .status4{color:#909399;}
  .ulstyle{list-style: none; line-height: 30px;}
}
  
</style>
