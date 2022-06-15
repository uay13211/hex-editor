import {exec} from "child_process";
import fs from "fs/promises";
import path from "path";

const builtIndexJS = path.join(__dirname, "../", "dist/index.js");

exec("tsc", async () => {
    const indexJS = await fs.readFile(builtIndexJS, {encoding: "utf-8"});
    const insertedJS = `#!/usr/bin/env node\n${indexJS}`;
    fs.writeFile(builtIndexJS, insertedJS);
});
