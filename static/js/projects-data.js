// Projects Data
const projectsData = [
    {
        id: 1,
        title: "Customer Churn Prediction",
        description: "Machine learning model to predict customer churn using classification algorithms. Achieved 92% accuracy with ensemble methods.",
        category: "ml",
        technologies: ["Python", "Scikit-learn", "Pandas", "XGBoost"],
        image: "",
        github: "https://github.com/rounak161106/customer-churn",
        demo: "https://rounak161106.github.io/customer-churn",
        featured: true
    },
    {
        id: 2,
        title: "Image Classification with CNN",
        description: "Deep learning model using Convolutional Neural Networks for multi-class image classification on custom dataset.",
        category: "dl",
        technologies: ["Python", "TensorFlow", "Keras", "OpenCV"],
        image: "",
        github: "https://github.com/rounak161106/image-classification",
        demo: "",
        featured: true
    },
    {
        id: 3,
        title: "Stock Price Predictor",
        description: "LSTM-based time series forecasting model to predict stock prices with interactive visualization dashboard.",
        category: "dl",
        technologies: ["Python", "PyTorch", "Plotly", "Pandas"],
        image: "",
        github: "https://github.com/rounak161106/stock-predictor",
        demo: "https://rounak161106.github.io/stock-predictor",
        featured: true
    },
    {
        id: 4,
        title: "Sentiment Analysis App",
        description: "Natural Language Processing application for real-time sentiment analysis of text and social media posts.",
        category: "ml",
        technologies: ["Python", "NLTK", "Flask", "React"],
        image: "",
        github: "https://github.com/rounak161106/sentiment-analysis",
        demo: "https://sentiment-analyzer-rp.herokuapp.com",
        featured: false
    },
    {
        id: 5,
        title: "Data Visualization Dashboard",
        description: "Interactive web dashboard for exploring and visualizing complex datasets with multiple chart types.",
        category: "web",
        technologies: ["JavaScript", "D3.js", "React", "Node.js"],
        image: "",
        github: "https://github.com/rounak161106/data-viz-dashboard",
        demo: "https://rounak161106.github.io/data-viz-dashboard",
        featured: false
    },
    {
        id: 6,
        title: "Recommendation System",
        description: "Collaborative filtering based recommendation engine for personalized content suggestions.",
        category: "ml",
        technologies: ["Python", "Surprise", "Pandas", "Flask"],
        image: "",
        github: "https://github.com/rounak161106/recommendation-system",
        demo: "",
        featured: false
    }
];

// Function to render projects
function renderProjects(filter = 'all') {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;
    
    const filteredProjects = filter === 'all' 
        ? projectsData 
        : projectsData.filter(project => project.category === filter);
    
    projectsGrid.innerHTML = filteredProjects.map(project => `
        <div class="project-card" data-category="${project.category}" data-aos="fade-up">
            <div class="project-image">
                ${project.image ? `<img src="${project.image}" alt="${project.title}">` : `
                    <div class="project-placeholder">
                        <i class="fas fa-${project.category === 'ml' ? 'brain' : project.category === 'dl' ? 'network-wired' : 'code'}"></i>
                    </div>
                `}
                <div class="project-overlay">
                    <div class="project-links">
                        ${project.github ? `
                            <a href="${project.github}" target="_blank" class="project-link" title="View Code">
                                <i class="fab fa-github"></i>
                            </a>
                        ` : ''}
                        ${project.demo ? `
                            <a href="${project.demo}" target="_blank" class="project-link" title="Live Demo">
                                <i class="fas fa-external-link-alt"></i>
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
            <div class="project-content">
                <div class="project-tags">
                    ${project.technologies.slice(0, 3).map(tech => `
                        <span class="project-tag">${tech}</span>
                    `).join('')}
                </div>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-buttons">
                    ${project.github ? `
                        <a href="${project.github}" target="_blank" class="btn-small btn-secondary">
                            <i class="fab fa-github"></i>
                            <span>Code</span>
                        </a>
                    ` : ''}
                    ${project.demo ? `
                        <a href="${project.demo}" target="_blank" class="btn-small btn-primary">
                            <i class="fas fa-external-link-alt"></i>
                            <span>Live Demo</span>
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize projects on page load
document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
    
    // Project filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProjects(btn.dataset.filter);
        });
    });
});
