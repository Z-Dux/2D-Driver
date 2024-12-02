'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { motion } from "framer-motion"

interface Vector {
  x: number
  y: number
}

interface Body {
  id: number
  mass: number
  radius: number
  position: Vector
  velocity: Vector
  color: string
}

const GRAVITY = 0.1
const DAMPING = 0.99
const COLLISION_DAMPING = 0.8

function updatePhysics(bodies: Body[], width: number, height: number): Body[] {
  const updatedBodies = bodies.map(body => {
    body.velocity.y += GRAVITY

    body.velocity.x *= DAMPING
    body.velocity.y *= DAMPING

    body.position.x += body.velocity.x
    body.position.y += body.velocity.y

    if (body.position.x - body.radius < 0 || body.position.x + body.radius > width) {
      body.velocity.x *= -COLLISION_DAMPING
      body.position.x = Math.max(body.radius, Math.min(width - body.radius, body.position.x))
    }
    if (body.position.y - body.radius < 0 || body.position.y + body.radius > height) {
      body.velocity.y *= -COLLISION_DAMPING
      body.position.y = Math.max(body.radius, Math.min(height - body.radius, body.position.y))
    }

    return { ...body }
  })

  for (let i = 0; i < updatedBodies.length; i++) {
    for (let j = i + 1; j < updatedBodies.length; j++) {
      const body1 = updatedBodies[i]
      const body2 = updatedBodies[j]
      const dx = body2.position.x - body1.position.x
      const dy = body2.position.y - body1.position.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < body1.radius + body2.radius) {
        const angle = Math.atan2(dy, dx)
        const sin = Math.sin(angle)
        const cos = Math.cos(angle)

        const vx1 = body1.velocity.x * cos + body1.velocity.y * sin
        const vy1 = body1.velocity.y * cos - body1.velocity.x * sin
        const vx2 = body2.velocity.x * cos + body2.velocity.y * sin
        const vy2 = body2.velocity.y * cos - body2.velocity.x * sin

        const newVx1 = ((body1.mass - body2.mass) * vx1 + 2 * body2.mass * vx2) / (body1.mass + body2.mass)
        const newVx2 = ((body2.mass - body1.mass) * vx2 + 2 * body1.mass * vx1) / (body1.mass + body2.mass)

        body1.velocity.x = newVx1 * cos - vy1 * sin
        body1.velocity.y = vy1 * cos + newVx1 * sin
        body2.velocity.x = newVx2 * cos - vy2 * sin
        body2.velocity.y = vy2 * cos + newVx2 * sin

        const overlap = body1.radius + body2.radius - distance
        const moveX = overlap * cos / 2
        const moveY = overlap * sin / 2

        body1.position.x -= moveX
        body1.position.y -= moveY
        body2.position.x += moveX
        body2.position.y += moveY
      }
    }
  }

  return updatedBodies
}

