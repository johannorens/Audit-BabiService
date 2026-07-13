describe('Authentification', () => {
  const email = `test_${Date.now()}@babi.com`
  const motDePasse = 'password123'

  it('un utilisateur s\'inscrit puis se connecte', () => {
    // Étape 1 : inscription
    cy.visit('/inscription')
    cy.get('input[name="prenom"]').type('Axel')
    cy.get('input[name="nom"]').type('Test')
    cy.get('input[name="email"]').type(email)
    cy.get('input[name="telephone"]').type('0601020304')
    cy.get('input[name="mot_de_passe"]').type(motDePasse)
    cy.get('input[name="mot_de_passe_confirmation"]').type(motDePasse)
    cy.get('button[type="submit"]').click()

    cy.url().should('include', '/connexion')

    // Étape 2 : connexion
    cy.get('input[type="email"]').type(email)
    cy.get('input[type="password"]').type(motDePasse)
    cy.get('button[type="submit"]').click()

    cy.url().should('include', '/dashboard')
  })

  it('affiche une erreur avec de mauvais identifiants', () => {
    cy.visit('/connexion')
    cy.get('input[type="email"]').type('inconnu@babi.com')
    cy.get('input[type="password"]').type('mauvais')
    cy.get('button[type="submit"]').click()

    cy.url().should('include', '/connexion')
  })

  it('redirige vers /connexion si on accède au dashboard sans token', () => {
    cy.clearLocalStorage()
    cy.visit('/dashboard')
    cy.url().should('include', '/connexion')
  })
})
