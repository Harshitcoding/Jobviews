// app/utils/interviewUtils.js

/**
 * Generate the next interview question based on conversation history
 * 
 * @param {Array} messages - Array of previous messages
 * @param {String} latestAnswer - The user's latest answer
 * @returns {String} - The next question to ask
 */
export async function generateNextQuestion(messages: any[], latestAnswer: any) {
    // Get previous questions to avoid repetition
    const previousQuestions = messages
        .filter(msg => msg.type === 'question')
        .map(msg => msg.content);
    
    // Extract keywords from the answer to inform next question
    const keywords = extractKeywords(latestAnswer);
    
    // In a real app, you could call an AI service here (OpenAI, etc.)
    // For now, we'll use a simple algorithm to pick questions
    
    // Define a bank of follow-up questions for technical interviews
    const questionBank = [
        "What's your approach to debugging complex issues?",
        "Can you describe a challenging project you worked on and how you overcame obstacles?",
        "How do you stay updated with the latest technologies in your field?",
        "What's your experience working with databases?",
        "Tell me about your experience with frontend frameworks.",
        "How do you handle code reviews and feedback?",
        "Can you explain your process for testing your code?",
        "What version control systems are you familiar with?",
        "How do you approach optimizing application performance?",
        "Tell me about a time you had to learn a new technology quickly."
    ];
    
    // Logic to determine next question based on context
    // In a real app, this would be much more sophisticated
    
    // Check if we've asked all questions already
    const remainingQuestions = questionBank.filter(q => !previousQuestions.includes(q));
    
    if (remainingQuestions.length === 0) {
        return "Thank you for your detailed responses. Do you have any questions for me about the role or the company?";
    }
    
    // Basic logic: If answer mentions specific technologies, ask about that
    if (keywords.includes("react") || keywords.includes("frontend")) {
        const reactQuestion = "Could you elaborate on your experience with React or other frontend frameworks?";
        if (!previousQuestions.includes(reactQuestion)) return reactQuestion;
    }
    
    if (keywords.includes("database") || keywords.includes("sql") || keywords.includes("nosql")) {
        const dbQuestion = "Could you describe your experience with database design and optimization?";
        if (!previousQuestions.includes(dbQuestion)) return dbQuestion;
    }
    
    if (keywords.includes("test") || keywords.includes("testing") || keywords.includes("quality")) {
        const testingQuestion = "How do you ensure the quality and reliability of your code?";
        if (!previousQuestions.includes(testingQuestion)) return testingQuestion;
    }
    
    // If no keyword matches or already asked those questions, pick a random question
    const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
    return remainingQuestions[randomIndex];
}

/**
 * Extract keywords from an answer to inform follow-up questions
 * 
 * @param {String} answer - The user's answer text
 * @returns {Array} - Array of keywords
 */
function extractKeywords(answer: string) {
    const text = answer.toLowerCase();
    
    // Simple keyword extraction - in a real app, this could use NLP
    const keywords = [
        "javascript", "react", "angular", "vue", "node", "express", 
        "python", "java", "c#", "go", "ruby", "php",
        "frontend", "backend", "fullstack", "database", "sql", "nosql",
        "testing", "devops", "agile", "scrum", "aws", "azure", "cloud",
        "architecture", "design", "mobile", "web", "api"
    ];
    
    return keywords.filter(keyword => text.includes(keyword));
}