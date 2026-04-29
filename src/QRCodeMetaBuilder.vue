<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import QRCodeStyling from 'qr-code-styling'
import { DotStyleType } from '@/container/qrcode/dot_style_type.ts'

// QR Code data and options
const qrData = ref('https://quickqr.app')
const qrWidth = ref(300)
const qrHeight = ref(300)
const dotStyle = ref<DotStyleType>(DotStyleType.SQUARE)
const dotColor = ref('#000000')
const backgroundColor = ref('#ffffff')
const imageUrl = ref('')
const imageSize = ref(0.4)
const margin = ref(20)
const errorCorrectionLevel = ref('Q')

// Dot style options
const dotStyleOptions = [
  { label: 'Square', value: DotStyleType.SQUARE },
  { label: 'Rounded', value: DotStyleType.ROUNDED },
  { label: 'Dots', value: DotStyleType.DOTS },
  { label: 'Classy', value: DotStyleType.CLASSY },
  { label: 'Classy Rounded', value: DotStyleType.CLASSY_ROUNDED },
]

const errorCorrectionOptions = [
  { label: 'Low (L)', value: 'L' },
  { label: 'Medium (M)', value: 'M' },
  { label: 'Quartile (Q)', value: 'Q' },
  { label: 'High (H)', value: 'H' },
]

// Canvas ref for QR code rendering
const canvasRef = ref<HTMLDivElement | null>(null)
let qrCodeInstance: QRCodeStyling | null = null

// Render QR code
const renderQRCode = () => {
  if (!canvasRef.value) return

  // Clear previous QR code
  canvasRef.value.innerHTML = ''

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- qr-code-styling types are complex, needs comprehensive refactor
  const options: any = {
    width: qrWidth.value,
    height: qrHeight.value,
    data: qrData.value,
    margin: margin.value,
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: errorCorrectionLevel.value,
    },
    dotsOptions: {
      color: dotColor.value,
      type: dotStyle.value,
    },
    backgroundOptions: {
      color: backgroundColor.value,
    },
  }

  if (imageUrl.value) {
    options.image = imageUrl.value
    options.imageOptions = {
      crossOrigin: 'anonymous',
      margin: 0,
      imageSize: imageSize.value,
      hideBackgroundDots: true,
    }
  }

  qrCodeInstance = new QRCodeStyling(options)
  qrCodeInstance.append(canvasRef.value)
}

// Watch for changes and re-render
watch([qrData, qrWidth, qrHeight, dotStyle, dotColor, backgroundColor, imageUrl, imageSize, margin, errorCorrectionLevel], () => {
  renderQRCode()
}, { deep: true })

// Download QR code
const downloadQRCode = (format: 'png' | 'svg' | 'jpeg') => {
  if (!qrCodeInstance) return
  qrCodeInstance.download({ name: 'quickqr', extension: format })
}

// Copy to clipboard (using canvas since getRaw may not be available)
const copyToClipboard = async () => {
  if (!canvasRef.value || !qrCodeInstance) return
  try {
    const canvas = canvasRef.value.querySelector('canvas')
    if (canvas) {
      canvas.toBlob(async (blob) => {
        if (blob) {
          const item = new ClipboardItem(new Map([['image/png', blob]]))
          await navigator.clipboard.write([item])
          alert('QR code copied to clipboard!')
        }
      })
    }
  } catch (err) {
    console.error('Failed to copy:', err)
    alert('Failed to copy to clipboard. Try downloading instead.')
  }
}

onMounted(() => {
  renderQRCode()
})
</script>

