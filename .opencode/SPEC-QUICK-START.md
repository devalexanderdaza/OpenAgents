# SPEC Pattern System - Quick Start Guide

**Get started with SPEC pattern documentation in under 5 minutes.**

## What You'll Create

The SPEC Pattern System helps you create 4 types of documents:
- **PRD** - Product Requirements (business needs, user stories)
- **DESIGN** - UI/UX Specifications (user flows, components)
- **ARCHITECTURE** - Technical Design (system components, APIs, data models)
- **TASK** - Implementation Tasks (work breakdown, dependencies)

## Installation

The system is already installed in `.opencode/`. No additional setup needed!

## Quick Start: Create Your First PRD

### Step 1: Run the Command (2 minutes)

```bash
/create-prd "User profile feature with name, email, bio, and avatar upload"
```

### Step 2: Review the Output

The system creates: `specs/prd/user-profile.prd.md`

Open it and you'll see:
- ✅ Problem statement
- ✅ Business and user goals
- ✅ User personas
- ✅ 5-8 user stories with acceptance criteria
- ✅ Functional requirements (FR-001, FR-002, etc.)
- ✅ Non-functional requirements (performance, security)
- ✅ Measurable success criteria
- ✅ Stakeholder table
- ✅ Quality score: 8+/10

### Step 3: Customize (Optional)

Edit the generated PRD to:
- Add more specific business context
- Refine user stories based on your domain
- Add stakeholder names
- Adjust success criteria targets

### Step 4: Validate

```bash
/validate-spec specs/prd/user-profile.prd.md
```

You'll get:
- Quality score (0-10)
- Specific issues (if any)
- Actionable recommendations

## Quick Start: Create Complete Spec Package

### One Command for All 4 Specs (15 minutes)

```bash
/create-full-spec "User authentication with email/password and Google OAuth"
```

This creates:
1. PRD at `specs/prd/user-authentication.prd.md`
2. DESIGN at `specs/design/user-authentication.design.md`
3. ARCHITECTURE at `specs/architecture/user-authentication.architecture.md`
4. TASK at `specs/tasks/user-authentication.tasks.md`

All interconnected and consistent!

### What You Get

**PRD** (Business Requirements):
- Problem and solution
- 8-12 user stories
- Success metrics
- Stakeholders

**DESIGN** (UI/UX):
- User flows for each story
- UI components and states
- Interaction patterns
- Accessibility requirements

**ARCHITECTURE** (Technical):
- System components
- Database schema
- API endpoints
- Security design

**TASK** (Implementation):
- 20-40 granular tasks
- Acceptance criteria per task
- Dependency graph
- Effort estimates

## Essential Commands

| Command | What It Does | Time |
|---------|-------------|------|
| `/create-prd "feature"` | Create PRD only | 2-4 min |
| `/create-full-spec "feature"` | Create all 4 specs | 12-18 min |
| `/validate-spec path/to/spec.md` | Check quality | < 1 min |
| `/review-spec path/to/spec.md` | Get improvement tips | 2-3 min |

## Example Use Cases

### Use Case 1: Planning New Feature

**Situation**: Product manager needs to document new feature for engineering

**Solution**:
```bash
/create-prd "Shopping cart abandonment recovery emails with personalized product recommendations"
```

**Result**: Complete PRD ready for stakeholder review in 3 minutes

### Use Case 2: Handing Off to Engineering

**Situation**: Design approved, need technical specs for development

**Solution**:
```bash
# 1. You have: specs/prd/cart-recovery.prd.md
# 2. Create design:
/create-design specs/prd/cart-recovery.prd.md

# 3. Create architecture:
/create-architecture specs/prd/cart-recovery.prd.md specs/design/cart-recovery.design.md

# 4. Create tasks:
/create-tasks specs/architecture/cart-recovery.architecture.md
```

**Result**: Complete technical handoff package ready for sprint planning

### Use Case 3: Fast Complete Documentation

**Situation**: Need all specs for complex feature, fast

**Solution**:
```bash
/create-full-spec "Real-time collaborative document editing with presence indicators, cursors, and conflict resolution"
```

**Result**: All 4 specs in 15 minutes

## Typical Workflow

### Option 1: Sequential (More Control)

```
Week 1: Create PRD
   ↓
Review & approve with stakeholders
   ↓
Week 2: Create DESIGN
   ↓
Review & approve with design team
   ↓
Week 3: Create ARCHITECTURE
   ↓
Review & approve with tech lead
   ↓
Week 4: Create TASKS
   ↓
Start development
```

### Option 2: Fast Track (Speed)

```
Day 1: Create full package (15 min)
   ↓
Day 2-3: Review all specs
   ↓
Day 4: Refine based on feedback
   ↓
Day 5: Get approvals
   ↓
Week 2: Start development
```

## Quality Guarantee

Every generated spec:
- ✅ Scores 8+/10 on quality criteria
- ✅ Follows industry best practices
- ✅ Includes all required sections
- ✅ Has proper cross-references
- ✅ Is implementation-ready

## Common Questions

**Q: Can I edit generated specs?**  
A: Yes! They're starting points. Add your domain expertise.

**Q: What if I don't like something?**  
A: Just edit it. Or run `/review-spec` for suggestions.

**Q: Do I need all 4 specs?**  
A: No. Create what you need:
- Small feature: Just PRD
- Medium feature: PRD + DESIGN or PRD + ARCHITECTURE
- Large feature: All 4

**Q: Can I create just ARCHITECTURE without PRD?**  
A: Technically yes, but you'll need to provide requirements manually. PRD provides essential context.

**Q: How do I update specs when requirements change?**  
A: Edit the PRD, then regenerate dependent specs (DESIGN, ARCHITECTURE, TASK).

## Next Steps

1. **Try it now**: Run `/create-prd "your feature idea"`
2. **Review output**: See what it generates
3. **Validate**: Run `/validate-spec` on your PRD
4. **Customize**: Edit to match your needs
5. **Extend**: Create DESIGN, ARCHITECTURE, TASK as needed

## Getting Help

- **Full Guide**: See `.opencode/SPEC-SYSTEM-GUIDE.md`
- **Testing**: See `.opencode/SPEC-TESTING-CHECKLIST.md`
- **Templates**: Check `.opencode/context/spec-system/templates/`
- **Examples**: Look in `specs/` after generating your first specs

## Tips for Success

1. **Be Specific**: Better input = better output
   - ❌ "user management"
   - ✅ "user registration with email verification and password reset"

2. **Review and Refine**: Generated specs are great starting points
   - Add domain-specific details
   - Refine based on your context
   - Get stakeholder input

3. **Validate Early**: Catch issues before implementation
   ```bash
   /validate-spec specs/prd/feature.prd.md
   ```

4. **Keep Updated**: Update specs when requirements change
   - Edit PRD first
   - Regenerate dependent specs
   - Validate consistency

5. **Use Traceability**: Reference requirements throughout
   - PRD has FR-001, FR-002, US-001, etc.
   - DESIGN references these: "Implements FR-001, US-003"
   - ARCHITECTURE references DESIGN components
   - TASK references ARCHITECTURE components

## Ready?

Start now:

```bash
/create-prd "Your feature description here"
```

Or create everything at once:

```bash
/create-full-spec "Your feature description here"
```

---

**Questions?** Check the full guide: `.opencode/SPEC-SYSTEM-GUIDE.md`

**Need help?** Run `/validate-spec` or `/review-spec` for guidance!
