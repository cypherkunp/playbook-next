export const getFilteredSuggestions = (
  suggestions: string[],
  userInput: string
): string[] =>
  suggestions.filter((suggestion) =>
    suggestion.toLowerCase().includes(userInput.toLowerCase())
  );

export const getMatchedSuggestion = (
  suggestions: string[],
  userInput: string
): string | undefined =>
  suggestions.find((suggestion) =>
    suggestion.toLowerCase().startsWith(userInput.toLowerCase())
  );
