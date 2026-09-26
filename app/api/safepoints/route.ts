import { NextResponse } from 'next/server';
import { mockSafePoints } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    count: mockSafePoints.length,
    safePoints: mockSafePoints,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newSafePoint = {
      id: 'sp_' + Date.now(),
      ...body,
      verified: false,
      rating: 5.0,
    };

    return NextResponse.json({
      success: true,
      message: 'Safe Point application received. Scheduled for authority verification.',
      safePoint: newSafePoint,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
