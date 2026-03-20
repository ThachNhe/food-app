import { useState } from 'react'
import { X, Navigation, Bike, PersonStanding, ChevronRight, ArrowLeft, RotateCcw } from 'lucide-react'
import type { RestaurantPin } from '@/data/fakeMapData'
import { getDirections } from '@/data/fakeMapData'

interface DirectionPanelProps {
  from: RestaurantPin | null
  to: RestaurantPin | null
  onClose: () => void
}

export function DirectionPanel({ from, to, onClose }: DirectionPanelProps) {
  const [mode, setMode] = useState<'walk' | 'bike'>('bike')
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const [simulating, setSimulating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  if (!from || !to) return null

  const directions = getDirections(from.id, to.id)
  const time = mode === 'walk' ? directions.walkMinutes : directions.bikeMinutes
  const timeLabel = mode === 'walk' ? 'phút đi bộ' : 'phút xe máy'

  const ICON_MAP = {
    straight: '⬆️',
    left: '⬅️',
    right: '➡️',
    arrive: '📍',
  }

  const startSimulation = () => {
    setSimulating(true)
    setCurrentStep(0)
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= directions.steps.length - 1) {
          clearInterval(interval)
          setSimulating(false)
          return prev
        }
        return prev + 1
      })
    }, 1200)
  }

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border gradient-primary text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            <h2 className="font-heading font-bold">Chỉ đường</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* From → To */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">A</div>
            <span className="truncate text-orange-100">Vị trí của bạn</span>
          </div>
          <div className="ml-2.5 w-0.5 h-3 bg-white/40" />
          <div className="flex items-center gap-2 text-sm">
            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-primary text-xs font-bold">B</div>
            <span className="truncate font-semibold">{to.name}</span>
          </div>
        </div>
      </div>

      {/* Travel Mode */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setMode('bike')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
            mode === 'bike' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Bike className="h-4 w-4" />
          Xe máy
        </button>
        <button
          onClick={() => setMode('walk')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
            mode === 'walk' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <PersonStanding className="h-4 w-4" />
          Đi bộ
        </button>
      </div>

      {/* Distance & Time */}
      <div className="flex items-center justify-around p-4 bg-muted/30 border-b border-border">
        <div className="text-center">
          <p className="text-2xl font-heading font-extrabold text-foreground">{directions.distanceKm} km</p>
          <p className="text-xs text-muted-foreground mt-0.5">khoảng cách</p>
        </div>
        <div className="w-px h-10 bg-border" />
        <div className="text-center">
          <p className="text-2xl font-heading font-extrabold text-primary">{time}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{timeLabel}</p>
        </div>
        <div className="w-px h-10 bg-border" />
        <div className="text-center">
          <p className="text-2xl font-heading font-extrabold text-foreground">
            {'₫'.repeat(to.priceRange)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">giá cả</p>
        </div>
      </div>

      {/* Simulate button */}
      <div className="px-4 py-3 border-b border-border">
        <button
          onClick={simulating ? undefined : startSimulation}
          disabled={simulating}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
            simulating
              ? 'bg-primary/20 text-primary cursor-default'
              : 'gradient-primary text-white hover:opacity-90 active:scale-95'
          }`}
        >
          {simulating ? (
            <>
              <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              Đang mô phỏng đường đi...
            </>
          ) : (
            <>
              <Navigation className="h-4 w-4" />
              Bắt đầu dẫn đường
            </>
          )}
        </button>
      </div>

      {/* Steps */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">
          Các bước đi
        </p>
        {directions.steps.map((step, i) => (
          <div
            key={i}
            onClick={() => setActiveStep(activeStep === i ? null : i)}
            className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
              simulating && currentStep === i
                ? 'border-primary bg-primary/10 shadow-sm'
                : activeStep === i
                ? 'border-border bg-accent'
                : 'border-transparent hover:border-border hover:bg-muted/50'
            }`}
          >
            {/* Step number or icon */}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 font-bold ${
                step.icon === 'arrive'
                  ? 'bg-primary text-white'
                  : simulating && currentStep === i
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step.icon === 'arrive' ? '✓' : i + 1}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground font-medium">
                {ICON_MAP[step.icon]} {step.instruction}
              </p>
              {step.distance && (
                <p className="text-xs text-muted-foreground mt-0.5">{step.distance}</p>
              )}
            </div>

            {step.icon !== 'arrive' && <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />}
          </div>
        ))}
      </div>

      {/* Bottom action */}
      <div className="p-3 border-t border-border">
        <button
          onClick={onClose}
          className="w-full py-2 rounded-xl border border-border text-sm text-muted-foreground hover:bg-accent transition-colors flex items-center justify-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách
        </button>
      </div>
    </div>
  )
}
