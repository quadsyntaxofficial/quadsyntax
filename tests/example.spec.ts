import { test, expect } from '@playwright/test';

test.describe('QuadSyntax marketing site', () => {
  test('home page loads with the main marketing sections', async ({ page }) => {
    await page.goto('/');

    const header = page.getByRole('banner');
    const mainHomeSection = page.locator('#home').first();
    const mainAboutSection = page.locator('#about').first();
    const servicesSection = page.locator('#services').first();
    const teamSection = page.locator('#team').first();
    const contactSection = page.locator('#contact').first();

    await expect(page).toHaveTitle(/QuadSyntax/i);
    await expect(mainHomeSection).toHaveCount(1);
    await expect(mainAboutSection).toHaveCount(1);
    await expect(servicesSection).toHaveCount(1);
    await expect(teamSection).toHaveCount(1);
    await expect(contactSection).toHaveCount(1);
    await expect(header).toContainText('Home');
  });

  test('header navigation is available and the contact CTA is visible', async ({ page }) => {
    await page.goto('/');

    const viewportWidth = page.viewportSize()?.width ?? 0;
    if (viewportWidth < 768) {
      await page.getByRole('button', { name: /open menu|close menu/i }).click();
    }

    const headerNav = page.getByRole('banner').getByRole('navigation');
    await expect(headerNav.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(headerNav.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(headerNav.getByRole('link', { name: 'Services' })).toBeVisible();
    await expect(headerNav.getByRole('link', { name: 'Team' })).toBeVisible();

    await expect(page.getByText('Need a digital boost?')).toBeVisible();
    await expect(page.getByRole('link', { name: /Mail Us|Contact Us/i })).toHaveCount(2);
  });

  test('mobile layout still renders the core content and menu toggle', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const menuButton = page.getByRole('button', { name: /open menu|close menu/i });
    await expect(menuButton).toBeVisible();
    await expect(page.locator('#home').first()).toHaveCount(1);
    await expect(page.locator('#about').first()).toHaveCount(1);
    await expect(page.locator('#services').first()).toHaveCount(1);

    await menuButton.click();
    await expect(page.getByRole('link', { name: 'Home' }).first()).toBeVisible();
  });
});
