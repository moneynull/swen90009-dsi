<template>
  <div>
    <el-container style="max-height: 1000px; border: 1px solid #eee">
      <el-aside width="220px" v-if="this.pageType===1"
                style="background-color: rgb(238, 241, 246);text-align: left">
        <el-menu :default-openeds="menu_open">
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-menu"></i>Sort</template>

            <el-menu-item index="1-1" class="title-color" @click="sort('citations')">By Num of Citations</el-menu-item>
            <el-menu-item index="1-2" class="title-color" @click="sort('publishTime')">By Published Time</el-menu-item>
            <el-menu-item index="1-3" class="title-color" @click="sort('article')">By First Letter of Article</el-menu-item>

          </el-submenu>

          <el-submenu index="2">
            <template slot="title"><i class="el-icon-menu"></i>Filter</template>
            <el-submenu index="2-1">
              <template slot="title"><span class="title-color" @change="menu_open.contain('2-1')?null:menu_open.push('2-1')">By Timespan</span></template>
              <el-menu-item-group>
                <template slot="title">Start Time</template>
                <el-menu-item index="2-1-1">
                  <input type="date" style="font-size: 14px;height: 25px" v-model="startTime"></input>
                </el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group>
                <template slot="title">End Time</template>
                <el-menu-item index="2-1-2">
                  <input type="date" style="font-size: 14px;height: 25px" v-model="endTime"></input>
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
        <el-header style="text-align: left; font-size: 17px;white-space: nowrap">
          <span style="position: absolute;width:60%;text-align: center;overflow: hidden">{{this.name}}</span>
          <div style="position: relative; text-align: right;">
            <el-button style="width:15%" @click="returnSubGraph" type="primary">Go Back</el-button>
          </div>

        </el-header>

        <el-main>
          <table>
            <thead style="">
            <td style="width: 20%">Name</td>
            <td style="width: 25%">Institution</td>
            <td style="width: 15%">Papers</td>
            <td style="width: 15%">Citations</td>
            <td style="width: 15%">Co-author</td>
            <td>Rank</td>
            </thead>
            <tbody class="selectTable">
            <tr v-for="(tableItem,index) in this.authorData" >
              <td style="cursor: pointer">{{tableItem.authorName}}</td>
              <td>{{tableItem.institution}}</td>
              <td>{{tableItem.totalPapers}}</td>
              <td>{{tableItem.totalCitations}}</td>
              <td>{{tableItem.coauthor}}</td>
              <td>{{tableItem.rank}}</td>
            </tr>
            </tbody>
          </table>
          <br>
          <br>

          <el-card class="box-card" shadow="hover" v-for="(tableItem,index) in blurSearch()" :key="index">
            <div slot="header" class="clearfix">
              <span>{{tableItem.article}}</span>
            </div>
            <div class="text item">
              Authors:&nbsp;{{tableItem.authors}}
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
import advancedSearch from "./advancedSearch";
import '../assets/css/filterStyle.css';
import articleData from '../assets/articleData1.json'
import articleData2 from '../assets/articleData2.json'
import articleData11 from '../assets/articleData11.json'
import global from './commonPlace'

