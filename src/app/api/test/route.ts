import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Contact from '@/model/Contact';

export async function GET() {
  try {
    // Test database connection
    const connection = await connectToDatabase();
    
    if (!connection) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Try to count documents in Contact collection
    const contactCount = await Contact.countDocuments();

    return NextResponse.json({
      success: true,
      message: 'Database connected successfully!',
      contactCount,
      timestamp: new Date().toISOString()
    }, { status: 200 });

  } catch (error: any) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Database connection failed'
    }, { status: 500 });
  }
}