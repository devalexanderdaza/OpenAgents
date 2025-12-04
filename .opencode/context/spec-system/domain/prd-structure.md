# PRD Structure and Components

## Purpose of PRD

The Product Requirements Document (PRD) is the foundation of the SPEC pattern. It defines:
- **WHAT** needs to be built
- **WHY** it needs to be built
- **WHO** will use it
- **WHEN** success is achieved

The PRD does NOT define HOW it will be built (that's DESIGN and ARCHITECTURE).

## Required Sections

### 1. Frontmatter Metadata
```yaml
---
type: PRD
feature: feature-name-slug
version: 1.0
date: YYYY-MM-DD
status: Draft | In Review | Approved
author: Product Team Name
---
```

**Purpose**: Document tracking and version management
**Required Fields**: All fields mandatory
**Versioning**: Increment when requirements change

### 2. Table of Contents
Numbered list of all main sections for easy navigation.

### 3. Overview
**Purpose**: Executive summary for stakeholders
**Length**: 2-4 paragraphs
**Contents**:
- Brief feature description
- Business context
- High-level goals
- Target users

### 4. Problem Statement
**Purpose**: Clearly articulate the problem being solved
**Format**:
- Current situation (pain points)
- Impact on users/business
- Why this problem matters now

**Example**:
```markdown
## 2. Problem Statement

Our platform currently lacks a secure authentication system, forcing users to
access the system without proper identity verification. This creates several
critical issues:

- **Security Risk**: No way to protect user data or restrict access
- **User Experience**: Users cannot save preferences or access personalized features
- **Business Impact**: Cannot monetize through user accounts or subscriptions
- **Compliance**: Unable to meet regulatory requirements for data protection

Without authentication, we cannot launch our paid tiers or handle sensitive
user data, blocking a major revenue stream.
```

### 5. Goals and Objectives
**Purpose**: Define what success looks like
**Format**:
- Separate business goals and user goals
- Each goal should be specific and measurable
- Link to success criteria (Section 8)

**Business Goals**:
- Revenue impact
- Market positioning
- Operational efficiency
- Strategic objectives

**User Goals**:
- User problems solved
- User experience improvements
- User workflow enhancements

### 6. Target Users
**Purpose**: Identify who will use this feature
**Format**:
- Primary personas (2-3 detailed)
- Secondary personas (1-2 brief)
- For each persona:
  - Name and role
  - Key characteristics
  - Relevant needs and pain points

**Example**:
```markdown
## 4. Target Users

### Primary Personas

**Developer Dana**
- Role: Software Engineer, early adopter
- Tech-savvy, values efficiency and security
- Needs: Quick sign-up, OAuth integration, API access
- Pain Points: Dislikes long registration forms, wants 2FA

**Business User Bob**
- Role: Product Manager, casual tech user
- Needs: Simple login process, password reset, mobile access
- Pain Points: Forgets passwords, frustrated by complex requirements
```

### 7. User Stories
**Purpose**: Define functionality from user perspective
**Format**: "As a [user], I want [goal], so that [benefit]"

**Structure**:
```markdown
### Must Have (P0)
**US-001**: As a new user, I want to create an account with email and password,
so that I can access the platform securely.
- **Acceptance Criteria**:
  - [ ] User can register with email and password
  - [ ] Password requirements enforced (8+ chars, mixed case, numbers)
  - [ ] Email verification sent automatically
  - [ ] Clear error messages for invalid inputs
  - [ ] Account creation completes in < 2 minutes
- **Priority**: Must Have (P0)
```

**Prioritization**:
- **P0 (Must Have)**: Core functionality, cannot launch without
- **P1 (Should Have)**: Important but not blocking launch
- **P2 (Nice to Have)**: Enhancements for future versions

**Number Format**: US-001, US-002, etc. for traceability

### 8. Functional Requirements
**Purpose**: Specific system behaviors and capabilities
**Format**: Numbered requirements with acceptance criteria

**Structure**:
```markdown
**FR-001**: System must support email/password registration
- **Description**: Users can create accounts using email address and password
- **Acceptance Criteria**: 
  - Email format validation
  - Password strength requirements (8+ chars, upper, lower, number)
  - Email uniqueness check
  - Confirmation email sent within 1 minute
- **Priority**: Must Have (P0)
- **Related User Stories**: US-001, US-002
```

**Best Practices**:
- One requirement per item
- Testable and verifiable
- No implementation details
- Reference related user stories

### 9. Non-Functional Requirements
**Purpose**: Quality attributes and constraints
**Categories**:
- **Performance**: Response times, throughput, latency
- **Security**: Authentication, authorization, data protection
- **Scalability**: User load, data volume, growth capacity
- **Reliability**: Uptime, error rates, recovery
- **Usability**: Accessibility, learnability, efficiency
- **Compliance**: Legal, regulatory, standards

**Structure**:
```markdown
**NFR-001**: Authentication API response time
- **Category**: Performance
- **Requirement**: API response time < 200ms at p95 percentile
- **Test Conditions**: 1,000 concurrent users, normal traffic
- **Priority**: Must Have
- **Verification**: Load testing with 1K concurrent requests
```

### 10. Success Criteria
**Purpose**: Measurable outcomes that define success
**Format**: Specific metrics with target values and timeframes

**Example**:
```markdown
## 8. Success Criteria

### Adoption Metrics
- **User Registration**: 1,000 registered users within first month
- **Login Success Rate**: > 95% of login attempts succeed
- **Email Verification Rate**: > 80% of users verify email within 24 hours

### Performance Metrics
- **API Response Time**: p95 < 200ms, p99 < 500ms
- **System Uptime**: 99.9% availability (< 43 minutes downtime/month)

### Security Metrics
- **Password Breaches**: Zero password breaches in first 6 months
- **MFA Adoption**: 30% of users enable MFA within 3 months

### Business Metrics
- **User Retention**: 70% of registered users return within 7 days
- **Support Tickets**: < 5% of users create authentication-related tickets
```

### 11. Stakeholders
**Purpose**: Identify who is involved and responsible
**Format**: Table with roles and responsibilities

| Role | Name | Responsibility | Contact |
|------|------|----------------|---------|
| Product Owner | Jane Smith | Requirements & prioritization | jane@company.com |
| Engineering Lead | John Doe | Technical feasibility | john@company.com |
| Design Lead | Sarah Lee | UX design | sarah@company.com |
| Security Lead | Bob Wilson | Security review | bob@company.com |

### 12. Dependencies and Assumptions
**Purpose**: Document external factors and constraints

**Dependencies** (External factors required):
- Email service provider (SendGrid, AWS SES, etc.)
- OAuth provider APIs (Google, GitHub)
- User database availability

**Assumptions** (Things taken for granted):
- Users have access to email
- Users understand password concepts
- Stable internet connection available

**Constraints** (Limitations to work within):
- Must comply with GDPR, CCPA
- Must support latest browser versions
- Must work on mobile devices
- Budget: $50K for initial development

### 13. Out of Scope
**Purpose**: Explicitly state what is NOT included
**Importance**: Prevents scope creep and misunderstandings

**Example**:
```markdown
## 11. Out of Scope

The following are explicitly NOT included in this PRD:

- Passwordless authentication (magic links, WebAuthn) - Future Phase 2
- Enterprise SSO (SAML, LDAP) - Enterprise tier feature
- Biometric authentication (Face ID, Touch ID) - Mobile v2.0
- Account recovery via SMS - Cost prohibitive currently
- Social login beyond Google and GitHub - P2 priority
```

### 14. Approval
**Purpose**: Track stakeholder approval status
**Format**: Table with signature tracking

| Stakeholder | Role | Status | Date | Comments |
|-------------|------|--------|------|----------|
| Jane Smith | Product Owner | Pending | - | - |
| John Doe | Engineering Lead | Pending | - | - |
| Sarah Lee | Design Lead | Pending | - | - |

### 15. Related Documents
**Purpose**: Link to dependent specifications
**Format**: List of relative file paths

```markdown
## Related Documents

- **DESIGN**: `specs/design/user-authentication.design.md` (To be created)
- **ARCHITECTURE**: `specs/architecture/user-authentication.architecture.md` (To be created)
- **TASKS**: `specs/tasks/user-authentication.tasks.md` (To be created)

Update these links once dependent documents are created.
```

## Quality Checklist

Before marking PRD as "In Review":

- [ ] All required sections present
- [ ] Frontmatter metadata complete
- [ ] Problem statement is clear and specific
- [ ] Goals are measurable and tied to success criteria
- [ ] User personas defined with needs and pain points
- [ ] All user stories follow "As a/I want/So that" format
- [ ] User stories have acceptance criteria (3-5 per story)
- [ ] User stories are prioritized (P0/P1/P2)
- [ ] Functional requirements are numbered (FR-001, FR-002, etc.)
- [ ] Non-functional requirements categorized and measurable
- [ ] Success criteria have specific target values and timeframes
- [ ] All stakeholders identified with roles
- [ ] Dependencies and assumptions documented
- [ ] Out of scope items listed explicitly
- [ ] No technical implementation details (belongs in ARCHITECTURE)
- [ ] No UI/UX specifics (belongs in DESIGN)
- [ ] No task breakdowns (belongs in TASK)
- [ ] Language is clear and accessible to non-technical stakeholders
- [ ] All acronyms defined on first use
- [ ] Document is formatted as valid markdown

## Common Mistakes

### ❌ Too Technical
PRD should not specify:
- Database schemas
- API endpoints
- Technology choices
- Code patterns

These belong in ARCHITECTURE.

### ❌ Too Detailed on UI
PRD should not specify:
- Button colors or sizes
- Exact layouts
- Animation details
- Pixel-perfect designs

These belong in DESIGN.

### ❌ Vague Requirements
Bad: "System should be fast"
Good: "API response time < 200ms at p95 under 1K concurrent users"

### ❌ Missing Acceptance Criteria
Every user story and requirement needs verifiable acceptance criteria.

### ❌ Unmeasurable Success
Bad: "Increase user adoption"
Good: "Achieve 1,000 registered users within first month"

## PRD Length Guidelines

- **Small Feature**: 3-5 pages (simple CRUD, basic forms)
- **Medium Feature**: 5-10 pages (authentication, search, notifications)
- **Large Feature**: 10-20 pages (e-commerce, complex workflows)
- **Epic/Platform**: 20+ pages (may need multiple PRDs)

Quality over quantity—concise and complete is ideal.
