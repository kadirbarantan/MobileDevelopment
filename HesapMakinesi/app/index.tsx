import { useCalculator } from '@/hooks/useCalculator';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Dimensions,
    LayoutAnimation,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Colors - basic and clean
const COLORS = {
    background: '#F2F2F7',
    display: '#FFFFFF',
    displayText: '#1C1C1E',
    expressionText: '#8E8E93',
    numberBtn: '#FFFFFF',
    numberBtnText: '#1C1C1E',
    operatorBtn: '#FF9500',
    operatorBtnText: '#FFFFFF',
    functionBtn: '#E5E5EA',
    functionBtnText: '#1C1C1E',
    advancedBtn: '#D1D1D6',
    advancedBtnText: '#1C1C1E',
    equalBtn: '#FF9500',
    shadow: '#00000015',
    border: '#C7C7CC',
};

type ButtonConfig = {
    label: string;
    type: 'number' | 'operator' | 'function' | 'equal' | 'zero' | 'advanced' | 'toggle';
    action: () => void;
};

export default function CalculatorScreen() {
    const calc = useCalculator();
    const [showAdvanced, setShowAdvanced] = useState(false);

    const toggleAdvanced = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setShowAdvanced(!showAdvanced);
    };

    const advancedButtons: ButtonConfig[][] = [
        [
            { label: 'sin', type: 'advanced', action: () => calc.performUnaryOperation('sin') },
            { label: 'cos', type: 'advanced', action: () => calc.performUnaryOperation('cos') },
            { label: 'tan', type: 'advanced', action: () => calc.performUnaryOperation('tan') },
            { label: 'π', type: 'advanced', action: () => calc.insertConstant('π') },
        ],
        [
            { label: '√', type: 'advanced', action: () => calc.performUnaryOperation('√') },
            { label: 'x²', type: 'advanced', action: () => calc.performUnaryOperation('x²') },
            { label: 'x³', type: 'advanced', action: () => calc.performUnaryOperation('x³') },
            { label: 'e', type: 'advanced', action: () => calc.insertConstant('e') },
        ],
        [
            { label: 'ln', type: 'advanced', action: () => calc.performUnaryOperation('ln') },
            { label: 'log', type: 'advanced', action: () => calc.performUnaryOperation('log') },
            { label: 'x!', type: 'advanced', action: () => calc.performUnaryOperation('x!') },
            { label: '1/x', type: 'advanced', action: () => calc.performUnaryOperation('1/x') },
        ],
        [
            { label: 'eˣ', type: 'advanced', action: () => calc.performUnaryOperation('eˣ') },
            { label: '10ˣ', type: 'advanced', action: () => calc.performUnaryOperation('10ˣ') },
            { label: '', type: 'advanced', action: () => { } },
            { label: '', type: 'advanced', action: () => { } },
        ],
    ];

    const mainButtons: ButtonConfig[][] = [
        [
            { label: 'C', type: 'function', action: calc.clearAll },
            { label: '±', type: 'function', action: calc.toggleSign },
            { label: '%', type: 'function', action: calc.inputPercent },
            { label: '÷', type: 'operator', action: () => calc.performOperation('÷') },
        ],
        [
            { label: '7', type: 'number', action: () => calc.inputDigit('7') },
            { label: '8', type: 'number', action: () => calc.inputDigit('8') },
            { label: '9', type: 'number', action: () => calc.inputDigit('9') },
            { label: '×', type: 'operator', action: () => calc.performOperation('×') },
        ],
        [
            { label: '4', type: 'number', action: () => calc.inputDigit('4') },
            { label: '5', type: 'number', action: () => calc.inputDigit('5') },
            { label: '6', type: 'number', action: () => calc.inputDigit('6') },
            { label: '-', type: 'operator', action: () => calc.performOperation('-') },
        ],
        [
            { label: '1', type: 'number', action: () => calc.inputDigit('1') },
            { label: '2', type: 'number', action: () => calc.inputDigit('2') },
            { label: '3', type: 'number', action: () => calc.inputDigit('3') },
            { label: '+', type: 'operator', action: () => calc.performOperation('+') },
        ],
        [
            { label: '⟨', type: 'toggle', action: toggleAdvanced },
            { label: '0', type: 'zero', action: () => calc.inputDigit('0') },
            { label: '.', type: 'number', action: calc.inputDecimal },
            { label: '=', type: 'equal', action: calc.performEquals },
        ],
    ];

    const getButtonStyle = (type: string) => {
        switch (type) {
            case 'operator':
                return styles.operatorBtn;
            case 'function':
                return styles.functionBtn;
            case 'equal':
                return styles.equalBtn;
            case 'zero':
                return styles.zeroBtn;
            case 'advanced':
                return styles.advancedBtn;
            case 'toggle':
                return styles.toggleBtn;
            default:
                return styles.numberBtn;
        }
    };

    const getTextStyle = (type: string) => {
        switch (type) {
            case 'operator':
            case 'equal':
                return styles.operatorBtnText;
            case 'function':
                return styles.functionBtnText;
            case 'advanced':
                return styles.advancedBtnText;
            case 'toggle':
                return styles.toggleBtnText;
            default:
                return styles.numberBtnText;
        }
    };

    // Dynamic font size based on display value length
    const displayFontSize = calc.displayValue.length > 9
        ? calc.displayValue.length > 12
            ? 32
            : 40
        : 56;

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* Display */}
            <View style={styles.displayContainer}>
                <Text style={styles.expression} numberOfLines={1}>
                    {calc.expression}
                </Text>
                <Text
                    style={[styles.displayText, { fontSize: displayFontSize }]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                >
                    {calc.displayValue}
                </Text>
            </View>

            {/* Advanced Panel */}
            {showAdvanced && (
                <View style={styles.advancedPanel}>
                    <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
                        {advancedButtons.map((row, rowIndex) => (
                            <View key={`adv-row-${rowIndex}`} style={styles.row}>
                                {row.map((btn, btnIndex) => {
                                    if (!btn.label) {
                                        return <View key={`adv-empty-${btnIndex}`} style={[styles.button, styles.advancedBtn, { opacity: 0 }]} />;
                                    }
                                    return (
                                        <TouchableOpacity
                                            key={`adv-${btn.label}-${btnIndex}`}
                                            style={[styles.button, styles.advancedBtn]}
                                            onPress={btn.action}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={styles.advancedBtnText}>{btn.label}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Main Buttons */}
            <View style={styles.buttonsContainer}>
                {mainButtons.map((row, rowIndex) => (
                    <View key={`row-${rowIndex}`} style={styles.row}>
                        {row.map((btn, btnIndex) => (
                            <TouchableOpacity
                                key={`${btn.label}-${btnIndex}`}
                                style={[
                                    styles.button,
                                    getButtonStyle(btn.type),
                                    btn.type === 'toggle' && showAdvanced && styles.toggleBtnActive,
                                ]}
                                onPress={btn.action}
                                activeOpacity={0.7}
                            >
                                <Text
                                    style={[
                                        getTextStyle(btn.type),
                                        btn.type === 'toggle' && showAdvanced && styles.toggleBtnTextActive,
                                    ]}
                                >
                                    {btn.type === 'toggle' ? (showAdvanced ? '⟩' : '⟨') : btn.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </View>
        </View>
    );
}

const BUTTON_GAP = 10;
const BUTTONS_PER_ROW = 4;
const BUTTON_SIZE = (SCREEN_WIDTH - 40 - BUTTON_GAP * (BUTTONS_PER_ROW - 1)) / BUTTONS_PER_ROW;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'flex-end',
        paddingBottom: 30,
    },
    displayContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingHorizontal: 24,
        paddingBottom: 16,
        backgroundColor: COLORS.display,
        marginHorizontal: 16,
        marginTop: 60,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    expression: {
        fontSize: 20,
        color: COLORS.expressionText,
        marginBottom: 4,
        fontWeight: '400',
    },
    displayText: {
        color: COLORS.displayText,
        fontWeight: '300',
        letterSpacing: -1,
    },
    advancedPanel: {
        marginHorizontal: 16,
        marginTop: 8,
        paddingVertical: 8,
        paddingHorizontal: 4,
        backgroundColor: COLORS.display,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
        maxHeight: 220,
    },
    buttonsContainer: {
        paddingHorizontal: 16,
        paddingTop: 12,
        gap: BUTTON_GAP,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: BUTTON_GAP,
    },
    button: {
        width: BUTTON_SIZE,
        height: BUTTON_SIZE * 0.75,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    numberBtn: {
        backgroundColor: COLORS.numberBtn,
    },
    numberBtnText: {
        fontSize: 26,
        fontWeight: '500',
        color: COLORS.numberBtnText,
    },
    operatorBtn: {
        backgroundColor: COLORS.operatorBtn,
    },
    operatorBtnText: {
        fontSize: 28,
        fontWeight: '500',
        color: COLORS.operatorBtnText,
    },
    functionBtn: {
        backgroundColor: COLORS.functionBtn,
    },
    functionBtnText: {
        fontSize: 20,
        fontWeight: '500',
        color: COLORS.functionBtnText,
    },
    equalBtn: {
        backgroundColor: COLORS.equalBtn,
    },
    zeroBtn: {
        backgroundColor: COLORS.numberBtn,
    },
    advancedBtn: {
        backgroundColor: COLORS.advancedBtn,
        height: BUTTON_SIZE * 0.6,
    },
    advancedBtnText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.advancedBtnText,
    },
    toggleBtn: {
        backgroundColor: COLORS.functionBtn,
    },
    toggleBtnText: {
        fontSize: 24,
        fontWeight: '600',
        color: COLORS.functionBtnText,
    },
    toggleBtnActive: {
        backgroundColor: COLORS.operatorBtn,
    },
    toggleBtnTextActive: {
        color: COLORS.operatorBtnText,
    },
});
