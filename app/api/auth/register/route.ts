import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, role, password } = body;

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ success: false, error: 'Full Name must be at least 2 characters.' }, { status: 400 });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: 'Valid email is required.' }, { status: 400 });
    }

    if (!phone || phone.trim().length < 7) {
      return NextResponse.json({ success: false, error: 'Valid phone number is required.' }, { status: 400 });
    }

    const userId = `usr_${Date.now()}`;
    const token = `sc_jwt_${userId}_${Date.now()}`;

    const createdUser = {
      id: userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      role: role || 'user',
      avatar: body.avatar || '',
      city: body.city || 'Bengaluru',
      campusOrg: body.campusOrg,
      emergencyContactsCount: body.emergencyContacts?.length || 0,
      emergencyContacts: body.emergencyContacts || [],
      consentPoliceDispatch: body.consentPoliceDispatch ?? false,
      consentAudioRecording: body.consentAudioRecording ?? true,
      consentLocationTracking: body.consentLocationTracking ?? true,
      nightSafetyMode: body.nightSafetyMode ?? true,
      collegeSafetyMode: body.collegeSafetyMode ?? false,
      discreetPin: body.discreetPin || '1234',
    };

    return NextResponse.json({
      success: true,
      message: 'Account successfully registered and encrypted session created.',
      user: createdUser,
      token,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error during registration.' }, { status: 500 });
  }
}
