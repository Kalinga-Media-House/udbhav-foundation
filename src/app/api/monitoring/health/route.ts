import { NextResponse } from 'next/server';

import { systemMonitoringService } from '@/features/system/monitoring';

export async function GET() {
  const health = await systemMonitoringService.getHealth();
  return NextResponse.json(health);
}
