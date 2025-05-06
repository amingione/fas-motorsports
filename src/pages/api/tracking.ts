import { NextRequest, NextResponse } from 'next/server';

const SHIPENGINE_API_KEY = process.env.SHIPENGINE_API_KEY;

export async function GET(req: NextRequest) {
  if (!SHIPENGINE_API_KEY) {
    return NextResponse.json({ message: 'ShipEngine API key not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(req.url || '');
  const trackingNumber = searchParams.get('trackingNumber');
  const carrierCode = searchParams.get('carrierCode');

  if (!trackingNumber || typeof trackingNumber !== 'string') {
    return NextResponse.json({ message: 'Missing or invalid tracking number' }, { status: 400 });
  }

  const url = new URL('https://api.shipengine.com/v1/tracking');
  url.searchParams.append('tracking_number', trackingNumber);
  if (carrierCode && typeof carrierCode === 'string') {
    url.searchParams.append('carrier_code', carrierCode);
  }

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'API-Key': SHIPENGINE_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: 'Failed to retrieve tracking info', error: data },
        { status: response.status }
      );
    }

    const {
      carrier_name: carrier,
      tracking_number: trackingNumber,
      status_description: status,
      estimated_delivery_date: eta,
    } = data;

    return NextResponse.json(
      { carrier, trackingNumber, status, eta },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 's-maxage=300, stale-while-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Tracking API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
