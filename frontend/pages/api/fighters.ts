// pages/api/fighters.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const API_URL = "https://boxing-data-api.p.rapidapi.com/v1/fighters/?page_num=1&page_size=25";

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
        "x-rapidapi-host": "boxing-data-api.p.rapidapi.com",
      },
    });

    const data = await response.json();
    res.status(200).json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch fighters" });
  }
}
