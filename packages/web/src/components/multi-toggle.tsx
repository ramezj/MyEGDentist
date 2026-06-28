import { cn } from "#/lib/utils";
import { Checkbox } from "#/components/ui/checkbox";
import { Label } from "#/components/ui/label";

interface Props {
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  cols?: number;
}

export function MultiToggle({ options, selected, onChange, cols = 2 }: Props) {
  function toggle(item: string) {
    onChange(selected.includes(item) ? selected.filter((s) => s !== item) : [...selected, item]);
  }

  return (
    <div className={cn("grid gap-2", cols === 2 ? "grid-cols-2" : "grid-cols-3 sm:grid-cols-4")}>
      {options.map((item) => (
        <div key={item} className="flex items-center gap-2">
          <Checkbox
            id={item}
            checked={selected.includes(item)}
            onCheckedChange={() => toggle(item)}
          />
          <Label htmlFor={item} className="font-normal cursor-pointer text-sm">
            {item}
          </Label>
        </div>
      ))}
    </div>
  );
}
