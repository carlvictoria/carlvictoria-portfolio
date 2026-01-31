import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Drawing from '@/model/Drawing';

export async function GET() {
  try {
    await connectToDatabase();

    // Get all drawings, sorted by timestamp descending (newest first)
    const drawings = await Drawing.find()
      .sort({ timestamp: -1 })
      .limit(50) // Limit to last 50 drawings for performance
      .select('name imageData timestamp');

    return NextResponse.json({ 
      success: true,
      drawings 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Get drawings error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch drawings'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { name, imageData } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Name is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (!imageData || typeof imageData !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Image data is required' },
        { status: 400 }
      );
    }

    // Validate that imageData is a valid base64 data URL
    if (!imageData.startsWith('data:image/')) {
      return NextResponse.json(
        { success: false, error: 'Invalid image data format' },
        { status: 400 }
      );
    }

    // Create new drawing entry
    const newDrawing = await Drawing.create({
      name: name.trim(),
      imageData
    });

    return NextResponse.json({
      success: true,
      message: 'Drawing saved successfully!',
      drawing: {
        _id: newDrawing._id,
        name: newDrawing.name,
        imageData: newDrawing.imageData,
        timestamp: newDrawing.timestamp
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Post drawing error:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Drawing ID is required' },
        { status: 400 }
      );
    }

    const deletedDrawing = await Drawing.findByIdAndDelete(id);

    if (!deletedDrawing) {
      return NextResponse.json(
        { success: false, error: 'Drawing not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Drawing deleted successfully'
    }, { status: 200 });

  } catch (error: any) {
    console.error('Delete drawing error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
