"use client";
import React, { useState } from "react";

interface Fighter {
  age: number;
  weight: number;
  reach: number;
  wins: number;
  losses: number;
  knockouts: number;
  experience: number;
}

interface Prediction {
  fighterA: number;
  fighterB: number;
}

const POPULAR_BOXERS: { [key: string]: Fighter } = {
  "Canelo Style Fighter": { age: 34, weight: 168, reach: 70, wins: 60, losses: 2, knockouts: 39, experience: 18 },
  "Crawford Style Fighter": { age: 36, weight: 147, reach: 74, wins: 40, losses: 0, knockouts: 31, experience: 15 },
};


const FightPredictor: React.FC = () => { 
  const [fighterA, setFighterA] = useState<Fighter>(POPULAR_BOXERS["Canelo Style Fighter"]);
  const [fighterB, setFighterB] = useState<Fighter>(POPULAR_BOXERS["Crawford Style Fighter"]);
  const [prediction, setPrediction] = useState<Prediction | null>(null);

  // Normalize stats to match backend
  // Scale raw inputs to consistent range 
  // without, model gives too much importance to large-scale numbers 
  const normalize = (f: Fighter): number[] => [
    f.age / 50, f.weight / 200, f.reach / 80,
    f.wins / 50, f.losses / 20, f.knockouts / 30, f.experience / 20
  ];


  const getPrediction = async () => {
    const features = [...normalize(fighterA), ...normalize(fighterB)];
    // console.log(features)

    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features }),
      });

      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      setPrediction(data);
    } catch (err) {
      console.error("Error fetching prediction:", err);
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl mb-4">Boxing Fight Predictor</h1>
      <button
        onClick={getPrediction}
        className="px-4 py-2 bg-blue-600 rounded"
      >
        Predict
      </button>

      {prediction && (
        <div className="mt-4">
          <p>Fighter A: {(prediction.fighterA * 100).toFixed(1)}%</p>
          <p>Fighter B: {(prediction.fighterB * 100).toFixed(1)}%</p>
      </div>
      )}
    </div>
  );
};

export default FightPredictor;
