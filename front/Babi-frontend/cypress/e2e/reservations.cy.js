const API = 'http://localhost:8000'

describe('Réservations', () => {
  const email = `client_${Date.now()}@babi.com`
  const motDePasse = 'password123'
  let clientToken

  before(() => {
    cy.task('seedCypress').then((idService) => {
      cy.request('POST', `${API}/api/register`, {
        prenom: 'Client',
        nom: 'Cypress',
        email,
        telephone: '0601020304',
        mot_de_passe: motDePasse,
        mot_de_passe_confirmation: motDePasse,
      })

      cy.request('POST', `${API}/api/login`, {
        email,
        mot_de_passe: motDePasse,
      }).then((res) => {
        clientToken = res.body.token

        cy.request({
          method: 'POST',
          url: `${API}/api/reservations`,
          headers: { Authorization: `Bearer ${clientToken}` },
          body: {
            id_service: idService,
            date_reservation: '2027-01-15',
            heure_reservation: '10:00',
            message: 'Test Cypress',
          },
        })
      })
    })
  })

  it('redirige vers /connexion si on accède sans token', () => {
    cy.clearLocalStorage()
    cy.visit('/reservations')
    cy.url().should('include', '/connexion')
  })

  it('affiche les réservations du client connecté', () => {
    cy.window().then((win) => win.localStorage.setItem('token', clientToken))
    cy.visit('/reservations')

    cy.contains('Service Cypress').should('be.visible')
    cy.contains('2 500').should('be.visible')
  })

  it('affiche le statut de la réservation', () => {
    cy.window().then((win) => win.localStorage.setItem('token', clientToken))
    cy.visit('/reservations')

    cy.contains('Service Cypress')
      .parents('div')
      .first()
      .within(() => {
        cy.get('span, p').should('exist')
      })
  })

  it('peut annuler une réservation', () => {
    cy.window().then((win) => win.localStorage.setItem('token', clientToken))
    cy.visit('/reservations')

    cy.contains('Annuler').should('be.visible').click()
    cy.contains('Annuler').should('not.exist')
  })
})