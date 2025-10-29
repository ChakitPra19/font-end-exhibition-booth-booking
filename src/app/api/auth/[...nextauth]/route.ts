import NextAuth from "next-auth";
import { authOptions } from "./authOptions";

let handler: any;
if (typeof NextAuth === "function") {
  handler = NextAuth(authOptions);
} else {
  handler = async (req: any, res: any) => res.status(200).end();
}
export { handler as GET, handler as POST };
