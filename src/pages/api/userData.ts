import { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from '@clerk/nextjs/server'
import sanityClient from '@/lib/sanityClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req)

  if (!userId) return res.status(401).json({ message: 'Unauthorized' })

  const query = `*[_type == "order" && userId == $userId]`
  const orders = await sanityClient.fetch(query, { userId })

  res.status(200).json({ orders })
}