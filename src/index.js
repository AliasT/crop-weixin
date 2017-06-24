/*
 * 图片裁剪
 * just like 微信头像
 * in pure js
 * 更新方案来自google ui-elements-sample
 */

// import Hammer from 'hammer'

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
  }

  setUpImage(src) {
    const image = document.createElement('img')
    this.container.appendChild(image)
    this.image = image
    image.onload = (e) => {
      this._naturlWidth = e.target.width
      this._naturlHeight = e.target.height

      const width = window.innerWidth
      const height = this._naturlHeight / this._naturlWidth * width
      const y = (window.innerHeight - height) / 2
      this.setImageFrame({width, height, y })
    }
    image.src = src
  }

  setImageFrame({ width, height, x=0, y=0 }) {
    setCssRules(this.image, {
      width: `${width}px`,
      height: `${height}px`,
      transform: `translate(${x}px, ${y}px)`
    })      
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
    this.viewportLeft = (canvas.width / 2) - (CROP_WIDTH / 2)
    this.viewportTop = (canvas.height / 2) - (CROP_HEIGHT / 2)

    ctx.clearRect(this.viewportLeft, this.viewportTop, CROP_WIDTH, CROP_HEIGHT)

    ctx.strokeStyle = 'white'
    ctx.strokeWidth = 2
    ctx.strokeRect(this.viewportLeft, this.viewportTop, CROP_WIDTH, CROP_HEIGHT)
    ctx.stroke()

    this.container.appendChild(canvas)
  }
}
