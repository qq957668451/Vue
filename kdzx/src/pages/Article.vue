<!-- <template>
	<div class="article">
		<div class="articleTop">
			<el-select v-model="obj.categoryId" placeholder="请选择" size='small' @change='finAllArticle'>
				<el-option v-for="item in opt" :label="item.name" :value="item.id">
				</el-option>
			</el-select>
			<el-button class='add' size='small' @click='addArticle()'>添加</el-button>
			<el-button size='small' @click='deleteIds()'>批量删除</el-button>
		</div>
		表格数据加载
		<div class="table" style="margin-top: 10px;">
			<el-table :data="data" stripe style="width: 100%" :border='true' size='small'  @selection-change="handleSelectionChange">
			 	<el-table-column  type="selection" width="55" prop='id'></el-table-column>
			    <el-table-column  prop="title" label="文章标题" width="180"></el-table-column>
			    <el-table-column  prop="category.name" label="所属栏目" width="180"></el-table-column>
			    <el-table-column  prop="liststyle" label="列表样式" width="180"></el-table-column>
			    <el-table-column  prop="author" label="作者" width="180"></el-table-column>
			    <el-table-column  prop="publishtime" label="发布时间" width="180"></el-table-column>
			    <el-table-column  prop="readtimes" label="阅读次数" width="180"></el-table-column>
			    <el-table-column label="操作">
			    	<template slot-scope='{row}'> 
			    		<i class="fa fa-pencil" title="修改" @click='updateArticle(row)'></i>
			    		<i class="fa fa-trash" title="删除" @click='deleteArticle(row.id)'></i>
			    	</template>
			    </el-table-column>
			</el-table>
		</div>
		表格结束
		模态框
		<div class="mt">
			<el-dialog :title="modia.title" width="50%" :visible.sync="modia.visible">
				{{modia.form}}
				<el-form :model="modia.form" label-width="80px" label-position='right'>
					<el-form-item label="文章标题">
						<el-input v-model="modia.form.title"></el-input>
					</el-form-item>
					<el-form-item label="所属栏目">
						<el-select v-model="modia.form.categoryId" placeholder="请选择所属栏目">
							<el-option v-for="item in opt" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="发布样式">
						<div style="display: inline-block;">
							<input type="radio" name="liststyle" id="one" value="style-one" v-model='modia.form.liststyle'/>
							<label for="one"><img src="../images/one.jpg" class="imges" /></label>
						</div>
						<div style="display: inline-block; margin-left: 20px;">
							<input type="radio" name="liststyle" id="two" value="style-two" v-model='modia.form.liststyle'/>
							<label for="two"><img src="../images/two.jpg" class="imges"/></label>
						</div>
					</el-form-item>
					<el-form-item label="正文">
						<el-input type="textarea" v-model="modia.form.content"></el-input>
					</el-form-item>
					</el-form>
					<div>
					    <el-button type="primary" @click="saveOrUpdate()" class='addbtn'>发 布</el-button>
					</div>
			</el-dialog>
		</div>
		

	</div>
