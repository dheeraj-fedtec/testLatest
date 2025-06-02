// Dynamic backend URL detection for dev: tries 8080, then 5000, then env, then 8080 as fallback

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

  // Try 8080
  if (await checkPort(8080)) {
    detectedBackendUrl = 'http://localhost:8080';
    return detectedBackendUrl;
  }
  // Try 5000
  if (await checkPort(5000)) {
    detectedBackendUrl = 'http://localhost:5000';
    return detectedBackendUrl;
  }
  // Try env
  if (import.meta.env.VITE_BACKEND_URL) {
    detectedBackendUrl = import.meta.env.VITE_BACKEND_URL;
    return detectedBackendUrl;
  }
  // Fallback
  detectedBackendUrl = 'http://localhost:8080';
  return detectedBackendUrl;
} 