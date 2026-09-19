// Races a promise against a timeout so a stalled network request (not
// just a thrown/rejected one) can never leave calling UI stuck forever
// waiting on something that will never settle.
export function withTimeout(promise, ms = 15000, message = "That took too long. Please check your connection and try again.") {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms)),
  ]);
}
