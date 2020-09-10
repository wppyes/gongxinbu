<template>
  <div class="vip-list boxright">
    <div class="filter-container">
      <div class="filter-item" style="margin-right:20px;">
        <el-button type="primary" @click="linktoadd('')">
          <i class="el-icon-circle-plus"></i> 增加人员
        </el-button>
      </div>
      <el-input
        placeholder="请输入名字"
        v-model="listQuery.name"
        style="width: 150px;"
        class="filter-item"
        clearable
      />  
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>   
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="名字" align="center" prop="Name" width="200px"></el-table-column>
      <el-table-column label="链接" align="center" prop="Number">
        <template slot-scope="scope">
          {{link}}{{scope.row.Number}}
        </template>
      </el-table-column>
      <el-table-column label="二维码" align="center" prop="Name" width="250px">
        <template slot-scope="scope">
          <qrcode-vue :value="link+scope.row.Number" :size="100" :id="'load'+scope.row.Number" level="H"></qrcode-vue>
          <el-button size="mini" type="primary" @click="load('load'+scope.row.Number,scope.row.Name)">
            下载
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="linktoadd(scope.row)">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button size="mini" type="danger" @click="handledel(scope.row)" >
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
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="510px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:10px;"
      >
        <el-form-item label="名字：" prop="Name">
          <el-input v-model="temp.Name" placeholder="请填写名字" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="subname">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import Pagination from "@/components/Pagination";
import QrcodeVue from "qrcode.vue";
export default {
  name: "news",
  components: { Pagination ,QrcodeVue},
  data() {
    return {
      list: [], //列表
      total:0,//总数量
      listLoading: false, //列表加载
      listQuery: {
        pageIndex: 1,
        pageSize: 4,
        name:''
      },
      times:'',
      CategoryList:[],
      dialogStatus:'',
      dialogFormVisible:false,
      link: 'https://h5.tintonesoft.com/wpg/gxb/index.html?id=',
      temp:{
        Id:'',
        Name:''
      },      
      rules: {
        Name: [
          { required: true, message: "名字必须填写！", trigger: "blur" }
        ],
      }
    };
  },
  created() {    
    this.getList(); 
  },
  methods: {
    subname(){  
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var data = this.$qs.stringify(this.temp);
          request({
            url: "InvitationRoster/SetRoster",
            method: "post",
            data
          }).then(response => {
            if (response.Status==1) {
              if (this.temp.Id=='') {
                var param={
                  Id:response.AId,
                  Name:this.temp.Name,
                  Number:response.Number
                }
                this.list.unshift(param)
              } else {
                for (let i in this.list) {
                  if (this.list[i].Id === this.temp.Id) {
                    this.list[i].Name = this.temp.Name;
                    break;
                  }
                }
              }
              this.dialogFormVisible = false;
              this.$message({
                message: response.Msg,
                type: "success"
              });
            }
          });
        }
      });
    },
    getList(){
      this.listLoading = true;
      request({
        url: "InvitationRoster/GetRosterList",
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
    load(id,name){
      let canvas = document.getElementById(id).getElementsByTagName('canvas')
      let a = document.createElement('a')
      a.href = canvas[0].toDataURL('img/png')
      a.download = name
      a.click()
    },
    handleFilter() {
      this.listQuery.pageIndex = 1;
      this.getList();
    },   
    handledel(row) {
      var data = this.$qs.stringify({ Id: row.Id});
      this.$confirm("确定要删除该人员吗？", "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          request({
            url: "InvitationRoster/Del",
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
    linktoadd(row){
      if(row==''){
        this.temp.Id='';
        this.temp.Name='';
        this.dialogStatus='添加人员';
      }else{      
        this.temp.Id=row.Id;
        this.temp.Name=row.Name;
        this.dialogStatus='修改人员';
      }
      this.dialogFormVisible=true;
       this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">

</style>