</template>
<script>
	import axios from '@/http/axios'
	import qs from 'qs'
	export default{
		data(){
			return {
				categoryIds:[],
				modia:{
					form:{},
					visible:false,
					title:''
				},
				data:[],
				opt:[],
				obj:{
					page:'0',
					pageSize:'1000',
					categoryId:'',
				}
			}
		},
		mounted(){
			this.findAllOptions();
		},
		methods:{
			updateArticle(data){
				console.log(data);
				this.modia.form={
					id:data.id,
					title:data.title,
					categoryId:data.category.id,
					liststyle:data.liststyle,
					content:data.content
				}
				this.modia.visible=true;
			},
			deleteArticle(id){
				this.$confirm('此操作将永久删除该数据，是否继续','提示',{
					confirmButtonText:'确定',
					cancelButtonText:'取消',
					type:'warning'
				}).then(()=>{
					axios.get('/manager/article/deleteArticleById?id='+id).then(({data:result})=>{
						if(result.status = 200){
							this.$notify({
								title:"成功",
							    type:"success"
							});
							this.findAllOptions();
						}else{
							this.$notify({
								title:"失败",
							    type:"warning"
							});
						}
					})
				})
			},
			 handleSelectionChange(val) {
			 	this.categoryIds=[];
		        val.forEach((item)=>{
		        this.categoryIds.push(item.id);
		        })
		      },
			deleteIds(){
				axios.post('/manager/article/batchDeleteArticle',{ids:this.categoryIds}).then(({data:result})=>{
					if(result.status ==200){
						this.$notify({
							title:"批量删除成功",
						    type:"success"
						});
						this.findAllOptions();
					}else{
						console.log(result.message)
						this.$notify({
							title:"失败",
						    type:"warning"
						});
					}
				})
			},
			saveOrUpdate(){
				if(this.modia.form.title && this.modia.form.categoryId && this.modia.form.liststyle && this.modia.form.content){
					axios.post('/manager/article/saveOrUpdateArticle',this.modia.form).then(({data:result})=>{
						console.log(result.message);
						this.modia.visible=false;
						this.$notify({
							title:"发布成功",
						    type:"success"
						});
						this.findAllOptions();

					})
				}else{
					this.$notify({
						title:"请填写完整信息",
					    type:"warning"
					});
				}
				
			},
			addArticle(){
				this.modia.form={};
				this.modia.title='添加文章';
				this.modia.visible=true;
			},
			finAllArticle(){
				axios.get('/manager/article/findArticle',{params:this.obj}).then(({data:result})=>{
					this.data=result.data.list;
				}).catch((error)=>{
					console.log(error);
				})
			},
			findAllOptions(){
				axios.get('/manager/category/findAllCategory').then(({data:result})=>{
					//将查询出来的数据添加到categories中
					this.opt=result.data;
					this.obj.categoryId=this.opt[0].id;
					this.finAllArticle()
				}).catch((error)=>{
					console.log('error',error);
				})
			}
		}
	}
</script>
<style>
	.add{
		margin-left: 10px; 
	}
	.imges{
		width: 240px;
		height: 100px;
	}
	.addbtn{
		position: relative;
		left: 650px;
	}
		.fa{
		margin:0 .3em;
		cursor: pointer;
	}
	.fa-trash{
		color: red;
	}
</style> -->



