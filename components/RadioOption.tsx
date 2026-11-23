export function RadioOption({ name, value, checked, onChange, label }
  :
  {
    name:string;
    value:string;
    checked:boolean;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    label:string;
  }
) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-base">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 accent-blue-600"
      />
      <span>{label}</span>
    </label>
  );
}