const item1 =[{
  authorName: 'Jaeseung Choi',
  totalPapers: '2000',
  totalCitations: '100000',
  coauthor:'34',
  institution:'KAIST',
  rank:'0.8'
},{
  authorName: 'Doyeon Kim',
  totalPapers: '1400',
  totalCitations: '3000',
  coauthor:'26',
  institution:'LINE Plus Corporation',
  rank:'0.5'
},{
  authorName: 'Soomin Kim',
  totalPapers: '80',
  totalCitations: '400',
  coauthor:'13',
  institution:'KAIST',
  rank:'0.2'
}]
const item2=[{
  authorName: 'Dacheng Tao',
  totalPapers: '428',
  totalCitations: '76739',
  coauthor:'28',
  institution:'University of Sydney',
  rank:'0.8'
}]
export default {
  name: "RankPage",
  components:{advancedSearch,global},

  data() {
    return {
      authorData:this.$route.query.nodeType==='Authors'?item2:item1,
      articleData:this.$route.query.nodeType==='Authors'?articleData11:articleData2,
      // name:this.$route.query.name,
      name:this.$route.query.nodeType==='Authors'?'Dacheng Tao':'SMARTIAN: Enhancing Smart Contract Fuzzing with Static and Dynamic Data-Flow Analyses',
      authorIndex:null,
      blurInput:null,
      pageType:this.$route.query.nodeType==='Authors'?1:2,
      startTime:null,
      endTime:new Date().toString(),
      order:true,
      menu_open:['1','2']
    }
  },
  methods:{
    changetime(){
      console.log(this.startTime)
    },
    clickAuthor(index){
      this.$router.push({
        path:'/ArticlePage',
        query:{
          authorName: this.authorData[index].authorName
        }
      })
    },
    sortByCitation(){
      this.articleData.sort((a,b)=>{
        return b.citations-a.citations
      })
    },

    viewAndHide(index){
      this.articleData[index].viewButtonName=
        this.articleData[index].viewButtonName==='View All'?'Hide':'View All'
    },
    blurSearch(){
      if(this.blurInput===null) this.blurInput=''
      let blur=this.blurInput.toLowerCase()
      return this.timeFilter().filter((item)=>{
        return (item.article!==null&&item.article.toLowerCase().includes(blur))||
          (item.keywords!==null&&item.keywords.toLowerCase().includes(blur))||
          (item.abstract!==null&&item.abstract.toLowerCase().includes(blur))
      })
    },
    timeFilter(){
      if(this.startTime===null) this.startTime=''
      if(this.endTime===null) this.endTime=''
      let time1=new Date(this.startTime.replace(/-/,'/'))
      let time2=new Date(this.endTime.replace(/-/,'/'))
      return this.articleData.filter((item)=>{
        if(this.startTime===''){
          return (new Date(item.publishTime.replace(/-/,'/'))<=time2)
        }
        if(this.endTime===''){
          return (new Date(item.publishTime.replace(/-/,'/'))>=time1)
        }
        if(this.startTime!==''&&this.endTime!==''){}
        return (new Date(item.publishTime.replace(/-/,'/'))<=time2)&&(new Date(item.publishTime.replace(/-/,'/'))>=time1)
      })
    },
    returnSubGraph(){
      this.$router.push({
        path:'/',
        query:{
          relationFlag:true
        }
      })
    },

    sort(type){                     // 排序
      this.order = !this.order;		// 更改为 升序或降序
      this.sortType = type;
      this.articleData.sort(this.compare(type));
      // 调用下面 compare 方法 并传值
    },
    compare(attr){                  // 排序方法
      let that = this;
      return function(a,b){
        let val1 = a[attr];
        let val2 = b[attr];

        if(that.order){
          if(that.sortType === 'publishTime'){            // 如果是时间就转换成时间格式
            return new Date(val2.replace(/-/,'/')) - new Date(val1.replace(/-/,'/'));
          }
          else if(that.sortType ==='article'){
            return val2.localeCompare(val1)
          }
          else{
            return val2 - val1;
          }


        }else{
          if(that.sortType === 'publishTime'){
            return new Date(val1.replace(/-/,'/')) - new Date(val2.replace(/-/,'/'));
          }
          else if(that.sortType ==='article'){
            return val1.localeCompare(val2)
          }
          else{
            return val1 - val2;
          }
        }
      }
    }
  },
  mounted() {
  },

  filters:{
    ellipsis(value){
      if (!value) return '';
      if (value.length > 250) {
        return value.slice(0,250) + '...'
      }
      return value
    },
    filter_article(value){
      if (!value) return '';
      if (value.length > 50) {
        return value.slice(0,50) + '...'
      }
      return value
    },
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
