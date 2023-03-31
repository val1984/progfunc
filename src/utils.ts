// First class functions

const fun = (val: number) => new Intl.NumberFormat().format(val);

type EitherMapper = (value: string) => string | number;

const transformers: EitherMapper[] = [
  (val) => (val.startsWith("a") ? -1 : val),
  (val) => (/\d+/.test(val) ? Number(val) : val),
];

function execute(transformers: EitherMapper[]) {
  return (value: string) => {
    let val = value;
    for (const transformer of transformers) {
      const transformed = transformer(val);
      if (typeof transformed === "number") {
        return transformed;
      }
      val = transformed;
    }
    return val;
  };
}

// No need for for loops

const ages = [23, 28, 35, 40, 45];

const olderThan = (limit: number) => (ages: number[]) => ages.filter(age => age >= limit);
const double = (ages: number[]) => ages.map(age => age * 2);
const candles = (ages: number[]) => ages.flatMap(age => '🕯️'.repeat(age));
const mean = (ages: [number, ...number[]]) => ages.reduce((total, curr) => total + curr, 0) / ages.length;
const display = (ages: number[]) => ages.forEach(age => console.log(age));

// Function composition

interface ValidationError {
  error: string;
  line: number;
}
type Validator = (lines: string[]) => ValidationError[];

function makeCountOccurrences(toFind: string) {
  const regex = new RegExp(toFind, "g");
  return function countOccurrences(searchIn: string) {
    return searchIn.match(regex)?.length ?? 0;
  };
}

const countCommas = makeCountOccurrences(",");

const myCsvValidators: Validator[] = [
  ([headers]) =>
    headers === "ID,NAME,VALUE"
      ? []
      : [{ error: "INCORRECT_HEADERS", line: 0 }],
  (lines) =>
    lines.flatMap((line, lineNum) =>
      countCommas(line) === 2
        ? []
        : [{ error: "INCORRECT_NUMBER_OF_FIELDS", line: lineNum }]
    ),
];

function makeValidator(validators: Validator[]) {
  return function validate(lines: string[]) {
    return validators.flatMap((validator) => validator(lines));
  };
}

// Immutability

type Genre = "RTS" | "Simulation" | "MMORPG";

interface Game {
  readonly title: string;
  readonly genre: Genre;
  readonly tags: readonly string[];
}

const wow: Game = {
  title: "World of Warcraft",
  genre: "MMORPG",
  tags: ["Heroic Fantasy", "Cartoonish"],
};

wow.title = "Dark Age of Camelott";
wow.tags.push("Dark");

function update<T>(original: T, updater: (original: T) => Partial<T>): T {
  return { ...original, ...updater(original) };
}
const exclude = (excluded: string) => (value: string) => value !== excluded;
const daoc = update(wow, ({ tags }) => ({
  title: "Dark Age of Camelott",
  tags: [...tags.filter(exclude("Cartoonish")), "Dark"],
}));