export default function MotionSimulator() {
  const [bodies, setBodies] = useState<Body[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mass, setMass] = useState(1)
  const [radius, setRadius] = useState(10)
  const [velocityX, setVelocityX] = useState(0)
  const [velocityY, setVelocityY] = useState(0)
  const [color, setColor] = useState('#ffffff')
  
  const [dragState, setDragState] = useState<{
    body: Body | null,
    offsetX: number,
    offsetY: number,
    lastPositions: Vector[]
  }>({ 
    body: null, 
    offsetX: 0, 
    offsetY: 0, 
    lastPositions: [] 
  })

  const animationFrameRef = useRef<number | null>(null)

  const addBody = () => {
    const newBody: Body = {
      id: Date.now(),
      mass,
      radius,
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      velocity: { x: velocityX, y: velocityY },
      color,
    }
    setBodies(prevBodies => [...prevBodies, newBody])
  }

  const getCanvasMousePosition = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    }
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const mousePos = getCanvasMousePosition(event)
    if (!mousePos) return

    const clickedBody = bodies.find(body => 
      Math.sqrt(
        (body.position.x - mousePos.x) ** 2 + 
        (body.position.y - mousePos.y) ** 2
      ) <= body.radius
    )

    if (clickedBody) {
      setDragState({
        body: clickedBody,
        offsetX: mousePos.x - clickedBody.position.x,
        offsetY: mousePos.y - clickedBody.position.y,
        lastPositions: [{ x: mousePos.x, y: mousePos.y }]
      })

      event.preventDefault()
    }
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const mousePos = getCanvasMousePosition(event)
    if (!mousePos || !dragState.body) return

    const newPosition = {
      x: mousePos.x - dragState.offsetX,
      y: mousePos.y - dragState.offsetY
    }

    const updatedLastPositions = [
      ...dragState.lastPositions.slice(-5), 
      { x: mousePos.x, y: mousePos.y }
    ]

    setBodies(prevBodies => 
      prevBodies.map(body => 
        body.id === dragState.body?.id 
          ? { ...body, position: newPosition, velocity: { x: 0, y: 0 } }
          : body
      )
    )

    setDragState(prev => ({
      ...prev,
      lastPositions: updatedLastPositions
    }))

    event.preventDefault()
  }

  const handleMouseUp = () => {
    if (!dragState.body) return

    const positionCount = dragState.lastPositions.length
    if (positionCount > 1) {
      const firstPos = dragState.lastPositions[0]
      const lastPos = dragState.lastPositions[positionCount - 1]
      
      const velocityX = (lastPos.x - firstPos.x) * 0.5 
      const velocityY = (lastPos.y - firstPos.y) * 0.5

      setBodies(prevBodies => 
        prevBodies.map(body => 
          body.id === dragState.body?.id 
            ? { ...body, velocity: { x: velocityX, y: velocityY } }
            : body
        )
      )
    }

    setDragState({ body: null, offsetX: 0, offsetY: 0, lastPositions: [] })
  }

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    setBodies(prevBodies => {
      const updatedBodies = dragState.body 
        ? prevBodies 
        : updatePhysics(prevBodies, canvas.width, canvas.height)

      updatedBodies.forEach((body) => {
        ctx.beginPath()
        ctx.arc(body.position.x, body.position.y, body.radius, 0, Math.PI * 2)
        ctx.fillStyle = body.color
        ctx.fill()
      })

      return updatedBodies
    })

    animationFrameRef.current = requestAnimationFrame(animate)
  }, [dragState.body])

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [animate])

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-800 text-white p-4 gap-4">
      <div className="flex-grow">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle>2D Motion Simulator</CardTitle>
            <CardDescription>Visualize physics in action</CardDescription>
          </CardHeader>
          <CardContent>
            <canvas
              ref={canvasRef}
              width={400}  
              height={300} 
              className="w-full border border-gray-700 bg-gray-800 rounded-lg"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </CardContent>
        </Card>
      </div>
      <motion.div 
        className="w-full md:w-80"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle>Add Body</CardTitle>
            <CardDescription className="text-gray-300">Customize and add new bodies to the simulation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mass">Mass</Label>
              <Input
                id="mass"
                type="number"
                value={mass}
                onChange={(e) => setMass(Number(e.target.value))}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="radius">Radius</Label>
              <Slider
                id="radius"
                min={1}
                max={50}
                step={1}
                value={[radius]}
                onValueChange={(value) => setRadius(value[0])}
                className="bg-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="velocityX">Velocity X</Label>
              <Input
                id="velocityX"
                type="number"
                value={velocityX}
                onChange={(e) => setVelocityX(Number(e.target.value))}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="velocityY">Velocity Y</Label>
              <Input
                id="velocityY"
                type="number"
                value={velocityY}
                onChange={(e) => setVelocityY(Number(e.target.value))}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-12 p-1 bg-gray-800 border-gray-700"
                />
                <Input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-grow bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={addBody} 
              className="w-full bg-gray-700 hover:bg-gray-600 text-white transition-colors duration-200"
            >
              Add Body
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}