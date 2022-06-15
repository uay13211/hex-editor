import React from "react";
import {useInput} from "ink";

interface Props {
    buffer: Uint8Array;
    rowOffset: number;
    onSaveFile: (buffer: Uint8Array) => void;
}

export const useEditing = (props: Props) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const {buffer, setBuffer} = useBuffer(props.buffer);
    const {cursor, cursorRowPosition} = useCursor({buffer: props.buffer, rowOffset: props.rowOffset, disableCursorMovement: isEditing});
    const {hexIndex} = useByteEdit({isEditing, setBuffer, cursor});

    useInput((input, key) => {
        if (key.return) {
            setIsEditing(!isEditing);
        }

        if (!isEditing && input === "s") {
            props.onSaveFile(buffer);
        }
    });

    return {
        isEditing,
        hexIndex,
        buffer,
        cursor,
        cursorRowPosition,
    };
};

export const useBuffer = (inputBuffer: Uint8Array) => {
    const [buffer, setBuffer] = React.useState(inputBuffer);

    return {
        buffer,
        setBuffer,
    };
};

interface CursorProps {
    buffer: Uint8Array;
    rowOffset: number;
    disableCursorMovement: boolean;
}

export const useCursor = (props: CursorProps) => {
    const {buffer, rowOffset, disableCursorMovement} = props;
    const [cursor, setCursor] = React.useState(0);

    const onCursorRight = React.useCallback(() => setCursor(cursor => Math.min(cursor + 1, buffer.byteLength)), []);
    const onCursorLeft = React.useCallback(() => setCursor(cursor => Math.max(cursor - 1, 0)), []);
    const onCursorBottom = React.useCallback(() => setCursor(cursor => Math.min(cursor + rowOffset, buffer.byteLength)), []);
    const onCursorTop = React.useCallback(() => setCursor(cursor => Math.max(cursor - rowOffset, 0)), []);

    const maxNumOfRows = React.useMemo(() => Math.ceil(buffer.byteLength / rowOffset), [rowOffset, buffer.byteLength]);

    const cursorRowPosition = React.useMemo(() => {
        return Math.min(Math.max(Math.floor(cursor / rowOffset), 0), maxNumOfRows);
    }, [cursor, rowOffset, maxNumOfRows]);

    useInput((input, key) => {
        if (!disableCursorMovement) {
            if (key.upArrow) {
                onCursorTop();
            } else if (key.downArrow) {
                onCursorBottom();
            } else if (key.rightArrow) {
                onCursorRight();
            } else if (key.leftArrow) {
                onCursorLeft();
            }
        }
    });

    return {
        cursor,
        cursorRowPosition,
    };
};

interface ByteEditProps {
    isEditing: boolean;
    cursor: number;
    setBuffer: React.Dispatch<React.SetStateAction<Uint8Array>>;
}

const validHexValue = /[a-f0-9]/;

export const useByteEdit = ({isEditing, cursor, setBuffer}: ByteEditProps) => {
    const [hexIndex, setHexIndex] = React.useState(0);

    useInput((input, key) => {
        if (key.return) {
            setHexIndex(0);
        }

        if (isEditing && hexIndex === 0 && key.rightArrow) {
            setHexIndex(1);
        }

        if (isEditing && hexIndex === 1 && key.leftArrow) {
            setHexIndex(0);
        }

        if (validHexValue.test(input) && isEditing) {
            setBuffer(buffer => {
                switch (hexIndex) {
                    case 0:
                        buffer[cursor] = (buffer[cursor] & 0x0f) | (parseInt(input, 16) << 4);
                        setHexIndex(1);
                        break;
                    case 1:
                        buffer[cursor] = (buffer[cursor] & 0xf0) | parseInt(input, 16);
                        setHexIndex(0);
                        break;
                }
                return buffer;
            });
        }
    });

    return {
        hexIndex,
    };
};
