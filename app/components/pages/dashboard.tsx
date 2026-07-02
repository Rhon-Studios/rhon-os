import { useUser } from "@/context/userContext";

export default function Dashboard() {
  const { user, loading } = useUser();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex justify-center items-center min-h-[90%]">
      <h2>Welcome back {user?.name}</h2>
    </div>
  );
}
