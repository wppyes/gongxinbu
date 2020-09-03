<template>
  <div class="news boxright">
    
    <div class="back">
      <span @click="backto">
        <i class="el-icon-arrow-left"></i>返回
      </span>
    </div>
    <div class="filter-container">
      <el-input
        placeholder="请输入名字"
        v-model="listQuery.name"
        style="width: 150px;"
        class="filter-item"
        clearable
      />  
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>  
      <el-button class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">下载</el-button>   
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column v-for="(item,index) in Model" :label="item" :key="item" align="center" prop="Values">
         <template slot-scope="scope">
          {{scope.row.Values[index]}}
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center" prop="CreatedStr"></el-table-column>
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
  name: "news",
  components: { Pagination },
  data() {
    return {
      list: [], //列表
      total:0,//总数量
      listLoading: false, //列表加载
      listQuery: {
        pageIndex: 1,
        pageSize: 15,
        activityid:'',
        name:''
      },
      Model:[]
    };
  },
  created() {         
    this.listQuery.activityid = this.$route.query.id;  
    this.getList();     
    request({
      url: "Activity/GetActivity_User",
      method: "get",
      params: {id:this.$route.query.id}
    }).then(response => {
      if (response.Status == 1) {
        this.Model=JSON.parse(response.Model.DynamicField);
      }
    });
  }, 
  methods: {
    getList(){
      this.listLoading = true;
      request({
        url: "Activity/GetUserTicketList",
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
    backto() {      
      this.$router.go(-1);
    },
    handleFilter() {
      this.listQuery.pageIndex = 1;
      this.getList();
    },   
    handleDownload(){
      this.downloadLoading = true;
      this.$confirm("确定要导出参与人员信息吗？", '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          request({
            url: "Activity/GetUserTicket",
            method: "get",
            params: {activityid:this.listQuery.activityid}
          }).then(response => {
              if(response.Status==1){
                this.exportex(response,'人员信息')
                this.downloadLoading = false
              }          
          });          
        }).catch(() => {   
          this.downloadLoading = false      
        });
    },
    exportex(response,title){
      import('@/vendor/Export2Excel').then(excel => {
          const tHeader = response.TableTitle;
          const filterVal = response.TableTitle;
          var data=[];
          for(var i in response.List){
            data.push(response.List[i].Values)
          };
          // const data = this.formatJson(filterVal, response.List)
          if(response.List){
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename:  title
            });
          }
        
      }); 
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
          return v[j]
      }))
    }, 
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">

</style>
