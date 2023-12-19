import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './pages/App'

import './main.css'
import './tailwind.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { Composed } from './providers/composed'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Composed>
      <App />
    </Composed>
  </React.StrictMode>
)
