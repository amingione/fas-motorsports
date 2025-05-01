import type { NextApiRequest, NextApiResponse } from 'next';

const SHIPENGINE_API_KEY = process.env.SHIPENGINE_API_KEY || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { trackingNumber, carrierCode } = req.query;

  if (!trackingNumber || typeof trackingNumber !== 'string') {
    return res.status(400).json({ message: 'Missing or invalid tracking number' });
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
      return res.status(response.status).json({ message: 'Failed to retrieve tracking info', error });
    }

    const data = await response.json();
    const {
      carrier_name,
      tracking_number,
      status_description,
      estimated_delivery_date,
    } = data;

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

    return res.status(200).json({
      carrier: carrier_name,
      trackingNumber: tracking_number,
      status: status_description,
      eta: estimated_delivery_date,
    });
  } catch (error: any) {
    console.error('Tracking error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
