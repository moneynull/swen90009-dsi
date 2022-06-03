<template>
<div>
  <div>
    <template>
      <el-radio v-model="radio" @change="changeData" label="Authors">Authors</el-radio>
      <el-radio v-model="radio" @change="changeData" label="Articles">Articles</el-radio>
      <el-radio v-model="radio" @change="changeData" label="Institutions" v-show="graphLevel===1">Institutions</el-radio>
    </template>
  </div>
  <div id="main"
       style="width: 100%;height:680px; display:flex;text-align:center;position: absolute;margin-top: 10px">
  </div>
  <div style="width: 15%;position: absolute;margin-top: 100px;margin-left: 40px">
    <el-descriptions :title="'Relationship of '+radio" :column="1">
      <el-descriptions-item label="Total Nodes">{{cur_graph.nodes.length}}&nbsp;{{radio}}</el-descriptions-item>
      <el-descriptions-item label="Total Links">{{cur_graph.links.length}}&nbsp;{{radioType}}</el-descriptions-item>
      <el-descriptions-item label="Current Node">{{currentNode}}</el-descriptions-item>
    </el-descriptions>
  </div>
  <div v-if="graphLevel!==1" style="position: relative;margin-top: 70px">
    <el-button @click="returnLevel()" type="primary">return</el-button>
  </div>
</div>
</template>

<script>
import global from './commonPlace'

