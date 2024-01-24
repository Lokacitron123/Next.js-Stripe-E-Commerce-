import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const UserDashboard = async () => {
  const user = await getServerSession(authOptions);
  //github.com/Cajolina
  https: return (
    <div>
      {user?.user.user?.name || "hello"}
      <h1>Hello from userdashboard</h1>
    </div>
  );
};

export default UserDashboard;
