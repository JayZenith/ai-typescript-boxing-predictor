"use client";
import React, { useEffect, useState } from "react";

// --- API Fighter shape ---
interface ApiFighter {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  debut?: string;
  nationality?: string;
  nickname?: string | null;
  height?: string; // "5' 9\" / 175 cm"
  reach?: string;  // "71.7\" / 182 cm"
  stance?: string;
  division?: {
    name: string;
    slug: string;
    weight_lb: number;
    weight_kg: number;
    id: string;
  };
  stats?: {
    wins: number;
    losses: number;
    draws: number;
    total_bouts: number;
    ko_wins: number;
    stopped: number;
    ko_percentage: number;
  };
}

// --- Normalized Fighter type for prediction ---
interface Fighter {
  id: string;
  name: string;
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

// --- API constants ---
const API_URL =
  "https://boxing-data-api.p.rapidapi.com/v1/fighters/?page_num=1&page_size=25";
const API_OPTIONS: RequestInit = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "31523627edmshf0ea513c5ce4c39p12d122jsn971a2398dc6d",
    "x-rapidapi-host": "boxing-data-api.p.rapidapi.com",
  },
};

// --- Mapper from API fighter → normalized Fighter ---
function mapApiFighter(api: ApiFighter): Fighter {
  // Extract reach in inches from "71.7\" / 182 cm"
  const reachMatch = api.reach?.match(/([\d.]+)/);
  const reach = reachMatch ? parseFloat(reachMatch[1]) : 0;

  return {
    id: api.id,
    name: api.name,
    age: api.age ?? 0,
    weight: api.division?.weight_lb ?? 0,
    reach,
    wins: api.stats?.wins ?? 0,
    losses: api.stats?.losses ?? 0,
    knockouts: api.stats?.ko_wins ?? 0,
    experience: api.stats?.total_bouts ?? 0,
  };
}

const FightPredictor: React.FC = () => {
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [fighterA, setFighterA] = useState<Fighter | null>(null);
  const [fighterB, setFighterB] = useState<Fighter | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);

  // --- Fetch fighters from API ---
  useEffect(() => {
    const fetchFighters = async () => {
      try {
        // Call your API route instead of the external API
      const res = await fetch("/api/fighters");
      if (!res.ok) throw new Error(`API request failed: ${res.status}`);


        const json = await res.json();
        console.log("API raw response:", json);

        const apiFighters: ApiFighter[] = Array.isArray(json.data)
          ? json.data
          : Array.isArray(json)
          ? json
          : [];

        const normalized = apiFighters.map(mapApiFighter);

        setFighters(normalized);
        if (normalized.length >= 2) {
          setFighterA(normalized[0]);
          setFighterB(normalized[1]);
        }
      } catch (err) {
        console.error("Error fetching fighters:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFighters();
  }, []);

  // --- Normalize stats for model input ---
  const normalize = (f: Fighter): number[] => [
    f.age / 50,               // age roughly 0–1
    f.weight / 250,           // weight in pounds
    f.reach / 80,             // reach in inches
    f.wins / f.experience,    // win ratio 0–1
    f.losses / f.experience,  // loss ratio 0–1
    f.knockouts / f.experience, // KO ratio 0–1
    f.experience / 100        // scale experience to 0–1
  ];
  

  // --- Get prediction from backend ---
  const getPrediction = async () => {
    if (!fighterA || !fighterB) return;

    const features = [...normalize(fighterA), ...normalize(fighterB)];
    console.log("Features sent to backend:", features);


    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features }),
      });

      if (!res.ok) throw new Error(`Prediction request failed: ${res.status}`);
      const data: Prediction = await res.json();
      setPrediction(data);
      console.log("Raw prediction:", prediction);

    } catch (err) {
      console.error("Error fetching prediction:", err);
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl mb-4">Boxing Fight Predictor</h1>

      {loading && <p>Loading fighters...</p>}

      {fighters.length > 0 && (
        <div className="mb-4 flex gap-4">
          {/* Fighter A */}
          <select
            value={fighterA?.id || ""}
            onChange={(e) =>
              setFighterA(fighters.find((f) => f.id === e.target.value) || null)
            }
            className="px-2 py-1 bg-gray-700 rounded"
          >
            {fighters.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>

          {/* Fighter B */}
          <select
            value={fighterB?.id || ""}
            onChange={(e) =>
              setFighterB(fighters.find((f) => f.id === e.target.value) || null)
            }
            className="px-2 py-1 bg-gray-700 rounded"
          >
            {fighters.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        onClick={getPrediction}
        className="px-4 py-2 bg-blue-600 rounded"
        disabled={!fighterA || !fighterB}
      >
        Predict
      </button>

      {prediction && fighterA && fighterB && (
        <div className="mt-4">
          <p>Fighter A: {prediction.fighterA.toFixed(1)}%</p>
          <p>Fighter B: {prediction.fighterB.toFixed(1)}%</p>


        </div>
      )}
    </div>
  );
};

export default FightPredictor;
