import * as fs from "fs";

class File {
    input(fileName: string): any {
        const rawData = fs.readFileSync(fileName, "utf-8");
        return rawData;
    }

    output(fileName: string, data: any) {
        fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
    }
}

export default File;
