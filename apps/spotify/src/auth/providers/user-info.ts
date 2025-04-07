export async function getSpotifyUserInfo(token: string) {
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch user info: ${response.statusText}`);
  }
  
  return response.json();
}