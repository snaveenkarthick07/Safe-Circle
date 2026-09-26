import { NextResponse } from 'next/server';
import { mockUsers } from '@/lib/mockData';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    // Quick role login bypass for demo
    if (role && mockUsers[role]) {
      const demoUser = mockUsers[role];
      const token = `sc_jwt_${demoUser.id}_${Date.now()}`;
      return NextResponse.json({
        success: true,
        user: demoUser,
        token,
      });
    }

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email address is required.' }, { status: 400 });
    }

    // Standard login response
    const token = `sc_jwt_${Date.now()}`;
    return NextResponse.json({
      success: true,
      message: 'Authentication successful.',
      token,
      user: {
        id: `usr_${Date.now()}`,
        name: email.split('@')[0],
        email,
        phone: '+91 98765 00000',
        role: role || 'user',
        city: 'Bengaluru',
        consentPoliceDispatch: false,
        consentAudioRecording: true,
        consentLocationTracking: true,
        nightSafetyMode: true,
        collegeSafetyMode: false,
        discreetPin: '1234',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error during login.' }, { status: 500 });
  }
}
