type Theme = {
  name: string;
  sentBubbleClassName: string;
};

const themes: { [key: string]: Theme } = {
  neutral: {
    name: "Neutral",
    sentBubbleClassName:
      "bg-foreground dark:bg-zinc-600 text-background dark:text-foreground",
  },
  blue: {
    name: "Blue",
    sentBubbleClassName: "bg-blue-600 text-white",
  },
  green: {
    name: "Green",
    sentBubbleClassName: "bg-green-600 text-white",
  },
  rose: {
    name: "Rose",
    sentBubbleClassName: "bg-rose-600 text-white",
  },
  violet: {
    name: "Violet",
    sentBubbleClassName: "bg-violet-600 text-white",
  },
};

export type { Theme };
export default themes;
