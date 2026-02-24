import { useCallback, useState } from 'react';

type Operation = '+' | '-' | '×' | '÷' | null;

interface CalculatorState {
    displayValue: string;
    previousValue: string | null;
    operation: Operation;
    waitingForOperand: boolean;
    expression: string;
}

const initialState: CalculatorState = {
    displayValue: '0',
    previousValue: null,
    operation: null,
    waitingForOperand: false,
    expression: '',
};

function factorial(n: number): number {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    if (n > 170) return Infinity;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function formatNumber(num: number): string {
    if (isNaN(num)) return 'Hata';
    if (!isFinite(num)) return '∞';

    const str = num.toString();
    if (str.length <= 12) return str;

    // Use scientific notation for very large/small numbers
    if (Math.abs(num) >= 1e12 || (Math.abs(num) < 1e-6 && num !== 0)) {
        return num.toExponential(6);
    }

    // Round to fit display
    const intPart = Math.floor(Math.abs(num)).toString().length;
    const decimals = Math.max(0, 10 - intPart);
    return parseFloat(num.toFixed(decimals)).toString();
}

function calculate(a: number, b: number, op: Operation): number {
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '×': return a * b;
        case '÷': return b === 0 ? NaN : a / b;
        default: return b;
    }
}

export function useCalculator() {
    const [state, setState] = useState<CalculatorState>(initialState);

    const inputDigit = useCallback((digit: string) => {
        setState((prev) => {
            if (prev.waitingForOperand) {
                return {
                    ...prev,
                    displayValue: digit,
                    waitingForOperand: false,
                };
            }
            const newValue = prev.displayValue === '0' ? digit : prev.displayValue + digit;
            if (newValue.replace(/[^0-9]/g, '').length > 12) return prev;
            return {
                ...prev,
                displayValue: newValue,
            };
        });
    }, []);

    const inputDecimal = useCallback(() => {
        setState((prev) => {
            if (prev.waitingForOperand) {
                return {
                    ...prev,
                    displayValue: '0.',
                    waitingForOperand: false,
                };
            }
            if (prev.displayValue.includes('.')) return prev;
            return {
                ...prev,
                displayValue: prev.displayValue + '.',
            };
        });
    }, []);

    const clearAll = useCallback(() => {
        setState(initialState);
    }, []);

    const toggleSign = useCallback(() => {
        setState((prev) => {
            const value = parseFloat(prev.displayValue);
            if (value === 0) return prev;
            return {
                ...prev,
                displayValue: formatNumber(-value),
            };
        });
    }, []);

    const inputPercent = useCallback(() => {
        setState((prev) => {
            const value = parseFloat(prev.displayValue);
            return {
                ...prev,
                displayValue: formatNumber(value / 100),
            };
        });
    }, []);

    const performOperation = useCallback((nextOp: Operation) => {
        setState((prev) => {
            const inputValue = parseFloat(prev.displayValue);

            if (prev.previousValue === null) {
                return {
                    ...prev,
                    previousValue: prev.displayValue,
                    operation: nextOp,
                    waitingForOperand: true,
                    expression: `${prev.displayValue} ${nextOp} `,
                };
            }

            if (prev.waitingForOperand) {
                return {
                    ...prev,
                    operation: nextOp,
                    expression: `${prev.previousValue} ${nextOp} `,
                };
            }

            const prevValue = parseFloat(prev.previousValue);
            const result = calculate(prevValue, inputValue, prev.operation);
            const resultStr = formatNumber(result);

            return {
                displayValue: resultStr,
                previousValue: resultStr,
                operation: nextOp,
                waitingForOperand: true,
                expression: `${resultStr} ${nextOp} `,
            };
        });
    }, []);

    const performEquals = useCallback(() => {
        setState((prev) => {
            if (prev.previousValue === null || prev.operation === null) return prev;

            const prevValue = parseFloat(prev.previousValue);
            const inputValue = parseFloat(prev.displayValue);
            const result = calculate(prevValue, inputValue, prev.operation);
            const resultStr = formatNumber(result);

            return {
                displayValue: resultStr,
                previousValue: null,
                operation: null,
                waitingForOperand: true,
                expression: '',
            };
        });
    }, []);

    // Advanced operations
    const performUnaryOperation = useCallback((opName: string) => {
        setState((prev) => {
            const value = parseFloat(prev.displayValue);
            let result: number;

            switch (opName) {
                case 'sin':
                    result = Math.sin((value * Math.PI) / 180);
                    break;
                case 'cos':
                    result = Math.cos((value * Math.PI) / 180);
                    break;
                case 'tan':
                    result = Math.tan((value * Math.PI) / 180);
                    break;
                case '√':
                    result = Math.sqrt(value);
                    break;
                case 'x²':
                    result = value * value;
                    break;
                case 'x³':
                    result = value * value * value;
                    break;
                case 'x!':
                    result = factorial(Math.floor(value));
                    break;
                case 'ln':
                    result = Math.log(value);
                    break;
                case 'log':
                    result = Math.log10(value);
                    break;
                case '1/x':
                    result = value === 0 ? NaN : 1 / value;
                    break;
                case 'eˣ':
                    result = Math.exp(value);
                    break;
                case '10ˣ':
                    result = Math.pow(10, value);
                    break;
                default:
                    result = value;
            }

            return {
                ...prev,
                displayValue: formatNumber(result),
                waitingForOperand: true,
            };
        });
    }, []);

    const insertConstant = useCallback((constant: string) => {
        setState((prev) => {
            let value: number;
            switch (constant) {
                case 'π':
                    value = Math.PI;
                    break;
                case 'e':
                    value = Math.E;
                    break;
                default:
                    value = 0;
            }
            return {
                ...prev,
                displayValue: formatNumber(value),
                waitingForOperand: true,
            };
        });
    }, []);

    const performPower = useCallback(() => {
        performOperation('×'); // We'll handle xʸ by chaining
        setState((prev) => ({
            ...prev,
            expression: `${prev.previousValue} ^ `,
        }));
    }, [performOperation]);

    return {
        displayValue: state.displayValue,
        expression: state.expression,
        inputDigit,
        inputDecimal,
        clearAll,
        toggleSign,
        inputPercent,
        performOperation,
        performEquals,
        performUnaryOperation,
        insertConstant,
        performPower,
    };
}
