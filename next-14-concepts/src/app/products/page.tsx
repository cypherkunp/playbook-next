const PRODUCTS_API_URL = "http://localhost:3001/products";

type Product = {
  id: string;
  title: string;
  price: number;
  description: string;
};

export default async function ProductsPage() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const response = await fetch(PRODUCTS_API_URL, {
    cache: "no-store",
  });
  const users = await response.json();
  // throw new Error('Failure');

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1>Products</h1>

      <div className="max-w-screen-md w-full py-[50px] flex flex-wrap gap-4 justify-center">
        {users.map((user: Product) => (
          <div
            key={user.id}
            className="flex flex-col p-4 h-[150px] w-[200px] rounded-md space-y-6 shadow bg-zinc-200 hover:bg-zinc-400 cursor-pointer"
          >
            <div>
              <h2 className="text-lg text-zinc-950 ">{user.title}</h2>
              <p className="text-xs text-zinc-500">{user.description}</p>
            </div>
            <div className="text-lg text-zinc-950 flex flex-col space-y-1">
              <p className="break-words">${user.price}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
