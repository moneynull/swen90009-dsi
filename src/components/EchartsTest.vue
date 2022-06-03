<template>
  <div class="Echarts" style="text-align: center">
    <div id="main" v-show="!this.isClustering"
         style="width: 660px;height:440px; display:inline-block;text-align:left;"></div>
    <div v-if="this.isClustering"
         style="width: 660px;height:440px; display:inline-block;text-align:left;">
      <h3 style="text-align: center"> Co-authorship clustering for {{domain}}</h3>
      <img src="../assets/clustering.png" @click="gotoRank(domain)" style="cursor: pointer">
    </div>
    <div v-if="!this.isClustering">
      <el-button @click="changeChart" type="primary">change chart</el-button>
    </div>
    <div v-if="this.isClustering">
      <el-button @click="changeClustering('')" type="primary">return</el-button>
    </div>
  </div>
</template>

<script>
import treemap from '@/assets/treeMapData.json'
export default {
  name: "echarts-test",
  data() {
    return {
      treeMap : [
        {
          name: "action",
          value: 100,
          institutions: 10,
          Authors:40
        },
        {
          name: "animation",
          value: 200,
          institutions: 20,
          Authors:60
        },
        {
          name: "Finance",
          value: 250,
          institutions: 30,
          Authors:80
        },
        {
          name: "Artificial Intelligence",
          value: 300,
          institutions: 10,
          Authors:100
        }
      ],
      treemapOption:{},
      sunburstOption:{},
      currentOption:{},
      isClustering:false,
      domain:''
    }
  },
  methods:{
    myEcharts(){
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('main'));

      // 指定图表的配置项和数据
       this.treemapOption = {
         tooltip : {
           trigger: 'item',
           formatter: "{b}: {c}:"+" pages"
         },
         series: [
          {
            type: 'treemap',
            id: 'echarts-package-size',
            animationDurationUpdate: 1000,
            roam: false,
            nodeClick: true,
            data: this.treeMap,
            universalTransition: true,
            label: {
              show: true
            },
            breadcrumb: {
              show: false
            }
          }
        ]
      };
      this.sunburstOption = {
        series: [
          {
            type: 'sunburst',
            id: 'echarts-package-size',
            radius: ['20%', '90%'],
            animationDurationUpdate: 1000,
            nodeClick: undefined,
            data: this.treeMap,
            universalTransition: true,
            itemStyle: {
              borderWidth: 4,
              borderColor: 'rgba(255,255,255,.5)'
            },
            label: {
              show: true
            }
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      this.currentOption=this.treemapOption
      myChart.setOption(this.currentOption)

      myChart.on('click',(params) =>{
        this.changeClustering(params.data.name)
      })
    },

    changeChart(){
      let myChart = this.$echarts.init(document.getElementById('main'));
      this.currentOption =
        this.currentOption === this.treemapOption ? this.sunburstOption : this.treemapOption
      myChart.setOption(this.currentOption)
    },

    gotoRank(domain){
      this.$router.push({
        path:'/RankPage',
        query:{
          domain:domain
        }
      })
    },

    changeClustering(domain){
      this.isClustering=this.isClustering === false
      this.domain=domain
    }

  },
  mounted() {
    this.myEcharts();
  }
}
</script>

<style scoped>

</style>
