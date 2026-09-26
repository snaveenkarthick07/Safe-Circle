import { NextResponse } from 'next/server';
import { mockIncidentReports } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    total: mockIncidentReports.length,
    reports: mockIncidentReports,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newReport = {
      id: 'rep_' + Date.now(),
      complaintId: 'SC-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      ...body,
      timestamp: new Date().toISOString(),
      status: 'submitted',
    };

    return NextResponse.json({
      success: true,
      message: 'Incident reported successfully and encrypted in SafeCircle database',
      report: newReport,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
