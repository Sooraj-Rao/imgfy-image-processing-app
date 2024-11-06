export const TextSlice = (
  text: string,
  count: number = 10,
  end: boolean = false
) => {
  if (!text) return;

  const suffix = end ? text?.split(".").pop() : "";
  const isShorter = text.length <= count;
  return isShorter ? text : `${text.slice(0, count)}...${suffix || ""}`;
};
