import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, Mic, Layers, ListChecks, BarChart3, ChevronRight, ChevronLeft, RotateCcw, Check, X, Eye, Shuffle, Scale, GraduationCap, Sparkles, Landmark, Brain, Gavel, FileText, CalendarClock, ExternalLink, Map } from 'lucide-react';

// =====================================================================
// CASE DATA — High-yield landmark cases for forensic psychiatry boards
// =====================================================================
const CASES = [
  // ---- Drugs, Alcohol, and Specific Intent ----
  { id: 'robinson', name: 'Robinson v. California', year: 1962, court: 'SCOTUS', category: 'Drugs & Specific Intent',
    facts: 'CA criminalized drug addiction as a status (90-day minimum); defendant had track marks but no current illegal conduct.',
    issue: 'Does criminalizing addiction as a status violate the 8th Amendment?',
    holding: 'Yes. Status (addiction = illness) cannot be criminalized. "Even one day in prison would be cruel and unusual for the crime of having the common cold."',
    significance: 'Addiction is illness, not crime; status vs. conduct distinction.',
    elements: ['Status vs. conduct', 'Addiction = illness', '8th Amendment cruel and unusual'] },
  { id: 'powell', name: 'Powell v. Texas', year: 1968, court: 'SCOTUS', category: 'Drugs & Specific Intent',
    facts: 'Chronic alcoholic charged with public drunkenness; argued involuntary status.',
    issue: 'Does criminalizing public intoxication of an alcoholic equal punishing a status?',
    holding: 'No. Punishing conduct (public drunkenness) is constitutional even if alcoholism is involuntary.',
    significance: 'Limits Robinson; states may criminalize conduct even if illness-driven.',
    elements: ['Punishes conduct, not status', 'States may regulate behavior even if illness-driven'] },

  // ---- Competence to Stand Trial ----
  { id: 'dusky', name: 'Dusky v. U.S.', year: 1960, court: 'SCOTUS', category: 'Competence to Stand Trial',
    facts: 'Schizophrenic defendant convicted of kidnapping and rape; competency challenged.',
    issue: 'What is the appropriate legal standard for competence to stand trial?',
    holding: 'Defendant must have (1) rational AND factual understanding of proceedings, AND (2) ability to consult with counsel with a reasonable degree of rational understanding.',
    significance: 'Foundational two-prong competence standard. Still the governing federal test.',
    elements: ['Rational understanding of proceedings', 'Factual understanding of proceedings', 'Ability to consult with counsel rationally'] },
  { id: 'wilson', name: 'Wilson v. U.S.', year: 1968, court: 'D.C. Cir.', category: 'Competence to Stand Trial',
    facts: 'Defendant fled police, hit a tree, was unconscious 3 weeks, total amnesia for offense; found CST.',
    issue: 'Does amnesia for the offense equal incompetence?',
    holding: 'No per se rule. Remanded with factors: effect on assisting counsel/testifying; strength of evidence; whether evidence can be extrinsically reconstructed.',
    significance: 'Amnesia alone ≠ incompetence; case-by-case Wilson factors.',
    elements: ['Effect on assisting counsel', 'Effect on testifying', 'Strength of extrinsic evidence', 'Ability to reconstruct evidence'] },
  { id: 'jackson', name: 'Jackson v. Indiana', year: 1972, court: 'SCOTUS', category: 'Competence to Stand Trial',
    facts: 'Deaf, intellectually disabled man stole purses <$10; found unrestorably incompetent; held indefinitely.',
    issue: 'Can an IST defendant be confined indefinitely?',
    holding: 'No. Held only for a reasonable period to determine restoration potential. If unrestorable, must release or civilly commit. Violates 14th Amendment DP and EP.',
    significance: 'Limits length of restoration commitment.',
    elements: ['Reasonable period only', 'If unrestorable → release or civil commit', 'Cannot indefinitely hold based on IST alone'] },
  { id: 'riggins', name: 'Riggins v. Nevada', year: 1992, court: 'SCOTUS', category: 'Competence to Stand Trial',
    facts: 'Defendant on antipsychotics moved to suspend forced medication for trial; denied; sentenced to death.',
    issue: 'Does forced antipsychotic medication during trial violate 6th and 14th Amendment rights?',
    holding: 'Yes — without showing of medical appropriateness and consideration of less restrictive alternatives, forced meds violate due process.',
    significance: 'Forced meds at trial require medical appropriateness + less restrictive alternatives considered.',
    elements: ['Medical appropriateness', 'Less restrictive alternatives', 'Essential for safety or fair trial'] },
  { id: 'godinez', name: 'Godinez v. Moran', year: 1993, court: 'SCOTUS', category: 'Competence to Stand Trial',
    facts: 'Defendant killed wife and bartenders; found CST; wanted to plead guilty and represent self; sentenced to death.',
    issue: 'Is competence to plead guilty / waive counsel a higher standard than CST?',
    holding: 'No — same standard as Dusky. But waiver must also be knowing, voluntary, and intelligent.',
    significance: 'Single competence standard; separate knowing/voluntary/intelligent waiver inquiry.',
    elements: ['Same as Dusky standard', 'Plus knowing/voluntary/intelligent waiver'] },
  { id: 'cooper', name: 'Cooper v. Oklahoma', year: 1996, court: 'SCOTUS', category: 'Competence to Stand Trial',
    facts: 'Cooper raised competence 5x; OK required defendant to prove incompetence by clear and convincing evidence.',
    issue: 'Can a state require defendant to prove incompetence by clear and convincing evidence?',
    holding: 'No. Violates due process. Preponderance is the maximum permissible burden on defendant.',
    significance: 'Preponderance is ceiling for defendant\'s IST burden. Competence is presumed.',
    elements: ['Competence presumed', 'Defendant burden ≤ preponderance', 'Higher burden violates due process'] },
  { id: 'sell', name: 'Sell v. U.S.', year: 2003, court: 'SCOTUS', category: 'Competence to Stand Trial',
    facts: 'Dentist Sell charged with fraud and attempted murder; IST; refused antipsychotics; forcibly medicated solely to restore competence.',
    issue: 'May the government forcibly medicate a non-dangerous defendant solely to restore competence?',
    holding: 'Only if four Sell criteria met. Courts should first consider Harper (dangerousness) and Riggins routes.',
    significance: 'Strict criteria for forced meds to restore competence; rarely-invoked.',
    elements: ['Important government interest', 'Substantially furthers that interest', 'Necessary (no less intrusive alternative)', 'Medically appropriate'] },
  { id: 'edwards', name: 'Indiana v. Edwards', year: 2008, court: 'SCOTUS', category: 'Competence to Stand Trial',
    facts: 'Edwards was CST but severely mentally ill; wanted to represent himself.',
    issue: 'May states require higher competence for self-representation than for trial?',
    holding: 'Yes. States may insist on counsel for "gray-area" defendants who are CST but cannot conduct trial themselves.',
    significance: 'Carves exception to Faretta and Godinez.',
    elements: ['CST does not = competent to self-represent', 'States MAY (not must) require higher standard', 'Preserves trial dignity/fairness'] },

  // ---- Defendant's Rights ----
  { id: 'alford', name: 'North Carolina v. Alford', year: 1970, court: 'SCOTUS', category: "Defendant's Rights",
    facts: 'Defendant pled guilty to murder to avoid death penalty while maintaining innocence.',
    issue: 'Can a court accept a guilty plea from a defendant who maintains innocence?',
    holding: 'Yes, if plea is voluntary and intelligent with understanding of consequences and strong factual basis.',
    significance: 'The "Alford plea" — guilty plea without admission of guilt.',
    elements: ['Voluntary', 'Intelligent', 'Understanding of consequences', 'Strong factual basis for guilt'] },
  { id: 'connelly', name: 'Colorado v. Connelly', year: 1986, court: 'SCOTUS', category: "Defendant's Rights",
    facts: 'Psychotic man approached police and confessed to murder due to "voice of God"; no police coercion.',
    issue: 'Does mental illness alone make a confession involuntary?',
    holding: 'No. Coercive police activity is a necessary predicate to finding a confession involuntary.',
    significance: 'Internal compulsion ≠ involuntariness without state action.',
    elements: ['Police coercion required', 'Mental illness alone insufficient', 'State action necessary'] },

  // ---- Expert Witness ----
  { id: 'frye', name: 'Frye v. U.S.', year: 1923, court: 'D.C. Cir.', category: 'Expert Witness',
    facts: 'Murder conviction; early lie-detector (systolic BP) evidence excluded.',
    issue: 'Standard for admissibility of novel scientific evidence?',
    holding: '"General acceptance" in the relevant scientific community.',
    significance: 'Frye standard — still used in some states (NY, CA, others).',
    elements: ['General acceptance', 'Relevant scientific community'] },
  { id: 'daubert', name: 'Daubert v. Merrell Dow', year: 1993, court: 'SCOTUS', category: 'Expert Witness',
    facts: 'Children with birth defects sued; expert challenged Bendectin link.',
    issue: 'Does Frye still govern, or does FRE 702 supersede?',
    holding: 'FRE 702 supersedes Frye. Judge is gatekeeper. Apply Daubert factors.',
    significance: 'Modern federal standard; judge as gatekeeper.',
    elements: ['Testable/falsifiable', 'Peer reviewed/published', 'Known error rate', 'Standards & controls', 'General acceptance'] },
  { id: 'kumho', name: 'Kumho Tire v. Carmichael', year: 1999, court: 'SCOTUS', category: 'Expert Witness',
    facts: 'Blown tire killed driver; tire-failure expert testified about manufacturing defect.',
    issue: 'Does Daubert apply only to scientific experts or all experts?',
    holding: 'Daubert applies to ALL expert testimony — technical and specialized knowledge too.',
    significance: 'Extends gatekeeping beyond hard science.',
    elements: ['Applies to scientific AND technical/specialized', 'Flexible application of factors'] },

  // ---- Insanity Defense ----
  { id: 'mnaghten', name: "M'Naghten's Case", year: 1843, court: 'House of Lords', category: 'Insanity Defense',
    facts: "Paranoid delusional M'Naghten attempted to kill PM Peel; killed secretary Drummond; found NGRI.",
    issue: 'What defines legal insanity?',
    holding: 'Defect of reason from disease of mind such that defendant (1) did not know nature/quality of act, OR (2) did not know it was wrong.',
    significance: 'Foundational cognitive-only test. Adopted broadly in U.S.',
    elements: ['Defect of reason', 'Disease of the mind', "Didn't know nature/quality of act", "Didn't know act was wrong"] },
  { id: 'durham', name: 'Durham v. U.S.', year: 1954, court: 'D.C. Cir.', category: 'Insanity Defense',
    facts: 'Mentally ill burglar; Judge Bazelon rejected M\'Naghten alone.',
    issue: 'Should "right/wrong" test alone govern legal insanity?',
    holding: '"Product test": not criminally responsible if act was the product of mental disease or defect.',
    significance: 'Gave psychiatrists outsized role; abandoned even in DC.',
    elements: ['Product of mental disease or defect', 'Causal link required'] },
  { id: 'washington_us', name: 'Washington v. U.S.', year: 1967, court: 'D.C. Cir.', category: 'Insanity Defense',
    facts: 'Washington convicted of rape/robbery/assault; insanity defense unsuccessful (Bazelon).',
    issue: 'How to apply product test? May experts testify on ultimate issue?',
    holding: 'Affirmed. Psychiatrists may NOT testify on ultimate issue. They must explain how disease relates to behavior, not speak in terms of "product" or "cause."',
    significance: 'Prevents psychiatrist from becoming "13th juror."',
    elements: ['No ultimate-issue testimony', 'Explain dynamic relationship', 'Communicate clearly to jury'] },
  { id: 'frendak', name: 'Frendak v. U.S.', year: 1979, court: 'D.C. Cir.', category: 'Insanity Defense',
    facts: 'Frendak killed coworker; declined insanity defense; judge imposed it; found NGRI.',
    issue: 'Can a court impose an insanity defense on a competent, unwilling defendant?',
    holding: 'No — if the defendant intelligently and voluntarily waives it. Hearing required.',
    significance: 'CST defendant may refuse NGRI defense.',
    elements: ['CST', 'Knowing waiver', 'Intelligent waiver', 'Voluntary waiver'] },
  { id: 'clark', name: 'Clark v. Arizona', year: 2006, court: 'SCOTUS', category: 'Insanity Defense',
    facts: 'Schizophrenic Clark shot police officer believing aliens; AZ used only moral-wrongfulness prong; restricted mens rea evidence.',
    issue: 'Can a state restrict the insanity test? Restrict mental illness evidence on mens rea?',
    holding: 'Yes to both. States have wide latitude in defining insanity.',
    significance: 'Constitution does not mandate a particular insanity test.',
    elements: ['No constitutional requirement of full test', 'States may restrict mens rea evidence'] },
  { id: 'kahler', name: 'Kahler v. Kansas', year: 2020, court: 'SCOTUS', category: 'Insanity Defense',
    facts: 'Kahler killed 4 family members; Kansas allows mental illness only on mens rea (cognitive incapacity only).',
    issue: 'Does due process require a moral-incapacity insanity defense?',
    holding: 'No. States may abolish moral-incapacity NGRI; mens rea approach is constitutional.',
    significance: 'States can effectively eliminate traditional insanity defense.',
    elements: ['No constitutional NGRI right', 'Mens rea approach permissible'] },

  // ---- NGRI Release / Post-Acquittal ----
  { id: 'jones', name: 'Jones v. U.S.', year: 1983, court: 'SCOTUS', category: 'NGRI Release',
    facts: 'Jones found NGRI for attempted petty larceny (jacket); held >4 years (max sentence: 1 year).',
    issue: 'May NGRI acquittees be confined beyond potential criminal sentence? What standard of proof?',
    holding: 'Yes. NGRI verdict supports automatic commitment; preponderance standard sufficient.',
    significance: 'NGRI acquittees treated differently from civil committees.',
    elements: ['Automatic commitment OK', 'Indefinite confinement OK', 'Preponderance standard', 'Not "similarly situated" to convicted criminals'] },
  { id: 'foucha', name: 'Foucha v. Louisiana', year: 1992, court: 'SCOTUS', category: 'NGRI Release',
    facts: 'Foucha found NGRI; recovered from psychosis but still had ASPD; LA kept him committed.',
    issue: 'Can an NGRI acquittee be confined when no longer mentally ill but still dangerous?',
    holding: 'No. Continued confinement requires BOTH mental illness AND dangerousness.',
    significance: 'Limits Jones — ASPD alone insufficient to confine.',
    elements: ['Mental illness AND dangerousness required', 'ASPD alone insufficient', 'Cannot indefinitely confine purely on dangerousness'] },
  { id: 'idra', name: 'Insanity Defense Reform Act', year: 1984, court: 'Federal Statute', category: 'NGRI Release',
    facts: 'Enacted after Hinckley NGRI verdict (Reagan assassination attempt) to narrow federal insanity defense.',
    issue: 'How is the federal insanity defense defined? Burden of proof?',
    holding: 'Defendant NGRI only if, due to severe mental disease/defect, unable to appreciate wrongfulness. Volitional prong eliminated. Defendant burden by clear and convincing evidence.',
    significance: 'Narrowed federal insanity to cognitive-only; shifted burden to defendant; created GBMI verdict alternative.',
    elements: ['Severe mental disease/defect', 'Unable to appreciate wrongfulness', 'Burden on defendant', 'Clear and convincing evidence'] },
  { id: 'burton', name: 'In re Burton', year: 2006, court: 'D.C. Ct. App.', category: 'NGRI Release',
    facts: 'NGRI acquittee at St. Elizabeths; staff found him no longer mentally ill or dangerous; government contested release.',
    issue: 'Who bears the burden of proof at DC conditional release proceedings?',
    holding: 'Government bears burden of proving continued mental illness and dangerousness by preponderance.',
    significance: 'Once acquittee shows substantial change, burden shifts to government.',
    elements: ['Government burden', 'Preponderance', 'Totality of circumstances'] },

  // ---- Prisoner's Rights ----
  { id: 'baxstrom', name: 'Baxstrom v. Herold', year: 1966, court: 'SCOTUS', category: "Prisoner's Rights",
    facts: 'Baxstrom transferred from prison to psychiatric hospital at end of sentence without civil commitment procedures.',
    issue: 'Can a prisoner be transferred to a hospital at sentence-end without civil commitment procedures?',
    holding: 'No. Equal protection requires same procedures as for civil committees.',
    significance: '"Baxstrom patients" — many released afterward; few were actually dangerous.',
    elements: ['Equal protection', 'Same procedures as civil commitment', 'No special prisoner track'] },
  { id: 'vitek', name: 'Vitek v. Jones', year: 1980, court: 'SCOTUS', category: "Prisoner's Rights",
    facts: 'NE transferred prisoner Jones to state psychiatric hospital without hearing.',
    issue: 'Does prison-to-psychiatric-hospital transfer require due process?',
    holding: 'Yes. Liberty interest at stake; requires notice, hearing, evidence, counsel-equivalent assistance.',
    significance: '"Massive curtailment of liberty"; stigma + treatment distinct from prison.',
    elements: ['Written notice', 'Adversarial hearing', 'Independent decisionmaker', 'Right to assistance'] },
  { id: 'estelle_gamble', name: 'Estelle v. Gamble', year: 1976, court: 'SCOTUS', category: "Prisoner's Rights",
    facts: 'Inmate Gamble injured back; alleged inadequate medical care; punished for not working.',
    issue: 'When does inadequate prison medical care violate the 8th Amendment?',
    holding: '"Deliberate indifference to serious medical needs" violates 8th Amendment. Here, not met — mere malpractice insufficient.',
    significance: 'Foundational prison medical care standard; includes mental health.',
    elements: ['Deliberate indifference (subjective)', 'Serious medical need (objective)', 'Mere negligence insufficient'] },
  { id: 'farmer', name: 'Farmer v. Brennan', year: 1994, court: 'SCOTUS', category: "Prisoner's Rights",
    facts: 'Transgender inmate raped in male prison; sued for failure to protect.',
    issue: 'What is the standard for "deliberate indifference"?',
    holding: 'Subjective recklessness — official must KNOW of and disregard excessive risk.',
    significance: 'Defines deliberate indifference; subjective awareness required.',
    elements: ['Subjective awareness', 'Of substantial risk', 'Disregard of that risk'] },
  { id: 'brown_plata', name: 'Brown v. Plata', year: 2011, court: 'SCOTUS', category: "Prisoner's Rights",
    facts: 'CA prison overcrowding led to class actions over inadequate mental health and medical care.',
    issue: 'Did a court order to reduce CA prison overcrowding violate the Prison Litigation Reform Act?',
    holding: 'No. Population cap permitted under PLRA to remedy 8th Amendment violations from overcrowding.',
    significance: 'Scalia called it "most radical injunction in our Nation\'s history." Affirmed prisoner mental health rights.',
    elements: ['Population cap permissible', 'Overcrowding caused violations', 'PLRA authorized remedy'] },

  // ---- Death Penalty ----
  { id: 'estelle_smith', name: 'Estelle v. Smith', year: 1981, court: 'SCOTUS', category: 'Death Penalty',
    facts: 'Smith evaluated for competence by Dr. "Death" Grigson; psychiatrist later testified at sentencing on future dangerousness without warnings.',
    issue: 'Does pretrial psychiatric exam used at capital sentencing violate 5th and 6th Amendments?',
    holding: 'Yes — defendant must be warned and counsel notified if statements may be used at sentencing.',
    significance: 'Source of the "Estelle warning"; forensic warning practice.',
    elements: ['Miranda-like warning required', 'Notice to counsel', 'Applies when used at sentencing'] },
  { id: 'barefoot', name: 'Barefoot v. Estelle', year: 1983, court: 'SCOTUS', category: 'Death Penalty',
    facts: 'Psychiatrists testified to future dangerousness without examining Barefoot; APA filed amicus opposing.',
    issue: 'Is psychiatric testimony about future dangerousness — even without exam — admissible at capital sentencing?',
    holding: 'Yes. Jury can weigh credibility through cross-examination. Court rejected APA brief.',
    significance: 'Controversial; allows hypothetical testimony despite poor predictive accuracy.',
    elements: ['Future dangerousness testimony admissible', 'No examination required', 'Cross-exam adequate safeguard'] },
  { id: 'ake', name: 'Ake v. Oklahoma', year: 1985, court: 'SCOTUS', category: 'Death Penalty',
    facts: 'Indigent defendant\'s sanity at issue; OK refused to provide psychiatric expert.',
    issue: 'Does due process require the state to provide a psychiatric expert for indigent defendants when sanity is at issue?',
    holding: 'Yes — state must provide competent psychiatrist for evaluation and assistance.',
    significance: 'Foundational right to psychiatric assistance; extension of Gideon.',
    elements: ['Sanity significantly at issue', 'Indigent defendant', 'State-funded psychiatric expert'] },
  { id: 'ford', name: 'Ford v. Wainwright', year: 1986, court: 'SCOTUS', category: 'Death Penalty',
    facts: 'Death row inmate Ford developed psychosis; FL governor reviewed competence administratively.',
    issue: 'Does the 8th Amendment prohibit execution of the insane?',
    holding: 'Yes — execution of the insane violates 8th Amendment. Adequate procedures required.',
    significance: 'Constitutional bar; little retribution or deterrence value; offends humanity.',
    elements: ['8th Amendment bar', 'Adequate procedures required', 'Awareness of impending execution and reason'] },
  { id: 'payne', name: 'Payne v. Tennessee', year: 1991, court: 'SCOTUS', category: 'Death Penalty',
    facts: 'Killed mother and daughter; injured 3-year-old. Prosecution presented victim impact testimony at sentencing.',
    issue: 'Do victim impact statements violate the 8th Amendment at capital sentencing?',
    holding: 'No — admissible. Overruled Booth v. Maryland and South Carolina v. Gathers.',
    significance: 'Assessment of harm relevant to appropriate punishment.',
    elements: ['Victim impact admissible', 'Relevant to harm caused', 'Not per se prejudicial'] },
  { id: 'panetti', name: 'Panetti v. Quarterman', year: 2007, court: 'SCOTUS', category: 'Death Penalty',
    facts: 'Death row inmate Panetti, severely psychotic, factually knew he was being executed for murder but believed it was spiritual warfare.',
    issue: 'What level of understanding makes one competent for execution?',
    holding: 'Rational — not just factual — understanding of WHY he is being executed.',
    significance: 'Strengthens Ford; rational understanding required.',
    elements: ['Rational understanding', 'Not merely factual awareness', 'Connection between crime and punishment'] },
  { id: 'perry', name: 'State v. Perry', year: 1992, court: 'LA Sup. Ct.', category: 'Death Penalty',
    facts: 'Perry sentenced to death; schizophrenic; found incompetent for execution; trial court ordered forced medication to restore.',
    issue: 'Can a state forcibly medicate a death row inmate to restore competence for execution?',
    holding: 'No. Forced meds to execute is not medical treatment; cruel and unusual.',
    significance: 'Distinguishes Harper — meds to execute fail Harper "best interest" test.',
    elements: ['Forced meds to execute = cruel and unusual', 'Not medical treatment', 'Fails Harper criteria'] },
  { id: 'atkins', name: 'Atkins v. Virginia', year: 2002, court: 'SCOTUS', category: 'Death Penalty',
    facts: 'Atkins (IQ 59) sentenced to death for kidnapping/murder.',
    issue: 'Does executing the intellectually disabled violate the 8th Amendment?',
    holding: 'Yes. Categorical bar on execution of intellectually disabled.',
    significance: 'Evolving standards of decency; later refined by Hall and Moore.',
    elements: ['Intellectual disability', 'Categorical 8th Amendment bar', 'Evolving standards of decency'] },
  { id: 'roper', name: 'Roper v. Simmons', year: 2005, court: 'SCOTUS', category: 'Death Penalty',
    facts: 'Simmons committed murder at 17; sentenced to death.',
    issue: 'Does executing juveniles (under 18) violate the 8th Amendment?',
    holding: 'Yes. Categorical bar on death penalty for those under 18 at offense.',
    significance: 'Followed adolescent brain development science.',
    elements: ['Under 18 at offense', 'Lack of maturity', 'Susceptibility to influences', 'Unformed character'] },
  { id: 'hall', name: 'Hall v. Florida', year: 2014, court: 'SCOTUS', category: 'Death Penalty',
    facts: 'FL used strict IQ cutoff of 70; Hall scored 71-80.',
    issue: 'Can a state use a fixed IQ score as a strict cutoff for intellectual disability?',
    holding: 'No. Must consider SEM (standard error of measurement) and adaptive functioning.',
    significance: 'IQ is a range; comprehensive clinical assessment required.',
    elements: ['Consider SEM', 'No strict IQ cutoff', 'Comprehensive clinical assessment with adaptive functioning'] },
  { id: 'madison', name: 'Madison v. Alabama', year: 2019, court: 'SCOTUS', category: 'Death Penalty',
    facts: 'Madison suffered strokes causing vascular dementia; unable to remember his crime; AL sought execution.',
    issue: 'Does the 8th Amendment bar execution of a prisoner who cannot remember the crime due to dementia?',
    holding: 'Yes — if severe mental illness or dementia prevents rational understanding, execution may be barred.',
    significance: 'Extends Ford/Panetti to dementia cases.',
    elements: ['Rational understanding required', 'Severe dementia/illness can bar', 'Memory of crime not required, but rational understanding is'] },
  { id: 'mcwilliams', name: 'McWilliams v. Dunn', year: 2017, court: 'SCOTUS', category: 'Death Penalty',
    facts: 'AL provided McWilliams a neutral psychiatric evaluator but no expert to assist defense.',
    issue: 'Does Ake require a defense-aligned expert, or is a neutral evaluator sufficient?',
    holding: 'Defense-aligned expert required — neutral evaluator insufficient under Ake.',
    significance: 'Clarifies Ake; expert must assist defense in evaluation, preparation, and presentation.',
    elements: ['Expert must assist defense', 'Neutral evaluator insufficient', 'For evaluation, preparation, presentation'] },
  { id: 'buck', name: 'Buck v. Davis', year: 2017, court: 'SCOTUS', category: 'Death Penalty',
    facts: 'At capital sentencing, Buck\'s OWN expert (called by defense counsel) testified Buck was more dangerous because he was Black.',
    issue: 'Did Buck receive ineffective assistance of counsel?',
    holding: 'Yes. Race-based future dangerousness testimony was deficient and prejudicial under Strickland.',
    significance: 'Race cannot factor into capital sentencing; reinforces Strickland IAC standard.',
    elements: ['Deficient performance (Strickland prong 1)', 'Prejudice (Strickland prong 2)', 'Race cannot be a factor in sentencing'] },

  // ---- Sex Offenders ----
  { id: 'specht', name: 'Specht v. Patterson', year: 1967, court: 'SCOTUS', category: 'Sex Offenders',
    facts: 'Specht sentenced under CO Sex Offenders Act (1 day to life) instead of underlying 10-year max, without hearing or notice.',
    issue: 'Does indeterminate sex-offender sentencing without procedural protections violate due process?',
    holding: 'Yes. Requires notice, hearing with counsel, confrontation, cross-exam, opportunity to be heard.',
    significance: 'Enhanced procedural protections for sex offender commitment.',
    elements: ['Notice', 'Right to be present with counsel', 'Confront/cross-examine witnesses', 'Present own evidence'] },
  { id: 'allen', name: 'Allen v. Illinois', year: 1986, court: 'SCOTUS', category: 'Sex Offenders',
    facts: 'IL filed petition under Sexually Dangerous Persons Act; Allen objected to psychiatric eval based on 5th Amendment.',
    issue: 'Does the 5th Amendment privilege against self-incrimination apply in SDPA civil commitment proceedings?',
    holding: 'No — proceedings are civil, not criminal. Privilege does not apply.',
    significance: 'SVP commitment is civil; treatment/rehabilitation focus.',
    elements: ['Civil proceeding', 'Treatment focus, not punishment', '5th Amendment does not apply'] },
  { id: 'hendricks', name: 'Kansas v. Hendricks', year: 1997, court: 'SCOTUS', category: 'Sex Offenders',
    facts: 'Hendricks (pedophile) civilly committed under KS SVP Act after prison; challenged on DP, double jeopardy, ex post facto.',
    issue: 'Does SVP civil commitment violate substantive due process, double jeopardy, or ex post facto?',
    holding: 'No to all. "Mental abnormality" suffices; statute is civil, not punitive.',
    significance: 'Constitutional foundation for SVP commitment statutes.',
    elements: ['Mental abnormality (not strictly mental illness)', 'Likely to engage in sexually violent acts', 'Civil, not punitive'] },
  { id: 'seling', name: 'Seling v. Young', year: 2001, court: 'SCOTUS', category: 'Sex Offenders',
    facts: 'Young committed under WA Community Protection Act; challenged as punitive "as applied."',
    issue: 'Can a facially civil statute be challenged as punitive based on how it\'s applied?',
    holding: 'No. If statute is civil on its face, "as applied" claims for double jeopardy / ex post facto fail.',
    significance: 'Civil/punitive distinction is statutory, not individual.',
    elements: ['Civil on face → cannot be punitive as applied', 'Conditions challenges via due process', 'Finality principle'] },
  { id: 'crane', name: 'Kansas v. Crane', year: 2002, court: 'SCOTUS', category: 'Sex Offenders',
    facts: 'Crane (exhibitionist with ASPD) committed under KS SVP Act; argued total volitional impairment required.',
    issue: 'Must SVP commitment require TOTAL inability to control behavior?',
    holding: 'No, but state must show "serious difficulty controlling behavior."',
    significance: 'Refines Hendricks; meaningful volitional impairment required.',
    elements: ['Mental abnormality', 'Serious difficulty controlling behavior', 'Future dangerousness'] },
  { id: 'mckune', name: 'McKune v. Lile', year: 2002, court: 'SCOTUS', category: 'Sex Offenders',
    facts: 'KS prisoner refused Sexual Abuse Treatment Program requiring sexual history disclosure (incl. uncharged offenses); faced transfer and privilege loss.',
    issue: 'Does mandatory SATP requiring self-incrimination violate the 5th Amendment?',
    holding: 'No. Loss of privileges/transfer does not constitute compulsion.',
    significance: 'No clear majority; rehabilitation interest balanced against penological interests.',
    elements: ['Privileges loss ≠ compulsion', 'Rehabilitation interest', 'Within ordinary incidents of prison life'] },
  { id: 'comstock', name: 'U.S. v. Comstock', year: 2010, court: 'SCOTUS', category: 'Sex Offenders',
    facts: 'Federal civil commitment of "sexually dangerous" persons after federal prison sentence.',
    issue: 'Does the Necessary and Proper Clause authorize federal civil commitment under §4248?',
    holding: 'Yes. Rationally related to Congress\'s power over federal prisoners.',
    significance: 'Federal SVP commitment constitutional under N&P Clause.',
    elements: ['Necessary and Proper Clause', 'Connected to federal prisoner authority', 'States can take custody'] },

  // ---- Right to Die ----
  { id: 'glucksberg', name: 'Washington v. Glucksberg', year: 1997, court: 'SCOTUS', category: 'Right to Die',
    facts: 'WA physicians challenged state ban on assisted suicide.',
    issue: 'Does Due Process include a right to physician-assisted suicide?',
    holding: 'No. No fundamental liberty interest. Rational basis review.',
    significance: 'States may ban assisted suicide. Companion: Vacco v. Quill (equal protection).',
    elements: ['No fundamental right', 'Rational basis review', 'States may prohibit'] },
  { id: 'georgetown', name: 'Application of Pres. & Dir. of Georgetown College', year: 1964, court: 'D.C. Cir.', category: 'Right to Die',
    facts: 'Mrs. Jones, Jehovah\'s Witness mother of 7-month-old, refused life-saving transfusion. Judge Wright ordered transfusion; she recovered.',
    issue: 'Can treatment be ordered over religious refusal?',
    holding: 'Judge ordered transfusion; en banc rehearing denied with fractured opinions.',
    significance: 'Historical case re: state interests in preserving life vs. religious autonomy.',
    elements: ['State interest in life', 'Protect dependents (the 7-month-old)', 'Medical ethics interest'] },

  // ---- Informed Consent ----
  { id: 'canterbury', name: 'Canterbury v. Spence', year: 1972, court: 'D.C. Cir.', category: 'Informed Consent',
    facts: 'Patient paralyzed after laminectomy; not warned of paralysis risk.',
    issue: 'What is the standard for informed consent disclosure?',
    holding: 'Patient-centered (reasonable patient) standard — what a reasonable patient would want to know.',
    significance: 'Shifted from physician-based to patient-based standard; majority US jurisdictions.',
    elements: ['Reasonable patient standard', 'Material risks', 'Causation', 'Damages'] },
  { id: 'kaimowitz', name: 'Kaimowitz v. Michigan DMH', year: 1973, court: 'MI Cir. Ct.', category: 'Informed Consent',
    facts: 'Proposed psychosurgery (amygdalotomy) on involuntarily committed patients to study violence.',
    issue: 'Can involuntarily committed patients give informed consent to experimental psychosurgery?',
    holding: 'No. Confinement undermines voluntariness; consent invalid.',
    significance: 'Three elements of consent. Nuremberg Code principles invoked.',
    elements: ['Competence', 'Knowledge', 'Voluntariness'] },
  { id: 'cruzan', name: 'Cruzan v. Missouri Dept. of Health', year: 1990, court: 'SCOTUS', category: 'Informed Consent',
    facts: 'Nancy Cruzan in PVS after car accident; parents sought to remove feeding tube.',
    issue: 'Right to refuse life-sustaining treatment? May state require clear and convincing evidence?',
    holding: 'Yes — competent persons have liberty interest in refusing treatment. Yes — states may require clear and convincing evidence of wishes.',
    significance: 'Foundational right-to-refuse-treatment; basis for advance directives.',
    elements: ['Liberty interest in refusing treatment', 'Clear and convincing evidence permissible', 'Bodily integrity'] },

  // ---- Right to Treatment ----
  { id: 'rouse', name: 'Rouse v. Cameron', year: 1966, court: 'D.C. Cir.', category: 'Right to Treatment',
    facts: 'Rouse committed after NGRI for weapons charge; received no treatment (Judge Bazelon).',
    issue: 'Do involuntarily committed patients have a right to treatment?',
    holding: 'Yes, based on DC statute (Hospitalization of Mentally Ill Act).',
    significance: 'First articulation of right to treatment.',
    elements: ['Statutory right to treatment', 'Confinement without treatment = punishment'] },
  { id: 'wyatt', name: 'Wyatt v. Stickney', year: 1971, court: 'M.D. Ala.', category: 'Right to Treatment',
    facts: 'Class action; abysmal conditions at Bryce Hospital, Alabama.',
    issue: 'Constitutional minimum standards for institutional care?',
    holding: 'Yes — constitutional right to adequate treatment. Three minimum standards established.',
    significance: 'Foundational institutional reform case.',
    elements: ['Humane physical/psychological environment', 'Qualified staff in sufficient numbers', 'Individualized treatment plans'] },
  { id: 'donaldson_5th', name: "Donaldson v. O'Connor (5th Cir.)", year: 1974, court: '5th Cir.', category: 'Right to Treatment',
    facts: 'Donaldson with paranoid schizophrenia, Christian Scientist who refused treatment; confined despite ability to live independently.',
    issue: 'Is it a due process violation to continue confining a nondangerous person who can live independently?',
    holding: 'Yes. Right to treatment; cannot confine non-dangerous person who can survive in community.',
    significance: 'Precursor to SCOTUS O\'Connor v. Donaldson (1975).',
    elements: ['Right to treatment', 'Non-dangerous + can survive = release', 'Mental illness alone insufficient'] },
  { id: 'youngberg', name: 'Youngberg v. Romeo', year: 1982, court: 'SCOTUS', category: 'Right to Treatment',
    facts: 'Profoundly ID man (mental age 18 months) with 63 injuries in 2 years at PA institution; mother sued.',
    issue: 'What rights to safety, freedom from restraint, and training do committed persons have?',
    holding: 'Rights to safe conditions, freedom from undue restraint, and minimally adequate training. Judged by "professional judgment" standard.',
    significance: 'Professional Judgment Rule — presumed valid unless substantial departure.',
    elements: ['Safe conditions', 'Freedom from undue restraint', 'Minimally adequate training', 'Professional judgment standard'] },

  // ---- Sexual Harassment ----
  { id: 'meritor', name: 'Meritor Savings Bank v. Vinson', year: 1986, court: 'SCOTUS', category: 'Sexual Harassment',
    facts: 'Vinson sexually harassed by supervisor at bank; did not report fearing job loss.',
    issue: 'Is "hostile work environment" sexual harassment actionable under Title VII?',
    holding: 'Yes. Voluntariness does not matter — only whether it was unwelcome. No absolute employer liability.',
    significance: 'Recognized hostile work environment as Title VII sex discrimination.',
    elements: ['Severe or pervasive', 'Alters conditions of employment', 'Unwelcome (voluntariness irrelevant)', 'Employer liability case-by-case'] },
  { id: 'harris', name: 'Harris v. Forklift Systems', year: 1993, court: 'SCOTUS', category: 'Sexual Harassment',
    facts: 'Female manager harassed by company president with gendered insults; quit and sued.',
    issue: 'What defines an "abusive work environment" under Title VII?',
    holding: 'Conduct need not cause psychological injury. Must be both objectively AND subjectively hostile.',
    significance: 'Totality of circumstances test for hostile work environment.',
    elements: ['Objective hostility', 'Subjective perception of hostility', 'Totality of circumstances (frequency, severity, threats, work interference)'] },
  { id: 'oncale', name: 'Oncale v. Sundowner Offshore', year: 1998, court: 'SCOTUS', category: 'Sexual Harassment',
    facts: 'Oncale harassed and sodomized by same-sex peers on oil rig; filed Title VII claim.',
    issue: 'Can same-sex sexual harassment be actionable under Title VII?',
    holding: 'Yes. Same-sex harassment is actionable. (Scalia, unanimous.)',
    significance: 'Title VII protects against same-sex harassment; "because of sex" need not be sexual desire.',
    elements: ['Same-sex harassment actionable', 'Need not be motivated by sexual desire', 'Discrimination because of sex required'] },

  // ---- Right to Refuse Treatment ----
  { id: 'rogers', name: 'Rogers v. Commissioner', year: 1983, court: 'MA Sup. Jud. Ct.', category: 'Right to Refuse Treatment',
    facts: 'Boston hospital patients refused antipsychotics/seclusion.',
    issue: 'Right to refuse treatment? Who decides for incompetent patients?',
    holding: 'Committed patient competent until judicially found incompetent. If incompetent, judge applies substituted judgment.',
    significance: '"Rogers hearing" / "Rogers order" in MA. Rights-driven model.',
    elements: ['Right to refuse', 'Judicial determination of incompetence', 'Substituted judgment (not best interests)', 'Emergency exception'] },
  { id: 'rennie', name: 'Rennie v. Klein', year: 1983, court: '3rd Cir.', category: 'Right to Refuse Treatment',
    facts: 'NJ involuntarily committed patient forcibly medicated; sued claiming constitutional violation.',
    issue: 'Right to refuse antipsychotics? Standard of review?',
    holding: 'Yes — qualified right. Apply Youngberg professional judgment standard.',
    significance: 'Treatment-driven model contrasting Rogers; defers to professionals.',
    elements: ['Qualified right to refuse', 'Professional judgment standard', 'Presumptively valid unless substantial departure'] },
  { id: 'harper', name: 'Washington v. Harper', year: 1990, court: 'SCOTUS', category: 'Right to Refuse Treatment',
    facts: 'Convicted prisoner Harper refused antipsychotics; WA used administrative review.',
    issue: 'Can a prisoner be forcibly medicated via administrative (not judicial) hearing?',
    holding: 'Yes. Administrative review sufficient if (1) serious mental illness, (2) dangerous or gravely disabled, (3) medically appropriate.',
    significance: 'Lower bar for prisoners; administrative process acceptable.',
    elements: ['Serious mental illness', 'Dangerous to self/others OR gravely disabled', 'Medical interest', 'Administrative review sufficient'] },
  { id: 'steele', name: 'Steele v. Hamilton City', year: 1999, court: 'OH Sup. Ct.', category: 'Right to Refuse Treatment',
    facts: 'OH committed patient refused antipsychotics; OH had no clear procedural rules.',
    issue: 'What procedural safeguards must Ohio provide before forced medication?',
    holding: 'Judicial hearing required (except emergencies). Court considers diagnosis, treatment, reasons for refusal, capacity, alternatives.',
    significance: 'Ohio standard stronger than federal minimum (Harper).',
    elements: ['Judicial hearing', 'Diagnosis', 'Proposed treatment + side effects', 'Capacity to understand', 'Alternatives'] },
  { id: 'hargrave', name: 'Hargrave v. Vermont', year: 2003, court: 'VT Dist. Ct.', category: 'Right to Refuse Treatment',
    facts: 'Patient signed psychiatric advance directive refusing antipsychotics; VT law allowed override for incompetent committed patients.',
    issue: 'Does VT\'s override of psychiatric advance directives violate the ADA?',
    holding: 'Yes. Disparate treatment vs. physical-condition advance directives discriminates under ADA.',
    significance: 'ADA protection for psychiatric advance directives.',
    elements: ['ADA protection', 'Equal treatment with physical advance directives', 'Competently-executed PADs must be honored'] },

  // ---- Confidentiality, Privacy, and Privilege ----
  { id: 'lifschutz', name: 'In re Lifschutz', year: 1970, court: 'CA Sup. Ct.', category: 'Confidentiality & Privilege',
    facts: 'Psychiatrist Lifschutz refused to produce subpoenaed records, claiming privacy; held in contempt.',
    issue: 'Is there a psychiatrist\'s constitutional right to privacy?',
    holding: 'No. The PATIENT, not the doctor, owns the privilege. Waiver is partial — only as relevant to litigation.',
    significance: 'Patient owns the privilege.',
    elements: ['Patient owns privilege', 'Doctor has no constitutional privacy right', 'Partial waiver for relevant issues'] },
  { id: 'doe_roe', name: 'Doe v. Roe', year: 1977, court: 'NY trial court', category: 'Confidentiality & Privilege',
    facts: 'Psychiatrist published book containing patient\'s thoughts, fantasies, biography years after treatment.',
    issue: 'Did publication of therapy content violate patient privacy?',
    holding: 'Yes. Patient awarded damages for breach of confidentiality.',
    significance: 'Recognized civil cause of action for breach of therapist confidentiality.',
    elements: ['Therapist-patient confidentiality enforceable', 'Civil damages available', 'Right of action for patient'] },
  { id: 'jaffee', name: 'Jaffee v. Redmond', year: 1996, court: 'SCOTUS', category: 'Confidentiality & Privilege',
    facts: 'Police officer Redmond shot suspect; civil suit sought therapy records.',
    issue: 'Is there a federal psychotherapist-patient privilege?',
    holding: 'Yes. Federal common-law privilege; extends to licensed clinical social workers.',
    significance: 'Federal privilege established; recognizes importance of confidentiality.',
    elements: ['Federal common-law privilege', 'Psychiatrists, psychologists, LCSWs', 'Communications in course of therapy'] },

  // ---- Civil Commitment ----
  { id: 'addington', name: 'Addington v. Texas', year: 1979, court: 'SCOTUS', category: 'Civil Commitment',
    facts: 'TX civil commitment under preponderance standard.',
    issue: 'What standard of proof for civil commitment?',
    holding: 'Clear and convincing evidence (constitutional floor). Lower than reasonable doubt given psychiatric uncertainty.',
    significance: 'Sets constitutional minimum for civil commitment standard of proof.',
    elements: ['Clear and convincing evidence', 'Higher than preponderance', 'Lower than reasonable doubt'] },
  { id: 'parham', name: 'Parham v. J.R.', year: 1979, court: 'SCOTUS', category: 'Civil Commitment',
    facts: 'Parents sought voluntary commitment of children to GA hospital; no adversarial hearing.',
    issue: 'Do minors need adversarial hearings before parental commitment?',
    holding: 'No. Neutral fact-finder (e.g., admitting physician) sufficient. Parents presumed to act in best interest.',
    significance: 'Less stringent process for minors; parental good-faith presumption.',
    elements: ['Neutral fact-finder (physician sufficient)', 'No formal hearing required', 'Parental presumption'] },
  { id: 'zinermon', name: 'Zinermon v. Burch', year: 1990, court: 'SCOTUS', category: 'Civil Commitment',
    facts: 'Apparently psychotic patient signed "voluntary" admission forms in FL; later claimed incompetent to consent.',
    issue: 'Does admitting an incompetent person as "voluntary" violate due process?',
    holding: 'Yes. State must screen for competence to consent to voluntary admission.',
    significance: 'Voluntary admission requires capacity screening.',
    elements: ['Capacity to consent required', 'Procedural safeguards needed', 'Foreseeable risk of incompetent voluntary admission'] },
  { id: 'dillon', name: 'Dillon v. Legg', year: 1968, court: 'CA Sup. Ct.', category: 'Civil Commitment',
    facts: 'Mother and sister witnessed car kill family member; sued for NIED outside zone of danger.',
    issue: 'Can bystanders recover for NIED without being in physical danger?',
    holding: 'Yes — new cause of action. Dillon factors: proximity, contemporaneous observation, close relationship.',
    significance: 'Foundational NIED case; foreseeability principle.',
    elements: ['Proximity to accident', 'Contemporaneous observation', 'Close relationship to victim'] },
  { id: 'lake', name: 'Lake v. Cameron', year: 1966, court: 'D.C. Cir.', category: 'Civil Commitment',
    facts: 'Elderly woman with chronic brain syndrome involuntarily committed; sought less restrictive alternatives.',
    issue: 'Right to least restrictive alternative placement?',
    holding: 'Yes. Government must explore alternatives before indefinite institutional confinement.',
    significance: 'Established least restrictive alternative principle.',
    elements: ['Least restrictive alternative', 'Government must explore options', 'Both individual and state interests considered'] },
  { id: 'lessard', name: 'Lessard v. Schmidt', year: 1972, court: 'WI Dist. Ct.', category: 'Civil Commitment',
    facts: 'ACLU challenged WI commitment statute lacking procedural protections.',
    issue: 'Do civil commitment respondents have due process rights like criminal defendants?',
    holding: 'Yes. Required: notice, counsel, right against self-incrimination, BRD for dangerousness, least restrictive alternative.',
    significance: 'Lower-court landmark; drove nationwide reform. (BRD later softened to clear/convincing by Addington.)',
    elements: ['Notice', 'Right to counsel', 'Self-incrimination privilege', 'Imminent dangerousness', 'Least restrictive alternative'] },
  { id: 'oconnor', name: "O'Connor v. Donaldson", year: 1975, court: 'SCOTUS', category: 'Civil Commitment',
    facts: 'Donaldson confined ~15 years in FL despite being non-dangerous and able to survive in community.',
    issue: 'Can a non-dangerous mentally ill person be confined who can survive safely in freedom?',
    holding: 'No. Mental illness alone insufficient. Must be dangerous or unable to survive safely.',
    significance: 'O\'Connor personally liable. Mental illness + non-dangerous + can survive = must release.',
    elements: ['Mental illness alone insufficient', 'Dangerousness OR grave disability required', 'Personal liability possible'] },

  // ---- Duty to Protect ----
  { id: 'tarasoff', name: 'Tarasoff v. Regents', year: 1976, court: 'CA Sup. Ct.', category: 'Duty to Protect',
    facts: 'Poddar told UC therapist he intended to kill Tarasoff; police were warned and released him; Poddar killed Tarasoff.',
    issue: 'Does a therapist owe a duty to protect identifiable third parties?',
    holding: 'Yes. Reasonable care to protect identifiable victim(s). "Protective privilege ends where public peril begins."',
    significance: 'Tarasoff I (1974) = duty to WARN; Tarasoff II (1976) = duty to PROTECT (broader).',
    elements: ['Identifiable victim', 'Foreseeable threat', 'Reasonable care to protect (warn, hospitalize, notify police)'] },
  { id: 'lipari', name: 'Lipari v. Sears', year: 1980, court: 'U.S. Dist. Ct. NE', category: 'Duty to Protect',
    facts: 'VA mental health patient bought shotgun at Sears and shot up Omaha nightclub; killed Mr. Lipari.',
    issue: 'Does duty to protect extend beyond identifiable victims to foreseeable victims at large?',
    holding: 'Yes. Therapist has duty to detain dangerous persons; foreseeable victims belong to class.',
    significance: 'Extends Tarasoff to foreseeable victims (not just identifiable individuals).',
    elements: ['Duty extends beyond identifiable victims', 'Foreseeable class of victims', 'Public at large can be protected class'] },
  { id: 'littleton', name: 'Littleton v. Good Samaritan', year: 1988, court: 'OH Sup. Ct.', category: 'Duty to Protect',
    facts: 'Postpartum psychotic depressed mother voluntarily hospitalized at Good Sam; threatened to kill baby; discharged; killed baby with aspirin.',
    issue: 'When is a psychiatrist liable for violent acts by voluntarily hospitalized discharged patient?',
    holding: 'Adopted "professional judgment rule." If thorough VRA + good faith + adherence to standards = not liable for mere error.',
    significance: 'Ohio standard for post-discharge violence liability.',
    elements: ['Professional judgment standard', 'Thorough VRA', 'Good faith', 'Not liable for mere error of judgment'] },
  { id: 'morgan', name: 'Morgan v. Fairfield', year: 1994, court: 'OH Sup. Ct.', category: 'Duty to Protect',
    facts: 'Outpatient with psychosis/violence history was tapered off antipsychotic; killed parents, wounded sister.',
    issue: 'Does duty to protect extend to outpatient setting?',
    holding: 'Yes. When psychiatrist knows or should know outpatient poses substantial risk, duty to exercise best professional judgment.',
    significance: 'No longer good law; superseded by Ohio statute (ORC §2305.51).',
    elements: ['Outpatient duty extends', 'Knew or should have known', 'Best professional judgment'] },

  // ---- Americans with Disabilities Act ----
  { id: 'bragdon', name: 'Bragdon v. Abbott', year: 1998, court: 'SCOTUS', category: 'ADA',
    facts: 'Dentist Bragdon refused to fill cavity for asymptomatic HIV+ patient in office.',
    issue: 'Is asymptomatic HIV a disability under the ADA?',
    holding: 'Yes. Asymptomatic HIV substantially limits major life activity (reproduction). Insufficient evidence of "direct threat."',
    significance: 'Broad reading of ADA "disability"; objective evidence required for "direct threat" defense.',
    elements: ['Physical/mental impairment', 'Substantially limits major life activity', 'Direct threat must be based on objective evidence'] },
  { id: 'olmstead', name: 'Olmstead v. L.C.', year: 1999, court: 'SCOTUS', category: 'ADA',
    facts: 'L.C. and E.W. with ID + psychiatric illness committed in GA hospital; treatment team thought ready for community; state refused.',
    issue: 'Does ADA Title II require community placement for persons with mental disabilities when appropriate?',
    holding: 'Yes. Unjustified institutional isolation is discrimination. Community placement required when (1) professionals say appropriate, (2) person doesn\'t oppose, (3) reasonable accommodation possible.',
    significance: 'Landmark ADA integration mandate; "Olmstead plans" in states.',
    elements: ['Professionals deem appropriate', 'Individual does not oppose', 'Reasonable accommodation possible without fundamental alteration'] },
  { id: 'us_georgia', name: 'U.S. v. Georgia', year: 2006, court: 'SCOTUS', category: 'ADA',
    facts: 'Paraplegic inmate Goodman in GA prison; couldn\'t use toilet/shower; sued under Title II ADA and §1983.',
    issue: 'Can a disabled inmate sue state for money damages under Title II ADA?',
    holding: 'Yes — when conduct violates the 14th Amendment, Title II validly abrogates state sovereign immunity.',
    significance: 'ADA damages available against states for 14th Amendment violations.',
    elements: ['Title II claim', 'Conduct violates 14th Amendment', 'Sovereign immunity abrogated under §5 of 14th Amendment'] },

  // ---- Hypnosis ----
  { id: 'hurd', name: 'State v. Hurd', year: 1981, court: 'NJ Sup. Ct.', category: 'Hypnosis',
    facts: 'Stabbing victim hypnotized to refresh memory; leading questions asked.',
    issue: 'Is hypnotically refreshed testimony admissible?',
    holding: 'Admissible if strict procedural safeguards (Hurd guidelines) followed by clear and convincing evidence.',
    significance: 'Permissive approach with safeguards; widely adopted.',
    elements: ['Qualified hypnotist', 'Recorded session', 'Neutral hypnotist', 'Only hypnotist + subject present', 'All communications preserved', 'Written LE info'] },
  { id: 'shirley', name: 'People v. Shirley', year: 1982, court: 'CA Sup. Ct.', category: 'Hypnosis',
    facts: 'Rape witness hypnotized by police to refresh memory.',
    issue: 'Is hypnotically refreshed testimony admissible?',
    holding: 'No (in CA). Post-hypnosis testimony excluded; only pre-hypnosis recollections admissible.',
    significance: 'Strict (Kelly-Frye) approach; California rule. More restrictive than Hurd.',
    elements: ['Post-hypnosis testimony excluded', 'Only pre-hypnosis statements admissible', 'Hypnosis fails general acceptance test'] },

  // ---- Child Abuse Reporting ----
  { id: 'landeros', name: 'Landeros v. Flood', year: 1976, court: 'CA Sup. Ct.', category: 'Child Abuse Reporting',
    facts: 'Physician failed to diagnose battered child syndrome in 11-month-old with multiple fractures; child returned to abusive home.',
    issue: 'Physician liability for failure to diagnose/report child abuse?',
    holding: 'Yes — liability for subsequent injuries when clinical signs were present.',
    significance: 'Established physician civil liability for failure to report.',
    elements: ['Battered child syndrome is diagnosable', 'Failure to report breaches standard of care', 'Foreseeability of subsequent harm'] },
  { id: 'stritzinger', name: 'People v. Stritzinger', year: 1983, court: 'CA Sup. Ct.', category: 'Child Abuse Reporting',
    facts: 'Patient disclosed sexual abuse of stepdaughter during therapy; therapist reported.',
    issue: 'Does therapist-patient privilege bar reporting child abuse?',
    holding: 'No. Mandatory reporting overrides privilege.',
    significance: 'Privilege yields to child protection.',
    elements: ['Mandatory reporting overrides privilege', 'Not discretionary if statutory criteria met'] },
  { id: 'andring', name: 'State v. Andring', year: 1984, court: 'MN Sup. Ct.', category: 'Child Abuse Reporting',
    facts: 'Group therapy disclosures sought as evidence in child sexual misconduct case.',
    issue: 'Does psychiatrist-patient privilege extend to group therapy?',
    holding: 'Yes. Privilege extends to group therapy. Reporting limited to specific information; privilege not completely discarded.',
    significance: 'Extends privilege to group therapy modality.',
    elements: ['Group therapy privileged', 'Limited disclosure for mandatory reporting', 'Privilege not fully waived in group setting'] },
  { id: 'deshaney', name: 'DeShaney v. Winnebago', year: 1989, court: 'SCOTUS', category: 'Child Abuse Reporting',
    facts: '4-year-old Joshua repeatedly beaten by father; DSS investigated but didn\'t remove; resulted in permanent brain damage.',
    issue: 'Does 14th Amendment impose affirmative duty to protect from private violence?',
    holding: 'No. Due process limits state action; doesn\'t guarantee state protection. Exception: state-created danger or custody.',
    significance: 'Major limit on state protective duty.',
    elements: ['No affirmative duty in non-custodial settings', 'State-created danger exception', 'Custodial relationship exception'] },

  // ---- Child Custody ----
  { id: 'painter', name: 'Painter v. Bannister', year: 1966, court: 'IA Sup. Ct.', category: 'Child Custody',
    facts: 'After mother\'s death, father left son with grandparents; later sought custody; grandparents resisted.',
    issue: 'What standard governs parent vs. non-parent custody disputes?',
    holding: 'Best interests of the child. Grandparents retained custody despite father\'s legal rights.',
    significance: 'Best interests standard can override parental rights; controversial lifestyle considerations.',
    elements: ['Best interests of child', 'Can override parental presumption', 'Stability and attachment considered'] },
  { id: 'santosky', name: 'Santosky v. Kramer', year: 1982, court: 'SCOTUS', category: 'Child Custody',
    facts: 'NY terminated parental rights using preponderance standard.',
    issue: 'Standard of proof for termination of parental rights?',
    holding: 'Clear and convincing evidence (constitutional minimum).',
    significance: 'Parental rights are fundamental liberty interests; termination is drastic.',
    elements: ['Clear and convincing evidence', 'Parental rights are fundamental', 'Higher than preponderance'] },

  // ---- Juvenile Court / Education ----
  { id: 'gault', name: 'In re Gault', year: 1967, court: 'SCOTUS', category: 'Juvenile',
    facts: '15-year-old Gault committed to industrial school until 21 for obscene phone call; no procedural rights afforded.',
    issue: 'What due process rights do juveniles have in delinquency proceedings?',
    holding: 'Notice of charges, right to counsel, confrontation/cross-exam, privilege against self-incrimination.',
    significance: 'Constitutionalized juvenile court procedures; ended parens patriae informality.',
    elements: ['Notice of charges', 'Right to counsel', 'Confrontation/cross-exam', 'Self-incrimination privilege'] },
  { id: 'fare', name: 'Fare v. Michael C.', year: 1979, court: 'SCOTUS', category: 'Juvenile',
    facts: '16-year-old murder suspect asked for probation officer (not attorney) during interrogation; made incriminating statements.',
    issue: 'Does request for probation officer invoke Miranda?',
    holding: 'No. Probation officer ≠ attorney. Apply totality of circumstances for juvenile Miranda waivers.',
    significance: 'Totality of circumstances test for juvenile Miranda waivers.',
    elements: ['Probation officer ≠ attorney', 'Totality of circumstances', 'Age, experience, capacity considered'] },
  { id: 'rowley', name: 'Board of Education v. Rowley', year: 1982, court: 'SCOTUS', category: 'Juvenile',
    facts: 'Deaf student doing well with part-time interpreter; parents wanted full-time interpreter under EAHCA (IDEA).',
    issue: 'What educational standard does IDEA require?',
    holding: 'Schools must provide program reasonably calculated to enable educational benefits — not maximize potential.',
    significance: '"Educational benefit" standard for IDEA.',
    elements: ['Procedural compliance', 'IEP reasonably calculated for educational benefit', 'Not required to maximize potential'] },
  { id: 'tatro', name: 'Irving ISD v. Tatro', year: 1984, court: 'SCOTUS', category: 'Juvenile',
    facts: 'Spina bifida student needed clean intermittent catheterization at school; district refused as "medical service."',
    issue: 'Is CIC a "related service" under IDEA or an excluded "medical service"?',
    holding: 'Related service. "Medical service" exclusion = must be performed by physician. CIC doesn\'t need physician.',
    significance: 'Physician requirement is the test for IDEA medical service exclusion.',
    elements: ['Related service if non-physician can perform', 'Necessary for child to benefit from special education', 'Medical service exclusion narrowly construed'] },

  // ---- Juvenile Sentencing ----
  { id: 'graham', name: 'Graham v. Florida', year: 2010, court: 'SCOTUS', category: 'Juvenile Sentencing',
    facts: 'Graham sentenced to LWOP at 16 for non-homicide offenses.',
    issue: 'Does LWOP for juveniles in non-homicide cases violate the 8th Amendment?',
    holding: 'Yes — categorical bar on LWOP for juvenile non-homicide.',
    significance: 'Extended Roper. Meaningful opportunity for release required.',
    elements: ['Under 18 at offense', 'Non-homicide offense', 'Categorical 8th Amendment bar'] },
  { id: 'miller', name: 'Miller v. Alabama', year: 2012, court: 'SCOTUS', category: 'Juvenile Sentencing',
    facts: '14-year-old Miller sentenced to mandatory LWOP for murder.',
    issue: 'Does mandatory LWOP for juvenile homicide violate the 8th Amendment?',
    holding: 'Yes — mandatory LWOP unconstitutional. Individualized sentencing required considering youth.',
    significance: 'Mandatory schemes barred; LWOP not categorically barred. Montgomery (2016) made retroactive.',
    elements: ['Mandatory LWOP barred', 'Individualized sentencing required', 'Consider youth and circumstances'] },

  // ---- Diminished Capacity ----
  { id: 'ibntamas', name: 'Ibn-Tamas v. U.S.', year: 1979, court: 'D.C. Ct. App.', category: 'Diminished Capacity',
    facts: 'Battered wife shot husband; defense sought expert testimony on battered women syndrome; trial court excluded.',
    issue: 'Should expert testimony on battered women be admitted?',
    holding: 'Trial court erred in barring; testimony does not invade jury\'s province. Remanded.',
    significance: 'Foundational case for battered woman syndrome expert testimony.',
    elements: ['Beyond ken of layperson', 'Expert has sufficient knowledge', 'Aids trier of fact', 'No state law against it'] },
  { id: 'egelhoff', name: 'Montana v. Egelhoff', year: 1996, court: 'SCOTUS', category: 'Diminished Capacity',
    facts: 'Found in car with two dead bodies; BAC 0.36; MT law barred voluntary intoxication evidence to negate mens rea.',
    issue: 'Does barring voluntary intoxication evidence on mens rea violate due process?',
    holding: 'No. States may make this policy choice without violating due process.',
    significance: 'States can bar voluntary intoxication as mens rea defense.',
    elements: ['Historical tradition against intoxication defense', 'State interest in deterring intoxicated conduct', 'Voluntary intoxication = assumed responsibility'] },

  // ---- HIPAA / Liability to Patients ----
  { id: 'hartogs', name: 'Roy v. Hartogs', year: 1976, court: 'NY App. Ct.', category: 'HIPAA & Patient Liability',
    facts: 'Patient sued psychiatrist for damages after sex during "treatment."',
    issue: 'Is sex with patient malpractice? Barred by "Heart Balm" Act?',
    holding: 'Malpractice; suit not barred. Compensatory damages awarded ($25K); punitive denied.',
    significance: 'Sex with patient = malpractice; civil action available. Freud quoted in opinion.',
    elements: ['Sex with patient = malpractice', 'Compensatory damages allowed', 'Punitive requires malicious intent'] },
  { id: 'clites', name: 'Clites v. Iowa', year: 1982, court: 'IA Ct. App.', category: 'HIPAA & Patient Liability',
    facts: 'Institutionalized intellectually disabled man given antipsychotics for aggression; developed TD; father sued.',
    issue: 'Negligent use of antipsychotics; failure of informed consent?',
    holding: 'Liability upheld. Insufficient evidence of severe aggression; failed to monitor TD; staff failed to consult experts. Damages affirmed.',
    significance: 'Right to refuse via 1st Amendment; informed consent required even in institutional settings.',
    elements: ['Insufficient indication for meds', 'Failure to monitor for TD', 'Failure to obtain informed consent', 'Polypharmacy masked TD'] },
];

