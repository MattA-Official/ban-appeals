import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import getBan from "../../../lib/get-ban";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    DiscordProvider({
      authorization: "https://discord.com/api/oauth2/authorize?scope=identify",
      clientId: process.env.DISCORD_ID,
      clientSecret: process.env.DISCORD_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.uid = user.id;
        token.banned = (await getBan(user.id)) ? true : false;
        console.log(token);
      }
      return token;
    },
    async session({ session, user, token }) {
      if (session.user) {
        session.user.uid = token.uid;
        session.user.banned = token.banned;
      }
      return session;
    },
  },
});
