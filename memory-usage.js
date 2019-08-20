function memoryUsage() {
  const usage = {
    heapUsed: process.memoryUsage().heapUsed / 1024 / 1024,
    heapTotal: process.memoryUsage().heapTotal / 1024 / 1024,
    external: process.memoryUsage().external / 1024 / 1024,
  };

  return {
    heapUsed: `${Math.round(usage.heapUsed * 100) / 100} MB`,
    heapTotal: `${Math.round(usage.heapTotal * 100) / 100} MB`,
    external: `${Math.round(usage.external * 100) / 100} MB`,
  }
}

module.exports = memoryUsage;
