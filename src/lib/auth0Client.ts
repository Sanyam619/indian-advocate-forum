import { createAuth0Client, Auth0Client } from "@auth0/auth0-spa-js";

let client: Auth0Client | null = null;

export async function getAuth0Client(): Promise<Auth0Client> {
  if (client) return client;

  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN!;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!;
  
  // Dynamically determine the current origin
  const redirectUri = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_BASE_URL;
  
  console.log("Auth0 Client Configuration:", {
    domain,
    clientId,
    redirectUri
  });

  client = await createAuth0Client({
    domain,
    clientId,
    authorizationParams: {
      redirect_uri: redirectUri,
      // Add audience if needed for API access
      // audience: "https://your-api-identifier",
    },
    cacheLocation: "localstorage",  // persist sessions
    useRefreshTokens: true,
  });

  return client;
}