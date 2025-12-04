# SPEC Pattern System

**Complete AI-powered specification management system for creating, validating, and maintaining PRD, DESIGN, ARCHITECTURE, and TASK documents.**

## 🎯 What is This?

The SPEC Pattern System helps teams create comprehensive, consistent, and high-quality software specifications following the SPEC methodology:

- **PRD** (Product Requirements Document) - Business requirements and user stories
- **DESIGN** - UI/UX specifications and user flows
- **ARCHITECTURE** - Technical system design and components
- **TASK** - Granular implementation task breakdowns

All documents are interconnected, traceable, and automatically validated for quality and consistency.

## ✨ Key Features

- ✅ **AI-Generated Specifications** - Create complete specs from simple descriptions
- ✅ **Quality Validation** - Automatic validation against 10-point quality criteria
- ✅ **Consistency Checking** - Cross-spec validation ensures no contradictions
- ✅ **Traceability** - Full traceability from business requirements to implementation tasks
- ✅ **Templates & Standards** - Research-backed templates and best practices
- ✅ **Interactive Review** - Get improvement suggestions with specific examples

## 🚀 Quick Start

### Create a Single PRD
```bash
/create-prd "User authentication with email/password and OAuth"
```

Creates: `specs/prd/user-authentication.prd.md`

### Create Complete Spec Package
```bash
/create-full-spec "Shopping cart with multiple payment options"
```

Creates all 4 specs in 12-18 minutes:
- `specs/prd/shopping-cart.prd.md`
- `specs/design/shopping-cart.design.md`
- `specs/architecture/shopping-cart.architecture.md`
- `specs/tasks/shopping-cart.tasks.md`

### Validate Specifications
```bash
/validate-spec specs/prd/user-authentication.prd.md
```

Returns quality score (0-10) and specific improvement recommendations.

## 📋 Available Commands

### Creation Commands

| Command | Purpose | Time | Output |
|---------|---------|------|--------|
| `/create-prd` | Create Product Requirements Document | 2-4 min | PRD markdown file |
| `/create-design` | Create Design Specification from PRD | 3-5 min | DESIGN markdown file |
| `/create-architecture` | Create Architecture from PRD + DESIGN | 4-6 min | ARCHITECTURE file |
| `/create-tasks` | Create Task Breakdown from ARCHITECTURE | 2-3 min | TASK breakdown file |
| `/create-full-spec` | Create complete package (all 4 specs) | 12-18 min | Complete spec package |

### Quality Commands

| Command | Purpose | Output |
|---------|---------|--------|
| `/validate-spec` | Validate spec quality and consistency | Validation report with score |
| `/review-spec` | Get detailed review with improvements | Comprehensive review report |

## 📁 File Structure

Generated specifications are organized as:

```
specs/
├── prd/
│   └── {feature-name}.prd.md           # Business requirements
├── design/
│   └── {feature-name}.design.md        # UI/UX specifications
├── architecture/
│   └── {feature-name}.architecture.md  # Technical design
└── tasks/
    └── {feature-name}.tasks.md         # Implementation tasks
```

Each file contains:
- Complete metadata (version, date, status, author)
- Cross-references to related specs
- Numbered requirements for traceability
- Quality validation checklist

## 🔄 SPEC Workflow

### Sequential Creation (Recommended)

```
1. Create PRD (/create-prd)
   ↓
2. Review and approve PRD
   ↓
3. Create DESIGN (/create-design specs/prd/feature.prd.md)
   ↓
4. Review and approve DESIGN
   ↓
5. Create ARCHITECTURE (/create-architecture)
   ↓
6. Review and approve ARCHITECTURE
   ↓
7. Create TASKS (/create-tasks specs/architecture/feature.architecture.md)
   ↓
8. Begin implementation
```

### Fast Track (All at Once)

```
1. Create Full Package (/create-full-spec "feature description")
   ↓
2. Validate Package (/validate-spec specs/*/feature.*)
   ↓
3. Review Package (/review-spec specs/*/feature.*)
   ↓
4. Refine based on feedback
   ↓
5. Get approvals
   ↓
6. Begin implementation
```

## 💯 Quality Standards

All generated specs are validated against 10-point quality criteria:

### Quality Dimensions (2 points each)
1. **Structure** - Proper formatting and organization
2. **Completeness** - All required sections with sufficient detail
3. **Clarity** - Clear, unambiguous language
4. **Consistency** - Aligned with related specs
5. **Metadata** - Complete version and tracking info

### Passing Score: 8+/10

Specs scoring below 8/10 receive specific, actionable feedback for improvement.

## 📖 Examples

### Example 1: Authentication System

