describe("Landing", () => {
  beforeEach(() => {
    cy.visit("/")
  })
  it(".should() - assert that <title> is correct", () => {
    cy.title().should("include", "")
  })
})
