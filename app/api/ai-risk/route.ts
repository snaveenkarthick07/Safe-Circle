import { NextResponse } from 'next/server';
import { mockAIRiskTrends, mockHotspotZones, mockRouteOptions } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    riskTrends: mockAIRiskTrends,
    hotspotZones: mockHotspotZones,
    sampleRoutes: mockRouteOptions,
    aiModel: 'SafeCircle-RiskEngine-v2.4-SpatialVector',
  });
}
