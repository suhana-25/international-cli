'use client'

import { CheckCircle2, Circle, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'place-order' | 'payment-processing'

interface StepConfig {
  key: CheckoutStep
  label: string
  shortLabel: string
}

const steps: StepConfig[] = [
  { key: 'cart', label: 'Shopping Cart', shortLabel: 'Cart' },
  { key: 'shipping', label: 'Shipping Address', shortLabel: 'Shipping' },
  { key: 'payment', label: 'Payment Method', shortLabel: 'Payment' },
  { key: 'place-order', label: 'Review & Place Order', shortLabel: 'Review' },
  { key: 'payment-processing', label: 'Payment Processing', shortLabel: 'Processing' }
]

interface CheckoutProgressBarProps {
  currentStep: CheckoutStep
  completedSteps: CheckoutStep[]
  className?: string
  variant?: 'default' | 'compact'
}

export default function CheckoutProgressBar({
  currentStep,
  completedSteps,
  className,
  variant = 'default'
}: CheckoutProgressBarProps) {
  const currentStepIndex = steps.findIndex(step => step.key === currentStep)

  const isStepCompleted = (stepKey: CheckoutStep) => completedSteps.includes(stepKey)
  const isStepCurrent = (stepKey: CheckoutStep) => stepKey === currentStep
  const isStepAccessible = (stepIndex: number) => stepIndex <= currentStepIndex

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <span className="text-sm font-medium text-gray-600">
          Step {currentStepIndex + 1} of {steps.length}:
        </span>
        <span className="text-sm font-semibold text-gray-900">
          {steps[currentStepIndex]?.label}
        </span>
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = isStepCompleted(step.key)
          const isCurrent = isStepCurrent(step.key)
          const isAccessible = isStepAccessible(index)

          return (
            <div key={step.key} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                    {
                      'bg-green-500 border-green-500 text-white': isCompleted,
                      'bg-blue-500 border-blue-500 text-white': isCurrent && !isCompleted,
                      'bg-white border-gray-300 text-gray-400': !isAccessible && !isCompleted && !isCurrent,
                      'bg-gray-100 border-gray-300 text-gray-500': isAccessible && !isCompleted && !isCurrent,
                    }
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
                
                {/* Step Label */}
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      'text-xs font-medium transition-colors duration-300',
                      {
                        'text-green-600': isCompleted,
                        'text-blue-600': isCurrent && !isCompleted,
                        'text-gray-400': !isAccessible && !isCompleted && !isCurrent,
                        'text-gray-600': isAccessible && !isCompleted && !isCurrent,
                      }
                    )}
                  >
                    {step.shortLabel}
                  </p>
                  <p
                    className={cn(
                      'text-xs mt-1 hidden sm:block transition-colors duration-300',
                      {
                        'text-green-500': isCompleted,
                        'text-blue-500': isCurrent && !isCompleted,
                        'text-gray-400': !isAccessible && !isCompleted && !isCurrent,
                        'text-gray-500': isAccessible && !isCompleted && !isCurrent,
                      }
                    )}
                  >
                    {step.label}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div
                    className={cn(
                      'h-0.5 transition-colors duration-300',
                      {
                        'bg-green-500': isCompleted,
                        'bg-gray-300': !isCompleted,
                      }
                    )}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile Progress Bar */}
      <div className="mt-4 sm:hidden">
        <div className="bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-in-out"
            style={{
              width: `${((currentStepIndex + 1) / steps.length) * 100}%`
            }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">Start</span>
          <span className="text-xs text-gray-500">Complete</span>
        </div>
      </div>
    </div>
  )
}
