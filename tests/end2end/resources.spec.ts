import {expect, test} from "@playwright/test";

const baseURL = "http://localhost:3000"

test.describe('Resources library tests', () => {
    test.beforeEach(async ({page}) => await page.goto(baseURL +'/resource'))

    test('should redirect to resource detail page', async ({page}) => {
        const resourceRef = await page.locator('#link-resource-details').first();
        const resourceLink = await resourceRef.getAttribute('href');
        await resourceRef.click();

        await expect(page).toHaveURL(baseURL + resourceLink);
    });

    test('should display resources with searching term and correctly redirect', async ({page}) => {
        const resourceRef = await page.locator('#link-resource-details').first();
        const resourceName = await resourceRef.evaluate(el => el.querySelector('h3').textContent);
        const resourceLink = await resourceRef.getAttribute('href');

        await page.fill('#search', resourceName);

        await expect(page.locator('#grid-resources').evaluate(el => el.childElementCount)).not.toBe(0);

        await resourceRef.click();

        await expect(page).toHaveURL(baseURL + resourceLink);
    });

});