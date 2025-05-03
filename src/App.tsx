import {AddIcon, BoxProps, ButtonGroup, SimpleGrid} from "@chakra-ui/icons";
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    IconButton,
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Radio,
    RadioGroup,
    Tag,
    TagCloseButton,
    TagLabel,
    Text,
    Tooltip,
    VStack,
    Wrap,
    WrapItem
} from "@chakra-ui/react"
import {Draft} from "immer";
import {Dispatch, ReactNode, SetStateAction, useReducer, useState} from "react";
import {ImmerReducer, useImmerReducer} from "use-immer";
import {Vector2D, generateWordsearch, type Wordsearch, getLine} from "./wordsearch.ts";

type GenerateMode = "manual" | "theme" | "random";

const UsesAi = () => (
    <Tooltip label="Uses AI" hasArrow>
        <span>✨</span>
    </Tooltip>
);

type GenerateWordResult = {
    theme: string;
    words: string[];
}

const someFakeWordGenerator = async (): Promise<GenerateWordResult> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
        theme: "Food",
        words: ["sausages", "steak", "quinoa", "noodles", "pancakes", "creme brulee", "tomatoes", "tikka masala"],
    };
};

const generateModes: { type: GenerateMode, name: ReactNode; }[] = [
    { type: "random", name: <>Generate words based on a random theme&nbsp;<UsesAi /></> },
    { type: "theme", name: <>Generate words based on a specified theme&nbsp;<UsesAi /></> },
    { type: "manual", name: "Enter words manually" },
];

type WordsInputProps = {
    words: string[];
    setWords: Dispatch<SetStateAction<string[]>>;
};

function generatePlaceholder(words: string[]): string {
    // const pickedWords: string[] = [];
    // while (pickedWords.length < 3) {
    const index = Math.floor(Math.random() * words.length);
    return words[index];

        // if (!pickedWords.includes(exampleWord)) {
        //     pickedWords.push(exampleWord);
        // }
    // }
    // const placeholder = pickedWords.join(" / ") ;//+ " …";
    // return exampleWord.charAt(0).toUpperCase() + exampleWord.substring(1);
}

function generateWordsPlaceholder(): string {
    const exampleWords = [
        // "book 📚",
        // "sun ☀️",
        // "water 💧",
        // "walk 🚶‍♀️",
        // "food 🍕",
        // "friend 😊",
        // "time ⏰",
        // "work 💼",
        // "green 🟢",
        // "phone 📱",
        // "car 🚗",
        // "tree 🌳",
        // "light 💡",
        // "door 🚪",
        // "money 💰",
        // "game 🕹️",
        // "sleep 😴",
        // "cold 🥶",
        // "song 🎵",
        // "idea 🤔",

        "Pizza 🍕",
        "Cake 🎂",
        "Ice cream 🍦",
        "Sushi 🍣",
        "Taco 🌮",
        "Fries 🍟",
        "Nuggets 🍗",
        "Pretzels 🥨",
        "Cupcake 🧁",
        "Donut 🍩",
        "Waffles 🧇",
        "Pancakes 🥞",
        "Cookies 🍪",
        "Brownie 🍫",
        "Nachos 🌶️",
        "Smoothie 🍹",
        "Burrito 🌯",
        "Ramen 🍜",
        "Pho 🍜",
        "Bagel 🥯",
        "Yogurt 🍧",
        "Oatmeal 🥣",
        "Wrap 🌯",
        "Pie 🥧",
        "Muffin 🧁",
        "Salad 🥗",
        "Eggs 🍳",
        "Toast 🍞",
        "Jelly 🍮",
        "Scone 🍰",
    ];
    return generatePlaceholder(exampleWords);
}

