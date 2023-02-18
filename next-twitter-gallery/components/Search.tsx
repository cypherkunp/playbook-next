import React, { useState, useEffect } from "react";

import {
  getFilteredSuggestions,
  getMatchedSuggestion,
} from "@utils/string.utils";

const Search = ({
  suggestions,
  showSuggestions,
  searchQuery,
  setSearchQuery,
}: {
  suggestions: string[];
  searchQuery: string;
  setSearchQuery: Function;
  showSuggestions: boolean;
}) => {
  const [activeSuggestion, setActiveSuggestion] = useState("");

  const onChange = (e) => {
    const searchQuery = e.currentTarget.value;
    setSearchQuery(searchQuery);

    const findMatchedSuggestion = getMatchedSuggestion(
      suggestions,
      searchQuery
    );
    console.log("findMatchedSuggestion: ", findMatchedSuggestion);
    findMatchedSuggestion && setActiveSuggestion(findMatchedSuggestion);
  };

  //TODO: Add support for autocomplete on keydown
  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      setSearchQuery(activeSuggestion);
    }
  };

  return (
    <div className="search">
      <input
        className="border border-gray-600 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
        type="text"
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={searchQuery}
        placeholder={"Search your follower"}
      />
    </div>
  );
};

export default Search;
