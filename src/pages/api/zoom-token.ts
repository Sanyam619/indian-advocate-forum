import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

type Data =
  | { access_token: string }
  | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const response = await axios.post(
      "https://zoom.us/oauth/token",
      null,
      {
        params: {
          grant_type: "account_credentials",
          account_id: process.env.ZOOM_ACCOUNT_ID,
        },
        auth: {
          username: process.env.ZOOM_CLIENT_ID || "",
          password: process.env.ZOOM_CLIENT_SECRET || "",
        },
      }
    );

    res.status(200).json({ access_token: response.data.access_token });
  } catch (error: any) {
    console.error("Zoom Token Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch Zoom token" });
  }
}