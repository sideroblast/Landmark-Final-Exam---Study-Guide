import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, Mic, Layers, ListChecks, BarChart3, ChevronRight, ChevronLeft, RotateCcw, Check, X, Eye, Shuffle, Scale, GraduationCap, Sparkles, Landmark, Brain, Gavel, FileText, CalendarClock, ExternalLink, Map } from 'lucide-react';

// =====================================================================
// CASE DATA — High-yield landmark cases for forensic psychiatry boards
// =====================================================================
const CASES = [
  { id: "robinson", name: "Robinson v. California", year: 1962, court: "SCOTUS", category: "Drugs & Specific Intent",
    facts: "California law criminalized drug addiction as a status, with minimum 90-day sentence. Defendant was stopped and had track marks and admitted to occasional use; was not engaging in any illegal conduct.",
    issue: "Does criminalizing addiction as a status violate the 8th Amendment?",
    holding: "Yes. Status (addiction = illness) cannot be criminalized. \"Even one day in prison would be cruel and unusual for the crime of having the common cold.\"",
    significance: "Addiction is illness, not crime; status vs. conduct distinction.",
    elements: ["Status vs. conduct","Addiction = illness","8th Amendment cruel and unusual"] },
  { id: "powell", name: "Powell v. Texas", year: 1968, court: "SCOTUS", category: "Drugs & Specific Intent",
    facts: "Defendant charged with public drunkenness; asserted that his chronic alcoholism caused him to be drunk in public; cited cruel and unusual punishment.",
    issue: "Does criminalizing public intoxication of an alcoholic equal punishing a status?",
    holding: "No. Punishing conduct (public drunkenness) is constitutional even if alcoholism is involuntary.",
    significance: "Limits Robinson; states may criminalize conduct even if illness-driven.",
    elements: ["Punishes conduct, not status","States may regulate behavior even if illness-driven"] },
  { id: "dusky", name: "Dusky v. U.S.", year: 1960, court: "SCOTUS", category: "Competence to Stand Trial",
    facts: "Schizophrenic defendant convicted of kidnapping and rape; competency challenged.",
    issue: "What is the appropriate legal standard for competence to stand trial?",
    holding: "Defendant must have (1) rational AND factual understanding of proceedings, AND (2) ability to consult with counsel with a reasonable degree of rational understanding.",
    significance: "Foundational two-prong competence standard. Still the governing federal test.",
    elements: ["Rational understanding of proceedings","Factual understanding of proceedings","Ability to consult with counsel rationally"] },
  { id: "wilson", name: "Wilson v. U.S.", year: 1968, court: "D.C. Cir.", category: "Competence to Stand Trial",
    facts: "Convicted for carjacking, robbing a pharmacy; fled police and hit a tree; Wilson was unconscious for three weeks; total amnesia for offense; found CST in spite of amnesia.",
    issue: "Does amnesia for the offense equal incompetence?",
    holding: "No per se rule. Remanded with factors: effect on assisting counsel/testifying; strength of evidence; whether evidence can be extrinsically reconstructed.",
    significance: "Amnesia alone ≠ incompetence; case-by-case Wilson factors.",
    elements: ["Effect on assisting counsel","Effect on testifying","Strength of extrinsic evidence","Ability to reconstruct evidence"] },
  { id: "jackson", name: "Jackson v. Indiana", year: 1972, court: "SCOTUS", category: "Competence to Stand Trial",
    facts: "Deaf, intellectually disabled man stole purses with contents amounting to less than $10. Found ISTU; held in psychiatric hospital indefinitely.",
    issue: "Can an IST defendant be confined indefinitely?",
    holding: "No. Held only for a reasonable period to determine restoration potential. If unrestorable, must release or civilly commit. Violates 14th Amendment DP and EP.",
    significance: "Limits length of restoration commitment.",
    elements: ["Reasonable period only","If unrestorable → release or civil commit","Cannot indefinitely hold based on IST alone"] },
  { id: "riggins", name: "Riggins v. Nevada", year: 1992, court: "SCOTUS", category: "Competence to Stand Trial",
    facts: "Arrested for murder; prescribed AP's by psychiatrist; motioned to suspend forced medication until end of trial; asserted due process violation; motioned denied and Riggins sentenced to death.",
    issue: "Does forced antipsychotic medication during trial violate 6th and 14th Amendment rights?",
    holding: "Yes — without showing of medical appropriateness and consideration of less restrictive alternatives, forced meds violate due process.",
    significance: "Forced meds at trial require medical appropriateness + less restrictive alternatives considered.",
    elements: ["Medical appropriateness","Less restrictive alternatives","Essential for safety or fair trial"] },
  { id: "godinez", name: "Godinez v. Moran", year: 1993, court: "SCOTUS", category: "Competence to Stand Trial",
    facts: "Charged with first degree murder for killing wife and bartenders in a saloon; found CST by 2 psychiatrists but appeared depressed; Moran decided he wanted to plead guilty and represent self; sentenced to death. Filed writ; appealed to SC.",
    issue: "Is competence to plead guilty / waive counsel a higher standard than CST?",
    holding: "No — same standard as Dusky. But waiver must also be knowing, voluntary, and intelligent.",
    significance: "Single competence standard; separate knowing/voluntary/intelligent waiver inquiry.",
    elements: ["Same as Dusky standard","Plus knowing/voluntary/intelligent waiver"] },
  { id: "cooper", name: "Cooper v. Oklahoma", year: 1996, court: "SCOTUS", category: "Competence to Stand Trial",
    facts: "Charged with murder of old man during a robbery; CST raised 5x but not proved incompetence by clear and convincing evidence; Cooper convicted and sentenced to death.",
    issue: "Can a state require defendant to prove incompetence by clear and convincing evidence?",
    holding: "No. Violates due process. Preponderance is the maximum permissible burden on defendant.",
    significance: "Preponderance is ceiling for defendant's IST burden. Competence is presumed.",
    elements: ["Competence presumed","Defendant burden ≤ preponderance","Higher burden violates due process"] },
  { id: "sell", name: "Sell v. U.S.", year: 2003, court: "SCOTUS", category: "Competence to Stand Trial",
    facts: "Sell (a dentist) charged with fraud and attempted murder; found IST and committed for restoration; refused AP's; forcibly medicated; appealed to SC.",
    issue: "May the government forcibly medicate a non-dangerous defendant solely to restore competence?",
    holding: "Only if four Sell criteria met. Courts should first consider Harper (dangerousness) and Riggins routes.",
    significance: "Strict criteria for forced meds to restore competence; rarely-invoked.",
    elements: ["Important government interest","Substantially furthers that interest","Necessary (no less intrusive alternative)","Medically appropriate"] },
  { id: "edwards", name: "Indiana v. Edwards", year: 2008, court: "SCOTUS", category: "Competence to Stand Trial",
    facts: "Charged with attempted murder, battery, theft for trying to steal shoes at a mall; found IST but restored; asked to proceed pro se; denied pro se request; convicted.",
    issue: "May states require higher competence for self-representation than for trial?",
    holding: "Yes. States may insist on counsel for \"gray-area\" defendants who are CST but cannot conduct trial themselves.",
    significance: "Carves exception to Faretta and Godinez.",
    elements: ["CST does not = competent to self-represent","States MAY (not must) require higher standard","Preserves trial dignity/fairness"] },
  { id: "alford", name: "North Carolina v. Alford", year: 1970, court: "SCOTUS", category: "Defendant's Rights",
    facts: "Defendant pled guilty to murder to avoid death penalty, but maintained innocence.",
    issue: "Can a court accept a guilty plea from a defendant who maintains innocence?",
    holding: "Yes, if plea is voluntary and intelligent with understanding of consequences and strong factual basis.",
    significance: "The \"Alford plea\" — guilty plea without admission of guilt.",
    elements: ["Voluntary","Intelligent","Understanding of consequences","Strong factual basis for guilt"] },
  { id: "connelly", name: "Colorado v. Connelly", year: 1986, court: "SCOTUS", category: "Defendant's Rights",
    facts: "Mentally ill man confessed w/o police coercion; trial court suppressed confession.",
    issue: "Does mental illness alone make a confession involuntary?",
    holding: "No. Coercive police activity is a necessary predicate to finding a confession involuntary.",
    significance: "Internal compulsion ≠ involuntariness without state action.",
    elements: ["Police coercion required","Mental illness alone insufficient","State action necessary"] },
  { id: "frye", name: "Frye v. U.S.", year: 1923, court: "D.C. Cir.", category: "Expert Witness",
    facts: "Frye convicted of murder; lie detector evidence excluded.",
    issue: "Standard for admissibility of novel scientific evidence?",
    holding: "\"General acceptance\" in the relevant scientific community.",
    significance: "Frye standard — still used in some states (NY, CA, others).",
    elements: ["General acceptance","Relevant scientific community"] },
  { id: "daubert", name: "Daubert v. Merrell Dow", year: 1993, court: "SCOTUS", category: "Expert Witness",
    facts: "Children born with severe birth defects; sued company; expert published affidavit showing no link between Bendectin and birth defects; plaintiffs submitted reanalysis of studies finding a link.",
    issue: "Does Frye still govern, or does FRE 702 supersede?",
    holding: "FRE 702 supersedes Frye. Judge is gatekeeper. Apply Daubert factors.",
    significance: "Modern federal standard; judge as gatekeeper.",
    elements: ["Testable/falsifiable","Peer reviewed/published","Known error rate","Standards & controls","General acceptance"] },
  { id: "kumho", name: "Kumho Tire v. Carmichael", year: 1999, court: "SCOTUS", category: "Expert Witness",
    facts: "Blown tire killed one and injured others; tire failure expert asserted there was a manufacturing defect.",
    issue: "Does Daubert apply only to scientific experts or all experts?",
    holding: "Daubert applies to ALL expert testimony — technical and specialized knowledge too.",
    significance: "Extends gatekeeping beyond hard science.",
    elements: ["Applies to scientific AND technical/specialized","Flexible application of factors"] },
  { id: "mnaghten", name: "M'Naghten's Case", year: 1843, court: "House of Lords", category: "Insanity Defense",
    facts: "Paranoid delusion about Prime Minister led M'Naghten to kill Edward Drummond (secretary) while attempting to assassinate PM; found NGRI.",
    issue: "What defines legal insanity?",
    holding: "Defect of reason from disease of mind such that defendant (1) did not know nature/quality of act, OR (2) did not know it was wrong.",
    significance: "Foundational cognitive-only test. Adopted broadly in U.S.",
    elements: ["Defect of reason","Disease of the mind","Didn't know nature/quality of act","Didn't know act was wrong"] },
  { id: "durham", bazelon: true, name: "Durham v. U.S.", year: 1954, court: "D.C. Cir.", category: "Insanity Defense",
    facts: "Mentally ill burglar; M'Naghten and irresistible impulse rule applied; trial court rejected insanity defense and said there wasn't enough evidence to outweigh presumption of sanity; appealed NGRI standard used and argued burden of proof is on prosecution to prove sanity.",
    issue: "Should \"right/wrong\" test alone govern legal insanity?",
    holding: "\"Product test\": not criminally responsible if act was the product of mental disease or defect.",
    significance: "Gave psychiatrists outsized role; abandoned even in DC.",
    elements: ["Product of mental disease or defect","Causal link required"] },
  { id: "washington_us", bazelon: true, name: "Washington v. U.S.", year: 1967, court: "D.C. Cir.", category: "Insanity Defense",
    facts: "Washington convicted of rape, robbery, assault; used insanity defense unsuccessfully.",
    issue: "How to apply product test? May experts testify on ultimate issue?",
    holding: "Affirmed. Psychiatrists may NOT testify on ultimate issue. They must explain how disease relates to behavior, not speak in terms of \"product\" or \"cause.\"",
    significance: "Prevents psychiatrist from becoming \"13th juror.\"",
    elements: ["No ultimate-issue testimony","Explain dynamic relationship","Communicate clearly to jury"] },
  { id: "frendak", name: "Frendak v. U.S.", year: 1979, court: "D.C. Cir.", category: "Insanity Defense",
    facts: "Frendak murdered a co-worker; fled country; declined insanity plea; insanity defense imposed; found NGRI.",
    issue: "Can a court impose an insanity defense on a competent, unwilling defendant?",
    holding: "No — if the defendant intelligently and voluntarily waives it. Hearing required.",
    significance: "CST defendant may refuse NGRI defense.",
    elements: ["CST","Knowing waiver","Intelligent waiver","Voluntary waiver"] },
  { id: "clark", name: "Clark v. Arizona", year: 2006, court: "SCOTUS", category: "Insanity Defense",
    facts: "Schizophrenic defendant shot and killed police officer; AZ law had knowledge of right from wrong only (not nature and quality of act), and experts could not provide evidence that rebuts prosecution's proof of mens rea.",
    issue: "Can a state restrict the insanity test? Restrict mental illness evidence on mens rea?",
    holding: "Yes to both. States have wide latitude in defining insanity.",
    significance: "Constitution does not mandate a particular insanity test.",
    elements: ["No constitutional requirement of full test","States may restrict mens rea evidence"] },
  { id: "kahler", name: "Kahler v. Kansas", year: 2020, court: "SCOTUS", category: "Insanity Defense",
    facts: "Kahler killed wife, daughters and claimed his depression was the cause. KS law had cognitive incapacity only; not moral incapacity (inability to tell right from wrong).",
    issue: "Does due process require a moral-incapacity insanity defense?",
    holding: "No. States may abolish moral-incapacity NGRI; mens rea approach is constitutional.",
    significance: "States can effectively eliminate traditional insanity defense.",
    elements: ["No constitutional NGRI right","Mens rea approach permissible"] },
  { id: "jones", name: "Jones v. U.S.", year: 1983, court: "SCOTUS", category: "NGRI Release",
    facts: "Jones stole a jacket in DC and found NGRI for attempted petty larceny; Under DC law, all NGRI acquitees are automatically committed to a mental hospital until they can prove they are no longer mentally ill or dangerous (govt must prove by clear and convincing evidence). Although the maximum possible sentence for attempted petty larceny was one year, Jones remained confined for more than four years.",
    issue: "May NGRI acquittees be confined beyond potential criminal sentence? What standard of proof?",
    holding: "Yes. NGRI verdict supports automatic commitment; preponderance standard sufficient.",
    significance: "NGRI acquittees treated differently from civil committees.",
    elements: ["Automatic commitment OK","Indefinite confinement OK","Preponderance standard","Not \"similarly situated\" to convicted criminals"] },
  { id: "foucha", name: "Foucha v. Louisiana", year: 1992, court: "SCOTUS", category: "NGRI Release",
    facts: "Foucha was convicted of armed robbery in LA; found NGRI and committed to state hospital; under Louisiana law, individuals found NGRI may remain committed until they are no longer mentally ill and no longer dangerous. In 1988, hospital psychiatrists determined Foucha was no longer mentally ill. However, the state refused to release him because he had a history of violent behavior, and the law allowed continued confinement for those considered dangerous, even if not mentally ill.",
    issue: "Can an NGRI acquittee be confined when no longer mentally ill but still dangerous?",
    holding: "No. Continued confinement requires BOTH mental illness AND dangerousness.",
    significance: "Limits Jones — ASPD alone insufficient to confine.",
    elements: ["Mental illness AND dangerousness required","ASPD alone insufficient","Cannot indefinitely confine purely on dangerousness"] },
  { id: "idra", name: "Insanity Defense Reform Act", year: 1984, court: "Federal Statute", category: "NGRI Release",
    facts: "Enacted after Hinckley NGRI verdict (Reagan assassination attempt) to narrow federal insanity defense.",
    issue: "How is the federal insanity defense defined? Burden of proof?",
    holding: "Defendant NGRI only if, due to severe mental disease/defect, unable to appreciate wrongfulness. Volitional prong eliminated. Defendant burden by clear and convincing evidence.",
    significance: "Narrowed federal insanity to cognitive-only; shifted burden to defendant; created GBMI verdict alternative.",
    elements: ["Severe mental disease/defect","Unable to appreciate wrongfulness","Burden on defendant","Clear and convincing evidence"] },
  { id: "burton", name: "In re Burton", year: 2006, court: "D.C. Ct. App.", category: "NGRI Release",
    facts: "Burton was acquitted by reason of insanity in DC and committed to St. Elizabeths Hospital. Hospital staff concluded he was no longer mentally ill or dangerous. The government contested his release, raising questions about who bears the burden of proof for release of NGRI acquittees.",
    issue: "Who bears the burden of proof at DC conditional release proceedings?",
    holding: "Government bears burden of proving continued mental illness and dangerousness by preponderance.",
    significance: "Once acquittee shows substantial change, burden shifts to government.",
    elements: ["Government burden","Preponderance","Totality of circumstances"] },
  { id: "baxstrom", name: "Baxstrom v. Herold", year: 1966, court: "SCOTUS", category: "Prisoner's Rights",
    facts: "At the conclusion of a sentence for an assault charge, Baxstrom was civilly committed without a hearing or evaluation by psychiatrist.",
    issue: "Can a prisoner be transferred to a hospital at sentence-end without civil commitment procedures?",
    holding: "No. Equal protection requires same procedures as for civil committees.",
    significance: "\"Baxstrom patients\" — many released afterward; few were actually dangerous.",
    elements: ["Equal protection","Same procedures as civil commitment","No special prisoner track"] },
  { id: "vitek", name: "Vitek v. Jones", year: 1980, court: "SCOTUS", category: "Prisoner's Rights",
    facts: "Convicted of robbery; transferred to psychiatric facility for treatment.",
    issue: "Does prison-to-psychiatric-hospital transfer require due process?",
    holding: "Yes. Liberty interest at stake; requires notice, hearing, evidence, counsel-equivalent assistance.",
    significance: "\"Massive curtailment of liberty\"; stigma + treatment distinct from prison.",
    elements: ["Written notice","Adversarial hearing","Independent decisionmaker","Right to assistance"] },
  { id: "estelle_gamble", name: "Estelle v. Gamble", year: 1976, court: "SCOTUS", category: "Prisoner's Rights",
    facts: "Inmate injured while on a prison work assignment; received some treatment but was unable to work; was punished for not working; asserted that he was unfairly punished and had not received adequate punishment.",
    issue: "When does inadequate prison medical care violate the 8th Amendment?",
    holding: "\"Deliberate indifference to serious medical needs\" violates 8th Amendment. Here, not met — mere malpractice insufficient.",
    significance: "Foundational prison medical care standard; includes mental health.",
    elements: ["Deliberate indifference (subjective)","Serious medical need (objective)","Mere negligence insufficient"] },
  { id: "farmer", name: "Farmer v. Brennan", year: 1994, court: "SCOTUS", category: "Prisoner's Rights",
    facts: "Trans female inmate assaulted; asserted that staff had deliberate indifference to her risk of violence and victimization from other inmates.",
    issue: "What is the standard for \"deliberate indifference\"?",
    holding: "Subjective recklessness — official must KNOW of and disregard excessive risk.",
    significance: "Defines deliberate indifference; subjective awareness required.",
    elements: ["Subjective awareness","Of substantial risk","Disregard of that risk"] },
  { id: "brown_plata", name: "Brown v. Plata", year: 2011, court: "SCOTUS", category: "Prisoner's Rights",
    facts: "Prison overcrowding in CA led to two federal class action lawsuits over lack of adequate mental health care provided.",
    issue: "Did a court order to reduce CA prison overcrowding violate the Prison Litigation Reform Act?",
    holding: "No. Population cap permitted under PLRA to remedy 8th Amendment violations from overcrowding.",
    significance: "Scalia called it \"most radical injunction in our Nation's history.\" Affirmed prisoner mental health rights.",
    elements: ["Population cap permissible","Overcrowding caused violations","PLRA authorized remedy"] },
  { id: "estelle_smith", name: "Estelle v. Smith", year: 1981, court: "SCOTUS", category: "Death Penalty",
    facts: "Smith convicted of murder and sentenced to death in Texas; during sentencing hearing, jury found Smith to be dangerous based on testimony of Dr. Grigson (Dr. Death) where he said he was a psychopath and would commit future violent acts with no remorse.",
    issue: "Does pretrial psychiatric exam used at capital sentencing violate 5th and 6th Amendments?",
    holding: "Yes — defendant must be warned and counsel notified if statements may be used at sentencing.",
    significance: "Source of the \"Estelle warning\"; forensic warning practice.",
    elements: ["Miranda-like warning required","Notice to counsel","Applies when used at sentencing"] },
  { id: "barefoot", name: "Barefoot v. Estelle", year: 1983, court: "SCOTUS", category: "Death Penalty",
    facts: "Convicted of capital murder in Texas; two psychiatrists opined him to be dangerous, neither of which had personally examined Barefoot.",
    issue: "Is psychiatric testimony about future dangerousness — even without exam — admissible at capital sentencing?",
    holding: "Yes. Jury can weigh credibility through cross-examination. Court rejected APA brief.",
    significance: "Controversial; allows hypothetical testimony despite poor predictive accuracy.",
    elements: ["Future dangerousness testimony admissible","No examination required","Cross-exam adequate safeguard"] },
  { id: "ake", name: "Ake v. Oklahoma", year: 1985, court: "SCOTUS", category: "Death Penalty",
    facts: "Charged with murder of a couple and wounding two children; found ICST and committed; restored to competency; counsel requested sanity eval which was denied; jury sentenced to death.",
    issue: "Does due process require the state to provide a psychiatric expert for indigent defendants when sanity is at issue?",
    holding: "Yes — state must provide competent psychiatrist for evaluation and assistance.",
    significance: "Foundational right to psychiatric assistance; extension of Gideon.",
    elements: ["Sanity significantly at issue","Indigent defendant","State-funded psychiatric expert"] },
  { id: "ford", name: "Ford v. Wainwright", year: 1986, court: "SCOTUS", category: "Death Penalty",
    facts: "Ford convicted of murder and sentenced to death; not mentally ill at time of offense, during trial, or sentencing; developed symptoms prior to execution; seen by 3 state hired psychiatrists who opined he was competent to be executed; reports by these psychiatrists were signed off on by the FL governor (who had final decision); governor refused to accept defense counsels psychiatrist's reports or permit an adversarial proceeding; death warrant was signed by governor.",
    issue: "Does the 8th Amendment prohibit execution of the insane?",
    holding: "Yes — execution of the insane violates 8th Amendment. Adequate procedures required.",
    significance: "Constitutional bar; little retribution or deterrence value; offends humanity.",
    elements: ["8th Amendment bar","Adequate procedures required","Awareness of impending execution and reason"] },
  { id: "payne", name: "Payne v. Tennessee", year: 1991, court: "SCOTUS", category: "Death Penalty",
    facts: "Killed mother, daughter, and almost killed 3-year-old with a knife. During sentencing, prosecution presented testimony of the 3-year-old grandmother about the impact on him; defense contented that victim impact statements are inadmissible because they bias the jury, leading to inappropriate death sentences which is cruel and unusual.",
    issue: "Do victim impact statements violate the 8th Amendment at capital sentencing?",
    holding: "No — admissible. Overruled Booth v. Maryland and South Carolina v. Gathers.",
    significance: "Assessment of harm relevant to appropriate punishment.",
    elements: ["Victim impact admissible","Relevant to harm caused","Not per se prejudicial"] },
  { id: "panetti", name: "Panetti v. Quarterman", year: 2007, court: "SCOTUS", category: "Death Penalty",
    facts: "Panetti shot and killed in-laws in front of family; found CST and to waive counsel; sentenced to death; later Panetti claimed he was incompetent to be executed; state psychiatrists opined he is competent; trial court found him competent to be executed because he knew was going to be executed and that it would result in death; appealed because he thought he was being executed because of delusional beliefs.",
    issue: "What level of understanding makes one competent for execution?",
    holding: "Rational — not just factual — understanding of WHY he is being executed.",
    significance: "Strengthens Ford; rational understanding required.",
    elements: ["Rational understanding","Not merely factual awareness","Connection between crime and punishment"] },
  { id: "perry", name: "State v. Perry", year: 1992, court: "LA Sup. Ct.", category: "Death Penalty",
    facts: "Perry sentenced to death for murdering mother, father, nephew, cousins; had schizophrenia and hx of hospitalizations; was evaluated for competence to be executed and was found incompetent; prescribed medications but refused and trial court ordered medication to render competency to be executed.",
    issue: "Can a state forcibly medicate a death row inmate to restore competence for execution?",
    holding: "No. Forced meds to execute is not medical treatment; cruel and unusual.",
    significance: "Distinguishes Harper — meds to execute fail Harper \"best interest\" test.",
    elements: ["Forced meds to execute = cruel and unusual","Not medical treatment","Fails Harper criteria"] },
  { id: "atkins", name: "Atkins v. Virginia", year: 2002, court: "SCOTUS", category: "Death Penalty",
    facts: "Atkins was convicted of abduction, armed robbery, and capital murder, and was sentenced to death. During sentencing, the defense presented an expert who showed that Mr. Atkins had an IQ of 59.",
    issue: "Does executing the intellectually disabled violate the 8th Amendment?",
    holding: "Yes. Categorical bar on execution of intellectually disabled.",
    significance: "Evolving standards of decency; later refined by Hall and Moore.",
    elements: ["Intellectual disability","Categorical 8th Amendment bar","Evolving standards of decency"] },
  { id: "roper", name: "Roper v. Simmons", year: 2005, court: "SCOTUS", category: "Death Penalty",
    facts: "Christopher Simmons, a 17-year-old high school junior murdered Shirley Crook gruesomely. Simmons was convicted and sentenced to death.",
    issue: "Does executing juveniles (under 18) violate the 8th Amendment?",
    holding: "Yes. Categorical bar on death penalty for those under 18 at offense.",
    significance: "Followed adolescent brain development science.",
    elements: ["Under 18 at offense","Lack of maturity","Susceptibility to influences","Unformed character"] },
  { id: "hall", name: "Hall v. Florida", year: 2014, court: "SCOTUS", category: "Death Penalty",
    facts: "Freddie Lee Hall was convicted of murder and sentenced to death in Florida. He had an IQ score of 71, but Florida's strict bright-line rule required a score of 70 or below to be considered intellectually disabled (ID) and thus exempt from execution under Atkins v. Virginia.",
    issue: "Can a state use a fixed IQ score as a strict cutoff for intellectual disability?",
    holding: "No. Must consider SEM (standard error of measurement) and adaptive functioning.",
    significance: "IQ is a range; comprehensive clinical assessment required.",
    elements: ["Consider SEM","No strict IQ cutoff","Comprehensive clinical assessment with adaptive functioning"] },
  { id: "madison", name: "Madison v. Alabama", year: 2019, court: "SCOTUS", category: "Death Penalty",
    facts: "Vernon Madison was sentenced to death. He suffered strokes that caused vascular dementia, leaving him unable to remember his crime and with significant cognitive deficits. Alabama sought to execute him, claiming he was competent because he understood he was being executed and why.",
    issue: "Does the 8th Amendment bar execution of a prisoner who cannot remember the crime due to dementia?",
    holding: "Yes — if severe mental illness or dementia prevents rational understanding, execution may be barred.",
    significance: "Extends Ford/Panetti to dementia cases.",
    elements: ["Rational understanding required","Severe dementia/illness can bar","Memory of crime not required, but rational understanding is"] },
  { id: "mcwilliams", name: "McWilliams v. Dunn", year: 2017, court: "SCOTUS", category: "Death Penalty",
    facts: "James McWilliams, facing the death penalty in Alabama for rape and murder, requested an independent mental health expert. The state provided a psychiatric evaluation but did not give McWilliams access to an expert who could help interpret the results and assist counsel in preparation for the sentencing hearing.",
    issue: "Does Ake require a defense-aligned expert, or is a neutral evaluator sufficient?",
    holding: "Defense-aligned expert required — neutral evaluator insufficient under Ake.",
    significance: "Clarifies Ake; expert must assist defense in evaluation, preparation, and presentation.",
    elements: ["Expert must assist defense","Neutral evaluator insufficient","For evaluation, preparation, presentation"] },
  { id: "buck", name: "Buck v. Davis", year: 2017, court: "SCOTUS", category: "Death Penalty",
    facts: "Duane Buck was sentenced to death in Texas. During the penalty phase, Buck's own attorney called an expert who testified that Buck was more likely to be dangerous in the future because he was Black. Buck sought federal habeas corpus review, arguing ineffective assistance of counsel.",
    issue: "Did Buck receive ineffective assistance of counsel?",
    holding: "Yes. Race-based future dangerousness testimony was deficient and prejudicial under Strickland.",
    significance: "Race cannot factor into capital sentencing; reinforces Strickland IAC standard.",
    elements: ["Deficient performance (Strickland prong 1)","Prejudice (Strickland prong 2)","Race cannot be a factor in sentencing"] },
  { id: "specht", name: "Specht v. Patterson", year: 1967, court: "SCOTUS", category: "Sex Offenders",
    facts: "Specht was convicted in a Colorado state court of \"indecent liberties,\" which carried a maximum 10-year prison sentence. Instead of sentencing him under that statute, the trial judge committed him under the Colorado Sex Offenders Act, which allowed an indeterminate sentence of one day to life imprisonment if psychiatric evaluations indicated the offender posed a continuing danger to society. The judge made this determination without a new hearing and without notice.",
    issue: "Does indeterminate sex-offender sentencing without procedural protections violate due process?",
    holding: "Yes. Requires notice, hearing with counsel, confrontation, cross-exam, opportunity to be heard.",
    significance: "Enhanced procedural protections for sex offender commitment.",
    elements: ["Notice","Right to be present with counsel","Confront/cross-examine witnesses","Present own evidence"] },
  { id: "allen", name: "Allen v. Illinois", year: 1986, court: "SCOTUS", category: "Sex Offenders",
    facts: "The State of Illinois filed a petition under the Illinois Sexually Dangerous Persons Act to commit Allen as a sexually dangerous person; ordered Allen to submit to psychiatric evaluations; Allen objected, arguing that his statements to the psychiatrists were compelled and could reveal prior criminal conduct, thereby violating his Fifth Amendment privilege against self-incrimination.",
    issue: "Does the 5th Amendment privilege against self-incrimination apply in SDPA civil commitment proceedings?",
    holding: "No — proceedings are civil, not criminal. Privilege does not apply.",
    significance: "SVP commitment is civil; treatment/rehabilitation focus.",
    elements: ["Civil proceeding","Treatment focus, not punishment","5th Amendment does not apply"] },
  { id: "hendricks", name: "Kansas v. Hendricks", year: 1997, court: "SCOTUS", category: "Sex Offenders",
    facts: "•Hendricks had hx of molesting children; diagnosed with pedophilia by psychiatrists; after serving his prison sentence for sexual offenses, KS sought to commit him under its Sexually Violent Predator Act (SVPA), which allowed for civil commitment of individuals deemed likely to engage in future acts of sexual violence due to a \"mental abnormality\" or \"personality disorder\" and a history of sexually violent offenses; after commitment, annually the state must show beyond a reasonable doubt that the person remains an SVP. •Hendricks challenged the law, arguing that it constituted punishment without due process (ex post facto law) and violated the Double Jeopardy Clause, and also challenged pedophilia as a qualifying diagnosis, given that civil commitment required a \"mental illness\", not a \"mental abnormality\".",
    issue: "Does SVP civil commitment violate substantive due process, double jeopardy, or ex post facto?",
    holding: "No to all. \"Mental abnormality\" suffices; statute is civil, not punitive.",
    significance: "Constitutional foundation for SVP commitment statutes.",
    elements: ["Mental abnormality (not strictly mental illness)","Likely to engage in sexually violent acts","Civil, not punitive"] },
  { id: "seling", name: "Seling v. Young", year: 2001, court: "SCOTUS", category: "Sex Offenders",
    facts: "• Young was convicted of multiple rapes across three decades. •Just before his scheduled release from prison in 1990, Washington State sought to commit him under its Community Protection Act of 1990, which allows civil commitment of sexually violent predators (SVPs)-persons with a mental abnormality or personality disorder that makes them likely to engage in predatory acts of sexual violence. •Young was civilly committed. He challenged the commitment, arguing that the law, although labeled \"civil,\" was in practice punitive, violating the Double Jeopardy Clause and the Ex Post Facto Clause.",
    issue: "Can a facially civil statute be challenged as punitive based on how it's applied?",
    holding: "No. If statute is civil on its face, \"as applied\" claims for double jeopardy / ex post facto fail.",
    significance: "Civil/punitive distinction is statutory, not individual.",
    elements: ["Civil on face → cannot be punitive as applied","Conditions challenges via due process","Finality principle"] },
  { id: "crane", name: "Kansas v. Crane", year: 2002, court: "SCOTUS", category: "Sex Offenders",
    facts: "Michael Crane, a previously convicted sexual offender with exhibitionism and antisocial personality disorder, was subject to civil commitment under Kansas's Sexually Violent Predator Act. Unlike Hendricks (who admitted he could not control his behavior), Crane did not make such an admission.",
    issue: "Must SVP commitment require TOTAL inability to control behavior?",
    holding: "No, but state must show \"serious difficulty controlling behavior.\"",
    significance: "Refines Hendricks; meaningful volitional impairment required.",
    elements: ["Mental abnormality","Serious difficulty controlling behavior","Future dangerousness"] },
  { id: "mckune", name: "McKune v. Lile", year: 2002, court: "SCOTUS", category: "Sex Offenders",
    facts: "Robert Lile, a Kansas prisoner convicted of rape, refused to participate in a Sexual Abuse Treatment Program (SATP) that required him to provide a sexual history including uncharged offenses. Inmates who refused faced transfer to a higher security facility and loss of prison privileges.",
    issue: "Does mandatory SATP requiring self-incrimination violate the 5th Amendment?",
    holding: "No. Loss of privileges/transfer does not constitute compulsion.",
    significance: "No clear majority; rehabilitation interest balanced against penological interests.",
    elements: ["Privileges loss ≠ compulsion","Rehabilitation interest","Within ordinary incidents of prison life"] },
  { id: "comstock", name: "U.S. v. Comstock", year: 2010, court: "SCOTUS", category: "Sex Offenders",
    facts: "Adam Comstock was convicted of federal child pornography charges. Near his scheduled release, the government sought to civilly commit him under 18 U.S.C. §4248, which authorizes federal civil commitment of 'sexually dangerous' persons upon release.",
    issue: "Does the Necessary and Proper Clause authorize federal civil commitment under §4248?",
    holding: "Yes. Rationally related to Congress's power over federal prisoners.",
    significance: "Federal SVP commitment constitutional under N&P Clause.",
    elements: ["Necessary and Proper Clause","Connected to federal prisoner authority","States can take custody"] },
  { id: "glucksberg", name: "Washington v. Glucksberg", year: 1997, court: "SCOTUS", category: "Right to Die",
    facts: "Four Washington physicians who treat terminally ill patients declared that they would assist these patients in ending their lives if it were not for Washington state's statutory ban on assisted suicide. They, along with three gravely ill plaintiffs, filed a suit against Washington state and its attorney general, seeking a declaration that the ban on assisted suicide is unconstitutional. They asserted a liberty interest protected by the Fourteenth Amendment's due process clause. They suggested that the clause should protect a personal choice by a mentally competent, terminally ill adult to commit physician-assisted suicide.",
    issue: "Does Due Process include a right to physician-assisted suicide?",
    holding: "No. No fundamental liberty interest. Rational basis review.",
    significance: "States may ban assisted suicide. Companion: Vacco v. Quill (equal protection).",
    elements: ["No fundamental right","Rational basis review","States may prohibit"] },
  { id: "georgetown", name: "Application of Pres. & Dir. of Georgetown College", year: 1964, court: "D.C. Cir.", category: "Right to Die",
    facts: "Mrs. Jessie Jones, a twenty-five-year-old Jehovah's Witness mother of a seven-month child, had an acute gastro-intestinal bleed. She was estimated to have lost two-thirds of her total blood supply. On a religious basis, the patient and her husband did not give consent to blood transfusion for ulcer surgery. When death was imminent, the judge urged Mrs. Jones to consent but the patient said only the words, \"Against my will.\" He asked her if he ordered a transfusion, would she oppose it; she responded that it would not then be her responsibility. The judge opined that she was not competent to decide the issues.",
    issue: "Can treatment be ordered over religious refusal?",
    holding: "Judge ordered transfusion; en banc rehearing denied with fractured opinions.",
    significance: "Historical case re: state interests in preserving life vs. religious autonomy.",
    elements: ["State interest in life","Protect dependents (the 7-month-old)","Medical ethics interest"] },
  { id: "canterbury", name: "Canterbury v. Spence", year: 1972, court: "D.C. Cir.", category: "Informed Consent",
    facts: "Jerry Canterbury, a 19-year-old patient, suffered a back injury and was treated by Dr. William Spence, a neurosurgeon. Dr. Spence recommended spinal surgery but did not inform Canterbury of the potential risks, including paralysis. After the surgery, Canterbury fell from his hospital bed and was later found paralyzed. He sued Dr. Spence, alleging that the doctor failed to disclose the risks of the procedure and thus deprived him of the opportunity to make an informed decision.",
    issue: "What is the standard for informed consent disclosure?",
    holding: "Patient-centered (reasonable patient) standard — what a reasonable patient would want to know.",
    significance: "Shifted from physician-based to patient-based standard; majority US jurisdictions.",
    elements: ["Reasonable patient standard","Material risks","Causation","Damages"] },
  { id: "kaimowitz", name: "Kaimowitz v. Michigan DMH", year: 1973, court: "MI Cir. Ct.", category: "Informed Consent",
    facts: "Two doctors proposed implanting electrodes and removing the amygdala's of twenty-four involuntarily confined patients to study and treat violent behavior. Louis Smith, a committed patient, consented to participate, but law professor Gabe Kaimowitz sued to block the operation. The court found Smith's confinement unconstitutional and the psychosurgery proposal invalid, holding that Smith could not give informed consent as an involuntary mental patient.",
    issue: "Can involuntarily committed patients give informed consent to experimental psychosurgery?",
    holding: "No. Confinement undermines voluntariness; consent invalid.",
    significance: "Three elements of consent. Nuremberg Code principles invoked.",
    elements: ["Competence","Knowledge","Voluntariness"] },
  { id: "cruzan", name: "Cruzan v. Missouri Dept. of Health", year: 1990, court: "SCOTUS", category: "Informed Consent",
    facts: "Nancy Cruzan was left in a persistent vegetative state after a 1983 car accident. She was sustained by artificial feeding and hydration through a feeding tube. After several years, her parents asked hospital officials to remove the feeding tube, believing Nancy would not want to live in such a condition. The hospital refused without court approval, and the case reached the Missouri courts. The Missouri Supreme Court held that life-sustaining treatment could not be withdrawn without \"clear and convincing evidence\" that the patient herself would have wanted that. The Cruzan family appealed to the U.S. Supreme Court.",
    issue: "Right to refuse life-sustaining treatment? May state require clear and convincing evidence?",
    holding: "Yes — competent persons have liberty interest in refusing treatment. Yes — states may require clear and convincing evidence of wishes.",
    significance: "Foundational right-to-refuse-treatment; basis for advance directives.",
    elements: ["Liberty interest in refusing treatment","Clear and convincing evidence permissible","Bodily integrity"] },
  { id: "rouse", bazelon: true, name: "Rouse v. Cameron", year: 1966, court: "D.C. Cir.", category: "Right to Treatment",
    facts: "Mr. Rouse was charged w/ carrying a weapon in DC, found NGRI, committed to St. Elizabeths. While committed, he alleged that he was confined without treatment; filed habeas corpus in U.S. District Court asserting that continued confinement was unlawful; DC denied petition saying that recovery of sanity is the purpose of confinement, not treatment; appealed to DCCA.",
    issue: "Do involuntarily committed patients have a right to treatment?",
    holding: "Yes, based on DC statute (Hospitalization of Mentally Ill Act).",
    significance: "First articulation of right to treatment.",
    elements: ["Statutory right to treatment","Confinement without treatment = punishment"] },
  { id: "wyatt", name: "Wyatt v. Stickney", year: 1971, court: "M.D. Ala.", category: "Right to Treatment",
    facts: "In 1970, a class action suit was filed on behalf of patients involuntarily confined to a hospital in Tuscaloosa, Alabama. Conditions in the hospital were abysmal. In March 1971, District Court held that the patients (including Mr. Wyatt) had a constitutional right to receive such individual treatment as will give them a realistic opportunity to be cured or to improve their condition. The hospital was allowed six months to raise the level of care to the constitutionally required minimum, and that the hospital failed to provide: (1) a humane psychological and physical environment; (2) qualified staff in numbers sufficient to administer adequate treatment; and (3) individualized treatment plans.",
    issue: "Constitutional minimum standards for institutional care?",
    holding: "Yes — constitutional right to adequate treatment. Three minimum standards established.",
    significance: "Foundational institutional reform case.",
    elements: ["Humane physical/psychological environment","Qualified staff in sufficient numbers","Individualized treatment plans"] },
  { id: "donaldson_5th", name: "Donaldson v. O'Connor (5th Cir.)", year: 1974, court: "5th Cir.", category: "Right to Treatment",
    facts: "Kenneth Donaldson (w/ paranoid schizophrenia, committed to a state mental hospital) refused Tx because of his Christian Science faith. He repeatedly requested release and identified friends he could live with. Hospital staff denied releasee, saying mental illness alone was sufficient to continue confining him despite him being able to live independently.",
    issue: "Is it a due process violation to continue confining a nondangerous person who can live independently?",
    holding: "Yes. Right to treatment; cannot confine non-dangerous person who can survive in community.",
    significance: "Precursor to SCOTUS O'Connor v. Donaldson (1975).",
    elements: ["Right to treatment","Non-dangerous + can survive = release","Mental illness alone insufficient"] },
  { id: "youngberg", name: "Youngberg v. Romeo", year: 1982, court: "SCOTUS", category: "Right to Treatment",
    facts: "Mr. Nicholas Romeo was a 33-year-old profoundly intellectually disabled man in PA institution with a mental age of 18 months, could not speak and lacked basic self-care skills. His mother became concerned because he sustained 63 injuries in two years; she filed suit against the superintendent (Youngberg) and two supervisors under the Federal Civil Rights Act of 1964. She alleged that Mr. Romeo had a constitutional right to safe conditions of confinement, freedom from bodily restraint, and a right to training or habilitation. She suggested that his Eighth Amendment rights to be free of cruel and unusual punishment and his Fourteenth Amendment rights to equal protection had been violated. The jury returned a verdict for the defendants. The Court of Appeals for the Third Circuit reversed and remanded the case for a new trial. Youngberg appealed to the U.S. Supreme Court.",
    issue: "What rights to safety, freedom from restraint, and training do committed persons have?",
    holding: "Rights to safe conditions, freedom from undue restraint, and minimally adequate training. Judged by \"professional judgment\" standard.",
    significance: "Professional Judgment Rule — presumed valid unless substantial departure.",
    elements: ["Safe conditions","Freedom from undue restraint","Minimally adequate training","Professional judgment standard"] },
  { id: "meritor", name: "Meritor Savings Bank v. Vinson", year: 1986, court: "SCOTUS", category: "Sexual Harassment",
    facts: "Ms. Vinson worked as a teller at Meritor Bank under a boss Mr. Taylor. Ms. Vinson brought an action against Mr. Taylor and the bank, claiming constant sexual harassment and violation of Title VII of the Civil Rights Act of 1964. Ms. Vinson said she feared for job, so she never reported it and had sex with Mr. Taylor. District Court rejected claims, saying no harassment occurred and since the bank was not notified, they were not liable. The DCCA reversed and remanded > appealed to SC.",
    issue: "Is \"hostile work environment\" sexual harassment actionable under Title VII?",
    holding: "Yes. Voluntariness does not matter — only whether it was unwelcome. No absolute employer liability.",
    significance: "Recognized hostile work environment as Title VII sex discrimination.",
    elements: ["Severe or pervasive","Alters conditions of employment","Unwelcome (voluntariness irrelevant)","Employer liability case-by-case"] },
  { id: "harris", name: "Harris v. Forklift Systems", year: 1993, court: "SCOTUS", category: "Sexual Harassment",
    facts: "Ms. Harris was a manager at a forklift company; the president made gendered insults and unwanted sexual comments, belittled her and other female employees. Ms. Harris quit, then sued company because the president created an abusive working environment. District Court disagreed, saying his conduct was not severe enough to cause injury; affirmed on appeal > SC.",
    issue: "What defines an \"abusive work environment\" under Title VII?",
    holding: "Conduct need not cause psychological injury. Must be both objectively AND subjectively hostile.",
    significance: "Totality of circumstances test for hostile work environment.",
    elements: ["Objective hostility","Subjective perception of hostility","Totality of circumstances (frequency, severity, threats, work interference)"] },
  { id: "oncale", name: "Oncale v. Sundowner Offshore", year: 1998, court: "SCOTUS", category: "Sexual Harassment",
    facts: "Mr. Oncale was working on an oil rig with an 8-man crew. He was harassed and sodomized on the job by peers and supervisors. He quit and later filed a Title VII claim, alleging sex discrimination. District court dismissed on summary judgment. Affirmed on appeal > SC.",
    issue: "Can same-sex sexual harassment be actionable under Title VII?",
    holding: "Yes. Same-sex harassment is actionable. (Scalia, unanimous.)",
    significance: "Title VII protects against same-sex harassment; \"because of sex\" need not be sexual desire.",
    elements: ["Same-sex harassment actionable","Need not be motivated by sexual desire","Discrimination because of sex required"] },
  { id: "rogers", name: "Rogers v. Commissioner", year: 1983, court: "MA Sup. Jud. Ct.", category: "Right to Refuse Treatment",
    facts: "7 patients at a Boston hospital filed a class action suit on behalf of all present and future patients secluded or medicated without their consent; sought injunction and damages; district court held that there is a right to refuse treatment and that a guardian must consent; appealed to SC.",
    issue: "Right to refuse treatment? Who decides for incompetent patients?",
    holding: "Committed patient competent until judicially found incompetent. If incompetent, judge applies substituted judgment.",
    significance: "\"Rogers hearing\" / \"Rogers order\" in MA. Rights-driven model.",
    elements: ["Right to refuse","Judicial determination of incompetence","Substituted judgment (not best interests)","Emergency exception"] },
  { id: "rennie", name: "Rennie v. Klein", year: 1983, court: "3rd Cir.", category: "Right to Refuse Treatment",
    facts: "John Rennie, involuntarily committed at a New Jersey state psychiatric hospital, was forcibly medicated with antipsychotics over his repeated objections. He filed suit claiming his constitutional rights were violated.",
    issue: "Right to refuse antipsychotics? Standard of review?",
    holding: "Yes — qualified right. Apply Youngberg professional judgment standard.",
    significance: "Treatment-driven model contrasting Rogers; defers to professionals.",
    elements: ["Qualified right to refuse","Professional judgment standard","Presumptively valid unless substantial departure"] },
  { id: "harper", name: "Washington v. Harper", year: 1990, court: "SCOTUS", category: "Right to Refuse Treatment",
    facts: "Walter Harper, a Washington State prisoner with serious mental illness, was administered antipsychotic medication against his will under a prison policy. The policy allowed forced medication when an inmate was gravely disabled or dangerous, subject to administrative review.",
    issue: "Can a prisoner be forcibly medicated via administrative (not judicial) hearing?",
    holding: "Yes. Administrative review sufficient if (1) serious mental illness, (2) dangerous or gravely disabled, (3) medically appropriate.",
    significance: "Lower bar for prisoners; administrative process acceptable.",
    elements: ["Serious mental illness","Dangerous to self/others OR gravely disabled","Medical interest","Administrative review sufficient"] },
  { id: "steele", name: "Steele v. Hamilton City", year: 1999, court: "OH Sup. Ct.", category: "Right to Refuse Treatment",
    facts: "Timothy Steele, an involuntarily committed patient at a state psychiatric facility in Ohio, refused antipsychotic medication. The facility sought to medicate him over his objection. Ohio law had not clearly defined the procedural requirements for overriding a committed patient's medication refusal.",
    issue: "What procedural safeguards must Ohio provide before forced medication?",
    holding: "Judicial hearing required (except emergencies). Court considers diagnosis, treatment, reasons for refusal, capacity, alternatives.",
    significance: "Ohio standard stronger than federal minimum (Harper).",
    elements: ["Judicial hearing","Diagnosis","Proposed treatment + side effects","Capacity to understand","Alternatives"] },
  { id: "hargrave", name: "Hargrave v. Vermont", year: 2003, court: "VT Dist. Ct.", category: "Right to Refuse Treatment",
    facts: "Nancy Hargrave, a Vermont woman with schizophrenia, had signed a psychiatric advance directive refusing antipsychotic medication if involuntarily committed in the future. Vermont's law allowed override of advance directives for committed patients deemed incompetent.",
    issue: "Does VT's override of psychiatric advance directives violate the ADA?",
    holding: "Yes. Disparate treatment vs. physical-condition advance directives discriminates under ADA.",
    significance: "ADA protection for psychiatric advance directives.",
    elements: ["ADA protection","Equal treatment with physical advance directives","Competently-executed PADs must be honored"] },
  { id: "lifschutz", name: "In re Lifschutz", year: 1970, court: "CA Sup. Ct.", category: "Confidentiality & Privilege",
    facts: "Mr. J was seen by a psychiatrist Dr. Lifschutz. 10 years later, Mr. H sued for emotional damages; records from Dr. L were subpoenaed. Dr. L refused to provide records, stating that there was a constitutionally protected privilege to keep the records private. Dr. L was held in contempt and spent several days in jail before petitioning for habeas corpus.",
    issue: "Is there a psychiatrist's constitutional right to privacy?",
    holding: "No. The PATIENT, not the doctor, owns the privilege. Waiver is partial — only as relevant to litigation.",
    significance: "Patient owns the privilege.",
    elements: ["Patient owns privilege","Doctor has no constitutional privacy right","Partial waiver for relevant issues"] },
  { id: "doe_roe", name: "Doe v. Roe", year: 1977, court: "NY trial court", category: "Confidentiality & Privilege",
    facts: "Ms. Doe sued her former psychiatrist Dr. Roe and her husband, alleging that they unlawfully invaded her privacy by publishing a book \"which reported verbatim and extensively the patient's thoughts, feelings, emotions, fantasies and biographies.\" The book was released eight years after treatment. The plaintiff sued for an injunction to stop publication of the book and for damages.",
    issue: "Did publication of therapy content violate patient privacy?",
    holding: "Yes. Patient awarded damages for breach of confidentiality.",
    significance: "Recognized civil cause of action for breach of therapist confidentiality.",
    elements: ["Therapist-patient confidentiality enforceable","Civil damages available","Right of action for patient"] },
  { id: "jaffee", name: "Jaffee v. Redmond", year: 1996, court: "SCOTUS", category: "Confidentiality & Privilege",
    facts: "Ms. Redmond, a police officer, shot and killed Mr. Allan while policing. Jaffee, the executor of Allan's estate, filed suit in Federal District Court alleging that Officer Redmond violated Allan's constitutional rights by using excessive force. Redmond sought counseling after the killing; these notes were subpoenaed and Redmond and her therapist refused to provide them arguing they were protecting by psychotherapist-patient privilege. Trial court judge then said it should be presumed whatever is in the notes is negative; jury awarded 550k to Allan's family; appealed and reversed > SC.",
    issue: "Is there a federal psychotherapist-patient privilege?",
    holding: "Yes. Federal common-law privilege; extends to licensed clinical social workers.",
    significance: "Federal privilege established; recognizes importance of confidentiality.",
    elements: ["Federal common-law privilege","Psychiatrists, psychologists, LCSWs","Communications in course of therapy"] },
  { id: "addington", name: "Addington v. Texas", year: 1979, court: "SCOTUS", category: "Civil Commitment",
    facts: "Frank O'Neal Addington was subject to indefinite civil commitment proceedings in Texas after his mother petitioned for his commitment. He had a history of threatening behavior. Texas courts used a preponderance of the evidence standard for commitment. Addington argued the standard should be beyond a reasonable doubt.",
    issue: "What standard of proof for civil commitment?",
    holding: "Clear and convincing evidence (constitutional floor). Lower than reasonable doubt given psychiatric uncertainty.",
    significance: "Sets constitutional minimum for civil commitment standard of proof.",
    elements: ["Clear and convincing evidence","Higher than preponderance","Lower than reasonable doubt"] },
  { id: "parham", name: "Parham v. J.R.", year: 1979, court: "SCOTUS", category: "Civil Commitment",
    facts: "J.R. was a child with behavioral problems whose parents sought his voluntary commitment to a Georgia state psychiatric hospital. J.L. was a child committed by the state (as his guardian). Both children were denied adversarial hearings before commitment.",
    issue: "Do minors need adversarial hearings before parental commitment?",
    holding: "No. Neutral fact-finder (e.g., admitting physician) sufficient. Parents presumed to act in best interest.",
    significance: "Less stringent process for minors; parental good-faith presumption.",
    elements: ["Neutral fact-finder (physician sufficient)","No formal hearing required","Parental presumption"] },
  { id: "zinermon", name: "Zinermon v. Burch", year: 1990, court: "SCOTUS", category: "Civil Commitment",
    facts: "Darrell Burch, apparently mentally ill, was found wandering in Florida and signed forms for voluntary admission to a state psychiatric facility. He later claimed he had been incompetent to consent to voluntary admission and that admitting him as 'voluntary' when he was incompetent violated his due process rights.",
    issue: "Does admitting an incompetent person as \"voluntary\" violate due process?",
    holding: "Yes. State must screen for competence to consent to voluntary admission.",
    significance: "Voluntary admission requires capacity screening.",
    elements: ["Capacity to consent required","Procedural safeguards needed","Foreseeable risk of incompetent voluntary admission"] },
  { id: "dillon", name: "Dillon v. Legg", year: 1968, court: "CA Sup. Ct.", category: "Civil Commitment",
    facts: "Erin Dillon was struck and killed by a car driven by David Legg. Erin's sister witnessed the accident from nearby but was not in the zone of immediate physical danger. Their mother also witnessed the accident from farther away. Both sister and mother sought to recover for negligently inflicted emotional distress.",
    issue: "Can bystanders recover for NIED without being in physical danger?",
    holding: "Yes — new cause of action. Dillon factors: proximity, contemporaneous observation, close relationship.",
    significance: "Foundational NIED case; foreseeability principle.",
    elements: ["Proximity to accident","Contemporaneous observation","Close relationship to victim"] },
  { id: "lake", bazelon: true, name: "Lake v. Cameron", year: 1966, court: "D.C. Cir.", category: "Civil Commitment",
    facts: "Catherine Lake, an elderly woman with chronic brain syndrome, was involuntarily committed to St. Elizabeths Hospital after being found wandering and unable to care for herself. She sought less restrictive alternatives to hospitalization.",
    issue: "Right to least restrictive alternative placement?",
    holding: "Yes. Government must explore alternatives before indefinite institutional confinement.",
    significance: "Established least restrictive alternative principle.",
    elements: ["Least restrictive alternative","Government must explore options","Both individual and state interests considered"] },
  { id: "lessard", name: "Lessard v. Schmidt", year: 1972, court: "WI Dist. Ct.", category: "Civil Commitment",
    facts: "Alberta Lessard was involuntarily committed to a state mental health facility under Wisconsin's civil commitment statute, which lacked many procedural protections. The ACLU challenged the constitutionality of the Wisconsin commitment statute.",
    issue: "Do civil commitment respondents have due process rights like criminal defendants?",
    holding: "Yes. Required: notice, counsel, right against self-incrimination, BRD for dangerousness, least restrictive alternative.",
    significance: "Lower-court landmark; drove nationwide reform. (BRD later softened to clear/convincing by Addington.)",
    elements: ["Notice","Right to counsel","Self-incrimination privilege","Imminent dangerousness","Least restrictive alternative"] },
  { id: "oconnor", name: "O'Connor v. Donaldson", year: 1975, court: "SCOTUS", category: "Civil Commitment",
    facts: "Kenneth Donaldson was involuntarily confined in a Florida state mental hospital for nearly 15 years. He was not dangerous, received virtually no treatment, and repeatedly requested release. Friends offered to take responsibility for him, but the hospital superintendent O'Connor refused to release him, arguing mental illness alone justified confinement.",
    issue: "Can a non-dangerous mentally ill person be confined who can survive safely in freedom?",
    holding: "No. Mental illness alone insufficient. Must be dangerous or unable to survive safely.",
    significance: "O'Connor personally liable. Mental illness + non-dangerous + can survive = must release.",
    elements: ["Mental illness alone insufficient","Dangerousness OR grave disability required","Personal liability possible"] },
  { id: "tarasoff", name: "Tarasoff v. Regents", year: 1976, court: "CA Sup. Ct.", category: "Duty to Protect",
    facts: "Prosenjit Poddar was a student at UC Berkley and began dating Tatianna Tarasoff. He became depressed when he found she was seeing other men; he sought counseling at the university health service where he told his therapist he intended to kill Tarasoff. The therapist notified police; police let Poddar go. Poddar later stabbed Tarasoff to death. Tarasoff's parents sued campus police, university health service, and regents of UC Berkley; ultimately appealed to CA SC, who reversed lower court's decision and said a therapist \"bears a duty to use reasonable care to give threatened persons such warnings as are essential to avert foreseeable danger arising from a patient's condition\" - Tarasoff I. The CA SC reheard the case due to uproar from psychiatrists and police; this case is considered Tarasoff II.",
    issue: "Does a therapist owe a duty to protect identifiable third parties?",
    holding: "Yes. Reasonable care to protect identifiable victim(s). \"Protective privilege ends where public peril begins.\"",
    significance: "Tarasoff I (1974) = duty to WARN; Tarasoff II (1976) = duty to PROTECT (broader).",
    elements: ["Identifiable victim","Foreseeable threat","Reasonable care to protect (warn, hospitalize, notify police)"] },
  { id: "lipari", name: "Lipari v. Sears", year: 1980, court: "U.S. Dist. Ct. NE", category: "Duty to Protect",
    facts: "Mr. Cribbs purchased a gun from a Sears store. He had been involuntarily hospitalized at the VA in the past and noted such, on forms while buying the gun. One month after purchasing the firearm, he shot into an Omaha nightclub, killing Mr. Lipari and wounding Mrs. Lipari. Mrs. L sued Sears for negligently selling the shotgun to a known mentally ill person. Sears in turn filed a complaint against the US govt saying they had negligently treated Mr. Cribbs, saying that the VA should have known Mr. C was dangerous and intervened; Mr. L filed a similar complaint. Defendants filed a motion to dismiss, saying none of the plaintiffs had a claim.",
    issue: "Does duty to protect extend beyond identifiable victims to foreseeable victims at large?",
    holding: "Yes. Therapist has duty to detain dangerous persons; foreseeable victims belong to class.",
    significance: "Extends Tarasoff to foreseeable victims (not just identifiable individuals).",
    elements: ["Duty extends beyond identifiable victims","Foreseeable class of victims","Public at large can be protected class"] },
  { id: "littleton", name: "Littleton v. Good Samaritan", year: 1988, court: "OH Sup. Ct.", category: "Duty to Protect",
    facts: "Ms. Pearson had post-partum psychotic depression; psychiatrically hospitalized at Good Sam in Dayton; told nurses that she was planning on killing the baby via injection but later retracted this; nurses told doctor but doctor did not address it fully; discharge plan was made where the baby was placed in care of the father and family was not told that she made threats just informed she should not be alone with the baby; family left her alone with baby and she later killed the baby via aspirin.",
    issue: "When is a psychiatrist liable for violent acts by voluntarily hospitalized discharged patient?",
    holding: "Adopted \"professional judgment rule.\" If thorough VRA + good faith + adherence to standards = not liable for mere error.",
    significance: "Ohio standard for post-discharge violence liability.",
    elements: ["Professional judgment standard","Thorough VRA","Good faith","Not liable for mere error of judgment"] },
  { id: "morgan", name: "Morgan v. Fairfield", year: 1994, court: "OH Sup. Ct.", category: "Duty to Protect",
    facts: "Mr. Morgan had a history of psychosis and violence. Got treatment at Fairfield Counseling Center, tried to get SSI, psychiatrist felt he was malingering, tapered his antipsychotic and denied him for disability; he deteriorated and shot and killed his parents and wounded his sister.",
    issue: "Does duty to protect extend to outpatient setting?",
    holding: "Yes. When psychiatrist knows or should know outpatient poses substantial risk, duty to exercise best professional judgment.",
    significance: "No longer good law; superseded by Ohio statute (ORC §2305.51).",
    elements: ["Outpatient duty extends","Knew or should have known","Best professional judgment"] },
  { id: "bragdon", name: "Bragdon v. Abbott", year: 1998, court: "SCOTUS", category: "ADA",
    facts: "Ms. Abbott told her dentist about her asymptomatic HIV infection, and her dentist Mr. Bragdon said she would not fill her cavity in office, that she would need to pay for services at a hospital to get it filled. Ms. Abbott sued in District Court of Maine, alleging discrimination on the basis of her disability (HIV affects reproduction, a \"major life activity\"), the ADA requires public accommodation (which includes the \"professional office of the health care provider\"), and that the ADA further provides that unless an individual poses a \"direct threat to the safety of others\", they can participate in services. The District Court granted summary judgment, and First Circuit Court of appeals affirmed.",
    issue: "Is asymptomatic HIV a disability under the ADA?",
    holding: "Yes. Asymptomatic HIV substantially limits major life activity (reproduction). Insufficient evidence of \"direct threat.\"",
    significance: "Broad reading of ADA \"disability\"; objective evidence required for \"direct threat\" defense.",
    elements: ["Physical/mental impairment","Substantially limits major life activity","Direct threat must be based on objective evidence"] },
  { id: "olmstead", name: "Olmstead v. L.C.", year: 1999, court: "SCOTUS", category: "ADA",
    facts: "L.C. and E.W. (Zimring is L.C.'s guardian ad litem) had MR and psychiatric illness; were committed to a hospital; requested placement in a community-based program as the treatment team thought they were ready. The women filed suit in the US DC of Georgia alleging that the State's failure to place her in a community violated Title II of the ADA which specifies that no individual with disability shall be excluded from participation in a public entity's services, ADA regulations required public entities to administer programs in the most integrated setting appropriate to needs of disabled individuals; it further requires public entities to \"make reasonable modifications\" to avoid discrimination on the basis of disability, but does not require the program to \"fundamentally alter\" their program. DC granted partial summary judgment, ordering their placement in an appropriate community-based treatment program and that lack of funding is not an excuse. The Eleventh Circuit affirmed but remanded for reassessment on the cost-based defense.",
    issue: "Does ADA Title II require community placement for persons with mental disabilities when appropriate?",
    holding: "Yes. Unjustified institutional isolation is discrimination. Community placement required when (1) professionals say appropriate, (2) person doesn't oppose, (3) reasonable accommodation possible.",
    significance: "Landmark ADA integration mandate; \"Olmstead plans\" in states.",
    elements: ["Professionals deem appropriate","Individual does not oppose","Reasonable accommodation possible without fundamental alteration"] },
  { id: "us_georgia", name: "U.S. v. Georgia", year: 2006, court: "SCOTUS", category: "ADA",
    facts: "Mr. Goodman, a paraplegic inmate in a Georgia prison, filed a complaint in DC against GA and thee GA DOC challenging the conditions of his confinement; alleged that his small cell prevented him from turning his wheelchair around making him unable to use the toilet, shower without assistance thereby leaving him to remain in his feces for hours at a time. He alleged he was repeatedly injured when he attempted self-care tasks without assistance or appropriate accommodations. He also claimed that he had been denied PT and access to services based on his disability. Goodman brought claims under 42 U.S.C. §1983 and Title II of the ADA, seeking both injunctive relief and money damages. The DC dismissed both claims, the 11th Circuit COA held that the DC erred in dismissing his §1983 claims as there were three Eighth Amendment claims relating to the cruel and unusual conditions of his confinement. The Court of Appeals affirmed the DC's holding that Goodman's Title II claims for money damages against the State were barred by sovereign immunity. SC granted cert on appeal.",
    issue: "Can a disabled inmate sue state for money damages under Title II ADA?",
    holding: "Yes — when conduct violates the 14th Amendment, Title II validly abrogates state sovereign immunity.",
    significance: "ADA damages available against states for 14th Amendment violations.",
    elements: ["Title II claim","Conduct violates 14th Amendment","Sovereign immunity abrogated under §5 of 14th Amendment"] },
  { id: "hurd", name: "State v. Hurd", year: 1981, court: "NJ Sup. Ct.", category: "Hypnosis",
    facts: "Paul Hurd was accused of stabbing his ex-wife. A key witness was hypnotized by a psychiatrist with 2 LE officers present, to \"refresh her memory\", where they asked leading questions. Hurd as a defense brought expert testimony that hypnosis might be unreliable or highly susceptible to suggestibility/coercion. New Jersey had no rules governing hypnotically refreshed testimony.",
    issue: "Is hypnotically refreshed testimony admissible?",
    holding: "Admissible if strict procedural safeguards (Hurd guidelines) followed by clear and convincing evidence.",
    significance: "Permissive approach with safeguards; widely adopted.",
    elements: ["Qualified hypnotist","Recorded session","Neutral hypnotist","Only hypnotist + subject present","All communications preserved","Written LE info"] },
  { id: "shirley", name: "People v. Shirley", year: 1982, court: "CA Sup. Ct.", category: "Hypnosis",
    facts: "Mr. Shirley was convicted of rape and appealed; the prosecution's witness had been hypnotized by police to refresh her memory. Shirley sought to use expert testimony about the unreliability of hypnotically refreshed memory to challenge the witness's credibility.",
    issue: "Is hypnotically refreshed testimony admissible?",
    holding: "No (in CA). Post-hypnosis testimony excluded; only pre-hypnosis recollections admissible.",
    significance: "Strict (Kelly-Frye) approach; California rule. More restrictive than Hurd.",
    elements: ["Post-hypnosis testimony excluded","Only pre-hypnosis statements admissible","Hypnosis fails general acceptance test"] },
  { id: "landeros", name: "Landeros v. Flood", year: 1976, court: "CA Sup. Ct.", category: "Child Abuse Reporting",
    facts: "An 11-month-old child with multiple fractures and injuries consistent with battered child syndrome was brought to a hospital. The treating physician failed to diagnose child abuse, failed to report it, and returned the child to her parents. The child suffered further abuse.",
    issue: "Physician liability for failure to diagnose/report child abuse?",
    holding: "Yes — liability for subsequent injuries when clinical signs were present.",
    significance: "Established physician civil liability for failure to report.",
    elements: ["Battered child syndrome is diagnosable","Failure to report breaches standard of care","Foreseeability of subsequent harm"] },
  { id: "stritzinger", name: "People v. Stritzinger", year: 1983, court: "CA Sup. Ct.", category: "Child Abuse Reporting",
    facts: "During therapy, a man disclosed that he was sexually abusing his stepdaughter. The therapist reported the abuse to authorities. The defendant sought to suppress the report as a breach of therapist-patient privilege.",
    issue: "Does therapist-patient privilege bar reporting child abuse?",
    holding: "No. Mandatory reporting overrides privilege.",
    significance: "Privilege yields to child protection.",
    elements: ["Mandatory reporting overrides privilege","Not discretionary if statutory criteria met"] },
  { id: "andring", name: "State v. Andring", year: 1984, court: "MN Sup. Ct.", category: "Child Abuse Reporting",
    facts: "During group therapy sessions at a psych hospital following charges of sexual misconduct with a minor, Andring voluntarily committed himself, and made statements relevant to a criminal investigation. The prosecution sought to get records from individual and group sessions. Trial court granted group therapy records. Minnesota's psychiatrist-patient privilege was at issue, in relation to statements made during group therapy.",
    issue: "Does psychiatrist-patient privilege extend to group therapy?",
    holding: "Yes. Privilege extends to group therapy. Reporting limited to specific information; privilege not completely discarded.",
    significance: "Extends privilege to group therapy modality.",
    elements: ["Group therapy privileged","Limited disclosure for mandatory reporting","Privilege not fully waived in group setting"] },
  { id: "deshaney", name: "DeShaney v. Winnebago", year: 1989, court: "SCOTUS", category: "Child Abuse Reporting",
    facts: "Four-year-old Joshua DeShaney was repeatedly beaten by his father. Winnebago County DSS received reports of abuse and investigated but failed to remove Joshua from his father's custody. Joshua was ultimately beaten so severely he suffered permanent brain damage.",
    issue: "Does 14th Amendment impose affirmative duty to protect from private violence?",
    holding: "No. Due process limits state action; doesn't guarantee state protection. Exception: state-created danger or custody.",
    significance: "Major limit on state protective duty.",
    elements: ["No affirmative duty in non-custodial settings","State-created danger exception","Custodial relationship exception"] },
  { id: "painter", name: "Painter v. Bannister", year: 1966, court: "IA Sup. Ct.", category: "Child Custody",
    facts: "Mark Painter's mother died and his father (an artist) left him in the care of maternal grandparents, the Bannisters. When the father sought to reclaim custody, the Bannisters (who were stable, conservative farmers) refused. The court had to determine best interests of the child.",
    issue: "What standard governs parent vs. non-parent custody disputes?",
    holding: "Best interests of the child. Grandparents retained custody despite father's legal rights.",
    significance: "Best interests standard can override parental rights; controversial lifestyle considerations.",
    elements: ["Best interests of child","Can override parental presumption","Stability and attachment considered"] },
  { id: "santosky", name: "Santosky v. Kramer", year: 1982, court: "SCOTUS", category: "Child Custody",
    facts: "The Santosky children were adjudicated permanently neglected by their parents. New York sought to terminate parental rights using a fair preponderance of the evidence standard.",
    issue: "Standard of proof for termination of parental rights?",
    holding: "Clear and convincing evidence (constitutional minimum).",
    significance: "Parental rights are fundamental liberty interests; termination is drastic.",
    elements: ["Clear and convincing evidence","Parental rights are fundamental","Higher than preponderance"] },
  { id: "gault", name: "In re Gault", year: 1967, court: "SCOTUS", category: "Juvenile Court/Education Services",
    facts: "Gerald Gault, 15, was committed to a juvenile detention facility for up to 6 years for making an obscene phone call. Adults could receive only a $5-$50 fine or 2 months in jail for the same offense. No notice, no attorney, no right to confront witnesses, no privilege against self-incrimination was provided.",
    issue: "What due process rights do juveniles have in delinquency proceedings?",
    holding: "Notice of charges, right to counsel, confrontation/cross-exam, privilege against self-incrimination.",
    significance: "Constitutionalized juvenile court procedures; ended parens patriae informality.",
    elements: ["Notice of charges","Right to counsel","Confrontation/cross-exam","Self-incrimination privilege"] },
  { id: "fare", name: "Fare v. Michael C.", year: 1979, court: "SCOTUS", category: "Juvenile Court/Education Services",
    facts: "A 16-year-old (Michael) was suspected of murder and brought in for questioning. He asked to speak with his probation officer rather than an attorney. Police denied this request and continued questioning. Michael eventually made incriminating statements.",
    issue: "Does request for probation officer invoke Miranda?",
    holding: "No. Probation officer ≠ attorney. Apply totality of circumstances for juvenile Miranda waivers.",
    significance: "Totality of circumstances test for juvenile Miranda waivers.",
    elements: ["Probation officer ≠ attorney","Totality of circumstances","Age, experience, capacity considered"] },
  { id: "rowley", name: "Board of Education v. Rowley", year: 1982, court: "SCOTUS", category: "Juvenile Court/Education Services",
    facts: "Amy Rowley, a deaf student, was doing well in school with a hearing aid and sign language interpreter part-time. Her parents sought a full-time interpreter under the Education for All Handicapped Children Act (EAHCA/IDEA). The school denied this, and the parents challenged the school's IEP.",
    issue: "What educational standard does IDEA require?",
    holding: "Schools must provide program reasonably calculated to enable educational benefits — not maximize potential.",
    significance: "\"Educational benefit\" standard for IDEA.",
    elements: ["Procedural compliance","IEP reasonably calculated for educational benefit","Not required to maximize potential"] },
  { id: "tatro", name: "Irving ISD v. Tatro", year: 1984, court: "SCOTUS", category: "Juvenile Court/Education Services",
    facts: "Amber Tatro had spina bifida and needed clean intermittent catheterization (CIC) every 3-4 hours to attend school. The Irving Independent School District refused to provide CIC, classifying it as an excluded 'medical service' rather than a required 'related service' under IDEA.",
    issue: "Is CIC a \"related service\" under IDEA or an excluded \"medical service\"?",
    holding: "Related service. \"Medical service\" exclusion = must be performed by physician. CIC doesn't need physician.",
    significance: "Physician requirement is the test for IDEA medical service exclusion.",
    elements: ["Related service if non-physician can perform","Necessary for child to benefit from special education","Medical service exclusion narrowly construed"] },
  { id: "graham", name: "Graham v. Florida", year: 2010, court: "SCOTUS", category: "Juvenile Sentencing",
    facts: "Terrance Graham was 16 when he committed armed burglary. After violating his probation, he was sentenced to life in prison without the possibility of parole for the non-homicide offense. Florida law permitted life without parole for juveniles who commit certain non-homicide crimes.",
    issue: "Does LWOP for juveniles in non-homicide cases violate the 8th Amendment?",
    holding: "Yes — categorical bar on LWOP for juvenile non-homicide.",
    significance: "Extended Roper. Meaningful opportunity for release required.",
    elements: ["Under 18 at offense","Non-homicide offense","Categorical 8th Amendment bar"] },
  { id: "miller", name: "Miller v. Alabama", year: 2012, court: "SCOTUS", category: "Juvenile Sentencing",
    facts: "Evan Miller was 14 when he and a friend beat a neighbor and set fire to his home, killing him. Miller was convicted of capital murder and sentenced to mandatory life imprisonment without the possibility of parole. Alabama law required this sentence upon conviction. *actually is a combined case of multiple 14 year olds.",
    issue: "Does mandatory LWOP for juvenile homicide violate the 8th Amendment?",
    holding: "Yes — mandatory LWOP unconstitutional. Individualized sentencing required considering youth.",
    significance: "Mandatory schemes barred; LWOP not categorically barred. Montgomery (2016) made retroactive.",
    elements: ["Mandatory LWOP barred","Individualized sentencing required","Consider youth and circumstances"] },
  { id: "ibntamas", name: "Ibn-Tamas v. U.S.", year: 1979, court: "D.C. Ct. App.", category: "Diminished Capacity",
    facts: "Ms. Ibn-Thomas was convicted of 2nd degree murder as while armed, she shot her husband to death. Evidence was presented that the victim had been violent towards his wife and others; the morning of the shooting, Ms. Tamas was beaten by her husband and kicked out of the house; the extent of self-defensee was discussed in court and expertise was sought from a clinical psychologist who was a defensee expert on the subject of \"battered women\"; the trial court excluded this testimony because they felt it was prejudicial towards the jury.",
    issue: "Should expert testimony on battered women be admitted?",
    holding: "Trial court erred in barring; testimony does not invade jury's province. Remanded.",
    significance: "Foundational case for battered woman syndrome expert testimony.",
    elements: ["Beyond ken of layperson","Expert has sufficient knowledge","Aids trier of fact","No state law against it"] },
  { id: "egelhoff", name: "Montana v. Egelhoff", year: 1996, court: "SCOTUS", category: "Diminished Capacity",
    facts: "James Egelhoff was found in a vehicle with two dead companions and a recently fired pistol. He was extremely intoxicated (blood alcohol 0.36). Montana law prohibited defendants from presenting evidence of voluntary intoxication to negate the mental state (mens rea) element of a crime. Egelhoff argued this violated due process.",
    issue: "Does barring voluntary intoxication evidence on mens rea violate due process?",
    holding: "No. States may make this policy choice without violating due process.",
    significance: "States can bar voluntary intoxication as mens rea defense.",
    elements: ["Historical tradition against intoxication defense","State interest in deterring intoxicated conduct","Voluntary intoxication = assumed responsibility"] },
  { id: "hartogs", name: "Roy v. Hartogs", year: 1976, court: "NY App. Ct.", category: "HIPAA & Patient Liability",
    facts: "Plaintiff Julie Roy filed suit for damanges against her psychiatrist Dr. Hartogs, claiming he had sex w/ her as part of prescribed therapy; said she was so eemotionally injured she sought hospitalization 2x; defendant claimed that suit was invalid because NY had abolished 'suits for seduction'; trial court awarded compensatory and punitive damages of $153k.",
    issue: "Is sex with patient malpractice? Barred by \"Heart Balm\" Act?",
    holding: "Malpractice; suit not barred. Compensatory damages awarded ($25K); punitive denied.",
    significance: "Sex with patient = malpractice; civil action available. Freud quoted in opinion.",
    elements: ["Sex with patient = malpractice","Compensatory damages allowed","Punitive requires malicious intent"] },
  { id: "clites", name: "Clites v. Iowa", year: 1982, court: "IA Ct. App.", category: "HIPAA & Patient Liability",
    facts: "Plaintiff Mr. Clites who had MR, was in a state hospital since adolescence and given medication to curb aggression; got TD; father filed suit for negligent use of drugs and that the defendants failed to provide reasonable medical care; trial court agreed; defendants appealed alleging trial court used an incorrect standard regarding use of tranquilizeers and informed consent.",
    issue: "Negligent use of antipsychotics; failure of informed consent?",
    holding: "Liability upheld. Insufficient evidence of severe aggression; failed to monitor TD; staff failed to consult experts. Damages affirmed.",
    significance: "Right to refuse via 1st Amendment; informed consent required even in institutional settings.",
    elements: ["Insufficient indication for meds","Failure to monitor for TD","Failure to obtain informed consent","Polypharmacy masked TD"] }
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

// ---- Flashcard decks for the concept areas (front / back / sub / key) ----
const CONLAW_DECK = [
  ...AMENDMENTS.map(a => ({ key: `amend:${a.num}`, front: `${a.num} Amendment`, sub: a.short, back: `${a.detail}\n\nIncorporation: ${a.incorp}` })),
  ...CONLAW_CONCEPTS.map(c => ({ key: `conlaw:${c.id}`, front: c.title, sub: 'Constitutional doctrine', back: `${c.body}\n\n• ${c.points.join('\n• ')}` })),
];
const INSANITY_DECK = [
  ...INSANITY_TESTS.map(t => ({ key: `itest:${t.id}`, front: t.name, sub: `${t.year} · ${t.tag}`, back: `${t.rule}\n\nOrigin: ${t.origin}\nCriticism: ${t.criticism}` })),
  ...IDRA_PROVISIONS.map((p, i) => ({ key: `idra:${i}`, front: p.h, sub: 'IDRA 1984', back: p.t })),
];
const BASICLAW_DECK = BASIC_LAW.map(c => ({ key: `basic:${c.id}`, front: c.title, sub: c.cat, back: `${c.body}\n\n• ${c.points.join('\n• ')}` }));

// ---- Per-domain MCQ generators ----
function generateConLawQuestions(buried = {}) {
  const qs = [];
  for (const a of AMENDMENTS) {
    if (buried['amend:' + a.num]) continue;
    const d = pickDistractors(AMENDMENTS, a, x => x.short, 3).map(x => x.short);
    const { options, correct } = makeOptions(a.short, d);
    qs.push({ q: `What does the ${a.num} Amendment chiefly protect?`, options, correct, explanation: `${a.num} Amendment: ${a.detail}` });
    const d2 = pickDistractors(AMENDMENTS, a, x => `${x.num} Amendment`, 3).map(x => `${x.num} Amendment`);
    const { options: o2, correct: c2 } = makeOptions(`${a.num} Amendment`, d2);
    qs.push({ q: `Which amendment is described here?\n\n"${a.short}"`, options: o2, correct: c2, explanation: `${a.num} Amendment — ${a.incorp}` });
  }
  for (const c of CONLAW_CONCEPTS) {
    if (buried['conlaw:' + c.id]) continue;
    const d = pickDistractors(CONLAW_CONCEPTS, c, x => x.title, 3).map(x => x.title);
    const { options, correct } = makeOptions(c.title, d);
    qs.push({ q: `Which constitutional doctrine does this describe?\n\n"${c.body}"`, options, correct, explanation: `${c.title}: ${c.points[0]}` });
  }
  return qs;
}
function generateInsanityQuestions(buried = {}) {
  const qs = [];
  for (const t of INSANITY_TESTS) {
    if (buried['itest:' + t.id]) continue;
    const d = pickDistractors(INSANITY_TESTS, t, x => x.name, 3).map(x => x.name);
    const { options, correct } = makeOptions(t.name, d);
    qs.push({ q: `Which insanity standard does this describe?\n\n"${t.rule}"`, options, correct, explanation: `${t.name} (${t.year}) — ${t.focus}` });
    const d2 = pickDistractors(INSANITY_TESTS, t, x => x.tag, 3).map(x => x.tag);
    if (new Set([t.tag, ...d2]).size === 4) {
      const { options: o2, correct: c2 } = makeOptions(t.tag, d2);
      qs.push({ q: `The ${t.name} (${t.year}) test is best classified as which type?`, options: o2, correct: c2, explanation: `${t.name}: ${t.focus}` });
    }
  }
  for (let i = 0; i < IDRA_PROVISIONS.length; i++) {
    if (buried['idra:' + i]) continue;
    const p = IDRA_PROVISIONS[i];
    const d = pickDistractors(IDRA_PROVISIONS, p, x => x.h, 3).map(x => x.h);
    const { options, correct } = makeOptions(p.h, d);
    qs.push({ q: `Which IDRA (1984) reform does this describe?\n\n"${p.t}"`, options, correct, explanation: `${p.h}: ${p.t}` });
  }
  return qs;
}
function generateBasicLawQuestions(buried = {}) {
  const qs = [];
  for (const c of BASIC_LAW) {
    if (buried['basic:' + c.id]) continue;
    const d = pickDistractors(BASIC_LAW, c, x => x.title, 3).map(x => x.title);
    const { options, correct } = makeOptions(c.title, d);
    qs.push({ q: `Which concept does this describe?\n\n"${c.body}"`, options, correct, explanation: `${c.title}: ${c.points[0]}` });
  }
  return qs;
}

const CATEGORIES = [...new Set(CASES.map(c => c.category))];

// ---- Case "basics" questions: category, court, year only ----
function generateBasicsQuestions(kind, buried = {}) {
  const cases = CASES.filter(c => !buried['case:' + c.id]);
  const allYears = [...new Set(cases.map(c => c.year))];
  const allCourts = [...new Set(cases.map(c => c.court))];
  const sample = (arr, exclude, n) => shuffleArr(arr.filter(v => v !== exclude)).slice(0, n);
  const qs = [];
  for (const c of cases) {
    if (kind === 'year' || kind === 'mixed') {
      const { options, correct } = makeOptions(String(c.year), sample(allYears, c.year, 3).map(String));
      qs.push({ q: `In what year was ${c.name} decided?`, options, correct, explanation: `${c.name} — ${c.court}, ${c.year}.` });
    }
    if (kind === 'court' || kind === 'mixed') {
      const { options, correct } = makeOptions(c.court, sample(allCourts, c.court, 3));
      qs.push({ q: `Which court decided ${c.name}?`, options, correct, explanation: `${c.name} was decided by ${c.court} (${c.year}).` });
    }
    if (kind === 'category' || kind === 'mixed') {
      const { options, correct } = makeOptions(c.category, sample(CATEGORIES, c.category, 3));
      qs.push({ q: `Which topic area does ${c.name} fall under?`, options, correct, explanation: `${c.name} is categorized under "${c.category}".` });
    }
  }
  return shuffleArr(qs);
}


// =====================================================================
// MAIN COMPONENT
// =====================================================================
export default function App() {
  const [mode, setMode] = useState('oral');
  const [progress, setProgress] = useState({});
  const [buried, setBuried] = useState({});

  useEffect(() => {
    (async () => {
      try { const result = await window.storage?.get('forensic_progress'); if (result?.value) setProgress(JSON.parse(result.value)); } catch (e) {}
      try { const b = await window.storage?.get('forensic_buried'); if (b?.value) setBuried(JSON.parse(b.value)); } catch (e) {}
    })();
  }, []);

  const saveProgress = async (newProgress) => {
    setProgress(newProgress);
    try { await window.storage?.set('forensic_progress', JSON.stringify(newProgress)); } catch (e) {}
  };
  const saveBuried = async (nb) => {
    setBuried(nb);
    try { await window.storage?.set('forensic_buried', JSON.stringify(nb)); } catch (e) {}
  };
  const markCase = (id, status) => saveProgress({ ...progress, [id]: status });
  const resetProgress = async () => saveProgress({});
  const toggleBury = (key) => { const nb = { ...buried }; if (nb[key]) delete nb[key]; else nb[key] = true; saveBuried(nb); };
  const unburyAll = () => saveBuried({});

  return (
    <div style={{ fontFamily: "'Aleo', 'Aleo', Georgia, serif", minHeight: '100vh', background: 'linear-gradient(180deg, #fcfbf8 0%, #f4f1ea 100%)', color: '#232a31' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Aleo:ital,wght@0,400;0,500;0,700;0,800;0,900;1,400;1,500&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        button { cursor: pointer; font-family: inherit; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.55; } }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        <header style={{ borderBottom: '2px solid #2b3742', paddingBottom: 20, marginBottom: 28, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#7c2d2d', marginBottom: 4 }}>UH / CWRU · Forensic Psychiatry</div>
            <h1 style={{ fontFamily: "'Aleo', serif", fontSize: 38, fontWeight: 800, fontStyle: 'normal', margin: 0, color: '#2b3742', letterSpacing: '-0.02em' }}>Landmark Final Exam <span style={{ fontWeight: 400, color: '#7c2d2d' }}>—</span> Study Guide</h1>
          </div>
          <ProgressBadge progress={progress} total={CASES.length} />
        </header>

        <ModeTabs mode={mode} setMode={setMode} />

        <main style={{ marginTop: 24 }}>
          {mode === 'oral' && <OralExamMode progress={progress} markCase={markCase} buried={buried} toggleBury={toggleBury} />}
          {mode === 'browse' && <BrowseMode progress={progress} buried={buried} toggleBury={toggleBury} />}
          {mode === 'conlaw' && <ConLawMode buried={buried} toggleBury={toggleBury} />}
          {mode === 'insanity' && <InsanityMode buried={buried} toggleBury={toggleBury} />}
          {mode === 'basiclaw' && <BasicLawMode buried={buried} toggleBury={toggleBury} />}
          {mode === 'terms' && <TermsMode />}
          {mode === 'flashcards' && <FlashcardsMode progress={progress} markCase={markCase} buried={buried} toggleBury={toggleBury} />}
          {mode === 'quiz' && <QuizMode buried={buried} />}
          {mode === 'basics' && <CaseBasicsMode buried={buried} />}
          {mode === 'progress' && <ProgressMode progress={progress} resetProgress={resetProgress} buried={buried} toggleBury={toggleBury} unburyAll={unburyAll} />}
          {mode === 'countdown' && <CountdownMode />}
        </main>

        <footer style={{ marginTop: 48, paddingTop: 20, borderTop: '1px solid #dcd6c8', textAlign: 'center', fontSize: 12, color: '#6e6757', letterSpacing: '0.05em' }}>
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
    <div style={{ display: 'flex', gap: 14, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>
      <Stat label="Mastered" value={mastered} color="#34602f" />
      <Stat label="Reviewing" value={reviewing} color="#8a5a1c" />
      <Stat label="Cases" value={total} color="#2b3742" />
    </div>
  );
}
function Stat({ label, value, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 22, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6e6757', marginTop: 4 }}>{label}</div>
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
    { id: 'basics', label: 'Case Basics', icon: Map },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'countdown', label: 'Countdown', icon: CalendarClock },
  ];
  return (
    <nav style={{ display: 'flex', gap: 4, flexWrap: 'wrap', borderBottom: '1px solid #dcd6c8' }}>
      {tabs.map(t => {
        const Icon = t.icon; const active = mode === t.id;
        return (
          <button key={t.id} onClick={() => setMode(t.id)}
            style={{ background: 'none', border: 'none', padding: '12px 16px',
              borderBottom: active ? '3px solid #2b3742' : '3px solid transparent',
              color: active ? '#2b3742' : '#6e6757', fontFamily: "'Aleo', serif",
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
function OralExamMode({ progress, markCase, buried, toggleBury }) {
  const [view, setView] = useState('drill'); // 'drill' | 'map'
  const [filter, setFilter] = useState('all');
  const [chronological, setChronological] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [idx, setIdx] = useState(0);
  const blank = { courtYear: false, facts: false, issue: false, holding: false, sig: false, elements: false };
  const [revealed, setRevealed] = useState(blank);

  const pool = useMemo(() => {
    let list = CASES.filter(c => !buried['case:' + c.id]);
    if (filter === 'review') list = list.filter(c => progress[c.id] !== 'mastered');
    if (filter === 'unseen') list = list.filter(c => !progress[c.id]);
    if (CATEGORIES.includes(filter)) list = list.filter(c => c.category === filter);
    const arr = [...list];
    if (chronological) { arr.sort((a, b) => a.year - b.year); return arr; }
    let seed = shuffleSeed;
    for (let i = arr.length - 1; i > 0; i--) { seed = (seed * 9301 + 49297) % 233280; const j = Math.floor((seed / 233280) * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
    return arr;
  }, [filter, shuffleSeed, progress, chronological, buried]);

  // ---------- Category Map view ----------
  if (view === 'map') {
    const catList = filter !== 'all' && CATEGORIES.includes(filter) ? [filter] : CATEGORIES;
    return (
      <div>
        <ViewToggle view={view} setView={setView} />
        <p style={{ fontSize: 13, color: '#6e6757', fontStyle: 'italic', margin: '6px 0 18px 0', lineHeight: 1.6 }}>
          Study the shape of each topic: every category with its cases laid out chronologically. Examiners often walk you forward through a line of cases — see how each one builds on the last.
        </p>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          style={{ ...selectStyle, marginBottom: 20 }}>
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {catList.map(cat => {
          const list = CASES.filter(c => c.category === cat && !buried['case:' + c.id]).sort((a, b) => a.year - b.year);
          if (list.length === 0) return null;
          return (
            <section key={cat} style={{ marginBottom: 26 }}>
              <h3 style={{ fontFamily: "'Aleo', serif", fontSize: 20, fontStyle: 'italic', fontWeight: 500, color: '#2b3742', margin: '0 0 12px 0', borderBottom: '1px solid #dcd6c8', paddingBottom: 6 }}>
                {cat} <span style={{ fontSize: 12, fontStyle: 'normal', color: '#7c2d2d' }}>· {list.length} cases</span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative', paddingLeft: 18 }}>
                <div style={{ position: 'absolute', left: 4, top: 8, bottom: 8, width: 2, background: '#dcd6c8' }} />
                {list.map(c => (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '7px 0', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: -18, top: 12, width: 9, height: 9, borderRadius: '50%', background: '#2b3742', border: '2px solid #fcfbf8' }} />
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: '#7c2d2d', fontWeight: 500, minWidth: 42 }}>{c.year}</span>
                    <span style={{ fontFamily: "'Aleo', serif", fontSize: 16, fontStyle: 'normal', fontWeight: 700, color: '#2b3742' }}>{c.name}</span>
                    <span style={{ fontSize: 12, color: '#6e6757' }}>· {c.court}</span>
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
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#2b3742', cursor: 'pointer' }}>
          <input type="checkbox" checked={chronological} onChange={(e) => { setChronological(e.target.checked); setIdx(0); reset(); }} />
          Chronological order
        </label>
        {!chronological && (
          <button onClick={() => { setShuffleSeed(Math.random() * 10000); setIdx(0); reset(); }} style={btnSecondary}><Shuffle size={14} /> Shuffle</button>
        )}
        <div style={{ marginLeft: 'auto', fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#6e6757' }}>{idx + 1} / {pool.length}</div>
      </div>

      <div style={cardStyle}>
        <div style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#7c2d2d', marginBottom: 8 }}>Examiner says…</div>
        <div style={{ fontFamily: "'Aleo', serif", fontSize: 19, fontWeight: 400, fontStyle: 'italic', color: '#4c5158', margin: '0 0 4px 0' }}>"Tell me about…"</div>
        <h2 style={{ fontFamily: "'Aleo', serif", fontSize: 36, fontWeight: 800, fontStyle: 'normal', margin: '0 0 4px 0', color: '#2b3742', lineHeight: 1.12, letterSpacing: '-0.01em' }}>{current.name}</h2>
        <div style={{ fontSize: 13, color: '#6e6757', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}><em>{current.category}</em>{current.bazelon && <BazelonBadge size="lg" />}</div>

        <div style={{ borderTop: '1px solid #e6e1d5', paddingTop: 16, marginTop: 12 }}>
          <p style={{ fontSize: 14, color: '#6e6757', fontStyle: 'italic', margin: '0 0 14px 0', lineHeight: 1.6 }}>
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

        <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid #e6e1d5' }}>
          <div style={{ fontSize: 12, color: '#6e6757', marginBottom: 10, letterSpacing: '0.05em' }}>How well did you know this?</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <SelfAssessBtn label="Got it cold" color="#34602f" active={progress[current.id] === 'mastered'} onClick={() => { markCase(current.id, 'mastered'); next(); }} />
            <SelfAssessBtn label="Needs review" color="#8a5a1c" active={progress[current.id] === 'reviewing'} onClick={() => { markCase(current.id, 'reviewing'); next(); }} />
            <SelfAssessBtn label="Didn't know it" color="#8b2c2c" active={progress[current.id] === 'unknown'} onClick={() => { markCase(current.id, 'unknown'); next(); }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, gap: 10, flexWrap: 'wrap' }}>
        <button onClick={prev} style={btnSecondary}><ChevronLeft size={16} /> Previous</button>
        <button onClick={() => { toggleBury('case:' + current.id); reset(); setIdx(i => Math.min(i, pool.length - 2 < 0 ? 0 : pool.length - 2)); }} style={btnGhost} title="Hide this case from study sets">
          <X size={13} /> Bury this case
        </button>
        <button onClick={next} style={btnPrimary}>Next case <ChevronRight size={16} /></button>
      </div>
    </div>
  );
}

function ViewToggle({ view, setView }) {
  return (
    <div style={{ display: 'inline-flex', gap: 0, marginBottom: 16, border: '1.5px solid #2b3742', borderRadius: 6, overflow: 'hidden' }}>
      {[{ id: 'drill', label: 'Examiner Drill', icon: Mic }, { id: 'map', label: 'Category Map', icon: Map }].map(t => {
        const Icon = t.icon; const active = view === t.id;
        return (
          <button key={t.id} onClick={() => setView(t.id)} style={{ padding: '8px 16px', border: 'none', background: active ? '#2b3742' : 'transparent', color: active ? '#ffffff' : '#2b3742', fontFamily: "'Aleo', serif", fontStyle: active ? 'italic' : 'normal', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon size={14} /> {t.label}
          </button>
        );
      })}
    </div>
  );
}

function RevealSection({ label, content, revealed, onReveal, highlight }) {
  return (
    <div style={{ marginTop: 16, padding: 16, background: highlight ? '#f5f2ea' : '#f5f2ea', border: `1px solid ${highlight ? '#b85a5a' : '#e6e1d5'}`, borderLeft: `3px solid ${highlight ? '#2b3742' : '#cfc8b8'}`, borderRadius: 2 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: revealed ? 10 : 0 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7c2d2d', fontWeight: 600 }}>{label}</div>
        {!revealed && (<button onClick={onReveal} style={{ ...btnGhost, padding: '4px 10px', fontSize: 12 }}><Eye size={12} /> Reveal</button>)}
      </div>
      {revealed && (<div style={{ fontSize: 15, lineHeight: 1.65, color: '#283038', fontFamily: "'Aleo', Georgia, serif" }}>{content}</div>)}
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
function BrowseMode({ progress, buried, toggleBury }) {
  const [openId, setOpenId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showBuried, setShowBuried] = useState(false);

  const grouped = useMemo(() => {
    let list = filter === 'all' ? CASES : CASES.filter(c => c.category === filter);
    if (!showBuried) list = list.filter(c => !buried['case:' + c.id]);
    const g = {};
    list.forEach(c => { if (!g[c.category]) g[c.category] = []; g[c.category].push(c); });
    return g;
  }, [filter, buried, showBuried]);

  const buriedCount = CASES.filter(c => buried['case:' + c.id]).length;

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={selectStyle}>
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {buriedCount > 0 && (
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#2b3742', cursor: 'pointer' }}>
            <input type="checkbox" checked={showBuried} onChange={(e) => setShowBuried(e.target.checked)} />
            Show buried ({buriedCount})
          </label>
        )}
      </div>

      {Object.entries(grouped).map(([cat, list]) => (
        <section key={cat} style={{ marginBottom: 32 }}>
          <h3 style={{ fontFamily: "'Aleo', serif", fontSize: 22, fontStyle: 'italic', fontWeight: 500, color: '#2b3742', margin: '0 0 14px 0', borderBottom: '1px solid #dcd6c8', paddingBottom: 8 }}>{cat}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[...list].sort((a, b) => a.year - b.year).map(c => {
              const open = openId === c.id;
              const status = progress[c.id];
              const isBuried = !!buried['case:' + c.id];
              const statusColor = status === 'mastered' ? '#34602f' : status === 'reviewing' ? '#8a5a1c' : status === 'unknown' ? '#8b2c2c' : null;
              return (
                <div key={c.id} style={{ background: '#f5f2ea', border: '1px solid #e6e1d5', borderLeft: statusColor ? `4px solid ${statusColor}` : '4px solid #e6e1d5', borderRadius: 3, overflow: 'hidden', opacity: isBuried ? 0.55 : 1 }}>
                  <button onClick={() => setOpenId(open ? null : c.id)} style={{ width: '100%', background: 'none', border: 'none', padding: '12px 16px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'inherit' }}>
                    <span>
                      <span style={{ fontFamily: "'Aleo', serif", fontSize: 18.5, fontStyle: 'normal', color: '#2b3742', fontWeight: 800 }}>{c.name}</span>
                      <span style={{ fontSize: 12, color: '#6e6757', marginLeft: 10 }}>({c.year}, {c.court})</span>
                      {c.bazelon && <span style={{ marginLeft: 8 }}><BazelonBadge /></span>}
                      {isBuried && <span style={{ fontSize: 11, color: '#34602f', marginLeft: 8 }}>· buried</span>}
                    </span>
                    <ChevronRight size={16} style={{ color: '#7c2d2d', transform: open ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                  </button>
                  {open && (
                    <div style={{ padding: '0 16px 16px 16px', fontFamily: "'Aleo', Georgia, serif", fontSize: 14, lineHeight: 1.6 }}>
                      <DetailRow label="Facts" content={c.facts} />
                      <DetailRow label="Issue" content={c.issue} />
                      <DetailRow label="Holding" content={c.holding} highlight />
                      <DetailRow label="Significance" content={c.significance} />
                      {c.elements?.length > 0 && (
                        <div style={{ marginTop: 10 }}>
                          <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7c2d2d', fontWeight: 600, marginBottom: 4 }}>Key Elements</div>
                          <ul style={{ margin: 0, paddingLeft: 20 }}>{c.elements.map((el, i) => <li key={i}>{el}</li>)}</ul>
                        </div>
                      )}
                      <div style={{ marginTop: 14 }}>
                        <BuryButton buried={isBuried} onClick={() => toggleBury('case:' + c.id)} label="Bury this case" />
                      </div>
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
      <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: highlight ? '#2b3742' : '#7c2d2d', fontWeight: 600, marginBottom: 3 }}>{label}</div>
      <div style={{ color: '#283038', fontWeight: highlight ? 500 : 400 }}>{content}</div>
    </div>
  );
}

// =====================================================================
// CONSTITUTIONAL LAW
// =====================================================================
function ConLawMode({ buried, toggleBury }) {
  const [open, setOpen] = useState(null);
  return (
    <div>
      <SectionHeader title="The Constitutional Amendments" sub="The Bill of Rights (1st–10th, 1791) originally bound only the federal government. Most were later applied to the states via selective incorporation through the 14th Amendment. Bury any you've locked in to drop them from Flashcards and the MCQ quiz." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 36 }}>
        {AMENDMENTS.map(a => {
          const isOpen = open === a.num;
          const isBuried = !!buried['amend:' + a.num];
          return (
            <div key={a.num} style={{ background: '#f5f2ea', border: '1px solid #e6e1d5', borderLeft: '4px solid #2b3742', borderRadius: 3, overflow: 'hidden', opacity: isBuried ? 0.55 : 1 }}>
              <button onClick={() => setOpen(isOpen ? null : a.num)} style={{ width: '100%', background: 'none', border: 'none', padding: '12px 16px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, fontFamily: 'inherit' }}>
                <span style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <span style={{ fontFamily: "'Aleo', serif", fontSize: 19, fontStyle: 'italic', fontWeight: 600, color: '#2b3742', minWidth: 46 }}>{a.num}</span>
                  <span style={{ fontFamily: "'Aleo', Georgia, serif", fontSize: 15, color: '#283038' }}>{a.short}{isBuried && <span style={{ fontSize: 11, color: '#34602f', marginLeft: 8 }}>· buried</span>}</span>
                </span>
                <ChevronRight size={16} style={{ color: '#7c2d2d', flexShrink: 0, transform: isOpen ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
              </button>
              {isOpen && (
                <div style={{ padding: '0 16px 16px 74px', fontFamily: "'Aleo', Georgia, serif", fontSize: 14, lineHeight: 1.6, color: '#283038' }}>
                  <p style={{ margin: '0 0 10px 0' }}>{a.detail}</p>
                  <div style={{ fontSize: 13, color: '#6e2626', background: '#f6e9e6', border: '1px solid #e0bdb8', borderRadius: 3, padding: '7px 11px', marginBottom: 12 }}>
                    <strong style={{ letterSpacing: '0.04em' }}>Incorporation:</strong> {a.incorp}
                  </div>
                  <BuryButton buried={isBuried} onClick={() => toggleBury('amend:' + a.num)} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <SectionHeader title="Core Constitutional Law Concepts" sub="Due process, equal protection, and the tiers of scrutiny that decide how hard the government's justification must work." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {CONLAW_CONCEPTS.map(c => {
          const isBuried = !!buried['conlaw:' + c.id];
          return (
            <div key={c.id} style={{ ...cardStyle, opacity: isBuried ? 0.55 : 1 }}>
              <h3 style={{ fontFamily: "'Aleo', serif", fontSize: 20, fontStyle: 'italic', fontWeight: 500, color: '#2b3742', margin: '0 0 8px 0' }}>{c.title}{isBuried && <span style={{ fontSize: 11, fontStyle: 'normal', color: '#34602f', marginLeft: 8 }}>· buried</span>}</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#283038', margin: '0 0 12px 0', fontFamily: "'Aleo', Georgia, serif" }}>{c.body}</p>
              <ul style={{ margin: '0 0 12px 0', paddingLeft: 20, fontFamily: "'Aleo', Georgia, serif", fontSize: 14, lineHeight: 1.7, color: '#3c4148' }}>
                {c.points.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
              <BuryButton buried={isBuried} onClick={() => toggleBury('conlaw:' + c.id)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SectionHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h2 style={{ fontFamily: "'Aleo', serif", fontSize: 26, fontStyle: 'italic', fontWeight: 500, color: '#2b3742', margin: '0 0 6px 0' }}>{title}</h2>
      {sub && <p style={{ fontSize: 13.5, color: '#6e6757', lineHeight: 1.6, margin: 0, fontFamily: "'Aleo', Georgia, serif", maxWidth: 760 }}>{sub}</p>}
    </div>
  );
}

// =====================================================================
// INSANITY DEFENSE
// =====================================================================
function InsanityMode({ buried, toggleBury }) {
  return (
    <div>
      <SectionHeader title="Evolution of the Insanity Defense" sub="The legal test for insanity has swung between cognition, volition, and causation for nearly two centuries. Each test is a reaction to the perceived overreach of the one before it." />

      {/* Timeline summary table */}
      <div style={{ ...cardStyle, padding: 0, overflow: 'hidden', marginBottom: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 130px', background: '#2b3742', color: '#ffffff', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'IBM Plex Mono', monospace" }}>
          <div style={{ padding: '10px 14px' }}>Test / Year</div>
          <div style={{ padding: '10px 14px' }}>Focus</div>
          <div style={{ padding: '10px 14px' }}>Type</div>
        </div>
        {INSANITY_TESTS.map((t, i) => (
          <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 130px', borderTop: '1px solid #e6e1d5', background: i % 2 ? '#f5f2ea' : '#ffffff', fontFamily: "'Aleo', Georgia, serif", fontSize: 13.5 }}>
            <div style={{ padding: '11px 14px' }}><div style={{ fontFamily: "'Aleo', serif", fontStyle: 'italic', color: '#2b3742', fontSize: 14.5 }}>{t.name}</div><div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#7c2d2d', marginTop: 2 }}>{t.year}</div></div>
            <div style={{ padding: '11px 14px', color: '#283038', lineHeight: 1.5 }}>{t.focus}</div>
            <div style={{ padding: '11px 14px' }}><span style={{ fontSize: 11.5, color: '#6e2626', background: '#f6e9e6', border: '1px solid #e0bdb8', borderRadius: 3, padding: '2px 8px' }}>{t.tag}</span></div>
          </div>
        ))}
      </div>

      {/* Detailed cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
        {INSANITY_TESTS.map(t => {
          const isBuried = !!buried['itest:' + t.id];
          return (
            <div key={t.id} style={{ ...cardStyle, opacity: isBuried ? 0.55 : 1 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
                <h3 style={{ fontFamily: "'Aleo', serif", fontSize: 21, fontStyle: 'italic', fontWeight: 500, color: '#2b3742', margin: 0 }}>{t.name}</h3>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, color: '#7c2d2d' }}>{t.year} · {t.tag}</span>
                {isBuried && <span style={{ fontSize: 11, color: '#34602f' }}>· buried</span>}
              </div>
              <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#283038', margin: '0 0 10px 0', fontFamily: "'Aleo', Georgia, serif" }}>{t.rule}</p>
              <div style={{ fontSize: 13, color: '#6e6757', fontFamily: "'Aleo', Georgia, serif", marginBottom: 12 }}>
                <div style={{ marginBottom: 4 }}><strong style={{ color: '#2b3742' }}>Origin:</strong> {t.origin}</div>
                <div><strong style={{ color: '#8b2c2c' }}>Criticism:</strong> {t.criticism}</div>
              </div>
              <BuryButton buried={isBuried} onClick={() => toggleBury('itest:' + t.id)} />
            </div>
          );
        })}
      </div>

      <SectionHeader title="The Insanity Defense Reform Act (1984)" sub="Passed in the wake of John Hinckley Jr.'s NGRI acquittal for the attempted assassination of President Reagan. It is the modern federal standard and dramatically narrowed the defense." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
        {IDRA_PROVISIONS.map((p, i) => {
          const isBuried = !!buried['idra:' + i];
          return (
            <div key={i} style={{ background: '#f5f2ea', border: '1px solid #e6e1d5', borderLeft: '3px solid #2b3742', borderRadius: 3, padding: 14, opacity: isBuried ? 0.55 : 1 }}>
              <div style={{ fontFamily: "'Aleo', serif", fontSize: 16, fontStyle: 'italic', fontWeight: 500, color: '#2b3742', marginBottom: 5 }}>{p.h}{isBuried && <span style={{ fontSize: 11, fontStyle: 'normal', color: '#34602f', marginLeft: 6 }}>· buried</span>}</div>
              <div style={{ fontSize: 13.5, lineHeight: 1.55, color: '#283038', fontFamily: "'Aleo', Georgia, serif", marginBottom: 10 }}>{p.t}</div>
              <BuryButton buried={isBuried} onClick={() => toggleBury('idra:' + i)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =====================================================================
// BASIC LAW CONCEPTS
// =====================================================================
function BasicLawMode({ buried, toggleBury }) {
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
          <h3 style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 500, color: '#7c2d2d', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.18em' }}>{cat}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {list.map(c => {
              const star = c.id === 'ohio_cst' || c.id === 'daubert';
              const isBuried = !!buried['basic:' + c.id];
              return (
                <div key={c.id} style={{ ...cardStyle, borderLeft: star ? '4px solid #7c2d2d' : '1px solid #dcd6c8', opacity: isBuried ? 0.55 : 1 }}>
                  <h4 style={{ fontFamily: "'Aleo', serif", fontSize: 20, fontStyle: 'italic', fontWeight: 500, color: '#2b3742', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {star && <span style={{ fontSize: 11, fontStyle: 'normal', background: '#7c2d2d', color: '#ffffff', borderRadius: 3, padding: '2px 7px', letterSpacing: '0.08em', fontFamily: "'IBM Plex Mono', monospace" }}>HIGH YIELD</span>}
                    {c.title}{isBuried && <span style={{ fontSize: 11, fontStyle: 'normal', color: '#34602f' }}>· buried</span>}
                  </h4>
                  <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#283038', margin: '0 0 12px 0', fontFamily: "'Aleo', Georgia, serif" }}>{c.body}</p>
                  <ul style={{ margin: '0 0 12px 0', paddingLeft: 20, fontFamily: "'Aleo', Georgia, serif", fontSize: 14, lineHeight: 1.7, color: '#3c4148' }}>
                    {c.points.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                  <BuryButton buried={isBuried} onClick={() => toggleBury('basic:' + c.id)} />
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
          <div style={{ marginLeft: 'auto', fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#6e6757' }}>{idx + 1} / {TERMS.length}</div>
        </div>
        <div onClick={() => setShowDef(s => !s)} style={{ ...cardStyle, minHeight: 280, display: 'flex', flexDirection: 'column', justifyContent: 'center', cursor: 'pointer' }}>
          <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7c2d2d', marginBottom: 12 }}>Define this term {!showDef && '(click to reveal)'}</div>
          <h2 style={{ fontFamily: "'Aleo', serif", fontSize: 32, fontWeight: 600, fontStyle: 'italic', margin: '0 0 18px 0', color: '#2b3742' }}>{t.term}</h2>
          {showDef && <p style={{ fontSize: 16, lineHeight: 1.6, margin: 0, fontFamily: "'Aleo', Georgia, serif", color: '#283038' }}>{t.def}</p>}
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
          style={{ padding: '8px 12px', fontFamily: 'inherit', fontSize: 14, border: '1px solid #cfc8b8', background: '#f5f2ea', borderRadius: 4, flex: 1, minWidth: 200, color: '#232a31' }} />
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#6e6757' }}>{filtered.length} of {TERMS.length}</span>
        <button onClick={() => { setStudyMode('quiz'); setOrder(TERMS.map((_, i) => i)); setIdx(0); setShowDef(false); }} style={btnPrimary}><GraduationCap size={14} /> Drill mode</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
        {filtered.map((t, i) => (
          <div key={i} style={{ background: '#f5f2ea', border: '1px solid #e6e1d5', borderLeft: '3px solid #7c2d2d', padding: 14, borderRadius: 3 }}>
            <div style={{ fontFamily: "'Aleo', serif", fontSize: 17, fontStyle: 'italic', fontWeight: 500, color: '#2b3742', marginBottom: 6 }}>{t.term}</div>
            <div style={{ fontSize: 13.5, lineHeight: 1.55, fontFamily: "'Aleo', Georgia, serif", color: '#283038' }}>{t.def}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =====================================================================
// FLASHCARDS
// =====================================================================
function FlashcardsMode({ progress, markCase, buried, toggleBury }) {
  const [deckId, setDeckId] = useState('cases');
  const [filter, setFilter] = useState('all');
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  const reset = () => { setIdx(0); setFlipped(false); };

  // Build the active deck as a normalized list of { key, front, sub, frontExtra, back, backHead }
  const deck = useMemo(() => {
    const seedShuffle = (arr) => {
      const a = [...arr]; let seed = shuffleSeed || 1;
      for (let i = a.length - 1; i > 0; i--) { seed = (seed * 9301 + 49297) % 233280; const j = Math.floor((seed / 233280) * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
      return a;
    };
    if (deckId === 'cases') {
      let list = CASES.filter(c => !buried['case:' + c.id]);
      if (filter === 'review') list = list.filter(c => progress[c.id] !== 'mastered');
      if (filter === 'unseen') list = list.filter(c => !progress[c.id]);
      if (CATEGORIES.includes(filter)) list = list.filter(c => c.category === filter);
      return seedShuffle(list.map(c => ({
        key: 'case:' + c.id, front: c.name, sub: c.category, frontExtra: `${c.court} · ${c.year}`, bazelon: c.bazelon,
        backHead: 'Holding', back: c.holding, backHead2: 'Significance', back2: c.significance,
      })));
    }
    const src = deckId === 'conlaw' ? CONLAW_DECK : deckId === 'insanity' ? INSANITY_DECK : BASICLAW_DECK;
    return seedShuffle(src.filter(d => !buried[d.key]).map(d => ({
      key: d.key, front: d.front, sub: d.sub, frontExtra: null, backHead: 'Answer', back: d.back,
    })));
  }, [deckId, filter, shuffleSeed, progress, buried]);

  const decks = [
    { id: 'cases', label: 'Cases', count: CASES.filter(c => !buried['case:' + c.id]).length },
    { id: 'conlaw', label: 'Con Law', count: CONLAW_DECK.filter(d => !buried[d.key]).length },
    { id: 'insanity', label: 'Insanity', count: INSANITY_DECK.filter(d => !buried[d.key]).length },
    { id: 'basiclaw', label: 'Basic Law', count: BASICLAW_DECK.filter(d => !buried[d.key]).length },
  ];

  const current = deck[idx];
  const advance = () => { setFlipped(false); setIdx(i => deck.length ? (i + 1) % deck.length : 0); };

  return (
    <div>
      <SubTabs tabs={decks} active={deckId} setActive={(id) => { setDeckId(id); setFilter('all'); reset(); }} />

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
        {deckId === 'cases' && (
          <select value={filter} onChange={(e) => { setFilter(e.target.value); reset(); }} style={selectStyle}>
            <option value="all">All Cases</option>
            <option value="unseen">Unseen Only</option>
            <option value="review">Needs Review</option>
            <optgroup label="By Category">{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</optgroup>
          </select>
        )}
        <button onClick={() => { setShuffleSeed(Math.random() * 10000); reset(); }} style={btnSecondary}><Shuffle size={14} /> Shuffle</button>
        <div style={{ marginLeft: 'auto', fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#6e6757' }}>{deck.length ? idx + 1 : 0} / {deck.length}</div>
      </div>

      {!current ? <EmptyState message="Every card here is buried. Restore some from the Progress tab or the reference tabs." /> : (
        <>
          <div onClick={() => setFlipped(f => !f)} style={{ ...cardStyle, minHeight: 320, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: flipped ? 'left' : 'center', cursor: 'pointer', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 16, right: 16, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7c2d2d' }}>{flipped ? 'Answer' : 'Click to flip'}</div>
            {!flipped ? (
              <div>
                <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7c2d2d', marginBottom: 12 }}>{current.sub}</div>
                <h2 style={{ fontFamily: "'Aleo', serif", fontSize: 42, fontWeight: 800, fontStyle: 'normal', margin: '0 0 8px 0', color: '#2b3742', lineHeight: 1.1, letterSpacing: '-0.01em' }}>{current.front}</h2>
                {current.frontExtra && <div style={{ fontSize: 14, color: '#6e6757' }}>{current.frontExtra}</div>}
                {current.bazelon && <div style={{ marginTop: 12 }}><BazelonBadge size="lg" /></div>}
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2b3742', marginBottom: 8, fontWeight: 600 }}>{current.backHead}</div>
                <p style={{ fontSize: 16, lineHeight: 1.6, margin: '0 0 16px 0', fontFamily: "'Aleo', Georgia, serif", color: '#283038', whiteSpace: 'pre-line' }}>{current.back}</p>
                {current.back2 && <>
                  <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7c2d2d', marginBottom: 6, fontWeight: 600 }}>{current.backHead2}</div>
                  <p style={{ fontSize: 14, lineHeight: 1.55, margin: 0, fontFamily: "'Aleo', Georgia, serif", color: '#4c5158', fontStyle: 'italic' }}>{current.back2}</p>
                </>}
              </div>
            )}
          </div>

          {flipped && (
            <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              <SelfAssessBtn label="Got it" color="#34602f" onClick={() => { markCase(current.key, 'mastered'); advance(); }} />
              <SelfAssessBtn label="Review" color="#8a5a1c" onClick={() => { markCase(current.key, 'reviewing'); advance(); }} />
              <SelfAssessBtn label="Missed" color="#8b2c2c" onClick={() => { markCase(current.key, 'unknown'); advance(); }} />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => { setFlipped(false); setIdx(i => (i - 1 + deck.length) % deck.length); }} style={btnSecondary}><ChevronLeft size={16} /> Previous</button>
            <button onClick={() => { toggleBury(current.key); setFlipped(false); setIdx(i => Math.min(i, deck.length - 2 < 0 ? 0 : deck.length - 2)); }} style={btnGhost} title="Hide this from study sets">
              <X size={13} /> Bury this
            </button>
            <button onClick={() => { setFlipped(false); setIdx(i => (i + 1) % deck.length); }} style={btnPrimary}>Next <ChevronRight size={16} /></button>
          </div>
        </>
      )}
    </div>
  );
}

// =====================================================================
// MCQ QUIZ — cases (all/by category) + optional all-content concept Qs
// =====================================================================
function QuizMode({ buried }) {
  const [domain, setDomain] = useState('cases'); // cases | conlaw | insanity | basiclaw | all
  const [catFilter, setCatFilter] = useState('all');

  const buildPool = (d, cat) => {
    if (d === 'cases') {
      let cs = CASES.filter(c => !buried['case:' + c.id]);
      if (CATEGORIES.includes(cat)) cs = cs.filter(c => c.category === cat);
      return shuffleArr(generateCaseQuestions(cs));
    }
    if (d === 'conlaw') return shuffleArr(generateConLawQuestions(buried));
    if (d === 'insanity') return shuffleArr(generateInsanityQuestions(buried));
    if (d === 'basiclaw') return shuffleArr(generateBasicLawQuestions(buried));
    return shuffleArr([
      ...generateCaseQuestions(CASES.filter(c => !buried['case:' + c.id])),
      ...generateConLawQuestions(buried), ...generateInsanityQuestions(buried), ...generateBasicLawQuestions(buried),
    ]);
  };

  const [questions, setQuestions] = useState(() => buildPool('cases', 'all'));
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const domains = [
    { id: 'cases', label: 'Cases' },
    { id: 'conlaw', label: 'Con Law' },
    { id: 'insanity', label: 'Insanity' },
    { id: 'basiclaw', label: 'Basic Law' },
    { id: 'all', label: '★ Everything' },
  ];

  const q = questions[idx];
  const submit = () => { if (selected === null) return; setAnswered(true); setScore(s => ({ correct: s.correct + (selected === q.correct ? 1 : 0), total: s.total + 1 })); };
  const next = () => { setSelected(null); setAnswered(false); setIdx(i => (i + 1) % questions.length); };
  const rebuild = (d, cat) => { setQuestions(buildPool(d, cat)); setIdx(0); setSelected(null); setAnswered(false); setScore({ correct: 0, total: 0 }); };
  const pickDomain = (d) => { setDomain(d); setCatFilter('all'); rebuild(d, 'all'); };

  return (
    <div>
      <SubTabs tabs={domains} active={domain} setActive={pickDomain} />

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
        {domain === 'cases' && (
          <select value={catFilter} onChange={(e) => { setCatFilter(e.target.value); rebuild('cases', e.target.value); }} style={selectStyle}>
            <option value="all">All Cases</option>
            <optgroup label="By Category">{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</optgroup>
          </select>
        )}
        <button onClick={() => rebuild(domain, catFilter)} style={btnSecondary}><RotateCcw size={14} /> New set</button>
      </div>

      {!q ? <EmptyState message="No questions in this set — everything here may be buried." /> : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: '#6e6757' }}>
              Question {idx + 1} / {questions.length}
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}>
              Score: <span style={{ color: '#34602f', fontWeight: 600 }}>{score.correct}</span><span style={{ color: '#6e6757' }}> / {score.total}</span>
              {score.total > 0 && <span style={{ marginLeft: 8, color: '#2b3742' }}>({Math.round(100 * score.correct / score.total)}%)</span>}
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ fontFamily: "'Aleo', serif", fontSize: 21, fontWeight: 500, margin: '0 0 22px 0', color: '#2b3742', lineHeight: 1.4, whiteSpace: 'pre-line' }}>{q.q}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {q.options.map((opt, i) => {
                const isSelected = selected === i, isCorrect = i === q.correct;
                let bg = '#f5f2ea', border = '#cfc8b8', color = '#283038';
                if (answered) { if (isCorrect) { bg = '#e2ecde'; border = '#34602f'; color = '#2c5226'; } else if (isSelected) { bg = '#f3dede'; border = '#8b2c2c'; color = '#5e1e1e'; } }
                else if (isSelected) { bg = '#f5f2ea'; border = '#2b3742'; }
                return (
                  <button key={i} onClick={() => !answered && setSelected(i)} disabled={answered}
                    style={{ textAlign: 'left', padding: '14px 16px', background: bg, border: `1.5px solid ${border}`, color, fontFamily: "'Aleo', Georgia, serif", fontSize: 15, lineHeight: 1.5, borderRadius: 4, cursor: answered ? 'default' : 'pointer', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <span style={{ flexShrink: 0, width: 26, height: 26, borderRadius: '50%', border: `1.5px solid ${border}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, background: answered && isCorrect ? '#34602f' : (answered && isSelected ? '#8b2c2c' : 'transparent'), color: answered && (isCorrect || isSelected) ? '#fff' : border, fontFamily: "'IBM Plex Mono', monospace" }}>
                      {answered ? (isCorrect ? <Check size={14} /> : (isSelected ? <X size={14} /> : String.fromCharCode(65 + i))) : String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
            {answered && (
              <div style={{ marginTop: 20, padding: 16, background: '#f5f2ea', borderLeft: '3px solid #7c2d2d', borderRadius: 2 }}>
                <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7c2d2d', fontWeight: 600, marginBottom: 6 }}>Explanation</div>
                <div style={{ fontSize: 14, lineHeight: 1.6, fontFamily: "'Aleo', Georgia, serif", color: '#283038' }}>{q.explanation}</div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18 }}>
            <button onClick={next} style={btnSecondary}>Skip <ChevronRight size={14} /></button>
            {!answered
              ? <button onClick={submit} disabled={selected === null} style={selected === null ? btnDisabled : btnPrimary}>Submit answer</button>
              : <button onClick={next} style={btnPrimary}>Next question <ChevronRight size={16} /></button>}
          </div>
        </>
      )}
    </div>
  );
}

// =====================================================================
// PROGRESS DASHBOARD
// =====================================================================
// =====================================================================
// CASE BASICS QUIZ — category / court / year only
// =====================================================================
function CaseBasicsMode({ buried }) {
  const [kind, setKind] = useState('mixed');
  const [questions, setQuestions] = useState(() => generateBasicsQuestions('mixed', buried));
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const kinds = [
    { id: 'mixed', label: 'Mixed' },
    { id: 'year', label: 'Year' },
    { id: 'court', label: 'Court' },
    { id: 'category', label: 'Category' },
  ];

  const q = questions[idx];
  const submit = () => { if (selected === null) return; setAnswered(true); setScore(s => ({ correct: s.correct + (selected === q.correct ? 1 : 0), total: s.total + 1 })); };
  const next = () => { setSelected(null); setAnswered(false); setIdx(i => (i + 1) % questions.length); };
  const rebuild = (k) => { setQuestions(generateBasicsQuestions(k, buried)); setIdx(0); setSelected(null); setAnswered(false); setScore({ correct: 0, total: 0 }); };
  const pick = (k) => { setKind(k); rebuild(k); };

  return (
    <div>
      <p style={{ fontSize: 13, color: '#6e6757', fontStyle: 'italic', margin: '0 0 14px 0', lineHeight: 1.6 }}>
        Rapid recall of the bare facts — what court, what year, what topic area. Great for locking in the details that are easy to blank on under pressure.
      </p>
      <SubTabs tabs={kinds} active={kind} setActive={pick} />

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
        <button onClick={() => rebuild(kind)} style={btnSecondary}><RotateCcw size={14} /> New set</button>
      </div>

      {!q ? <EmptyState message="No cases available — they may all be buried." /> : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: '#6e6757' }}>Question {idx + 1} / {questions.length}</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}>
              Score: <span style={{ color: '#34602f', fontWeight: 600 }}>{score.correct}</span><span style={{ color: '#6e6757' }}> / {score.total}</span>
              {score.total > 0 && <span style={{ marginLeft: 8, color: '#2b3742' }}>({Math.round(100 * score.correct / score.total)}%)</span>}
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ fontFamily: "'Aleo', serif", fontSize: 21, fontWeight: 500, margin: '0 0 22px 0', color: '#2b3742', lineHeight: 1.4 }}>{q.q}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {q.options.map((opt, i) => {
                const isSelected = selected === i, isCorrect = i === q.correct;
                let bg = '#f5f2ea', border = '#cfc8b8', color = '#283038';
                if (answered) { if (isCorrect) { bg = '#e2ecde'; border = '#34602f'; color = '#2c5226'; } else if (isSelected) { bg = '#f3dede'; border = '#8b2c2c'; color = '#5e1e1e'; } }
                else if (isSelected) { bg = '#f5f2ea'; border = '#2b3742'; }
                return (
                  <button key={i} onClick={() => !answered && setSelected(i)} disabled={answered}
                    style={{ textAlign: 'left', padding: '14px 16px', background: bg, border: `1.5px solid ${border}`, color, fontFamily: "'Aleo', Georgia, serif", fontSize: 15, lineHeight: 1.5, borderRadius: 4, cursor: answered ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ flexShrink: 0, width: 26, height: 26, borderRadius: '50%', border: `1.5px solid ${border}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, background: answered && isCorrect ? '#34602f' : (answered && isSelected ? '#8b2c2c' : 'transparent'), color: answered && (isCorrect || isSelected) ? '#fff' : border, fontFamily: "'IBM Plex Mono', monospace" }}>
                      {answered ? (isCorrect ? <Check size={14} /> : (isSelected ? <X size={14} /> : String.fromCharCode(65 + i))) : String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
            {answered && (
              <div style={{ marginTop: 20, padding: 16, background: '#f5f2ea', borderLeft: '3px solid #7c2d2d', borderRadius: 2 }}>
                <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7c2d2d', fontWeight: 600, marginBottom: 6 }}>Answer</div>
                <div style={{ fontSize: 14, lineHeight: 1.6, fontFamily: "'Aleo', Georgia, serif", color: '#283038' }}>{q.explanation}</div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18 }}>
            <button onClick={next} style={btnSecondary}>Skip <ChevronRight size={14} /></button>
            {!answered
              ? <button onClick={submit} disabled={selected === null} style={selected === null ? btnDisabled : btnPrimary}>Submit answer</button>
              : <button onClick={next} style={btnPrimary}>Next question <ChevronRight size={16} /></button>}
          </div>
        </>
      )}
    </div>
  );
}

// =====================================================================
// PROGRESS DASHBOARD
// =====================================================================
function ProgressMode({ progress, resetProgress, buried, toggleBury, unburyAll }) {
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
        <BigStat label="Mastered" value={stats.mastered} color="#34602f" />
        <BigStat label="Reviewing" value={stats.reviewing} color="#8a5a1c" />
        <BigStat label="Missed" value={stats.unknown} color="#8b2c2c" />
        <BigStat label="Untouched" value={stats.untouched} color="#6e6757" />
      </div>

      <h3 style={{ fontFamily: "'Aleo', serif", fontSize: 22, fontStyle: 'italic', fontWeight: 500, color: '#2b3742', margin: '24px 0 14px 0' }}>Progress by category</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Object.entries(byCategory).map(([cat, s]) => {
          const pct = (s.mastered / s.total) * 100;
          return (
            <div key={cat} style={{ background: '#f5f2ea', padding: '12px 16px', border: '1px solid #e6e1d5', borderRadius: 3 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontFamily: "'Aleo', serif", fontSize: 15, fontStyle: 'italic', color: '#2b3742' }}>{cat}</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#6e6757' }}>{s.mastered} / {s.total}</span>
              </div>
              <div style={{ height: 6, background: '#e6e1d5', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #34602f, #4f7d45)', transition: 'width 0.3s' }} />
              </div>
            </div>
          );
        })}
      </div>

      {needsReview.length > 0 && (
        <>
          <h3 style={{ fontFamily: "'Aleo', serif", fontSize: 22, fontStyle: 'italic', fontWeight: 500, color: '#2b3742', margin: '32px 0 14px 0' }}>Cases flagged for review ({needsReview.length})</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {needsReview.map(c => (
              <span key={c.id} style={{ padding: '6px 12px', background: progress[c.id] === 'unknown' ? '#f3dede' : '#f6e9e6', border: `1px solid ${progress[c.id] === 'unknown' ? '#8b2c2c' : '#8a5a1c'}`, borderRadius: 3, fontSize: 13, fontFamily: "'Aleo', serif", fontStyle: 'normal', fontWeight: 700, color: progress[c.id] === 'unknown' ? '#5e1e1e' : '#6e2626' }}>{c.name}</span>
            ))}
          </div>
        </>
      )}

      {Object.keys(buried || {}).length > 0 && (() => {
        const labelFor = (key) => {
          const [kind, id] = key.split(':');
          if (kind === 'case') return (CASES.find(c => c.id === id) || {}).name || key;
          if (kind === 'amend') return `${id} Amendment`;
          if (kind === 'conlaw') return (CONLAW_CONCEPTS.find(c => c.id === id) || {}).title || key;
          if (kind === 'itest') return (INSANITY_TESTS.find(t => t.id === id) || {}).name || key;
          if (kind === 'idra') return (IDRA_PROVISIONS[+id] || {}).h || key;
          if (kind === 'basic') return (BASIC_LAW.find(c => c.id === id) || {}).title || key;
          return key;
        };
        const keys = Object.keys(buried);
        return (
          <>
            <h3 style={{ fontFamily: "'Aleo', serif", fontSize: 22, fontStyle: 'italic', fontWeight: 500, color: '#2b3742', margin: '32px 0 6px 0' }}>Buried — hidden from study sets ({keys.length})</h3>
            <p style={{ fontSize: 13, color: '#6e6757', margin: '0 0 14px 0', fontFamily: "'Aleo', Georgia, serif" }}>These are skipped in Oral Sim, Flashcards, and the MCQ quiz. Click any to bring it back.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
              {keys.map(k => (
                <button key={k} onClick={() => toggleBury(k)} title="Restore"
                  style={{ padding: '6px 12px', background: '#e2ecde', border: '1px solid #cde0c6', borderRadius: 3, fontSize: 13, fontFamily: "'Aleo', serif", fontStyle: 'italic', color: '#34602f', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <RotateCcw size={12} /> {labelFor(k)}
                </button>
              ))}
            </div>
            <button onClick={() => { if (confirm('Restore all buried items?')) unburyAll(); }} style={btnGhost}>Restore all</button>
          </>
        );
      })()}

      <div style={{ marginTop: 36, paddingTop: 20, borderTop: '1px solid #dcd6c8' }}>
        <button onClick={() => { if (confirm('Reset all progress? This cannot be undone.')) resetProgress(); }} style={{ ...btnSecondary, color: '#8b2c2c', borderColor: '#8b2c2c' }}>
          <RotateCcw size={14} /> Reset all progress
        </button>
      </div>
    </div>
  );
}

function BigStat({ label, value, color }) {
  return (
    <div style={{ background: '#f5f2ea', border: '1px solid #e6e1d5', borderTop: `3px solid ${color}`, padding: 18, borderRadius: 3, textAlign: 'center' }}>
      <div style={{ fontSize: 38, fontWeight: 700, color, lineHeight: 1, fontFamily: "'Aleo', serif" }}>{value}</div>
      <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6e6757', marginTop: 8 }}>{label}</div>
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
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 56, fontWeight: 500, color: '#ffffff', lineHeight: 1, letterSpacing: '-0.02em' }}>
        {String(value).padStart(2, '0')}
      </div>
      <div style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#b9b2a0', marginTop: 10 }}>{label}</div>
    </div>
  );

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #2b3742 0%, #1c252c 100%)', borderRadius: 8, padding: '40px 28px', textAlign: 'center', boxShadow: '0 8px 30px rgba(20,41,63,0.25)' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#9fb0bb', marginBottom: 6 }}>
          {past ? 'The day is here' : 'Time until the Landmark Final Exam'}
        </div>
        <div style={{ fontFamily: "'Aleo', serif", fontStyle: 'italic', fontSize: 22, color: '#ffffff', marginBottom: 28 }}>
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

        {past && <div style={{ marginTop: 20, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#9fb0bb' }}>(elapsed since start)</div>}
      </div>

      <div style={{ ...cardStyle, marginTop: 18, textAlign: 'center' }}>
        <Sparkles size={22} style={{ color: '#7c2d2d', margin: '0 auto 8px', display: 'block' }} />
        <p style={{ fontFamily: "'Aleo', serif", fontStyle: 'italic', fontSize: 19, color: '#2b3742', margin: '0 0 6px 0' }}>{line}</p>
        {!past && (
          <>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, color: '#6e6757', marginBottom: 12 }}>
              {days} days · {hours} hrs · {mins} min · {secs} sec to go
            </div>
            <div style={{ height: 8, background: '#e6e1d5', borderRadius: 4, overflow: 'hidden', maxWidth: 460, margin: '0 auto' }}>
              <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #7c2d2d, #9a3a3a)', transition: 'width 0.5s' }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Separator() {
  return <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 48, color: '#4a5a66', lineHeight: 1, alignSelf: 'flex-start', marginTop: 2 }}>:</div>;
}

// =====================================================================
// UTILITIES + SHARED STYLES
// =====================================================================
function BazelonBadge({ size = 'sm' }) {
  return (
    <span title="Opinion authored by Judge David L. Bazelon (D.C. Circuit)"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: size === 'lg' ? 12 : 10.5, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.04em', color: '#7c2d2d', background: '#f6e9e6', border: '1px solid #e0bdb8', borderRadius: 3, padding: size === 'lg' ? '3px 9px' : '2px 7px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
      <Gavel size={size === 'lg' ? 13 : 11} /> Bazelon opinion
    </span>
  );
}

function BuryButton({ buried, onClick, label = 'Bury' }) {
  return (
    <button onClick={onClick} style={{ ...btnGhost, color: buried ? '#34602f' : '#7c2d2d', borderColor: buried ? '#cde0c6' : '#e0bdb8', background: buried ? '#e2ecde' : 'transparent' }}
      title={buried ? 'Bring this back into your study sets' : 'Hide this from study sets'}>
      {buried ? <><RotateCcw size={12} /> Buried — restore</> : <><X size={12} /> {label}</>}
    </button>
  );
}

function SubTabs({ tabs, active, setActive }) {
  return (
    <div style={{ display: 'inline-flex', gap: 4, padding: 4, background: '#f5f2ea', border: '1px solid #e6e1d5', borderRadius: 6, marginBottom: 20, flexWrap: 'wrap' }}>
      {tabs.map(t => {
        const on = active === t.id;
        return (
          <button key={t.id} onClick={() => setActive(t.id)}
            style={{ background: on ? '#2b3742' : 'transparent', color: on ? '#fff' : '#4c5158', border: 'none',
              padding: '7px 14px', fontSize: 13, fontFamily: "'Aleo', serif", fontStyle: on ? 'italic' : 'normal',
              fontWeight: on ? 600 : 400, borderRadius: 4 }}>
            {t.label}{t.count != null && <span style={{ opacity: 0.7, marginLeft: 6, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>{t.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div style={{ ...cardStyle, textAlign: 'center', padding: 60 }}>
      <Sparkles size={32} style={{ color: '#7c2d2d', margin: '0 auto 12px', display: 'block' }} />
      <p style={{ fontFamily: "'Aleo', serif", fontStyle: 'italic', fontSize: 16, color: '#6e6757', margin: 0 }}>{message}</p>
    </div>
  );
}

const cardStyle = {
  background: '#ffffff',
  border: '1px solid #dcd6c8',
  padding: 28,
  borderRadius: 4,
  boxShadow: '0 2px 12px rgba(26, 22, 18, 0.04), 0 1px 3px rgba(26, 22, 18, 0.06)',
};

const selectStyle = {
  padding: '8px 12px',
  fontFamily: 'inherit',
  fontSize: 13,
  border: '1px solid #cfc8b8',
  background: '#f5f2ea',
  color: '#232a31',
  borderRadius: 4,
};

const btnPrimary = {
  background: '#2b3742', color: '#ffffff', border: '1.5px solid #2b3742',
  padding: '9px 16px', fontSize: 14, fontFamily: "'Aleo', serif", fontStyle: 'italic',
  borderRadius: 3, display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'all 0.15s',
};

const btnSecondary = {
  background: 'transparent', color: '#2b3742', border: '1.5px solid #2b3742',
  padding: '9px 16px', fontSize: 14, fontFamily: "'Aleo', serif",
  borderRadius: 3, display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'all 0.15s',
};

const btnDisabled = { ...btnPrimary, background: '#cfc8b8', borderColor: '#cfc8b8', cursor: 'not-allowed' };

const btnGhost = {
  background: 'transparent', color: '#7c2d2d', border: '1px solid #cfc8b8',
  padding: '6px 12px', fontSize: 12, fontFamily: 'inherit',
  borderRadius: 3, display: 'inline-flex', alignItems: 'center', gap: 5,
};



