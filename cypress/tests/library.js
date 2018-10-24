context('Library', () => {
  beforeEach(() => {
    cy.visit('#')
  })

  it('should save a record', () => {
    cy.get('#landing [data-test=form-link] [data-test=form-input]').type('https://www.youtube.com/playlist?list=PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF')
    cy.get('#landing [data-test=form-link] [data-test=form-submit]').click()
    cy.get('#landing [data-test=curtain-tale] [data-test=curtain-item]')
      .should('have.length', 1)
      .each(($item, index) => {
        cy.wrap($item).should('contain', 'INDIA')
        cy.wrap($item).should('contain', 'Vincent Anthony')
      })
  })

  it('should dig from a record', () => {
    window.localStorage.setItem('library', '{"youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF":{"uri":"youtube#playlist#PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF","service":"youtube","kind":"playlist","id":"PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF","title":"INDIA","author":"Vincent Anthony","link":"https://www.youtube.com/playlist?list=PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF","channel":"https://www.youtube.com/channel/UC4T79MEKtNfa-PKpgwF0y9g","description":"","total":8,"thumbnail":"https://i.ytimg.com/vi/a4F1Dm9Fat8/hqdefault.jpg","synced":8,"tracks":["youtube#track#_IS208pkFxs","youtube#track#a4F1Dm9Fat8","youtube#track#Qjp4uxGH9jI","youtube#track#sZUp9rXAK50","youtube#track#x9BUOcEUCAk","youtube#track#428Orzv3grA","youtube#track#M7gDEwUb4_Q","youtube#track#qhWlptdnLBs"],"latest":1540238836267}}')

    cy.get('#landing [data-test=curtain-tale] [data-test=curtain-toggle]').click()
    cy.get('#landing [data-test=curtain-tale] [data-test=curtain-item]').first().click()
    cy.get('#landing [data-test=form-link] [data-test=form-input]').should('have.value', 'https://youtube.com/playlist?list=PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF')
  })
})
