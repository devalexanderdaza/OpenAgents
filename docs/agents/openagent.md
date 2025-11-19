# OpenAgent - Universal Agent Guide

**Your intelligent assistant for questions, tasks, and workflows**

OpenAgent is the primary universal agent in OpenCode that handles everything from simple questions to complex multi-step workflows. This guide explains how it works and how to get the most out of it.

---

## Table of Contents

- [What is OpenAgent?](#what-is-openagent)
- [How It Works](#how-it-works)
- [The Two Paths](#the-two-paths)
- [The 6-Stage Workflow](#the-6-stage-workflow)
- [Session Management](#session-management)
- [Dynamic Context Loading](#dynamic-context-loading)
- [When OpenAgent Delegates](#when-openagent-delegates)
- [Visual Workflows](#visual-workflows)
- [Tips for Your Workflow](#tips-for-your-workflow)

---

## What is OpenAgent?

OpenAgent is your **universal assistant** that:

- ✅ **Answers questions** - Get explanations, comparisons, and guidance
- ✅ **Executes tasks** - Create files, update code, run commands
- ✅ **Coordinates workflows** - Breaks down complex features and delegates to specialists
- ✅ **Preserves context** - Remembers information across multiple steps
- ✅ **Keeps you in control** - Always asks for approval before taking action

Think of OpenAgent as a **smart project manager** who:
- Understands what you need
- Plans how to do it
- Asks for your approval
- Executes the plan
- Confirms everything is done right

---

## How It Works

### The Simple Version

```mermaid
graph LR
    A[You Ask] --> B{Question or Task?}
    B -->|Question| C[Get Answer]
    B -->|Task| D[See Plan]
    D --> E[Approve Plan]
    E --> F[Watch Execution]
    F --> G[Confirm Done]
    
    style A fill:#4A90E2,stroke:#2E5C8A,stroke-width:3px,color:#000
    style B fill:#F5A623,stroke:#C17D11,stroke-width:3px,color:#000
    style C fill:#7ED321,stroke:#5FA319,stroke-width:3px,color:#000
    style D fill:#50E3C2,stroke:#3AB89E,stroke-width:3px,color:#000
    style E fill:#F5A623,stroke:#C17D11,stroke-width:3px,color:#000
    style F fill:#6B7C93,stroke:#4A5568,stroke-width:3px,color:#fff
    style G fill:#7ED321,stroke:#5FA319,stroke-width:3px,color:#000
```

**For Questions**: You ask → You get an answer
**For Tasks**: You ask → See plan → Approve → Watch it happen → Confirm done

---

## The Two Paths

OpenAgent has two different ways of working, depending on what you need:

### Path 1: Conversational (For Questions)

```mermaid
graph TD
    A[Ask Question] --> B[OpenAgent Analyzes]
    B --> C[Provides Answer]
    C --> D[Done!]
    
    style A fill:#4A90E2,stroke:#2E5C8A,stroke-width:3px,color:#000
    style B fill:#6B7C93,stroke:#4A5568,stroke-width:3px,color:#fff
    style C fill:#7ED321,stroke:#5FA319,stroke-width:3px,color:#000
    style D fill:#7ED321,stroke:#5FA319,stroke-width:3px,color:#000
```

**When**: You ask informational questions
**Examples**:
- "What's the difference between REST and GraphQL?"
- "How do I use async/await in JavaScript?"
- "Explain what this code does"

**What Happens**: You get a direct, helpful answer. No approval needed.

---

### Path 2: Task Execution (For Actions)

```mermaid
graph TD
    A[Request Task] --> B[OpenAgent Creates Plan]
    B --> C[Shows You Plan]
    C --> D{Approve?}
    D -->|Yes| E[Executes Plan]
    D -->|No| F[Revise or Cancel]
    E --> G[Validates Results]
    G --> H[Shows Summary]
    H --> I{Satisfied?}
    I -->|Yes| J[Cleanup if Needed]
    I -->|No| K[Fix Issues]
    J --> L[Done!]
    
    style A fill:#4A90E2,stroke:#2E5C8A,stroke-width:3px,color:#000
    style B fill:#6B7C93,stroke:#4A5568,stroke-width:3px,color:#fff
    style C fill:#F5A623,stroke:#C17D11,stroke-width:3px,color:#000
    style D fill:#F5A623,stroke:#C17D11,stroke-width:3px,color:#000
    style E fill:#50E3C2,stroke:#3AB89E,stroke-width:3px,color:#000
    style F fill:#D0021B,stroke:#A00116,stroke-width:3px,color:#fff
    style G fill:#6B7C93,stroke:#4A5568,stroke-width:3px,color:#fff
    style H fill:#50E3C2,stroke:#3AB89E,stroke-width:3px,color:#000
    style I fill:#F5A623,stroke:#C17D11,stroke-width:3px,color:#000
    style J fill:#50E3C2,stroke:#3AB89E,stroke-width:3px,color:#000
    style K fill:#D0021B,stroke:#A00116,stroke-width:3px,color:#fff
    style L fill:#7ED321,stroke:#5FA319,stroke-width:3px,color:#000
```

**When**: You want something done
**Examples**:
- "Create a README for this project"
- "Build a user authentication system"
- "Refactor this code to use TypeScript"

**What Happens**: 
1. You see a plan
2. You approve it
3. OpenAgent executes it
4. You confirm it's done right

---

## The 6-Stage Workflow

When you request a task, OpenAgent follows a systematic 6-stage workflow:

```mermaid
graph TD
    subgraph Stage1["Stage 1: Analyze"]
        A1[Receive Request] --> A2[Assess Complexity]
        A2 --> A3{Question or Task?}
    end
    
    subgraph Stage2["Stage 2: Approve"]
        B1[Create Plan] --> B2[Present to User]
        B2 --> B3[Wait for Approval]
    end
    
    subgraph Stage3["Stage 3: Execute"]
        C1[Execute Steps] --> C2{Need Help?}
        C2 -->|Yes| C3[Delegate to Specialist]
        C2 -->|No| C4[Do It Directly]
        C3 --> C5[Integrate Results]
        C4 --> C5
    end
    
    subgraph Stage4["Stage 4: Validate"]
        D1[Check Quality] --> D2[Run Tests if Applicable]
        D2 --> D3{Issues Found?}
        D3 -->|Yes| D4[Report & Propose Fixes]
        D4 --> D5[Wait for Approval]
        D5 --> D6[Apply Approved Fixes]
        D6 --> D2
        D3 -->|No| D7[Ask: Review Work?]
    end
    
    subgraph Stage5["Stage 5: Summarize"]
        E1[Create Summary] --> E2[Show Changes]
        E2 --> E3[Suggest Next Steps]
    end
    
    subgraph Stage6["Stage 6: Confirm Completion"]
        F1[Ask if Satisfied] --> F2{Session Files?}
        F2 -->|Yes| F3[Ask about Cleanup]
        F2 -->|No| F4[Done]
        F3 --> F5[Cleanup on Approval]
        F5 --> F4
    end
    
    A3 -->|Question| Answer[Direct Answer]
    A3 -->|Task| Stage2
    Stage2 --> Stage3
    Stage3 --> Stage4
    Stage4 --> Stage5
    Stage5 --> Stage6
    
    style Stage1 fill:#4A90E2,stroke:#2E5C8A,stroke-width:4px,color:#fff
    style Stage2 fill:#F5A623,stroke:#C17D11,stroke-width:4px,color:#000
    style Stage3 fill:#50E3C2,stroke:#3AB89E,stroke-width:4px,color:#000
    style Stage4 fill:#6B7C93,stroke:#4A5568,stroke-width:4px,color:#fff
    style Stage5 fill:#5A6C7D,stroke:#3D4E5C,stroke-width:4px,color:#fff
    style Stage6 fill:#7ED321,stroke:#5FA319,stroke-width:4px,color:#000
    style Answer fill:#7ED321,stroke:#5FA319,stroke-width:3px,color:#000
```

---

### Stage 1: Analyze

```mermaid
graph TD
    A[Receive User Request] --> B[Read & Parse Request]
    B --> C{Assess Type}
    C -->|Informational| D[Question Path]
    C -->|Action Required| E[Task Path]
    
    D --> D1[Prepare Direct Answer]
    D1 --> D2[No Approval Needed]
    D2 --> D3[Respond Immediately]
    
    E --> E1[Assess Complexity]
    E1 --> E2[Identify Required Resources]
    E2 --> E3[Proceed to Stage 2]
    
    style A fill:#4A90E2,stroke:#2E5C8A,stroke-width:3px,color:#fff
    style C fill:#F5A623,stroke:#C17D11,stroke-width:3px,color:#000
    style D fill:#7ED321,stroke:#5FA319,stroke-width:3px,color:#000
    style E fill:#50E3C2,stroke:#3AB89E,stroke-width:3px,color:#000
    style D3 fill:#7ED321,stroke:#5FA319,stroke-width:3px,color:#000
    style E3 fill:#6B7C93,stroke:#4A5568,stroke-width:3px,color:#fff
```

**What happens**: OpenAgent reads your request and decides if it's a question or a task.

**Your experience**: Instant - you don't see this happening.

---

### Stage 2: Approve ⚠️ (MANDATORY for tasks)

```mermaid
graph TD
    A[Task Identified] --> B[Analyze Requirements]
    B --> C[Create Step-by-Step Plan]
    C --> D[Format Plan for User]
    D --> E[Present Plan to User]
    E --> F{User Response}
    
    F -->|Approve| G[Proceed to Stage 3]
    F -->|Request Changes| H[Revise Plan]
    F -->|Reject/Cancel| I[Cancel Task]
    
    H --> C
    I --> J[End - Task Cancelled]
    
    style A fill:#4A90E2,stroke:#2E5C8A,stroke-width:3px,color:#fff
    style E fill:#F5A623,stroke:#C17D11,stroke-width:3px,color:#000
    style F fill:#F5A623,stroke:#C17D11,stroke-width:3px,color:#000
    style G fill:#7ED321,stroke:#5FA319,stroke-width:3px,color:#000
    style H fill:#50E3C2,stroke:#3AB89E,stroke-width:3px,color:#000
    style I fill:#D0021B,stroke:#A00116,stroke-width:3px,color:#fff
    style J fill:#D0021B,stroke:#A00116,stroke-width:3px,color:#fff
```

**What happens**: OpenAgent creates a plan and shows it to you.

**Your experience**: You see something like:
```
## Proposed Plan
1. Create README.md file
2. Add project overview section
3. Add installation instructions
4. Add usage examples

**Approval needed before proceeding.**
```

**What you do**: Review the plan and say "yes" or "no" (or ask for changes).

---

### Stage 3: Execute

```mermaid
graph TD
    A[Approval Received] --> B[Review Plan Steps]
    B --> C{Need Context Files?}
    
    C -->|Yes| D[Create Session]
    C -->|No| E[Proceed Without Session]
    
    D --> F[Generate Session ID]
    F --> G[Create Context Files]
    G --> H[Update Manifest]
    
    H --> I{Delegate or Direct?}
    E --> I
    
    I -->|Delegate| J[Identify Specialist Agent]
    I -->|Direct| K[Execute Steps Directly]
    
    J --> L[Pass Context Files]
    L --> M[Specialist Executes]
    M --> N[Integrate Results]
    
    K --> O[Complete Execution]
    N --> O
    
    O --> P[Proceed to Stage 4]
    
    style A fill:#7ED321,stroke:#5FA319,stroke-width:3px,color:#000
    style C fill:#F5A623,stroke:#C17D11,stroke-width:3px,color:#000
    style D fill:#50E3C2,stroke:#3AB89E,stroke-width:3px,color:#000
    style I fill:#F5A623,stroke:#C17D11,stroke-width:3px,color:#000
    style J fill:#6B7C93,stroke:#4A5568,stroke-width:3px,color:#fff
    style K fill:#50E3C2,stroke:#3AB89E,stroke-width:3px,color:#000
    style P fill:#6B7C93,stroke:#4A5568,stroke-width:3px,color:#fff
```

**What happens**: OpenAgent carries out the plan, either directly or by delegating to specialist agents.

**Your experience**: You might see:
- Files being created or modified
- Commands being run
- Progress updates
- Results from specialist agents

**Behind the scenes**: OpenAgent might create temporary files to preserve context between steps.

---

### Stage 4: Validate ⚠️ (MANDATORY for tasks)

```mermaid
graph TD
    A[Execution Complete] --> B[Check Quality]
    B --> C{Tests Applicable?}
    
    C -->|Yes| D[Run Tests]
    C -->|No| E[Manual Validation]
    
    D --> F{Tests Pass?}
    E --> G{Quality OK?}
    
    F -->|Pass| H[All Checks Passed]
    G -->|Yes| H
    
    F -->|Fail| I[STOP Execution]
    G -->|No| I
    
    I --> J[Report Issues Clearly]
    J --> K[Propose Fix Plan]
    K --> L[Request Approval]
    L --> M{User Approves Fix?}
    
    M -->|Yes| N[Apply Fixes]
    M -->|No| O[End - Issues Remain]
    
    N --> D
    
    H --> P[Ask: Additional Checks?]
    P --> Q{User Response}
    
    Q -->|Run More Tests| R[Run Specific Tests]
    Q -->|Review Files| S[Review Specific Files]
    Q -->|Proceed| T[Proceed to Stage 5]
    
    R --> H
    S --> H
    
    style A fill:#50E3C2,stroke:#3AB89E,stroke-width:3px,color:#000
    style C fill:#F5A623,stroke:#C17D11,stroke-width:3px,color:#000
    style F fill:#F5A623,stroke:#C17D11,stroke-width:3px,color:#000
    style G fill:#F5A623,stroke:#C17D11,stroke-width:3px,color:#000
    style H fill:#7ED321,stroke:#5FA319,stroke-width:3px,color:#000
    style I fill:#D0021B,stroke:#A00116,stroke-width:3px,color:#fff
    style L fill:#F5A623,stroke:#C17D11,stroke-width:3px,color:#000
    style M fill:#F5A623,stroke:#C17D11,stroke-width:3px,color:#000
    style T fill:#5A6C7D,stroke:#3D4E5C,stroke-width:3px,color:#fff
```

**What happens**: OpenAgent checks the quality of the work, runs tests if applicable, and ensures everything works correctly.

**Your experience when validation passes**: You see:
```
✅ Validation complete - all checks passed.

Would you like me to run any additional checks or review the work before I summarize?
- Run specific tests
- Check specific files  
- Review changes
- Proceed to summary
```

**What you do**: Choose to review further or proceed to summary.

#### Special Case: Test Failures or Issues Found

If OpenAgent runs tests or validation and finds issues, it follows a **strict protocol**:

**What happens**:
1. ⛔ **STOPS** execution immediately
2. 📋 **REPORTS** all issues/failures clearly
3. 📝 **PROPOSES** a fix plan with specific steps
4. ⚠️ **REQUESTS APPROVAL** before fixing (mandatory)
5. ✅ **PROCEEDS** only after you approve
6. 🔄 **RE-VALIDATES** after fixes are applied

**Your experience**: You see something like:
```
## Validation Results
❌ 3 tests failed:
- test_user_auth: Expected 200, got 401
- test_login: Missing token in response
- test_logout: Session not cleared

## Proposed Fix Plan
1. Update auth middleware to return proper status codes
2. Add token generation to login endpoint
3. Add session cleanup to logout handler

**Approval needed before proceeding with fixes.**
```

**Important**: OpenAgent will **NEVER** auto-fix issues without your explicit approval. After fixes are applied, validation runs again to ensure everything passes.

---

### Stage 5: Summarize

```mermaid
graph TD
    A[Validation Complete & User Satisfied] --> B{Task Complexity}
    
    B -->|Simple Question| C[Natural Conversational Response]
    B -->|Simple Task| D[Brief Summary]
    B -->|Complex Task| E[Formal Summary]
    
    D --> D1[Brief: Created X or Updated Y]
    
    E --> E1[List Accomplishments]
    E1 --> E2[Detail Changes Made]
    E2 --> E3[Suggest Next Steps]
    
    C --> F[Proceed to Stage 6]
    D1 --> F
    E3 --> F
    
    style A fill:#6B7C93,stroke:#4A5568,stroke-width:3px,color:#fff
    style B fill:#F5A623,stroke:#C17D11,stroke-width:3px,color:#000
    style C fill:#7ED321,stroke:#5FA319,stroke-width:3px,color:#000
    style D fill:#50E3C2,stroke:#3AB89E,stroke-width:3px,color:#000
    style E fill:#5A6C7D,stroke:#3D4E5C,stroke-width:3px,color:#fff
    style F fill:#7ED321,stroke:#5FA319,stroke-width:3px,color:#000
```

**What happens**: After validation passes and you're satisfied, OpenAgent creates a summary of what was accomplished.

**Your experience**: You see a summary like:
```
## Summary
Created README.md with project documentation.

**Changes Made:**
- Created README.md
- Added project overview
- Added installation guide
- Added usage examples

**Next Steps:** Review the README and update as needed.
```

---

### Stage 6: Confirm Completion ⚠️ (MANDATORY for tasks)

```mermaid
graph TD
    A[Summary Presented] --> B[Ask: Is This Satisfactory?]
    B --> C{User Satisfied?}
    
    C -->|No| D[Identify Issues]
    D --> E[Return to Appropriate Stage]
    
    C -->|Yes| F{Session Files Created?}
    
    F -->|No| G[Task Complete]
    
    F -->|Yes| H[Ask: Cleanup Session Files?]
    H --> I{User Approves Cleanup?}
    
    I -->|No| J[Keep Session Files]
    J --> K[Task Complete - Files Preserved]
    
    I -->|Yes| L[Delete Context Files]
    L --> M[Update Manifest]
    M --> N[Remove Session Folder]
    N --> O[Confirm Cleanup Complete]
    O --> P[Task Complete - Cleaned Up]
    
    style A fill:#5A6C7D,stroke:#3D4E5C,stroke-width:3px,color:#fff
    style C fill:#F5A623,stroke:#C17D11,stroke-width:3px,color:#000
    style D fill:#D0021B,stroke:#A00116,stroke-width:3px,color:#fff
    style F fill:#F5A623,stroke:#C17D11,stroke-width:3px,color:#000
    style G fill:#7ED321,stroke:#5FA319,stroke-width:3px,color:#000
    style I fill:#F5A623,stroke:#C17D11,stroke-width:3px,color:#000
    style K fill:#7ED321,stroke:#5FA319,stroke-width:3px,color:#000
    style P fill:#7ED321,stroke:#5FA319,stroke-width:3px,color:#000
```

**What happens**: OpenAgent asks if you're satisfied and if temporary files should be cleaned up.

**Your experience**: You see:
```
Is this complete and satisfactory?
Should I clean up temporary session files at .tmp/sessions/20250118-143022-a4f2/?
```

**What you do**: Confirm you're happy with the results and approve cleanup if needed.

---

## Session Management

When OpenAgent works on complex tasks, it creates a **session** to keep track of everything.

### What is a Session?

A session is like a **temporary workspace** where OpenAgent stores:
- Context files (requirements, specifications)
- Task breakdowns
- Notes for specialist agents
- Progress tracking

### Session Structure

```mermaid
graph TD
    A[Session Folder] --> B[manifest file]
    A --> C[features folder]
    A --> D[tasks folder]
    A --> E[code folder]
    A --> F[documentation folder]
    A --> G[Other categories]
    
    B --> B1[Tracks all files]
    B --> B2[Keywords for search]
    B --> B3[Creation timestamps]
    
    C --> C1[Requirements and specs]
    D --> D1[Task breakdowns]
    E --> E1[Implementation notes]
    F --> F1[Documentation context]
    
    style A fill:#4A90E2,stroke:#2E5C8A,stroke-width:3px,color:#fff
    style B fill:#F5A623,stroke:#C17D11,stroke-width:3px,color:#000
    style C fill:#50E3C2,stroke:#3AB89E,stroke-width:2px,color:#000
    style D fill:#50E3C2,stroke:#3AB89E,stroke-width:2px,color:#000
    style E fill:#50E3C2,stroke:#3AB89E,stroke-width:2px,color:#000
    style F fill:#50E3C2,stroke:#3AB89E,stroke-width:2px,color:#000
    style G fill:#50E3C2,stroke:#3AB89E,stroke-width:2px,color:#000
```

### Session Lifecycle

```mermaid
sequenceDiagram
    participant User
    participant OpenAgent
    participant Session
    
    User->>OpenAgent: Request complex task
    OpenAgent->>OpenAgent: Needs context file?
    OpenAgent->>Session: Create session (lazy)
    Session-->>OpenAgent: Session ID: abc123
    OpenAgent->>Session: Create context files
    OpenAgent->>OpenAgent: Execute task
    OpenAgent->>User: Show results
    User->>OpenAgent: Confirm done
    OpenAgent->>User: Cleanup session files?
    User->>OpenAgent: Yes
    OpenAgent->>Session: Delete session
    Session-->>OpenAgent: Cleaned up
    OpenAgent->>User: All done!
```

### Key Features

**Lazy Initialization**: Sessions are only created when actually needed (not for simple tasks).

**Unique IDs**: Each session gets a unique ID like `20250118-143022-a4f2` to prevent conflicts.

**Safe Cleanup**: OpenAgent only deletes files it created, and only after you approve.

**Concurrent Safety**: Multiple users can work simultaneously without interfering with each other.

---

## Dynamic Context Loading

One of OpenAgent's superpowers is **remembering context** across multiple steps.

### The Problem It Solves

Imagine this scenario:
1. You ask: "Build a user authentication system"
2. OpenAgent creates requirements and task breakdown
3. Later, you ask: "Implement the login component"

**Without context loading**: OpenAgent wouldn't remember the requirements from step 1.
**With context loading**: OpenAgent finds and uses the requirements automatically.

### How It Works

```mermaid
graph TD
    subgraph Step1["Step 1: Create Context"]
        A1[User requests auth system] --> A2[Create requirements file]
        A2 --> A3[Add to manifest with keywords]
        A3 --> A4[Keywords added]
    end
    
    subgraph Step2["Step 2: Create Tasks"]
        B1[Delegate to task-manager] --> B2[Create task breakdown]
        B2 --> B3[Add to manifest with keywords]
        B3 --> B4[Keywords added]
    end
    
    subgraph Step3["Step 3: Use Context"]
        C1[User requests login] --> C2[Search manifest]
        C2 --> C3[Find related files]
        C3 --> C4[Pass paths to specialist]
        C4 --> C5[Specialist reads context]
    end
    
    Step1 --> Step2
    Step2 --> Step3
    
    style Step1 fill:#4A90E2,stroke:#2E5C8A,stroke-width:4px,color:#fff
    style Step2 fill:#50E3C2,stroke:#3AB89E,stroke-width:4px,color:#000
    style Step3 fill:#7ED321,stroke:#5FA319,stroke-width:4px,color:#000
```

### The Manifest

The manifest is like an **index** that tracks all context files:

```json
{
  "session_id": "20250118-143022-a4f2",
  "context_files": {
    "features/user-auth-context.md": {
      "created": "2025-01-18T14:30:22Z",
      "for": "@task-manager",
      "keywords": ["user-auth", "authentication", "features"]
    },
    "tasks/user-auth-tasks.md": {
      "created": "2025-01-18T14:32:15Z",
      "for": "@task-manager",
      "keywords": ["user-auth", "tasks", "breakdown"]
    }
  },
  "context_index": {
    "user-auth": [
      "features/user-auth-context.md",
      "tasks/user-auth-tasks.md"
    ]
  }
}
```

**Benefits**:
- ✅ No context loss across steps
- ✅ Automatic discovery by keywords
- ✅ Flexible - only loads what's needed
- ✅ Traceable - you can see what context was used

---

## When OpenAgent Delegates

OpenAgent knows when to do work itself and when to call in specialists.

### Decision Tree

```mermaid
graph TD
    A[Receive Task] --> B{What type?}
    
    B -->|Question| C[Answer Directly]
    
    B -->|Task| D{How complex?}
    
    D -->|3+ files OR 60+ min OR complex| E[Delegate to task-manager]
    E --> E1[Breaks down into subtasks]
    
    D -->|Comprehensive docs OR multi-page| F[Delegate to documentation]
    F --> F1[Creates structured docs]
    
    D -->|Specialized code task| G[Delegate to code specialists]
    G --> G1[Testing, review, build]
    
    D -->|Simple OR single file OR under 30 min| H[Execute Directly]
    H --> H1[OpenAgent handles it]
    
    style A fill:#4A90E2,stroke:#2E5C8A,stroke-width:3px,color:#fff
    style B fill:#F5A623,stroke:#C17D11,stroke-width:3px,color:#000
    style C fill:#7ED321,stroke:#5FA319,stroke-width:3px,color:#000
    style D fill:#F5A623,stroke:#C17D11,stroke-width:3px,color:#000
    style E fill:#6B7C93,stroke:#4A5568,stroke-width:3px,color:#fff
    style F fill:#6B7C93,stroke:#4A5568,stroke-width:3px,color:#fff
    style G fill:#6B7C93,stroke:#4A5568,stroke-width:3px,color:#fff
    style H fill:#7ED321,stroke:#5FA319,stroke-width:3px,color:#000
```

### Delegation Criteria

#### Delegate to @task-manager when:
- ✅ Feature spans **3+ files/modules**
- ✅ Estimated effort **>60 minutes**
- ✅ Needs **breakdown into subtasks**
- ✅ **Complex dependencies** between components
- ✅ User **explicitly requests** task breakdown

**Example**: "Build user authentication system"

---

#### Delegate to @documentation when:
- ✅ Creating **comprehensive docs** (API docs, guides, tutorials)
- ✅ **Multi-page** documentation
- ✅ Requires **codebase analysis/research**
- ✅ User **explicitly requests** documentation agent

**Example**: "Create API documentation for all endpoints"

---

#### Delegate to @code/* when:
- ✅ **Code-specific specialized task** (testing, review, build)
- ✅ Code subagents are **available** in current profile

**Examples**:
- "Review this code for security issues" → @code/reviewer
- "Write tests for this module" → @code/tester
- "Run build and fix errors" → @code/build-agent

---

#### Execute directly when:
- ✅ **Single file** operation
- ✅ **Simple, straightforward** task (<30 min)
- ✅ **Quick updates/edits**
- ✅ User **explicitly asks** openagent to handle it

**Examples**:
- "Create a README"
- "Update this function to use async/await"
- "Add a comment to this code"

---

## Visual Workflows

### Complete Task Workflow

```mermaid
sequenceDiagram
    participant User
    participant OpenAgent
    participant Session
    participant Specialist
    
    User->>OpenAgent: "Build authentication system"
    
    Note over OpenAgent: Stage 1: Analyze
    OpenAgent->>OpenAgent: Complex task, needs task-manager
    
    Note over OpenAgent: Stage 2: Approve
    OpenAgent->>User: ## Proposed Plan<br/>1. Create requirements<br/>2. Delegate to task-manager<br/>3. Review breakdown<br/><br/>**Approval needed**
    User->>OpenAgent: Approved
    
    Note over OpenAgent: Stage 3: Execute
    OpenAgent->>Session: Create session abc123
    OpenAgent->>Session: Create features/user-auth-context.md
    Session-->>OpenAgent: File created, added to manifest
    
    OpenAgent->>Specialist: @task-manager: Break down auth system<br/>Context: .tmp/sessions/abc123/features/user-auth-context.md
    Specialist->>Session: Create tasks/user-auth-tasks.md
    Specialist-->>OpenAgent: Task breakdown complete
    
    OpenAgent->>Session: Update manifest with new file
    
    Note over OpenAgent: Stage 4: Validate
    OpenAgent->>OpenAgent: Check quality, run tests
    OpenAgent->>User: ✅ Validation complete - all checks passed.<br/><br/>Would you like me to run any additional checks<br/>or review the work before I summarize?
    User->>OpenAgent: Proceed to summary
    
    Note over OpenAgent: Stage 5: Summarize
    OpenAgent->>User: ## Summary<br/>Created task breakdown with 5 subtasks<br/><br/>**Changes:**<br/>- Created context file<br/>- Created task breakdown
    
    Note over OpenAgent: Stage 6: Confirm
    OpenAgent->>User: Is this complete and satisfactory?<br/>Should I clean up session files?
    User->>OpenAgent: Yes, looks good. Clean up.
    OpenAgent->>Session: Delete session abc123
    Session-->>OpenAgent: Cleaned up
    OpenAgent->>User: ✓ All done!
```

### Multi-Step with Context Preservation

```mermaid
sequenceDiagram
    participant User
    participant OpenAgent
    participant Manifest
    participant Specialist
    
    Note over User,Specialist: Step 1: Initial Request
    User->>OpenAgent: "Build auth system"
    OpenAgent->>Manifest: Create features/user-auth-context.md<br/>Keywords: [user-auth, authentication]
    OpenAgent->>Specialist: @task-manager
    Specialist->>Manifest: Create tasks/user-auth-tasks.md<br/>Keywords: [user-auth, tasks]
    
    Note over User,Specialist: Step 2: Later Request
    User->>OpenAgent: "Implement login component"
    OpenAgent->>Manifest: Search for "login" or "user-auth"
    Manifest-->>OpenAgent: Found:<br/>- features/user-auth-context.md<br/>- tasks/user-auth-tasks.md
    OpenAgent->>Specialist: @coder-agent: Implement login<br/><br/>Related context:<br/>- features/user-auth-context.md<br/>- tasks/user-auth-tasks.md
    Specialist->>Manifest: Read context files
    Specialist-->>OpenAgent: Login component implemented with full context
    
    Note over OpenAgent: ✓ No context loss!
```

### Concurrent Sessions

```mermaid
graph TD
    subgraph UserA["User A Session"]
        A1[Request: Build auth] --> A2[Session abc123]
        A2 --> A3[features context]
        A2 --> A4[tasks context]
    end
    
    subgraph UserB["User B Session"]
        B1[Request: Build payment] --> B2[Session def456]
        B2 --> B3[features context]
        B2 --> B4[tasks context]
    end
    
    subgraph Isolation["Session Isolation"]
        I1[Unique Session IDs]
        I2[Separate Folders]
        I3[Independent Manifests]
        I4[No Conflicts]
    end
    
    A2 -.->|Isolated| Isolation
    B2 -.->|Isolated| Isolation
    
    style UserA fill:#4A90E2,stroke:#2E5C8A,stroke-width:4px,color:#fff
    style UserB fill:#7ED321,stroke:#5FA319,stroke-width:4px,color:#000
    style Isolation fill:#F5A623,stroke:#C17D11,stroke-width:4px,color:#000
```

---

## Tips for Your Workflow

### 1. Be Specific in Your Requests

**Instead of**: "Make this better"
**Try**: "Refactor this function to use async/await and add error handling"

**Why**: Specific requests help OpenAgent create better plans and get approval faster.

---

### 2. Review Plans Carefully

When OpenAgent shows you a plan, take a moment to review it:
- ✅ Does it match what you want?
- ✅ Are there any steps you'd change?
- ✅ Is anything missing?

**Tip**: You can ask OpenAgent to revise the plan before approving.

---

### 3. Use Multi-Step Workflows

For complex projects, break them into steps:

```
Step 1: "Build user authentication system"
→ Review task breakdown

Step 2: "Implement the registration component"
→ OpenAgent uses context from Step 1

Step 3: "Implement the login component"
→ OpenAgent uses context from Steps 1 & 2
```

**Why**: OpenAgent preserves context across steps, making each step easier.

---

### 4. Leverage Specialist Agents

Let OpenAgent delegate to specialists:
- **Complex features** → Let task-manager break them down
- **Documentation** → Let documentation agent create comprehensive docs
- **Code review** → Let reviewer agent check for issues

**Tip**: You can explicitly request a specialist: "Use the documentation agent to create API docs"

---

### 5. Clean Up Sessions Regularly

After completing a workflow, approve session cleanup:
- ✅ Keeps your workspace clean
- ✅ Prevents accumulation of temporary files
- ✅ Frees up disk space

**Tip**: You can also manually clean up stale sessions:
```bash
./scripts/cleanup-stale-sessions.sh
```

---

### 6. Use Keywords Consistently

When working on related tasks, use consistent terminology:
- "user authentication" (not "auth" in one request and "login system" in another)
- "payment processing" (not "payments" and "checkout" interchangeably)

**Why**: Helps OpenAgent find related context files more easily.

---

### 7. Provide Context for Follow-Up Requests

When making follow-up requests, reference previous work:

**Good**: "Implement the login component from the auth system we planned earlier"
**Better**: "Implement the login component using the user-auth requirements"

**Why**: Helps OpenAgent search for the right context files.

---

### 8. Customize Delegation Thresholds

You can adjust when OpenAgent delegates by modifying the criteria in `.opencode/agent/openagent.md`:

**Current defaults**:
- 3+ files → Delegate to task-manager
- >60 minutes → Delegate to task-manager
- <30 minutes → Execute directly

**To customize**: Edit the `<delegation_criteria>` section to match your preferences.

---

### 9. Create Your Own Categories

The default categories are:
- features, documentation, code, refactoring, testing, tasks, general

**To add custom categories**: Edit the `<categories>` line in openagent.md:
```xml
<categories>features | documentation | code | refactoring | testing | general | tasks | your-category</categories>
```

**Use case**: If you frequently work on "migrations" or "integrations", add those as categories.

---

### 10. Monitor Session Files

Occasionally check `.tmp/sessions/` to see what context is being preserved:

```bash
ls -la .tmp/sessions/
```

**Why**: Helps you understand what context OpenAgent is using and identify any issues.

---

### 11. Use Explicit Approvals for Learning

When learning a new codebase or technology, use OpenAgent's approval step as a learning opportunity:
- Read the plan carefully
- Ask questions about steps you don't understand
- Request explanations before approving

**Example**:
```
OpenAgent: "I'll refactor this to use dependency injection"
You: "What is dependency injection and why is it better here?"
OpenAgent: [Explains]
You: "Got it, approved!"
```

---

### 12. Combine with Other Agents

OpenAgent works great with other agents in your profile:
- Use OpenAgent for planning and coordination
- Let specialists handle their domains
- OpenAgent will preserve context between them

**Example workflow**:
1. OpenAgent plans the feature
2. @coder-agent implements it
3. @tester writes tests
4. @reviewer checks quality
5. @documentation documents it

All coordinated by OpenAgent with preserved context!

---

## Advanced Tips

### Create Reusable Context Templates

For recurring workflows, create context templates:

**Example**: `.opencode/templates/feature-context.md`
```markdown
# Feature: {FEATURE_NAME}

## Requirements
- [List requirements]

## Constraints
- [List constraints]

## Success Criteria
- [List criteria]
```

**Use**: "Create a new feature using the feature-context template"

---

### Use Session IDs for Debugging

If something goes wrong, note the session ID:
```
Session: 20250118-143022-a4f2
```

You can inspect the session folder to see what context was created:
```bash
cat .tmp/sessions/20250118-143022-a4f2/.manifest.json
```

---

### Batch Related Tasks

Group related tasks in one session for better context:

**Instead of**:
- Request 1: "Create user model"
- Request 2: "Create auth controller"
- Request 3: "Create login route"

**Try**:
- Request: "Build user authentication with model, controller, and routes"

**Why**: Single session, all context preserved, more efficient.

---

## Core Principles

OpenAgent follows these core principles:

### 🎯 Lean
Concise responses, no over-explanation. Gets to the point quickly.

### 🔄 Adaptive
Conversational for questions, formal for tasks. Matches the context.

### ⚡ Lazy
Only creates sessions/files when actually needed. No unnecessary overhead.

### 🔒 Safe
**ALWAYS** requests approval before ANY execution. Confirms before cleanup.

### 📋 Report First
When tests fail or issues are found:
1. **REPORT** the issues
2. **PLAN** the fixes
3. **REQUEST APPROVAL**
4. **FIX** (only after approval)

**Never auto-fixes** - you're always in control.

---

## Summary

OpenAgent is your **intelligent project manager** that:

✅ **Plans before acting** - Shows you the plan and waits for approval
✅ **Preserves context** - Remembers information across multiple steps
✅ **Delegates wisely** - Calls in specialists when needed
✅ **Keeps you in control** - Always confirms before cleanup
✅ **Handles complexity** - Breaks down big tasks into manageable pieces
✅ **Reports before fixing** - Never auto-fixes issues without approval

**Key Takeaways**:
1. Be specific in your requests
2. Review plans before approving
3. Use multi-step workflows for complex projects
4. Let OpenAgent delegate to specialists
5. Clean up sessions when done
6. Customize to fit your workflow
7. Expect reports before fixes when issues are found

**Ready to get started?** Just ask OpenAgent a question or request a task!

---

## Configuration

OpenAgent is configured in `.opencode/agent/openagent.md`. You can customize:
- Delegation thresholds
- Categories
- Error handling
- Test failure protocol
- And more!

### Recent Optimizations (Nov 2025)

OpenAgent has been optimized based on research-backed prompt engineering patterns:

✅ **Critical rules positioned early** - Safety rules now appear in the first 15% of the prompt (10.7% position)
✅ **Minimal nesting complexity** - Flattened XML structure to only 2 levels for maximum clarity
✅ **Modular design** - Session management and context discovery extracted to reference files
✅ **Explicit prioritization** - 3-tier priority system for conflict resolution
✅ **Single source of truth** - Critical rules defined once and referenced throughout

**Effectiveness improvements are model- and task-specific.** These patterns are validated by Stanford/Anthropic research but actual performance gains vary based on your specific use case.

### Required Context Files

OpenAgent requires these context files to function properly:
- `.opencode/context/core/session-management.md` - Session lifecycle and cleanup policies
- `.opencode/context/core/context-discovery.md` - Dynamic context loading and discovery
- `.opencode/context/core/context-management.md` - Overall context management strategy
- `.opencode/context/core/essential-patterns.md` - Core coding patterns and best practices

These files are automatically loaded when OpenAgent starts.

Happy building! 🚀
