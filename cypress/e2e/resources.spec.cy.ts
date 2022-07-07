describe('Navigation tests', () => {
    const base_url = Cypress.env('base_url');

    beforeEach(() => {
        cy.viewport('macbook-16')
        cy.visit(base_url + '/resource')
    })

    it('should redirect to connection page from Navbar', () => {
        cy.get('#link-resource-details').first().invoke('attr', 'href').then((href) => {
            cy.get('#link-resource-details').first().click();
            cy.url().should('eq', base_url + href);
        });
    })

    it('should display resources with searching term and correctly redirect', () => {
        cy.get('#link-resource-details h3').first().invoke('text').then((text) => {
            cy.get('#search').type(text);
        });
        cy.get('a#link-resource-details').invoke('attr', 'href').then((href) => {
            cy.get('#search').type("{enter}")
            cy.get('#link-resource-details').first().click();
            cy.url().should('eq', base_url + href);
        });
    })

})