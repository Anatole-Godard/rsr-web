import {expect, test} from "@playwright/test";

test.describe('Navigation tests', () => {
    test.beforeEach(async ({page}) => await page.goto('http://localhost:3000'))

    test('should redirect to connexion page', async ({page}) => {
        await page.locator('#button-dropdown').click();

        await page.locator('#link-redirect-login').click();

        await expect(page).toHaveURL('http://localhost:3000/auth/login');
    });
})