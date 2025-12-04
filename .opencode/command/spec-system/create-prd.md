---
description: "Create a Product Requirements Document (PRD) from business requirements"
agent: spec-orchestrator
---

# Create PRD

<command_purpose>
Generate a comprehensive Product Requirements Document (PRD) that defines business requirements, user stories, success criteria, and stakeholders for a feature.
</command_purpose>

<usage>
```bash
# Basic usage with feature description
/create-prd "User authentication system with email/password and OAuth"

# With detailed requirements
/create-prd "E-commerce shopping cart with multiple payment options, inventory management, and order tracking"

# From user input (interactive)
/create-prd
```
</usage>

<parameters>
  <parameter name="feature_description" required="true">
    Description of the feature or product being specified.
    Can be provided as argument or will be requested interactively.
  </parameter>
</parameters>

<routing>
  Route to: @spec-orchestrator
  
  Request format:
  {
    action: "create_prd",
    feature_description: "{user input}",
    spec_type: "PRD"
  }
</routing>

<examples>
  <example>
    <title>Example 1: Authentication System</title>
    <command>/create-prd "User authentication with email/password, OAuth (Google, GitHub), and multi-factor authentication support"</command>
    <outcome>
      Creates: `specs/prd/user-authentication.prd.md`
      Contains:
      - Problem statement about need for secure authentication
      - Business goals (user acquisition, security, compliance)
      - User personas (Developer Dana, Business User Bob)
      - User stories for registration, login, OAuth, MFA
      - Functional requirements (FR-001 through FR-010)
      - Non-functional requirements (performance, security, scalability)
      - Success criteria (adoption, security, performance metrics)
      - Stakeholder table and approval tracking
    </outcome>
  </example>

  <example>
    <title>Example 2: Search Feature</title>
    <command>/create-prd "Full-text search with filters, sorting, and autocomplete for product catalog"</command>
    <outcome>
      Creates: `specs/prd/product-search.prd.md`
      Contains:
      - Problem statement about difficulty finding products
      - User goals (quick product discovery, relevant results)
      - User stories for search, filter, sort, autocomplete
      - Functional requirements for search algorithm and UI
      - Non-functional requirements (< 500ms search response)
      - Success criteria (search usage rate, success rate)
    </outcome>
  </example>

  <example>
    <title>Example 3: Interactive Mode</title>
    <command>/create-prd</command>
    <interaction>
      System: "What feature would you like to create a PRD for?"
      User: "Payment processing integration"
      
      System: "What are the main business requirements? (optional, press Enter to skip)"
      User: "Accept credit cards, PayPal, and Apple Pay. Handle refunds and subscriptions."
      
      System: "Any specific success criteria? (optional)"
      User: "95% payment success rate, < 2 second checkout time"
      
      System: "Creating PRD for payment processing..."
      Creates: `specs/prd/payment-processing.prd.md`
    </interaction>
  </example>
</examples>

<workflow>
  1. Parse feature description from user
  2. Route to @spec-orchestrator with create_prd action
  3. Orchestrator routes to @prd-writer subagent
  4. PRD writer generates complete PRD document
  5. Orchestrator validates PRD quality (target: 8+/10)
  6. Write PRD to specs/prd/{feature-name}.prd.md
  7. Report results with file location and next steps
</workflow>

<output>
  - PRD markdown file created at `specs/prd/{feature-name}.prd.md`
  - Quality score report (target: 8+/10)
  - Summary of sections created
  - Next steps:
    - Review PRD and refine if needed
    - Get stakeholder approval
    - Create DESIGN with `/create-design specs/prd/{feature-name}.prd.md`
    - Or create full spec package with `/create-full-spec`
</output>

<validation>
  - Feature description must be provided
  - Generated PRD must score 8+/10 on quality criteria
  - All required PRD sections must be present
  - Requirements must be numbered (FR-001, US-001, etc.)
  - Success criteria must be measurable
</validation>

<related_commands>
  - `/create-design` - Create DESIGN specification from this PRD
  - `/create-full-spec` - Create complete spec package (PRD + DESIGN + ARCHITECTURE + TASK)
  - `/validate-spec` - Validate PRD quality and completeness
  - `/review-spec` - Get detailed review and improvement suggestions
</related_commands>

<tips>
  - Be specific in feature description for better PRD quality
  - Include business context and user problems if known
  - Mention target users or personas if relevant
  - Specify any constraints (time, budget, technical)
  - You can always edit the generated PRD to add more detail
</tips>