// =====================================================================
// LEGAL TERMS — complete list (Legal Terms & Concepts + AM edits)
// =====================================================================
const TERMS = [
  { term: 'Actus reus', def: 'The physical act or unlawful omission that constitutes a criminal offense.' },
  { term: 'Affirmative defense', def: 'A defense admitting the basic facts but offering new evidence to avoid liability (self-defense, insanity, duress).' },
  { term: 'Amicus curiae', def: '"Friend of the court" — a non-party who offers information or expertise relevant to the case.' },
  { term: 'Appellant vs. appellee', def: 'Appellant = the party filing the appeal. Appellee = the party responding to the appeal (the petitioner/respondent below).' },
  { term: 'Bindover', def: 'The transfer of a case from a lower court to a higher one — in juvenile practice, transferring a juvenile to adult court (mandatory or discretionary bindover).' },
  { term: 'Burden of production vs. burden of persuasion', def: 'Burden of production = presenting sufficient evidence to raise an issue. Burden of persuasion = convincing the fact-finder of the claim.' },
  { term: 'Case of first impression', def: 'A case presenting a new legal issue that has not previously been ruled upon.' },
  { term: 'Compensatory damages', def: 'Monetary awards meant to compensate the injured party for actual losses suffered.' },
  { term: 'Confrontation Clause', def: '6th Amendment right to confront witnesses against you in criminal trials (alongside the speedy/fair trial right).' },
  { term: 'Daubert factors', def: '(1) Testability/falsifiability, (2) peer review/publication, (3) known error rate, (4) standards and controls, (5) general acceptance.' },
  { term: 'De facto', def: '"In fact" — a practice that exists in reality, even if not legally recognized.' },
  { term: 'De jure', def: '"By law" — something legally recognized, regardless of whether it exists in practice.' },
  { term: 'De novo', def: '"Fresh eyes" — the appellate court reviews the issue as if for the first time, with no deference to the trial court. Applied to questions of law.' },
  { term: 'Demurrer', def: 'A dismissal motion arguing the complaint fails to state a legal cause of action.' },
  { term: 'Directed verdict', def: 'When a judge takes a case from the jury BEFORE deliberation because one party failed to present legally sufficient evidence.' },
  { term: 'Dicta vs. holding', def: 'Holding = the binding legal ruling necessary to decide the case. Dicta = commentary that is not binding and not necessary to the decision.' },
  { term: 'Double jeopardy', def: 'A constitutional protection (5th Amendment) against being tried twice for the same crime.' },
  { term: 'Dusky standard', def: '(1) Rational AND factual understanding of proceedings, (2) ability to consult with counsel with a reasonable degree of rational understanding.' },
  { term: 'En banc', def: '"Full court" — the entire panel of appellate judges hears the case, rather than the usual three-judge panel.' },
  { term: 'Equal protection', def: '14th Amendment: similarly situated individuals must be treated equally unless there is a legally sufficient justification for differential treatment.' },
  { term: 'Error of fact', def: 'A mistake about a factual element of a case, which can affect the outcome if material.' },
  { term: 'Error of judgment (malpractice)', def: 'A reasonable professional decision that turns out poorly is generally NOT malpractice.' },
  { term: 'Estelle warning', def: 'Forensic warning that statements during a court-ordered evaluation may be used at sentencing; required by Estelle v. Smith.' },
  { term: 'Ex parte', def: 'Proceedings or communications for the benefit of only one party, without the other being present.' },
  { term: 'Ex post facto', def: 'Laws applied retroactively to criminalize previously legal acts — unconstitutional in the U.S.' },
  { term: 'Federal Tort Claims Act', def: 'A statute allowing private parties to sue the U.S. government for certain torts committed by federal employees.' },
  { term: 'Felony vs. misdemeanor', def: 'Felony = serious crime, typically punishable by over one year in prison. Misdemeanor = less serious offense with lesser penalties.' },
  { term: 'Foreseeability', def: 'The ability to reasonably predict that a certain consequence may result from an action.' },
  { term: 'Guardian ad litem', def: 'A person appointed by the court to represent the best interests of a minor or incapacitated person.' },
  { term: 'Habeas corpus', def: '"You shall have the body." A civil action demanding a person in custody be brought before a judge to test the legality of detention. A federal habeas petition often follows a state conviction to argue the imprisonment violates the U.S. Constitution.' },
  { term: 'Harmless error', def: 'A legal mistake that does not affect the outcome and does not warrant reversal.' },
  { term: 'In forma pauperis', def: 'Status allowing a person to proceed in court without paying fees due to inability to afford them.' },
  { term: 'Interlocutory appeal', def: 'An appeal of a court decision made before the final judgment in a case.' },
  { term: 'Ipse dixit', def: 'A statement asserted but not proven — relying solely on authority rather than evidence.' },
  { term: 'Judgment notwithstanding the verdict (JNOV)', def: 'When a judge overrides the jury\'s verdict AFTER the jury has already decided the case.' },
  { term: 'Malum in se', def: 'Acts that are inherently wrong or evil (murder, theft).' },
  { term: 'Malum prohibitum', def: 'Acts that are wrong only because prohibited by law (jaywalking).' },
  { term: 'Materiality', def: 'Information is material if it could influence the decision-making of a reasonable person or authority.' },
  { term: 'Mathews v. Eldridge balancing test', def: 'Procedural due process: (1) private interest affected, (2) risk of erroneous deprivation + value of added procedures, (3) government interest/burden.' },
  { term: 'Matter of fact vs. matter of law', def: 'Matter of fact = what actually happened (decided by jury/judge from evidence). Matter of law = what the law means and how it applies (decided by judge).' },
  { term: 'Mens rea', def: 'The mental intent/state of mind needed to commit a crime. Levels (most→least culpable): purposely (specific intent) > knowingly > recklessly > negligently.' },
  { term: "M'Naghten test", def: 'At the time of the act, due to a defect of reason from disease of the mind: (1) did not know the nature/quality of the act, OR (2) did not know it was wrong.' },
  { term: 'ALI / Model Penal Code test', def: 'Lacks "substantial capacity" to (1) appreciate the criminality (wrongfulness) of conduct, OR (2) conform conduct to the law. Both cognitive and volitional prongs.' },
  { term: 'Motive vs. intent', def: 'Motive = the reason for doing something. Intent = the purposeful decision to commit the act.' },
  { term: 'Negligence', def: 'A failure to exercise reasonable care that causes harm to another.' },
  { term: 'Parens patriae', def: '"Parent of the nation." The state\'s power to act as guardian for those unable to care for themselves (minors, mentally ill). A basis for civil commitment — government as parent.' },
  { term: 'Per se', def: '"By itself" — something inherently or automatically considered (e.g., conduct illegal without further proof).' },
  { term: 'Police power', def: 'The inherent authority of government to regulate behavior and enforce order for public welfare. A basis for civil commitment (dangerousness).' },
  { term: 'Prima facie', def: '"On its face." A case where the evidence, if unchallenged, is sufficient to prove a claim or establish a legal requirement.' },
  { term: 'Pro se', def: 'Representing oneself in court without a lawyer.' },
  { term: 'Procedural due process', def: 'The government must use fair procedures (notice, hearing, unbiased fact-finder, etc.) before depriving a person of life, liberty, or property. Aka "liberty interest." Mathews v. Eldridge balancing test.' },
  { term: 'Professional judgment rule', def: 'From Youngberg v. Romeo — institutional/professional decisions are presumed valid unless a substantial departure from accepted professional judgment.' },
  { term: 'Punitive damages', def: 'Additional damages awarded to punish egregious conduct and deter similar actions.' },
  { term: 'Quid pro quo', def: '"This for that." A mutual exchange where one thing is given in return for another.' },
  { term: 'Res ipsa loquitur', def: '"The thing speaks for itself." Negligence inferred from the nature of the accident. Elements: (1) exclusive control by defendant, (2) wouldn\'t ordinarily occur without negligence, (3) no plaintiff contribution, (4) evidence eliminates other causes.' },
  { term: 'Respondeat superior', def: 'Doctrine holding an employer liable for an employee\'s acts performed within the scope of employment.' },
  { term: 'Reversible error', def: 'A significant trial mistake that may justify overturning the verdict on appeal.' },
  { term: 'Self-defense', def: 'Affirmative defense requiring: (1) not at fault/no provocation, (2) honest & reasonable belief of imminent death/serious harm, (3) proportional force. In Ohio, the prosecution must now disprove self-defense beyond a reasonable doubt once raised.' },
  { term: 'Sell criteria', def: 'For forced antipsychotics to restore competence: (1) important government interest, (2) treatment substantially furthers it, (3) necessary (no less intrusive alternative), (4) medically appropriate.' },
  { term: 'Sine qua non', def: '"Without which, not." An essential condition; absolutely necessary.' },
  { term: 'Sovereign immunity', def: 'The principle that the government cannot be sued without its consent.' },
  { term: 'Standards of appellate review', def: 'De novo → no deference (law); clearly erroneous → moderate deference (facts, bench trials); abuse of discretion → high deference (judgment calls); substantial evidence → deferential review of jury/agency outcomes.' },
  { term: 'Standards of proof (ascending)', def: 'Reason to believe < probable cause (<40%) < preponderance (51%+, civil/$) < clear and convincing (70–80%; civil commitment, termination of parental rights, involuntary meds to restore competence) < beyond a reasonable doubt (>90%, criminal).' },
  { term: 'Stare decisis', def: '"To stand by things decided." Courts should follow precedent in cases with similar facts.' },
  { term: 'Statutory vs. common law', def: 'Statutory law = written, enacted by a legislature. Common law = derived from court opinions/case law.' },
  { term: 'Strict scrutiny', def: 'Highest level of review. Government must show the law is narrowly tailored to a compelling state interest. Applied to fundamental rights and suspect classifications (race, national origin, religion, alienage).' },
  { term: 'Sua sponte', def: 'When a court acts on its own initiative, without a request from any party.' },
  { term: 'Subpoena duces tecum', def: 'A court order requiring a person to produce documents or records.' },
  { term: 'Substantive due process', def: 'Certain fundamental rights (voting, interstate travel, marriage, parenting, contraception) are protected from government interference even with fair procedures. Fundamental rights → strict scrutiny. Aka "fundamental fairness."' },
  { term: 'Summary judgment', def: 'Post-discovery motion to dismiss; the judge considers the plaintiff\'s claims and rules whether a tort is present — if not, the case is dismissed.' },
  { term: 'Tort', def: 'A "civil wrong" — a claim/issue that is the basis for civil liability outside of contract.' },
  { term: 'Trier of fact vs. trier of law', def: 'Trier of fact (jury or judge) determines what actually happened. Trier of law (judge) applies legal rules to those facts.' },
  { term: 'Voir dire', def: '"To speak the truth." The jury selection process — questioning potential jurors for bias or conflicts.' },
  { term: 'Writ of certiorari', def: 'An order by a higher court to review the decision of a lower court.' },
];

