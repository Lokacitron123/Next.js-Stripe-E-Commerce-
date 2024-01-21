import { getServerSession } from "next-auth";
import Image from "next/image";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function HomePage() {
  const data = await getServerSession(authOptions);

  return (
    <main>
      <h1>Homepage</h1>
      <p>{data?.expires}</p>
    </main>
  );
}
