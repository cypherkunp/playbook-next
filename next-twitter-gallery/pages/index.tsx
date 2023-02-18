import Image from "next/image";
import { useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

import { TwitterUser } from "@libs/types";
import { cn } from "@utils/css.utils";
import Search from "@components/Search";

export async function getStaticProps() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );

  const { data, error } = await supabaseAdmin
    .from("images")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.log(error);
  }

  return {
    props: {
      users: data,
    },
  };
}

const Home = ({ users }: { users: TwitterUser[] }) => {
  const [showVerified, setShowVerified] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = useMemo(() => {
    let selctedUsers = users;
    if (showVerified) {
      selctedUsers = users.filter((user) => user.verified);
    }
    if (searchQuery) {
      selctedUsers = selctedUsers.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return selctedUsers;
  }, [showVerified, searchQuery]);

  const handleChecked = () => {
    setShowVerified((showVerified) => !showVerified);
  };

  return (
    <div className="max-w-3xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="flex justify-center mb-16">
        <Search
          suggestions={users.map((user) => user.name)}
          showSuggestions={true}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <button type="submit" className="right-0 top-0 mt-5 mr-4"></button>
        <div className="flex items-center">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-gray-600"
            checked={showVerified}
            onChange={handleChecked}
          />
          <label className="ml-2 text-gray-600">Verified</label>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {filteredUsers.map((user) => (
          <BlurImage key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

function BlurImage({ user }: { user: TwitterUser }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <a href={`https://twitter.com/${user.username}/`} className="group">
      <div className="aspect-w-1 aspect-h-1 xl:aspect-w-7 xl:aspect-h-8 w-full overflow-hidden rounded-lg bg-gray-200">
        <Image
          alt={user.name}
          //src="https://bit.ly/placeholder-img"
          src={user.profile_image_url.replace("_normal", "_400x400")}
          layout="fill"
          objectFit="cover"
          className={cn(
            "group-hover:opacity-75 duration-700 ease-in-out",
            isLoading
              ? "greyscale blur-2xl scale-110"
              : "greyscale-0 blur-0 scale-110"
          )}
          onLoadingComplete={() => setIsLoading(false)}
        />
      </div>
      <h3 className="mt-4 text-sm text-gray-700">{user.name}</h3>
      <p className="mt-1 text-lg font-medium text-gray-900">
        ＠{user.username}
      </p>
    </a>
  );
}

export default Home;
