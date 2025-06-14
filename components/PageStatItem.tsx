export const PageStatItem = ({
  pct,
  stat,
  covered,
  total,
}: {
  pct: number;
  stat: "Branches" | "Statements" | "Functions" | "Lines";
  covered: number;
  total: number;
}) => {
  return (
    <p>
      <span className="font-bold">{pct}%</span>{" "}
      <span className="text-[color:var(--subtitle-text)]">{stat}</span>
      <span className="mx-1 p-1">
        ({covered}/{total})
      </span>
    </p>
  );
};
