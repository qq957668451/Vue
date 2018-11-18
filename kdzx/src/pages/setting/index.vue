<template>
	<div class="setting">
		<ul class="setting-nav">
			<li :class="{current:currentRoute=='/setting/info'}"><router-link to='/setting/info'>基础设置</router-link></li>
			<li :class="{current:currentRoute=='/setting/auth'}"><router-link to='/setting/auth'>权限设置</router-link></li>
			<li :class="{current:currentRoute=='/setting/adv'}"><router-link to='/setting/adv'>广告设置</router-link></li>
		</ul>
		<div class="setting-content">
			<router-view></router-view>
		</div>
	</div>
</template>
<script>
	export default{
		data(){
			return{
				currentRoute:'/setting/info'
			}
		},
		watch:{
			"$route":function(to,from){
				console.log(to);
				this.currentRoute = to.path;
			}
		},
		mounted(){
			this.$router.push(this.currentRoute);
		}
	}
</script>
<style>
	.setting-nav{
		overflow: hidden;
		border-bottom: 1px solid #ccc;
		padding: 0

	}
	.setting-nav > li{
		float: left;
		width: 120px;
		text-align: center;
		margin-bottom: .5em;
	}
	.current{
		border-bottom: 3px solid lightblue;
	}
</style>