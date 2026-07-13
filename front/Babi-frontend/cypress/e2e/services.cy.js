const API = 'http://localhost:8000'

describe('Services', () => {
  let token

  before(() => {
    cy.task('seedCypress')
    cy.request('POST', `${API}/api/login`, {
      email: 'admin_cypress@babi.com',
      mot_de_passe: 'password',
    }).then((res) => {
      token = res.body.token
    })
  })

  beforeEach(() => {
    cy.window().then((win) => win.localStorage.setItem('token', token))
  })

  it('affiche les services sur la page /services', () => {
    cy.visit('/services')
    cy.contains('Service Cypress').should('be.visible')
    cy.contains('2 500').should('be.visible')
  })

  it('accède à la fiche détail en cliquant sur "Voir le profil"', () => {
    cy.visit('/services')
    cy.contains('Service Cypress')
      .parents('div')
      .find('a')
      .contains('Voir le profil')
      .click()

    cy.url().should('match', /\/services\/\d+/)
    cy.contains('Service Cypress').should('be.visible')
  })

  it('le bouton Réserver mène au formulaire de réservation', () => {
    cy.visit('/services')
    cy.contains('Service Cypress')
      .parents('div')
      .find('a')
      .contains('Réserver')
      .click()

    cy.url().should('match', /\/services\/\d+\/reserver/)
  })

  it('la fiche détail affiche le tarif et le bouton Réserver', () => {
    cy.visit('/services')
    cy.contains('Voir le profil').first().click()

    cy.url().should('match', /\/services\/\d+/)
    cy.contains('2 500').should('be.visible')
    cy.contains('Réserver').should('be.visible')
  })
})