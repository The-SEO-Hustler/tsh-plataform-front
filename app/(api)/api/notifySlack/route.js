import { NextResponse } from 'next/server';

async function notifySlack(status, docId, route) {
  const endpoint = process.env.NOTIFICATION_ENDPOINT;
  const env = process.env.NODE_ENV;

  // if (env === "production" && endpoint) {
  try {
    const response = await fetch(`${endpoint}?status=${status}&docId=${docId}&route=${route}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending Slack notification:', error);
    throw error;
  }
  // }

  // In development, just log the notification
  if (env !== "production") {
    console.log('Slack notification (dev):', { status, docId, route });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { status, docId, route } = body;

    // Validate required parameters
    if (!status || !docId || !route) {
      return NextResponse.json(
        { error: 'Missing required parameters: status, docId, route' },
        { status: 400 }
      );
    }

    // Send notification to Slack
    await notifySlack(status, docId, route);

    return NextResponse.json(
      { success: true, message: 'Notification sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in notifySlack route:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}

// Also support GET requests for backward compatibility
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const docId = searchParams.get('docId');
    const route = searchParams.get('route');

    // Validate required parameters
    if (!status || !docId || !route) {
      return NextResponse.json(
        { error: 'Missing required parameters: status, docId, route' },
        { status: 400 }
      );
    }

    // Send notification to Slack
    await notifySlack(status, docId, route);

    return NextResponse.json(
      { success: true, message: 'Notification sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in notifySlack route:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
