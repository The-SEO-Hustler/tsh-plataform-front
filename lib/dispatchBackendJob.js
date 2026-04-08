export async function dispatchBackendJob(url, { headers, body, timeoutMs = 8000 }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
      signal: controller.signal,
    });

    let payload = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    return {
      accepted: response.ok,
      status: response.status,
      payload,
    };
  } catch (error) {
    return {
      accepted: false,
      status: null,
      payload: null,
      error: error?.name === "AbortError" ? "timeout" : error?.message || "dispatch_failed",
    };
  } finally {
    clearTimeout(timeout);
  }
}
