import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, source } = await request.json();
    
    const emailData = {
      email,
      source: source || 'unknown',
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    };
    
    // Log email for developer reference
    console.log('Email stored for developer reference:', emailData);
    
    // In production, you would store this in your database
    // For now, we're just logging it for developer reference
    
    return NextResponse.json({ 
      success: true, 
      message: 'Email stored successfully',
      email: email 
    });
    
  } catch (error) {
    console.error('Error storing email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to store email' },
      { status: 500 }
    );
  }
}
