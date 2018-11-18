<template>
	<div class="user">
		<div class="topbtns" >
			<el-button size='small' @click='showModel'>新 增</el-button>
		</div>
		<div class="content">
			<el-card class="box-card" v-for='dat in user' :key='dat.id'>
				<div class="thumbnail">
					<img class="img-circle"  :src="dat.userface?dat.userface:img">
					<div class="caption">
						<div class="row">
							<span class='zuo'>用户名：</span>
							<span>{{dat.username}}</span>
						</div>
						<div class="row">
							<span class='zuo'>真实姓名：</span>
							<span>{{dat.nickname}}</span>
						</div>
						<div class="row">
							<span class='zuo'>注册时间：</span>
							<span>{{dat.regTime}}</span>
						</div>
						<div class="row">
							<span class='zuo'>email：</span>
							<span>{{dat.email}}</span>
						</div>
						<div class="row">
							<span class='zuo'>状 态：</span>
							<span>
								<input type="hidden" value="">
								<span class="switch">
									<input type="checkbox"/>
								</span>
							</span>
						</div>
					</div>
				</div>
			</el-card>

			<el-dialog  :title="obj.title" :visible.sync="obj.visible" width="30%" >
				{{obj.form}}
				<el-form :model="obj.form" label-width="80px" label-position='right'>
					<el-form-item label="用户名">
						<el-input v-model="obj.form.username"></el-input>
					</el-form-item>
					<el-form-item label="密码">
						<el-input v-model="password" type='password'></el-input>
					</el-form-item>
					<el-form-item label="重复密码">
						<el-input v-model="password2" type='password'></el-input>
					</el-form-item>
					<el-form-item label="真实姓名">
						<el-input v-model="obj.form.nickname"></el-input>
					</el-form-item>
					<el-form-item label="email">
						<el-input v-model="obj.form.email"></el-input>
					</el-form-item>
				</el-form>
					<el-button type="primary" @click="saveOrUpdataUser()">确 定</el-button>

			</el-dialog>

		</div>
	</div>

</template>
<script>
	import axios from '@/http/axios'
	export default{
		data(){
			return{
					password:'',
					password2:'',
				obj:{
					title:'',
					visible:false,
					form:{}
				},
				user:[],
				img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1514093920321&di=913e88c23f382933ef430024afd9128a&imgtype=0&src=http%3A%2F%2Fp.3761.com%2Fpic%2F9771429316733.jpg'
			}
		},
		mounted(){
			this.findAllUser();
		},
		methods:{
			saveOrUpdataUser(){
				if(this.password == this.password2){
					this.obj.form.password = this.password;
					console.log(this.obj.form);
					if(this.obj.form.username && this.password && this.password2 && this.obj.form.nickname && this.obj.form.email){
						axios.post('/manager/user/saveOrUpdateUser',this.obj.form).then(({data:result})=>{
							if(result.status == 200){
								this.$notify({
									title:"发布成功",
								    type:"success"
								});
								this.obj.visible=false;
								this.findAllUser();
							}else{
								this.$notify({
									title:"发布失败",
								    type:"warning"
								});
							}
						})
					}else{
						this.$notify({
							title:"请填写完整信息",
						    type:"warning"
						});
					}
				}else{
					this.$notify({
						title:"两次密码不一致",
					    type:"warning"
					});
				}
			},
			showModel(){
				this.obj.title='添加用户';
				this.obj.visible=true;
				this.password='';
				this.password2='';
				this.obj.form={};

			},
			findAllUser(){
				axios.get('/manager/user/findAllUser').then(({data:result})=>{
					if(result.status==200){
						this.user = result.data;
					}
				}).catch((error)=>{
					console.log(error);
				})
			}
		}
	}
</script>
<style>
	.text {
		font-size: 14px;
	}
	.item {
		padding: 18px 0;
	}
	.box-card {
		width: 33%;
		display: inline-block;
	}
	.content{
		margin-top: 10px;
	}
	.row{
		line-height: 40px;
	}
	.img-circle{
		width: 150px;
		height: 150px; 
		border-radius: 50%;
		/*text-align: center;*/
		/*margin-left: 100px;*/
		/*margin:0 auto;*/
	}
	.witch{
		display: inline-block;
	}
	.thumbnail{
		text-align: center;
	}

</style>