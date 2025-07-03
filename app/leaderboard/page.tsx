"use client";
import { useUsers } from "@/backend/user/dbFunctions";

export default function LeaderboardPage() {
  const { users, loading, error } = useUsers();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  // Sort users by points in descending order
  const sortedUsers = [...users].sort(
    (a, b) => (b.points || 0) - (a.points || 0)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Leaderboard</h1>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg border shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <div className="grid grid-cols-12 font-semibold">
              <div className="col-span-2 ">Rank</div>
              <div className="col-span-7">User</div>
              <div className="col-span-3 text-right">Points</div>
            </div>
          </div>

          <div className="divide-y">
            {sortedUsers.map((user, index) => (
              <div key={user.id} className="p-4 hover:bg-gray-50">
                <div className="grid grid-cols-12 items-center">
                  <div className="col-span-2  font-medium">{index + 1}</div>
                  <div className="col-span-7">
                    {user.name || "Anonymous User"}
                  </div>
                  <div className="col-span-3 text-right font-medium">
                    {user.points || 0}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
