// Backend URL configuration for frontend

let detectedBackendUrl: string | null = null;

async function checkPort(port: number): Promise<boolean> {
  try {
    const res = await fetch(`http://localhost:${port}/api/health`, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}

export async function getBackendUrl(): Promise<string> {
  if (detectedBackendUrl) return detectedBackendUrl;

  // Production backend URL - this should be the correct one
  const productionBackendUrl = 'https://testlatest-backend.jollystone-b8869f95.eastus.azurecontainerapps.io';

  // If we're in a browser environment, try development ports first, then fallback to production
  if (typeof window !== 'undefined') {
    // Try development ports for local development
    if (await checkPort(8080)) {
      detectedBackendUrl = 'http://localhost:8080';
      return detectedBackendUrl;
    }
    if (await checkPort(5000)) {
      detectedBackendUrl = 'http://localhost:5000';
      return detectedBackendUrl;
    }
  }
  
  // Fallback to production URL (works for both server-side and client-side)
  detectedBackendUrl = productionBackendUrl;
  return detectedBackendUrl;
} 