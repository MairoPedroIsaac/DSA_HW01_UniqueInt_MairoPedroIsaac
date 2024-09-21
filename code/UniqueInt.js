const fs = require('fs');

class UniqueIntegerCollector {
    constructor(trimFunc, sortFunc) {
        this.trimFunc = trimFunc;
        this.sortFunc = sortFunc;
    }

    extractUniqueIntegers(lines) {
        const integersSet = new Set();

        lines.forEach(line => {
            const cleanedLine = this.trimFunc(line);
            const num = Number(cleanedLine);

            // Add valid numbers to the set
            if (!isNaN(num)) {
                integersSet.add(num);
            }
        });

        return this.sortFunc([...integersSet]);
    }

    writeOutputFile(outputFile, uniqueIntegers) {
        fs.writeFile(outputFile, uniqueIntegers.join('\n'), (writeError) => {
            if (writeError) {
                console.error(`Error writing to the output file: ${outputFile}`);
            } else {
                console.log(`Results written to ${outputFile}`);
            }
        });
    }

    processLines(lines, inputFile) {
        const uniqueIntegers = this.extractUniqueIntegers(lines);
        const outputFile = `${inputFile.slice(0, -3)}results.txt`;
        this.writeOutputFile(outputFile, uniqueIntegers);
    }

    processFile(inputFile) {
        fs.readFile(inputFile, 'utf8', (error, content) => {
            if (error) {
                console.error(`Error: Unable to locate the file: ${inputFile}`);
                return;
            }

            const linesArray = content.split('\n');
            this.processLines(linesArray, inputFile);
        });
    }
}

const init = () => {
    const inputFilename = process.argv[2];

    if (!inputFilename) {
        console.error("Error: No filename provided.");
        console.log("Usage: node UniqueIntegerCollector.js <filename>");
        return;
    }

    const startTime = Date.now();
    
    // Create an instance of UniqueIntegerCollector
    const collector = new UniqueIntegerCollector(
        line => line.trim(),
        nums => nums.sort((a, b) => a - b)
    );

    collector.processFile(inputFilename);

    const endTime = Date.now();
    console.log(`Execution Time: ${(endTime - startTime) / 1000} seconds`);
};

init();
