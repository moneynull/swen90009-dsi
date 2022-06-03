<template>
  <div>
    <el-button icon="el-icon-s-tools" @click="dialogFormVisible = true" type="info" circle></el-button>

    <el-dialog title="Advanced Search" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" label-width="205px">
        <el-form-item label="With all of the words:" >
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="With the exact phrase:" >
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="With at least one of the words:" >
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="Without the words:" >
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="Where my words occur: ">
          <el-radio-group v-model="form.resource">
            <el-radio label="Anywhere in the article"></el-radio>
            <el-radio label="In the title of the article"></el-radio>
            <el-radio v-show="false"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Articles published in: " >
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="Articles dated between: ">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="Start" v-model="form.date1" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-date-picker type="date" placeholder="End" v-model="form.date2" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click=doSearch :loading="searchLoading">Search</el-button>
        <el-button @click="dialogFormVisible = false">cancel</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "advancedSearch",
  props:[
    'treeMapFlag'
  ],
  data(){
    return{
      dialogFormVisible: false,
      formLabelWidth: '120px',
      searchLoading:false,
      form: {
        name: '',
        date1: '',
        date2: '',
        resource: 'Anywhere in the article',
      },
    }
  },
  methods:{
    doSearch(){
      this.searchLoading=true
      setTimeout(() => {
        this.dialogFormVisible=false
        this.searchLoading=false
        this.treeMapFlag=true
        this.$emit('advanceChange',this.treeMapFlag)
      }, 500);
    }
  }
}
</script>

<style scoped>

</style>
