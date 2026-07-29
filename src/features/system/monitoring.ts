export const systemMonitoringService = {
  async getHealth() {
    return {
      status: 'healthy',
      database: 'connected',
      version: '1.0'
    };
  }
};
