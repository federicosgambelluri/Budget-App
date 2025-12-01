import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANTE: Se hosti su https://<USERNAME>.github.io/<REPO>, 
  // devi impostare base: '/<REPO>/'
<<<<<<< HEAD
  // base: '/budget-app/', 
=======
  base: '/Budget-App/',
>>>>>>> 7705a91 (Initial commit)
})
