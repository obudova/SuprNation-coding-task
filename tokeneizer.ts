type Token = {
    type: "NUMBER" |
        "OPERATOR" |
        "OPEN_PARENTHESIS" |
        "CLOSE_PARENTHESIS";
    value: string;
};
type Success = {
    success: true;
    value: Token[];
    rest: string
}
type Failure = {
    success: false;
    reason: string;
}
type Result = Success | Failure;
const success = (value: Token[], rest: string): Result =>
    ({success: true, value: value, rest});
const failure = (reason: string): Result =>
    ({success: false, reason});
type Parser = (input: string) => Result

const parseNumber: Parser = (input: string) => {
    const match = /^\d+/.exec(input);
    if (match) {
        return success([
            {type: "NUMBER", value: match[0]}
        ], input.slice(match[0].length));
    }
    return failure("Not a number");
}

// console.log(parseNumber("123"));

const parseOperator: Parser = (input: string) => {
    const match = /^[-+]/.exec(input); // Matches either '+' or '-'

    if (match) {
        return success([
            {type: "OPERATOR", value: match[0]}
        ], input.slice(match[0].length));
    }

    return failure("Expected '+ or -'");
};

// console.log(parseOperator("6"));

const parseOpenParenthesis: Parser = (input: string) => {
    const match = /^\(/.exec(input); // Matches the opening parenthesis "("

    if (match) {
        return success([
            {type: "OPEN_PARENTHESIS", value: match[0]}
        ], input.slice(match[0].length));
    }

    return failure("Expected '('");
};

const parseCloseParenthesis: Parser = (input: string) => {
    const match = /^\)/.exec(input); // Matches the closing parenthesis ")"

    if (match) {
        return success([
            {type: "CLOSE_PARENTHESIS", value: match[0]}
        ], input.slice(match[0].length));
    }

    return failure("Expected ')'");
};

const parseCharacter: (char: string, tokenType: Token['type']) => Parser = (char, tokenType) => (input: string) => {
    if (input.startsWith(char)) {
        return success([{type: tokenType, value: char}], input.slice(char.length));
    }

    return failure(`Expected '${char}'`);
};

const parseOpenParenthesis2 = parseCharacter("(", "OPEN_PARENTHESIS");
const parseCloseParenthesis2 = parseCharacter(")", "CLOSE_PARENTHESIS");

const choice: (p1: Parser, p2: Parser) => Parser = (p1, p2) => (input) => {
    const result1 = p1(input);

    if (result1.success) {
        return result1;
    }

    const result2 = p2(input);
    return result2;
};

// console.log(choice(parseNumber, parseOperator)("+2"))

const parseOperator2 = choice(
    parseCharacter("+", "OPERATOR"),
    parseCharacter("-", "OPERATOR")
);

const choiceN: (parsers: Parser[]) => Parser = (parsers) => (input) => {
    for (const parser of parsers) {
        const result = parser(input);
        if (result.success) {
            return result; // Return the first successful result
        }
    }

    return failure("None of the parsers succeeded");
};

const zip: (parser1: Parser, parser2: Parser) => Parser = (parser1, parser2) => (input) => {
    const result1 = parser1(input);

    if (result1.success) {
        const result2 = parser2(result1.rest);

        if (result2.success) {
            const combinedValue = [...result1.value, ...result2.value];
            return success(combinedValue, result2.rest);
        }
    }

    return failure("Failed to combine parsers");
};


const isEmpty: Parser = (input) => {
    if (input === '') {
        return success([], '');
    } else {
        return failure('Not an empty string');
    }
};


const doUntil: (parser: Parser) => Parser = (parser) => (input) => {
    const result = parser(input);

    if (result.success) {
        const restResult = doUntil(parser)(result.rest);

        if (restResult.success) {
            const combinedValue = [...result.value, ...restResult.value];
            return success(combinedValue, restResult.rest);
        } else {
            return restResult;
        }
    } else {
        if (input === '') {
            return isEmpty(input);
        } else {
            return failure('No further parsing is possible');
        }
    }
};

console.log(doUntil(choiceN([parseOperator, parseNumber]))("1+2"))
