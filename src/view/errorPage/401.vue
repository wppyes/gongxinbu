<template>
  <div class="errPage-container">
    <el-row>
      <el-col :span="12">
        <h2>你没有权限访问该页面</h2>
        <h6>如有不满请联系你领导</h6>
        <ul class="list-unstyled">
          <li>或者你可以去:</li>
          <li class="link-type">
            <a @click="logout" class>返回登录</a>
          </li>
        </ul>
      </el-col>
      <el-col :span="12">
        <img :src="errGif" width="313" height="428" alt="Girl has dropped her ice cream." />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import errGif from "@/assets/401_images/401.gif";

import request from "@/utils/request";
export default {
  name: "Page401",
  data() {
    return {
      errGif: errGif + "?" + +new Date(),
      ewizardClap:
        "https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646"
    };
  },
  methods: {
    back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: "/console" });
      } else {
        this.$router.go(-1);
      }
    },
    logout() {
      request({
        url: "/home/SignOut",
        method: "get",
        param: {}
      }).then(response => {
        if (response.Status == 1) {
          this.$router.push({
            path: "/",
            query: { redirect: location.hostname }
          });
          localStorage.clear();
          this.$message({
            message: "退出成功",
            type: "success"
          });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.errPage-container {
  width: 800px;
  max-width: 100%;
  margin: 100px auto;
  .pan-back-btn {
    background: #008489;
    color: #fff;
    border: none !important;
  }
  .pan-gif {
    margin: 0 auto;
    display: block;
  }
  .pan-img {
    display: block;
    margin: 0 auto;
    width: 100%;
  }
  .text-jumbo {
    font-size: 60px;
    font-weight: 700;
    color: #484848;
  }h6 {
    display: block;
    font-size: 0.67em;
    margin-block-start: 2.33em;
    margin-block-end: 2.33em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
}
  .list-unstyled {
    font-size: 14px;
    li {
      padding-bottom: 5px;
    }
    a {
      color: #008489;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
