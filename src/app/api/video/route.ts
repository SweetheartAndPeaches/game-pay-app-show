import { NextRequest, NextResponse } from 'next/server';
import { VideoGenerationClient, Config, HeaderUtils, Content } from 'coze-coding-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, imageUrl } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new VideoGenerationClient(config, customHeaders);

    // Build content array
    const content: Content[] = [];

    // Add image as first frame if provided
    if (imageUrl) {
      content.push({
        type: 'image_url' as const,
        image_url: { url: imageUrl },
        role: 'first_frame' as const,
      });
    }

    // Add text prompt
    content.push({
      type: 'text' as const,
      text: prompt,
    });

    const response = await client.videoGeneration(content, {
      model: 'doubao-seedance-1-5-pro-251215',
      duration: 6,
      ratio: '16:9',
      resolution: '720p',
      generateAudio: true,
      watermark: false,
    });

    if (response.videoUrl) {
      return NextResponse.json({
        success: true,
        videoUrl: response.videoUrl,
        taskId: response.response.id,
        duration: response.response.duration,
      });
    } else {
      return NextResponse.json(
        { error: 'Video generation failed', status: response.response.status },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Video generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate video', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve a pre-generated promo video
export async function GET(request: NextRequest) {
  // Pre-generated promo video URL (stored in object storage)
  // This video was generated once and stored for reuse
  const promoVideoUrl = process.env.PROMO_VIDEO_URL || null;
  
  if (promoVideoUrl) {
    return NextResponse.json({
      success: true,
      videoUrl: promoVideoUrl,
    });
  }
  
  // If no pre-generated video, generate a new one
  try {
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new VideoGenerationClient(config, customHeaders);

    const content: Content[] = [
      {
        type: 'text' as const,
        text: '9INR app promotional video: A golden smartphone with 9INR app icon on a dark luxury background. Golden particles and coins floating around. Text "9INR - Earn Money Online" appears in glowing golden Hindi font. Smooth cinematic camera movement showing the app interface with money earning features. Professional tech advertisement style, elegant and premium feel.',
      },
    ];

    const response = await client.videoGeneration(content, {
      model: 'doubao-seedance-1-5-pro-251215',
      duration: 6,
      ratio: '16:9',
      resolution: '720p',
      generateAudio: true,
      watermark: false,
    });

    if (response.videoUrl) {
      return NextResponse.json({
        success: true,
        videoUrl: response.videoUrl,
        taskId: response.response.id,
        duration: response.response.duration,
      });
    } else {
      return NextResponse.json(
        { error: 'Video generation failed' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Video generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    );
  }
}
