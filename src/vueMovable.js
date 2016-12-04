import {MovableCore} from './core'
import {ON_START, ON_STOP} from './constants'

function extendVNode(vnode, data) {
  const cloned = Object.create(vnode)
  const {data: origData} = vnode
  if (origData) {
    cloned.data = {}
    Object.keys(origData).forEach(key => {
      cloned.data[key] = {...origData[key], ...data[key]}
    })
  } else cloned.data = data
  return cloned
}

export const VueMovable = {
  props: {
    onStart: Function,
    onStop: Function,
    onMove: Function
  },
  created() {
    const {onStart, onStop, onMove} = this
    const handleMove = ({x, y}) => {
      this.x = x
      this.y = y
    }
    this.core = new MovableCore(handleMove, {onStart, onStop, onMove})
  },
  data() {
    return {
      x: 0,
      y: 0
    }
  },
  render() {
    const firstVNode = this.$slots.default[0]
    return extendVNode(firstVNode, {
      style: {
        transform: `translate(${this.x}px,${this.y}px)`
      },
      on: {
        [ON_START]: this.core.onStart,
        [ON_STOP]: this.core.onStop,
      }
    })
  }
}