// =====================================================================
// CONSTITUTIONAL LAW — VanDercar notes
// =====================================================================
const AMENDMENTS = [
  { num: '1st', short: 'Speech, religion, press, assembly, petition', detail: 'Protects freedom of speech, press, assembly, petitioning the government, and religion (free exercise + establishment).', incorp: 'Fully incorporated.' },
  { num: '2nd', short: 'Right to keep and bear arms', detail: 'The right to keep and bear arms.', incorp: 'Fully incorporated.' },
  { num: '3rd', short: 'No quartering of soldiers', detail: 'No quartering of soldiers in private homes without consent in peacetime.', incorp: 'NOT incorporated.' },
  { num: '4th', short: 'Search & seizure', detail: 'Protects against unreasonable searches and seizures by the government (must have probable cause).', incorp: 'Fully incorporated.' },
  { num: '5th', short: 'Due process, self-incrimination, double jeopardy', detail: 'Due process clause (federal); grand jury indictment for federal felonies; no compelled self-incrimination; takings clause (compensate for private property taken for public use); no double jeopardy.', incorp: 'All incorporated EXCEPT the right to grand jury indictment.' },
  { num: '6th', short: 'Criminal trial rights', detail: 'Speedy & public trial; impartial jury; confrontation of witnesses; compulsory process to obtain witnesses; right to counsel. With the 5th, supplies the constitutional underpinning of competence to stand trial.', incorp: 'All incorporated EXCEPT the right to a jury of one\'s own geographic location/vicinage.' },
  { num: '7th', short: 'Civil jury trial', detail: 'Right to a jury trial in civil suits.', incorp: 'NOT incorporated.' },
  { num: '8th', short: 'No cruel & unusual punishment', detail: 'No excessive bail or fines; no cruel and unusual punishment. Deliberate indifference to serious medical needs violates this right in post-adjudication carceral cases (Estelle v. Gamble).', incorp: 'All incorporated except excessive-bail clause (unclear).' },
  { num: '14th', short: 'Due process + equal protection (to states)', detail: 'Due process — applies most of the Bill of Rights to the states via selective incorporation. Equal protection — similarly situated individuals must be treated equally.', incorp: 'The vehicle for incorporation (ratified 1868).' },
];

