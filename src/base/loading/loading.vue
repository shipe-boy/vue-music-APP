<!--  -->
<template>
  <div class="loading">
    <img width="24" height="24" src="./loading.gif">
    <p class="desc">{{msg}}</p>
  </div>
</template>

<script>
export default {
    props:{
        msg: {
            type: String,
            default: '正在加载中...'
        }
    },
  data () {
    return {
    }
  }
}

</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .loading
    width: 100%
    text-align: center
    .desc
      line-height: 20px
      font-size: $font-size-small
      color: $color-text-l
</style>