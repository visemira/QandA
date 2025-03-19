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

    // Load default language questions (e.g., English)
    const savedLanguage = localStorage.getItem("selectedLanguage") || "en"; // Default to "en" if not saved
    languageSelector.value = savedLanguage;
    loadQuestions(savedLanguage);
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

    // Load images when the button is clicked
    loadImagesButton.addEventListener("click", () => {
        const selectedLanguage = languageSelector.value;
        loadImages(selectedLanguage);
    });
});
