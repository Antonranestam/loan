import * as React from 'react'
import { MortgageCalculator } from './components/MortgageCalculator'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        <MortgageCalculator />
      </div>
    </div>
  )
}

export default App 