function generateThemePlaceholder(): string {
    const exampleThemes = [
        // "weather 🌦️",
        // "food 🍔",
        // "animals 🦊",
        // "travel ✈️",
        // "sports ⚽",
        // "music 🎶",
        // "technology 💻",
        // "emotions 😢",
        // "colors 🎨",
        // "clothing 👕",
        // "home 🏠",
        // "school 🎒",
        // "work 🏢",
        // "nature 🌲",
        // "time ⌚",
        // "shapes 🔶",
        // "vehicles 🚲",
        // "tools 🔨",

        "Terrible puns 🤣",
        "Awkward moments 😬",
        "Things you trip over 🦶",
        "Reasons for being late ⏰",
        "Things that make you say \"Huh?\" 🤔",
        "Dad jokes 👴",
        "Office supplies gone wild 📎",
        "Bad excuses 🤥",
        "Animal names 🐶",
        "Food fight! 🍕",
        "What did I come in here for? 🚶‍♀️",
        "Things you mishear 👂",
        "That's not what I ordered! 🍔",
        "Wardrobe malfunctions 👔",
        "Things you'd find in a zombie's pocket 🧟",
        "Things that mysteriously disappear 👻",
        "Funny place names 🗺️",
        "Reasons your plant died 🪴",
        "Things you hide from your kids 🙊",
        "Signs you're addicted to coffee ☕",
    ];
    return generatePlaceholder(exampleThemes);
}

function WordsInput({ words, setWords }: WordsInputProps) {
    const [newWord, setNewWord] = useState("");
    const [placeholder, setPlaceholder] = useState(generateWordsPlaceholder);

    const onAddButtonClick = () => {
        setWords(w => [...w, newWord]);
        setNewWord("");
        setPlaceholder(generateWordsPlaceholder);
    };
    const onDeleteButtonClick = (index: number) => setWords(w => w.toSpliced(index, 1));

    const maxWordCount = 10;
    const valid = newWord && !words.includes(newWord) && words.length < maxWordCount;

    return (
        <>
            <Wrap>
                {words.map((word, index) => (
                    <WrapItem key={index}>
                        <Tag>
                            <TagLabel>{word}</TagLabel>
                            <TagCloseButton onClick={() => onDeleteButtonClick(index)} />
                        </Tag>
                    </WrapItem>
                ))}
            </Wrap>

            <HStack>
                <Input
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    placeholder={placeholder}
                    onKeyDown={(e) => e.key === "Enter" && valid ? onAddButtonClick() : undefined}
                />
                <IconButton
                    aria-label="Add word"
                    icon={<AddIcon />}
                    colorScheme="green"
                    onClick={onAddButtonClick}
                    disabled={!valid}
                />
            </HStack>
        </>
    );
}

type WordsearchProps = {
    wordsearch: Wordsearch;
    size: number;
    words: string[];
};

const computeDelta = (point1: Vector2D, point2: Vector2D): Vector2D => ({
    x: Math.abs(point2.x - point1.x),
    y: Math.abs(point2.y - point1.y),
});