<template>
	<div class="article">
		<!-- 按钮区域 -->
		<div class="btns" >
			<el-select v-model="params.categoryId" style='width: 150px;' clearable placeholder="所有文章" size='small'>
				<el-option v-for='c in categories' :label='c.name' :value='c.id' :key='c.id'></el-option>
			</el-select>
			<el-input  placeholder="请输入关键字" v-model="params.keywords" clearable size='small' style='width: 150px'>
			</el-input>
			<el-button size='small' @click='toaddArticle()'>添加</el-button>
			<el-button size='small' @click='batchDeleteArticle()'>批量删除</el-button>
		</div>
		<!-- 按钮区域结束 -->
		<!-- 数据区域 -->
		<div class="article_tbl" v-loading='loading'>
			 <el-table :data="articles" stripe style="width: 100%" :border='true' size='small'  @selection-change="handleSelectionChange">
			 	 <el-table-column
			      type="selection"
			      width=""
			      prop='id'>
			    </el-table-column>
			    <el-table-column
			      prop="title"
			      label="文章标题"
			      width="180">
			    </el-table-column>
			    <el-table-column
			      prop="category.name"
			      label="所属栏目"
			      width="120">
			    </el-table-column>
			    <el-table-column
			      prop="author"
			      label="作者">
			    </el-table-column>
			     <el-table-column
			      prop="publishtime"
			      label="发布时间">
			    </el-table-column>
			     <el-table-column
			      prop="readtimes"
			      label="阅读次数">
			    </el-table-column>
			    <el-table-column label="操作" width="">
			    	<template slot-scope='{row}'> 
			    		<i class="fa fa-pencil" title="修改" @click='toUpdate(row)'></i>
			    		<i class="fa fa-trash" title="删除" @click='deleteArticle(row.id)'></i>
			    	</template>
			    </el-table-column>
			  </el-table>
		</div>
		<!-- 数据区域结束 -->
		<!-- 分页 -->
		<div class="page">
			 <el-pagination
			    layout="prev, pager, next"
			    @current-change='handleCurrentChange'
			    :page-size='params.pageSize'
			    :total="total">
			 </el-pagination>
		</div>
		<!-- 分页结束 -->
		<!-- 模态框区域 -->
		<el-dialog :title="articleDialog.title" :visible.sync="articleDialog.visible" fullscreen>
		  <el-form :model="articleDialog.form" :rules="rules" ref="articleDialog.form">
		    <el-form-item label="文章标题" label-width="120px" prop='title'>
		      <el-input v-model="articleDialog.form.title" autocomplete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="所属栏目" label-width="120px" prop='categoryId'>
		      <el-select v-model="articleDialog.form.categoryId" placeholder="一级栏目">
		        <el-option v-for='d in categories' :label="d.name" :value="d.id" :key='d.id'></el-option>
		      </el-select>
		    </el-form-item>
		    <el-form-item label="列表样式" label-width="120px" prop='liststyle'>
		    	<div class="list_style">
		      	<div class="list_one" 
		      	:class='{current:articleDialog.form.liststyle == "style-two"}' 
		      	@click='articleDialog.form.liststyle="style-two"'>
		      		<img src="@/assets/one.jpg" alt="">
		      	</div>
		      	<div class="list_two" 
		      	:class='{current:articleDialog.form.liststyle == "style-one"}'
		      	@click='articleDialog.form.liststyle="style-one"'>
		      		<img src="@/assets/two.jpg" alt="">
		      	</div>
		      </div>
		    </el-form-item>
		    <el-form-item label="缩略图" label-width="120px">
				<el-upload
				action="http://120.79.144.28:8099/manager/file/upload"
				:file-list='articleDialog.fileList'
				:on-success='handlerUploadSuccess'
				:on-remove='handlerUploadRemove'
				list-type="picture">
					<el-button size="small" type="primary">点击上传</el-button>
					<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
				</el-upload>
		    </el-form-item>
		     <el-form-item label="文章正文" label-width="120px" prop='content'>
		        <!-- <el-input type="textarea":rows="5"placeholder="请输入内容" v-model="articleDialog.form.content"> -->
				<!-- </el-input> -->
				<mavon-editor ref=md v-model="articleDialog.form.content"/>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="closeArticleDialog">取 消</el-button>
		    <el-button type="primary" @click="saveOrUpdateArticle('articleDialog.form')">确 定</el-button>
		  </div>
		</el-dialog>
		<!-- 模态框区域结束 -->
	</div>
