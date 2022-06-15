import React from "react";
import {useEditing} from "./hooks";
import {ASCIIView} from "./Row/ASCIIView";
import {ByteOffsetView} from "./Row/ByteOffsetView";
import {HexView} from "./Row/HexView";
import {Box, Text} from "ink";

interface Props {
    buffer: Uint8Array;
    onSaveFile: (buffer: Uint8Array) => void;
}

const ROW_OFFSET = 16;
const MAX_SHOWN_ROWS = 10;

export const Editor = (props: Props) => {
    const [shownRow, setShownRow] = React.useState(0);
    const {buffer, cursor, cursorRowPosition, hexIndex, isEditing} = useEditing({buffer: props.buffer, rowOffset: ROW_OFFSET, onSaveFile: props.onSaveFile});

    React.useEffect(() => {
        if (cursorRowPosition > shownRow + MAX_SHOWN_ROWS - 1) {
            setShownRow(cursorRowPosition - (MAX_SHOWN_ROWS - 1));
        } else if (cursorRowPosition < shownRow) {
            setShownRow(cursorRowPosition);
        }
    }, [cursorRowPosition, shownRow]);

    return (
        <React.Fragment>
            {Array.from({length: MAX_SHOWN_ROWS}).map((_, rowNo) => {
                const byteOffset = (rowNo + shownRow) * 16;
                const bytes = [...buffer].slice((rowNo + shownRow) * 16, (rowNo + shownRow + 1) * 16);
                return (
                    <Box key={rowNo}>
                        <ByteOffsetView byteOffset={byteOffset} />
                        {bytes.slice(0, 8).map((byte, idx) => (
                            <HexView key={idx} byte={byte} isSelected={cursor === byteOffset + idx} hexIndex={hexIndex} isEditing={isEditing} />
                        ))}
                        <Text> </Text>
                        {bytes.slice(8, 16).map((byte, idx) => (
                            <HexView key={idx} byte={byte} isSelected={cursor === byteOffset + idx + 8} hexIndex={hexIndex} isEditing={isEditing} />
                        ))}
                        <ASCIIView bytes={bytes} />
                    </Box>
                );
            })}
        </React.Fragment>
    );
};
