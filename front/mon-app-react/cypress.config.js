import { defineConfig } from 'cypress'
import { execSync } from 'child_process'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: false,
    specPattern: 'cypress/e2e/**/*.cy.js',
    setupNodeEvents(on) {
      on('task', {
        seedCypress() {
          const result = execSync(
            'docker exec babi_back php artisan db:seed --class=CypressSeeder'
          ).toString()
          const match = result.match(/SERVICE_ID=(\d+)/)
          return match ? parseInt(match[1]) : null
        },
      })
    },
  },
})