const CONLAW_CONCEPTS = [
  { id: 'bor', title: 'Bill of Rights & Incorporation', body: 'The first ten amendments (the Bill of Rights, 1791) were enacted to apply to the FEDERAL government. They have been "selectively incorporated" through the 14th Amendment (1868, a Reconstruction amendment) to apply to the states.',
    points: ['1st, 2nd, 4th — fully incorporated', '5th — all incorporated except grand-jury indictment', '6th — all incorporated except jury of geographic location', '8th — all incorporated except excessive bail (unclear)', '3rd, 7th — NOT incorporated', '9th, 10th — not incorporated but structurally relevant'] },
  { id: 'pdp', title: 'Procedural Due Process (14th / 5th)', body: 'The government must use FAIR PROCESSES when depriving a person of life, liberty, or property. The required rights vary with what is being deprived and may include an unbiased fact-finder, notice, opportunity to present evidence, cross-examination, and right to counsel.',
    points: ['Triggered when the state (14th) or federal government (5th) deprives life, liberty, or property', 'Mathews v. Eldridge provides the balancing test', 'Mathews factors: (1) private interest, (2) risk of erroneous deprivation + value of added procedures, (3) government interest/burden'] },
  { id: 'sdp', title: 'Substantive Due Process', body: 'Certain fundamental rights are protected from being taken at all, even with fair procedures ("fundamental fairness").',
    points: ['Fundamental rights: voting, interstate travel, marriage, parenting, contraception', 'Government interference with a fundamental right must meet STRICT SCRUTINY'] },
  { id: 'ep', title: 'Equal Protection (14th)', body: 'Similarly situated people must be treated the same. Through "reverse incorporation," equal protection also applies to the federal government. If people are treated differently, the basis must survive the applicable level of review.',
    points: ['Rational basis (default): legitimate state interest + rational connection between means and goal', 'Intermediate scrutiny (gender, illegitimacy): important government interest + substantially related means', 'Strict scrutiny (race, national origin, religion, alienage): compelling government interest + narrowly tailored means'] },
  { id: 'scrutiny', title: 'The Three Tiers of Scrutiny', body: 'The level of judicial review escalates with the type of classification or right at stake.',
    points: ['Rational basis → legitimate interest + rationally related (default)', 'Intermediate → important interest + substantially related (gender, illegitimacy)', 'Strict → compelling interest + narrowly tailored (suspect classes; fundamental rights)'] },
];

