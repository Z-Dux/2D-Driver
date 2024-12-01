// pages/index.js

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const HomePage = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const [bodies, setBodies] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    color: "#000000",
    radius: 20,
    mass: 1,
    velocityX: 0,
    velocityY: 0,
  });

  useEffect(() => {
    const { Engine, Render, World } = Matter;
    const engine = Engine.create();
    engine.gravity.y = 1; // Gravity towards down
    engineRef.current = engine;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
        background: "#000000",
      },
    });

    Render.run(render);
    Engine.run(engine);

    return () => {
      Render.stop(render);
      Engine.clear(engine);
    };
  }, []);

  const addBody = (e) => {
    e.preventDefault();
    const { World, Bodies } = Matter;
    const { name, color, radius, mass, velocityX, velocityY } = formData;
    const engine = engineRef.current;

    const body = Bodies.circle(400, 200, radius, {
      label: name,
      render: { fillStyle: color },
      mass: mass,
    });

    Matter.Body.setVelocity(body, { x: velocityX, y: velocityY });

    World.add(engine.world, body);
    setBodies([...bodies, body]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#000000", color: "#ffffff" }}>
      <div ref={sceneRef} style={{ width: "70%", backgroundColor: "#000000" }} />
      <div style={{ width: "30%", padding: "20px", background: "#333333", borderLeft: "1px solid #444444" }}>
        <form onSubmit={addBody}>
          <Label htmlFor="name" style={{ color: "#ffffff" }}>Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <Label htmlFor="color" style={{ color: "#ffffff" }}>Color</Label>
          <Input
            type="color"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            required
          />
          <Label htmlFor="radius" style={{ color: "#ffffff" }}>Radius</Label>
          <Input
            type="number"
            id="radius"
            name="radius"
            value={formData.radius}
            onChange={handleChange}
            placeholder="Radius"
            required
          />
          <Label htmlFor="mass" style={{ color: "#ffffff" }}>Mass</Label>
          <Input
            type="number"
            id="mass"
            name="mass"
            value={formData.mass}
            onChange={handleChange}
            placeholder="Mass"
            required
          />
          <Label htmlFor="velocityX" style={{ color: "#ffffff" }}>Velocity X</Label>
          <Input
            type="number"
            id="velocityX"
            name="velocityX"
            value={formData.velocityX}
            onChange={handleChange}
            placeholder="Velocity X"
            required
          />
          <Label htmlFor="velocityY" style={{ color: "#ffffff" }}>Velocity Y</Label>
          <Input
            type="number"
            id="velocityY"
            name="velocityY"
            value={formData.velocityY}
            onChange={handleChange}
            placeholder="Velocity Y"
            required
          />
          <Button type="submit" style={{ backgroundColor: "#555555", color: "#ffffff" }}>Add Body</Button>
        </form>
      </div>
    </div>
  );
};

export default HomePage;
