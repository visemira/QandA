document.addEventListener("DOMContentLoaded", () => {
    const questionInput = document.getElementById("questionInput");
    const answerDisplay = document.getElementById("answer");
    const languageSelector = document.getElementById("language");
    const mainTitle = document.getElementById("mainTitle");
    const linkText = document.getElementById("linkText");
    const languageLabel = document.getElementById("languageLabel");
    const questionTitle = document.getElementById("questionTitle");
    const loadImagesButton = document.getElementById("loadImagesButton");
    const imagesDisplay = document.getElementById("imagesDisplay");

    // Base URL for relative image paths
    const baseUrl = "https://raw.githubusercontent.com/visemira/QandA/refs/heads/main";

    // Store translations for each language
    const translations = {
        ru: {
            mainTitle: "Для вопросов по картинкам следуйте этому сайту",
            linkText: 'Link: <a href="https://hero-wars.fandom.com/wiki/Special_Events/Strongford_Quiz">Hero Wars Fandom Strangford Quiz</a>',
            languageLabel: "Выберите язык:",
            questionTitle: "Вопрос и ответ",
            placeholder: "Введите свой вопрос здесь...",
            noAnswerText: "Ответ не найден. Попробуйте ввести другой вопрос."
        },
        en: {
            mainTitle: "For image-based questions, follow this site",
            linkText: 'Link: <a href="https://hero-wars.fandom.com/wiki/Special_Events/Strongford_Quiz">Hero Wars Fandom Strangford Quiz</a>',
            languageLabel: "Select language:",
            questionTitle: "Question and Answer",
            placeholder: "Enter your question here...",
            noAnswerText: "No answer found. Try typing a different question."
        },
        it: {
            mainTitle: "Per domande sulle immagini, segui questo sito",
            linkText: 'Link: <a href="https://hero-wars.fandom.com/wiki/Special_Events/Strongford_Quiz">Hero Wars Fandom Strangford Quiz</a>',
            languageLabel: "Scegli la lingua:",
            questionTitle: "Domanda e risposta",
            placeholder: "Inserisci la tua domanda qui...",
            noAnswerText: "Nessuna risposta trovata. Prova a digitare una domanda diversa."
        },
        zh: {
            mainTitle: "有关图片问题，请访问此网站",
            linkText: 'Link: <a href="https://hero-wars.fandom.com/wiki/Special_Events/Strongford_Quiz">Hero Wars Fandom Strangford Quiz</a>',
            languageLabel: "选择语言:",
            questionTitle: "问题与答案",
            placeholder: "在这里输入您的问题...",
            noAnswerText: "未找到答案。尝试输入不同的问题。"
        }
    };

    // Function to update UI text based on the selected language
    function updateUI(language) {
        mainTitle.innerHTML = translations[language].mainTitle;
        linkText.innerHTML = translations[language].linkText;
        languageLabel.textContent = translations[language].languageLabel;
        questionTitle.textContent = translations[language].questionTitle;
        questionInput.placeholder = translations[language].placeholder;
    }

    // Function to load and display images from the separate JSON file
    function loadImages(language) {
        const fileName = `data/images_${language}.json`; // Path to the language-specific JSON file

        fetch(fileName)
            .then(response => response.json())
            .then(images => {
                imagesDisplay.innerHTML = ""; // Clear previous images

                images.forEach(image => {
                    const imageUrl = image.question.startsWith("/") ? baseUrl + image.question : image.question;
                    const answers = image.answer.join(", ");
                    imagesDisplay.innerHTML += `
                        <div class="bg-white p-4 rounded-lg shadow-md">
                            <img src="${imageUrl}" alt="Image" class="equal-size mb-2">
                            <p class="text-lg">${answers}</p>
                        </div>
                    `;
                });
            })
            .catch(error => {
                console.error('Error loading images:', error);
                imagesDisplay.innerHTML = "<p class='text-red-500'>Failed to load images.</p>";
            });
    }

    // Function to load questions from the selected language JSON file
    function loadQuestions(language) {
        const fileName = `data/questions_${language}.json`; // Path to your language-specific questions JSON file

        fetch(fileName)
            .then(response => response.json())
            .then(questions => {
                // Initialize Fuse.js for fuzzy searching
                const options = {
                    keys: ["question"],
                    threshold: 0.4,
                    distance: 100,
                    tokenize: true,
                    findAllMatches: true,
                    ignoreLocation: true,
                    minMatchCharLength: 2
                };

                const fuse = new Fuse(questions, options);

                // Debounced search input
                let timeoutId;
                questionInput.addEventListener("input", () => {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => {
                        const query = questionInput.value.trim();
                        if (query === "") {
                            answerDisplay.innerHTML = ""; // Clear answer if input is empty
                            return;
                        }

                        const result = fuse.search(query);

                        if (result.length > 0) {
                            // Create answer list with two columns
                            answerDisplay.innerHTML = result[0].item.answer
                                .map(answer => {
                                    if (isImageUrl(answer)) {
                                        const imageUrl = isRelativeUrl(answer) ? baseUrl + answer : answer;
                                        return `<div class="bg-green-200 p-2 rounded shadow-sm">
                                                    <img src="${imageUrl}" alt="Answer Image" class="max-w-full h-auto rounded">
                                                </div>`;
                                    } else {
                                        return `<div class="bg-green-200 p-2 rounded shadow-sm">${answer}</div>`;
                                    }
                                })
                                .join(""); // Create each answer in a box
                        } else {
                            answerDisplay.textContent = translations[language].noAnswerText;
                        }
                    }, 300); // 300ms delay
                });
            })
            .catch(error => {
                console.error('Error loading questions:', error);
                answerDisplay.textContent = translations[language].noAnswerText;
                answerDisplay.classList.add('text-red-500'); // Add a red text color for error
            });
    }

    // Function to check if a URL is an image
    function isImageUrl(url) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
        return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
    }

    // Function to check if a URL is relative
    function isRelativeUrl(url) {
        return !url.startsWith("http://") && !url.startsWith("https://");
    }

    // Function to update UI text based on the selected language
    function updateUI(language) {
        mainTitle.innerHTML = translations[language].mainTitle;
        linkText.innerHTML = translations[language].linkText;
        languageLabel.textContent = translations[language].languageLabel;
        questionTitle.textContent = translations[language].questionTitle;
        questionInput.placeholder = translations[language].placeholder;
    }

    // Toggle the visibility of the images when the button is clicked
    function toggleImagesVisibility() {
        const isImagesVisible = imagesDisplay.style.display !== "none";
        imagesDisplay.style.display = isImagesVisible ? "none" : "block"; // Toggle the display style
    }

    // Load default language questions (e.g., English)
    const savedLanguage = localStorage.getItem("selectedLanguage") || "en"; // Default to "en" if not saved
    languageSelector.value = savedLanguage;
    loadQuestions(savedLanguage); // Now this function is properly defined
    updateUI(savedLanguage);
    loadImages(savedLanguage);

    // Change language based on user selection
    languageSelector.addEventListener("change", (e) => {
        const selectedLanguage = e.target.value;
        loadQuestions(selectedLanguage);
        updateUI(selectedLanguage);
        loadImages(selectedLanguage); // Load the corresponding images for the selected language
        localStorage.setItem("selectedLanguage", selectedLanguage); // Save the selected language
    });

    // When the "Load Images" button is clicked, toggle the image visibility
    loadImagesButton.addEventListener("click", () => {
        toggleImagesVisibility(); // Toggle the visibility of images
    });
});
