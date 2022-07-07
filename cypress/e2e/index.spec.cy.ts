describe('Homepage tests', () => {
    const base_url = Cypress.env('base_url');

    beforeEach(() => {
        cy.viewport('macbook-16')
        cy.visit(base_url)
    })

    it('should redirect to resources index', () => {
        cy.get('#btn-resource-redirect').click();
        cy.url().should('eq', base_url + '/resource');
    })

    it('should redirect to connexion page', () => {
        cy.get('#btn-login-redirect').click();
        cy.url().should('eq', base_url + '/auth/login');
    })

    it('should redirect to resources index with searching term', () => {
        const searchedValue = "test";
        cy.get('#search').type(searchedValue + '{enter}');
        cy.url().should('eq', base_url + '/resource?q=' + searchedValue);
    })

    it('should redirect to resources library page', () => {
        cy.get('#link-resources-library').click();
        cy.url().should('eq', base_url + '/resource');
    })

    it('should redirect to resource detail page', () => {
        cy.visit(base_url + '/resource');
        cy.get('#link-resource-details').first().invoke('attr', 'href').then((href) => {
            cy.get('#link-resource-details').first().click();
            cy.url().should('eq', base_url + href);
        });
    })
})