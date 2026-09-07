# ContentPulse

> Turn what your audience says into what you should publish next.

ContentPulse is an AI-powered audience intelligence platform that transforms raw audience signals into **evidence-backed content opportunities**.

Instead of guessing what to publish next, creators can analyze comments, questions, discussions, and other audience signals to discover recurring problems, understand audience pain points, rank content opportunities, and turn validated insights into platform-native content.

---

## Why ContentPulse?

Creators often have access to thousands of audience conversations but struggle to answer a simple question:

**What should I create next?**

Existing AI content tools primarily focus on generating content.

ContentPulse focuses on something earlier and more important:

**finding the right problem to create content about.**

The core principle is:

> **Evidence first. Creation second.**

Every content opportunity is backed by audience signals and an explainable scoring system.

---

## Core Workflow

```text
Audience Signals
       ↓
    Analyze
       ↓
Find Recurring Problems
       ↓
    Generate Insights
       ↓
  Score Opportunities
       ↓
 Review Evidence
       ↓
  Create Content
       ↓
   Evaluate Results
```

ContentPulse follows four main stages:

### 1. Discover

Analyze raw audience signals such as:

* Comments
* Questions
* Discussions
* Reviews
* User feedback

The system extracts:

* Problems
* Intent
* Topics
* Pain intensity
* Sentiment

---

### 2. Prove

ContentPulse groups related signals into recurring audience problems.

Each insight contains:

* The underlying problem
* A summarized audience need
* Supporting audience signals
* Pain intensity

The goal is to distinguish a real recurring problem from an isolated comment.

---

### 3. Create

The strongest content opportunities can be transformed into a structured **Content Atom**.

A Content Atom contains:

* Core problem
* Core insight
* Target audience
* Content angle
* Key evidence
* Content promise
* Call to action

The atom can then be transformed into platform-native content.

Supported content formats include:

* LinkedIn
* X
* Short-form video

---

### 4. Learn

Generated content can be evaluated through the performance analysis system.

The evaluator provides a structured score based on:

* Hook
* Relevance
* Clarity
* Actionability
* Call to action

This creates the foundation for a feedback loop between audience intelligence and content creation.

---

# Key Differentiator

## Evidence-backed content opportunities

ContentPulse does not simply say:

> "You should create a post about AI automation."

It answers:

> "You should create a post about where beginners should start with AI automation — and here are the audience signals showing why."

Each opportunity includes:

* Supporting evidence
* Opportunity score
* Demand score
* Pain score
* Audience relevance
* Content gap
* Actionability
* Confidence

This makes recommendations **explainable instead of black-box**.

---

# Opportunity Scoring

Content opportunities are ranked using multiple dimensions:

| Dimension     | Description                                              |
| ------------- | -------------------------------------------------------- |
| Demand        | How frequently the problem appears                       |
| Pain          | How strongly the audience experiences the problem        |
| Relevance     | How closely the problem matches the audience             |
| Content Gap   | How underserved the topic appears to be                  |
| Actionability | How easily the problem can be turned into useful content |
| Confidence    | How strong the supporting evidence is                    |

The final opportunity score provides a simple way to prioritize what should be created first.

---

# Confidence Scoring

Opportunity strength and evidence confidence are intentionally separated.

A strong opportunity does not automatically mean the evidence is strong.

Confidence considers factors such as:

* Number of supporting signals
* Number of distinct sources
* Pain intensity
* Semantic consistency between signals

Confidence is categorized as:

* **Low**
* **Medium**
* **High**

This helps prevent isolated audience signals from being treated as reliable trends.

---

# Architecture

ContentPulse is built with a modern full-stack TypeScript architecture.

```text
Next.js App Router
        │
        ├── Landing Page
        │
        ├── Workspace
        │    ├── Audience Analysis
        │    ├── Insights
        │    ├── Opportunities
        │    └── Content Creation
        │
        ├── API Routes
        │    ├── /api/analyze
        │    ├── /api/opportunities
        │    ├── /api/generate
        │    └── /api/performance
        │
        ├── AI Layer
        │    ├── Signal Extraction
        │    ├── Clustering
        │    ├── Insight Generation
        │    ├── Opportunity Scoring
        │    └── Content Generation
        │
        ├── Scoring Layer
        │    ├── Opportunity Score
        │    └── Confidence Score
        │
        └── Supabase
             └── PostgreSQL
```

---

# Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Backend

* Next.js API Routes
* Supabase
* PostgreSQL

### AI

* Google Gemini

AI is used for:

* Audience signal analysis
* Problem extraction
* Semantic clustering
* Insight generation
* Content opportunity generation
* Content creation

### Validation

* Zod
* Custom validation utilities

---

# Project Structure

