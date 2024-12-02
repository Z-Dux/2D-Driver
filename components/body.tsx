'use client'

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface BodyFormProps {
  onAddBody: (body: {
    color: string
    mass: number
    radius: number
    velocityX: number
    velocityY: number
  }) => void
}

export default function BodyForm({ onAddBody }: BodyFormProps) {
  const [color, setColor] = useState("#5716a7")
  const [mass, setMass] = useState(1)
  const [radius, setRadius] = useState(30)
  const [velocityX, setVelocityX] = useState(0)
  const [velocityY, setVelocityY] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddBody({ color, mass, radius, velocityX, velocityY })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-neutral-800 p-6 rounded-lg shadow-lg">
      <div className="space-y-2">
        <Label htmlFor="color" className="text-neutral-300">
          Color
        </Label>
        <div className="flex items-center space-x-2">
          <Input
            type="color"
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-12 h-12 p-1 bg-neutral-800 border-neutral-700"
          />
          <Input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="flex-grow bg-neutral-800 text-neutral-300 border-neutral-700"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="mass" className="text-neutral-300">
          Mass: {mass}
        </Label>
        <Slider
          id="mass"
          min={0.1}
          max={10}
          step={0.1}
          value={[mass]}
          onValueChange={(value) => setMass(value[0])}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="radius" className="text-neutral-300">
          Radius: {radius}
        </Label>
        <Slider
          id="radius"
          min={10}
          max={100}
          value={[radius]}
          onValueChange={(value) => setRadius(value[0])}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="velocityX" className="text-neutral-300">
          Velocity X: {velocityX}
        </Label>
        <Slider
          id="velocityX"
          min={-10}
          max={10}
          value={[velocityX]}
          onValueChange={(value) => setVelocityX(value[0])}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="velocityY" className="text-neutral-300">
          Velocity Y: {velocityY}
        </Label>
        <Slider
          id="velocityY"
          min={-10}
          max={10}
          value={[velocityY]}
          onValueChange={(value) => setVelocityY(value[0])}
          className="w-full"
        />
      </div>
      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
        Add Body
      </Button>
    </form>
  )
}