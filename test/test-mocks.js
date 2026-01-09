/**
 * Mock DOM elements for Node.js testing
 * This is a minimal mock to enable testing without a full DOM implementation
 */

// Check if we're in Node.js without a DOM
const needsMock = typeof HTMLElement === 'undefined'

let MockHTMLElement, MockDocumentFragment

if (needsMock) {
  // Simple mock for HTMLElement
  MockHTMLElement = class {
    constructor() {
      this.innerHTML = ''
      this.children = []
      this.childNodes = []
      this.attributes = {}
    }

    getAttribute(name) {
      return this.attributes[name]
    }

    setAttribute(name, value) {
      this.attributes[name] = value
    }

    hasAttribute(name) {
      return name in this.attributes
    }

    removeAttribute(name) {
      delete this.attributes[name]
    }

    appendChild(child) {
      this.children.push(child)
      this.childNodes.push(child)
      return child
    }

    remove() {
      // Mock remove
    }

    querySelectorAll() {
      return []
    }

    replaceWith() {
      // Mock replaceWith
    }

    dispatchEvent() {
      // Mock dispatchEvent
      return true
    }
  }

  // Simple mock for DocumentFragment
  MockDocumentFragment = class {
    constructor() {
      this.children = []
      this.childNodes = []
      this.textContent = ''
    }

    appendChild(child) {
      this.children.push(child)
      this.childNodes.push(child)
      if (child.textContent) {
        this.textContent += child.textContent
      }
      return child
    }

    append(...children) {
      children.forEach(child => this.appendChild(child))
    }
  }

  // Mock document.createDocumentFragment
  global.document = {
    createDocumentFragment() {
      return new MockDocumentFragment()
    },
    createElement(tagName) {
      const element = new MockHTMLElement()
      element.tagName = tagName.toUpperCase()
      element.name = ''
      return element
    }
  }

  // Export mock HTMLElement globally
  global.HTMLElement = MockHTMLElement
}

export { MockHTMLElement, MockDocumentFragment }
