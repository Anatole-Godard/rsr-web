import {expect, test} from "@playwright/test";

test.describe('Navigation tests', () => {
    test.beforeEach(async ({page}) => await page.goto('http://localhost:3000'))

    test('should redirect to connection page from Navbar', async ({page}) => {
        await page.locator('#button-dropdown').click();

        await page.locator('#link-redirect-login').click();

        await expect(page).toHaveURL('http://localhost:3000/auth/login');
    });

    test('should redirect to register page', async ({page}) => {
        await page.locator('#button-dropdown').click();

        await page.locator('#link-redirect-register').click();

        await expect(page).toHaveURL('http://localhost:3000/auth/register');
    });

    test('should redirect to home page', async ({page}) => {
        await page.locator('#link-home').click();

        await expect(page).toHaveURL('http://localhost:3000/');
    });

    test('should redirect to connection page from Sidebar', async ({page}) => {
        await page.locator('#link-login').click();

        await expect(page).toHaveURL('http://localhost:3000/auth/login');
    });

    test('should redirect to register page from Sidebar', async ({page}) => {
        await page.locator('#link-register').click();

        await expect(page).toHaveURL('http://localhost:3000/auth/register');
    });

    test('should redirect to resources library page', async ({page}) => {
        await page.locator('#link-resource-library').click();

        await expect(page).toHaveURL('http://localhost:3000/resource');
    });
})