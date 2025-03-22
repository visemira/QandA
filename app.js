document.addEventListener("DOMContentLoaded", () => {
    const questionInput = document.getElementById("questionInput");
    const autocompleteSuggestions = document.getElementById("autocomplete-suggestions");
    const answerDisplay = document.getElementById("answer");
    const languageSelector = document.getElementById("language");
    const languageLabel = document.getElementById("languageLabel");
    const questionTitle = document.getElementById("questionTitle");
    const loadImagesButton = document.getElementById("loadImagesButton");
    const imagesDisplay = document.getElementById("imagesDisplay");
    const loadingSpinner = document.getElementById("loadingSpinner");

    const baseUrl = "https://raw.githubusercontent.com/visemira/QandA/refs/heads/main";
    const translations = {
        en: {
            languageLabel: "Select language:",
            questionTitle: "Question and Answer",
            placeholder: "Enter keywords...",
            noAnswerText: "No answer found. Try typing a different question."
        },
        // Add other languages here...
    };

    let allQuestions = [];

    function showLoadingSpinner(show = true) {
        loadingSpinner.classList.toggle("show", show);
    }

    function loadQuestions(language) {
        const fileName = `data/questions_${language}.json`;
        showLoadingSpinner(true);

        fetch(fileName)
            .then(response => response.json())
            .then(questions => {
                allQuestions = questions;
                const fuse = new Fuse(questions, {
                    keys: ["question"],
                    threshold: 0.4,
                    distance: 100,
                    tokenize: true,
                    findAllMatches: true,
                    ignoreLocation: true,
                    minMatchCharLength: 2
                });

                let timeoutId;
                questionInput.addEventListener("input", () => {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => {
                        const query = questionInput.value.trim();
                        if (query === "") {
                            autocompleteSuggestions.style.display = 'none';
                            return;
                        }

                        const result = fuse.search(query);
                        if (result.length > 0) {
                            autocompleteSuggestions.innerHTML = result
                                .map(resultItem => `<div class="autocomplete-suggestion">${resultItem.item.question}</div>`)
                                .join("");
                            autocompleteSuggestions.style.display = 'block';

                            // Handle suggestion click
                            const suggestionItems = autocompleteSuggestions.querySelectorAll('.autocomplete-suggestion');
                            suggestionItems.forEach(item => {
                                item.addEventListener("click", () => {
                                    questionInput.value = item.textContent;
                                    autocompleteSuggestions.style.display = 'none';
                                    displayAnswer(item.textContent);
                                });
                            });
                        } else {
                            autocompleteSuggestions.style.display = 'none';
                        }
                    }, 300);
                });
                showLoadingSpinner(false);
            })
            .catch(error => {
                console.error('Error loading questions:', error);
                answerDisplay.textContent = translations[language].noAnswerText;
                answerDisplay.classList.add('text-red-500');
                showLoadingSpinner(false);
            });
    }

    function displayAnswer(question) {
        const questionData = allQuestions.find(q => q.question === question);
        if (questionData) {
            answerDisplay.innerHTML = questionData.answer
                .map(answer => {
                    if (isImageUrl(answer)) {
                        const imageUrl = isRelativeUrl(answer) ? baseUrl + answer : answer;
                        return `<div class="bg-green-200 p-2 rounded shadow-sm">
                                    <img src="${imageUrl}" alt="Answer Image" class="max-w-full h-auto rounded">
                                </div>`;
                    } else {
                        return `<div class="bg-green-200 p-2 rounded text-black shadow-sm">${answer}</div>`;
                    }
                })
                .join("");
        } else {
            answerDisplay.textContent = translations[language].noAnswerText;
        }
    }

    function isImageUrl(url) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
        return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
    }

    function isRelativeUrl(url) {
        return !url.startsWith("http://") && !url.startsWith("https://");
    }

    function updateUI(language) {
        languageLabel.textContent = translations[language].languageLabel;
        questionTitle.textContent = translations[language].questionTitle;
        questionInput.placeholder = translations[language].placeholder;
    }

    function loadImages(language) {
        const fileName = `data/images_${language}.json`;
        showLoadingSpinner(true);

        fetch(fileName)
            .then(response => response.json())
            .then(images => {
                imagesDisplay.innerHTML = "";
                images.forEach(image => {
                    const imageUrl = image.question.startsWith("/") ? baseUrl + image.question : image.question;
                    const answers = image.answer.join(", ");
                    imagesDisplay.innerHTML += `
                        <div class="flex flex-col justify-between items-center overflow-hidden bg-white rounded-lg bg-gray-300 border-2 border-black shadow-lg">
                            <img src="${imageUrl}" alt="Image" class="mt-1 w-12 rounded-lg">
                            <div class="flex flex-col w-full items-center bg-blue-500">
                                <p class="p-1 text-black text-base font-bold">${answers}</p>
                            </div>
                        </div>
                    `;
                });
                showLoadingSpinner(false);
            })
            .catch(error => {
                console.error('Error loading images:', error);
                imagesDisplay.innerHTML = "<p class='text-red-500'>Failed to load images.</p>";
                showLoadingSpinner(false);
            });
    }

    const savedLanguage = localStorage.getItem("selectedLanguage") || "en";
    languageSelector.value = savedLanguage;
    loadQuestions(savedLanguage);
    updateUI(savedLanguage);
    loadImages(savedLanguage);

    languageSelector.addEventListener("change", (e) => {
        const selectedLanguage = e.target.value;
        loadQuestions(selectedLanguage);
        updateUI(selectedLanguage);
        loadImages(selectedLanguage);
        localStorage.setItem("selectedLanguage", selectedLanguage);
    });
});
