// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message?: string;
  revalidation?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.query.secret === process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: "Invalid Token" });
  }

  try {
    await res.revalidate("/");
    return res.status(200).json({ revalidation: "Success" });
  } catch (error) {
    return res.status(500).json({ message: "Error revalidating index" });
  }
}
