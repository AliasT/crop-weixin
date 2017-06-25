/*
 * 图片裁剪
 * just like 微信头像
 * in pure js
 * 更新方案来自google ui-elements-sample
 */

import Hammer from 'hammerjs'

function setCssRules(target, rules) {
  Object.keys(rules).reduce((ret, cur) => {
    ret.style[cur] = rules[cur]
    return ret
  }, target)
}

const CROP_WIDTH = 200
const CROP_HEIGHT = 200


export default class Crop {
  static zIndex = 200
  ready = false
  
  constructor(imgsrc) {
    this.setUpContainer()
    this.setUpImage(imgsrc)
    this.setUpCanvas()
    this.setUpListeners()
    this.update()
  }

  setUpListeners() {
    const hammer = new Hammer(this.canvas, {
      domEvents: true
    })
    Hammer.Pan({ threshold: 0 })
    Hammer.Pinch({ threshold: 0 })

    hammer.on('panstart', this.panstart)
    hammer.on('panmove', this.panmove)
    hammer.on('panend', this.panend)

    hammer.on('pinchstart', this.pinchstart)
    hammer.on('pinchmove', this.pinchmove)
    hammer.on('pinchend', this.pinchend)

    hammer.get('pinch').set({ enable: true })
    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
  }

  panstart = (evt) => {
    this.startX = this.currentX
    this.startY = this.currentY
  }

  panmove = (evt) => {
    this.currentX = this.startX + evt.deltaX
    this.currentY = this.startY + evt.deltaY
  }

  panend = (evt) => {
    this.check()
  }

  pinchstart = (evt) => {
    this.startX = this.currentX
    this.startY = this.currentY

    this.startWidth = this.currentWidth
    this.startHeight = this.currentHeight
  }

  pinchmove = (evt) => {
    const { x, y } = evt.center
    this.currentX = evt.scale * (this.startX - x) + x
    this.currentY = evt.scale * (this.startY - y) + y
    this.currentWidth = this.startWidth * evt.scale
    this.currentHeight = this.startHeight * evt.scale
  }

  pinchend = (evt) => {
    // this.check()
  }

  update= () => {
    const { currentWidth, currentHeight, currentX, currentY } = this
    setCssRules(this.image, {
      width: `${currentWidth}px`,
      height: `${currentHeight}px`,
      transform: `translate(${currentX}px, ${currentY}px)`
    })  
    requestAnimationFrame(this.update)
  }

  check = () => {
    const maxY = Math.max(this.viewportY, this.viewportY + (CROP_HEIGHT - this.currentHeight) / 2)
    const minY = Math.min(this.viewportY, this.viewportY - this.currentHeight + CROP_HEIGHT)
    const maxX = this.viewportX
    const minX = Math.min(this.viewportX, this.viewportX - this.currentWidth + CROP_WIDTH)

    if (this.currentX < minX) this.currentX = minX
    if (this.currentX > maxX) this.currentX = maxX

    if (this.currentY < minY) {
     if (this.currentHeight < CROP_HEIGHT) this.currentY = maxY
     else this.currentY = minY
    }
    if (this.currentY > maxY) this.currentY = maxY

    this.image.style.willChange = 'transform, width, height'
    this.image.style.transition = "transfrom, width, height, 150ms ease-out"
    const transitionEnd = (evt) => {
      this.image.removeEventListener('transitionend', transitionEnd)
      this.image.style.willChange = 'initial'
      this.image.style.transition = ''
    }
    this.image.addEventListener('transitionend', transitionEnd)
  }

  setUpImage(src) {
    const image = document.createElement('img')
    this.container.appendChild(image)
    this.image = image
    image.onload = (e) => {
      this._naturlWidth = e.target.width
      this._naturlHeight = e.target.height

      this.currentWidth = window.innerWidth
      this.currentHeight = this._naturlHeight / this._naturlWidth * this.currentWidth
      this.currentX = 0
      this.currentY = (window.innerHeight - this.currentHeight) / 2
    }
    image.src = src
  }

  setImageFrame({ width, height, x=0, y=0 }) {
    
  }

  setUpContainer() {
    this.container = document.createElement('div')
    setCssRules(this.container, {
      overflow: 'hidden',
      position: 'fixed',
      width: '100%',
      left: 0,
      top: 0,
      bottom: 0,
      right: 0
    })
    document.body.appendChild(this.container)
    // const rect = this.container.getBoundingClientRect()
    // this._containerWidth = rect.width
    // this._containeHeight = rect.height
  }

  setUpCanvas() {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    this.canvas = canvas

    setCssRules(canvas, {
      position: 'absolute',
      left: 0,
      top: 0
    })
    
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fill()

    // 裁剪预览区的左上坐标
    this.viewportX = (canvas.width / 2) - (CROP_WIDTH / 2)
    this.viewportY = (canvas.height / 2) - (CROP_HEIGHT / 2)

    ctx.clearRect(this.viewportX, this.viewportY, CROP_WIDTH, CROP_HEIGHT)

    ctx.strokeStyle = 'white'
    ctx.strokeWidth = 2
    ctx.strokeRect(this.viewportX, this.viewportY, CROP_WIDTH, CROP_HEIGHT)
    ctx.stroke()

    this.container.appendChild(canvas)
  }
}
