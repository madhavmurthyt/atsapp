const { GoogleGenerativeAI } = require("@google/generative-ai");
const apiKey = require("./../../config.js").apiKey; // Import specific key
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});


const compareJobDescriptionAndResume = async (jobDescription, resume) => {
  try {
    console.log('Calculating prompt...');

  // Construct a prompt for Gemini to compare the job description and resume
  const prompt = `Hey Act Like a skilled or very experience ATS(Application Tracking System)
with a deep understanding of Software Development, Engineering leadership & Problem Solving, Engineering Practices and enterprise product development. Your task is to evaluate the resume based on the given Job description.
You must consider the job market is very competitive and you should provide 
best assistance for improving the resumes. Assign the percentage Matching based 
on Jd and the missing keywords with high accuracy

Please provide the response in a valid JSON format, following this structure:**
    {
    "JDMatch": "<percentage>",
    "MissingKeywords": ["keyword1", "keyword2", ...],
    "ProfileSummary": "<summary>"
    }
    
    
Resume:
${resume}

Job Description:
${jobDescription}


`;


  const result = await model.generateContent(prompt);
  console.log("result "+JSON.stringify(result));
  const suitabilityScore = result.response; // result.response ;
  return suitabilityScore;

} catch (error) {
  console.error(error);
}
};

module.exports = { compareJobDescriptionAndResume };