import { expect, test } from '@playwright/test'

test('Sync state across tabs and windows', async ({ context }) => {
  const page1 = await context.newPage()
  const page2 = await context.newPage()
  await page1.goto('/')
  await page2.goto('/replica2')

  await page1.fill('input', 'Hello')
  await page2.waitForSelector('input[value="Hello"]')
  const iframe = page1.frame({ url: /replica1/ })!
  expect(await iframe.$eval('input', (e) => e.value)).toBe('Hello')

  expect(await page2.$eval('input', (e) => e.value)).toBe('Hello')
  await page2.fill('input', 'World')
  await page1.waitForSelector('input[value="World"]')
  expect(await iframe.$eval('input', (e) => e.value)).toBe('World')
})
