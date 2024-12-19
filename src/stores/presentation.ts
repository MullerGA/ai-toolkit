import { defineStore } from 'pinia'

interface PresentationState {
  currentSection: number
  isFocusMode: boolean
  totalSections: number
  sections: string[]
}

export const usePresentationStore = defineStore('presentation', {
  state: (): PresentationState => ({
    currentSection: 0,
    isFocusMode: false,
    totalSections: 4,
    sections: [
      'llm-definition',
      'llm-evolution',
      'llm-applications',
      'llm-concepts'
    ]
  }),

  actions: {
    toggleFocusMode() {
      this.isFocusMode = !this.isFocusMode
      if (this.isFocusMode) {
        this.scrollToCurrentSection()
      }
    },

    exitFocusMode() {
      this.isFocusMode = false
      this.currentSection = 0
    },

    nextSection() {
      if (!this.isFocusMode) return
      if (this.currentSection < this.totalSections - 1) {
        this.currentSection++
        this.scrollToCurrentSection()
      }
    },

    previousSection() {
      if (!this.isFocusMode) return
      if (this.currentSection > 0) {
        this.currentSection--
        this.scrollToCurrentSection()
      }
    },

    scrollToCurrentSection() {
      const sectionId = this.sections[this.currentSection]
      const sectionElement = document.getElementById(sectionId)
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }
})