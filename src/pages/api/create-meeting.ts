import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Step 1: Get an access token
    const tokenResponse = await axios.post(
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

    const access_token = tokenResponse.data.access_token;

    // Step 2: Call Zoom API to create a meeting
    const meetingResponse = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        topic: "Test Meeting from Next.js",
        type: 1, // 1 = instant meeting, 2 = scheduled
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    res.status(200).json({
      start_url: meetingResponse.data.start_url, // host link
      join_url: meetingResponse.data.join_url,   // participant link
    });
  } catch (error: any) {
    console.error("Zoom Create Meeting Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to create Zoom meeting" });
  }
}