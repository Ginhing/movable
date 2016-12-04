import {ON_MOVE} from './constants'

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

export class MovableCore {
  constructor(
    handleMove, {
      onStart = noop,
      onMove = noop,
      onStop = noop
    } = {}
  ) {
    this.handleMove = handleMove
    this.callback = {onStart, onMove, onStop}
    this.rectangle = null
    this.movingPoint = new Point()
    this.movedPoint = new Point()
    this.startingPoint = new Point()
    this.moving = false
  }

  _start = (e) => {
    if (this.moving || this.callback.onStart(e) === false) return false

    movingArea.addEventListener(ON_MOVE, this._move)
    this.startingPoint.set({x: e.clientX, y: e.clientY})
    this.rectangle = e.currentTarget.getBoundingClientRect()
    this.moving = true
    movingArea.style.cssText = userSelect('none')
  }

  _move = (e) => {
    if (this.moving) {
      const ePoint = new Point({x: e.clientX, y: e.clientY})
      this.movingPoint.set(
        this.movedPoint.move(ePoint).diff(this.startingPoint)
      )
      if (this.callback.onMove(e, this.movingPoint) === false) return false

      this.handleMove.call(null, this.movingPoint)
    }
  }

  _stop = (e) => {
    if (this.callback.onStop(e) === false) return false

    movingArea.removeEventListener(ON_MOVE, this._move)
    this.movedPoint.set(this.movingPoint)
    this.moving = false
    movingArea.style.cssText = userSelect()
  }

  get onStart() {
    return this._start
  }

  get onStop() {
    return this._stop
  }
}
