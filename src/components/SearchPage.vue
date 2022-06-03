<template>
<div style="text-align: center">
  <h1>Defence Science Institute</h1>
  <div id="searchBar">
    <div style="position: absolute;margin-left: 120px">
      <el-button icon="el-icon-s-tools" @click="dialogFormVisible = true" type="info" circle></el-button>

      <el-dialog title="Advanced Search" :visible.sync="dialogFormVisible">
        <el-form ref="form" :model="form" label-width="205px">
          <el-form-item label="With all of the words:" >
            <el-input v-model="form.withAll"></el-input>
          </el-form-item>

          <el-form-item label="With the exact phrase:" >
            <el-input v-model="form.withExactPhrase"></el-input>
          </el-form-item>

          <el-form-item label="With at least one of the words:" >
            <el-input v-model="form.withLeast"></el-input>
          </el-form-item>

          <el-form-item label="Without the words:" >
            <el-input v-model="form.without"></el-input>
          </el-form-item>

          <el-form-item label="Where my words occur: ">
            <el-radio-group v-model="form.whereOccur">
              <el-radio label="Anywhere in the article"></el-radio>
              <el-radio label="In the title of the article"></el-radio>
              <el-radio v-show="false"></el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="Articles published in: " >
            <el-input v-model="form.publishIn"></el-input>
          </el-form-item>

          <el-form-item label="Articles dated between: ">
            <el-col :span="11">
              <el-date-picker type="date" placeholder="Start" v-model="form.startDate" style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-date-picker type="date" placeholder="End" v-model="form.endDate" style="width: 100%;"></el-date-picker>
            </el-col>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click=advanceSearch :loading="searchLoading">Search</el-button>
          <el-button @click="dialogFormVisible = false">cancel</el-button>
        </div>
      </el-dialog>

    </div>

    <input style="width: 400px;height: 30px;margin-top: 4px;padding-left: 6px"
           :class="keywordEmpty?'diy_input_red':'diy_input'"
           :placeholder="keywordEmpty?'Need at least one key word':'Key word'"
           v-model="inputKeyword" />

    <el-button style="position:absolute;margin-left: 20px" icon="el-icon-search"
               type="primary" circle :loading="searchLoading"
               @click="searchKeyWord"></el-button>

    <el-button style="position:absolute;margin-left: 70px"
               :icon="recordFlag?'el-icon-check':''"
               :type="recordFlag?'success':'primary'"
               :disabled="inputKeyword===''"
               @click=doRecord :loading="recording"> Save</el-button>
  </div>
  <div style="position: relative;top: 30px">
    <el-button @click="drawer1 = true" type="primary" plain
               style="margin-left: 16px;" v-show="relationFlag">
      Filter Option
    </el-button>
    <el-button @click="drawer2 = true" type="primary" plain
               style="margin-left: 16px;width: auto">
      Archive Bar
    </el-button>

    <el-drawer
      title="Filter"
      :visible.sync="drawer1"
      direction="ltr" style="width: 80%">
      <div style="width: 90%;display: inline-block">
        <el-menu :default-openeds="['1', '2']" style="text-align: left;font-size: 14px">
          <el-submenu index="2">
              <template slot="title"><span class="title-color">By Top</span></template>
              <el-menu-item index="2-1" @click="topPercent=10">10%</el-menu-item>
              <el-menu-item index="2-2" @click="topPercent=30">30%</el-menu-item>
              <el-menu-item index="2-3" @click="topPercent=50">50%</el-menu-item>
              <el-menu-item index="2-4" @click="topPercent=100">100%</el-menu-item>
              <el-menu-item index="2-5" >
                <input type="Number" style="width: 60%;font-size: 14px;height: 45%"
                       v-model="topPercent"></input><label>&nbsp;%</label>
              </el-menu-item>
              <div>
                <el-button type="primary" style="width: 40%;position: absolute" @click="takeTop(topPercent)">Apply</el-button>
                <el-button style="width: 40%;position: relative;margin-left: 50%" @click="drawer1=false">Cancel</el-button>
              </div>
          </el-submenu>
        </el-menu>
      </div>

    </el-drawer>

    <el-drawer
      title="Archive"
      :visible.sync="drawer2"
      direction="rtl">
      <div style="width: 90%;display: inline-block">
        <el-collapse v-model="activeNames">
          <el-collapse-item style="text-align: left"
                            v-for="(item,index) in favoriteBar" :key="index"
                            :title=item.keywords :name=index>
            <div>With all of the words: <el-input v-model="item.withAll" :disabled="item.disableFlag"/></div>
            <div>With the exact phrase: <el-input v-model="item.withExactPhrase" :disabled="item.disableFlag"/></div>
            <div>With at least one of the words: <el-input v-model="item.withLeast" :disabled="item.disableFlag"/></div>
            <div>Without the words: <el-input v-model="item.without" :disabled="item.disableFlag"/></div>
            <div>Where my words occur: <el-input v-model="item.whereOccur" disabled/></div>
            <div>Articles dated between: <br>
              <el-date-picker type="date" style="width: 50%" v-model="item.startDate" :disabled="item.disableFlag"/>
              <br>to<br>
              <el-date-picker type="date" style="width: 50%" v-model="item.endDate" :disabled="item.disableFlag"/></div>
            <div>Nodes selected: <el-input v-model="item.nodeSelect" disabled/></div>
            <br>
            <div style="text-align: right">
              <el-button type="danger" style="width: 25%" plain icon="el-icon-delete" @click="deleteSearch(index)"></el-button>
              <el-button type="info" @click="item.disableFlag=item.disableFlag===false" style="width: 25%" plain icon="el-icon-edit"></el-button>
              <el-button type="primary" style="width: 30%" plain @click="applySearch(item)" :loading="searchLoading">Apply</el-button>
            </div>

          </el-collapse-item>
        </el-collapse>
      </div>

    </el-drawer>
  </div>

  <div class="treeMapSection" v-if="relationFlag">
    <relationChart ref="mychart" style="margin-top: 10px"></relationChart>
  </div>