export default {
  name: "relationChart",
  components:{global},
  data(){
    return{
      cur_graph:global.data01,
      pre_data:null,
      radio:'Authors',
      graphLevel:1,
      radioType:'Authorships',
      currentNode:'',
      chartColor:['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc',
        '#F012BE','#85144b','#FF4136','#39CCCC','#3D9970','#001f3f','#01FF70'],
    }
  },
  methods:{
    changeData(){
      if(this.graphLevel===1){
        this.radioType=this.radio==='Authors'?'Authorships':'Citations'
        if(global.origin_graph.graph.title==="article1"){
          global.setCurrentParentGraph(global.data01,this.radio)
          console.log(1)
        }
        if(global.origin_graph.graph.title==="author1"){
          global.setCurrentParentGraph(global.data02,this.radio)
          console.log(2)
        }
        if(global.origin_graph.graph.title==="author2"){
          global.setCurrentParentGraph(global.data04,this.radio)
          console.log(2)
        }
        if(global.origin_graph.graph.title==="article2"){
          global.setCurrentParentGraph(global.data03,this.radio)
        }
        global.origin_graph=JSON.parse(JSON.stringify(global.cur_parent_graph))
        this.setOption(global.cur_parent_graph.graph)
      }
      if(this.graphLevel===2){
        if(this.radio!==global.cur_sub_graph.type){
          let temp_sub=this.radio==="Authors"?global.subData01:global.subData02
          this.chartColor=temp_sub.colors
          this.setOption(temp_sub)
        }else{
          this.chartColor=global.sub_color
          this.setOption(global.cur_sub_graph.graph)
        }
      }

      if(this.radio==='Institutions'){
        this.radioType='Co-operations'
        global.data05.nodes= global.data05.nodes.map(function (node, idx) {
          node.id = idx;
          node.symbolSize=1
          node.value=0
          return node;
        })
        global.data05.links.forEach(e=>{
          global.data05.nodes[e.target].symbolSize+=1
          global.data05.nodes[e.target].value+=1
        })
        this.setOption(global.data05)
      }
    },

    myEcharts() {

      let graph=global.cur_parent_graph.graph
      let myChart = this.$echarts.init(document.getElementById('main'));

      myChart.showLoading();
      myChart.hideLoading();
      // graph.nodes.forEach(function (node) {
      //   // node.label = {
      //   //   show: node.symbolSize > 30
      //   // };
      // });
      this.setOption(graph)

      myChart.on('click',(params) =>{
        if(params.dataType==='node'){
          this.clickNode(params.data.id)
        }
      })
    },
    setOption(graph){
      let myChart = this.$echarts.getInstanceByDom(document.getElementById('main'));

      let dyn_option = {
        title: {
          // text: 'Nodes: '+this.radio+" "+graph.nodes.length+'\n'+'Links: '+this.radioType+"hip "+graph.links.length,
        },
        tooltip: {
          trigger: 'item',
          formatter: "{b}: {c} "+this.radioType
        },
        color:this.chartColor,
        legend: [
          {
            data: graph.categories,
            selector: true,
          }
        ],

        emphasis:{
          focus: 'series',
        },

        series: [
          {
            legendHoverLink:true,
            name: this.radioType,
            type: 'graph',
            layout: 'force',
            data: graph.nodes,
            edges: graph.links,
            categories: graph.categories,
            roam: true,
            label: {
              position: 'right',
              formatter: '{b}'
            },
            // draggable: true,
            scaleLimit: {
              min: 1.3,
              max: 10
            },
            lineStyle: {
              color: 'source',
              curveness: 0.3,
              width: 0.5
            },
            emphasis: {
              focus: 'adjacency',
              lineStyle: {
                width: 5
              }
            },
            force: {
              edgeLength: [20,50],
              repulsion: 20,
              gravity: 0.25,
              layoutAnimation:true,
              friction:0.1
            }
          }
        ]
      };

      myChart.setOption(dyn_option,true);
      this.cur_graph=graph
    },

    clickNode(index){
      if(this.graphLevel===1){
        if(this.radio==='Institutions'){
          console.log(1)
        }else{
          let temp_graph=JSON.parse(JSON.stringify(global.cur_parent_graph.graph))
          this.filterNode(temp_graph,global.cur_parent_graph.graph.nodes[index].id)

          global.temp_click_node=global.cur_parent_graph.graph.nodes[index].name
          global.temp_node=temp_graph
          this.currentNode=global.temp_click_node

          this.graphLevel=2
          this.setOption(temp_graph)
          global.setCurrentSubGraph(temp_graph,this.radio)
          global.sub_color=JSON.parse(JSON.stringify(this.chartColor))
        }

      }else{
        this.$router.push({
          path:'/RankPage',
          query:{
            name:global.cur_parent_graph.graph.nodes[index].name,
            nodeType:this.radio
          }
        })
      }
    },

    filterNode(graph,target){
      let links= graph.links.filter((item)=>{
        return (item.target===target)||(item.source===target)
      })
      let box=[]
      links.forEach(e=>{
        box.push(e.source)
        box.push(e.target)
      })
      let nodes= graph.nodes.filter((item)=>{
        return box.indexOf(item.id)>-1
      })

      let cat=[]
      let temp_color=[]

      nodes.forEach(e=>{
        e.id=e.id.toString()
        if(cat.indexOf(graph.categories[e.category])<=-1){
          cat.push(graph.categories[e.category])
          temp_color.push(this.chartColor[e.category])
        }

        e.category=graph.categories[e.category].name
      })
      links.forEach(e=>{
        e.source=e.source.toString()
        e.target=e.target.toString()
      })
      graph.nodes=nodes
      graph.links=links
      graph.categories=cat
      this.chartColor=temp_color
    },

    returnLevel(){
      this.chartColor=['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc',
        '#F012BE','#85144b','#FF4136','#39CCCC','#3D9970','#001f3f','#01FF70']
      this.setOption(global.cur_parent_graph.graph)
      this.graphLevel=1
      global.cur_sub_graph.graph=null
      this.radio=global.cur_parent_graph.type
      global.temp_click_node=''
      global.temp_node=null
      this.currentNode=''

    },

  },

  mounted() {

    if(global.temp_click_node===''){
      global.setCurrentParentGraph(global.data01,'Authors')
      global.origin_graph=JSON.parse(JSON.stringify(global.cur_parent_graph))
      this.myEcharts();
    }else{
      this.chartColor=global.sub_color
      this.myEcharts();
      this.setOption(global.cur_sub_graph.graph)
      this.radio=global.cur_sub_graph.type
      this.graphLevel=2
      this.currentNode=global.temp_click_node
    }

  }
}

</script>

<style scoped>

</style>
