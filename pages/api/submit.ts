// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import getBan from "../../lib/get-ban";

const WEBHOOK = process.env.WEBHOOK || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const session = await getSession({ req });

    if (session?.user.uid) {
      const ban = await getBan(session.user.uid);

      if (ban) {
        const body = JSON.stringify({
          username: "Ban Appeal",
          embeds: [
            {
              title: "New Ban Appeal",
              description: `<@${ban.user.id}> has submitted a ban appeal.`,
              color: 16777215,
              fields: [
                {
                  name: "Reason",
                  value: ban.reason,
                },
                {
                  name: "Appeal",
                  value: req.body.appeal,
                },
              ],
              footer: {
                text: `ID: ${ban.user.id}`,
              },
              timestamp: new Date(),
            },
          ],
        });

        await fetch(WEBHOOK, {
          method: "POST",
          body,
          headers: {
            "Content-Type": "application/json",
          },
        });

        res.status(200).end();
      } else {
        res.status(404).send({
          error: "You are not banned from this server.",
        });
      }
    } else {
      res.status(401).send({
        error: "You must be signed in to submit a ban appeal.",
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
