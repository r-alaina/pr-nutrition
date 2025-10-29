'use client'

import { useEffect } from 'react'
import { logout } from '@/app/(frontend)/(auth)/actions/logout'

export default function AdminLoginSignup() {
  useEffect(() => {
    // Function to inject signup link and add class for styling
    const injectSignupLink = () => {
      // Check if we're on the login page
      const isLoginPage =
        window.location.pathname === '/admin/login' ||
        window.location.pathname.includes('/admin/login')

      // Add class to body/html for CSS targeting
      if (isLoginPage) {
        document.body.classList.add('payload-login-page')
        document.documentElement.classList.add('payload-login-page')
      } else {
        document.body.classList.remove('payload-login-page')
        document.documentElement.classList.remove('payload-login-page')
      }

      if (!isLoginPage) return

      // Find the form
      const form = document.querySelector('body form, form[action*="login"], [class*="login"] form')
      if (!form) return

      // Check if signup link already exists
      const existingLink = form.parentElement?.querySelector('[data-admin-signup-link]')
      if (existingLink) return

      // Find the login button to insert after it
      const loginButton = form.querySelector('button[type="submit"], button')
      const formContainer =
        form.closest('div, section, [class*="card"], [class*="container"]') || form.parentElement

      if (!formContainer) return

      // Create signup link container
      const signupContainer = document.createElement('div')
      signupContainer.setAttribute('data-admin-signup-link', 'true')

      // Create the text and link
      const textNode = document.createTextNode("Don't have an admin account? ")
      const link = document.createElement('a')
      link.href = '/admin-signup'
      link.textContent = 'Sign up'

      signupContainer.appendChild(textNode)
      signupContainer.appendChild(link)

      // Insert after the form or login button
      if (loginButton) {
        loginButton.parentElement?.insertBefore(signupContainer, loginButton.nextSibling)
      } else {
        formContainer.appendChild(signupContainer)
      }
    }

    // Function to handle logout buttons on unauthorized page
    const handleUnauthorizedLogout = () => {
      const isUnauthorizedPage =
        window.location.pathname === '/admin/unauthorized' ||
        window.location.pathname.includes('/admin/unauthorized')

      if (!isUnauthorizedPage) return

      // Find all buttons and links that might be logout buttons
      const buttons = document.querySelectorAll(
        'button:not([data-logout-handled]), a[href*="logout"]:not([data-logout-handled]), a[href*="login"]:not([data-logout-handled])',
      )
      buttons.forEach((button) => {
        // Skip if already handled
        if (button.getAttribute('data-logout-handled')) return

        const text = button.textContent?.toLowerCase() || ''
        const href = button.getAttribute('href') || ''

        // Check if it's a logout button
        if (text.includes('logout') || text.includes('log out') || href.includes('logout')) {
          // Mark as handled
          button.setAttribute('data-logout-handled', 'true')

          // Override click handler
          button.addEventListener(
            'click',
            async (e) => {
              e.preventDefault()
              e.stopPropagation()

              try {
                await logout()
                window.location.href = '/'
              } catch (error) {
                console.error('Logout error:', error)
                window.location.href = '/'
              }
            },
            { capture: true },
          )
        }
      })
    }

    // Try immediately and also after a delay
    injectSignupLink()
    handleUnauthorizedLogout()
    const timer = setTimeout(() => {
      injectSignupLink()
      handleUnauthorizedLogout()
    }, 500)

    // Also listen for DOM changes in case Payload renders async
    const observer = new MutationObserver(() => {
      injectSignupLink()
      handleUnauthorizedLogout()
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  return null
}
