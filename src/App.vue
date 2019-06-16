<template>
  <div id="app">
    <header-nav></header-nav>
    <nav-tab></nav-tab>
    <keep-alive>
        <router-view />
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
  import HeaderNav from './components/header/headerNav'
  import NavTab from './components/nav/nav'
  import Player from './components/player/player'
  export default {
    name: 'App',
    components: {
      HeaderNav,
      NavTab,
      Player
    }
  }

</script>

