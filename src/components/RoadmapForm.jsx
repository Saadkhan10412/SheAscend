import React, { useState } from 'react';

export function RoadmapForm({ onGenerate }) {
    const [formData, setFormData] = useState({
        dreamGoal: '',
        currentSkills: '',
        timeAvailable: '6 months',
        personalityType: 'Learner'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        console.log("Generating Roadmap with data:", formData);
        
        alert("Roadmap requested! The AI is now processing your journey...");
    };

    return (
        <div className="roadmap-form-section">
            <h2 className="text-center" style={{color: 'var(--color-primary)', marginTop: 0}}>
                🎯 1. Generate Your AI Roadmap
            </h2>
            <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', background: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-light)' }}>
                
                <div className="form-group">
                    <label htmlFor="dreamGoal">Your Big Dream Goal (e.g., Become a Data Analyst)</label>
                    <input 
                        type="text" 
                        id="dreamGoal" 
                        name="dreamGoal" 
                        value={formData.dreamGoal}
                        onChange={handleChange}
                        placeholder="e.g., Become a successful Influencer or HR Manager"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="currentSkills">Your Current Skills (What you know/don't know yet)</label>
                    <textarea 
                        id="currentSkills" 
                        name="currentSkills" 
                        rows="3"
                        value={formData.currentSkills}
                        onChange={handleChange}
                        placeholder="e.g., Basic Excel, some public speaking, no coding experience."
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="timeAvailable">Time Commitment Available</label>
                    <select 
                        id="timeAvailable" 
                        name="timeAvailable"
                        value={formData.timeAvailable}
                        onChange={handleChange}
                    >
                        <option value="6 months">6 Months</option>
                        <option value="1 year">1 Year</option>
                        <option value="2 years">2 Years</option>
                        <option value="flexible">Flexible</option>
                    </select>
                </div>
                
                <div className="form-group">
                    <label htmlFor="personalityType">Your Personality Type (For tailored learning)</label>
                    <select 
                        id="personalityType" 
                        name="personalityType"
                        value={formData.personalityType}
                        onChange={handleChange}
                    >
                        <option value="Learner">The Consistent Learner</option>
                        <option value="Explorer">The Quick Explorer</option>
                        <option value="Achiever">The High Achiever (Needs deadlines)</option>
                    </select>
                </div>

                <div className="text-center">
                    <button type="submit" className="start-btn">
                        Generate Personalized Roadmap ✨
                    </button>
                </div>
            </form>
        </div>
    );
}