import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const SelectMode = () => {
  const modeMap: { [key: string]: string } = {
    system: "System",
    light: "Light",
    dark: "Dark",
  };
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme || "system");

  useEffect(() => {
    setSelectedTheme(theme || "system");
  }, [theme]);

  return (
    <Select value={selectedTheme} onValueChange={(value) => setTheme(value)}>
      <SelectTrigger className="w-[120px]">
        <SelectValue>{modeMap[selectedTheme]}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Object.keys(modeMap).map((key) => (
            <SelectItem key={key} value={key}>
              {modeMap[key]}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const SettingsComponent = ({
  isSettingsOpen,
  setIsSettingsOpen,
}: {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (isOpen: boolean) => void;
}) => {
  return (
    <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Customize your chat experience</DialogDescription>
        </DialogHeader>
        <div className="py-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="dark-mode" className="font-medium">
                Dark Mode
              </Label>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Toggle dark mode on or off
              </span>
            </div>
            <SelectMode />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsComponent;
