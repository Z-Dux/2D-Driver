import { useState } from "react"
import PhysicsSimulator from "@/components/physics"
import BodyForm from "@/components/body"

const Home = () => {
  const [newBody, setNewBody] = useState(null)

  const handleAddBody = (body: any) => {
    setNewBody(body)
  }

  return (
    <main className="flex flex-col lg:flex-row gap-8 p-8 bg-neutral-950 text-neutral-200 min-h-screen">
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-6 text-neutral-100">2D Physics Simulator</h1>
        <div className="bg-neutral-900 rounded-lg shadow-xl overflow-hidden">
          <PhysicsSimulator newBody={newBody} />
        </div>
      </div>
      <div className="lg:w-1/3">
        <div className="bg-neutral-900 p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl font-semibold mb-6 text-neutral-100">Create a New Body</h2>
          <BodyForm onAddBody={handleAddBody} />
        </div>
      </div>
    </main>
  )
}

export default Home
