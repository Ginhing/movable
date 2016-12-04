const ON_START = 'mousedown'
const ON_MOVE = 'mousemove'
const ON_STOP = 'mouseup'
const noop = () => {}
const movingArea = document.body

function userSelect(style = 'auto') {
  return `
    user-select: ${style};
    -moz-user-select: ${style};
    -webkit-user-select: ${style};
    -ms-user-select: ${style};
  `.trim()
}

class Point {
  constructor({x = 0, y = 0} = {}) {
    this.set({x, y})
  }

  set({x, y}) {
    this.x = x
    this.y = y
  }

  move({x, y}) {
    return new Point({
      x: this.x + x,
      y: this.y + y
    })
  }

  diff({x, y}) {
    return new Point({
      x: this.x - x,
      y: this.y - y
    })
  }
}

export class MovableElement {
  constructor(
    node, {
      onStart = noop,
      onMove = noop,
      onStop = noop
    } = {}
  ) {
    this.$el = node
    this.callback = {onStart, onMove, onStop}
    this.rectangle = null
    this.movingPoint = new Point()
    this.movedPoint = new Point()
    this.startingPoint = new Point()
    this.moving = false

    this.install()
  }

  install() {
    this.$el.addEventListener(ON_START, this._start)
    this.$el.addEventListener(ON_STOP, this._stop)
  }

  uninstall() {
    this.$el.removeEventListener(ON_START, this._start)
    this.$el.removeEventListener(ON_STOP, this._stop)
  }

  _start = (e) => {
    if (this.moving || this.callback.onStart(e) === false) return false

    movingArea.addEventListener(ON_MOVE, this._move)
    this.startingPoint.set({x: e.clientX, y: e.clientY})
    this.rectangle = this.$el.getBoundingClientRect()
    this.moving = true
    movingArea.style.cssText = userSelect('none')
  }

  _move = (e) => {
    if (this.moving) {
      const ePoint = new Point({x: e.clientX, y: e.clientY})
      this.movingPoint.set(
        this.movedPoint.move(
          ePoint.diff(this.startingPoint)
        )
      )
      if (this.callback.onMove(e, this.movingPoint) === false) return false

      this._applyTranslate(this.movingPoint)
    }
  }

  _stop = (e) => {
    if (this.callback.onStop(e) === false) return false

    movingArea.removeEventListener(ON_MOVE, this._move)
    this.movedPoint.set(this.movingPoint)
    this.moving = false
    movingArea.style.cssText = userSelect()
  }

  _applyTranslate({x, y}) {
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
