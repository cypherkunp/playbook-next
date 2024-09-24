const USERS_API_URL = "https://jsonplaceholder.typicode.com/users";

type User = {
  name: string;
  username: string;
  email: string;
  phone: string;
};

export default async function UsersPage() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const response = await fetch(USERS_API_URL);
  const users = await response.json();
  // throw new Error('Failure');

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1>Users</h1>

      <div className="max-w-screen-md w-full py-[50px] flex flex-wrap gap-4 justify-center">
        {users.map((user: User) => (
          <div
            key={user.username}
            className="flex flex-col p-4 h-[150px] w-[200px] rounded-md space-y-6 shadow bg-zinc-200 hover:bg-zinc-400 pointer"
          >
            <div>
              <h2 className="text-lg text-zinc-950 ">@{user.username}</h2>
              <p className="text-xs text-zinc-500">{user.name}</p>
            </div>
            <div className="text-xs text-zinc-950 flex flex-col space-y-1">
              <p className="break-words">{user.email}</p>
              <p className="text-wrap">{user.phone}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
