'use client'

import { useEffect } from 'react'

export default function KitchenReportButton() {
  useEffect(() => {
    // Check if we're on the kitchen-orders collection page
    const isKitchenOrdersPage =
      window.location.pathname.includes('/admin/collections/kitchen-orders') ||
      window.location.pathname === '/admin/collections/kitchen-orders'

    if (!isKitchenOrdersPage) return

    // Function to inject the button
    const injectButton = () => {
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

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectButton)
    } else {
      // DOM is already ready, but wait a bit for PayloadCMS to render
      setTimeout(injectButton, 500)
    }

    // Also try after a delay in case PayloadCMS loads slowly
    const timeoutId = setTimeout(injectButton, 1000)

    // Cleanup
    return () => {
      clearTimeout(timeoutId)
      const button = document.querySelector('[data-kitchen-report-button]')
      if (button) {
        button.remove()
      }
    }
  }, [])

  return null
}
