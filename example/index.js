import Vue from 'vue'
import {MovableElement} from '../src/movableElement'
import vueExample from './example.vue'

new MovableElement(document.getElementById('example').firstElementChild)

new Vue({
  el: '#vue-example',
  render: h => h(vueExample)
})
