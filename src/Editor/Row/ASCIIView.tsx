import React from "react";
import {Text} from "ink";

interface Props {
    bytes: number[];
}

const validASCIICodeRange = [0x20, 0x7e];

export const ASCIIView = ({bytes}: Props) => {
    return (
        <React.Fragment>
            <Text>|</Text>
            {bytes.map((byte, idx) => {
                const char = byte >= validASCIICodeRange[0] && byte <= validASCIICodeRange[1] ? String.fromCharCode(byte) : ".";
                return <Text key={idx}>{char}</Text>;
            })}
            <Text>|</Text>
        </React.Fragment>
    );
};
