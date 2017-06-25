import Crop from '../src'

var crop = new Crop('./durant2.jpg')
document.querySelector('#crop').addEventListener('click', function () {
  window.open(crop.result)
})