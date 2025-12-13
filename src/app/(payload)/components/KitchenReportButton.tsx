'use client'

import { useEffect } from 'react'

export default function KitchenReportButton() {
  useEffect(() => {
    // Function to check if we're on the kitchen-orders collection page
    const isKitchenOrdersPage = () => {
      return (
        window.location.pathname.includes('/admin/collections/kitchen-orders') ||
        window.location.pathname === '/admin/collections/kitchen-orders'
      )
    }

    // Function to inject the button
    const injectButton = () => {
      // Check if we're on the right page
      if (!isKitchenOrdersPage()) {
        // Remove button if we're not on the right page
        const existingButton = document.querySelector('[data-kitchen-report-button]')
        if (existingButton) {
          existingButton.remove()
        }
        return
      }

      // Check if button already exists
      const existingButton = document.querySelector('[data-kitchen-report-button]')
      if (existingButton) return

      // Try to find the header area where "Create New" button is
      // Look for common PayloadCMS header selectors
      const headerSelectors = [
        '[class*="header"]',
        '[class*="Header"]',
        'header',
        '[class*="collection-list"]',
        '[class*="list-controls"]',
      ]

      let targetContainer: HTMLElement | null = null

      for (const selector of headerSelectors) {
        const elements = document.querySelectorAll(selector)
        for (const el of Array.from(elements)) {
          const htmlEl = el as HTMLElement
          // Look for an element that contains "Create New" button
          if (htmlEl.textContent?.includes('Create New')) {
            targetContainer = htmlEl
            break
          }
        }
        if (targetContainer) break
      }

      // If we can't find the header, try to find the title area
      if (!targetContainer) {
        const titleElements = document.querySelectorAll('h1, [class*="title"], [class*="Title"]')
        for (const el of Array.from(titleElements)) {
          const htmlEl = el as HTMLElement
          if (htmlEl.textContent?.includes('Kitchen Orders')) {
            targetContainer = htmlEl.parentElement
            break
          }
        }
      }

      // If still no container, try to find any container with buttons
      if (!targetContainer) {
        const buttons = document.querySelectorAll('button')
        for (const btn of Array.from(buttons)) {
          if (btn.textContent?.includes('Create New')) {
            targetContainer = btn.closest('div, section, header') as HTMLElement
            break
          }
        }
      }

      // Create button container
      const buttonContainer = document.createElement('div')
      buttonContainer.setAttribute('data-kitchen-report-button', 'true')
      buttonContainer.style.cssText = `
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 100%;
        margin-bottom: 1rem;
      `

      const button = document.createElement('button')
      button.textContent = 'Download Reports'
      button.style.cssText = `
        padding: 0.75rem 1.5rem;
        background-color: #000000;
        color: white;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        transition: background-color 0.2s;
      `

      button.addEventListener('click', () => {
        window.location.href = '/admin/kitchen-report'
      })

      button.addEventListener('mouseover', () => {
        button.style.backgroundColor = '#333333'
      })

      button.addEventListener('mouseout', () => {
        button.style.backgroundColor = '#000000'
      })

      buttonContainer.appendChild(button)

      // Insert the button
      if (targetContainer) {
        // Try to insert before the "Create New" button or after the title
        const createNewButton = targetContainer.querySelector('button')
        if (createNewButton && createNewButton.textContent?.includes('Create New')) {
          targetContainer.insertBefore(
            buttonContainer,
            createNewButton.parentElement || createNewButton,
          )
        } else {
          targetContainer.appendChild(buttonContainer)
        }
      } else {
        // Fallback: insert at the beginning of the main content
        const mainContent = document.querySelector('main, [class*="main"], [class*="content"]')
        if (mainContent) {
          mainContent.insertBefore(buttonContainer, mainContent.firstChild)
        }
      }
    }

    // Run immediately
    injectButton()

    // Run after multiple delays to catch late-rendered content
    const timers = [
      setTimeout(injectButton, 100),
      setTimeout(injectButton, 500),
      setTimeout(injectButton, 1000),
      setTimeout(injectButton, 2000),
    ]

    // Use MutationObserver to watch for DOM changes
    const observer = new MutationObserver(() => {
      injectButton()
    })

    // Observe the entire document for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
    })

    // Also watch for navigation changes (Payload CMS uses client-side routing)
    let lastPathname = window.location.pathname
    const checkPathname = () => {
      if (window.location.pathname !== lastPathname) {
        lastPathname = window.location.pathname
        // Small delay to let the page render
        setTimeout(injectButton, 100)
      }
    }

    // Check pathname periodically
    const pathnameInterval = setInterval(checkPathname, 500)

    // Cleanup
    return () => {
      timers.forEach((timer) => clearTimeout(timer))
      clearInterval(pathnameInterval)
      observer.disconnect()
      const button = document.querySelector('[data-kitchen-report-button]')
      if (button) {
        button.remove()
      }
    }
  }, [])

  return null
}