</template>
<script>
	import axios from '@/http/axios'
	export default{
		data(){
			return{
				rules:{
					title:[
						{ required:true ,message:'请输入文章标题',trigger:'blur'},
						{ min :3,max:20,message:'长度在3到10个字符',trigger:'blur'}

					],
					categoryId:[
						{ required: true, message: '请填写所属栏目', trigger: 'change'}

					],
					liststyle:[
						{ required: true, message: '文章样式信息', trigger: 'change' }
					],
					content:[
						{ required: true, message: '请填文章内容', trigger: 'blur'}
					]
				},
				ids:[],
				value:'',
				categories:[],
				loading:false,
				articles:[],
				total:0,
				params:{
					page:0,
					pageSize:5,
					categoryId:undefined,
					keywords:undefined,
				},
				articleDialog:{
					title:'',
					visible:false,
					form:{
						liststyle:'style-one',
						fileIds:[],
					},
					fileList:[]
				}
			}
		},
		//只要params中的任意参数改变，就会执行
		watch:{
			params:{
				handler:function(){
					this.findAllArticles();
				},
				deep:true
			}
		},
		created(){
			this.findAllCategories();
			this.findAllArticles();
		},
		methods:{
			hhttml(status,value){
				console.log(status);
				console.log(value);
			},
			toUpdate(row){
				this.articleDialog.visible= true;
				this.articleDialog.title='修改文章'
				

				//处理表单数据
				let article = _.cloneDeep(row);
				//处理附件显示信息
				this.articleDialog.fileList = article.articleFileVMs.map((item)=>{
					return {
						name:item.cmsFile.id,
						url:'http://39.108.81.60:8888/group'+item.cmsFile.id
					}
				})
				article.categoryId=article.category.id;
				delete article.category;
				article.fileIds = article.articleFileVMs.map(item=>item.cmsFile.id);
				delete article.articleFileVMs;
				for(let key in article){
					let val = article[key]
					if(!val){
						delete article[key]
					}
				}
				this.articleDialog.form=article;
			},
			batchDeleteArticle(){
				axios.post('/manager/article/batchDeleteArticle',{ids:this.ids}).then(({data:result})=>{
					if(result.status == 200){
						this.$notify({
							title:'批量删除成功',
							type:'success'
						});
						this.findAllArticles();
					}else{
						this.$notify({
							title:'批量删除失败',
							type:'warning'
						})
					}
				})
			},
			handleSelectionChange(val){
				this.ids = val.map((item)=>{
					return item.id;
				});
			},
			closeArticleDialog(){
				this.articleDialog.visible=false;
			},
			saveOrUpdateArticle(formName){
				this.articleDialog.form.source = this.$refs.md.d_render;
				this.$refs[formName].validate((valid) => {
			        if (valid) {
			            axios.post('/manager/article/saveOrUpdateArticle',this.articleDialog.form).then(({data:result})=>{
							if(result.status == 200){
								// 1.提示成功
								this.$notify({
									title:"成功",
								    type:"success"
								});
								this.closeArticleDialog();
								console.log(result.message);
								this.findAllArticles()
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
			        } else {
			          console.log('error submit!!');
			          return false;
			         }
			    });
				
				// if(this.articleDialog.form.name && this.articleDialog.form.parentId && this.articleDialog.form.comment){
					
			},
			//删除附件
			handlerUploadRemove(file){
				console.log(file.name);
				//调用接口删除图片
				axios.get('/manager/file/delete',{
					params:{
						id:file.name
					}
				}).then(()=>{
					this.$notify({
						title:'删除成功',
						type:'success'
					})
					//从fileIds中删除
					_.remove(this.articleDialog.form.fileIds,(id)=>{
						return id == file.name;
					});
					this.articleDialog.form.fileIds.push(1);
					this.articleDialog.form.fileIds.pop();
				}).catch(()=>{
					this.$notify({
						title:'删除失败',
						type:'error'
					})
				})

				
			},
			handlerUploadSuccess(response,file,fileList){
				this.articleDialog.form.fileIds.push(response.data.id);
			},
			toaddArticle(){
				this.articleDialog.visible=true;
				this.articleDialog.title='发布资讯';
				this.articleDialog.form={
					liststyle:'style-one',
					fileIds:[],
				}
				this.articleDialog.fileList=[];
			},
			handleCurrentChange(page){
				this.params.page=page-1;
			},
			//查询所有文章
			findAllArticles(){
				this.loading=true;
				axios.get('/manager/article/findArticle',{
					params:this.params}).then(({data:result})=>{
					//将查询出来的数据添加到categories中
					this.total=result.data.total;
					this.articles=result.data.list;
				}).catch((error)=>{
					this.$notify({
						title:"失败",
						type:"error"
					});
				}).finally(()=>{
					this.loading=false;
				});
			},
			deleteArticle(id){
				axios.get('/manager/article/deleteArticleById?id='+id).then(({data:result})=>{
					if(result.status == 200){
						this.$notify({
							title:'删除成功',
							type:'success'
						})
						this.findAllArticles();
					}else{
						this.$notify({
							title:"删除失败",
							type:"error"
						})
						console.log(error);
					}
				})
			},
			//查询所有栏目
			findAllCategories(){
				axios.get('/manager/category/findAllCategory').then(({data:result})=>{
					//将查询出来的数据添加到categories中
					this.categories=result.data;
				}).catch((error)=>{
					this.$notify({
						title:"失败",
						type:"error"
					});
				})
			}
		}
	}
</script>
<style scoped>
	.list_style img{
		width: 240px;
		height: 100px;
	}
	.list_style>div{
		height: 105px;
		border: 1px solid #ededed;
		border-radius: 5px;
		padding: 2px;
		float: left;
	}
	.list_style > div.current{
		border-color: red;
	}
	.list_style>div.list_two{
		margin-left: 20px;
	}
	.btns{
		margin-bottom: .5em;
	}
	.fa{
		margin:0 .3em;
		cursor: pointer;
	}
	.fa-trash{
		margin-left: 10px;
		color: red;
	}
</style>