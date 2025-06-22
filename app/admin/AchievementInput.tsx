import React from "react";

import { TAchievement } from "@/backend/types/dataTypes";

interface AchievementInputProps {
  onAchievementChange: (achievement: TAchievement) => void;
}

const AchievementInput: React.FC<AchievementInputProps> = ({
  onAchievementChange,
}) => {
  const [achievement, setAchievement] = React.useState<TAchievement>({
    header: "",
    desc: "",
    pointsAwarded: 0,
    required: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updatedAchievement = {
      ...achievement,
      [name]: name === "points" ? Number(value) : value,
    };

    setAchievement(updatedAchievement);
    onAchievementChange(updatedAchievement);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="header"
        >
          Achievement Header
        </label>
        <input
          className="mt-1 border p-2 block w-full rounded-md border-gray-300 shadow-sm"
          id="header"
          name="header"
          type="text"
          value={achievement.header}
          onChange={handleChange}
        />
      </div>

      <div>
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="description"
        >
          Achievement Description
        </label>
        <input
          className="mt-1 border p-2 block w-full rounded-md border-gray-300 shadow-sm"
          id="description"
          name="desc"
          value={achievement.desc}
          onChange={handleChange}
        />
      </div>

      <div>
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="points"
        >
          Points Awarded
        </label>
        <input
          className="mt-1 border p-2 block w-full rounded-md border-gray-300 shadow-sm"
          id="points"
          min="1"
          name="pointsAwarded"
          value={achievement.pointsAwarded}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="flex items-center gap-2">
          <input
            checked={achievement.required}
            name="required"
            type="checkbox"
            onChange={handleChange}
          />
          <span className="text-sm font-medium text-gray-700">
            Required Achievement
          </span>
        </label>
      </div>
    </div>
  );
};

export default AchievementInput;
