<template>
	<div class="second">
		<span :title='msg'>
			鼠标悬停几秒钟查看此处动态绑定的提示信息
		</span>
		<ul>
			<li v-for='a in total'>姓名：{{a.name}} 年龄:{{a.age}}</li>
		</ul>
		<button @click='reverseMessage'>点我</button>
		<p v-if='seen'>
			你现在可以看到我
		</p>
		<p>{{message}}</p>
		<input type="text" v-model='message'>



	</div>
</template>
<script>
export default {
  data () {
    return {
      message:'hello world',
      msg: '页面加载于' + new Date().toLocaleString(),
      seen:true,
      total:[
	      {name:'terry',age:12},
	      {name:'lerry',age:12},
	      {name:'tom',age:12}
      ]
    }
  },
  methods:{
  	reverseMessage(){
  		this.message = this.message.split('').reverse().join('')
  		if(this.seen==true){
  			this.seen=false
  		}else{
  			this.seen=true
  		}
  		
  	}
  }
}
</script>