function Wordsearch({ wordsearch, size, words }: WordsearchProps) {
    const [playMode, setPlayMode] = useState(false);
    const [selectedPoint1, setSelectedPoint1] = useState<Vector2D | null>(null);
    const [selectedPoint2, setSelectedPoint2] = useState<Vector2D | null>(null);

    const isSelectableForSecondSelection = (coords: Vector2D): boolean => {
        if (selectedPoint1 && !selectedPoint2) {
            const delta = computeDelta(coords, selectedPoint1);
            return (delta.x !== 0 || delta.y !== 0) && (delta.x === 0 || delta.y === 0 || delta.x === delta.y);
        }

        return false;
    };

    const isSelectable = (coords: Vector2D): boolean => {
        if (selectedPoint1 && !selectedPoint2) {
            return isSelectableForSecondSelection(coords);
        }

        return true;
    };

    const onLetterClick = (coords: Vector2D) => {
        if (!isSelectable(coords)) {
            return;
        }

        if (selectedPoint1 && !selectedPoint2 && (coords.x !== selectedPoint1.x || coords.y !== selectedPoint1.y)) {
            setSelectedPoint2(coords);

            const selectedLine = getLine(selectedPoint1, selectedPoint2, size).map(p => wordsearch[p.y][p.x]);
            console.log(selectedLine);
            const selectedWord = selectedLine.map(c => c.letter).join("");
            console.log(selectedWord);
            if (words.includes(selectedWord)) {
                for (const cell of selectedLine) {
                    cell.found = true;
                }
            }

            return;
        }

        setSelectedPoint1(coords);
        setSelectedPoint2(null);
    };

    const isSelected = (coords: Vector2D): boolean =>
        (!!selectedPoint1 && selectedPoint1.x === coords.x && selectedPoint1.y === coords.y)
        || (!!selectedPoint2 && selectedPoint2.x === coords.x && selectedPoint2.y === coords.y);

    const isHighlighted = (coords: Vector2D): boolean => selectedPoint1 && selectedPoint2
        ? getLine(selectedPoint1, selectedPoint2, size).some(p => p.x === coords.x && p.y === coords.y)
        : isSelected(coords);

    const getCellStyling = (coords: Vector2D): BoxProps | undefined => {
        if (wordsearch[coords.y][coords.x].found) {
            return { backgroundColor: "teal" };
        }

        if (isHighlighted(coords)) {
            return { backgroundColor: "white", color: "black" };
        }

        if (isSelectableForSecondSelection(coords)) {
            return { backgroundColor: "darkslategray" };
        }

        return undefined;
    }

    const onPlayButtonClick = () => {
        setPlayMode(true);
    };

    const onClearSelectionButtonClick = () => {
        setSelectedPoint1(null);
        setSelectedPoint2(null);
    };

    return (
        <VStack>
            <ButtonGroup>
                <Button colorScheme="blue" onClick={onPlayButtonClick} isDisabled={!wordsearch || playMode}>Play</Button>
                <Button onClick={onClearSelectionButtonClick} isDisabled={!wordsearch || (!selectedPoint1 && !selectedPoint2)}>Clear selection</Button>
            </ButtonGroup>

            <SimpleGrid columns={size} spacing={2}>
                {wordsearch.map((row, rowIndex) => row.map((cell, colIndex) => (
                    <Box
                        key={`${rowIndex},${colIndex}`}
                        textAlign="center"
                        onClick={() => onLetterClick({ x: colIndex, y: rowIndex })}
                        cursor={isSelectable({ x: colIndex, y: rowIndex }) ? "pointer" : "not-allowed"}
                        px={2}
                        py={1}
                        borderRadius={10}
                        _hover={{ backgroundColor: isSelectable({ x: colIndex, y: rowIndex }) ? "gray" : undefined }}
                        {...getCellStyling({ x: colIndex, y: rowIndex })}
                    >
                        {cell.letter}
                    </Box>
                )))}
            </SimpleGrid>
        </VStack>
    );
}

type FormState = {
    size: string;
    generateMode: GenerateMode;
    enteredWords: string[];
    enteredTheme: string;
};

type State = Readonly<{
    form: FormState;
    words: string[];
    theme: string | null;
    themePlaceholder: string;
    wordsearch: Wordsearch | null;
}>;

const initialState: State = {
    form: {
        size: "15",
        generateMode: "random",
        enteredWords: [],
        enteredTheme: "",
    },
    words: [],
    theme: null,
    themePlaceholder: "",
    wordsearch: null,
};

const generateInitialState: () => State = () => ({
    ...initialState,
    themePlaceholder: generateThemePlaceholder(),
});

type Action =
    | { type: "update-generate-mode", payload: { generateMode: GenerateMode } }
    | { type: "update-size", payload: { size: string } }
    | { type: "add-word", payload: { word: string } }
    | { type: "delete-word", payload: { index: number } }
    | { type: "generate" }
    | { type: "clear" };

