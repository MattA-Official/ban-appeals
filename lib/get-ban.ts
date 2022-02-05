const API_ENDPOINT = "https://discord.com/api/v9";

export default async function getBan(id: string) {
  const ban = await fetch(
    `${API_ENDPOINT}/guilds/935622706605490196/bans/${id}`,
    {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      },
    }
  ).then((res) => (res.status === 200 ? res.json() : false));

  return ban;
}