</div>


</template>

<script>

import relationChart from "./relationChart";
import global from './commonPlace'
import '../assets/css/filterStyle.css';

export default {
  name: "SearchPage",
  components:{relationChart,global},
  data(){
    return{
      favoriteBar:global.archive_bar,

      radio:'Authors',
      relationFlag:this.$route.query.relationFlag !== undefined,
      inputKeyword:"",
      searchLoading:false,
      pngType:'main',
      drawer1: false,
      drawer2: false,
      activeNames: [],
      recording:false,
      recordFlag:false,
      keywordEmpty:false,
      topPercent:null,
      graph_level: {value:1},
      dialogFormVisible: false,
      formLabelWidth: '120px',
      form: {
        withAll: '',
        withExactPhrase: '',
        withLeast:'',
        without:'',
        whereOccur: 'Anywhere in the article',
        publishIn:'',
        startDate:'',
        endDate:''
      },
    }
  },
  methods:{
    searchKeyWord(){
      if(this.inputKeyword==='')
        this.keywordEmpty=true
      else{
        this.keywordEmpty=false
        this.searchLoading=true

        setTimeout(() => {
          this.relationFlag=true
          this.searchLoading=false
          global.setCurrentParentGraph(global.data01,'Authors')
          global.origin_graph=global.cur_parent_graph
          this.$refs.mychart.returnLevel()
          this.$refs.mychart.setOption(global.cur_parent_graph.graph);
        }, 500);
      }
    },
    advanceSearch(){
      if(this.inputKeyword==='')
        this.keywordEmpty=true
      else{
        this.keywordEmpty=false
        this.searchLoading=true
        setTimeout(() => {
          this.dialogFormVisible=false
          this.relationFlag=true
          this.searchLoading=false
          global.setCurrentParentGraph(global.data03,'Authors')
          global.origin_graph=global.cur_parent_graph
          this.$refs.mychart.returnLevel()
          this.$refs.mychart.setOption(global.cur_parent_graph.graph);
        }, 500);
      }
    },

    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    handleChange(val) {
      console.log(val);
    },

    doRecord(){
      this.recording=true
      setTimeout(() => {
        this.recording=false
        this.recordFlag=true
        this.favoriteBar.push({
          keywords:this.inputKeyword,
          withAll:this.form.withAll,
          withExactPhrase:this.form.withExactPhrase,
          withLeast:this.form.withLeast,
          without:this.form.without,
          whereOccur:this.form.whereOccur,
          publishIn:this.form.publishIn,
          startDate:this.form.startDate,
          endDate:this.form.endDate,
          nodeSelect:global.temp_click_node,
          temp_node:global.temp_node,
          disableFlag:true
        })
        global.archive_bar=this.favoriteBar
      }, 200)
      setTimeout(()=>{
        this.recordFlag=false
      },2400)
    },

    takeTop(percent){
      let temp_graph=null
      if(global.temp_click_node!==''){
        temp_graph=JSON.parse(JSON.stringify(global.cur_sub_graph.graph))
      }else{
        temp_graph=JSON.parse(JSON.stringify(global.cur_parent_graph.graph))
        console.log(temp_graph)
      }

      //TODO: links reduce

      temp_graph.nodes.sort((a,b)=>{
        return b.value-a.value
      })
      let glen=temp_graph.nodes.length
      temp_graph.nodes=temp_graph.nodes.slice(0,glen*percent/100)
      let box=[]
      temp_graph.nodes.forEach(e=>{
        e.id=e.id.toString()
        box.push(e.id)
      })
      temp_graph.links.forEach(e=>{
        e.source=e.source.toString()
        e.target=e.target.toString()
      })
      temp_graph.links=temp_graph.links.filter((item) => {
        return (box.indexOf(item.target) > -1) || (box.indexOf(item.source) > -1)
      })

      this.$refs.mychart.setOption(temp_graph)
    },

    applySearch(item){
      this.inputKeyword=item.keywords
      this.form.withAll=item.withAll
      this.form.withExactPhrase=item.withExactPhrase
      this.form.withLeast=item.withLeast
      this.form.without=item.without
      this.form.whereOccur=item.whereOccur
      this.form.publishIn=item.publishIn
      this.form.startDate=item.startDate
      this.form.endDate=item.endDate

      this.relationFlag=true
      this.searchLoading=true
      setTimeout(() => {
        this.searchLoading=false
        if(item.nodeSelect===''){
          global.setCurrentParentGraph(global.data03,'Authors')
          global.origin_graph=global.cur_parent_graph
          this.$refs.mychart.returnLevel()
          this.$refs.mychart.setOption(global.cur_parent_graph.graph);
        }else{
          global.setCurrentSubGraph(item.temp_node,'Authors',1)
          this.$refs.mychart.graphLevel=2
          this.$refs.mychart.setOption(global.cur_sub_graph.graph);
        }

        this.activeNames=[]
        this.drawer2=false
      }, 400);

    },

    deleteSearch(index){
      this.favoriteBar.splice(index,1)
      this.activeNames=[]
      global.archive_bar=this.favoriteBar
    },

    initSubFix(graph){
      graph.nodes=graph.nodes.map(function (node, idx) {
        node.id = idx;
        node.symbolSize=node.value
        return node;
      })
      graph.links.forEach(e=>{
        graph.nodes[e.target].symbolSize+=1
        graph.nodes[e.target].value+=1
      })
    }
  },
  mounted() {
    if(this.$route.query.relationFlag===undefined){
      this.initSubFix(global.subData01)
      this.initSubFix(global.subData02)
    }
  }

}
</script>

<style scoped>

#searchBar{
  position: relative;
  top:10px;
  display:inline-block;
  width: 800px;
}

.treeMapSection{
  position: relative;
  top:40px;
}



</style>
