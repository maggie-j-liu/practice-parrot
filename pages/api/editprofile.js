import { getSession } from "next-auth/react";
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.redirect("/404");
  }
  const session = await getSession({ req });
  if (!session) {
    res.status(401).end();
    return;
  }
  let { name, color } = JSON.parse(req.body);
  if (!name && !color) {
    res.status(400).end();
    return;
  }
  if (!name) {
    name = undefined;
  }
  if (!color) {
    color = undefined;
  }
  await prisma.user.update({
    where: {
      email: session.user.email,
    },
    data: {
      name,
      parrotColor: color,
    },
  });
  res.status(200).end();
}
