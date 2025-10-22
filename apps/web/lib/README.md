# API Client Documentation

This directory contains the API client setup for communicating with the backend using Better Auth authentication.

## Files

- `api-client.ts` - Main axios instance with Better Auth session cookie support
- `api-examples.ts` - Example usage patterns and helper functions
- `auth-client.ts` - Better Auth client configuration

## Setup

1. **Environment Variables**: Set up your environment variables:

   ```bash
   # In your .env.local file
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

2. **Backend CORS Configuration**: Ensure your backend is configured to accept credentials:
   ```typescript
   // In your backend main.ts
   app.enableCors({
     origin: "http://localhost:3001",
     methods: ["GET", "POST", "PUT", "DELETE"],
     allowedHeaders: ["Content-Type", "Authorization"],
     credentials: true, // This is important for cookies
   });
   ```

## Usage

### Basic Usage

```typescript
import { api } from "../lib/api-client";

// GET request
const response = await api.get("/matches");

// POST request
const newMatch = await api.post("/matches", {
  homeTeam: "Flamengo",
  awayTeam: "Vasco",
});
```

### With Error Handling

```typescript
import { api, handleApiError } from "../lib/api-client";

try {
  const response = await api.get("/matches");
  console.log(response.data);
} catch (error) {
  const apiError = handleApiError(error);
  console.error("API Error:", apiError.message);
}
```

### In React Components

```typescript
import { useState, useEffect } from 'react';
import { fetchMatches } from '../lib/api-examples';

export function MatchesList() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const data = await fetchMatches();
        setMatches(data);
      } catch (error) {
        console.error('Failed to load matches:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {matches.map(match => (
        <div key={match.id}>
          {match.homeTeam} vs {match.awayTeam}
        </div>
      ))}
    </div>
  );
}
```

## Key Features

1. **Automatic Cookie Handling**: The `withCredentials: true` setting ensures that Better Auth session cookies are automatically included in requests.

2. **Error Handling**: Built-in interceptors handle common HTTP errors (401, 403) and provide user-friendly error messages.

3. **TypeScript Support**: Full TypeScript support with proper typing for requests and responses.

4. **Authentication Integration**: Seamlessly works with Better Auth's session management.

## Authentication Flow

1. User logs in through Better Auth (Google OAuth)
2. Better Auth sets session cookies
3. API client automatically includes these cookies in requests
4. Backend validates the session using Better Auth
5. Protected endpoints return data or 401/403 errors

## Backend Requirements

Your backend should be configured to:

1. Accept credentials in CORS settings
2. Use Better Auth for session validation
3. Return appropriate HTTP status codes for authentication errors

## Troubleshooting

- **401 Unauthorized**: Check if the user is logged in and session is valid
- **CORS Errors**: Ensure backend CORS is configured with `credentials: true`
- **Network Errors**: Check if the backend is running and accessible
