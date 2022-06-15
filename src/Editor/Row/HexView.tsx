import React from "react";
import {Text} from "ink";
import {HexFormat} from "../../utils";

interface Props {
    byte: number;
    isEditing: boolean;
    hexIndex: number;
    isSelected: boolean;
}

export const HexView = ({byte, isSelected, hexIndex, isEditing}: Props) => {
    const hexFormateValue = HexFormat(byte, 2);

    return (
        <React.Fragment>
            {hexFormateValue.split("").map((char, idx) => {
                const isHighlighted = isSelected && ((isEditing && idx === hexIndex) || !isEditing);
                return (
                    <Text key={idx} backgroundColor={isHighlighted ? "white" : undefined} color={isHighlighted ? "black" : undefined}>
                        {char}
                    </Text>
                );
            })}
            <Text> </Text>
        </React.Fragment>
    );
};
