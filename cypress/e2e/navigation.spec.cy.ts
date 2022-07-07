describe('Navigation tests', () => {
    const base_url = Cypress.env('base_url');

    beforeEach(() => {
        cy.viewport('macbook-16')
        cy.visit(base_url)
    })

    it('should redirect to connection page from Navbar', () => {
        cy.get('#button-dropdown').click();
        cy.get('#link-redirect-login').click();
        cy.url().should('eq', base_url + '/auth/login');
    });

    it('should redirect to register page', () => {
        cy.get('#button-dropdown').click();
        cy.get('#link-redirect-register').click();
        cy.url().should('eq', base_url + '/auth/register');
    })

    it('should redirect to home page', () => {
        cy.get('#link-home').click();
        cy.url().should('eq', base_url + '/');
    });

    it('should redirect to connection page from Sidebar', () => {
        cy.get('#link-login').click();
        cy.url().should('eq', base_url + '/auth/login');
    })

    it('should redirect to register page from Sidebar', () => {
        cy.get('#link-register').click();
        cy.url().should('eq', base_url + '/auth/register');
    })

    it('should redirect to resources library page', () => {
        cy.get('#link-resource-library').click();
        cy.url().should('eq', base_url + '/resource');
    })
})