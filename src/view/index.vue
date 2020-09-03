<template>
    <el-container>
        <el-main style="height:93vh;">
            <el-row type="flex" class="row-bg" justify="left">
                <el-col :span="4">
                    <div class="grid-content bg-purple head1">
                        <div class="header-div">
                            <p>占用内存</p>
                            <p><span>{{used_memory_human}}</span></p>
                        </div>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="grid-content bg-purple-light head2">
                        <div class="header-div">
                            <p>总数key</p>
                            <p><span>{{totalkeys}}</span></p>
                        </div>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="grid-content bg-purple head3">
                        <div class="header-div">
                            <p>连接数</p>
                            <p><span>{{connectedclients}}</span></p>
                        </div>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="grid-content bg-purple-light head4">
                        <div class="header-div">
                            <p>命令总数</p>
                            <p><span>{{processed}}</span></p>
                        </div>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="grid-content bg-purple head5">
                        <div class="header-div">
                            <p>缓存命中率</p>
                            <p><span>{{hits}}</span></p>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-main>
                <div id="myChart">
                </div>
                <div id="myQps">
                </div>
                <div id="myUsed">
                </div>
            </el-main>
        </el-main>

    </el-container>
</template>

<script>
    var timmer;
    import moment from 'moment';
    import request from "@/utils/request";
    
    export default {
        data() {
            return {
                used_memory:0,  //数字内存
                used_memory_human:'',  //字符串内存
                used_memory_peak:0,
                totalkeys:0,  //key
                connectedclients:0,  //连接数
                processed:0,  //命令总数
                hits:'',  //缓存命中率
                ops: 0,  //qps
                cpusys:0,  //cpu
            }
        },
        inject: ['reload'],
        mounted() {            
            this.getlist();
            this.getChart();
            this.getQPS();         
            this.getUsed();
        },
        created() {
            timmer=setInterval(() => {
                 this.getlist();
            },10000)
        },
        methods: {
            //内存
            getChart: function() {
                // 基于准备好的dom，初始化echarts实例
                
                let myChart = this.$echarts.init(document.getElementById('myChart'))
                // 绘制图表
                var data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                var little = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0];   
                var Heigh = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                var option = {
                    title: {
                        text: '内存占用(M)'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    legend: {
                        data: ['最高值','最低值']
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: data
                    },
                    yAxis: {
                        type: 'value',
                    },
                    series: [
                        {
                            name: '最高值',
                            data: Heigh,
                            type: 'line',
                        },
                        {
                            name: '最低值',
                            data: little,
                            type: 'line',
                        }
                    ]
                }       
                myChart.setOption(option);      
                
                setInterval(() => {   
                    if (data.length >= 20) {
                        data.splice(0, 1);
                        data.push(this.getdatatime());
                        little.splice(0, 1);
                        little.push(this.used_memory);
                        Heigh.splice(0,1)
                        Heigh.push(this.used_memory_peak);
                    } else {
                        data.push(this.getdatatime());
                        little.push(this.used_memory);  
                        Heigh.push(this.used_memory_peak);
                    }      
                    myChart.setOption(option);    
                }, 10000);
            },
            //每秒并发量
            getQPS: function() {
                // 基于准备好的dom，初始化echarts实例
                let myQps = this.$echarts.init(document.getElementById('myQps'))
                // 绘制图表
                var data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                var little = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0];          
                var option = {
                    title: {
                        text: '每秒并发量'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    legend: {
                        data: ['每秒并发量']
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: data
                    },
                    yAxis: {
                        type: 'value',
                    },
                    series: [{
                        name: '每秒并发量',
                        data: little,
                        type: 'line',
                    }]
                }
                myQps.setOption(option);
                setInterval(() => {   
                    if (data.length >= 20) {
                        data.splice(0, 1);
                        data.push(this.getdatatime());
                        little.splice(0, 1);
                        little.push(this.ops);
                    } else {
                        data.push(this.getdatatime());
                        little.push(this.ops);
                    }      
                    myQps.setOption(option);
                    
                }, 10000)
            },
            //cpu占用
            getUsed: function() {
                // 基于准备好的dom，初始化echarts实例
                let myUsed = this.$echarts.init(document.getElementById('myUsed'))
                // 绘制图表
                var data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                var little = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0];          
                var option = {
                    title: {
                        text: 'cpu占用'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    legend: {
                        data: ['cpu占用']
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: data
                    },
                    yAxis: {
                        type: 'value',
                    },
                    series: [{
                        name: 'cpu占用',
                        data: little,
                        type: 'line',
                    }]
                }
                myUsed.setOption(option);
                setInterval(() => {   
                    if (data.length >= 20) {
                        data.splice(0, 1);
                        data.push(this.getdatatime());
                        little.splice(0, 1);
                        little.push(this.cpusys);
                    } else {
                        data.push(this.getdatatime());
                        little.push(this.cpusys);
                    }      
                    myUsed.setOption(option);
                }, 10000)
            },
            getdatatime: function() {
                return moment().format('hh:mm:ss a');
            },
            //数据列表
            getlist:function(){
                var _this = this;
                request({
                    url: "redis/getinfo",
                    method: "get",
                }).then(response => {
                    if(response.Status == 1){
                        if(response.Model){
                            if(response.Model.Memory){
                                _this.used_memory=_this.usedmemory(parseInt(response.Model.Memory.used_memory));
                                _this.used_memory_human = response.Model.Memory.used_memory_human;
                                _this.used_memory_peak = _this.usedmemory(parseInt(response.Model.Memory.used_memory_peak));
                            }
                            if(response.Model.Keys){
                                _this.totalkeys = response.Model.Keys.TotalKeys;
                            }
                            if(response.Model.Client){
                                _this.connectedclients = response.Model.Client.connected_clients;
                            }
                            if(response.Model.Stats){
                                _this.processed = response.Model.Stats.total_commands_processed;
                                _this.hits = _this.gethits(parseInt(response.Model.Stats.keyspace_hits),parseInt(response.Model.Stats.keyspace_misses));
                                _this.ops = response.Model.Stats.instantaneous_ops_per_sec;
                            }
                            if(response.Model.CPU){
                                _this.cpusys = response.Model.CPU.used_cpu_sys;
                            }
                        }    
                    }   
                });
            },
            usedmemory:function(memory){
                return (memory/(1024 * 1024)).toFixed(2);
            },
            gethits:function(hits, miss){
                return (hits/(hits+miss)*100).toFixed(2)+ '%';
            },
        },
        destroyed(){
            clearInterval(timmer)
        }
    }

</script>

<style scoped>
    .row-bg {
        border: 1px solid #f1f3f4;
        text-align: center;
    }

    .row-bg div {
        margin: 5px;
        color: white;
        height: 100px;
        margin-bottom: 15px;
    }

    .head1 {
        background-color: #00c0ef;
    }

    .head2 {
        background-color: #00a65a;
    }

    .head3 {
        background-color: #f39c12;
    }

    .head4 {
        background-color: #dd4b39;
    }

    .head5 {
        background-color: #3c8dbc;
    }

    .header-div p {
        line-height: 25px;
        font-size: 16px;
    }

    .header-div {
        padding-top: 25px;
    }

    .header-div p span {
        font-size: 18px;
    }

    #myChart {
        width: 100%;
        height: 500px;
        border: 1px solid #f1f3f4;
        margin-top: 10px;
    }

    #myQps {
        width: 100%;
        height: 500px;
        border: 1px solid #f1f3f4;
        margin-top: 10px;
    }

    #myUsed {
        width: 100%;
        height: 500px;
        border: 1px solid #f1f3f4;
        margin-top: 10px;
    }

</style>
