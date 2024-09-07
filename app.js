document.addEventListener("DOMContentLoaded", () => {
  const questionInput = document.getElementById("questionInput");
  const answerDisplay = document.getElementById("answer");

  // Load questions from external JSON file
  fetch('questions.json')
      .then(response => response.json())
      .then(questions => {
          // Initialize Fuse.js for fuzzy searching
          const options = {
              keys: ["question"],
              threshold: 0.4, // Controls the fuzziness; lower values mean stricter matches
              distance: 100,  // Distance allows finding matches despite word order
              tokenize: true, // Enables word tokenization
              findAllMatches: true, // Finds all matches for better results
              ignoreLocation: true, // Ignores location for word matches
              minMatchCharLength: 1 // Minimum length for each match
          };

          const fuse = new Fuse(questions, options);

          // Event listener for user input
          questionInput.addEventListener("input", () => {
              const query = questionInput.value.trim();
              const result = fuse.search(query);

              // Display the first match, if available
              if (result.length > 0) {
                  answerDisplay.textContent = result[0].item.answer[0];
              } else {
                  answerDisplay.textContent = "No answer found. Try typing a different question.";
              }
          });
      })
      .catch(error => console.error('Error loading questions:', error));
});
