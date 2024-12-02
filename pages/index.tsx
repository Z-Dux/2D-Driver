// pages/index.tsx
import { useState } from "react";
import PhysicsSimulator from "@/components/physics";
import BodyForm from "@/components/body";

const Home = () => {
  const [newBody, setNewBody] = useState(null);

  const handleAddBody = (body:any) => {
    setNewBody(body);
  };

  return (
    <main className="flex flex-row gap-8 p-8 bg-gray-900 text-white min-h-screen">
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">2D Physics Simulator</h1>
        <PhysicsSimulator newBody={newBody} />
      </div>
      <div className="w-1/3 bg-gray-800 p-4 rounded shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Create a New Body</h2>
        <BodyForm onAddBody={handleAddBody} />
      </div>
    </main>
  );
};

export default Home;
