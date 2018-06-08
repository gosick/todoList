<template>
  <div>
    <p><nuxt-link to="/"><button>todo page</button></nuxt-link></p>
    <div class="operations">
      <ul v-if="getImageSelect === true">
        <li @click="mosaic()">馬賽克</li>
        <li @click="tailor()">裁剪圖片</li>
        <li @click="rotate()">旋轉圖片</li>
        <li @click="clearEdit()">重設圖片</li>
        <li @click="zoomOut()">縮小圖片</li>
        <li @click="zoomIn()">放大圖片</li>
      </ul>
      <ul v-else>
        <li>上傳圖片</li>
      </ul>
    </div>
    <div>
      <input type="file" @change="processLocalFile($event)" />或使用網址
      <input type="text" @keyup.enter="processRemoteFile($event)" />
    </div>
    <div>
      <canvas ref="imgContent" class="img-wrap">你的瀏覽器不支援</canvas>
      <canvas ref="cutContent" class="cut-wrap">你的瀏覽器不支援</canvas>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      context: '',
      cutContext: '',
      canvas: '',
      cutCanvas: '',
      cutBeginX: 0,
      cutBeginY: 0,
      cutX: 0,
      cutY: 0,
      resizeWidth: 0,
      resizeHeight: 0,
      resizeNum: 0,
      resizeStop: false,
      isMasic: false,
      isTailor: false,
      isTranslate: false,
      squareEdgeLength: 20,
      angle: 0,
      img: '',
      imgSelect: false,
      imgSrc: ''
    }
  },
  computed: {
    getImageSelect () {
      return this.imgSelect
    }
  },
  methods: {
    processLocalFile (event) {
      let reader = new FileReader()
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (e) => {
        if (e.target.readyState === FileReader.DONE) {
          this.imgSrc = e.target.result
          this.initData()
        }
      }
      event.target.parentElement.style = 'display: none'
      this.imgSelect = true
    },
    processRemoteFile (event) {
      this.imgSrc = event.target.value
      event.target.parentElement.style = 'display: none'
      this.imgSelect = true
      this.initData()
    },
    clearEdit () {
      this.image.width = this.resizeWidth
      this.image.height = this.resizeHeight
      this.canvas.setAttribute('width', this.image.width)
      this.canvas.setAttribute('height', this.image.height)
      this.resizeNum = 0
      this.resizeStop = false
      this.context.drawImage(this.image, 0, 0)
      this.context.save()
      this.cutContext.clearRect(this.cutBeginX, this.cutBeginY, this.cutX, this.cutY)
    },
    zoomOut () {
      let ratio = 1
      if (this.resizeWidth > this.resizeHeight) {
        ratio = this.resizeHeight / this.resizeWidth
      } else {
        ratio = this.resizeWidth / this.resizeHeight
      }
      let limit = 3
      if (this.resizeNum <= limit && this.resizeStop === false) {
        this.resizeNum += 1
        this.image.width = this.image.width * ratio
        this.image.height = this.image.height * ratio
        this.canvas.setAttribute('width', this.image.width)
        this.canvas.setAttribute('height', this.image.height)
        this.context.drawImage(this.image, 0, 0)
      }
      if (this.resizeNum >= limit) {
        this.resizeStop = true
        this.resizeNum = limit
      }
    },
    zoomIn () {
      let ratio = 1
      if (this.resizeWidth < this.resizeHeight) {
        ratio = this.resizeHeight / this.resizeWidth
      } else {
        ratio = this.resizeWidth / this.resizeHeight
      }
      if (this.resizeNum >= 0 && this.resizeStop === true) {
        this.resizeNum -= 1
        this.image.width = this.image.width * ratio
        this.image.height = this.image.height * ratio
        this.canvas.setAttribute('width', this.image.width)
        this.canvas.setAttribute('height', this.image.height)
        this.context.drawImage(this.image, 0, 0)
      }
      if (this.resizeNum < 1) {
        this.resizeStop = false
        this.resizeNum = 0
      }
    },
    initData () {
      // https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6u3GMO-bmfVSXekFFang0R1-YmM-gDnqrxTn6fME3mZTemm-7lQ
      this.$refs.cutContent.style = 'display: none'
      let cutContent = this.$refs.cutContent
      let imgContent = this.$refs.imgContent
      this.canvas = imgContent
      this.cutCanvas = cutContent
      this.context = imgContent.getContext('2d')
      this.cutContext = cutContent.getContext('2d')
      this.image = new Image()
      this.image.crossOrigin = 'Anonymous'
      this.image.src = this.imgSrc
      this.image.onload = () => {
        this.canvas.setAttribute('width', this.image.width)
        this.canvas.setAttribute('height', this.image.height)
        this.resizeWidth = this.image.width
        this.resizeHeight = this.image.height
        let beginX = 0
        let beginY = 0
        let endX = 0
        let endY = 0
        this.context.drawImage(this.image, 0, 0)
        this.context.save()

        this.canvas.addEventListener('mousedown', e => {
          beginX = e.offsetX
          beginY = e.offsetY
          this.canvas.addEventListener('mouseup', e => {
            endX = e.offsetX
            endY = e.offsetY
            if (this.isMasic) {
              this.makeGrid(beginX, beginY, endX - beginX, endY - beginY)
            }
            if (this.isTailor) {
              this.cutCanvas.setAttribute('width', endX - beginX)
              this.cutCanvas.setAttribute('height', endY - beginY)
              this.cutContext.drawImage(this.image, beginX, beginY, endX - beginX, endY - beginY, 0, 0, endX - beginX, endY - beginY)
              this.cutBeginX = 0
              this.cutBeginY = 0
              this.cutX = endX - beginX
              this.cutY = endY - beginY
            }
          })
        })
      }
    },
    drawRect (x, y, width, height, fillStyle, lineWidth, strokeStyle, globalAlpha) {
      this.context.beginPath()
      this.context.rect(x, y, width, height)
      this.context.lineWidth = lineWidth
      this.context.strokeStyle = strokeStyle
      this.context.fillStyle = fillStyle
      this.context.globalAlpha = globalAlpha

      this.context.fill()
      this.context.stroke()
    },
    // 打馬賽克
    mosaic () {
      this.resetClickStatus()
      this.isMasic = true
    },
    makeGrid (beginX, beginY, rectWidth, rectHight) {
      const row = Math.round(rectWidth / this.squareEdgeLength) + 1
      const column = Math.round(rectHight / this.squareEdgeLength) + 1
      for (let i = 0; i < row * column; i++) {
        let x = (i % row) * this.squareEdgeLength + beginX
        let y = parseInt(i / row) * this.squareEdgeLength + beginY
        this.setColor(x, y)
      }
    },
    setColor (x, y) {
      const imgData = this.context.getImageData(x, y, this.squareEdgeLength, this.squareEdgeLength).data
      let r = 0
      let g = 0
      let b = 0
      for (let i = 0; i < imgData.length; i += 4) {
        r += imgData[i]
        g += imgData[i + 1]
        b += imgData[i + 2]
      }
      r = Math.round(r / (imgData.length / 4))
      g = Math.round(g / (imgData.length / 4))
      b = Math.round(b / (imgData.length / 4))
      this.drawRect(x, y, this.squareEdgeLength, this.squareEdgeLength, `rgb(${r}, ${g}, ${b})`, 2, `rgb(${r}, ${g}, ${b})`)
    },
    // 裁剪
    tailor () {
      this.resetClickStatus()
      this.isTailor = true
      this.$refs.cutContent.style = 'display: block'
    },
    // 旋轉
    rotate () {
      const x = this.image.width / 2
      const y = this.image.height / 2
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)// 清理畫布內容
      this.context.translate(x, y)
      this.context.rotate(90 * Math.PI / 180)
      this.context.translate(-x, -y)
      this.context.drawImage(this.image, 0, 0)
    },
    resetClickStatus () {
      this.isMasic = false
      this.isTailor = false
      this.isTranslate = false
    }
  }
}
</script>