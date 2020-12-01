<template>
  <div class="about">
    <h1>This is an about page</h1>
    <h3>count:{{$store.state.count}}</h3>
    <h3>doubleCount:{{$store.getters.doubleCount}}</h3>
    <button @click="$store.commit('add')">add</button>
    <button @click="$store.dispatch('asyncAdd')">asyncAdd</button>
    <button @click="$store.state={count:6}">直接修改state</button>
  </div>
</template>
