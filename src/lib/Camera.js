class Camera {
  constructor () {
    this._x = undefined
    this._y = undefined
    this._dx = 0
    this._dy = 0
  }

  get x () {
    return this._x - this._dx
  }

  get y () {
    return this._y - this._dy
  }

  goto (x, y) {
    this._x = x
    this._y = y
  }

  /**
   * 鏡頭偏移(距離左上角距離)
   * @param dx
   * @param dy
   */
  setDelta (dx, dy) {
    this._dx -= dx
    this._dy -= dy
  }

  gotoItem (item) {
    this._x = item.globalX
    this._y = item.globalY
  }
}

export default Camera