<template>
  <div class="w-full max-w-7xl mx-auto px-6 py-12">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Configuration Panel -->
      <div class="space-y-8">
        <div>
          <h2 class="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
            Configure QR Code
          </h2>
        </div>

        <!-- Data Input -->
        <div class="space-y-3">
          <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            URL or Text
          </label>
          <input
            v-model="qrData"
            type="text"
            placeholder="https://example.com"
            class="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <!-- Size Settings -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-3">
            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Width (px)
            </label>
            <input
              v-model.number="qrWidth"
              type="number"
              min="100"
              max="1000"
              class="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
            />
          </div>
          <div class="space-y-3">
            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Height (px)
            </label>
            <input
              v-model.number="qrHeight"
              type="number"
              min="100"
              max="1000"
              class="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
            />
          </div>
        </div>

        <!-- Margin -->
        <div class="space-y-3">
          <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Margin (px)
          </label>
          <input
            v-model.number="margin"
            type="range"
            min="0"
            max="50"
            class="w-full"
          />
          <div class="text-sm text-neutral-500">{{ margin }}px</div>
        </div>

        <!-- Dot Style -->
        <div class="space-y-3">
          <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Dot Style
          </label>
          <select
            v-model="dotStyle"
            class="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
          >
            <option v-for="option in dotStyleOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- Colors -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-3">
            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Dot Color
            </label>
            <div class="flex items-center gap-3">
              <input
                v-model="dotColor"
                type="color"
                class="w-12 h-12 rounded-lg border border-neutral-300 dark:border-neutral-700 cursor-pointer"
              />
              <span class="text-sm text-neutral-500 font-mono">{{ dotColor }}</span>
            </div>
          </div>
          <div class="space-y-3">
            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Background
            </label>
            <div class="flex items-center gap-3">
              <input
                v-model="backgroundColor"
                type="color"
                class="w-12 h-12 rounded-lg border border-neutral-300 dark:border-neutral-700 cursor-pointer"
              />
              <span class="text-sm text-neutral-500 font-mono">{{ backgroundColor }}</span>
            </div>
          </div>
        </div>

        <!-- Error Correction -->
        <div class="space-y-3">
          <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Error Correction Level
          </label>
          <select
            v-model="errorCorrectionLevel"
            class="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
          >
            <option v-for="option in errorCorrectionOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <p class="text-xs text-neutral-500">
            Higher levels allow QR codes to be read even if partially damaged or covered by a logo.
          </p>
        </div>

        <!-- Logo/Image -->
        <div class="space-y-3">
          <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Logo Image URL (optional)
          </label>
          <input
            v-model="imageUrl"
            type="text"
            placeholder="https://example.com/logo.png"
            class="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
          />
        </div>

        <!-- Image Size -->
        <div v-if="imageUrl" class="space-y-3">
          <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Logo Size (ratio)
          </label>
          <input
            v-model.number="imageSize"
            type="range"
            min="0.1"
            max="0.5"
            step="0.05"
            class="w-full"
          />
          <div class="text-sm text-neutral-500">{{ Math.round(imageSize * 100) }}%</div>
        </div>
      </div>

      <!-- Preview Panel -->
      <div class="space-y-6">
        <div class="sticky top-6">
          <h2 class="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
            Preview
          </h2>

          <!-- QR Code Display -->
          <div class="bg-white dark:bg-neutral-800 rounded-xl p-8 shadow-lg border border-neutral-200 dark:border-neutral-700">
            <div ref="canvasRef" class="flex justify-center items-center min-h-[300px]"></div>
          </div>

          <!-- Download Options -->
          <div class="mt-6 space-y-4">
            <h3 class="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Download
            </h3>
            <div class="flex flex-wrap gap-3">
              <button
                @click="downloadQRCode('png')"
                class="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors text-sm font-medium"
              >
                Download PNG
              </button>
              <button
                @click="downloadQRCode('svg')"
                class="px-4 py-2 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-sm font-medium"
              >
                Download SVG
              </button>
              <button
                @click="downloadQRCode('jpeg')"
                class="px-4 py-2 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-sm font-medium"
              >
                Download JPEG
              </button>
              <button
                @click="copyToClipboard"
                class="px-4 py-2 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-sm font-medium"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
