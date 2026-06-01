import { useState } from "react";
import { ActionCenter } from "./components/ActionCenter";

const STUDENTS = [
    { id: "stu_001", name: "Maya Patel" },
    { id: "stu_002", name: "Jordan Lee" },
    { id: "stu_003", name: "Carlos Rivera" },
];

export default function App() {
    const [selected, setSelected] = useState("stu_001");

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-lg font-semibold text-gray-900">Counselor Action Center</h1>
                    <p className="text-sm text-gray-500">Counselor · csl_001</p>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-6 py-6">
                <div className="flex gap-2 mb-6 flex-wrap">
                    {STUDENTS.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setSelected(s.id)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                selected === s.id
                                    ? "bg-indigo-600 text-white"
                                    : "bg-white border border-gray-200 text-gray-700 hover:border-indigo-300 hover:text-indigo-600"
                            }`}
                        >
                            {s.name}
                        </button>
                    ))}
                </div>

                <ActionCenter key={selected} studentId={selected} />
            </main>
        </div>
    );
}
