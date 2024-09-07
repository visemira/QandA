const fs = require('fs');

// Function to convert file content to JSON
function convertFileContentToJSON(fileContent) {
  // Split the file content into lines
  const lines = fileContent.split('\n');

  // Process each line and convert it to a JSON object
  const result = lines.map(line => {
    // Split each line into question and answers using '?'
    const [questionPart, answerPart] = line.split('?');

    if (!questionPart || !answerPart) {
      return null; // Skip invalid lines
    }

    // Trim the question part and add the question mark back
    const question = questionPart.trim() + '?';

    // Split the answer part by commas, trim each answer, and form an array
    const answers = answerPart.split(',').map(answer => answer.trim());

    // Return the JSON object
    return {
      question: question,
      answer: answers
    };
  }).filter(item => item !== null); // Filter out any null values from invalid lines

  return result;
}

// Read the input file (replace 'input.txt' with your actual file name)
const inputFile = 'input.txt';
const fileContent = fs.readFileSync(inputFile, 'utf8');

// Convert the file content to JSON
const jsonResult = convertFileContentToJSON(fileContent);

// Convert the result to a JSON string with indentation for better readability
const jsonString = JSON.stringify(jsonResult, null, 2);

// Save the JSON result to a file (replace 'output.json' with your desired output file name)
const outputFile = 'output.json';
fs.writeFileSync(outputFile, jsonString, 'utf8');

console.log(`JSON data has been saved to ${outputFile}`);
