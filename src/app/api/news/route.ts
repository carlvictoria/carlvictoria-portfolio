import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GNEWS_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://gnews.io/api/v4/top-headlines?lang=en&max=8&token=${apiKey}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        // Cache for 10 minutes to reduce API calls
        next: { revalidate: 600 }
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `GNews API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
