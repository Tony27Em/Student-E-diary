// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type User = {
  name: string
}

type Data = {
  users: User[]
}

const users: User[] = [
  { name: 'Ron' },
  { name: 'Bob' },
  { name: 'Eva' },
  { name: 'Tom' },
  { name: 'Joe' },
]


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ users: users })
}
