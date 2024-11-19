import * as React from 'react'
import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface MortgageResult {
  currentMonthlyPayment: number
  newMonthlyPayment: number
  monthlySavings: number
  yearlySavings: number
}

// Format number with thousand separators
const formatNumber = (num: number | string): string => {
  return Number(num).toLocaleString('sv-SE')
}

// Parse formatted number back to string without separators
const parseFormattedNumber = (str: string): string => {
  return str.replace(/[^\d.-]/g, '')
}

export function MortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState('')
  const [currentRate, setCurrentRate] = useState('')
  const [newRate, setNewRate] = useState('')
  const [monthlyAmortization, setMonthlyAmortization] = useState('')
  const [result, setResult] = useState<MortgageResult | null>(null)
  const [isFormValid, setIsFormValid] = useState(false)

  // Validate form
  useEffect(() => {
    const isValid = 
      loanAmount !== '' && 
      currentRate !== '' && 
      newRate !== '' && 
      monthlyAmortization !== '' &&
      Number(loanAmount) > 0 &&
      Number(currentRate) >= 0 &&
      Number(newRate) >= 0 &&
      Number(monthlyAmortization) > 0
    setIsFormValid(isValid)
  }, [loanAmount, currentRate, newRate, monthlyAmortization])

  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = parseFormattedNumber(e.target.value)
    setLoanAmount(rawValue)
  }

  const handleMonthlyAmortizationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = parseFormattedNumber(e.target.value)
    setMonthlyAmortization(rawValue)
  }

  const calculateMortgage = () => {
    const loan = parseFloat(loanAmount)
    const currentInterest = parseFloat(currentRate) / 100
    const newInterest = parseFloat(newRate) / 100
    const monthlyAmortizationAmount = parseFloat(monthlyAmortization)
    
    const currentMonthlyInterest = (loan * currentInterest) / 12
    const newMonthlyInterest = (loan * newInterest) / 12
    
    const currentMonthlyPayment = monthlyAmortizationAmount + currentMonthlyInterest
    const newMonthlyPayment = monthlyAmortizationAmount + newMonthlyInterest
    
    setResult({
      currentMonthlyPayment,
      newMonthlyPayment,
      monthlySavings: currentMonthlyPayment - newMonthlyPayment,
      yearlySavings: (currentMonthlyPayment - newMonthlyPayment) * 12
    })
  }

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-md p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center">Bolånekalkylator</h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="loanAmount">Lånebelopp (kr)</Label>
            <Input
              id="loanAmount"
              type="text"
              inputMode="numeric"
              value={loanAmount ? formatNumber(loanAmount) : ''}
              onChange={handleLoanAmountChange}
              placeholder="2 000 000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentRate">Nuvarande ränta (%)</Label>
            <Input
              id="currentRate"
              type="number"
              step="0.01"
              value={currentRate}
              onChange={(e) => setCurrentRate(e.target.value)}
              placeholder="4.5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newRate">Erbjuden ränta (%)</Label>
            <Input
              id="newRate"
              type="number"
              step="0.01"
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
              placeholder="3.8"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyAmortization">Månatlig amortering (kr)</Label>
            <Input
              id="monthlyAmortization"
              type="text"
              inputMode="numeric"
              value={monthlyAmortization ? formatNumber(monthlyAmortization) : ''}
              onChange={handleMonthlyAmortizationChange}
              placeholder="6 000"
            />
          </div>

          <Button 
            className="w-full" 
            onClick={calculateMortgage}
            disabled={!isFormValid}
          >
            Beräkna
          </Button>
        </div>
      </Card>

      {result && (
        <Card className="w-full max-w-md p-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Resultat</h3>
            
            <div className="grid gap-4 text-sm">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="text-muted-foreground">Nuvarande månadskostnad</div>
                <div className="font-semibold">{formatNumber(result.currentMonthlyPayment.toFixed(0))} kr</div>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="text-muted-foreground">Ny månadskostnad</div>
                <div className="font-semibold">{formatNumber(result.newMonthlyPayment.toFixed(0))} kr</div>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="text-muted-foreground">Månadsbesparning</div>
                <div className="font-semibold text-green-600">{formatNumber(result.monthlySavings.toFixed(0))} kr</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">Årsbesparning</div>
                <div className="font-semibold text-green-600">{formatNumber(result.yearlySavings.toFixed(0))} kr</div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
} 
