import {expect, test} from "@playwright/test";

const baseURL = "http://localhost:3000/"

test.describe('Homepage tests', () => {
    test.beforeEach(async ({page}) => await page.goto(baseURL))

    test('should redirect to resources index', async ({page}) => {
        await page.locator('#btn-resource-redirect').click();

        await expect(page).toHaveURL(baseURL + 'resource');
    })

    test('should redirect to connexion page', async ({page}) => {
        await page.locator('#btn-login-redirect').click();

        await expect(page).toHaveURL(baseURL + 'auth/login');
    });

    test('should redirect to resources index with searching term', async ({page}) => {
        const searchedValue = "test"
        await page.fill('#search', searchedValue);
        await page.keyboard.press("Enter");

        await expect(page).toHaveURL(baseURL + 'resource?q=' + searchedValue)
    })
})