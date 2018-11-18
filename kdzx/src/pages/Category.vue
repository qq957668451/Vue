<template>
	<div class="category">
		<!-- 按钮区域 -->
		<div class="btns" >
			<el-button size='small' @click='toaddCategory()'>添加</el-button>
			<el-button size='small' @click='deleteIds()'>批量删除</el-button>
		</div>
		<!-- 按钮区域结束 -->
		<!-- 表格区域 -->
		<!-- {{categories}} -->
		<div class="table" v-loading='loading'>
			 <el-table :data="categories" stripe style="width: 100%" :border='true' size='small'  @selection-change="handleSelectionChange">
			 	 <el-table-column
			      type="selection"
			      width=""
			      prop='id'>
			    </el-table-column>
			    <el-table-column
			      prop="name"
			      label="栏目名称"
			      width="">
			    </el-table-column>
			    <el-table-column
			      prop="parent.name"
			      label="父栏目"
			      width="">
			    </el-table-column>
			    <el-table-column
			      prop="comment"
			      label="描述" width="">
			    </el-table-column>
			    <el-table-column label="操作" width="">
			    	<template slot-scope='{row}'> 
			    		<i class="fa fa-pencil" title="修改" @click='update(row)'></i>
			    		<i class="fa fa-trash" title="删除" @click='deleteCategory(row.id)'></i>
			    	</template>
			    </el-table-column>
			  </el-table>
		</div>
		<!-- 表格区域结束 -->
		<!-- 模态框 -->
		<el-dialog :title="categoryDialog.title" :visible.sync="categoryDialog.visible">
		  <el-form :model="categoryDialog.form" :rules='rules' ref='categoryDialog.form'>
		    <el-form-item label="栏目名称" label-width="120px" prop='name'>
		      <el-input v-model="categoryDialog.form.name" autocomplete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="父栏目" label-width="120px">
		      <el-select v-model="categoryDialog.form.parentId" placeholder="一级栏目" style='width: 200px'>
		        <el-option v-for='c in categories' :label="c.name" :value="c.id" :key='c.id'></el-option>
		      </el-select>
		    </el-form-item>
		     <el-form-item label="描述信息" label-width="120px">
		        <el-input type="textarea":rows="2"placeholder="请输入内容" v-model="categoryDialog.form.comment">
				</el-input>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="closeCategoryDialog">取 消</el-button>
		    <el-button type="primary" @click="saveOrUpdateCategory('categoryDialog.form')">确 定</el-button>
		  </div>
		</el-dialog>
		<!-- 模态框结束 -->
	</div>
</template>
<script>
	import axios from '@/http/axios'
	export default{
		data(){
			return{
				categoryIds:[],
				categories:[],
				loading:false,
				categoryDialog:{
					title:'',
					form:{},
					visible:false
				},
				//表单验证
				rules:{
					name:[
					{required:'true',message:'请输入栏目名称',trigger:'blue'}
					]
				}
			}
		},
		
		//加载所有栏目信息
		created(){
			this.findAllCategories();
		},
		methods:{
			deleteIds(){
				axios.post('/manager/category/batchDeleteCategory',{ids:this.categoryIds}).then(({data:result})=>{
					if(result.status ==200){
						this.$notify({
							title:"批量删除成功",
						    type:"success"
						});
						this.findAllCategories();
					}else{
						console.log(result.message)
						this.$notify({
							title:"失败",
						    type:"warning"
						});
					}
				})
			},
			 handleSelectionChange(val) {
			 	this.categoryIds=[];
		        val.forEach((item)=>{
		        this.categoryIds.push(item.id);
		        })
		      },
			update(data){
				this.categoryDialog.form={
					id:data.id,
					name:data.name,
					parentId:data.parent?data.parent.id:'',
					comment:data.comment
				}
				this.categoryDialog.visible=true;
				// this.categoryDialog.form.id=data.id;
				// this.categoryDialog.form.name=data.name;
				// this.categoryDialog.form.parentId=data.parent?data.parent.id:'';
				// console.log(data);
				// this.categoryDialog.form.comment=data.comment;
			},
			deleteCategory(id){
				this.$confirm('此操作将永久删除该数据，是否继续','提示',{
					confirmButtonText:'确定',
					cancelButtonText:'取消',
					type:'warning'
				}).then(()=>{
					axios.get('/manager/category/deleteCategoryById?id='+id).then(({data:result})=>{
						if(result.status = 200){
							this.$notify({
								title:"删除成功",
							    type:"success"
							});
							this.findAllCategories();
						}else{
							this.$notify({
								title:"删除失败",
							    type:"warning"
							});
						}
					})
				})
			},
			saveOrUpdateCategory(formName){
				this.$refs[formName].validate((valid)=>{
					if(valid){
						axios.post('/manager/category/saveOrUpdateCategory',this.categoryDialog.form).then(({data:result})=>{
							if(result.status == 200){
								// 1.提示成功
								this.$notify({
									title:"成功",
								    type:"success"
								});
								this.closeCategoryDialog();
								console.log(result.message);
								this.findAllCategories()
							}else{
								console.log(result.message);
								this.$notify({
									title:"失败",
								    type:"warning"
								});
							}
						})
						.catch((error)=>{
							this.$notify({
								title:"失败",
								type:"error"
							});
						})
					}else{
						console.log('error submit!!');
			            return false;
					}
				})
					
				
			},
			closeCategoryDialog(){
				this.categoryDialog.visible=false;
				this.categoryDialog.form={};
			},
			toaddCategory(){
				this.categoryDialog.form={};
				this.categoryDialog.title='添加栏目';
				this.categoryDialog.visible=true
			},
			//查询所有栏目
			findAllCategories(){
				this.loading=true;
				axios.get('/manager/category/findAllCategory').then(({data:result})=>{
					//将查询出来的数据添加到categories中
					this.categories=result.data;
				}).catch((error)=>{
					console.log('error',error);
				}).finally(()=>{
					this.loading=false;
				});
			}
		}
	}
</script>
<!-- 局部样式 -->
<style scoped>
	.btns{
		margin-bottom: .5em;
	}
	.fa{
		margin:0 .3em;
		cursor: pointer;
	}
	.fa-trash{
		color: red;
	}
</style>