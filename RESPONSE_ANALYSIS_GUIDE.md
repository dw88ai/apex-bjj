# Response Analysis Guide 📊

## How to Analyze Your Discovery Interview Results

---

## 📥 Step 1: Export Responses

1. Open your Google Form
2. Click **"Responses"** tab
3. Click green Sheets icon: **"View in Sheets"**
4. Google Sheets will open with all responses

---

## 🔍 Step 2: Key Metrics to Calculate

### Create these columns in your sheet:

**Column Headers to Add:**
```
| Response # | Name | Belt | Years | Frequency | Frustration (1-10) | Urgency (1-10) | Willing to Pay | Problem Category | Validated? |
```

---

## 📊 Step 3: Look for Patterns

### A. Problem Validation

**Count how many people mention similar problems in Q7, Q8, Q17:**

Common patterns to look for:
- ❌ "Can't remember what to work on"
- ❌ "Don't know if I'm improving"
- ❌ "Keep making same mistakes"
- ❌ "Stuck in [specific position]"
- ❌ "No feedback outside of class"
- ❌ "Don't know what to drill"

**Formula:**
```
If 70%+ mention the same core problem = VALIDATED ✅
If <50% mention similar problems = PIVOT NEEDED ⚠️
```

---

### B. Pain Intensity Analysis

**Q9: Frustration Level (1-10)**

Calculate average:
```
=AVERAGE(frustration_column)
```

**Success Threshold:**
- Average ≥ 7/10 = 🔥 Strong pain point
- Average 5-7/10 = ⚠️ Moderate pain
- Average <5/10 = ❌ Not painful enough

---

### C. Solution Urgency

**Q20: Problem Urgency (1-10)**

Calculate average:
```
=AVERAGE(urgency_column)
```

**Success Threshold:**
- Average ≥ 8/10 = 🔥 High motivation to solve
- Average 6-8/10 = ⚠️ Some motivation
- Average <6/10 = ❌ Low priority for users

---

### D. Willingness to Pay

**Q19: Worth per month**

Clean the data (remove $ signs), then:
```
=AVERAGE(willingness_to_pay_column)
```

**Success Threshold:**
- Average ≥ $10/mo = 🔥 Strong value perception
- Average $5-10/mo = ⚠️ Moderate value
- Average <$5/mo = ❌ Low perceived value

---

### E. Market Segmentation

**Count responses by segment:**

```
White Belt (0-2 years):  ___ responses
Blue/Purple (2-5 years): ___ responses
Brown/Black (5+ years):  ___ responses

Competitors:  ___ responses
Hobbyists:    ___ responses
```

**Look for:** Which segment has the most pain? Target them first.

---

## 🎯 Step 4: Create Summary Dashboard

### Copy this template into a new sheet:

```
═══════════════════════════════════════════════════════
              BJJ DISCOVERY INTERVIEW SUMMARY
═══════════════════════════════════════════════════════

RESPONSE RATE:
└─ Total Responses:           ___
└─ Target Achieved:           ___ / 15
└─ Completion Rate:           ___%

───────────────────────────────────────────────────────

PROBLEM VALIDATION:
└─ Avg Frustration Score:     ___ / 10
└─ Avg Urgency Score:         ___ / 10
└─ Common Problem Pattern:    [Write pattern]
└─ % Mentioning Same Issue:   ___%

✅ VALIDATED if frustration ≥7, urgency ≥7, pattern ≥70%

───────────────────────────────────────────────────────

VALUE PROPOSITION:
└─ Avg Willing to Pay:        $___/month
└─ Min Paid:                  $___
└─ Max Paid:                  $___
└─ Median:                    $___

✅ VIABLE if average ≥ $5/mo

───────────────────────────────────────────────────────

TOP 3 PAIN POINTS:
1. [Most mentioned issue from Q7, Q8, Q17]
2. [Second most common]
3. [Third most common]

───────────────────────────────────────────────────────

CURRENT SOLUTIONS (Q12, Q13):
└─ Using tracking now:        ___% (from Q12)
└─ Tried & stopped:           ___% 
└─ Never tried:               ___%

Most common reason for stopping: [From Q13 responses]

───────────────────────────────────────────────────────

QUOTES (Best verbatim from Q7, Q8, Q17):

"[Copy most compelling quote 1]"
- [Name], [Belt]

"[Copy most compelling quote 2]"
- [Name], [Belt]

"[Copy most compelling quote 3]"
- [Name], [Belt]

───────────────────────────────────────────────────────

TARGET MARKET:
Primary: [Belt level + training frequency with highest scores]
Secondary: [Next segment]

───────────────────────────────────────────────────────

DECISION:

🟢 BUILD IT - Problem validated, high urgency, willing to pay
🟡 PIVOT - Some validation, needs refinement
🔴 STOP - No clear problem or low urgency

Chosen: ___

Reasoning: [Your analysis]

═══════════════════════════════════════════════════════
```

---

## 📈 Step 5: Visual Analysis

### Create These Charts in Google Sheets:

1. **Frustration Distribution (Q9)**
   - Type: Bar chart
   - X-axis: Score (1-10)
   - Y-axis: Number of responses
   - **Look for:** Clustering at high end (7-10)

2. **Weak Areas (Q10)**
   - Type: Pie chart
   - Show: % selecting each area
   - **Look for:** One dominant area (>40%)

