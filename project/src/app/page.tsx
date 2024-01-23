import { getServerSession } from "next-auth";
import Image from "next/image";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function HomePage() {
  return (
    <div className=''>
      <h1>Homepage</h1>
    </div>
  );
}