```text
src/
├── app/
│   ├── api/
│   │   ├── analyze/
│   │   ├── generate/
│   │   ├── opportunities/
│   │   └── performance/
│   │
│   ├── workspace/
│   │   ├── audience/
│   │   ├── create/
│   │   ├── insights/
│   │   ├── opportunities/
│   │   │   └── [id]/
│   │   └── page.tsx
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── audience/
│   ├── content/
│   ├── insights/
│   ├── opportunities/
│   └── ui/
│
└── lib/
    ├── ai/
    ├── data/
    ├── scoring/
    ├── supabase/
    ├── types/
    ├── utils/
    └── validation/
```

---

# Data Model

The application uses a relational model designed around the relationship between audience evidence and content opportunities.

```text
Signals
   │
   ├──── Insight Signals
   │
   └──── Opportunity Signals
              │
              ↓
        Opportunities
              │
              ↓
        Content Atoms
              │
              ↓
      Generated Content
              │
              ↓
     Content Performance
```

Main entities:

### `signals`

Raw audience signals.

### `insights`

Recurring audience problems discovered from multiple signals.

### `insight_signals`

Relationship between insights and their supporting signals.

### `opportunities`

Ranked content opportunities.

### `opportunity_signals`

Relationship between opportunities and their supporting evidence.

### `content_atoms`

Structured content strategy generated from an opportunity.

### `generated_content`

Platform-specific generated content.

### `content_performance`

Evaluation results used to understand content quality.

---

# Demo

The current MVP includes a demonstration workflow using predefined audience signals.

Example signals:

```text
"I don't know where to start with AI automation."

"Which automation tool should I learn first?"

"AI seems way too complicated for beginners."
```

ContentPulse analyzes these signals and can identify a recurring problem such as:

```text
Beginners struggle to identify where to start with AI automation.
```

The system can then rank the corresponding content opportunity and show the evidence supporting the recommendation.

---

# Design Principles

ContentPulse is built around several principles.

### Evidence before generation

The system should understand the audience problem before generating content.

### Explainability

Recommendations should have understandable reasons behind them.

### Separation of concepts

The system separates:

```text
Opportunity Strength
        ≠
Evidence Confidence
```

### Simplicity

The MVP intentionally avoids unnecessary complexity.

### Reusable intelligence

The Content Atom acts as a structured bridge between:

```text
Audience Intelligence
        ↓
Content Strategy
        ↓
Platform-specific Content
```

---

# API

## Analyze Audience

```http
POST /api/analyze
```

Analyzes audience signals and returns:

* Analyzed signals
* Audience insights
* Content opportunities

---

## Generate Opportunities

```http
POST /api/opportunities
```

Generates ranked content opportunities from:

* Audience insights
* Analyzed signals

---

## Generate Content

```http
POST /api/generate
```

Generates platform-native content from an opportunity/content atom.

---

## Evaluate Performance

```http
POST /api/performance
```

Evaluates generated content using:

* Hook
* Relevance
* Clarity
* Actionability
* CTA

---

# Running Locally

## 1. Clone the repository

```bash
git clone git@github.com:HakimDev-tech/contentpulse.git
cd contentpulse
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

Create:

```text
.env.local
```

Required variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
GEMINI_API_KEY=your_gemini_api_key
```

Never commit `.env.local` or private API keys to the repository.

## 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Production Build

Run:

```bash
npm run lint
npm run build
```

Then:

```bash
npm start
```

---

# Current MVP

The MVP demonstrates the complete core concept:

```text
Audience Signals
        ↓
AI Analysis
        ↓
Recurring Problems
        ↓
Evidence-backed Opportunities
        ↓
Explainable Scoring
        ↓
Content Atom
        ↓
Platform Content
        ↓
Performance Evaluation
```

The focus is not on generating more content.

The focus is on helping creators make a better decision about **what content is worth creating in the first place**.

---

# Roadmap

Potential future improvements include:

* Live audience data ingestion
* Reddit and X integrations
* YouTube comment analysis
* Automatic audience monitoring
* Historical opportunity tracking
* Real performance data ingestion
* Opportunity evolution over time
* Personalized creator profiles
* Automated content feedback loops

These are intentionally outside the core MVP.

---

# Hackathon Concept

ContentPulse demonstrates a simple thesis:

> **The next piece of content should be discovered from what the audience is already saying.**

Instead of starting with:

```text
"What should AI generate?"
```

ContentPulse starts with:

```text
"What is the audience repeatedly trying to tell us?"
```

That signal becomes an insight.

The insight becomes an opportunity.

The opportunity becomes content.

And the resulting performance can feed the next decision.

```text
LISTEN → UNDERSTAND → PRIORITIZE → CREATE → LEARN
```

---

## License

This project is currently developed as a hackathon project.
