export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initializeServices } = await import("./lib/services/init");
    await initializeServices();
    const { initializeStore } = await import("./lib/db/store");
    await initializeStore();
  }
}
