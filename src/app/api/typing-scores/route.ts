import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import TypingScore from '@/model/TypingScore';

export async function GET() {
  try {
    await connectToDatabase();

    // Get top 5 scores, sorted by score descending
    const topScores = await TypingScore.find()
      .sort({ score: -1 })
      .limit(5)
      .select('name wpm accuracy score timestamp');

    return NextResponse.json({ 
      success: true,
      topScores 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Get typing scores error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch typing scores'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { name, wpm, accuracy } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (typeof wpm !== 'number' || wpm < 0 || wpm > 500) {
      return NextResponse.json(
        { error: 'WPM must be a number between 0 and 500' },
        { status: 400 }
      );
    }

    if (typeof accuracy !== 'number' || accuracy < 0 || accuracy > 100) {
      return NextResponse.json(
        { error: 'Accuracy must be a number between 0 and 100' },
        { status: 400 }
      );
    }

    // Calculate score (WPM * accuracy percentage)
    const score = Math.round(wpm * (accuracy / 100));

    // Check current top 5 scores
    const currentTop5 = await TypingScore.find()
      .sort({ score: -1 })
      .limit(5);

    let shouldSave = false;
    let lowestTopScore = null;

    if (currentTop5.length < 5) {
      // Less than 5 scores, always save
      shouldSave = true;
    } else {
      // Check if new score beats the lowest of top 5
      lowestTopScore = currentTop5[4]; // 5th element (0-indexed)
      if (score > lowestTopScore.score) {
        shouldSave = true;
      }
    }

    if (shouldSave) {
      // Create new score entry
      const newScore = await TypingScore.create({
        name: name.trim(),
        wpm,
        accuracy,
        score
      });

      // If we had 5 scores and this is better, remove the lowest one
      if (lowestTopScore) {
        await TypingScore.findByIdAndDelete(lowestTopScore._id);
      }

      // Get updated top 5 after insertion
      const updatedTop5 = await TypingScore.find()
        .sort({ score: -1 })
        .limit(5)
        .select('name wpm accuracy score timestamp');

      return NextResponse.json({
        success: true,
        message: 'Score saved successfully!',
        newScore: {
          name: newScore.name,
          wpm: newScore.wpm,
          accuracy: newScore.accuracy,
          score: newScore.score,
          timestamp: newScore.timestamp
        },
        topScores: updatedTop5,
        madeLeaderboard: true
      }, { status: 201 });
    } else {
      // Score didn't make it to top 5
      return NextResponse.json({
        success: true,
        message: 'Score submitted, but did not make the top 5.',
        newScore: {
          name: name.trim(),
          wpm,
          accuracy,
          score
        },
        madeLeaderboard: false,
        minimumScoreNeeded: lowestTopScore ? lowestTopScore.score + 1 : score
      }, { status: 200 });
    }

  } catch (error: any) {
    console.error('Post typing score error:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}