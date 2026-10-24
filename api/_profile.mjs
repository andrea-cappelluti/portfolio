// What the chatbot knows about Andrea. Source: index.html and CV_Andrea_Cappelluti.pdf; keep in sync when they change.
export default `
# Andrea Cappelluti

- AI engineer and data scientist, from Rome, based in Milan, Italy.
- AI Engineer at Yellow Tech in Milan since August 2026.
- Builds AI agents; his MSc thesis forecasts passenger check-ins at Rome Fiumicino airport.
- Portfolio site pages: /work, /projects, /thesis, /about.

## Summary

- Three roles in 2026, alongside a master's in data science: Data Science Intern at Basco&T Consulting (Feb - Apr 2026), Customer Insights Analyst at MSX International (Apr - Jul 2026), AI Engineer at Yellow Tech (Aug 2026 - now).
- Education: BSc Economics and Big Data at Roma Tre University (2021 - 2024), MSc Data Science and Management at LUISS Guido Carli (2024 - 2026), Erasmus+ semester at TalTech in Tallinn (Sep 2025 - Feb 2026).
- Two theses: BSc thesis on artificial intelligence in online platforms (2024), MSc thesis on forecasting check-in show-up at Rome Fiumicino (2026).
- The site shows 8 projects: 2 theses, 3 with companies (MobilityLens, Reply project, Unieuro project), 2 academic projects and 1 open-source project (Computer and browser use with Jev).
- Open to conversations about AI engineering, data science and forecasting.

## Current role

- AI Engineer at Yellow Tech (CV: "Yellow Tech - The AI Transformation Company"), Milan, August 2026 - present.
- Yellow Tech is described on the site as the AI transformation company.
- Designs and builds AI agents and AI-powered software, delivered as end-to-end implementations for real production environments.
- Optimises business processes and workflows by integrating AI-driven tools and automation (CV: bringing intelligent automation into real production workflows).
- Builds document-processing pipelines that combine OCR models and LLMs to turn business documents into validated, structured data.

## Experience

### Yellow Tech - AI Engineer (Milan, Aug 2026 - present)
- See "Current role".

### MSX International - Customer Insights Analyst (Apr - Jul 2026)
- Maintained and processed large-scale vehicle databases through data cleaning and quality control, optimising operational workflows and minimising service downtime.
- Analysed customer data to identify needs and deliver tailored solutions to Ford customers, raising satisfaction and service quality.
- No stack is listed for this role.

### Basco&T Consulting - Data Science Intern (Feb - Apr 2026)
- Contributed to MobilityLens, combining Milan's public transport data with real-estate prices to turn complex datasets into strategic insight.
- Built data pipelines and interactive dashboards on mobility patterns and housing trends, supporting strategic reports for public-transport clients.
- Built a RAG system that writes personalised real-estate evaluations, with public transport information and composite neighbourhood indicators.
- Stack: Python, SQL, Supabase, RAG, LLM APIs, Power BI.
- Project page: /projects/mobility-lens.

## Projects

### Computer and browser use with Jev - jev-voice-use (/projects/jev-voice-use)
- Open-source project, September 2026. Code: https://github.com/andrea-cappelluti/jev-voice-use
- A computer-use and browser-use agent driven by voice and by Jev: it uses the whole Mac (desktop mode, the default) or a Chromium window, in Italian and English, and acts before you finish the sentence.
- Built on Moritz Kremb's open-source jev-voice-browser (MIT licence). Andrea extended it with the macOS desktop mode (a native Swift helper), Italian and English commands in one session, and spoken arithmetic typed into Calculator.
- How it works: speech streams in word by word (Apple's speech recogniser on the Mac, the Web Speech API in browser mode); after a 200 ms pause the app reads the screen (macOS accessibility tree, or up to 100 page elements) and sends one request to Jev, TypeSafe's System One model, with about a dozen typed questions; Jev returns probabilities, not text, and code decides whether to act, wait, ask for confirmation, offer numbered choices or ignore side talk.
- Actions: open and switch apps, click buttons, menus and tabs, type or dictate text, search, keyboard shortcuts, scrolling, system volume. Destructive actions need a spoken "confirm".
- Numbers from the project README: about 300 ms from the last word to the decision, Jev latency about 330 ms on average, about $0.0002 per call, 170 of 170 integration tests passing (84 Italian, 86 English).
- Stack: Node.js, Swift, Jev (TypeSafe SDK), Playwright, Apple Speech framework, Express, WebSockets.

### MobilityLens, Milan (/projects/mobility-lens)
- Basco&T Consulting, Data Science Intern, Feb - Apr 2026. Site: https://www.mobilitylens.com/
- MobilityLens is Basco&T's data-intelligence platform for the territory: planning rules, public investment, real-estate prices and mobility in one place. Andrea worked on Milan, where public transport meets house prices.
- Andrea built data pipelines combining Milan's public transport data with real-estate prices.
- Andrea built interactive dashboards on mobility patterns and housing trends, used in strategic reports for public-transport clients.
- Andrea built a RAG system that writes personalised real-estate evaluations, with public transport information and composite neighbourhood indicators.
- Stack: Python, SQL, Supabase, RAG, LLM APIs, Power BI.

### MSc thesis: When passengers show up (/thesis)
- Forecasting passenger check-in show-up at Rome Fiumicino, from one hour to one week ahead. LUISS, 2026. Error 29-33% lower than the seasonal baseline.
- Stack: LightGBM, TimesFM, AWS SageMaker. Full details under "Thesis".

### AI in online platforms - BSc thesis (/projects/bsc-thesis)
- Roma Tre University, 2024. Studies how online platforms implement artificial intelligence, and what that brings: impacts, opportunities and challenges.
- Title: Implementation of Artificial Intelligence in Online Platforms: Impacts, Opportunities and Challenges.
- Subject: Economics of Digital Markets. Advisor: Eleonora Pierucci. Degree: BSc Economics and Big Data, 102/110.
- Topics: artificial intelligence, online platforms, digital markets, platform economics.

### Questions in, charts out - multi-agent analytics (/projects/multi-agent-analytics)
- Reply project, Mar - Apr 2025 (the CV lists it under other curricular activities). A multi-agent system that analyses public datasets from plain-language questions: self-service civic analytics for everyone.
- Turns natural-language questions into automated data analysis and visualisations, using GPT-4.1, Python and Streamlit.
- Uses OpenAI's Agents SDK and LlamaIndex to interpret the question, pick the right public dataset, and generate and run Python code (pandas, matplotlib).
- Prepares several civic datasets first: type normalisation, translation and schema alignment.
- Returns both a narrative insight and a chart, in a bilingual English and Italian interface.
- Stack: GPT-4.1, OpenAI Agents SDK, LlamaIndex, Streamlit, pandas.

### Retail sales forecasting (/projects/sales-forecasting)
- Unieuro project, Mar - Apr 2025 (the CV lists it under other curricular activities). Andrea led a project to predict 2024 sales of smartphones and vacuum cleaners, combining business intelligence, statistics and machine learning.
- Extensive preprocessing, cleaning and feature engineering to extract seasonality, promotions and historical demand.
- Compared XGBoost, Gradient Boosting, Random Forest and linear regression, with cross-validation on RMSE, MAE and R-squared.
- Delivered the forecasts in interactive Power BI dashboards for KPIs and scenario planning.
- Stack: Python, XGBoost, scikit-learn, pandas, Power BI.

### Energy use, predicted - SDG7 (/projects/sdg7-energy)
- Academic project, Mar - May 2024. Data on renewables, CO2 and access to electricity for UN Sustainable Development Goal 7, brought together to explain and predict energy use per person.
- Aggregated and cleaned World Bank, IEA and UN data, with imputation and scaling.
- Time-series and geospatial visuals, plus a correlation analysis across energy indicators.
- Predicted per-capita primary energy consumption: Random Forest reached R-squared 0.89, against 0.45 for linear regression, tuned with GridSearchCV.
- Interactive dashboards for policy reading.
- Stack: Python, pandas, scikit-learn, Random Forest, Seaborn, Tableau.

### What makes a show popular (/projects/tv-popularity)
- Academic project, Jan - Mar 2024. A Kaggle dataset of TV series and movies, analysed to find what drives popularity and ratings.
- SQL on SQLite for extraction and exploratory analysis.
- K-Means clustering and association rules to group titles and find patterns.
- Decision Tree, Random Forest and linear regression in Orange Data Mining, with Spearman correlation.
- Finding: popularity tracks a show's longevity, its seasons and episodes, more than its genre.
- Stack: SQL, SQLite, Orange Data Mining, Python, K-Means.

## Thesis

- MSc thesis at LUISS Guido Carli, 2026, page /thesis. Site headline: "When passengers show up".
- CV title: Forecasting Passenger Check-in Show-up Curves at Rome Fiumicino Airport: A Machine Learning Approach.
- Subject: machine learning. Advisor Giuseppe F. Italiano, co-advisor Vincenzo Lomonaco.
- Goal: forecast how many passengers reach the check-in desks at Rome Fiumicino, quarter hour by quarter hour, so the airport can staff the desks ahead.
- Data: 29.5M check-in records, 520K departures linked, 3+ years of history.
- Check-ins are counted in bins from 5 to 30 minutes and forecast from one hour to one week ahead.
- Features are leakage-free: a show-up kernel (the typical arrival pattern before a departure) is convolved with the flight schedule.
- A multi-horizon LightGBM model on those features cut error by 29-33% against the seasonal baseline, statistically significant on every setup. The home page highlights -33% error vs. the seasonal baseline.
- Benchmarked against: XGBoost and CatBoost; TiDE and Temporal Fusion Transformer, trained on AWS SageMaker GPUs; TimesFM 3.0, a time-series foundation model fine-tuned with LoRA.
- The thesis page has an interactive in-browser model, "Build a morning at the desks": switch flights on and off and set the share of passengers using a desk instead of checking in online. It uses illustrative curves that show the idea, not Fiumicino data, and assumes two minutes per passenger per desk.

## Education

### LUISS Guido Carli, Rome - MSc Data Science and Management (2024 - 2026)
- Taught in English. The CV gives 09/2024 - 10/2026 and lists it as attending.
- Thesis: see "Thesis".
- Course grades: Econometrics 30 cum laude, Technology Entrepreneurship 30 cum laude, Advanced Statistics 29, Machine Learning 28, Data Visualization 28, Data Privacy and Security 27.

### TalTech (Tallinn University of Technology), Tallinn, Estonia - Erasmus+ programme (Sep 2025 - Feb 2026)
- A semester studying in English during the LUISS master's.

### Roma Tre University, Rome - BSc Economics and Big Data (2021 - 2024)
- Final grade 102/110. The CV gives 09/2021 - 07/2024 and marks the programme as taught in Italian.
- Thesis with Eleonora Pierucci on artificial intelligence in online platforms: impacts, opportunities and challenges.
- Course grades: Statistical Learning 30, Digitalization of the Labor Market 30, Databases and Big Data 29, Machine Learning and Data Processing 28, Economics of Digital Markets 28, Statistics for Big Data 26.

## Skills

- AI engineering: AI agents and multi-agent systems, LLM APIs, Model Context Protocol (MCP), RAG, OCR + LLM extraction, prompt engineering, Claude Code, Gemini CLI, Google AI Studio. The CV also lists System One decision models.
- Machine learning: scikit-learn, LightGBM, XGBoost, CatBoost, PyTorch, TensorFlow, Darts, Optuna, time-series forecasting, LoRA / PEFT fine-tuning.
- Data and BI: Python, R, SQL, Stata, DuckDB, Power BI, Tableau, Orange Data Mining, MS Office.
- Cloud and deployment: Docker, Git, Railway, Vercel, Supabase, AWS SageMaker (GPU training).

## Certificates

- Anthropic: Claude Certified Architect - Foundations (2026); Introduction to Model Context Protocol; AI Fluency: Framework & Foundations.
- Codecademy: How to Analyze Business Metrics with SQL; Learn Statistics with R; BI Dashboards with Power BI; BI Dashboards with Tableau; Learn Prompt Engineering.
- LUISS Guido Carli: AI Literacy Digital Certificate.
- StudySection (CV: StudySection E-Learning): Python (Advanced).

## Languages

- Italian (native per the CV), English C1, Spanish A2.

## Background and interests

- From Rome; based in Milan.
- Before data, he played basketball at professional level (CV: former pro basketball player).
- Sport science enthusiast.
- Hikes and photographs trekking routes (CV: hiking and trekking photographer).

## Contact

- Email: andreacappelluti7@gmail.com
- LinkedIn: https://www.linkedin.com/in/andrea-cappelluti-9b1a61282
- CV: /CV_Andrea_Cappelluti.pdf
- Based in Milan, Italy; from Rome.
- Site pages: /work (work and study), /projects (all projects), /thesis (MSc thesis), /about (bio, skills, certificates, contact; contact card at /about#contact).
`;