**Create PRD:**
```bash
/create-prd "User authentication system with email/password, OAuth (Google, GitHub), and optional multi-factor authentication"
```

**Result:**
- File: `specs/prd/user-authentication.prd.md`
- Contents:
  - Problem statement about security needs
  - 12 user stories (registration, login, OAuth, MFA, password reset)
  - 8 functional requirements
  - 5 non-functional requirements (performance, security)
  - Measurable success criteria
  - Stakeholder approval table
- Quality Score: 9/10 ✅

**Create Complete Package:**
```bash
/create-full-spec "User authentication system with OAuth and MFA"
```

**Result: 4 complete specifications in 15 minutes**
- PRD: 9/10 ✅
- DESIGN: 8/10 ✅ (user flows, components, accessibility requirements)
- ARCHITECTURE: 9/10 ✅ (auth service, database schema, API endpoints, security)
- TASKS: 8/10 ✅ (35 implementation tasks with dependencies)

### Example 2: Search Feature

**Command:**
```bash
/create-prd "Full-text product search with filters, sorting, autocomplete, and saved searches"
```

**Generated PRD Includes:**
- Problem: Users struggle to find products in 10K+ item catalog
- Business Goal: Increase conversion rate by 15%
- 8 user stories covering search, filter, sort, autocomplete, save
- Performance requirement: < 500ms search response time
- Success criteria: 80% of users use search, 60% success rate

## 🎯 Use Cases

### Perfect For:
- ✅ New features requiring cross-team coordination
- ✅ Complex projects needing clear documentation
- ✅ Features with significant UI/UX and technical components
- ✅ Distributed teams needing shared understanding
- ✅ Projects requiring stakeholder approval
- ✅ Documentation-driven development

### Not Ideal For:
- ❌ Small bug fixes (< 1 hour of work)
- ❌ Emergency hotfixes
- ❌ Proof-of-concept experiments
- ❌ Internal scripts with single developer

## 🔧 System Components

### Main Orchestrator
**`spec-orchestrator`** - Intelligent coordinator that:
- Analyzes requests and routes to specialists
- Validates inter-spec consistency
- Manages the complete SPEC workflow
- Ensures quality standards (8+/10)

### Specialized Subagents

1. **`prd-writer`** - Creates Product Requirements Documents
   - Extracts business requirements
   - Generates user stories with acceptance criteria
   - Defines measurable success criteria
   - Identifies stakeholders

2. **`design-writer`** - Creates Design Specifications
   - Maps user flows for each story
   - Defines UI components and states
   - Specifies interaction patterns
   - Documents accessibility requirements

3. **`architecture-writer`** - Creates Architecture Specifications
   - Designs system components
   - Defines data models and schemas
   - Specifies APIs and interfaces
   - Documents technical decisions

4. **`task-writer`** - Creates Task Breakdowns
   - Breaks components into implementable tasks
   - Defines acceptance criteria for each task
   - Identifies dependencies and sequences
   - Estimates effort (if requested)

5. **`spec-validator`** - Validates Specifications
   - Scores against 10-point criteria
   - Checks cross-spec consistency
   - Identifies missing information
   - Provides actionable feedback

6. **`spec-reviewer`** - Reviews Specifications
   - Holistic quality review
   - Identifies ambiguities and conflicts
   - Provides improvement suggestions with examples
   - Assesses implementation readiness

### Context Files

**Domain Knowledge** (4 files):
- `spec-pattern-overview.md` - SPEC methodology overview
- `prd-structure.md` - PRD components and best practices
- `design-structure.md` - DESIGN components and patterns
- `architecture-structure.md` - ARCHITECTURE components and decisions
- `task-structure.md` - TASK breakdown guidelines

**Process Knowledge** (4 files):
- `spec-creation-workflow.md` - End-to-end creation process
- `prd-to-design-flow.md` - How DESIGN derives from PRD
- `design-to-architecture-flow.md` - How ARCHITECTURE implements DESIGN
- `architecture-to-tasks-flow.md` - How TASKS break down ARCHITECTURE

**Standards** (3 files):
- `validation-rules.md` - Quality validation criteria
- `consistency-checks.md` - Cross-spec consistency requirements
- `quality-best-practices.md` - General quality guidelines

**Templates** (4 files):
- `prd-template.md` - PRD document template
- `design-template.md` - DESIGN document template
- `architecture-template.md` - ARCHITECTURE document template
- `task-template.md` - TASK document template

## 📈 Performance Expectations

### Creation Times
- PRD: 2-4 minutes
- DESIGN: 3-5 minutes
- ARCHITECTURE: 4-6 minutes
- TASK: 2-3 minutes
- Full Package: 12-18 minutes

