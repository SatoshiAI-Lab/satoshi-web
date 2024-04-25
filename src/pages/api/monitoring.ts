import type { NextApiHandler } from 'next'

// Used for sentry.
export const handler: NextApiHandler = (req, res) => {
  console.log({
    title: 'receive monitoring',
    url: req.url,
    method: req.method,
  })

  res.status(200).send({
    message: 'ok',
    data: null,
  })
}

export default handler
