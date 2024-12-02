// components/PhysicsSimulator.tsx
import React, { useEffect, useRef, useState } from "react";
import { Engine, Render, Runner, World, Bodies, Body, Mouse, MouseConstraint, Events } from "matter-js";

interface BodyConfig {
  color: string;
  mass: number;
  radius: number;
  velocityX: number;
  velocityY: number;
}

const PhysicsSimulator = ({ newBody }: { newBody?: BodyConfig | null }) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [engine] = useState(Engine.create());
  const [world] = useState(engine.world);

  useEffect(() => {
    const render = Render.create({
      element: sceneRef.current!,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
        background: "#1e293b",
      },
    });

    // Create boundaries
    const boundaries = [
      Bodies.rectangle(400, 0, 800, 50, { isStatic: true }), // Top
      Bodies.rectangle(400, 600, 800, 50, { isStatic: true }), // Bottom
      Bodies.rectangle(0, 300, 50, 600, { isStatic: true }), // Left
      Bodies.rectangle(800, 300, 50, 600, { isStatic: true }), // Right
    ];
    boundaries.forEach((boundary) => {
      boundary.render.fillStyle = "#4b5563";
    });

    World.add(world, boundaries);

    // Add Mouse Dragging
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });
    World.add(world, mouseConstraint);

    Render.run(render);

    const runner = Runner.create();
    Runner.run(runner, engine);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      World.clear(world, false);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, [engine, world]);

  useEffect(() => {
    if (newBody) {
      const { color, mass, radius, velocityX, velocityY } = newBody;
      const body = Bodies.circle(400, 200, radius, {
        render: { fillStyle: color },
        mass: mass,
      });
      Body.setVelocity(body, { x: velocityX, y: velocityY });
      World.add(world, body);
    }
  }, [newBody, world]);

  return <div ref={sceneRef}></div>;
};

export default PhysicsSimulator;