3. **Willingness to Pay (Q19)**
   - Type: Histogram
   - Bins: $0-5, $5-10, $10-15, $15+
   - **Look for:** Modal bin at $5-10+

4. **Frustration vs Urgency (Q9 vs Q20)**
   - Type: Scatter plot
   - X-axis: Frustration
   - Y-axis: Urgency
   - **Look for:** Top-right quadrant clustering

---

## 🚦 Decision Matrix

### Use This to Make Go/No-Go Decision:

```
CRITERIA                          SCORE    WEIGHT   WEIGHTED
─────────────────────────────────────────────────────────────
Problem Intensity (Avg Q9)        ___/10   x 0.25 = ___
Problem Urgency (Avg Q20)         ___/10   x 0.25 = ___
Pattern Consistency               ___/10   x 0.20 = ___
Willingness to Pay ($/2)          ___/10   x 0.15 = ___
Early Access Interest (Q22)       ___/10   x 0.10 = ___
Market Size (responses)           ___/10   x 0.05 = ___
─────────────────────────────────────────────────────────────
                            TOTAL SCORE:           ___/10

🟢 Score ≥ 7.0 → BUILD IT (Strong validation)
🟡 Score 5.0-7.0 → REFINE (Needs work)
🔴 Score < 5.0 → PIVOT/STOP (Not validated)
```

**How to Score Each:**
- Problem Intensity: Use Q9 average directly
- Problem Urgency: Use Q20 average directly
- Pattern Consistency: (% mentioning same issue) / 10
- Willingness to Pay: (Average $/month) / 2 (cap at 10)
- Early Access Interest: (% saying "Yes") / 10
- Market Size: (# responses) / 2 (10+ = full score)

---

## 💡 Red Flags to Watch For

### 🚨 STOP Signals:

1. **No Pattern**
   - Everyone mentions different problems
   - No common thread in Q7, Q8, Q17
   - Action: Pivot to different problem

2. **Low Pain**
   - Avg frustration (Q9) < 5/10
   - Avg urgency (Q20) < 6/10
   - Action: Find more painful problem

3. **"Nice to Have"**
   - Responses like "it would be cool..."
   - Low willingness to pay (<$3/mo avg)
   - Action: Not urgent enough, pivot

4. **Already Solved**
   - Q12: Most say "Yes, regularly" tracking
   - Q13: Happy with current solutions
   - Action: You're too late or not differentiated

5. **Wrong Segment**
   - Only white belts respond (narrow market)
   - Or only black belts respond (too niche)
   - Action: Adjust positioning

---

## ✅ Green Flags (Keep Going!)

### 🟢 BUILD Signals:

1. **Clear Pattern**
   - 70%+ mention same core problem
   - Emotional language in responses
   - Specific recent examples (Q7)

2. **High Pain**
   - Avg frustration ≥ 7/10
   - Avg urgency ≥ 8/10
   - Multiple attempts to solve (Q18)

3. **Willing to Pay**
   - Avg ≥ $8/mo
   - Some say $15-20/mo
   - Compare to gym membership willingly

4. **Already Trying**
   - Q12: Many tried tracking but stopped
   - Q13: Frustrated with current tools
   - Gap between intent and execution

5. **Eager for Solution**
   - Q22: >60% want early access
   - Q21: Offering referrals unprompted
   - Following up after form

---

## 📋 Next Steps Based on Results

### If Score ≥ 7.0 (Validated):

1. ✅ Send thank you to all respondents
2. ✅ Do 3-5 follow-up interviews (15 min calls)
3. ✅ Draft product positioning based on Q17
4. ✅ Prioritize features based on pain points
5. ✅ Build MVP focused on #1 problem
6. ✅ Keep early access list engaged

### If Score 5.0-7.0 (Needs Work):

1. ⚠️ Identify which metric is low
2. ⚠️ Do 5 more targeted interviews
3. ⚠️ Refine problem hypothesis
4. ⚠️ Test adjusted positioning
5. ⚠️ Don't build yet

### If Score < 5.0 (Pivot):

1. ❌ Thank respondents for honesty
2. ❌ Analyze for different problem angles
3. ❌ Interview different segment
4. ❌ Or try different idea entirely
5. ❌ Don't build this version

---

## 🎯 Sample Analysis (What Good Looks Like)

### Example Good Result:

```
Total Responses: 18
Avg Frustration: 8.2/10 🔥
Avg Urgency: 8.7/10 🔥
Pattern: 83% mention "can't remember what to work on between sessions"
Avg Willing to Pay: $12/month 💰
Early Access: 78% want updates

DECISION: ✅ BUILD IT

Insight: White/blue belts (1-3 years) have highest pain.
They're past beginner stage but lack structure.
Current solutions (notes apps) don't work because too much friction.

Next: Build simple post-training voice logging MVP.
Target: White/blue belts training 3-4x/week.
```

---

**Remember:** You're looking for a painful, urgent, specific problem that people will pay to solve. If responses are lukewarm, that's valuable data telling you to pivot!

---

## 📞 Follow-Up Interview Questions

For 3-5 most interesting respondents:

1. "You mentioned [problem from Q17]. Tell me more about the last time that happened."
2. "Walk me through exactly what you do after training right now."
3. "If I showed you a prototype that [solved their problem], would you use it?"
4. "What would stop you from using it?"
5. "Would you pay $X/month for this?"

Keep notes. Look for excitement vs. politeness.

---

Good luck analyzing! 📊
