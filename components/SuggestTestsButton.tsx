import { ChangeEventHandler } from "react";

export const SuggestTestsButton = ({
  onClick,
  updateTestFramework,
  testFramework,
  label,
}: {
  testFramework: string;
  onClick: () => void;
  updateTestFramework: ChangeEventHandler<HTMLInputElement>;
  label: string;
}) => {
  return (
    <div className="flex flex-col">
      <button
        onClick={onClick}
        className="border-1 border-black cursor-pointer h-[100px] hover:bg-gray-300"
      >
        {label}
      </button>
      <div className="grid grid-cols-2 gap-2 p-2">
        <label>
          <input
            type="radio"
            name="test-runner"
            value="jest"
            checked={testFramework === "jest"}
            onChange={updateTestFramework}
            className="mr-2"
          />
          Jest
        </label>
        <label>
          <input
            type="radio"
            name="test-runner"
            value="vitest"
            className="mr-2"
            checked={testFramework === "vitest"}
            onChange={updateTestFramework}
          />
          Vitest
        </label>
      </div>
    </div>
  );
};
