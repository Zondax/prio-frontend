import { expect, test } from '@playwright/test'

/**
 * Simplified ChatInput Visual Tests
 *
 * Captures baseline screenshots for key ChatInput variants
 * before we start the CVA + CSS migration.
 */

test.describe('ChatInput Visual Baseline', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Navigate to Chat > ChatInput
    const chatNavButton = page.locator('[data-nodetype="group"]').filter({ hasText: 'Chat' }).first()
    await chatNavButton.click()

    const chatInputButton = page.getByRole('button', { name: 'ChatInput', exact: true })
    await chatInputButton.click()
  })

  test('Default story baseline', async ({ page }) => {
    // Navigate to Default story
    const defaultStory = page.locator('[data-item-id="chat-chatinput--default"]')
    await defaultStory.click()

    // Wait for story iframe to load
    const iframe = page.frameLocator('iframe[id="storybook-preview-iframe"]')
    await iframe.locator('#storybook-root').waitFor()

    // Capture component screenshot
    await expect(iframe.locator('#storybook-root')).toHaveScreenshot('chat-input-default.png')
  })

  test('With Voice story baseline', async ({ page }) => {
    const voiceStory = page.locator('[data-item-id="chat-chatinput--with-voice"]')
    await voiceStory.click()

    const iframe = page.frameLocator('iframe[id="storybook-preview-iframe"]')
    await iframe.locator('#storybook-root').waitFor()

    await expect(iframe.locator('#storybook-root')).toHaveScreenshot('chat-input-with-voice.png')
  })

  test('Compact Input story baseline', async ({ page }) => {
    const compactStory = page.locator('[data-item-id="chat-chatinput--compact-input"]')
    await compactStory.click()

    const iframe = page.frameLocator('iframe[id="storybook-preview-iframe"]')
    await iframe.locator('#storybook-root').waitFor()

    await expect(iframe.locator('#storybook-root')).toHaveScreenshot('chat-input-compact.png')
  })

  test('With Commands story baseline', async ({ page }) => {
    const commandsStory = page.locator('[data-item-id="chat-chatinput--with-commands"]')
    await commandsStory.click()

    const iframe = page.frameLocator('iframe[id="storybook-preview-iframe"]')
    await iframe.locator('#storybook-root').waitFor()

    await expect(iframe.locator('#storybook-root')).toHaveScreenshot('chat-input-with-commands.png')
  })

  test('Loading state baseline', async ({ page }) => {
    const loadingStory = page.locator('[data-item-id="chat-chatinput--loading"]')
    await loadingStory.click()

    const iframe = page.frameLocator('iframe[id="storybook-preview-iframe"]')
    await iframe.locator('#storybook-root').waitFor()

    await expect(iframe.locator('#storybook-root')).toHaveScreenshot('chat-input-loading.png')
  })

  test('Focus state interactions', async ({ page }) => {
    const defaultStory = page.locator('[data-item-id="chat-chatinput--default"]')
    await defaultStory.click()

    const iframe = page.frameLocator('iframe[id="storybook-preview-iframe"]')
    await iframe.locator('#storybook-root').waitFor()

    // Capture default unfocused state
    await expect(iframe.locator('#storybook-root')).toHaveScreenshot('chat-input-unfocused.png')

    // Focus the first textarea and capture focused state
    const textarea = iframe.locator('textarea').first()
    await textarea.focus()

    await expect(iframe.locator('#storybook-root')).toHaveScreenshot('chat-input-focused.png')

    // Add content and capture
    await textarea.fill('Testing the input with some sample text content')

    await expect(iframe.locator('#storybook-root')).toHaveScreenshot('chat-input-with-content.png')
  })
})
