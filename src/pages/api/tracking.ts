import { NextRequest, NextResponse } from 'next/server';

const SHIPENGINE_API_KEY = process.env.SHIPENGINE_API_KEY || '';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url || '');
  const trackingNumber = searchParams.get('trackingNumber');
  const carrierCode = searchParams.get('carrierCode');

  if (!trackingNumber || typeof trackingNumber !== 'string') {
    return NextResponse.json({ message: 'Missing or invalid tracking number' }, { status: 400 });
  }

  let url = `https://api.shipengine.com/v1/tracking?tracking_number=${trackingNumber}`;
  if (carrierCode && typeof carrierCode === 'string') {
    url += `&carrier_code=${carrierCode}`;
  }

  try {
    const response = await fetch(url, {
      headers: {
        'API-Key': SHIPENGINE_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { message: 'Failed to retrieve tracking info', error },
        { status: response.status }
      );
    }

    const data = await response.json();
    const {
      carrier_name,
      tracking_number,
      status_description,
      estimated_delivery_date,
    } = data;

    return new NextResponse(
      JSON.stringify({
        carrier: carrier_name,
        trackingNumber: tracking_number,
        status: status_description,
        eta: estimated_delivery_date,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 's-maxage=300, stale-while-revalidate',
        },
      }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Tracking error:', error.message);
    } else {
      console.error('Tracking error:', error);
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