// =====================================================================
// INSANITY DEFENSE — historical development + IDRA (1984)
// =====================================================================
const INSANITY_TESTS = [
  { id: 'mnaghten', name: "M'Naghten Rule", year: '1843', tag: 'Cognitive', focus: 'Cognition — did they know what they were doing, or that it was wrong?',
    rule: 'Not guilty by reason of insanity if, at the time of the act, the defendant suffered a "defect of reason" from a "disease of the mind," AND either did not know the nature and quality of the act, OR did not know the act was wrong.',
    origin: "M'Naghten's Case (1843, England)",
    criticism: 'Ignores the inability to control behavior; based on outdated medical understanding.' },
  { id: 'impulse', name: 'Irresistible Impulse Test', year: 'Late 1800s', tag: 'Volitional add-on', focus: 'Volition — could they control themselves?',
    rule: "Adds to M'Naghten: even if the defendant knew the act was wrong, they can be found insane if mental illness prevented them from controlling their actions.",
    origin: 'Various U.S. state cases (no single defining case)',
    criticism: 'Hard for experts to distinguish inability from unwillingness to control; still narrow.' },
  { id: 'durham', name: 'Durham Rule ("Product Test")', year: '1954', tag: 'Causation', focus: 'Causation — was the crime caused by the mental illness?',
    rule: 'Not criminally responsible if the unlawful act was the PRODUCT of mental disease or defect. Defendant presumed sane; once insanity is raised, the prosecution must prove sanity beyond a reasonable doubt.',
    origin: 'Durham v. United States (D.C. Cir. 1954)',
    criticism: 'Too broad and vague; gave psychiatrists excessive influence. Abandoned when D.C. Cir. dropped it in U.S. v. Brawner (1972).' },
  { id: 'ali', name: 'ALI Model Penal Code Test', year: '1962', tag: 'Hybrid', focus: 'Combines cognition and volition; uses "lacked substantial capacity" rather than total incapacity.',
    rule: 'Not responsible if, as a result of mental disease or defect, the defendant lacked SUBSTANTIAL CAPACITY to (a) appreciate the criminality/wrongfulness of conduct, OR (b) conform conduct to the requirements of law.',
    origin: "ALI Model Penal Code § 4.01; adopted in U.S. v. Brawner (1972)",
    criticism: 'Seen as too defendant-friendly; public backlash after the Hinckley acquittal.' },
  { id: 'idra', name: 'IDRA Federal Test', year: '1984', tag: 'Cognitive only', focus: 'Appreciate nature/wrongfulness only; defendant must prove insanity.',
    rule: 'Not responsible if, at the time of the offense, as a result of a SEVERE mental disease or defect, the defendant was unable to appreciate the nature and quality OR wrongfulness of the acts. Volitional prong eliminated.',
    origin: 'Insanity Defense Reform Act of 1984 (federal statute)',
    criticism: 'Significantly narrowed the defense; shifted the burden to the defendant.' },
];

const IDRA_PROVISIONS = [
  { h: '1 · Narrowed definition', t: 'Eliminated the conformity/volitional prong entirely. New standard: due to a SEVERE mental disease/defect, unable to appreciate the nature and quality or wrongfulness of the act.' },
  { h: '2 · Burden shifted to defendant', t: 'Previously the government had to prove the defendant was NOT insane. Under IDRA, the DEFENDANT bears the burden — by CLEAR AND CONVINCING evidence (high, but below beyond a reasonable doubt).' },
  { h: '3 · Expert testimony restricted', t: 'Experts may describe the illness, symptoms, and effects, but may NOT directly opine on whether the defendant met the legal standard (the ultimate issue). That determination is the jury\'s.' },
  { h: '4 · Automatic commitment', t: 'A defendant found NGRI is automatically committed to a mental health facility. Release requires a later showing that the person is no longer dangerous due to mental illness.' },
  { h: '5 · Volitional prong abolished', t: 'A person can no longer be excused merely for being unable to control their actions (loss of willpower/impulse control). Only cognitive impairment qualifies.' },
  { h: '6 · Diminished capacity abolished (federal)', t: 'IDRA abolished the diminished-capacity defense in federal court. Evidence of mental illness may still be introduced if relevant to whether the defendant possessed the required mens rea.' },
];

// =====================================================================
// BASIC LAW CONCEPTS — Noffsinger (approved) + Ohio CST + Daubert
// =====================================================================
const BASIC_LAW = [
  { id: 'ohio_cst', cat: 'Competence (Ohio)', title: 'Ohio Competence to Stand Trial — ORC § 2945.37',
    body: 'Ohio codifies the Dusky standard. A defendant is PRESUMED competent. A defendant is found incompetent to stand trial if, because of the defendant\'s PRESENT mental condition, the defendant is incapable of (1) understanding the nature and objective of the proceedings, OR (2) assisting in the defendant\'s own defense.',
    points: ['Presumption of competence', 'Incompetent if cannot understand the nature/objective of proceedings OR assist in defense', 'Burden: PREPONDERANCE of the evidence (party asserting incompetence)', 'Restoration governed by ORC § 2945.38; restoration time is capped relative to the offense (Jackson v. Indiana)'] },
  { id: 'daubert', cat: 'Expert Witness', title: 'Daubert Criteria (FRE 702 — judge as gatekeeper)',
    body: 'Daubert v. Merrell Dow (1993) replaced Frye\'s "general acceptance" test in federal court and made the trial judge the gatekeeper of scientific evidence. Kumho Tire (1999) later extended it to all expert testimony.',
    points: ['Testable / falsifiable', 'Peer reviewed / published', 'Known or potential error rate', 'Standards & controls exist and are maintained', 'General acceptance in the relevant community'] },
  { id: 'punishment', cat: 'Criminal Law', title: 'Purposes of Punishment',
    body: 'The recognized aims a criminal sentence may serve.',
    points: ['Retribution', 'Deterrence (general AND individual/specific)', 'Incapacitation', 'Rehabilitation', 'Restitution'] },
  { id: 'sources', cat: 'Foundations', title: 'Sources of Law',
    body: 'Law in the United States derives from four sources.',
    points: ['Constitutions', 'Statutes (legislative enactments — e.g., Ohio Revised Code, U.S. Code)', 'Case law (court opinions / precedent)', 'Administrative rules (agency regulations — e.g., State Medical Board of Ohio)'] },
  { id: 'court_structure', cat: 'Court Structure', title: 'Court Structure — Two Parallel Systems',
    body: 'There are two court systems — STATE and FEDERAL — each with a trial → appellate → supreme court ladder. A state supreme court case may be appealed up to the U.S. Supreme Court.',
    points: ['State (Ohio): Court of Common Pleas (88) → Ohio Court of Appeals (12 districts) → Ohio Supreme Court', 'Federal: U.S. District Court (94) → U.S. Court of Appeals (13 circuits) → U.S. Supreme Court', 'Ohio sits in the 6th Circuit', 'A state supreme court decision can be appealed to SCOTUS (federal question)'] },
  { id: 'fact_law', cat: 'Trial Process', title: 'Trial: Matter of Fact vs. Matter of Law',
    body: 'Findings of FACT (what happened) are made by the trier of fact and generally are NOT appealable. Questions of LAW (what the law means / how it applies) are decided by the judge and ARE appealable.',
    points: ['Matter of fact → trier of fact (jury/judge); deferential on appeal', 'Matter of law → judge; reviewable de novo', 'Appeals address legal error, not re-litigation of facts'] },
  { id: 'appellate', cat: 'Appeals', title: 'Appellate Review',
    body: 'An appellate court reviews the trial record for ERRORS of law. It does NOT hold a retrial, hear new evidence, or call new witnesses.',
    points: ['Reviews for legal error', 'No retrial / no new evidence', 'May affirm, reverse, or remand'] },
  { id: 'appeals_court', cat: 'Appeals', title: 'Appeals Court & Certiorari',
    body: 'A litigant is generally guaranteed ONE appeal as of right. Further review by the supreme court is discretionary — granted by a writ of certiorari.',
    points: ['One guaranteed appeal (as of right)', 'Higher review is discretionary', 'Writ of certiorari = the order granting review'] },
  { id: 'precedent', cat: 'Foundations', title: 'Precedent / Stare Decisis',
    body: '"To stand by things decided." Courts follow precedent — earlier decisions on similar facts — to promote stability and predictability in the law.',
    points: ['Binding on lower courts in the same jurisdiction', 'Promotes consistency and predictability', 'Higher courts can overrule their own precedent'] },
  { id: 'expert', cat: 'Expert Witness', title: 'Expert Witness Testimony',
    body: 'An expert is qualified by education, experience, training, special expertise, or knowledge, and strives for impartiality.',
    points: ['Qualified by education/experience/training/expertise/knowledge', 'Strives for impartiality', 'Operates at the "more likely than not" standard'] },
  { id: 'standards', cat: 'Standards of Proof', title: 'Standards of Proof — The Ascending Ladder',
    body: 'The level of certainty the fact-finder must reach. A higher standard is required when an erroneous conclusion would cause greater harm; the standard assigns the risk of error between the parties.',
    points: ['Beyond a Reasonable Doubt — >90% — criminal trials', 'Clear & Convincing — 70–80% — civil commitment, deportation, loss of parental rights, involuntary meds to restore competence', 'Preponderance — 51%+ — money damages; expert witness testimony', 'Probable Cause — <40% — arrest, search warrant, arraignment', 'Reason to Believe — lowest — reasonable suspicion (Terry stop)'] },
  { id: 'probable_cause', cat: 'Standards of Proof', title: 'Probable Cause (Arrest & Seizure)',
    body: 'Probable cause (<40%) is based on the reasonable-PERSON standard and is used to proceed at arraignment, for arrest, and for search warrants.',
    points: ['Arrest: facts that would lead a reasonable person to believe the individual has committed (or is about to commit) a crime', 'Seize evidence: facts that would lead a reasonable person to believe evidence/contraband will be found in the place searched'] },
  { id: 'reason_believe', cat: 'Standards of Proof', title: 'Reason to Believe (Reasonable Suspicion)',
    body: 'The lowest standard, based on the reasonable-POLICE-OFFICER standard. Officers may stop and briefly detain a person if, based on training and experience, there is reason to believe the person is engaged in criminal activity (the Terry-stop concept).',
    points: ['Reasonable-police-officer standard', 'Permits a brief investigatory stop/detention', 'Terry stop'] },
  { id: 'duty_warn', cat: 'Ohio Statutes', title: 'Ohio Duty to Warn — ORC § 2305.51',
    body: 'Ohio\'s codification (via H.B. 71) of the duty to protect identifiable third parties from a patient\'s violence. It defines the limited circumstances under which a mental health professional has — and can discharge — the duty.',
    points: ['Codifies Tarasoff-type duty in Ohio', 'Triggered by an explicit threat against a clearly identifiable victim (or knowledge of such risk)', 'Duty is discharged by reasonable steps (warn the victim, notify law enforcement, hospitalize, etc.)'] },
  { id: 'duty_report', cat: 'Ohio Statutes', title: 'Duty to Report — OAC § 4731-15',
    body: 'Any licensee of the State Medical Board shall report to the Board a belief that a violation of Chapter 4731 or any Board rule has occurred.',
    points: ['"Reason to believe" / "a belief" does NOT require certainty', 'Only an opinion that a violation occurred, based on firsthand knowledge or reliable information', 'Mandatory, not discretionary'] },
];