const reducer: ImmerReducer<State, Action> = (draft, action) => {
    const clearOutput = (): void => {
        draft.words = initialState.words;
        draft.theme = initialState.theme;
        draft.wordsearch = initialState.wordsearch;
    };
    switch (action.type) {
        case "update-generate-mode": {
            draft.form.generateMode = action.payload.generateMode;
            clearOutput();

            if (draft.form.generateMode === "theme") {
                draft.themePlaceholder = generateThemePlaceholder();
            }
            return;
        }
        case "update-size": {
            draft.form.size = action.payload.size;
            clearOutput();
            return;
        }
        case "add-word": {
            draft.form.enteredWords.push(action.payload.word);
            clearOutput();
            return;
        }
        case "delete-word": {
            draft.form.enteredWords.splice(action.payload.index, 1); // todo revert tsconfig lib change
            clearOutput();
            return;
        }
        case "generate": {
            switch (draft.form.generateMode) {
                case "manual": {
                    draft.words = draft.form.enteredWords;
                    break;
                }
                case "theme": {
                    draft.themePlaceholder = generateThemePlaceholder();
                    const result = await someFakeWordGenerator();
                    draft.words = action.payload
                    setWords(result.words);
                    setTheme(enteredTheme);
                    setLoading(false);
                    break;
                }
                default: {
                    const result = await someFakeWordGenerator();
                    setWords(result.words);
                    setTheme(result.theme);
                    break;
                }
            }

            const sizeNumber = parseInt(draft.form.size, 10);
            draft.wordsearch = generateWordsearch(sizeNumber, draft.words);
        }
        case "clear": {
            return generateInitialState();
        }
    }
}

function App() {
    const [size, setSize] = useState();
    const [generateMode, setGenerateMode] = useState<GenerateMode>();
    const [enteredWords, setEnteredWords] = useState<string[]>([]);
    const [enteredTheme, setEnteredTheme] = useState<string>("");
    const [words, setWords] = useState<string[]>([]);
    const [theme, setTheme] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [themePlaceholder, setThemePlaceholder] = useState(generateThemePlaceholder);
    const [wordsearch, setWordsearch] = useState<Wordsearch | null>(null);

    const [dispatch,] = useImmerReducer();

    return (
        <Container>
            <VStack>
                <Heading>
                    Wordsearch Generator
                </Heading>

                <VStack spacing={6}>
                    <FormControl>
                        <FormLabel>Size</FormLabel>
                        <NumberInput value={size} onChange={onUpdateSize} min={1} max={50}>
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>
                    <RadioGroup value={generateMode} onChange={gm => onGenerateModeRadioClick(gm as GenerateMode)}>
                        <VStack alignItems="start" gap={2}>
                            {generateModes.map(mode => (
                                <Radio key={mode.type} value={mode.type}>
                                    {mode.name}
                                </Radio>
                            ))}
                        </VStack>
                    </RadioGroup>

                    {generateMode === "theme" && (
                        <FormControl>
                            <FormLabel>Theme</FormLabel>
                            <Input
                                value={enteredTheme}
                                onChange={e => setEnteredTheme(e.target.value)}
                                placeholder={themePlaceholder}
                            />
                        </FormControl>
                    )}

                    {generateMode === "manual" && (
                        <FormControl>
                            <FormLabel>Words</FormLabel>
                            <WordsInput words={enteredWords} setWords={onUpdateWords} />
                        </FormControl>
                    )}

                    <ButtonGroup>
                        <Button colorScheme="blue" onClick={onGenerateButtonClick} isLoading={loading}>Create</Button>
                        <Button onClick={onClearButtonClick} isDisabled={loading}>Clear</Button>
                    </ButtonGroup>

                    {generateMode === "random" && theme && <Text>Theme: <b>{theme}</b></Text>}

                    {generateMode !== "manual" && words && (
                        <Wrap>
                            {words.map((word, index) => (
                                <WrapItem key={index}>
                                    <Tag>{word}</Tag>
                                </WrapItem>
                            ))}
                        </Wrap>
                    )}
                </VStack>

                {wordsearch && <Wordsearch wordsearch={wordsearch} size={sizeNumber} words={words} />}
            </VStack>
        </Container>
    );
}

export default App;
