<template>

</template>

<script>
import data01 from '../assets/authorChart1.json'
import data02 from '../assets/articleChart1.json'
import data03 from '../assets/authorChart2.json'
import data04 from '../assets/articleChart2.json'
import data05 from '../assets/institutionChart1.json'
import subData01 from '../assets/children01.json'
import subData02 from '../assets/children02.json'

// 定义一些公共的属性和方法
let cur_parent_graph= {graph:data01,type:'Authors'}
let origin_graph= {graph:data01,type:'Authors'}
let cur_sub_graph= {graph:null,type:'Authors'} //1-click, 2-fix
let author_sub_graph=null
let article_sub_graph=null
let temp_click_node=''
let temp_node=null
let sub_color=null
let graph_level=1
let archive_bar=[{
  keywords:"Defense Science 1",
  withAll:'Missile',
  withExactPhrase:'Hold ur fire',
  withLeast:'position',
  without:'attack',
  whereOccur:'Anywhere in the article',
  publishIn:'Arkisa',
  startDate:'2022-05-18',
  endDate:'2022-05-18',
  nodeSelect:'Jack Sparrow',
  temp_node:subData01,
  radio:'Authors',
  disableFlag:true
},{
  keywords:"Defense Science 2",
  withAll:'Grenade',
  withExactPhrase:'Fire in the hole',
  withLeast:'position',
  without:'attack',
  whereOccur:'Anywhere in the article',
  publishIn:'Arkisa',
  startDate:'2022-05-18',
  endDate:'2022-05-18',
  nodeSelect:'',
  temp_node:null,
  radio:'Articles',
  disableFlag:true
}]


function setCurrentParentGraph(graph,type){
  graph.nodes=graph.nodes.map(function (node, idx) {
    node.id = idx;
    node.symbolSize=1
    node.value=0
    return node;
  })
  graph.links.forEach(e=>{
    graph.nodes[e.target].symbolSize+=1
    graph.nodes[e.target].value+=1
  })
  cur_parent_graph.graph=graph
  cur_parent_graph.type=type
}

function setCurrentSubGraph(graph,type){
  cur_sub_graph.graph=graph
  cur_sub_graph.type=type

}
// 暴露出这些属性和方法
export default {
  data01,
  data02,
  data03,
  data04,
  data05,
  subData01,
  subData02,
  temp_click_node,
  author_sub_graph,
  article_sub_graph,
  cur_parent_graph,
  cur_sub_graph,
  temp_node,
  origin_graph,
  sub_color,
  archive_bar,
  graph_level,
  setCurrentParentGraph,
  setCurrentSubGraph
}
</script>

<style scoped>

</style>
