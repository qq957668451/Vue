<template>
	<div class="login">
		<el-form>
			<el-form-item></el-form-item>
		</el-form>
		<el-button class = 'btn-sm' @click='login'>登录</el-button>
	</div>
</template>
<script>
	export default{
		data(){
			return{
				form:{}
			}
		}
	},methods:{
		login(){
			axios.post('/login',this.form).then(({data:result})=>{
				console.log('success',result);
			}).catch((error)=>{
				console.log('error',error);
			})
			// this.$root.currentComponent ='App';
		}
	}
</script>