// =====================================================================
// QUIZ GENERATION — covers ALL cases plus optional concept questions
// =====================================================================
function pickDistractors(all, correctItem, keyFn, n) {
  const correctVal = keyFn(correctItem);
  const sameCat = all.filter(c => c.category === correctItem.category && keyFn(c) !== correctVal);
  const otherCat = all.filter(c => c.category !== correctItem.category && keyFn(c) !== correctVal);
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  const pool = [...shuffle(sameCat), ...shuffle(otherCat)];
  const chosen = []; const seen = new Set([correctVal]);
  for (const c of pool) { const v = keyFn(c); if (!seen.has(v)) { chosen.push(c); seen.add(v); } if (chosen.length >= n) break; }
  return chosen;
}

function makeOptions(correctText, distractorTexts) {
  const opts = [correctText, ...distractorTexts];
  const indexed = opts.map((text, i) => ({ text, isCorrect: i === 0 }));
  for (let i = indexed.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [indexed[i], indexed[j]] = [indexed[j], indexed[i]]; }
  return { options: indexed.map(o => o.text), correct: indexed.findIndex(o => o.isCorrect) };
}

function generateCaseQuestions(cases) {
  const questions = [];
  for (const c of cases) {
    const type = Math.random() < 0.5 ? 'holding' : 'caseName';
    if (type === 'holding') {
      const distractors = pickDistractors(cases, c, x => x.holding, 3).map(x => x.holding);
      if (distractors.length < 2) continue;
      const { options, correct } = makeOptions(c.holding, distractors);
      questions.push({ q: `What did the court hold in ${c.name} (${c.court}, ${c.year})?`, options, correct,
        explanation: `${c.name} — ${c.significance} Issue: ${c.issue}` });
    } else {
      const distractors = pickDistractors(cases, c, x => x.name, 3).map(x => x.name);
      if (distractors.length < 2) continue;
      const { options, correct } = makeOptions(c.name, distractors);
      questions.push({ q: `Which case established this holding?\n\n"${c.holding}"`, options, correct,
        explanation: `${c.name} (${c.court}, ${c.year}) — ${c.category}. ${c.significance}` });
    }
  }
  return questions;
}

function generateConceptQuestions() {
  const qs = [];
  // Amendments
  for (const a of AMENDMENTS) {
    const distractors = pickDistractors(AMENDMENTS, a, x => x.short, 3).map(x => x.short);
    const { options, correct } = makeOptions(a.short, distractors);
    qs.push({ q: `What does the ${a.num} Amendment chiefly protect?`, options, correct, explanation: `${a.num} Amendment: ${a.detail}` });
  }
  // Insanity tests
  for (const t of INSANITY_TESTS) {
    const distractors = pickDistractors(INSANITY_TESTS, t, x => x.name, 3).map(x => x.name);
    const { options, correct } = makeOptions(t.name, distractors);
    qs.push({ q: `Which insanity standard does this describe?\n\n"${t.rule}"`, options, correct, explanation: `${t.name} (${t.year}) — ${t.focus}` });
  }
  // Terms
  const sampleTerms = [...TERMS].sort(() => Math.random() - 0.5).slice(0, 12);
  for (const tm of sampleTerms) {
    const distractors = pickDistractors(TERMS, tm, x => x.term, 3).map(x => x.term);
    const { options, correct } = makeOptions(tm.term, distractors);
    qs.push({ q: `Which legal term matches this definition?\n\n"${tm.def}"`, options, correct, explanation: `${tm.term}: ${tm.def}` });
  }
  return qs;
}

