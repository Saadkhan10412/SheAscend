# 🌸 SheAscend  
Empowering Women Through AI-Driven Career Guidance

SheAscend is an **AI-powered career and confidence platform** designed to help girls and women pursue education, develop skills, and build meaningful careers.  
In many communities, cultural expectations limit ambition — SheAscend breaks these barriers through **personalized roadmaps, daily learning tasks, and an AI voice mentor** that supports users anytime through webhook-driven automation.

---

## 🚀 Features

- **🎯 AI-Generated Career Roadmaps**  
  Personalized learning paths tailored to each user's goals.

- **🗓️ Daily & Weekly Task Engine**  
  n8n workflows expand weekly tasks into structured **7-day daily plans**.

- **🎙️ AI Voice Mentor (Vapi Webhooks)**  
  A supportive voice agent that conducts assessments, reminders, and motivational calls.

- **🧠 Skill Assessments**  
  Voice-based question sessions to boost communication & confidence.

- **✨ Future-Self Motivation**  
  Encouraging, emotional guidance from the “future you.”

- **🌸 Women-Centric UI**  
  Soft, accessible, and uplifting user experience.

---

## 🛠️ Tech Stack

### **Frontend**
- React.js  
- TailwindCSS  
- Vite  

### **Backend & Services**
- Appwrite (Auth, Database, Functions)

### **Automation**
- n8n Workflows  
  - Weekly → Daily task generator  
  - Roadmap builder  
  - Task writing pipelines  
  - Vapi outbound call triggers  

### **AI & Voice Agent**
- Vapi.ai  
  - No API keys needed  
  - Entire communication handled via webhooks  

### **Deployment**
- Appwrite Cloud  

---

## 📁 Project Structure<br>
<br>
SheAscend/<br>
├── .git/<br>
├── dist/                    # Production build<br>
├── node_modules/<br>
├── public/                  # Static assets<br>
├── src/                     # Frontend source<br>
│   ├── components/<br>
│   ├── context/<br>
│   ├── pages/<br>
│   ├── services/<br>
│   └── assets/<br>
├── .env<br>
├── .gitignore<br>
├── appwrite.config<br>
├── eslint.config.js<br>
├── index.html<br>
├── package.json<br>
├── postcss.config.js<br>
├── tailwind.config.js<br>
├── vite.config.js<br>
└── She Ascend Workflows/    # n8n automation<br>

## 👩‍💻 Team SheAscend

**Team Name:** SheAscenders  

**Members:**  
- Saad Khan — AI Workflow Architect , AI Agent & Voice Agent 
- Swati Singh —  Frontend Lead     
- Ambuj Pandey —  Backend & Data Base lead   
---

## 🔧 How the System Works

1. Users choose a career goal.  
2. Appwrite stores user info and triggers n8n.  
3. n8n generates a weekly roadmap → expands into 7 daily tasks.  
4. Appwrite saves all tasks.  
5. Vapi connects via inbound/outbound webhooks to deliver:  
   - Voice coaching  
   - Skill assessments  
   - Motivational messages  
6. Users follow tasks daily and track their progress.

---

## 🔐 Environment Variables

Only Appwrite + Gemini keys are needed:

VITE_APPWRITE_ENDPOINT=
VITE_APPWRITE_PROJECT_ID=
VITE_APPWRITE_DATABASE_ID=
VITE_APPWRITE_COLLECTION_ID=
VITE_APPWRITE_API_KEY=
VITE_GEMINI_API_KEY=


---

## 📜 License  
This project is licensed under the **MIT License**.

---

## 🤍 Vision  
To empower every woman with the **clarity, confidence, and support** needed to rise beyond limitations and create the future she deserves.

**SheAscend — Rise with Confidence.**