### Quality Targets
- Individual spec quality: 8+/10
- Package consistency: 100% (no contradictions)
- Cross-reference accuracy: 100%
- Traceability: Complete requirement → task chain

## 🛠️ Customization

### Adjusting Detail Level
Edit context files in `.opencode/context/spec-system/` to adjust:
- Section requirements
- Detail expectations
- Quality thresholds
- Template structures

### Adding Custom Sections
Modify templates in `.opencode/context/spec-system/templates/` to:
- Add domain-specific sections
- Include company-specific requirements
- Integrate with existing processes

### Changing Quality Criteria
Update `.opencode/context/spec-system/standards/validation-rules.md` to:
- Adjust scoring weights
- Add custom validation rules
- Define organization-specific standards

## 🤝 Team Workflow

### For Product Managers
1. Create PRD with `/create-prd`
2. Review generated content
3. Add domain-specific details
4. Get stakeholder approval
5. Share with design and engineering

### For Designers
1. Receive approved PRD
2. Create DESIGN with `/create-design {prd_path}`
3. Review generated user flows and components
4. Add wireframes or mockups
5. Get design approval
6. Share with engineering

### For Architects/Tech Leads
1. Receive approved PRD and DESIGN
2. Create ARCHITECTURE with `/create-architecture`
3. Review generated system design
4. Add implementation details
5. Get technical approval
6. Share with development team

### For Development Teams
1. Receive approved ARCHITECTURE
2. Create TASKS with `/create-tasks {arch_path}`
3. Review task breakdown
4. Assign tasks to team members
5. Begin implementation
6. Track progress in project management tool

## 🧪 Testing

### Validate Before Approval
```bash
/validate-spec specs/prd/feature.prd.md
```

Checks:
- All required sections present
- Requirements are testable
- Success criteria are measurable
- No broken references

### Review for Quality
```bash
/review-spec specs/*/feature.*
```

Provides:
- Detailed quality assessment
- Specific improvement suggestions
- Readiness for implementation

## 📚 Resources

### Documentation
- **System Guide**: `.opencode/SPEC-SYSTEM-GUIDE.md` (this file)
- **SPEC Overview**: `.opencode/context/spec-system/domain/spec-pattern-overview.md`
- **Templates**: `.opencode/context/spec-system/templates/`
- **Standards**: `.opencode/context/spec-system/standards/`

### Command Reference
- `/create-prd` - Create PRD
- `/create-design` - Create DESIGN
- `/create-architecture` - Create ARCHITECTURE
- `/create-tasks` - Create TASKS
- `/create-full-spec` - Create complete package
- `/validate-spec` - Validate quality
- `/review-spec` - Get review

## 🐛 Troubleshooting

### Issue: Spec Quality Score < 8/10
**Solution**: Run `/validate-spec` to see specific issues, then address them one by one.

### Issue: Specs Have Contradictions
**Solution**: Run `/validate-spec` on all related specs. Fix contradictions and re-validate.

### Issue: Generated Content Too Generic
**Solution**: Provide more detailed feature description with business context, user needs, and constraints.

### Issue: Missing Sections
**Solution**: Check validation report for missing sections. Add them manually or regenerate with more detail.

## 🎓 Best Practices

1. **Start with Clear Description** - Better input = better output
2. **Review and Refine** - Generated specs are starting points, not final versions
3. **Validate Early** - Run validation before stakeholder review
4. **Keep Specs Updated** - Update when requirements change
5. **Use Traceability** - Reference requirements (FR-001) throughout specs
6. **Get Approvals** - Use approval tables in each spec
7. **Version Everything** - Bump versions when making changes

## 🚦 Getting Started Checklist

- [ ] Read SPEC Pattern Overview (`context/spec-system/domain/spec-pattern-overview.md`)
- [ ] Try `/create-prd` with a simple feature
- [ ] Review generated PRD and understand structure
- [ ] Validate PRD with `/validate-spec`
- [ ] Try `/create-full-spec` for complete workflow
- [ ] Review all 4 generated specs
- [ ] Validate package with `/validate-spec specs/*/feature.*`
- [ ] Customize templates for your organization (optional)

## 📞 Support

For questions or issues:
1. Check this guide first
2. Review context files in `.opencode/context/spec-system/`
3. Run validation/review commands for specific feedback
4. Refer to template files for structure examples

## 📄 License

Part of the OpenAgents framework.

---

**Ready to create high-quality specifications?**

Start with:
```bash
/create-prd "Your feature description here"
```

Or create a complete package:
```bash
/create-full-spec "Your feature description here"
```
