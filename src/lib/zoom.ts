import axios from 'axios';

interface CreateMeetingOptions {
  topic: string;
  duration: number; // in minutes
  startTime: Date;
}

export async function createZoomMeeting({ topic, duration, startTime }: CreateMeetingOptions) {
  try {
    const response = await axios.post(
      'https://api.zoom.us/v2/users/me/meetings',
      {
        topic,
        type: 2, // Scheduled meeting
        start_time: startTime.toISOString(),
        duration,
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          waiting_room: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.ZOOM_JWT_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      id: response.data.id,
      joinUrl: response.data.join_url,
      password: response.data.password,
    };
  } catch (error) {
    console.error('Error creating Zoom meeting:', error);
    throw new Error('Failed to create Zoom meeting');
  }
}