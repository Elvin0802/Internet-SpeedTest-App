const API_URL = "https://lvn-internet-speed-test.runasp.net";

export async function measurePing() {
  const start = performance.now();
  await fetch(`${API_URL}/api/speedtest/pingtest`);
  return performance.now() - start;
}

export async function measureJitter(samples = 10) {
  const pings = [];
  for (let i = 0; i < samples; i++) pings.push(await measurePing());
  const avg = pings.reduce((a, b) => a + b) / samples;
  const variance = pings.reduce((s, v) => s + (v - avg) ** 2, 0) / samples;
  return Math.sqrt(variance);
}

export async function measureDownloadLiveWithRealtime(duration = 10, onUpdate) {
  const res = await fetch(
    `${API_URL}/api/speedtest/downloadtest?durationSeconds=${duration}`
  );
  const reader = res.body.getReader();
  let totalBytes = 0;
  const start = Date.now();
  let last = start;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.size || value.length;
    const now = Date.now();
    if (now - last >= 1000) {
      const secs = (now - start) / 1000;
      const mbps = (totalBytes * 8) / (secs * 1024 * 1024);
      onUpdate(Number(mbps.toFixed(2)), Number(secs.toFixed(1)));
      last = now;
    }
  }
}

export async function measureUploadLiveWithRealtime(duration = 10, onUpdate) {
  const res = await fetch(
    `${API_URL}/api/speedtest/uploadtest?durationSeconds=${duration}`
  );
  const reader = res.body.getReader();
  let totalBytes = 0;
  const start = Date.now();
  let last = start;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.size || value.length;
    const now = Date.now();
    if (now - last >= 1000) {
      const secs = (now - start) / 1000;
      const mbps = (totalBytes * 8) / (secs * 1024 * 1024);
      onUpdate(Number(mbps.toFixed(2)), Number(secs.toFixed(1)));
      last = now;
    }
  }
}
