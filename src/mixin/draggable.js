export default {
  methods: {
    onShow() {
      let dialogElements = document.getElementsByClassName('q-dialog')
      this.target = dialogElements[0].querySelector('.q-card')
      this.nodeDragg = this.target.querySelector('.q-bar')
      if (this.draggable) {
        this.nodeDragg.addEventListener('mousedown', this.onGrab)
      }

      this.$emit('onShow')
    },
    onHide() {
      if (this.draggable) {
        document.removeEventListener('mousemove', this.onDrag)
        document.removeEventListener('mouseup', this.onLetGo)
        this.nodeDragg.removeEventListener('mousedown', this.onGrab)
      }
      this.$emit('input', false)
      this.$emit('onHide')
    },
    onDrag(e) {
      let originalStyles = window.getComputedStyle(this.target)
      this.target.style.left = parseInt(originalStyles.left) + e.movementX + 'px'
      this.target.style.top = parseInt(originalStyles.top) + e.movementY + 'px'
    },

    onLetGo() {
      document.removeEventListener('mousemove', this.onDrag)
      document.removeEventListener('mouseup', this.onLetGo)
    },

    onGrab() {
      document.addEventListener('mousemove', this.onDrag)
      document.addEventListener('mouseup', this.onLetGo)
    },
  },
}
