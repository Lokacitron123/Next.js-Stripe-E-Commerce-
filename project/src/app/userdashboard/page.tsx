import { getSession, useSession } from "next-auth/react";

const UserDashboard = async () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }

  return (
    <div>
      <h1>Hello from userdashboard</h1>
      <h2>Protected Page</h2>
      <p>You can view this page because you are signed in.</p>
    </div>
  );
};

export default UserDashboard;
