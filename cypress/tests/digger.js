context('Digger', () => {
  beforeEach(() => {
    cy.visit('#')
  })

  it('should successfully dig a playlist', () => {
    cy.get('#landing [data-test=form-link] [data-test=form-input]').type('https://www.youtube.com/playlist?list=PLcyIgDOXdSITaK7lgF_Cc_k2RqV3OlLeF')
    cy.get('#landing [data-test=form-link] [data-test=form-submit]').click()
    cy.get('#body [data-test=track-library]')
      .first()
      .should('contain', 'Midival Punditz - Raanjhan')
      .should('contain', 'inMindbodysoul')
  })

  it('should abort an ongoing dig', () => {
    cy.get('#landing [data-test=form-link] [data-test=form-input]').type('https://www.youtube.com/playlist?list=PL4lEESSgxM_5O81EvKCmBIm_JT5Q7JeaI')
    cy.get('#landing [data-test=form-link] [data-test=form-submit]').click()
    cy.wait(5000)
    cy.get('#landing [data-test=form-link] [data-test=form-submit]').click()
    cy.get('#landing [data-test=form-link] [data-test=form-input]').should('have.value', '')
    cy.get('#body').should('not.exist')
  })

  it('should display an error on wrong playlist', () => {
    cy.get('#landing [data-test=form-link] [data-test=form-input]').type('https://www.youtube.com/playlist?list=ABCDEFGHIJKLMNOPQRS')
    cy.get('#landing [data-test=form-link] [data-test=form-submit]').click()
    cy.get('#landing [data-test=stepper-error]').should('contain', 'YouTube playlist ABCDEFGHIJKLMNOPQRS is unavailable')
  })

  it('should display empty illustration on empty playlist', () => {
    cy.get('#landing [data-test=form-link] [data-test=form-input]').type('https://www.youtube.com/playlist?list=PLOPWbKuLde88sE8lN261aSssV_lnYiqa2')
    cy.get('#landing [data-test=form-link] [data-test=form-submit]').click()
    cy.get('#body [data-test=track-library]').should('have.length', 0)
    cy.get('#body [data-test=illustration]').should('contain', 'Oops, no videos was found')
  })
})
