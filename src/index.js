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

  constructor(imgsrc) {
    this.setUpContainer()
    this.setUpImage(imgsrc)
    this.setUpCanvas()
  }

  setUpImage(src) {
    const image = document.createElement('img')
    image.src = src
    this.container.appendChild(image)
  }

  setUpContainer() {
    this.container = document.createElement('div')
    document.body.appendChild(this.container)
  }

  setUpCanvas() {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    this.canvas = canvas

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
