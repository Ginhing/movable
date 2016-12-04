import {MovableCore} from './core'
import {ON_START, ON_STOP} from './constants'

export class MovableElement {
  constructor(node, ...args) {
    this.$el = node
    this.core = new MovableCore(this._applyTranslate, ...args)
    this.install()
  }

  install() {
    this.$el.addEventListener(ON_START, this.core.onStart)
    this.$el.addEventListener(ON_STOP, this.core.onStop)
  }

  uninstall() {
    this.$el.removeEventListener(ON_START, this.core.onStart)
    this.$el.removeEventListener(ON_STOP, this.core.onStop)
  }

  _applyTranslate = ({x, y}) => {
    cancelRAF(this.translateRequest)
    this.translateRequest = RAF(() => this.$el.style.transform = `translate(${x}px,${y}px)`)
  }
}

function cancelRAF(id) {
  id && window.cancelAnimationFrame(id)
}

function RAF(func) {
  window.requestAnimationFrame(func)
}
