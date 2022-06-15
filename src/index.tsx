import React from "react";
import fs from "fs";
import path from "path";

import {Editor} from "./Editor";
import {render} from "ink";

const args = process.argv;
if (args.length < 3) {
    throw new Error("Usage:bewitched <input file>");
}
const inputFile = path.join(process.cwd(), args[2]);

const fileBuffer = new Uint8Array(fs.readFileSync(inputFile).buffer);

const onSaveFile = (buffer: Uint8Array) => {
    fs.writeFileSync(inputFile, buffer, {encoding: "utf8", flag: "w"});
    process.exit(0);
};

render(<Editor buffer={fileBuffer} onSaveFile={onSaveFile} />);
