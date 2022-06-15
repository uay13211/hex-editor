import React from "react";
import {Text} from "ink";
import {HexFormat} from "../../utils";

interface Props {
    byteOffset: number;
}

export const ByteOffsetView = ({byteOffset}: Props) => {
    return <Text>{HexFormat(byteOffset, 8)} </Text>;
};
