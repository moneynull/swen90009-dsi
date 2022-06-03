<template>
  <div>
    <el-container style="max-height:1000px; border: 1px solid #eee;">
      <el-aside width="220px" style="background-color: rgb(238, 241, 246);text-align: left">
        <el-menu :default-openeds="['1', '2']">
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-menu"></i>Sort</template>
            <el-menu-item index="1-1" class="title-color" @click="sortByCitation()">By Num of Citations</el-menu-item>
            <el-menu-item index="1-2" class="title-color">By Published Time</el-menu-item>
            <el-menu-item index="1-3" class="title-color">By First Letter of Article</el-menu-item>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title"><i class="el-icon-menu"></i>Filter</template>
            <el-submenu index="2-1">
              <template slot="title"><span class="title-color">By Timespan</span></template>
              <el-menu-item-group>
                <template slot="title">Start Time</template>
                <el-menu-item index="2-1-1">
                  <input type="date" style="font-size: 14px;height: 25px"></input>
                </el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group>
                <template slot="title">End Time</template>
                <el-menu-item index="2-1-2">
                  <input type="date" style="font-size: 14px;height: 25px"></input>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item-group>
              <template slot="title"><span class="title-color" style="font-size: 14px">By Blur Search</span></template>
              <el-menu-item index="2-2">
                <input type="String" style="width: 100%;height: 48%" v-model="blurInput"></input>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="text-align: left; font-size: 17px">
          <span style="position: absolute;width:60%;text-align: center;overflow: hidden">Author:&nbsp{{this.authorName}}</span>
          <div style="position: relative; text-align: right;">
            <el-button style="width:15%" @click="goBack" type="primary">Go Back</el-button>
          </div>
        </el-header>

        <el-main style="text-align: center"  >
          <el-card class="box-card" shadow="hover" v-for="(tableItem,index) in blurSearch()" :key="index">
            <div slot="header" class="clearfix">
              <span>{{tableItem.article}}</span>
            </div>
            <div class="text item">
              Co-author:&nbsp;{{tableItem.authors}}
              <br><br>
              Publish Time:&nbsp;{{tableItem.publishTime}}&nbsp;&nbsp;&nbsp;&nbsp;Citations:&nbsp;{{tableItem.citations}}
              <br><br>
              {{"Keywords: "+tableItem.keywords}}
              <br><br>
              <div v-show="tableItem.viewButtonName==='View All'">
                {{tableItem.abstract | ellipsis}}
                <el-button style="padding: 3px 0" type="text"
                           @click="viewAndHide(index)">{{tableItem.viewButtonName}}</el-button>
              </div>
              <div v-show="tableItem.viewButtonName==='Hide'">
                {{tableItem.abstract}}
                <el-button style="padding: 3px 0" type="text"
                           @click="viewAndHide(index)">{{tableItem.viewButtonName}}</el-button>
              </div>
            </div>

          </el-card>
        </el-main>

      </el-container>
    </el-container>
  </div>

</template>

<script>
import '../assets/css/filterStyle.css';
import tableData from '../assets/articleData1.json'
export default {
  name: "ArticlePage",
  data(){
    return {
      tableData:tableData,
      authorName: this.$route.query.authorName,
      blurInput:null
    }
  },
  methods:{
    viewAndHide(index){
      this.tableData[index].viewButtonName=
        this.tableData[index].viewButtonName==='View All'?'Hide':'View All'
    },
    blurSearch(){
      if(this.blurInput===null) this.blurInput=''
      let blur=this.blurInput.toLowerCase()
      return this.tableData.filter((item)=>{
        return (item.article!==null&&item.article.toLowerCase().includes(blur))||
          (item.keywords!==null&&item.keywords.toLowerCase().includes(blur))||
          (item.abstract!==null&&item.abstract.toLowerCase().includes(blur))
      })
    },
    sortByCitation(){
      this.tableData.sort((a,b)=>{
        return b.citations-a.citations
      })
    },
    goBack(){
      this.$router.go(-1)
    }
  },
  filters:{
    ellipsis(value){
      if (!value) return '';
      if (value.length > 250) {
        return value.slice(0,250) + '...'
      }
      return value
    }
  }
}
</script>

<style scoped>
.text {
  font-size: 14px;
}
.item {
  text-align: left;
  margin-bottom: 18px;
}
.clearfix{
  text-align: left;
}
.box-card {
  width: 95%;
  display: inline-block;
  padding: 5px;
  border: 2px solid rgba(178,191,208,0.6);
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
</style>
