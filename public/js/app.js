const $ = (id) => document.getElementById(id);

const translations = {
  ar: {
    welcome: "مرحباً، أنا HEMA",
    description: "كيانك الرقمي للتواصل والمعرفة والحوار.",
    start: "ابدأ المحادثة",
    placeholder: "اكتب رسالتك هنا...",
    greeting: "أهلاً عمي! يسعدني التحدث معك.",
    language: "English",
    reply: "وصلتني رسالتك يا عمي. أنا HEMA، وما زلنا في مرحلة بناء قدراتي.",
    voiceError: "التعرف على الصوت غير مدعوم في هذا المتصفح."
  },
  en: {
    welcome: "Hello, I'm HEMA",
    description: "Your digital entity for communication, knowledge and dialogue.",
    start: "Start Conversation",
    placeholder: "Write your message here...",
    greeting: "Welcome! I'm glad to talk with you.",
    language: "العربية",
    reply: "I received your message. I'm HEMA, and my capabilities are still being developed.",
    voiceError: "Speech recognition is not supported by this browser."
  }
};

let currentLanguage = localStorage.getItem("hema-language") || "ar";

function updateLanguage() {
  const t = translations[currentLanguage];

  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";

  $("welcomeTitle").textContent = t.welcome;
  $("welcomeText").textContent = t.description;
  $("openChat").textContent = t.start;
  $("messageInput").placeholder = t.placeholder;
  $("languageBtn").textContent = t.language;
  $("firstMessage").textContent = t.greeting;
  $("floatingAvatar").title = "HEMA";

  localStorage.setItem("hema-language", currentLanguage);
}

$("languageBtn").addEventListener("click", () => {
  currentLanguage = currentLanguage === "ar" ? "en" : "ar";
  updateLanguage();
});

function openChat() {
  $("chatPanel").classList.remove("hidden");
  $("messageInput").focus();
}

function closeChat() {
  $("chatPanel").classList.add("hidden");
}

$("openChat").addEventListener("click", openChat);
$("floatingAvatar").addEventListener("click", openChat);
$("closeChat").addEventListener("click", closeChat);

$("chatForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const input = $("messageInput");
  const message = input.value.trim();

  if (!message) return;

  addMessage(message, "user-message");
  input.value = "";

  setTimeout(() => {
    addMessage(
      translations[currentLanguage].reply,
      "entity-message"
    );
  }, 500);
});

function addMessage(text, className) {
  const message = document.createElement("div");

  message.className = `message ${className}`;
  message.textContent = text;

  $("messages").appendChild(message);
  $("messages").scrollTop = $("messages").scrollHeight;
}

// Speech-to-text
$("micBtn").addEventListener("click", () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert(translations[currentLanguage].voiceError);
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = currentLanguage === "ar" ? "ar-SA" : "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    $("messageInput").value = event.results[0][0].transcript;
    $("messageInput").focus();
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };

  recognition.start();
});

updateLanguage();
console.log("HEMA interface initialized successfully.");