function shuffleArr(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

const CATEGORIES = [...new Set(CASES.map(c => c.category))];

// =====================================================================
// MAIN COMPONENT
// =====================================================================
export default function App() {
  const [mode, setMode] = useState('oral');
  const [progress, setProgress] = useState({});

  useEffect(() => {
    (async () => {
      try { const result = await window.storage?.get('forensic_progress'); if (result?.value) setProgress(JSON.parse(result.value)); } catch (e) {}
    })();
  }, []);

  const saveProgress = async (newProgress) => {
    setProgress(newProgress);
    try { await window.storage?.set('forensic_progress', JSON.stringify(newProgress)); } catch (e) {}
  };
  const markCase = (id, status) => saveProgress({ ...progress, [id]: status });
  const resetProgress = async () => saveProgress({});

  return (
    <div style={{ fontFamily: "'Fraunces', 'Source Serif Pro', Georgia, serif", minHeight: '100vh', background: 'linear-gradient(180deg, #f4ede0 0%, #ede4d3 100%)', color: '#1a1612' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..900&family=Source+Serif+Pro:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        button { cursor: pointer; font-family: inherit; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.55; } }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        <header style={{ borderBottom: '2px solid #1a3a5c', paddingBottom: 20, marginBottom: 28, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#8b6f3c', marginBottom: 4 }}>UH / CWRU · Forensic Psychiatry</div>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 38, fontWeight: 600, fontStyle: 'italic', margin: 0, color: '#1a3a5c', letterSpacing: '-0.02em' }}>Landmark Final Exam <span style={{ fontStyle: 'normal', fontWeight: 400 }}>—</span> Study Guide</h1>
          </div>
          <ProgressBadge progress={progress} total={CASES.length} />
        </header>

        <ModeTabs mode={mode} setMode={setMode} />

        <main style={{ marginTop: 24 }}>
          {mode === 'oral' && <OralExamMode progress={progress} markCase={markCase} />}
          {mode === 'browse' && <BrowseMode progress={progress} />}
          {mode === 'conlaw' && <ConLawMode />}
          {mode === 'insanity' && <InsanityMode />}
          {mode === 'basiclaw' && <BasicLawMode />}
          {mode === 'terms' && <TermsMode />}
          {mode === 'flashcards' && <FlashcardsMode progress={progress} markCase={markCase} />}
          {mode === 'quiz' && <QuizMode />}
          {mode === 'progress' && <ProgressMode progress={progress} resetProgress={resetProgress} />}
          {mode === 'countdown' && <CountdownMode />}
        </main>

        <footer style={{ marginTop: 48, paddingTop: 20, borderTop: '1px solid #d4c5a8', textAlign: 'center', fontSize: 12, color: '#6b5d4a', letterSpacing: '0.05em' }}>
          {CASES.length} landmark cases · {TERMS.length} legal terms · {INSANITY_TESTS.length} insanity standards · {BASIC_LAW.length} basic-law concepts · exam June 8, 2026
        </footer>
      </div>
    </div>
  );
}

// =====================================================================
// PROGRESS BADGE + STAT
// =====================================================================
function ProgressBadge({ progress, total }) {
  const mastered = Object.values(progress).filter(v => v === 'mastered').length;
  const reviewing = Object.values(progress).filter(v => v === 'reviewing').length;
  return (
    <div style={{ display: 'flex', gap: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
      <Stat label="Mastered" value={mastered} color="#3d6b3a" />
      <Stat label="Reviewing" value={reviewing} color="#a06530" />
      <Stat label="Cases" value={total} color="#1a3a5c" />
    </div>
  );
}
function Stat({ label, value, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 22, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6b5d4a', marginTop: 4 }}>{label}</div>
    </div>
  );
}

// =====================================================================
// MODE TABS
// =====================================================================
function ModeTabs({ mode, setMode }) {
  const tabs = [
    { id: 'oral', label: 'Oral Sim', icon: Mic },
    { id: 'browse', label: 'Case Library', icon: BookOpen },
    { id: 'conlaw', label: 'Con Law', icon: Landmark },
    { id: 'insanity', label: 'Insanity Defense', icon: Brain },
    { id: 'basiclaw', label: 'Basic Law', icon: Gavel },
    { id: 'terms', label: 'Legal Terms', icon: Scale },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
    { id: 'quiz', label: 'MCQ Quiz', icon: ListChecks },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'countdown', label: 'Countdown', icon: CalendarClock },
  ];
  return (
    <nav style={{ display: 'flex', gap: 4, flexWrap: 'wrap', borderBottom: '1px solid #d4c5a8' }}>
      {tabs.map(t => {
        const Icon = t.icon; const active = mode === t.id;
        return (
          <button key={t.id} onClick={() => setMode(t.id)}
            style={{ background: 'none', border: 'none', padding: '12px 16px',
              borderBottom: active ? '3px solid #1a3a5c' : '3px solid transparent',
              color: active ? '#1a3a5c' : '#6b5d4a', fontFamily: "'Fraunces', serif",
              fontSize: 14.5, fontWeight: active ? 600 : 400, fontStyle: active ? 'italic' : 'normal',
              display: 'inline-flex', alignItems: 'center', gap: 7, transition: 'all 0.2s', marginBottom: -1 }}>
            <Icon size={15} strokeWidth={1.5} /> {t.label}
          </button>
        );
      })}
    </nav>
  );
}

// =====================================================================
// ORAL EXAM SIMULATOR  (Examiner Drill + Category Map)
// =====================================================================
function OralExamMode({ progress, markCase }) {
  const [view, setView] = useState('drill'); // 'drill' | 'map'
  const [filter, setFilter] = useState('all');
  const [chronological, setChronological] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [idx, setIdx] = useState(0);
  const blank = { courtYear: false, facts: false, issue: false, holding: false, sig: false, elements: false };
  const [revealed, setRevealed] = useState(blank);

  const pool = useMemo(() => {
    let list = CASES;
    if (filter === 'review') list = list.filter(c => progress[c.id] !== 'mastered');
    if (filter === 'unseen') list = list.filter(c => !progress[c.id]);
    if (CATEGORIES.includes(filter)) list = list.filter(c => c.category === filter);
    const arr = [...list];
    if (chronological) { arr.sort((a, b) => a.year - b.year); return arr; }
    let seed = shuffleSeed;
    for (let i = arr.length - 1; i > 0; i--) { seed = (seed * 9301 + 49297) % 233280; const j = Math.floor((seed / 233280) * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
    return arr;
  }, [filter, shuffleSeed, progress, chronological]);

  // ---------- Category Map view ----------
  if (view === 'map') {
    const catList = filter !== 'all' && CATEGORIES.includes(filter) ? [filter] : CATEGORIES;
    return (
      <div>
        <ViewToggle view={view} setView={setView} />
        <p style={{ fontSize: 13, color: '#6b5d4a', fontStyle: 'italic', margin: '6px 0 18px 0', lineHeight: 1.6 }}>
          Study the shape of each topic: every category with its cases laid out chronologically. Examiners often walk you forward through a line of cases — see how each one builds on the last.
        </p>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          style={{ ...selectStyle, marginBottom: 20 }}>
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {catList.map(cat => {
          const list = CASES.filter(c => c.category === cat).sort((a, b) => a.year - b.year);
          return (
            <section key={cat} style={{ marginBottom: 26 }}>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontStyle: 'italic', fontWeight: 500, color: '#1a3a5c', margin: '0 0 12px 0', borderBottom: '1px solid #d4c5a8', paddingBottom: 6 }}>
                {cat} <span style={{ fontSize: 12, fontStyle: 'normal', color: '#8b6f3c' }}>· {list.length} cases</span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative', paddingLeft: 18 }}>
                <div style={{ position: 'absolute', left: 4, top: 8, bottom: 8, width: 2, background: '#d4c5a8' }} />
                {list.map(c => (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '7px 0', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: -18, top: 12, width: 9, height: 9, borderRadius: '50%', background: '#1a3a5c', border: '2px solid #f4ede0' }} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: '#8b6f3c', fontWeight: 500, minWidth: 42 }}>{c.year}</span>
                    <span style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontStyle: 'italic', color: '#1a3a5c' }}>{c.name}</span>
                    <span style={{ fontSize: 12, color: '#6b5d4a' }}>· {c.court}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    );
  }

  // ---------- Examiner Drill view ----------
  const current = pool[idx];
  if (!current) return (<div><ViewToggle view={view} setView={setView} /><EmptyState message="No cases match this filter. Try resetting." /></div>);

  const reset = () => setRevealed(blank);
  const next = () => { reset(); setIdx(i => (i + 1) % pool.length); };
  const prev = () => { reset(); setIdx(i => (i - 1 + pool.length) % pool.length); };

  return (
    <div>
      <ViewToggle view={view} setView={setView} />
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
        <select value={filter} onChange={(e) => { setFilter(e.target.value); setIdx(0); reset(); }} style={selectStyle}>
          <option value="all">All Categories ({CASES.length})</option>
          <option value="unseen">Unseen Only</option>
          <option value="review">Needs Review</option>
          <optgroup label="By Category">{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</optgroup>
        </select>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#1a3a5c', cursor: 'pointer' }}>
          <input type="checkbox" checked={chronological} onChange={(e) => { setChronological(e.target.checked); setIdx(0); reset(); }} />
          Chronological order
        </label>
        {!chronological && (
          <button onClick={() => { setShuffleSeed(Math.random() * 10000); setIdx(0); reset(); }} style={btnSecondary}><Shuffle size={14} /> Shuffle</button>
        )}
        <div style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#6b5d4a' }}>{idx + 1} / {pool.length}</div>
      </div>

      <div style={cardStyle}>
        <div style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#8b6f3c', marginBottom: 8 }}>Examiner says…</div>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 500, fontStyle: 'italic', margin: '0 0 4px 0', color: '#1a3a5c' }}>"Tell me about {current.name}."</h2>
        <div style={{ fontSize: 13, color: '#6b5d4a', marginBottom: 8 }}><em>{current.category}</em></div>

        <div style={{ borderTop: '1px solid #e3d7bc', paddingTop: 16, marginTop: 12 }}>
          <p style={{ fontSize: 14, color: '#6b5d4a', fontStyle: 'italic', margin: '0 0 14px 0', lineHeight: 1.6 }}>
            Recite out loud, in order: <strong>court &amp; year</strong> → <strong>facts</strong> → <strong>issue</strong> → <strong>holding</strong> → <strong>significance</strong>. Reveal each only after you attempt it.
          </p>
        </div>

        <RevealSection label="Court & Year" content={`${current.court} · ${current.year}`} revealed={revealed.courtYear} highlight
          onReveal={() => setRevealed(r => ({ ...r, courtYear: true }))} />
        <RevealSection label="1 · Facts" content={current.facts} revealed={revealed.facts}
          onReveal={() => setRevealed(r => ({ ...r, facts: true }))} />
        <RevealSection label="2 · Issue" content={current.issue} revealed={revealed.issue}
          onReveal={() => setRevealed(r => ({ ...r, issue: true }))} />
        <RevealSection label="3 · Holding" content={current.holding} revealed={revealed.holding} highlight
          onReveal={() => setRevealed(r => ({ ...r, holding: true }))} />
        {current.elements?.length > 0 && (
          <RevealSection label="Key Elements / Rule" content={
            <ul style={{ margin: 0, paddingLeft: 20 }}>{current.elements.map((el, i) => <li key={i} style={{ marginBottom: 4 }}>{el}</li>)}</ul>
          } revealed={revealed.elements} onReveal={() => setRevealed(r => ({ ...r, elements: true }))} />
        )}
        <RevealSection label="4 · Significance" content={current.significance} revealed={revealed.sig}
          onReveal={() => setRevealed(r => ({ ...r, sig: true }))} />

        <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid #e3d7bc' }}>
          <div style={{ fontSize: 12, color: '#6b5d4a', marginBottom: 10, letterSpacing: '0.05em' }}>How well did you know this (including court &amp; year)?</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <SelfAssessBtn label="Got it cold" color="#3d6b3a" active={progress[current.id] === 'mastered'} onClick={() => { markCase(current.id, 'mastered'); next(); }} />
            <SelfAssessBtn label="Needs review" color="#a06530" active={progress[current.id] === 'reviewing'} onClick={() => { markCase(current.id, 'reviewing'); next(); }} />
            <SelfAssessBtn label="Didn't know it" color="#8b2c2c" active={progress[current.id] === 'unknown'} onClick={() => { markCase(current.id, 'unknown'); next(); }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <button onClick={prev} style={btnSecondary}><ChevronLeft size={16} /> Previous</button>
        <button onClick={next} style={btnPrimary}>Next case <ChevronRight size={16} /></button>
      </div>
    </div>
  );
}

function ViewToggle({ view, setView }) {
  return (
    <div style={{ display: 'inline-flex', gap: 0, marginBottom: 16, border: '1.5px solid #1a3a5c', borderRadius: 6, overflow: 'hidden' }}>
      {[{ id: 'drill', label: 'Examiner Drill', icon: Mic }, { id: 'map', label: 'Category Map', icon: Map }].map(t => {
        const Icon = t.icon; const active = view === t.id;
        return (
          <button key={t.id} onClick={() => setView(t.id)} style={{ padding: '8px 16px', border: 'none', background: active ? '#1a3a5c' : 'transparent', color: active ? '#fffdf6' : '#1a3a5c', fontFamily: "'Fraunces', serif", fontStyle: active ? 'italic' : 'normal', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon size={14} /> {t.label}
          </button>
        );
      })}
    </div>
  );
}

function RevealSection({ label, content, revealed, onReveal, highlight }) {
  return (
    <div style={{ marginTop: 16, padding: 16, background: highlight ? '#fbf7ed' : '#faf6ec', border: `1px solid ${highlight ? '#d4c282' : '#e3d7bc'}`, borderLeft: `3px solid ${highlight ? '#1a3a5c' : '#c4b594'}`, borderRadius: 2 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: revealed ? 10 : 0 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8b6f3c', fontWeight: 600 }}>{label}</div>
        {!revealed && (<button onClick={onReveal} style={{ ...btnGhost, padding: '4px 10px', fontSize: 12 }}><Eye size={12} /> Reveal</button>)}
      </div>
      {revealed && (<div style={{ fontSize: 15, lineHeight: 1.65, color: '#2a2520', fontFamily: "'Source Serif Pro', Georgia, serif" }}>{content}</div>)}
    </div>
  );
}

function SelfAssessBtn({ label, color, onClick, active }) {
  return (
    <button onClick={onClick} style={{ padding: '8px 14px', background: active ? color : 'transparent', color: active ? '#fff' : color, border: `1.5px solid ${color}`, fontFamily: 'inherit', fontSize: 13, borderRadius: 4, transition: 'all 0.15s' }}>{label}</button>
  );
}

// =====================================================================
// CASE LIBRARY (Browse) — collapsible by category + Reference Library
// =====================================================================
function BrowseMode({ progress }) {
  const [openId, setOpenId] = useState(null);
  const [filter, setFilter] = useState('all');

  const grouped = useMemo(() => {
    const list = filter === 'all' ? CASES : CASES.filter(c => c.category === filter);
    const g = {};
    list.forEach(c => { if (!g[c.category]) g[c.category] = []; g[c.category].push(c); });
    return g;
  }, [filter]);

  return (
    <div>
      <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ ...selectStyle, marginBottom: 20 }}>
        <option value="all">All Categories</option>
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      {Object.entries(grouped).map(([cat, list]) => (
        <section key={cat} style={{ marginBottom: 32 }}>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontStyle: 'italic', fontWeight: 500, color: '#1a3a5c', margin: '0 0 14px 0', borderBottom: '1px solid #d4c5a8', paddingBottom: 8 }}>{cat}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[...list].sort((a, b) => a.year - b.year).map(c => {
              const open = openId === c.id;
              const status = progress[c.id];
              const statusColor = status === 'mastered' ? '#3d6b3a' : status === 'reviewing' ? '#a06530' : status === 'unknown' ? '#8b2c2c' : null;
              return (
                <div key={c.id} style={{ background: '#faf6ec', border: '1px solid #e3d7bc', borderLeft: statusColor ? `4px solid ${statusColor}` : '4px solid #e3d7bc', borderRadius: 3, overflow: 'hidden' }}>
                  <button onClick={() => setOpenId(open ? null : c.id)} style={{ width: '100%', background: 'none', border: 'none', padding: '12px 16px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'inherit' }}>
                    <span>
                      <span style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontStyle: 'italic', color: '#1a3a5c', fontWeight: 500 }}>{c.name}</span>
                      <span style={{ fontSize: 12, color: '#6b5d4a', marginLeft: 10 }}>({c.year}, {c.court})</span>
                    </span>
                    <ChevronRight size={16} style={{ color: '#8b6f3c', transform: open ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                  </button>
                  {open && (
                    <div style={{ padding: '0 16px 16px 16px', fontFamily: "'Source Serif Pro', Georgia, serif", fontSize: 14, lineHeight: 1.6 }}>
                      <DetailRow label="Facts" content={c.facts} />
                      <DetailRow label="Issue" content={c.issue} />
                      <DetailRow label="Holding" content={c.holding} highlight />
                      <DetailRow label="Significance" content={c.significance} />
                      {c.elements?.length > 0 && (
                        <div style={{ marginTop: 10 }}>
                          <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8b6f3c', fontWeight: 600, marginBottom: 4 }}>Key Elements</div>
                          <ul style={{ margin: 0, paddingLeft: 20 }}>{c.elements.map((el, i) => <li key={i}>{el}</li>)}</ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function DetailRow({ label, content, highlight }) {
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: highlight ? '#1a3a5c' : '#8b6f3c', fontWeight: 600, marginBottom: 3 }}>{label}</div>
      <div style={{ color: '#2a2520', fontWeight: highlight ? 500 : 400 }}>{content}</div>
    </div>
  );
}

// =====================================================================
// CONSTITUTIONAL LAW
// =====================================================================
function ConLawMode() {
  const [open, setOpen] = useState(null);
  return (
    <div>
      <SectionHeader title="The Constitutional Amendments" sub="The Bill of Rights (1st–10th, 1791) originally bound only the federal government. Most were later applied to the states via selective incorporation through the 14th Amendment." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 36 }}>
        {AMENDMENTS.map(a => {
          const isOpen = open === a.num;
          return (
            <div key={a.num} style={{ background: '#faf6ec', border: '1px solid #e3d7bc', borderLeft: '4px solid #1a3a5c', borderRadius: 3, overflow: 'hidden' }}>
              <button onClick={() => setOpen(isOpen ? null : a.num)} style={{ width: '100%', background: 'none', border: 'none', padding: '12px 16px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, fontFamily: 'inherit' }}>
                <span style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <span style={{ fontFamily: "'Fraunces', serif", fontSize: 19, fontStyle: 'italic', fontWeight: 600, color: '#1a3a5c', minWidth: 46 }}>{a.num}</span>
                  <span style={{ fontFamily: "'Source Serif Pro', Georgia, serif", fontSize: 15, color: '#2a2520' }}>{a.short}</span>
                </span>
                <ChevronRight size={16} style={{ color: '#8b6f3c', flexShrink: 0, transform: isOpen ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
              </button>
              {isOpen && (
                <div style={{ padding: '0 16px 16px 74px', fontFamily: "'Source Serif Pro', Georgia, serif", fontSize: 14, lineHeight: 1.6, color: '#2a2520' }}>
                  <p style={{ margin: '0 0 10px 0' }}>{a.detail}</p>
                  <div style={{ fontSize: 13, color: '#5c3b15', background: '#f8ead4', border: '1px solid #e0c48f', borderRadius: 3, padding: '7px 11px' }}>
                    <strong style={{ letterSpacing: '0.04em' }}>Incorporation:</strong> {a.incorp}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <SectionHeader title="Core Constitutional Law Concepts" sub="Due process, equal protection, and the tiers of scrutiny that decide how hard the government's justification must work." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {CONLAW_CONCEPTS.map(c => (
          <div key={c.id} style={cardStyle}>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontStyle: 'italic', fontWeight: 500, color: '#1a3a5c', margin: '0 0 8px 0' }}>{c.title}</h3>
            <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#2a2520', margin: '0 0 12px 0', fontFamily: "'Source Serif Pro', Georgia, serif" }}>{c.body}</p>
            <ul style={{ margin: 0, paddingLeft: 20, fontFamily: "'Source Serif Pro', Georgia, serif", fontSize: 14, lineHeight: 1.7, color: '#3a332b' }}>
              {c.points.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontStyle: 'italic', fontWeight: 500, color: '#1a3a5c', margin: '0 0 6px 0' }}>{title}</h2>
      {sub && <p style={{ fontSize: 13.5, color: '#6b5d4a', lineHeight: 1.6, margin: 0, fontFamily: "'Source Serif Pro', Georgia, serif", maxWidth: 760 }}>{sub}</p>}
    </div>
  );
}

// =====================================================================
// INSANITY DEFENSE
// =====================================================================
function InsanityMode() {
  return (
    <div>
      <SectionHeader title="Evolution of the Insanity Defense" sub="The legal test for insanity has swung between cognition, volition, and causation for nearly two centuries. Each test is a reaction to the perceived overreach of the one before it." />

      {/* Timeline summary table */}
      <div style={{ ...cardStyle, padding: 0, overflow: 'hidden', marginBottom: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 130px', background: '#1a3a5c', color: '#fffdf6', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>
          <div style={{ padding: '10px 14px' }}>Test / Year</div>
          <div style={{ padding: '10px 14px' }}>Focus</div>
          <div style={{ padding: '10px 14px' }}>Type</div>
        </div>
        {INSANITY_TESTS.map((t, i) => (
          <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 130px', borderTop: '1px solid #e3d7bc', background: i % 2 ? '#faf6ec' : '#fffdf6', fontFamily: "'Source Serif Pro', Georgia, serif", fontSize: 13.5 }}>
            <div style={{ padding: '11px 14px' }}><div style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', color: '#1a3a5c', fontSize: 14.5 }}>{t.name}</div><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#8b6f3c', marginTop: 2 }}>{t.year}</div></div>
            <div style={{ padding: '11px 14px', color: '#2a2520', lineHeight: 1.5 }}>{t.focus}</div>
            <div style={{ padding: '11px 14px' }}><span style={{ fontSize: 11.5, color: '#5c3b15', background: '#f8ead4', border: '1px solid #e0c48f', borderRadius: 3, padding: '2px 8px' }}>{t.tag}</span></div>
          </div>
        ))}
      </div>

      {/* Detailed cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
        {INSANITY_TESTS.map(t => (
          <div key={t.id} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 21, fontStyle: 'italic', fontWeight: 500, color: '#1a3a5c', margin: 0 }}>{t.name}</h3>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: '#8b6f3c' }}>{t.year} · {t.tag}</span>
            </div>
            <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#2a2520', margin: '0 0 10px 0', fontFamily: "'Source Serif Pro', Georgia, serif" }}>{t.rule}</p>
            <div style={{ fontSize: 13, color: '#6b5d4a', fontFamily: "'Source Serif Pro', Georgia, serif" }}>
              <div style={{ marginBottom: 4 }}><strong style={{ color: '#1a3a5c' }}>Origin:</strong> {t.origin}</div>
              <div><strong style={{ color: '#8b2c2c' }}>Criticism:</strong> {t.criticism}</div>
            </div>
          </div>
        ))}
      </div>

      <SectionHeader title="The Insanity Defense Reform Act (1984)" sub="Passed in the wake of John Hinckley Jr.'s NGRI acquittal for the attempted assassination of President Reagan. It is the modern federal standard and dramatically narrowed the defense." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
        {IDRA_PROVISIONS.map((p, i) => (
          <div key={i} style={{ background: '#faf6ec', border: '1px solid #e3d7bc', borderLeft: '3px solid #1a3a5c', borderRadius: 3, padding: 14 }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontStyle: 'italic', fontWeight: 500, color: '#1a3a5c', marginBottom: 5 }}>{p.h}</div>
            <div style={{ fontSize: 13.5, lineHeight: 1.55, color: '#2a2520', fontFamily: "'Source Serif Pro', Georgia, serif" }}>{p.t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =====================================================================
// BASIC LAW CONCEPTS
// =====================================================================
function BasicLawMode() {
  const groups = useMemo(() => {
    const order = ['Competence (Ohio)', 'Expert Witness', 'Standards of Proof', 'Foundations', 'Court Structure', 'Trial Process', 'Appeals', 'Criminal Law', 'Ohio Statutes'];
    const g = {};
    BASIC_LAW.forEach(c => { if (!g[c.cat]) g[c.cat] = []; g[c.cat].push(c); });
    return order.filter(o => g[o]).map(o => [o, g[o]]).concat(Object.entries(g).filter(([k]) => !order.includes(k)));
  }, []);

  return (
    <div>
      <SectionHeader title="Basic Law Concepts" sub="The structural fundamentals — sources of law, the court ladder, standards of proof, expert testimony — plus the two you must have cold: Ohio's competence-to-stand-trial statute and the Daubert criteria." />
      {groups.map(([cat, list]) => (
        <section key={cat} style={{ marginBottom: 28 }}>
          <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 500, color: '#8b6f3c', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.18em' }}>{cat}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {list.map(c => {
              const star = c.id === 'ohio_cst' || c.id === 'daubert';
              return (
                <div key={c.id} style={{ ...cardStyle, borderLeft: star ? '4px solid #8b6f3c' : '1px solid #d4c5a8' }}>
                  <h4 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontStyle: 'italic', fontWeight: 500, color: '#1a3a5c', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {star && <span style={{ fontSize: 11, fontStyle: 'normal', background: '#8b6f3c', color: '#fffdf6', borderRadius: 3, padding: '2px 7px', letterSpacing: '0.08em', fontFamily: "'JetBrains Mono', monospace" }}>HIGH YIELD</span>}
                    {c.title}
                  </h4>
                  <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#2a2520', margin: '0 0 12px 0', fontFamily: "'Source Serif Pro', Georgia, serif" }}>{c.body}</p>
                  <ul style={{ margin: 0, paddingLeft: 20, fontFamily: "'Source Serif Pro', Georgia, serif", fontSize: 14, lineHeight: 1.7, color: '#3a332b' }}>
                    {c.points.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

// =====================================================================
// LEGAL TERMS
// =====================================================================
function TermsMode() {
  const [studyMode, setStudyMode] = useState('list');
  const [search, setSearch] = useState('');
  const [idx, setIdx] = useState(0);
  const [showDef, setShowDef] = useState(false);
  const [order, setOrder] = useState(() => TERMS.map((_, i) => i));

  const filtered = useMemo(() => {
    if (!search) return TERMS;
    const s = search.toLowerCase();
    return TERMS.filter(t => t.term.toLowerCase().includes(s) || t.def.toLowerCase().includes(s));
  }, [search]);

  if (studyMode === 'quiz') {
    const t = TERMS[order[idx]];
    return (
      <div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setStudyMode('list')} style={btnSecondary}>← Back to list</button>
          <button onClick={() => { setOrder(shuffleArr(TERMS.map((_, i) => i))); setIdx(0); setShowDef(false); }} style={btnSecondary}><Shuffle size={14} /> Shuffle</button>
          <div style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#6b5d4a' }}>{idx + 1} / {TERMS.length}</div>
        </div>
        <div onClick={() => setShowDef(s => !s)} style={{ ...cardStyle, minHeight: 280, display: 'flex', flexDirection: 'column', justifyContent: 'center', cursor: 'pointer' }}>
          <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8b6f3c', marginBottom: 12 }}>Define this term {!showDef && '(click to reveal)'}</div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 600, fontStyle: 'italic', margin: '0 0 18px 0', color: '#1a3a5c' }}>{t.term}</h2>
          {showDef && <p style={{ fontSize: 16, lineHeight: 1.6, margin: 0, fontFamily: "'Source Serif Pro', Georgia, serif", color: '#2a2520' }}>{t.def}</p>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
          <button onClick={() => { setIdx(i => (i - 1 + TERMS.length) % TERMS.length); setShowDef(false); }} style={btnSecondary}><ChevronLeft size={16} /> Previous</button>
          <button onClick={() => { setIdx(i => (i + 1) % TERMS.length); setShowDef(false); }} style={btnPrimary}>Next <ChevronRight size={16} /></button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search terms…"
          style={{ padding: '8px 12px', fontFamily: 'inherit', fontSize: 14, border: '1px solid #c4b594', background: '#faf6ec', borderRadius: 4, flex: 1, minWidth: 200, color: '#1a1612' }} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#6b5d4a' }}>{filtered.length} of {TERMS.length}</span>
        <button onClick={() => { setStudyMode('quiz'); setOrder(TERMS.map((_, i) => i)); setIdx(0); setShowDef(false); }} style={btnPrimary}><GraduationCap size={14} /> Drill mode</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
        {filtered.map((t, i) => (
          <div key={i} style={{ background: '#faf6ec', border: '1px solid #e3d7bc', borderLeft: '3px solid #8b6f3c', padding: 14, borderRadius: 3 }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontStyle: 'italic', fontWeight: 500, color: '#1a3a5c', marginBottom: 6 }}>{t.term}</div>
            <div style={{ fontSize: 13.5, lineHeight: 1.55, fontFamily: "'Source Serif Pro', Georgia, serif", color: '#2a2520' }}>{t.def}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =====================================================================
// FLASHCARDS
// =====================================================================
function FlashcardsMode({ progress, markCase }) {
  const [filter, setFilter] = useState('all');
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  const pool = useMemo(() => {
    let list = CASES;
    if (filter === 'review') list = list.filter(c => progress[c.id] !== 'mastered');
    if (filter === 'unseen') list = list.filter(c => !progress[c.id]);
    if (CATEGORIES.includes(filter)) list = list.filter(c => c.category === filter);
    const arr = [...list];
    let seed = shuffleSeed;
    for (let i = arr.length - 1; i > 0; i--) { seed = (seed * 9301 + 49297) % 233280; const j = Math.floor((seed / 233280) * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
    return arr;
  }, [filter, shuffleSeed, progress]);

  const current = pool[idx];
  if (!current) return <EmptyState message="No cases in this set." />;

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
        <select value={filter} onChange={(e) => { setFilter(e.target.value); setIdx(0); setFlipped(false); }} style={selectStyle}>
          <option value="all">All Cases ({CASES.length})</option>
          <option value="unseen">Unseen Only</option>
          <option value="review">Needs Review</option>
          <optgroup label="By Category">{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</optgroup>
        </select>
        <button onClick={() => { setShuffleSeed(Math.random() * 10000); setIdx(0); setFlipped(false); }} style={btnSecondary}><Shuffle size={14} /> Shuffle</button>
        <div style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#6b5d4a' }}>{idx + 1} / {pool.length}</div>
      </div>

      <div onClick={() => setFlipped(f => !f)} style={{ ...cardStyle, minHeight: 320, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', cursor: 'pointer', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 16, right: 16, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8b6f3c' }}>{flipped ? 'Answer' : 'Click to flip'}</div>
        {!flipped ? (
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8b6f3c', marginBottom: 12 }}>{current.category}</div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 36, fontWeight: 600, fontStyle: 'italic', margin: '0 0 8px 0', color: '#1a3a5c' }}>{current.name}</h2>
            <div style={{ fontSize: 14, color: '#6b5d4a' }}>{current.court} · {current.year}</div>
          </div>
        ) : (
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1a3a5c', marginBottom: 8, fontWeight: 600 }}>Holding</div>
            <p style={{ fontSize: 17, lineHeight: 1.55, margin: '0 0 16px 0', fontFamily: "'Source Serif Pro', Georgia, serif", color: '#2a2520' }}>{current.holding}</p>
            <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8b6f3c', marginBottom: 6, fontWeight: 600 }}>Significance</div>
            <p style={{ fontSize: 14, lineHeight: 1.55, margin: 0, fontFamily: "'Source Serif Pro', Georgia, serif", color: '#4a4138', fontStyle: 'italic' }}>{current.significance}</p>
          </div>
        )}
      </div>

      {flipped && (
        <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <SelfAssessBtn label="Got it" color="#3d6b3a" onClick={() => { markCase(current.id, 'mastered'); setFlipped(false); setIdx(i => (i + 1) % pool.length); }} />
          <SelfAssessBtn label="Review" color="#a06530" onClick={() => { markCase(current.id, 'reviewing'); setFlipped(false); setIdx(i => (i + 1) % pool.length); }} />
          <SelfAssessBtn label="Missed" color="#8b2c2c" onClick={() => { markCase(current.id, 'unknown'); setFlipped(false); setIdx(i => (i + 1) % pool.length); }} />
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <button onClick={() => { setIdx(i => (i - 1 + pool.length) % pool.length); setFlipped(false); }} style={btnSecondary}><ChevronLeft size={16} /> Previous</button>
        <button onClick={() => { setIdx(i => (i + 1) % pool.length); setFlipped(false); }} style={btnPrimary}>Next <ChevronRight size={16} /></button>
      </div>
    </div>
  );
}

// =====================================================================
// MCQ QUIZ — cases (all/by category) + optional all-content concept Qs
// =====================================================================
function QuizMode() {
  const [scope, setScope] = useState('all'); // 'all' cases | category | 'allcontent'
  const buildPool = (s) => {
    if (s === 'allcontent') return shuffleArr([...generateCaseQuestions(CASES), ...generateConceptQuestions()]);
    const cases = s === 'all' ? CASES : CASES.filter(c => c.category === s);
    return shuffleArr(generateCaseQuestions(cases));
  };
  const [questions, setQuestions] = useState(() => buildPool('all'));
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const q = questions[idx];
  const submit = () => { if (selected === null) return; setAnswered(true); setScore(s => ({ correct: s.correct + (selected === q.correct ? 1 : 0), total: s.total + 1 })); };
  const next = () => { setSelected(null); setAnswered(false); setIdx(i => (i + 1) % questions.length); };
  const reload = (s) => { setScope(s); setQuestions(buildPool(s)); setIdx(0); setSelected(null); setAnswered(false); setScore({ correct: 0, total: 0 }); };

  if (!q) return <EmptyState message="No questions in this set." />;

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
        <select value={scope} onChange={(e) => reload(e.target.value)} style={selectStyle}>
          <option value="all">All Cases ({CASES.length})</option>
          <option value="allcontent">★ Everything (cases + amendments + insanity + terms)</option>
          <optgroup label="Cases by Category">{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</optgroup>
        </select>
        <button onClick={() => reload(scope)} style={btnSecondary}><RotateCcw size={14} /> New set</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: '#6b5d4a' }}>
          Question {idx + 1} / {questions.length} <span style={{ color: '#8b6f3c' }}>· {scope === 'allcontent' ? 'full-content set' : 'covers every case in scope'}</span>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
          Score: <span style={{ color: '#3d6b3a', fontWeight: 600 }}>{score.correct}</span><span style={{ color: '#6b5d4a' }}> / {score.total}</span>
          {score.total > 0 && <span style={{ marginLeft: 8, color: '#1a3a5c' }}>({Math.round(100 * score.correct / score.total)}%)</span>}
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 21, fontWeight: 500, margin: '0 0 22px 0', color: '#1a3a5c', lineHeight: 1.4, whiteSpace: 'pre-line' }}>{q.q}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.options.map((opt, i) => {
            const isSelected = selected === i, isCorrect = i === q.correct;
            let bg = '#faf6ec', border = '#c4b594', color = '#2a2520';
            if (answered) { if (isCorrect) { bg = '#e8f0e3'; border = '#3d6b3a'; color = '#244821'; } else if (isSelected) { bg = '#f5e0e0'; border = '#8b2c2c'; color = '#5e1e1e'; } }
            else if (isSelected) { bg = '#fbf7ed'; border = '#1a3a5c'; }
            return (
              <button key={i} onClick={() => !answered && setSelected(i)} disabled={answered}
                style={{ textAlign: 'left', padding: '14px 16px', background: bg, border: `1.5px solid ${border}`, color, fontFamily: "'Source Serif Pro', Georgia, serif", fontSize: 15, lineHeight: 1.5, borderRadius: 4, cursor: answered ? 'default' : 'pointer', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ flexShrink: 0, width: 26, height: 26, borderRadius: '50%', border: `1.5px solid ${border}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, background: answered && isCorrect ? '#3d6b3a' : (answered && isSelected ? '#8b2c2c' : 'transparent'), color: answered && (isCorrect || isSelected) ? '#fff' : border, fontFamily: "'JetBrains Mono', monospace" }}>
                  {answered ? (isCorrect ? <Check size={14} /> : (isSelected ? <X size={14} /> : String.fromCharCode(65 + i))) : String.fromCharCode(65 + i)}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
        {answered && (
          <div style={{ marginTop: 20, padding: 16, background: '#fbf7ed', borderLeft: '3px solid #8b6f3c', borderRadius: 2 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8b6f3c', fontWeight: 600, marginBottom: 6 }}>Explanation</div>
            <div style={{ fontSize: 14, lineHeight: 1.6, fontFamily: "'Source Serif Pro', Georgia, serif", color: '#2a2520' }}>{q.explanation}</div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18 }}>
        <button onClick={next} style={btnSecondary}>Skip <ChevronRight size={14} /></button>
        {!answered
          ? <button onClick={submit} disabled={selected === null} style={selected === null ? btnDisabled : btnPrimary}>Submit answer</button>
          : <button onClick={next} style={btnPrimary}>Next question <ChevronRight size={16} /></button>}
      </div>
    </div>
  );
}

// =====================================================================
// PROGRESS DASHBOARD
// =====================================================================
function ProgressMode({ progress, resetProgress }) {
  const stats = {
    mastered: Object.values(progress).filter(v => v === 'mastered').length,
    reviewing: Object.values(progress).filter(v => v === 'reviewing').length,
    unknown: Object.values(progress).filter(v => v === 'unknown').length,
    untouched: CASES.length - Object.keys(progress).length,
  };
  const byCategory = {};
  CASES.forEach(c => {
    if (!byCategory[c.category]) byCategory[c.category] = { total: 0, mastered: 0, reviewing: 0, unknown: 0 };
    byCategory[c.category].total++;
    if (progress[c.id]) byCategory[c.category][progress[c.id]]++;
  });
  const needsReview = CASES.filter(c => progress[c.id] === 'reviewing' || progress[c.id] === 'unknown');

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 28 }}>
        <BigStat label="Mastered" value={stats.mastered} color="#3d6b3a" />
        <BigStat label="Reviewing" value={stats.reviewing} color="#a06530" />
        <BigStat label="Missed" value={stats.unknown} color="#8b2c2c" />
        <BigStat label="Untouched" value={stats.untouched} color="#6b5d4a" />
      </div>

      <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontStyle: 'italic', fontWeight: 500, color: '#1a3a5c', margin: '24px 0 14px 0' }}>Progress by category</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Object.entries(byCategory).map(([cat, s]) => {
          const pct = (s.mastered / s.total) * 100;
          return (
            <div key={cat} style={{ background: '#faf6ec', padding: '12px 16px', border: '1px solid #e3d7bc', borderRadius: 3 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontStyle: 'italic', color: '#1a3a5c' }}>{cat}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#6b5d4a' }}>{s.mastered} / {s.total}</span>
              </div>
              <div style={{ height: 6, background: '#e3d7bc', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #3d6b3a, #5a8a55)', transition: 'width 0.3s' }} />
              </div>
            </div>
          );
        })}
      </div>

      {needsReview.length > 0 && (
        <>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontStyle: 'italic', fontWeight: 500, color: '#1a3a5c', margin: '32px 0 14px 0' }}>Cases flagged for review ({needsReview.length})</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {needsReview.map(c => (
              <span key={c.id} style={{ padding: '6px 12px', background: progress[c.id] === 'unknown' ? '#f5e0e0' : '#f8ead4', border: `1px solid ${progress[c.id] === 'unknown' ? '#8b2c2c' : '#a06530'}`, borderRadius: 3, fontSize: 13, fontFamily: "'Fraunces', serif", fontStyle: 'italic', color: progress[c.id] === 'unknown' ? '#5e1e1e' : '#5c3b15' }}>{c.name}</span>
            ))}
          </div>
        </>
      )}

      <div style={{ marginTop: 36, paddingTop: 20, borderTop: '1px solid #d4c5a8' }}>
        <button onClick={() => { if (confirm('Reset all progress? This cannot be undone.')) resetProgress(); }} style={{ ...btnSecondary, color: '#8b2c2c', borderColor: '#8b2c2c' }}>
          <RotateCcw size={14} /> Reset all progress
        </button>
      </div>
    </div>
  );
}

function BigStat({ label, value, color }) {
  return (
    <div style={{ background: '#faf6ec', border: '1px solid #e3d7bc', borderTop: `3px solid ${color}`, padding: 18, borderRadius: 3, textAlign: 'center' }}>
      <div style={{ fontSize: 38, fontWeight: 700, color, lineHeight: 1, fontFamily: "'Fraunces', serif" }}>{value}</div>
      <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b5d4a', marginTop: 8 }}>{label}</div>
    </div>
  );
}

// =====================================================================
// COUNTDOWN — to the exam: June 8, 2026 at 8:00 AM
// =====================================================================
const EXAM_DATE = new Date('2026-06-08T08:00:00');

function CountdownMode() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = EXAM_DATE - now;
  const past = diff <= 0;
  const abs = Math.abs(diff);
  const days = Math.floor(abs / 86400000);
  const hours = Math.floor((abs % 86400000) / 3600000);
  const mins = Math.floor((abs % 3600000) / 60000);
  const secs = Math.floor((abs % 60000) / 1000);

  const totalDays = Math.ceil((EXAM_DATE - new Date('2026-05-21T00:00:00')) / 86400000);
  const pct = past ? 100 : Math.max(0, Math.min(100, 100 * (1 - days / Math.max(totalDays, 1))));

  const line = past
    ? "It's go time — you've got this. Walk in calm and certain."
    : days > 14 ? 'Plenty of runway. Steady reps now beat cramming later.'
    : days > 7 ? 'Two weeks out. Tighten the weak categories and keep drilling.'
    : days > 1 ? 'Final week. Trust the work — light review, real rest, full confidence.'
    : 'Almost there. Breathe. Everything you need is already in your head.';

  const Unit = ({ value, label }) => (
    <div style={{ textAlign: 'center', minWidth: 92 }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 56, fontWeight: 500, color: '#fffdf6', lineHeight: 1, letterSpacing: '-0.02em' }}>
        {String(value).padStart(2, '0')}
      </div>
      <div style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#bcae8f', marginTop: 10 }}>{label}</div>
    </div>
  );

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #1a3a5c 0%, #14293f 100%)', borderRadius: 8, padding: '40px 28px', textAlign: 'center', boxShadow: '0 8px 30px rgba(20,41,63,0.25)' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#8fb0cc', marginBottom: 6 }}>
          {past ? 'The day is here' : 'Time until the Landmark Final Exam'}
        </div>
        <div style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontSize: 22, color: '#fffdf6', marginBottom: 28 }}>
          Monday, June 8, 2026 · 8:00 AM
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <Unit value={days} label={days === 1 ? 'Day' : 'Days'} />
          <Separator />
          <Unit value={hours} label="Hours" />
          <Separator />
          <Unit value={mins} label="Minutes" />
          <Separator />
          <div style={{ animation: 'pulse 1s infinite' }}><Unit value={secs} label="Seconds" /></div>
        </div>

        {past && <div style={{ marginTop: 20, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#8fb0cc' }}>(elapsed since start)</div>}
      </div>

      <div style={{ ...cardStyle, marginTop: 18, textAlign: 'center' }}>
        <Sparkles size={22} style={{ color: '#8b6f3c', margin: '0 auto 8px', display: 'block' }} />
        <p style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontSize: 19, color: '#1a3a5c', margin: '0 0 6px 0' }}>{line}</p>
        {!past && (
          <>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: '#6b5d4a', marginBottom: 12 }}>
              {days} days · {hours} hrs · {mins} min · {secs} sec to go
            </div>
            <div style={{ height: 8, background: '#e3d7bc', borderRadius: 4, overflow: 'hidden', maxWidth: 460, margin: '0 auto' }}>
              <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #8b6f3c, #b9924f)', transition: 'width 0.5s' }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Separator() {
  return <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 48, color: '#3d5a78', lineHeight: 1, alignSelf: 'flex-start', marginTop: 2 }}>:</div>;
}

// =====================================================================
// UTILITIES + SHARED STYLES
// =====================================================================
function EmptyState({ message }) {
  return (
    <div style={{ ...cardStyle, textAlign: 'center', padding: 60 }}>
      <Sparkles size={32} style={{ color: '#8b6f3c', margin: '0 auto 12px', display: 'block' }} />
      <p style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontSize: 16, color: '#6b5d4a', margin: 0 }}>{message}</p>
    </div>
  );
}

const cardStyle = {
  background: '#fffdf6',
  border: '1px solid #d4c5a8',
  padding: 28,
  borderRadius: 4,
  boxShadow: '0 2px 12px rgba(26, 22, 18, 0.04), 0 1px 3px rgba(26, 22, 18, 0.06)',
};

const selectStyle = {
  padding: '8px 12px',
  fontFamily: 'inherit',
  fontSize: 13,
  border: '1px solid #c4b594',
  background: '#faf6ec',
  color: '#1a1612',
  borderRadius: 4,
};

const btnPrimary = {
  background: '#1a3a5c', color: '#fffdf6', border: '1.5px solid #1a3a5c',
  padding: '9px 16px', fontSize: 14, fontFamily: "'Fraunces', serif", fontStyle: 'italic',
  borderRadius: 3, display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'all 0.15s',
};

const btnSecondary = {
  background: 'transparent', color: '#1a3a5c', border: '1.5px solid #1a3a5c',
  padding: '9px 16px', fontSize: 14, fontFamily: "'Fraunces', serif",
  borderRadius: 3, display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'all 0.15s',
};

const btnDisabled = { ...btnPrimary, background: '#c4b594', borderColor: '#c4b594', cursor: 'not-allowed' };

const btnGhost = {
  background: 'transparent', color: '#8b6f3c', border: '1px solid #c4b594',
  padding: '6px 12px', fontSize: 12, fontFamily: 'inherit',
  borderRadius: 3, display: 'inline-flex', alignItems: 'center', gap: 5,
};



