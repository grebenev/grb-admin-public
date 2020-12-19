interface InputOption {
  name: string;
  _id: string;
}

interface FormattedOption {
  name: string;
  value: string;
  selected?: boolean;
}

export const formatOptions = (
  options: InputOption[],
  selectedId?: string
): FormattedOption[] => {
  let formatted: FormattedOption[] = [];

  formatted = options.map(
    (option: InputOption): FormattedOption => {
      let formatedOption = { name: option.name, value: option._id };

      let selectedOption =
        option._id === selectedId ? { selected: true } : null;

      return { ...formatedOption, ...selectedOption };
    }
  );

  return formatted;
};
