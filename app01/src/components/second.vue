<template>
	<div class="second">
		<!-- <span :bind:title='msg'>  -->
			<!-- 鼠标悬停几秒钟查看此处动态绑定的提示信息 -->
		<!-- </span> -->
		{{msg}}
	</div>
</template>
<script>
export default {
  name: 'second',
  data () {
    return {
      msg: 'hello world'
    }
  }
}
</script>