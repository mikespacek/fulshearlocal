interface SubscribeResponse {
  success: boolean;
  message: string;
}

const SENDER_API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiOWY2NDc5NGVhNGQwZTVjMGJhNjIzZDM1ZmRlY2M4NDJiODBlM2E3NmRmNjlhYWE4ZDNlM2Y4YWMzM2Y0M2Y3MzdiYzlkNmRhYzJlODQwYmIiLCJpYXQiOiIxNzQ2NDc2MDI4LjIxMjI0OSIsIm5iZiI6IjE3NDY0NzYwMjguMjEyMjUyIiwiZXhwIjoiNDkwMDA3NjAyOC4yMTA0MjkiLCJzdWIiOiI5NzU5NjUiLCJzY29wZXMiOltdfQ.wrBn08INvLhHtuKnb0tP8Rhrkbz6Bygu_vBqdpSQyNsm-Cj3QZM92D3lSkDmgf7S2611a4U0XYRyTIesmopDHg';

export async function subscribeToNewsletter(email: string): Promise<SubscribeResponse> {
  try {
    const response = await fetch('https://api.sender.net/v2/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDER_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        trigger_automation: true // This will trigger any welcome emails you set up
      })
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Successfully subscribed to newsletter!'
      };
    } else {
      const data = await response.json();
      return {
        success: false,
        message: data.message || 'Failed to subscribe. Please try again.'
      };
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return {
      success: false,
      message: 'An error occurred. Please try again later.'
    };
  }
} 