export default function GuideView() {
  return (
    <div className="guide">
      <header className="page-head">
        <h1>📖 The Guide</h1>
        <p className="lead">
          How this whole thing works — and why. Built for one family; meant to be customized by yours.
        </p>
      </header>

      <section className="guide-block">
        <h2 className="section-title">The idea in one paragraph</h2>
        <p>
          A visual, motivating skill tree for raising kids who are genuinely ready to leave home, roughly
          ages nine to eighteen. It runs on two parallel tracks. <strong>Track A, the Skill Tree:</strong>{' '}
          kids build real capabilities — cooking, budgeting, resilience, faith, serving others — and earn
          expanded freedom as they demonstrate them. <em>Competence buys autonomy.</em>{' '}
          <strong>Track B, the Emancipation Track:</strong> a schedule of freedoms handed over by age,
          unconditionally — music, clothes, friends, beliefs, free time — because some autonomy can't be
          earned without starting a control battle. A launched adult needs both: capable, <em>and</em>{' '}
          progressively treated as an adult.
        </p>
      </section>

      <section className="guide-block">
        <h2 className="section-title">The node — the heart of it</h2>
        <p>
          Every node is a <strong>skill</strong>: a capability you can <em>do or be</em> — never an
          activity, never a fact. Each one carries:
        </p>
        <ul>
          <li><strong>Got it when</strong> — observable mastery, written to the kid ("you…"). Reached by <em>matching the description</em>, never by counting reps.</li>
          <li><strong>It looks like</strong> — concrete situations, small to large, so it's self-recognizable.</li>
          <li><strong>Ways to build it</strong> — suggestions only. Many roads in; none of them gate.</li>
          <li><strong>Comes after</strong> — prerequisites. The graph is the skeleton; <em>age is only a tint</em> ("rarely before ~eleven," never "should have by eleven").</li>
          <li><strong>An assessment mode</strong> — self-check, debrief (a conversation), or observed.</li>
        </ul>
        <p>
          Three states per kid: <strong>not yet · working on it · got it</strong>. "Working on it" is the
          normal, non-failing state. And any skill can be marked "got it" on sight — the tree recognizes
          what's already there; it never assigns busywork.
        </p>
        <p className="callout">
          The governing test for every node: <em>reading this about myself, would I honestly know whether
          I have it?</em>
        </p>
      </section>

      <section className="guide-block">
        <h2 className="section-title">Why freedom, not treats</h2>
        <p>
          Rewards are expanded autonomy, never prizes. Tangible rewards can smother intrinsic motivation
          (the overjustification effect); expanded freedom strengthens it. Celebrations are rare and
          finale-only. Intrinsic joys are never turned into chores. And the three character lanes get the
          lightest possible touch — shared language for noticing growth <em>with</em> a kid, never a
          scorecard kept <em>about</em> them.
        </p>
      </section>

      <section className="guide-block">
        <h2 className="section-title">The two tracks, sorted honestly</h2>
        <p>
          For anything you're tempted to gate, ask: <em>could I actually enforce this if they decided
          otherwise?</em> If no — music, clothes, friends, beliefs, free time — it belongs on the{' '}
          <a href="#/emancipation">Emancipation calendar</a>; gating it is a fiction that costs influence.
          If yes, with physical or financial stakes — driving alone, a credit card, being in charge at
          home — it's a skill-tree unlock. Some things (money, driving) are honestly both.
        </p>
        <p>
          The Emancipation Track's four rules: announce it before it arrives · it arrives regardless of
          performance · it never comes back · boundaries exist only to protect everyone else. A privilege
          is "I'll be nice and let you." A freedom is <strong>"it's no longer up to me."</strong>
        </p>
      </section>

      <section className="guide-block">
        <h2 className="section-title">Using it without ruining it</h2>
        <ul>
          <li>Start with the <a href="#/recognition">recognition pass</a> — mark everything that's already true. First sessions should feel like recognition, not assignment.</li>
          <li>Check in with one kid on one lane at a time — set it as the <em>focus</em> and give it a fortnight. The 🖨 check-in sheet on each lane exists for a paper-first conversation.</li>
          <li>Disagree about whether a skill is "got"? The description arbitrates — if it can't, the description needs editing, and that's a finding, not a fight.</li>
          <li>Character lanes are conversation fuel. If a character check-in ever feels like a performance review, stop and shrink it.</li>
          <li>Move ages. Rewrite nodes. A calendar you can move is not a commitment you're locked into. The system is meant to be customized, not obeyed.</li>
        </ul>
      </section>

      <section className="guide-block">
        <h2 className="section-title">Evaluating without corrupting it</h2>
        <ul>
          <li>
            <strong>Debrief on Tuesday, mark on Thursday.</strong> Have the conversation for its own
            sake; touch the app later, alone. The honest version of a hard conversation can't coexist
            with a kid watching for the checkbox at the end of it.
          </li>
          <li>
            <strong>A self-check belongs to the kid.</strong> If the node says only they can know,
            then only they can mark it — hand them the phone, or let their word set it. The app records
            whose hand did the marking.
          </li>
          <li>
            <strong>Watch for unlock pressure.</strong> The bigger the freedom a node gates, the more a
            debrief wants to become a negotiation. The description arbitrates; if you feel yourself
            rubber-stamping to keep the peace, slow the unlock down, not the honesty.
          </li>
          <li>
            <strong>Regression is the ladder, not a demotion.</strong> Skills that were true at eleven
            can stop being true at thirteen — that's development, not failure. Re-open the node; the
            first "got it" date stays. Never treat re-opening as taking something away.
          </li>
          <li>
            <strong>🪶 Light-touch nodes</strong> are dispositions living in competence lanes —
            attention, footprint, inner weather. They're never gates and never counted; read them
            together and mark them in retrospect, the way you'd treat a character lane.
          </li>
          <li>
            <strong>Never compare trees.</strong> With several kids in one app, a leaderboard is one
            glance away. The tree is a mirror held up to one kid, not a race between them — different
            kids should even get different amounts of the app itself: a systems kid can self-serve;
            a private kid may only ever need the paper sheet and your better attention.
          </li>
        </ul>
      </section>

      <section className="guide-block">
        <h2 className="section-title">Credits & sources</h2>
        <p>
          Track B adapts Ken Wilgus's <em>Planned Emancipation</em> (from <em>Feeding the Mouth That
          Bites You</em>). The skill tree and node model are original to this family project.
        </p>
      </section>
    </div>
  )
}
