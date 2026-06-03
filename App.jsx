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
    significance: "Addiction = illness, not crime; punishing addiction is cruel and unusual. States can establish compulsory treatment. States can punish status that is related to illegal conduct.",
    elements: ["Status vs. conduct","Addiction = illness","8th Amendment cruel and unusual"] },
  { id: "powell", name: "Powell v. Texas", year: 1968, court: "SCOTUS", category: "Drugs & Specific Intent",
    facts: "Defendant charged with public drunkenness; asserted that his chronic alcoholism caused him to be drunk in public; cited cruel and unusual punishment.",
    issue: "Does the 14th amendment prohibit states from criminalizing behavior that is non-volitional because of (or heavily influenced by) a disease or is doing so akin to punishing the status of having a disease?",
    holding: "No - *Robinson* made punishing disease status unconstitutional only, and convicting Powell was legitimate because he was being punished for conduct.",
    significance: "States can impose criminal sanctions for public behavior that creates health and safety hazards; did not believe alcoholics could not control their behavior. Alcoholism = disease; punishment unfair.",
    elements: ["Punishes conduct, not status","States may regulate behavior even if illness-driven"] },
  { id: "dusky", name: "Dusky v. U.S.", year: 1960, court: "SCOTUS", category: "Competence to Stand Trial",
    facts: "Schizophrenic defendant convicted of kidnapping and rape; competency challenged.",
    issue: "What is the appropriate legal standard for competence to stand trial?",
    holding: "Rational and factual understanding of proceedings against him Ability to consult with his lawyer with a reasonable degree of rational understanding Reversed, remanded to lower court to apply new standard.",
    significance: "Foundational two-prong competence standard. Still the governing federal test.",
    elements: ["Rational understanding of proceedings","Factual understanding of proceedings","Ability to consult with counsel rationally"] },
  { id: "wilson", name: "Wilson v. U.S.", year: 1968, court: "D.C. Cir.", category: "Competence to Stand Trial",
    facts: "Convicted for carjacking, robbing a pharmacy; fled police and hit a tree; Wilson was unconscious for three weeks; total amnesia for offense; found CST in spite of amnesia.",
    issue: "Does amnesia = incompetence? Did his amnesia deprive him on fair trial and effective assistance of counsel (5th and 6th amendments)?",
    holding: "No per se rule. Remanded with factors: effect on assisting counsel/testifying; strength of evidence; whether evidence can be extrinsically reconstructed.",
    significance: "Judges should consider extent to which amnesia affected the defendant's ability to assist counsel and testify. Also, the strength of evidence and extent to which evidence can be extrinsically reconstructed. Lack of factual understanding of offense renders one incompetent because they can't provide information to their attorney.",
    elements: ["Effect on assisting counsel","Effect on testifying","Strength of extrinsic evidence","Ability to reconstruct evidence"] },
  { id: "jackson", name: "Jackson v. Indiana", year: 1972, court: "SCOTUS", category: "Competence to Stand Trial",
    facts: "Deaf, intellectually disabled man stole purses with contents amounting to less than $10. Found ISTU; held in psychiatric hospital indefinitely.",
    issue: "Due process and equal protection under 14th; cruel and unusual under 8th.",
    holding: "No. Held only for a reasonable period to determine restoration potential. If unrestorable, must release or civilly commit. Violates 14th Amendment DP and EP.",
    significance: "Equal protection: if not criminally charged, would be subject to more lenient commitment and release standards Sub due process: without dangerousness, cannot be held longer than necessary to determine or attain competency.",
    elements: ["Reasonable period only","If unrestorable → release or civil commit","Cannot indefinitely hold based on IST alone"] },
  { id: "riggins", name: "Riggins v. Nevada", year: 1992, court: "SCOTUS", category: "Competence to Stand Trial",
    facts: "Arrested for murder; prescribed AP's by psychiatrist; motioned to suspend forced medication until end of trial; asserted due process violation; motioned denied and Riggins sentenced to death.",
    issue: "Was the forced administration of antipsychotics a violation of amendment 6 (right to fair trial) and amendment 14 (right to due process)?",
    holding: "Yes — without showing of medical appropriateness and consideration of less restrictive alternatives, forced meds violate due process.",
    significance: "If less restrictive alternatives were not proposed, and medical appropriateness was not established, substantive due process was not satisfied, and trial was unfair. *Washington v. Harper* required that justification and medical appropriateness must be established prior to medicating a convicted prisoner.",
    elements: ["Medical appropriateness","Less restrictive alternatives","Essential for safety or fair trial"] },
  { id: "godinez", name: "Godinez v. Moran", year: 1993, court: "SCOTUS", category: "Competence to Stand Trial",
    facts: "Charged with first degree murder for killing wife and bartenders in a saloon; found CST by 2 psychiatrists but appeared depressed; Moran decided he wanted to plead guilty and represent self; sentenced to death. Filed writ; appealed to SC.",
    issue: "Is there a different standard for CST (re: Dusky) vs competence to plead guilty or waive right to counsel?",
    holding: "No — same standard as Dusky. But waiver must also be knowing, voluntary, and intelligent.",
    significance: "Standard is same as Dusky; courts should conduct a hearing to determine if someone is competent to plead guilty or waive counsel; a waiver of constitutional rights should be knowing, voluntary, and intelligent.",
    elements: ["Same as Dusky standard","Plus knowing/voluntary/intelligent waiver"] },
  { id: "cooper", name: "Cooper v. Oklahoma", year: 1996, court: "SCOTUS", category: "Competence to Stand Trial",
    facts: "Charged with murder of old man during a robbery; CST raised 5x but not proved incompetence by clear and convincing evidence; Cooper convicted and sentenced to death.",
    issue: "Does the 14th amendment's due process clause allow a state to require a criminal defendant to prove incompetence to stand trial by a standard of clear and convincing evidence?",
    holding: "Reversed; remanded; OK must use preponderance standard; the higher burden of proof violates substantive due process.",
    significance: "Competence should be presumed; use preponderance standard to prove IST; requiring a defendant to prove incompetence by clear and convincing evidence violates fundamental fairness because one who is found competent erroneously offends the fairness of the justice system itself. *Addington v. Texas* - state must justify civil commitment through clear and convincing.",
    elements: ["Competence presumed","Defendant burden ≤ preponderance","Higher burden violates due process"] },
  { id: "sell", name: "Sell v. U.S.", year: 2003, court: "SCOTUS", category: "Competence to Stand Trial",
    facts: "Sell (a dentist) charged with fraud and attempted murder; found IST and committed for restoration; refused AP's; forcibly medicated; appealed to SC.",
    issue: "May the government forcibly medicate a non-dangerous defendant solely to restore competence?",
    holding: "Forced meds are constitutional if meets strict Sell criteria. Before invoking Sell, consider dangerousness and incompetence to refuse medication first.",
    significance: "Sell criteria: 1) treatment is medically appropriate, 2) there is an important govt interest, 3) forced meds will further that interest, 4) forced meds is necessary to further that interest (least restrictive). Majority cited: • *Washington v. Harper*: a prison inmate could be forcibly medicated if the inmate is dangerous and the treatment is in their medical interest • *Riggins v. Nevada*: a pre-trial detainee can be forcibly medication if it is medically appropriate to do so, the doing so would further an important state interest (such as fair trial) Sell's relation to these two: • It limits what Harper permitted (danger-based medication) •It tightens the standards in Riggins (medication during trial) •It establishes a new, more protective standard for situations where the government wants to medicate only to make someone competent for trial, without any immediate danger So, Sell is the most restrictive and rights-protective of the three, applying the strictest due process standards.",
    elements: ["Important government interest","Substantially furthers that interest","Necessary (no less intrusive alternative)","Medically appropriate"] },
  { id: "edwards", name: "Indiana v. Edwards", year: 2008, court: "SCOTUS", category: "Competence to Stand Trial",
    facts: "Charged with attempted murder, battery, theft for trying to steal shoes at a mall; found IST but restored; asked to proceed pro se; denied pro se request; convicted.",
    issue: "If found CST, can the state deem someone IC to go pro se, despite 6th amendment right to self-representation?",
    holding: "Constitution permits state to limit right to self-representation if the defendant lacks the mental capacity to conduct defense.",
    significance: "The 6th amendment (and 14th) protects the right to self-representation (*Faretta v. California*), but waiving this right must be voluntary and intelligent. A related case (*Godinez v. Moran*) ruled that competence to waive the right to counsel is the same as competence to represent oneself. To distinguish it from Godinez, the Court emphasized the state's interest in maintaining the dignity, fairness, and integrity of the trial process and the Faretta right can be limited to facilitate this. Thus, the Court ruled that the Constitution allows states to set a higher standard for self-representation than for competence to stand trial. •Faretta established an absolute right to self-representation once a defendant is competent to stand trial •There is no constitutional basis for distinguishing between competence to stand trial and competence to represent oneself •This decision waters down a fundamental right and grants too much discretion to trial judges because a new legal standard of competence to represent oneself was not clarified of its components.",
    elements: ["CST does not = competent to self-represent","States MAY (not must) require higher standard","Preserves trial dignity/fairness"] },
  { id: "alford", name: "North Carolina v. Alford", year: 1970, court: "SCOTUS", category: "Defendant's Rights",
    facts: "Defendant pled guilty to murder to avoid death penalty, but maintained innocence.",
    issue: "Can a court accept a guilty plea from a defendant who maintains innocence, if the plea is made voluntarily and intelligently with an understanding of the consequences?",
    holding: "The Constitution does not bar a criminal defendant from pleading guilty while protesting innocence, if the plea represents a rational choice and is made knowingly and voluntarily considering the circumstances and evidence.",
    significance: "Key factor is whether plea is the result of free will and understanding of consequences. *Alford plea* - guilty plea without admission of guilt.",
    elements: ["Voluntary","Intelligent","Understanding of consequences","Strong factual basis for guilt"] },
  { id: "connelly", name: "Colorado v. Connelly", year: 1986, court: "SCOTUS", category: "Defendant's Rights",
    facts: "Mentally ill man confessed w/o police coercion; trial court suppressed confession.",
    issue: "Does admitting a confession violate the Due Process Clause if it is the product of the defendant's mental illness, even absent any police coercion?",
    holding: "No. Coercive police activity is a necessary predicate to finding a confession involuntary.",
    significance: "Internal compulsion ≠ involuntariness without state action.",
    elements: ["Police coercion required","Mental illness alone insufficient","State action necessary"] },
  { id: "frye", name: "Frye v. U.S.", year: 1923, court: "D.C. Cir.", category: "Expert Witness",
    facts: "Frye convicted of murder; lie detector evidence excluded.",
    issue: "Standard for admissibility of novel scientific evidence?",
    holding: "Affirmed exclusion of lie detector evidence; test had not yet gained \"general acceptance\".",
    significance: "Frye standard — still used in some states (NY, CA, others).",
    elements: ["General acceptance","Relevant scientific community"] },
  { id: "daubert", name: "Daubert v. Merrell Dow", year: 1993, court: "SCOTUS", category: "Expert Witness",
    facts: "Children born with severe birth defects; sued company; expert published affidavit showing no link between Bendectin and birth defects; plaintiffs submitted reanalysis of studies finding a link.",
    issue: "What standard governs admissibility of expert witness testimony?",
    holding: "Use Federal Rule of Evidence 702, not Frye. Federal Rule of Evidence 702 allows expert testimony if: •The expert is qualified, •The testimony is helpful to the trier of fact, •The testimony is based on sufficient facts or data, •It is the product of reliable principles and methods, and •The expert has reliably applied those methods to the facts. Vacated and remanded to lower court to re-assess using new standards for admissibility.",
    significance: "When trial judges are deciding what to admit, consider: 1. Whether the theory or technique can be (and has been) tested, 2. Whether it has been subjected to peer review and publication, 3. The known or potential error rate, 4. The existence of standards, 5. Whether it has general acceptance in the field. Cross examination and adversarial process can challenge evidence. \"Daubert Standard\" - judge as gatekeeper.",
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
    holding: "A defendant is legally insane if, at the time of the act, they were laboring under: 1. A defect of reason 2. Caused by a disease of the mind 3. Such that they either: a. Did not know the nature and quality of the act, or b. Did not know what they were doing was wrong.",
    significance: "Foundational cognitive-only test. Adopted broadly in U.S.",
    elements: ["Defect of reason","Disease of the mind","Didn't know nature/quality of act","Didn't know act was wrong"] },
  { id: "durham", name: "Durham v. U.S.", year: 1954, court: "D.C. Cir.", category: "Insanity Defense",
    bazelon: true,
    facts: "Mentally ill burglar; M'Naghten and irresistible impulse rule applied; trial court rejected insanity defense and said there wasn't enough evidence to outweigh presumption of sanity; appealed NGRI standard used and argued burden of proof is on prosecution to prove sanity.",
    issue: "Should the M'Naghten \"right/wrong\" test and irresistible impulse test remain the standard for determining legal insanity in the D.C. Circuit? When there is a question of a defendant's sanity, who has the burden of proof?",
    holding: "Overturned and remanded for a new trial. The appeals court wrote that the law presumes a person is sane, and once insanity is considered, the burden of production by the defense is met and the burden of persuasion shifts to the prosecution to show sanity beyond a reasonable doubt. The DC Court also made a new rule for criminal responsibility - the Durham Rule.",
    significance: "\"An accused is not criminally responsible if his unlawful act was the product of mental disease or mental defect.\" • \"Mental disease or defect\" was to be defined by medical experts, not the courts. • Focus shifted from strictly cognitive tests (like M'Naghten) to whether the mental illness actually caused the crime (\"product test\"). Product test (causal link).",
    elements: ["Product of mental disease or defect","Causal link required"] },
  { id: "washington_us", name: "Washington v. U.S.", year: 1967, court: "D.C. Cir.", category: "Insanity Defense",
    bazelon: true,
    facts: "Washington convicted of rape, robbery, assault; used insanity defense unsuccessfully.",
    issue: "How to apply \"product test\"? Should experts be permitted to testify on ultimate issue?",
    holding: "The conviction was affirmed. Psychiatrists must not testify on ultimate issue in insanity cases. The appeals court also developed guidelines for psychiatric expert witness testimony.",
    significance: "The M'Naghten test allowed for a psychiatrist to make a moral judgement r/t the defendant's ability to know right from wrong, putting too much emphasis on the expert's opinion. The Durham rule also posed the same problem (because psychiatrists would comment on if the offense was a \"product\" of their mental disease or defect); concern was that psychiatrists become the \"thirteenth juror\". Psychiatrists should explain how the defendant's disease or defect relates to his alleged offense, that is, how the development, adaptation, and functioning of the defendant's behavioral processes may have influenced his conduct, but psychiatrists may not speak directly in terms of product or even result or cause. Also, experts should communicate meaning to jury clearly and simply.",
    elements: ["No ultimate-issue testimony","Explain dynamic relationship","Communicate clearly to jury"] },
  { id: "frendak", name: "Frendak v. U.S.", year: 1979, court: "D.C. Cir.", category: "Insanity Defense",
    facts: "Frendak murdered a co-worker; fled country; declined insanity plea; insanity defense imposed; found NGRI.",
    issue: "Can a court impose an insanity defense on a competent, unwilling defendant?",
    holding: "A trial judge cannot impose an insanity defense on someone CST, if the defendant knowingly and willingly chooses to waive it. Judge must also investigate if the waiver was made intelligently and voluntarily. Uncertain in Frendak's case, so remanded for addtl proceedings.",
    significance: "Simply determining that the defendant is competent to stand trial does not automatically prove that they can validly reject an insanity defense - hearing must be conducted. There are legitimate reasons for refusing an insanity defense: a defendant may think an insanity acquittal could lead to longer confinement than a prison sentence, they may object to psychiatric hospitalization because they prefer the environment of prison instead, they may want to avoid the social stigma associated with an insanity verdict, or feel that being found insane undermines their beliefs.",
    elements: ["CST","Knowing waiver","Intelligent waiver","Voluntary waiver"] },
  { id: "clark", name: "Clark v. Arizona", year: 2006, court: "SCOTUS", category: "Insanity Defense",
    facts: "Schizophrenic defendant shot and killed police officer; AZ law had knowledge of right from wrong only (not nature and quality of act), and experts could not provide evidence that rebuts prosecution's proof of mens rea.",
    issue: "Does a narrow definition of insanity violate 14th due process? Does restriction on expert testimony violate 14th due process?",
    holding: "No - states can define insanity and restrict mental illness evidence.",
    significance: "Courts are not constitutionally required to adopt a single definition of insanity and can exclude what they want.",
    elements: ["No constitutional requirement of full test","States may restrict mens rea evidence"] },
  { id: "kahler", name: "Kahler v. Kansas", year: 2020, court: "SCOTUS", category: "Insanity Defense",
    facts: "Kahler killed wife, daughters and claimed his depression was the cause. KS law had cognitive incapacity only; not moral incapacity (inability to tell right from wrong).",
    issue: "Does the Due Process Clause require states to adopt an insanity defense when a defendant, due to mental illness, could not distinguish right from wrong (the \"moral incapacity\" test)?",
    holding: "No. Due process does not require states to adopt a moral-incapacity insanity test. States have discretion to define and limit criminal liability, including the form of insanity defenses they allow.",
    significance: "Court found no consistent, historical consensus favoring the moral-incapacity version of the insanity defense. Various legal traditions and state statutes have experimented with different formulations (cognitive vs. moral incapacity), showing flexibility rather than uniformity; responsibility of defining defense should remain with the states. No constitutional right to insanity defense.",
    elements: ["No constitutional NGRI right","Mens rea approach permissible"] },
  { id: "jones", name: "Jones v. U.S.", year: 1983, court: "SCOTUS", category: "NGRI Release",
    facts: "Jones stole a jacket in DC and found NGRI for attempted petty larceny; Under DC law, all NGRI acquittees are automatically committed to a mental hospital until they can prove they are no longer mentally ill or dangerous (govt must prove by clear and convincing evidence). Although the maximum possible sentence for attempted petty larceny was one year, Jones remained confined for more than four years.",
    issue: "1. Does automatic and potentially indefinite commitment of an insanity acquittee, violate sub Due Process? 2. Does confining an insanity acquittee longer than the maximum sentence for the underlying offense violate Equal Protection?",
    holding: "1. No Due Process violation. Automatic commitment is constitutional; a preponderance standard suffices for ongoing confinement. 2. No Equal Protection violation. The fact that Jones's confinement exceeded the maximum criminal sentence is permissible because his confinement is for treatment and safety, not punishment (deterrence/retribution/rehabilitation).",
    significance: "• Standard of Proof: A preponderance of the evidence is constitutionally adequate; requiring proof beyond a reasonable doubt would place an excessive burden on the state • Equal Protection: Insanity acquittees are not similarly situated to convicted criminals. Their confinement is justified by mental health needs and protection of society, not by retribution or deterrence. • Insanity acquittees may be automatically committed upon acquittal. • Continued confinement is valid if the state proves by a preponderance of the evidence that the individual remains mentally ill and dangerous. • Confinement is based on mental illness and risk to society, not on the underlying criminal sentence.",
    elements: ["Automatic commitment OK","Indefinite confinement OK","Preponderance standard","Not \"similarly situated\" to convicted criminals"] },
  { id: "foucha", name: "Foucha v. Louisiana", year: 1992, court: "SCOTUS", category: "NGRI Release",
    facts: "Foucha was convicted of armed robbery in LA; found NGRI and committed to state hospital; under Louisiana law, individuals found NGRI may remain committed until they are no longer mentally ill and no longer dangerous. In 1988, hospital psychiatrists determined Foucha was no longer mentally ill. However, the state refused to release him because he had a history of violent behavior, and the law allowed continued confinement for those considered dangerous, even if not mentally ill.",
    issue: "Can a state continue to confine a person found NGRI if they are no longer mentally ill, solely because they are deemed dangerous? Does this continued confinement violate the Due Process Clause of the Fourteenth Amendment?",
    holding: "Yes. The Supreme Court held that the state cannot continue to confine Foucha solely on the basis of dangerousness if he is no longer mentally ill.",
    significance: "•The Court emphasized that civil commitment must be both: 1.For treatment of a mental illness, and 2.Based on a risk of dangerousness caused by that mental illness. •Confinement based only on dangerousness without mental illness is effectively punishment without due process, which violates the Fourteenth Amendment. •Foucha's continued confinement constituted an indefinite, unjustified restraint, as there was no current mental illness justifying treatment. •The Due Process Clause prohibits indefinite civil commitment of individuals who are no longer mentally ill, even if they are considered dangerous. •Dangerousness alone, unconnected to mental illness, cannot justify civil commitment.",
    elements: ["Mental illness AND dangerousness required","ASPD alone insufficient","Cannot indefinitely confine purely on dangerousness"] },
  { id: "idra", name: "Insanity Defense Reform Act", year: 1984, court: "Federal Statute", category: "NGRI Release",
    facts: "Enacted after Hinckley NGRI verdict (Reagan assassination attempt) to narrow federal insanity defense.",
    issue: "How is the federal insanity defense defined? Burden of proof?",
    holding: "Defendant NGRI only if, due to severe mental disease/defect, unable to appreciate wrongfulness. Volitional prong eliminated. Defendant burden by clear and convincing evidence.",
    significance: "Narrowed federal insanity to cognitive-only; shifted burden to defendant; created GBMI verdict alternative.",
    elements: ["Severe mental disease/defect","Unable to appreciate wrongfulness","Burden on defendant","Clear and convincing evidence"] },
  { id: "burton", name: "In re Burton", year: 2006, court: "D.C. Ct. App.", category: "NGRI Release",
    facts: "Burton was acquitted by reason of insanity in DC and committed to St. Elizabeths Hospital. Hospital staff concluded he was no longer mentally ill or dangerous. The government contested his release, raising questions about who bears the burden of proof for release of NGRI acquittees.",
    issue: "In DC conditional release proceedings for NGRI acquittees, who bears the burden of proof and by what standard must continued commitment be justified?",
    holding: "The government bears the burden of proving by a preponderance of the evidence that the acquittee remains mentally ill and dangerous. The acquittee does not bear the burden of proving fitness for release.",
    significance: "DC law requires the government to affirmatively prove ongoing mental illness and dangerousness to continue confining an NGRI acquittee. Once the acquittee presents evidence of a substantial change in condition, the burden lies with the government. Courts may order conditional release with appropriate supervision. Totality of the circumstances test.",
    elements: ["Government burden","Preponderance","Totality of circumstances"] },
  { id: "baxstrom", name: "Baxstrom v. Herold", year: 1966, court: "SCOTUS", category: "Prisoner's Rights",
    facts: "At the conclusion of a sentence for an assault charge, Baxstrom was civilly committed without a hearing or evaluation by psychiatrist.",
    issue: "Can a prisoner be transferred to a hospital at sentence-end without civil commitment procedures?",
    holding: "Baxstrom was denied equal protected because he was not given jury review of civil commitment as was available to all other New Yorkers.",
    significance: "All persons civilly committed are entitled to a review of their need for hospitalization by a jury trial, and denial of this for prisoners at the end of their sentence was not c/w equal protection of 14th.",
    elements: ["Equal protection","Same procedures as civil commitment","No special prisoner track"] },
  { id: "vitek", name: "Vitek v. Jones", year: 1980, court: "SCOTUS", category: "Prisoner's Rights",
    facts: "Convicted of robbery; transferred to psychiatric facility for treatment.",
    issue: "Does due process require a prisoner to have a hearing before he is transferred to a psychiatric hospital?",
    holding: "Involuntary transfer of a prisoner to a mental hospital impinges on the liberty interests protected by the due process clause of the 14th.",
    significance: "Commitment to a hospital is a \"massive curtailment of liberty\" that is stigmatizing and subjecting one to behavioral modification programs.",
    elements: ["Written notice","Adversarial hearing","Independent decisionmaker","Right to assistance"] },
  { id: "estelle_gamble", name: "Estelle v. Gamble", year: 1976, court: "SCOTUS", category: "Prisoner's Rights",
    facts: "Inmate injured while on a prison work assignment; received some treatment but was unable to work; was punished for not working; asserted that he was unfairly punished and had not received adequate punishment.",
    issue: "When does inadequate prison medical care violate the 8th Amendment?",
    holding: "\"Deliberate indifference to serious medical needs\" violates 8th Amendment. Here, not met — mere malpractice insufficient.",
    significance: "The prison doctors saw the patient and treated him multiple times; failed to order x-rays but this is not cruel and unusual punishment, merely (potential) malpractice. \"Evolving standards of decency\".",
    elements: ["Deliberate indifference (subjective)","Serious medical need (objective)","Mere negligence insufficient"] },
  { id: "farmer", name: "Farmer v. Brennan", year: 1994, court: "SCOTUS", category: "Prisoner's Rights",
    facts: "Trans female inmate assaulted; asserted that staff had deliberate indifference to her risk of violence and victimization from other inmates.",
    issue: "What is deliberate indifference (i.e. must a prison official actually know of risk of harm, or does it require that a prison official should have known of risk of harm)?",
    holding: "Can only be held liable under 8th and with \"deliberate indifference\" one *knows* of substantial risk of serious harm and *disregards* that risk by failing to take reasonable measures to abate it; reversed and remanded.",
    significance: "Defines deliberate indifference; subjective awareness required.",
    elements: ["Subjective awareness","Of substantial risk","Disregard of that risk"] },
  { id: "brown_plata", name: "Brown v. Plata", year: 2011, court: "SCOTUS", category: "Prisoner's Rights",
    facts: "Prison overcrowding in CA led to two federal class action lawsuits over lack of adequate mental health care provided.",
    issue: "Did a three-judge court order to reduce prison overcrowding in CA violate the Prison Litigation Reform Act of 1995?",
    holding: "A cap on inmates, and requirement that a certain number by being released is necessary to prevent violation of prisoner's 8th amendment rights, and is authorized by the PRLA.",
    significance: "Overcrowding was the cause of constitutional rights violations and a reduction in population was the only solution. Justice Scalia described the majority's decision as \"what is perhaps the most radical injunction issued by a court in our Nation's history.\".",
    elements: ["Population cap permissible","Overcrowding caused violations","PLRA authorized remedy"] },
  { id: "estelle_smith", name: "Estelle v. Smith", year: 1981, court: "SCOTUS", category: "Death Penalty",
    facts: "Smith convicted of murder and sentenced to death in Texas; during sentencing hearing, jury found Smith to be dangerous based on testimony of Dr. Grigson (Dr. Death) where he said he was a psychopath and would commit future violent acts with no remorse.",
    issue: "Does pretrial psychiatric exam used at capital sentencing violate 5th and 6th Amendments?",
    holding: "5th amendment right against self-incrimination protects the defendant from having things he said during a pre-trial comp eval used during sentencing, when the defendant wasn't notified, those statements would later be used; introducing such evidence also violates 6th amendment right to counsel since attorneys should know that such data might be collected during the eval.",
    significance: "Introduction of psychiatric testimony obtained w/o defendant's informed consent violates 5th amendment, and conducting a psychiatric interview without notice to counsel violated 6th amendment right to counsel.",
    elements: ["Miranda-like warning required","Notice to counsel","Applies when used at sentencing"] },
  { id: "barefoot", name: "Barefoot v. Estelle", year: 1983, court: "SCOTUS", category: "Death Penalty",
    facts: "Convicted of capital murder in Texas; two psychiatrists opined him to be dangerous, neither of which had personally examined Barefoot.",
    issue: "Is psychiatric testimony about future dangerousness — even without exam — admissible at capital sentencing?",
    holding: "Yes, juries can weigh evidence; Court rejected APA amicus brief stating psychiatrists cannot predict dangerousness; giving psychiatrists hypotheticals is appropriate.",
    significance: "Controversial; allows hypothetical testimony despite poor predictive accuracy.",
    elements: ["Future dangerousness testimony admissible","No examination required","Cross-exam adequate safeguard"] },
  { id: "ake", name: "Ake v. Oklahoma", year: 1985, court: "SCOTUS", category: "Death Penalty",
    facts: "Charged with murder of a couple and wounding two children; found ICST and committed; restored to competency; counsel requested sanity eval which was denied; jury sentenced to death.",
    issue: "Does due process require the state to provide a psychiatric expert for indigent defendants when sanity is at issue?",
    holding: "State must provide indigent defendant with free psychiatric assistance in preparing an insanity defense when sanity is in question; reversed and remanded.",
    significance: "Extension of *Gideon v. Wainwright*, ruling that indigents have a right to counsel, so do they also have a right to expert psychiatric evaluations; but do not have the right to pick and choose. Also discussed the \"pivotal role that psychiatry has come to play in criminal proceedings\".",
    elements: ["Sanity significantly at issue","Indigent defendant","State-funded psychiatric expert"] },
  { id: "ford", name: "Ford v. Wainwright", year: 1986, court: "SCOTUS", category: "Death Penalty",
    facts: "Ford convicted of murder and sentenced to death; not mentally ill at time of offense, during trial, or sentencing; developed symptoms prior to execution; seen by 3 state hired psychiatrists who opined he was competent to be executed; reports by these psychiatrists were signed off on by the FL governor (who had final decision); governor refused to accept defense counsels psychiatrist's reports or permit an adversarial proceeding; death warrant was signed by governor.",
    issue: "Is executing an insane person a violation of the 8th amendment?",
    holding: "Yes, executing an insane person is prohibited by 8th amendment; also, FL's procedure to determine sanity was inadequate because there was no fact-finding procedure (hearing).",
    significance: "Common law reasons to not execute insane people: Little retributive value Little deterrence value It simply offends humanity Florida did not include the prisoner in a hearing or give an opportunity to challenge or impeach the state psychiatrist's opinions Dicta: competence to be executed requires a prison be aware of impending execution and the reason for its imposition.",
    elements: ["8th Amendment bar","Adequate procedures required","Awareness of impending execution and reason"] },
  { id: "payne", name: "Payne v. Tennessee", year: 1991, court: "SCOTUS", category: "Death Penalty",
    facts: "Killed mother, daughter, and almost killed 3-year-old with a knife. During sentencing, prosecution presented testimony of the 3-year-old grandmother about the impact on him; defense contented that victim impact statements are inadmissible because they bias the jury, leading to inappropriate death sentences which is cruel and unusual.",
    issue: "Do victim impact statements violate the 8th Amendment at capital sentencing?",
    holding: "No - admissible (overruled precedent from *Booth v. Maryland* and *South Carolina v. Gathers*).",
    significance: "Assessment of harm caused by defendant is important in determining appropriate punishment, thus victim impact statements is appropriate. \"The probative value of victim impact evidence is always outweighed by its prejudicial effect because of its inherent capacity to draw the jury's attention away from the character of the defendant and the circumstances of the crime to such illicit considerations as the eloquence with which family members express their grief.\".",
    elements: ["Victim impact admissible","Relevant to harm caused","Not per se prejudicial"] },
  { id: "panetti", name: "Panetti v. Quarterman", year: 2007, court: "SCOTUS", category: "Death Penalty",
    facts: "Panetti shot and killed in-laws in front of family; found CST and to waive counsel; sentenced to death; later Panetti claimed he was incompetent to be executed; state psychiatrists opined he is competent; trial court found him competent to be executed because he knew was going to be executed and that it would result in death; appealed because he thought he was being executed because of delusional beliefs.",
    issue: "1. Adequate procedures under the Constitution for a competency to be executed hearing? 2. Does the Eighth Amendment permit the execution of an inmate who has a factual awareness of the State's stated reason for execution, but whose mental illness prevents a rational understanding of the State's justification?",
    holding: "1. The state court failed to provide the procedures for a competency to be executed hearing to which Mr. Panetti was entitled under the Constitution. 2. The Fifth Circuit employed an improperly restrictive test when it considered Mr. Panetti's claim of incompetence to be executed.",
    significance: "•The Ford standard requires more than factual awareness - the inmate must have a rational understanding of why he is being executed. •Execution serves no retributive purpose if the prisoner cannot grasp the reason for punishment. •Panetti's delusions (believing his execution was part of a demonic plot to silence his preaching) showed a disconnect between knowledge and rational comprehension. •The Texas courts' procedures were constitutionally inadequate, as they failed to hold a proper hearing or meaningfully review psychiatric evidence.",
    elements: ["Rational understanding","Not merely factual awareness","Connection between crime and punishment"] },
  { id: "perry", name: "State v. Perry", year: 1992, court: "LA Sup. Ct.", category: "Death Penalty",
    facts: "Perry sentenced to death for murdering mother, father, nephew, cousins; had schizophrenia and hx of hospitalizations; was evaluated for competence to be executed and was found incompetent; prescribed medications but refused and trial court ordered medication to render competency to be executed.",
    issue: "Does the 8th and 14th prohibit forcibly medicating in order to make someone competent to be executed?",
    holding: "Death sentence executed stayed; reversed state's order to medicate Perry against his will; said state can only execute if Perry becomes sane independent of forced AP's.",
    significance: "• Not executing the insane is the legal, moral, and theological norm • Executing the insane has little deterrent and retributive value; \"execution of a 'mad man' was such a miserable spectacle of extreme inhumanity and cruelty that it can be no example to others • Executing Mr. Perry is cruel and unusual. Distinguishments from *Washington v. Harper:* Forcing AP's to execute is not medical treatment *Harper *held that before forcibly medicating, the state must show 1) it is in the prisoner's best interest, and 2) it will further the state's interest in prison safety This case has shown neither, since they're medicating to execute.",
    elements: ["Forced meds to execute = cruel and unusual","Not medical treatment","Fails Harper criteria"] },
  { id: "atkins", name: "Atkins v. Virginia", year: 2002, court: "SCOTUS", category: "Death Penalty",
    facts: "Atkins was convicted of abduction, armed robbery, and capital murder, and was sentenced to death. During sentencing, the defense presented an expert who showed that Mr. Atkins had an IQ of 59.",
    issue: "Does executing the intellectually disabled violate the 8th Amendment?",
    holding: "Execution of criminals who were mentally retarded held to constitute cruel and unusual punishment in violation of Federal Constitution's Eighth Amendment. Reversed and remanded for further proceedings not inconsistent with the opinion.",
    significance: "•Since Penry, many states had adopted abolition of death penalty for MR •The world community and America have expressed they don't approve •In light of deficiencies by those with MR, there is a concern for 1) limited retribution and deterrence value, and 2) MR offenders may face special risk of execution because they can't persuasively show mitigating factors.",
    elements: ["Intellectual disability","Categorical 8th Amendment bar","Evolving standards of decency"] },
  { id: "roper", name: "Roper v. Simmons", year: 2005, court: "SCOTUS", category: "Death Penalty",
    facts: "Christopher Simmons, a 17-year-old high school junior murdered Shirley Crook gruesomely. Simmons was convicted and sentenced to death.",
    issue: "Permissible under 8th amendment to execute over 15 but under 18 when committing capital offense?",
    holding: "The Eighth and Fourteenth amendments forbids imposition of the death penalty on offenders who were under the age of 18 when their crimes were committed.",
    significance: "•Juveniles less culpable •Developing national consensus against death penalty for juveniles •Limited retribution and deterrence because they're less culpable •\"Evolving standards of decency that mark the progress of a maturing society\". Juveniles less culpable because: (1) lack of maturity; (2) juveniles more susceptible to negative influences and peer pressure; and (3) character of a juvenile not as well formed as adult.",
    elements: ["Under 18 at offense","Lack of maturity","Susceptibility to influences","Unformed character"] },
  { id: "hall", name: "Hall v. Florida", year: 2014, court: "SCOTUS", category: "Death Penalty",
    facts: "Freddie Lee Hall was convicted of murder and sentenced to death in Florida. He had an IQ score of 71, but Florida's strict bright-line rule required a score of 70 or below to be considered intellectually disabled (ID) and thus exempt from execution under Atkins v. Virginia.",
    issue: "Does Florida's strict IQ cutoff of 70 violate the 8th Amendment as interpreted in Atkins v. Virginia?",
    holding: "Yes. Florida's rigid IQ cutoff violates the 8th Amendment. Courts must account for the standard error of measurement (SEM) in IQ testing and consider other evidence of intellectual disability.",
    significance: "IQ tests have a standard error of measurement (typically +/- 5 points). A strict cutoff ignores this imprecision and may result in executing individuals who are in fact intellectually disabled. Courts must look at the full picture, including adaptive functioning deficits. Extends Atkins; requires states to use IQ scores within the SEM range and consider adaptive behavior deficits.",
    elements: ["Consider SEM","No strict IQ cutoff","Comprehensive clinical assessment with adaptive functioning"] },
  { id: "madison", name: "Madison v. Alabama", year: 2019, court: "SCOTUS", category: "Death Penalty",
    facts: "Vernon Madison was sentenced to death. He suffered strokes that caused vascular dementia, leaving him unable to remember his crime and with significant cognitive deficits. Alabama sought to execute him, claiming he was competent because he understood he was being executed and why.",
    issue: "Does the 8th Amendment bar execution of a prisoner who cannot remember committing the crime due to dementia, even if he has factual awareness of execution?",
    holding: "Yes; the 8th Amendment can bar execution even if a prisoner has some awareness of execution if severe mental illness or dementia prevents rational understanding of the reason for execution.",
    significance: "Ford and Panetti together establish that a prisoner must have a rational understanding of why they are being executed, not just a factual awareness. Dementia or severe mental illness that prevents such rational understanding can bar execution. The relevant inquiry is whether the prisoner can rationally understand the connection between the crime and the punishment. Extends Ford v. Wainwright and Panetti v. Quarterman to dementia cases; focuses on rational vs. factual understanding of execution.",
    elements: ["Rational understanding required","Severe dementia/illness can bar","Memory of crime not required, but rational understanding is"] },
  { id: "mcwilliams", name: "McWilliams v. Dunn", year: 2017, court: "SCOTUS", category: "Death Penalty",
    facts: "James McWilliams, facing the death penalty in Alabama for rape and murder, requested an independent mental health expert. The state provided a psychiatric evaluation but did not give McWilliams access to an expert who could help interpret the results and assist counsel in preparation for the sentencing hearing.",
    issue: "Does Ake v. Oklahoma require the state to provide a defendant with a mental health expert who is dedicated to assist the defense, or is it sufficient to provide a neutral, court-appointed evaluator?",
    holding: "The state failed to provide adequate expert assistance as required by Ake. Ake requires more than merely ordering a psychiatric evaluation; it requires providing the defendant with expert assistance sufficient to prepare and present a defense.",
    significance: "Ake established that when a defendant's sanity is at issue, the state must provide access to a psychiatric expert to assist in evaluation, preparation, and presentation of the defense. An expert who is neutral or assisting the court does not satisfy this requirement; the expert must be available to assist the defense. Clarifies Ake v. Oklahoma; requires state-funded expert who is dedicated to assist the defense, not just a neutral evaluator.",
    elements: ["Expert must assist defense","Neutral evaluator insufficient","For evaluation, preparation, presentation"] },
  { id: "buck", name: "Buck v. Davis", year: 2017, court: "SCOTUS", category: "Death Penalty",
    facts: "Duane Buck was sentenced to death in Texas. During the penalty phase, Buck's own attorney called an expert who testified that Buck was more likely to be dangerous in the future because he was Black. Buck sought federal habeas corpus review, arguing ineffective assistance of counsel.",
    issue: "Did Buck receive ineffective assistance of counsel when his attorney introduced expert testimony explicitly linking race to future dangerousness at the capital sentencing phase?",
    holding: "Yes. The introduction of race-based future dangerousness testimony was deficient performance by counsel, and there is a reasonable probability it affected the jury's verdict. The certificate of appealability was improperly denied.",
    significance: "The Strickland v. Washington standard applies: (1) counsel's performance was deficient (it was objectively unreasonable to introduce testimony linking race to dangerousness), and (2) prejudice existed because the testimony may have caused the jury to see Buck as more dangerous. The 'extraordinary circumstances' required for habeas relief were met. Emphasizes that race cannot be a factor in capital sentencing; reinforces Strickland standard for IAC claims.",
    elements: ["Deficient performance (Strickland prong 1)","Prejudice (Strickland prong 2)","Race cannot be a factor in sentencing"] },
  { id: "specht", name: "Specht v. Patterson", year: 1967, court: "SCOTUS", category: "Sex Offenders",
    facts: "Specht was convicted in a Colorado state court of \"indecent liberties,\" which carried a maximum 10-year prison sentence. Instead of sentencing him under that statute, the trial judge committed him under the Colorado Sex Offenders Act, which allowed an indeterminate sentence of one day to life imprisonment if psychiatric evaluations indicated the offender posed a continuing danger to society. The judge made this determination without a new hearing and without notice.",
    issue: "Does sentencing a defendant under the Colorado Sex Offenders Act, which imposes punishment beyond the maximum sentence of the underlying offense without notice or a hearing, violate the Due Process Clause of the Fourteenth Amendment?",
    holding: "The procedure violated due process because Specht was not given the right to be present at the hearing with counsel, to confront evidence against him, to cross examine witnesses, and to offer his own evidence/be heard.",
    significance: "•The Sex Offenders Act was not simply a sentencing discretion statute. It required new factual determinations (dangerousness, mental condition) that went beyond the jury's verdict. •Because those findings exposed Specht to a much greater penalty (life instead of 10 years), due process protections applied. •Due process required notice, the right to be present with counsel, the right to cross-examine witnesses, and the right to present evidence.",
    elements: ["Notice","Right to be present with counsel","Confront/cross-examine witnesses","Present own evidence"] },
  { id: "allen", name: "Allen v. Illinois", year: 1986, court: "SCOTUS", category: "Sex Offenders",
    facts: "The State of Illinois filed a petition under the Illinois Sexually Dangerous Persons Act to commit Allen as a sexually dangerous person; ordered Allen to submit to psychiatric evaluations; Allen objected, arguing that his statements to the psychiatrists were compelled and could reveal prior criminal conduct, thereby violating his Fifth Amendment privilege against self-incrimination.",
    issue: "Does the Fifth Amendment privilege against self-incrimination apply in a civil commitment proceeding under the Illinois Sexually Dangerous Persons Act?",
    holding: "Upheld the Illinois Supreme Court decision. Proceedings under the SDP act are not criminal in relation to the Fifth Amendment's guarantees against compulsory self-incrimination.",
    significance: "Civil nature of proceeding: The Act provides for civil commitment, not criminal punishment. Its purpose is treatment and rehabilitation, not retribution or deterrence. Fifth Amendment scope: The Self-Incrimination Clause applies only in criminal cases. Since this was a civil proceeding, Allen was not entitled to invoke the privilege. Use of testimony: Psychiatric testimony was admitted to evaluate dangerousness and need for treatment, not to establish criminal liability.",
    elements: ["Civil proceeding","Treatment focus, not punishment","5th Amendment does not apply"] },
  { id: "hendricks", name: "Kansas v. Hendricks", year: 1997, court: "SCOTUS", category: "Sex Offenders",
    facts: "•Hendricks had hx of molesting children; diagnosed with pedophilia by psychiatrists; after serving his prison sentence for sexual offenses, KS sought to commit him under its Sexually Violent Predator Act (SVPA), which allowed for civil commitment of individuals deemed likely to engage in future acts of sexual violence due to a \"mental abnormality\" or \"personality disorder\" and a history of sexually violent offenses; after commitment, annually the state must show beyond a reasonable doubt that the person remains an SVP. •Hendricks challenged the law, arguing that it constituted punishment without due process (ex post facto law) and violated the Double Jeopardy Clause, and also challenged pedophilia as a qualifying diagnosis, given that civil commitment required a \"mental illness\", not a \"mental abnormality\".",
    issue: "(1) Does the Sexually Violent Predator Act's definition of \"mental abnormality\" satisfy substantive due process? (2) Does the Act violate the constitutional ban on double jeopardy or ex post facto lawmaking?",
    holding: "No. The Supreme Court held that the SVPA does not violate the Constitution. It is a civil measure, not a criminal punishment.",
    significance: "Civil vs. Criminal: The Court emphasized that Hendricks' commitment is civil in nature, intended to protect the public and provide treatment, not to punish. Mental Abnormality Standard: Individuals can be committed if they have a \"mental abnormality\" or personality disorder that makes them likely to engage in future acts of sexual violence. No need for the act to use the term \"mental illness\" as a basis for civil commitment. Procedural Safeguards: Commitment under the SVPA involves strict procedural protections, including notice, representation, and a hearing to determine dangerousness. Not Punitive: Even if the law is applied after a criminal sentence, it is remedial, not punitive. The Court distinguished it from punishment prohibited by ex post facto or double jeopardy clauses.",
    elements: ["Mental abnormality (not strictly mental illness)","Likely to engage in sexually violent acts","Civil, not punitive"] },
  { id: "seling", name: "Seling v. Young", year: 2001, court: "SCOTUS", category: "Sex Offenders",
    facts: "• Young was convicted of multiple rapes across three decades. •Just before his scheduled release from prison in 1990, Washington State sought to commit him under its Community Protection Act of 1990, which allows civil commitment of sexually violent predators (SVPs)-persons with a mental abnormality or personality disorder that makes them likely to engage in predatory acts of sexual violence. •Young was civilly committed. He challenged the commitment, arguing that the law, although labeled \"civil,\" was in practice punitive, violating the Double Jeopardy Clause and the Ex Post Facto Clause.",
    issue: "Can a statute that is facially civil be challenged as punitive \"as applied\" to an individual, thereby triggering Double Jeopardy or Ex Post Facto protections?",
    holding: "No. If a statute is determined to be civil on its face, it cannot be deemed punitive solely based on how it is applied to a particular person. Challenges to conditions of confinement must be raised through other constitutional claims (e.g., due process), not by reclassifying the statute as punitive.",
    significance: "•Civil vs. Punitive Test: The Court reiterated the framework from Kansas v. Hendricks (1997)-the civil/punitive distinction depends on legislative intent and statutory design, not individual application. •Rejection of \"As-Applied\" Approach: Allowing case-by-case determinations would undermine legislative judgments and lead to inconsistent application. •Finality Principle: Once a statute is found civil, it cannot be re-litigated as punitive in every individual case.",
    elements: ["Civil on face → cannot be punitive as applied","Conditions challenges via due process","Finality principle"] },
  { id: "crane", name: "Kansas v. Crane", year: 2002, court: "SCOTUS", category: "Sex Offenders",
    facts: "Michael Crane, a previously convicted sexual offender with exhibitionism and antisocial personality disorder, was subject to civil commitment under Kansas's Sexually Violent Predator Act. Unlike Hendricks (who admitted he could not control his behavior), Crane did not make such an admission.",
    issue: "Does the Constitution require a finding of complete lack of control (total volitional incapacity) before a sex offender can be civilly committed under Kansas v. Hendricks?",
    holding: "No total inability to control is required, but the state must prove serious difficulty controlling behavior (not merely that the person is dangerous). There must be some lack of control distinguishing the sexually violent predator from a typical recidivist.",
    significance: "Hendricks required proof that the person has serious difficulty controlling behavior. The Constitution does not require a finding of total or complete lack of control; instead, it requires proof of a serious inability to control dangerous behavior that sets the SVP apart from an ordinary recidivist. Case remanded to determine if the standard was met.",
    elements: ["Mental abnormality","Serious difficulty controlling behavior","Future dangerousness"] },
  { id: "mckune", name: "McKune v. Lile", year: 2002, court: "SCOTUS", category: "Sex Offenders",
    facts: "Robert Lile, a Kansas prisoner convicted of rape, refused to participate in a Sexual Abuse Treatment Program (SATP) that required him to provide a sexual history including uncharged offenses. Inmates who refused faced transfer to a higher security facility and loss of prison privileges.",
    issue: "Does requiring a prisoner to incriminate himself as a condition of treatment participation violate the 5th Amendment when refusal results in transfer and loss of privileges?",
    holding: "No. The Kansas SATP does not violate the 5th Amendment. The consequences of refusal did not constitute compulsion under the Constitution.",
    significance: "No single majority opinion. The plurality held that prison conditions attendant to refusal were not so severe as to constitute compulsion; inmates retain some liberty interests in prison but these must be balanced against the state's penological interests. The SATP serves rehabilitation goals. Transfer and privilege loss are within ordinary incidents of prison life. Compelled participation in a program requiring self-incrimination, even with reduced privileges as the penalty, should be analyzed as coercive.",
    elements: ["Privileges loss ≠ compulsion","Rehabilitation interest","Within ordinary incidents of prison life"] },
  { id: "comstock", name: "U.S. v. Comstock", year: 2010, court: "SCOTUS", category: "Sex Offenders",
    facts: "Adam Comstock was convicted of federal child pornography charges. Near his scheduled release, the government sought to civilly commit him under 18 U.S.C. §4248, which authorizes federal civil commitment of 'sexually dangerous' persons upon release.",
    issue: "Does the Necessary and Proper Clause of the Constitution grant Congress authority to enact §4248, allowing federal civil commitment of sexually dangerous persons beyond their prison sentences?",
    holding: "Yes. Congress has authority under the Necessary and Proper Clause to enact the civil commitment statute. The law is rationally related to Congress's power to enact criminal laws and run a federal prison system.",
    significance: "Five considerations support the law's constitutionality: (1) the N&P clause grants broad authority; (2) long history of federal involvement in care of mentally ill; (3) statute accommodates state interests (states can take custody); (4) rational basis connection to enumerated powers; (5) the statute is linked to Congress's existing authority over federal prisoners. Federal responsibility for persons in federal custody extends to providing for their safe release.",
    elements: ["Necessary and Proper Clause","Connected to federal prisoner authority","States can take custody"] },
  { id: "glucksberg", name: "Washington v. Glucksberg", year: 1997, court: "SCOTUS", category: "Right to Die",
    facts: "Four Washington physicians who treat terminally ill patients declared that they would assist these patients in ending their lives if it were not for Washington state's statutory ban on assisted suicide. They, along with three gravely ill plaintiffs, filed a suit against Washington state and its attorney general, seeking a declaration that the ban on assisted suicide is unconstitutional. They asserted a liberty interest protected by the Fourteenth Amendment's due process clause. They suggested that the clause should protect a personal choice by a mentally competent, terminally ill adult to commit physician-assisted suicide.",
    issue: "Does Due Process include a right to physician-assisted suicide?",
    holding: "Washington's prohibition against aiding a suicide does not violate the due process clause of the Fourteenth Amendment.",
    significance: "The Court concluded that the right to assistance in committing suicide is not a fundamental liberty interest protected by the due process clause. The constitutional requirement that Washington's assisted suicide ban be rationally related to legitimate government interests is clearly met. These interests include prohibiting intentional killing and preserving human life; preventing the serious public health problem of suicide, especially those suffering from untreated pain or depression; protecting the medical profession's integrity and ethics as their patients' healers; protecting vulnerable groups from pressure to end their lives; and avoiding a possible slide toward euthanasia.",
    elements: ["No fundamental right","Rational basis review","States may prohibit"] },
  { id: "georgetown", name: "Application of Pres. & Dir. of Georgetown College", year: 1964, court: "D.C. Cir.", category: "Right to Die",
    facts: "Mrs. Jessie Jones, a twenty-five-year-old Jehovah's Witness mother of a seven-month child, had an acute gastro-intestinal bleed. She was estimated to have lost two-thirds of her total blood supply. On a religious basis, the patient and her husband did not give consent to blood transfusion for ulcer surgery. When death was imminent, the judge urged Mrs. Jones to consent but the patient said only the words, \"Against my will.\" He asked her if he ordered a transfusion, would she oppose it; she responded that it would not then be her responsibility. The judge opined that she was not competent to decide the issues.",
    issue: "Can treatment be ordered over religious refusal?",
    holding: "Judge Wright ordered that the transfusion be given. The patient recovered. The patient and husband subsequently filed an Appeal for an \"en banc\" (whole bench instead of single justice) rehearing. The appeal was denied.",
    significance: "The decision of the entire D.C. Circuit Court of Appeals denying the appeal included four different opinions, all with different reasoning. One group of judges believed the order for treatment had expired and therefore, the entire controversy was moot. A second group concluded the case did not belong in a court of law. A third group thought the entire record of the case should be stricken so there would be no precedent to be followed in the future. Finally, Justice Burger believed that there was really no legal controversy between the hospital and patient since Mr. and Mrs. Jones had agreed to sign a waiver releasing the hospital from any liability as the result of a failure by the hospital to transfuse. The hospital therefore, created a legal problem out of one that was essentially moral in nature.",
    elements: ["State interest in life","Protect dependents (the 7-month-old)","Medical ethics interest"] },
  { id: "canterbury", name: "Canterbury v. Spence", year: 1972, court: "D.C. Cir.", category: "Informed Consent",
    facts: "Jerry Canterbury, a 19-year-old patient, suffered a back injury and was treated by Dr. William Spence, a neurosurgeon. Dr. Spence recommended spinal surgery but did not inform Canterbury of the potential risks, including paralysis. After the surgery, Canterbury fell from his hospital bed and was later found paralyzed. He sued Dr. Spence, alleging that the doctor failed to disclose the risks of the procedure and thus deprived him of the opportunity to make an informed decision.",
    issue: "Does a physician have a legal duty to disclose the risks of a proposed treatment or procedure to the patient, and if so, what is the proper standard for determining the adequacy of that disclosure?",
    holding: "Yes. A physician has a duty to disclose all material risks associated with a proposed treatment or procedure that a reasonable person in the patient's position would want to know before deciding whether to proceed.",
    significance: "The court rejected the traditional \"professional standard\" (based on what physicians customarily disclose) and adopted a \"reasonable patient standard\" for informed consent. It held that: the duty to disclose is grounded in the patient's right to autonomy and self-determination. A physician must disclose information that is material - meaning a reasonable person would consider it significant in making a decision about treatment. Expert testimony is not required to prove nondisclosure, since it concerns what a reasonable patient, not a physician, would need to know. There are limited exceptions (e.g., emergencies, when disclosure would seriously harm the patient's well-being). The court reversed the lower court's directed verdict and ordered a new trial.",
    elements: ["Reasonable patient standard","Material risks","Causation","Damages"] },
  { id: "kaimowitz", name: "Kaimowitz v. Michigan DMH", year: 1973, court: "MI Cir. Ct.", category: "Informed Consent",
    facts: "Two doctors proposed implanting electrodes and removing the amygdalas of twenty-four involuntarily confined patients to study and treat violent behavior. Louis Smith, a committed patient, consented to participate, but law professor Gabe Kaimowitz sued to block the operation. The court found Smith's confinement unconstitutional and the psychosurgery proposal invalid, holding that Smith could not give informed consent as an involuntary mental patient.",
    issue: "Can an involuntarily committed mental patient give legally valid, informed consent to undergo experimental psychosurgery?",
    holding: "The judges concluded that confinement, dependence on medical staff, and the promise of possible release made voluntary consent impossible.",
    significance: "The court relied heavily on principles from the Nuremberg Code governing human experimentation, emphasizing three requirements for valid informed consent: Competency - ability to understand the nature and risks of the procedure. Knowledge - sufficient information about the experiment's effects and uncertainties. Voluntariness - freedom from coercion or undue influence. The decision tied the prohibition of psychosurgery to fundamental constitutional values: Privacy: Protects mental integrity as deeply personal. First Amendment: Safeguards mental freedom necessary for generating ideas. Compelling State Interest Test: The state must demonstrate a compelling reason to override these rights, which it failed to do.",
    elements: ["Competence","Knowledge","Voluntariness"] },
  { id: "cruzan", name: "Cruzan v. Missouri Dept. of Health", year: 1990, court: "SCOTUS", category: "Informed Consent",
    facts: "Nancy Cruzan was left in a persistent vegetative state after a 1983 car accident. She was sustained by artificial feeding and hydration through a feeding tube. After several years, her parents asked hospital officials to remove the feeding tube, believing Nancy would not want to live in such a condition. The hospital refused without court approval, and the case reached the Missouri courts. The Missouri Supreme Court held that life-sustaining treatment could not be withdrawn without \"clear and convincing evidence\" that the patient herself would have wanted that. The Cruzan family appealed to the U.S. Supreme Court.",
    issue: "Does the Constitution's Due Process Clause allow an individual to refuse life-sustaining medical treatment, and can a state require clear and convincing evidence of that person's wishes before allowing withdrawal of such treatment?",
    holding: "Yes and yes. The Court held that while competent individuals have a constitutionally protected liberty interest in refusing medical treatment under the Fourteenth Amendment's Due Process Clause, states may require clear and convincing evidence of an incompetent patient's wishes before life support can be withdrawn.",
    significance: "The Court recognized a constitutional right to refuse medical treatment, grounded in principles of bodily integrity and liberty. However, because Nancy Cruzan was incompetent (unable to express her wishes), the state had a legitimate interest in preserving life and preventing potential abuse. Missouri's requirement for \"clear and convincing evidence\" of the patient's own wishes was deemed constitutionally permissible to safeguard that interest. Thus, the Court upheld the Missouri Supreme Court's decision. Impact: First U.S. Supreme Court case to directly address the \"right to die\" issue. Established that competent persons have a constitutional right to refuse life-sustaining treatment, but that states may set procedural safeguards (like the \"clear and convincing\" evidence standard). Led to the rise of advance directives and living wills as a way to record an individual's treatment preferences. Later influenced Terri Schiavo and other end-of-life legal battles.",
    elements: ["Liberty interest in refusing treatment","Clear and convincing evidence permissible","Bodily integrity"] },
  { id: "rouse", name: "Rouse v. Cameron", year: 1966, court: "D.C. Cir.", category: "Right to Treatment",
    bazelon: true,
    facts: "Mr. Rouse was charged w/ carrying a weapon in DC, found NGRI, committed to St. Elizabeths. While committed, he alleged that he was confined without treatment; filed habeas corpus in U.S. District Court asserting that continued confinement was unlawful; DC denied petition saying that recovery of sanity is the purpose of confinement, not treatment; appealed to DCCA.",
    issue: "Whether the involuntary confinement of an insanity acquittee without adequate psychiatric treatment is lawful?",
    holding: "No; involuntary confinement without treatment is not authorized; patients committed have a right to treatment; reversed and remanded to lower court to assess adequacy of treatment.",
    significance: "Court emphasized that the justification for civil commitment is treatment, not punishment or mere custody; mere custody is sub due process violation; hospital must put forth effort to cure or improve the patient; regular review of process is expected; treatment should be taken place in light of current knowledge; inadequate facilities or lack of staff is not an excuse.",
    elements: ["Statutory right to treatment","Confinement without treatment = punishment"] },
  { id: "wyatt", name: "Wyatt v. Stickney", year: 1971, court: "M.D. Ala.", category: "Right to Treatment",
    facts: "In 1970, a class action suit was filed on behalf of patients involuntarily confined to a hospital in Tuscaloosa, Alabama. Conditions in the hospital were abysmal. In March 1971, District Court held that the patients (including Mr. Wyatt) had a constitutional right to receive such individual treatment as will give them a realistic opportunity to be cured or to improve their condition. The hospital was allowed six months to raise the level of care to the constitutionally required minimum, and that the hospital failed to provide: (1) a humane psychological and physical environment; (2) qualified staff in numbers sufficient to administer adequate treatment; and (3) individualized treatment plans.",
    issue: "Right to treatment in hospitals, appropriate conditions in hospitals.",
    holding: "Court defined minimum standards that must be met, and lack of operating funds is not an excuse; a human rights committee was appointed to oversee the changes. The minimum standards included (1) Humane psychological and physical environment: right to privacy and dignity, no unnecessary intrusions, right to visitation, right to use a telephone and send/receive mail, freedom from unnecessary and excessive medication, free from physical restraints save for emergencies, patients cannot be subject to experimental research, right to opportunity to interact with opposite sex; (2) qualified staff in sufficient numbers, and (3) individualized treatment plans.",
    significance: "\"To deprive any citizen of his or her liberty upon the altruistic theory that the confinement is for humane, therapeutic reasons and then provide inadequate treatment violates the very fundamentals of Due Process.\".",
    elements: ["Humane physical/psychological environment","Qualified staff in sufficient numbers","Individualized treatment plans"] },
  { id: "donaldson_5th", name: "Donaldson v. O'Connor (5th Cir.)", year: 1974, court: "5th Cir.", category: "Right to Treatment",
    facts: "Kenneth Donaldson (w/ paranoid schizophrenia, committed to a state mental hospital) refused Tx because of his Christian Science faith. He repeatedly requested release and identified friends he could live with. Hospital staff denied releasee, saying mental illness alone was sufficient to continue confining him despite him being able to live independently.",
    issue: "Is it a violation of the 14th amendment right to liberty to continue to confine a nondangerous individual who is capable of living in the community independently?",
    holding: "Yes. Due process violation to continue to confine someone who can survive safely independently; all have a right to treatment.",
    significance: "Civil commitment is a severe deprivation of liberty. Mental illness alone does not justify confinement; must show that they are dangerous or need treatment.",
    elements: ["Right to treatment","Non-dangerous + can survive = release","Mental illness alone insufficient"] },
  { id: "youngberg", name: "Youngberg v. Romeo", year: 1982, court: "SCOTUS", category: "Right to Treatment",
    facts: "Mr. Nicholas Romeo was a 33-year-old profoundly intellectually disabled man in PA institution with a mental age of 18 months, could not speak and lacked basic self-care skills. His mother became concerned because he sustained 63 injuries in two years; she filed suit against the superintendent (Youngberg) and two supervisors under the Federal Civil Rights Act of 1964. She alleged that Mr. Romeo had a constitutional right to safe conditions of confinement, freedom from bodily restraint, and a right to training or habilitation. She suggested that his Eighth Amendment rights to be free of cruel and unusual punishment and his Fourteenth Amendment rights to equal protection had been violated. The jury returned a verdict for the defendants. The Court of Appeals for the Third Circuit reversed and remanded the case for a new trial. Youngberg appealed to the U.S. Supreme Court.",
    issue: "What rights to safety, freedom from restraint, and training do committed persons have?",
    holding: "Mr. Romeo did have constitutionally protected liberty interests under the Due Process Clause of the Fourteen Amendment to reasonably safe conditions of confinement, freedom from unreasonable bodily restraints, and such minimally adequate training as reasonably may be required to accomplish the first two interests. There was no finding of any general right to treatment. The Court remanded the case for further proceedings consistent with its decision.",
    significance: "The duty to provide certain services and care is owed to a person who is institutionalized and thus wholly dependent on the institution. Mr. Romeo's rights must be balanced against relevant state interests. The Court rejected the methods suggested by the lower courts and instead chose an alternative. Courts \"should not second-guess the expert administrators on matters on which they are better informed.\" A decision made by a professional would be \"presumptively valid.\" The Court held that liability may be imposed only when a decision is \"such a substantial departure from accepted professional judgment... as to demonstrate that the person responsible actually did not base the decision on such a judgment.\" The Court held that professionals will not be individually liable if they were unable to satisfy normal professional standards because of budgetary constraints.",
    elements: ["Safe conditions","Freedom from undue restraint","Minimally adequate training","Professional judgment standard"] },
  { id: "meritor", name: "Meritor Savings Bank v. Vinson", year: 1986, court: "SCOTUS", category: "Sexual Harassment",
    facts: "Ms. Vinson worked as a teller at Meritor Bank under a boss Mr. Taylor. Ms. Vinson brought an action against Mr. Taylor and the bank, claiming constant sexual harassment and violation of Title VII of the Civil Rights Act of 1964. Ms. Vinson said she feared for job, so she never reported it and had sex with Mr. Taylor. District Court rejected claims, saying no harassment occurred and since the bank was not notified, they were not liable. The DCCA reversed and remanded > appealed to SC.",
    issue: "Is a claim of a \"hostile\" work environment a form of sex discrimination under Title VII? When should employers be liable if employees don't tell them sexual harassment is going on?",
    holding: "A claim of a \"hostile work environment\" in the context of sexual harassment is actionable under Title VII. There should not be absolute liability for employers for acts of supervisors. SC upheld reverse and remand of DCCA.",
    significance: "The sexual harassment must be sufficiently server or pervasive \"to alter the conditions of employment and create an abusive working environment.\" Voluntariness does not matter; only if it is unwelcome. Employers are liable on a case by case basis, no absolute rule made.",
    elements: ["Severe or pervasive","Alters conditions of employment","Unwelcome (voluntariness irrelevant)","Employer liability case-by-case"] },
  { id: "harris", name: "Harris v. Forklift Systems", year: 1993, court: "SCOTUS", category: "Sexual Harassment",
    facts: "Ms. Harris was a manager at a forklift company; the president made gendered insults and unwanted sexual comments, belittled her and other female employees. Ms. Harris quit, then sued company because the president created an abusive working environment. District Court disagreed, saying his conduct was not severe enough to cause injury; affirmed on appeal > SC.",
    issue: "What is the definition of a discriminatory or \"abusive work environment\" under Title VII of the Civil Rights Act of 1964?",
    holding: "For an actionable Title VII claim, the conduct need not lead to injury (psychological or otherwise). Meritor standard requires objective hostility and subjective perception of hostility from the victim. Reversed and remanded.",
    significance: "\"Whether an environment is hostile or abusive can be determined only by looking at all the circumstances, which may include the frequency of the discriminatory conduct; its severity; whether it is physically threatening or humiliating, or a mere offensive utterance; and whether it unreasonably interferes with an employee's work performance. The effect on the employee's psychological well being is relevant in determining whether the plaintiff actually found the environment abusive. But while psychological harm may be taken into account, no single factor is required.\".",
    elements: ["Objective hostility","Subjective perception of hostility","Totality of circumstances (frequency, severity, threats, work interference)"] },
  { id: "oncale", name: "Oncale v. Sundowner Offshore", year: 1998, court: "SCOTUS", category: "Sexual Harassment",
    facts: "Mr. Oncale was working on an oil rig with an 8-man crew. He was harassed and sodomized on the job by peers and supervisors. He quit and later filed a Title VII claim, alleging sex discrimination. District court dismissed on summary judgment. Affirmed on appeal > SC.",
    issue: "Whether workplace harassment can violate Title VII's prohibition against \"discrimination because of sex\" when the harasser and the harassed employee are the same sex.",
    holding: "Sex discrimination consisting of same sex sexual harassment is actionable under Title VII of the Civil Rights Act. The case was reversed and remanded. Justice Scalia delivered the opinion for a unanimous court.",
    significance: "In making room for same sex harassment claims, the Court further refined its definitions of what constitutes harassment behavior as opposed to simple \"incivility.\" Harassing conduct \"need not be motivated by sexual desire to support an inference of discrimination on the basis of sex.\" Mere \"offensive sexual connotations\" are insufficient to prove sexual harassment; there must be \"discrimination...because of...sex.\".",
    elements: ["Same-sex harassment actionable","Need not be motivated by sexual desire","Discrimination because of sex required"] },
  { id: "rogers", name: "Rogers v. Commissioner", year: 1983, court: "MA Sup. Jud. Ct.", category: "Right to Refuse Treatment",
    facts: "7 patients at a Boston hospital filed a class action suit on behalf of all present and future patients secluded or medicated without their consent; sought injunction and damages; district court held that there is a right to refuse treatment and that a guardian must consent; appealed to SC.",
    issue: "Right to refuse treatment? Who decides for incompetent patients?",
    holding: "A committed patient is competent until judicially found incompetent. A judge, using a full adversarial hearing, then decides, using the substituted judgment model, what the incompetent patient (ward) would have wanted if competent. Substituted judgment model: 1. The patient's previously expressed preference; 2. The patient's religious convictions; 3. Impact on family from the patient's viewpoint; 4. Probable side effects; 5. Prognosis w/ tx; 6. Prognosis w/o tx.",
    significance: "No other state interest supersedes this right except in an emergency, narrowly defined as an \"immediate, substantial, and irreversible deterioration of a serious mental illness\" or likely harm to self or others; every individual has the right to \"manage his own person\" and to make basic decisions with respect to \"taking care of himself.\" This right is not lost when the person becomes a patient in a mental health facility; it is lost only on an adjudication of incompetence. Even then, the right is transferred to a court, not to a physician, except in an emergency. The Rogers model is sometimes referred to as the rights-driven model in contrast to Rennie, which is referred to as a treatment-driven model of the right to refuse treatment. Both recognize a constitutional right to refuse treatment, but they differ in how much due process is required.",
    elements: ["Right to refuse","Judicial determination of incompetence","Substituted judgment (not best interests)","Emergency exception"] },
  { id: "rennie", name: "Rennie v. Klein", year: 1983, court: "3rd Cir.", category: "Right to Refuse Treatment",
    facts: "John Rennie, involuntarily committed at a New Jersey state psychiatric hospital, was forcibly medicated with antipsychotics over his repeated objections. He filed suit claiming his constitutional rights were violated.",
    issue: "Do involuntarily committed mental patients have a constitutional right to refuse antipsychotic medication, and what standard of review applies?",
    holding: "Yes, committed patients have a qualified right to refuse medication. The professional judgment standard applies: courts should defer to treatment decisions made by qualified mental health professionals unless the decision represents a substantial departure from accepted professional judgment.",
    significance: "Involuntarily committed patients retain a liberty interest in refusing unwanted medication. However, this right is not absolute. The state's interest in treatment and safety can override patient refusal. Applying Youngberg v. Romeo's professional judgment standard: if a mental health professional makes a treatment decision, it is presumptively valid unless it represents a substantial departure from accepted professional standards. Applied Youngberg professional judgment standard to medication refusal; NJ later adopted stronger protections in Rogers-type proceedings.",
    elements: ["Qualified right to refuse","Professional judgment standard","Presumptively valid unless substantial departure"] },
  { id: "harper", name: "Washington v. Harper", year: 1990, court: "SCOTUS", category: "Right to Refuse Treatment",
    facts: "Walter Harper, a Washington State prisoner with serious mental illness, was administered antipsychotic medication against his will under a prison policy. The policy allowed forced medication when an inmate was gravely disabled or dangerous, subject to administrative review.",
    issue: "Does the Due Process Clause permit a state to administer antipsychotic medication against a prisoner's will through an administrative (non-judicial) review process?",
    holding: "Yes. The state may involuntarily medicate a seriously mentally ill prisoner if (1) the prisoner is dangerous to self or others or gravely disabled, and (2) the treatment is in the prisoner's medical interest. Administrative review by medical professionals (not a full judicial hearing) satisfies due process.",
    significance: "Prisoners retain a significant liberty interest in avoiding involuntary medication. However, this interest must be balanced against prison safety and medical care interests. Given the administrative review process (independent psychiatrist review, patient can attend and present arguments), due process is satisfied without a full judicial hearing. The professional nature of the decision warrants deference to medical judgment. Key precedent preceding Sell v. U.S.; permits forced medication of dangerous prisoners via administrative (not judicial) process.",
    elements: ["Serious mental illness","Dangerous to self/others OR gravely disabled","Medical interest","Administrative review sufficient"] },
  { id: "steele", name: "Steele v. Hamilton City", year: 1999, court: "OH Sup. Ct.", category: "Right to Refuse Treatment",
    facts: "Timothy Steele, an involuntarily committed patient at a state psychiatric facility in Ohio, refused antipsychotic medication. The facility sought to medicate him over his objection. Ohio law had not clearly defined the procedural requirements for overriding a committed patient's medication refusal.",
    issue: "What procedural safeguards must Ohio provide before forcibly medicating an involuntarily committed patient who refuses antipsychotic medication?",
    holding: "Ohio must conduct a judicial hearing before overriding a committed patient's refusal of antipsychotic medication, except in emergencies. The court must consider specific criteria including diagnosis, proposed treatment, patient's reasons for refusal, capacity to understand, and availability of alternatives.",
    significance: "Committed patients in Ohio retain a right to refuse medication that can only be overridden after judicial review. The court must consider: (1) patient's diagnosis; (2) proposed medication and side effects; (3) patient's reasons for refusing; (4) patient's ability to understand their condition and the consequences of refusal; and (5) alternative treatments. This is a stronger protection than the federal minimum established in Washington v. Harper. Ohio's judicial hearing requirement for forced medication of committed patients is more protective than the federal administrative review standard.",
    elements: ["Judicial hearing","Diagnosis","Proposed treatment + side effects","Capacity to understand","Alternatives"] },
  { id: "hargrave", name: "Hargrave v. Vermont", year: 2003, court: "VT Dist. Ct.", category: "Right to Refuse Treatment",
    facts: "Nancy Hargrave, a Vermont woman with schizophrenia, had signed a psychiatric advance directive refusing antipsychotic medication if involuntarily committed in the future. Vermont's law allowed override of advance directives for committed patients deemed incompetent.",
    issue: "Does Vermont's law permitting override of a psychiatric advance directive for committed patients violate the ADA?",
    holding: "Yes. Vermont's law discriminated against people with mental disabilities by allowing override of their advance directives, while advance directives of people with physical disabilities were honored. This disparate treatment violates the ADA.",
    significance: "The ADA requires that people with mental disabilities be treated equally to those with physical disabilities. Vermont's policy allowed override of psychiatric advance directives but not medical advance directives for physical conditions. This disparate treatment constitutes discrimination under the ADA. Vermont must honor competently-executed psychiatric advance directives. Important for psychiatric advance directives; established ADA protection for mental health advance directives.",
    elements: ["ADA protection","Equal treatment with physical advance directives","Competently-executed PADs must be honored"] },
  { id: "lifschutz", name: "In re Lifschutz", year: 1970, court: "CA Sup. Ct.", category: "Confidentiality & Privilege",
    facts: "Mr. J was seen by a psychiatrist Dr. Lifschutz. 10 years later, Mr. H sued for emotional damages; records from Dr. L were subpoenaed. Dr. L refused to provide records, stating that there was a constitutionally protected privilege to keep the records private. Dr. L was held in contempt and spent several days in jail before petitioning for habeas corpus.",
    issue: "Is there a psychiatrist's constitutional right to privacy?",
    holding: "Contempt of court finding was confirmed by CA SC. Writ of habeas corpus denied. The patient, not eh doctor, owns privilege aka the right to bar testimony and evidence from a judicial hearing.",
    significance: "The psychiatrist has no constitutional right to privacy. Waiver of privilege is partial for issues relevant to litigation only. The Court recognized psychotherapy notes as protected. The patient in this case had already disclosed the treatment. The doctor's refusal was inappropriate and violated a legitimate court order.",
    elements: ["Patient owns privilege","Doctor has no constitutional privacy right","Partial waiver for relevant issues"] },
  { id: "doe_roe", name: "Doe v. Roe", year: 1977, court: "NY trial court", category: "Confidentiality & Privilege",
    facts: "Ms. Doe sued her former psychiatrist Dr. Roe and her husband, alleging that they unlawfully invaded her privacy by publishing a book \"which reported verbatim and extensively the patient's thoughts, feelings, emotions, fantasies and biographies.\" The book was released eight years after treatment. The plaintiff sued for an injunction to stop publication of the book and for damages.",
    issue: "Did publication of therapy content violate patient privacy?",
    holding: "Plaintiff was entitled to injunction and 20k in comp damages. The physician invaded privacy; no punitive damages though because they didn't think the doctor was acting in bad faith. The husband was equally liable because of his role in the economics and distribution of the book.",
    significance: "AMA code of ethics and Hippocratic oath requires psychiatrists keep what their patients tell them secret. Confidentiality must be maintained except Tarasoff, contagious diseases, firearms, controlled substances; whatever educational benefit the book may have had did not supersede confidentiality.",
    elements: ["Therapist-patient confidentiality enforceable","Civil damages available","Right of action for patient"] },
  { id: "jaffee", name: "Jaffee v. Redmond", year: 1996, court: "SCOTUS", category: "Confidentiality & Privilege",
    facts: "Ms. Redmond, a police officer, shot and killed Mr. Allan while policing. Jaffee, the executor of Allan's estate, filed suit in Federal District Court alleging that Officer Redmond violated Allan's constitutional rights by using excessive force. Redmond sought counseling after the killing; these notes were subpoenaed and Redmond and her therapist refused to provide them arguing they were protecting by psychotherapist-patient privilege. Trial court judge then said it should be presumed whatever is in the notes is negative; jury awarded 550k to Allan's family; appealed and reversed > SC.",
    issue: "Is it appropriate for federal courts to recognize a \"psychotherapist privilege\" under Rule 501 of the Federal Rules of Evidence? Rule 501 provides in part: ...\"the privilege of a witness shall be governed by the principles of the common law as they may be interpreted by the courts of the United States in the light of reason and experience.\".",
    holding: "The conversations between Redmond and her therapist are protected from compelled disclosure under Rule 501. The federal privilege was found to apply to psychiatrists, psychologists; and to confidential communications made to licensed social workers only in the course of psychotherapy. The Court of Appeals decision was affirmed.",
    significance: "There is considerable support for the concept of psychotherapist privilege. Effective psychotherapy depends upon an atmosphere of trust and therefore the mere possibility of disclosure of confidential communications may impede development of the relationship necessary for successful treatment. The privilege also serves the public interest since the mental health of citizens is \"a public good of transcendent importance.\" In contrast, the likely evidentiary benefit that would result from denial of the psychotherapist-patient privilege is modest. The federal privilege was extended not only to psychiatrists and psychologists, but also to \"confidential communications made to licensed social workers in the course of psychotherapy.\" Social work clients often include indigent individuals and those who could not afford the assistance of a psychiatrist or psychologist.",
    elements: ["Federal common-law privilege","Psychiatrists, psychologists, LCSWs","Communications in course of therapy"] },
  { id: "addington", name: "Addington v. Texas", year: 1979, court: "SCOTUS", category: "Civil Commitment",
    facts: "Frank O'Neal Addington was subject to indefinite civil commitment proceedings in Texas after his mother petitioned for his commitment. He had a history of threatening behavior. Texas courts used a preponderance of the evidence standard for commitment. Addington argued the standard should be beyond a reasonable doubt.",
    issue: "What standard of proof is constitutionally required under the Due Process Clause for civil commitment proceedings?",
    holding: "The standard of proof for civil commitment must be at least clear and convincing evidence. Preponderance of the evidence is insufficient, but proof beyond a reasonable doubt is not constitutionally required.",
    significance: "Civil commitment involves a significant deprivation of liberty requiring due process protection. The preponderance standard does not adequately protect individual liberty. The beyond reasonable doubt standard is too strict given the imprecision of psychiatric diagnosis. Clear and convincing evidence balances individual liberty interests with the state's interest in protecting the public and providing care for the mentally ill. Foundational civil commitment case; established clear and convincing evidence as the constitutional minimum standard of proof for commitment.",
    elements: ["Clear and convincing evidence","Higher than preponderance","Lower than reasonable doubt"] },
  { id: "parham", name: "Parham v. J.R.", year: 1979, court: "SCOTUS", category: "Civil Commitment",
    facts: "J.R. was a child with behavioral problems whose parents sought his voluntary commitment to a Georgia state psychiatric hospital. J.L. was a child committed by the state (as his guardian). Both children were denied adversarial hearings before commitment.",
    issue: "Does a child have a due process right to an adversarial hearing before being committed to a psychiatric hospital by his parents or the state?",
    holding: "No formal adversarial hearing is required before a child's commitment to a psychiatric hospital. However, due process requires an independent review by a neutral physician who evaluates the child's needs.",
    significance: "Parents generally have the authority and responsibility to make medical decisions for their children. An independent psychiatric review by a neutral physician provides sufficient procedural protection. The state as guardian also has a duty to act in the child's best interest. Full adversarial hearings would be disruptive to children's mental health care and families. Children have independent constitutional rights and need their own procedural protections; parental and state interests do not automatically override the child's liberty interest.",
    elements: ["Neutral fact-finder (physician sufficient)","No formal hearing required","Parental presumption"] },
  { id: "zinermon", name: "Zinermon v. Burch", year: 1990, court: "SCOTUS", category: "Civil Commitment",
    facts: "Darrell Burch, apparently mentally ill, was found wandering in Florida and signed forms for voluntary admission to a state psychiatric facility. He later claimed he had been incompetent to consent to voluntary admission and that admitting him as 'voluntary' when he was incompetent violated his due process rights.",
    issue: "Does the admission of an incompetent person as a 'voluntary' psychiatric patient, without procedural safeguards, violate due process?",
    holding: "Yes. Florida's failure to provide adequate procedural safeguards to ensure that patients admitted as 'voluntary' are actually competent to consent violates the Due Process Clause.",
    significance: "The state must have procedures to screen for incompetence when admitting patients as voluntary. If a person lacks capacity to consent to voluntary admission, admitting them without safeguards denies them the procedural protections they would receive in an involuntary commitment proceeding. Florida's system was constitutionally deficient because it created a foreseeable risk of admitting incompetent patients as voluntary. Important for voluntary commitment procedures; requires screening for competence to consent to voluntary admission.",
    elements: ["Capacity to consent required","Procedural safeguards needed","Foreseeable risk of incompetent voluntary admission"] },
  { id: "dillon", name: "Dillon v. Legg", year: 1968, court: "CA Sup. Ct.", category: "Emotional Harm & Disability",
    facts: "Erin Dillon was struck and killed by a car driven by David Legg. Erin's sister witnessed the accident from nearby but was not in the zone of immediate physical danger. Their mother also witnessed the accident from farther away. Both sister and mother sought to recover for negligently inflicted emotional distress.",
    issue: "Can bystanders who witness a traumatic injury to a close relative recover for negligent infliction of emotional distress (NIED) even if they were not in the zone of physical danger?",
    holding: "Yes. California recognized a new cause of action for NIED for bystanders who witness injury to close relatives.",
    significance: "The court established a three-part test (Dillon factors) for bystander NIED claims: (1) proximity to the accident - plaintiff must be near the scene; (2) contemporaneous observation - plaintiff must observe the injury as it occurs, not learn of it later; (3) close relationship - plaintiff must be closely related to the victim. Foreseeability is the key principle. Foundational bystander emotional distress case; Dillon factors still used in many jurisdictions today.",
    elements: ["Proximity to accident","Contemporaneous observation","Close relationship to victim"] },
  { id: "lake", name: "Lake v. Cameron", year: 1966, court: "D.C. Cir.", category: "Civil Commitment",
    bazelon: true,
    facts: "Catherine Lake, an elderly woman with chronic brain syndrome, was involuntarily committed to St. Elizabeths Hospital after being found wandering and unable to care for herself. She sought less restrictive alternatives to hospitalization.",
    issue: "Does a committed patient have a right to the least restrictive alternative placement consistent with her care and safety?",
    holding: "The court recognized the principle of least restrictive alternative in civil commitment. The government must explore alternatives to hospitalization before confining a person indefinitely.",
    significance: "Civil commitment deprives individuals of liberty. Before committing someone to an institution, the government must consider whether less restrictive alternatives (supervised home care, family care, nursing home) would adequately serve both the individual's needs and the state's interest. The case was remanded to explore alternatives. Established the least restrictive alternative principle in civil commitment; important precursor to modern commitment law.",
    elements: ["Least restrictive alternative","Government must explore options","Both individual and state interests considered"] },
  { id: "lessard", name: "Lessard v. Schmidt", year: 1972, court: "WI Dist. Ct.", category: "Civil Commitment",
    facts: "Alberta Lessard was involuntarily committed to a state mental health facility under Wisconsin's civil commitment statute, which lacked many procedural protections. The ACLU challenged the constitutionality of the Wisconsin commitment statute.",
    issue: "Do adults facing civil commitment have the same procedural due process rights as those facing criminal prosecution?",
    holding: "Yes. Civil commitment requires extensive due process protections similar to criminal proceedings, including notice, right to counsel, and proof beyond a reasonable doubt.",
    significance: "The court held Wisconsin's commitment statute unconstitutional and required: (1) notice of the charges and right to be present at hearing, (2) right to counsel (appointed if indigent), (3) privilege against self-incrimination, (4) standard of beyond a reasonable doubt for imminent danger, (5) dangerousness must be to self or others, and (6) commitment as last resort after less restrictive alternatives considered. Landmark lower court case establishing extensive due process protections for civil commitment; influenced later reform nationwide.",
    elements: ["Notice","Right to counsel","Self-incrimination privilege","Imminent dangerousness","Least restrictive alternative"] },
  { id: "oconnor", name: "O'Connor v. Donaldson", year: 1975, court: "SCOTUS", category: "Civil Commitment",
    facts: "Kenneth Donaldson was involuntarily confined in a Florida state mental hospital for nearly 15 years. He was not dangerous, received virtually no treatment, and repeatedly requested release. Friends offered to take responsibility for him, but the hospital superintendent O'Connor refused to release him, arguing mental illness alone justified confinement.",
    issue: "Does the Constitution permit a state to confine a non-dangerous, mentally ill individual who is capable of surviving safely in the community?",
    holding: "No. A state cannot constitutionally confine a non-dangerous mentally ill person who is capable of living safely in freedom, whether alone or with help. Mental illness alone does not justify indefinite confinement.",
    significance: "Civil commitment involves a massive curtailment of liberty requiring due process justification. The state must show either that the person is dangerous to self or others, or that the person lacks the ability to survive safely in freedom. Mental illness alone, without dangerousness or inability to function, cannot justify indefinite confinement. O'Connor was held personally liable for continuing confinement without justification. Mental illness + non-dangerousness + ability to survive safely = must be released; O'Connor held personally liable.",
    elements: ["Mental illness alone insufficient","Dangerousness OR grave disability required","Personal liability possible"] },
  { id: "tarasoff", name: "Tarasoff v. Regents", year: 1976, court: "CA Sup. Ct.", category: "Duty to Protect",
    facts: "Prosenjit Poddar was a student at UC Berkley and began dating Tatianna Tarasoff. He became depressed when he found she was seeing other men; he sought counseling at the university health service where he told his therapist he intended to kill Tarasoff. The therapist notified police; police let Poddar go. Poddar later stabbed Tarasoff to death. Tarasoff's parents sued campus police, university health service, and regents of UC Berkley; ultimately appealed to CA SC, who reversed lower court's decision and said a therapist \"bears a duty to use reasonable care to give threatened persons such warnings as are essential to avert foreseeable danger arising from a patient's condition\" - Tarasoff I. The CA SC reheard the case due to uproar from psychiatrists and police; this case is considered Tarasoff II.",
    issue: "Does a therapist owe a duty to protect identifiable third parties?",
    holding: "\"When a therapist determines, or pursuant to the standards of his profession should determine, that his patient presents a serious danger of violence to another, he incurs an obligation to use reasonable care to protect the intended victim against such danger. The discharge of this duty may require the therapist to take one or more of various steps. Thus, it may call for him to warn the intended victim, to notify the police, or to take whatever steps are reasonably necessary under the circumstances.\".",
    significance: "Doctors have historically been liable for failure to diagnose contagious diseases or not warning material parties about it. The court responded to the APA amicus brief that psychiatrist could not accurately predict violence with the counter that they are not expecting perfect, but only to \"exercise that reasonable degree of skill and care ordinarily possessed by members of their profession under similar circumstances.\" The risk of unnecessary warnings being given is a reasonable price to pay for the lives of possible victims that may be saved. \"Protective privilege ends where the public peril begins.\" NOTE: Tarasoff I - 1974 - duty to WARN Tarasoff II - 1976 - duty to PROTECT.",
    elements: ["Identifiable victim","Foreseeable threat","Reasonable care to protect (warn, hospitalize, notify police)"] },
  { id: "lipari", name: "Lipari v. Sears", year: 1980, court: "U.S. Dist. Ct. NE", category: "Duty to Protect",
    facts: "Mr. Cribbs purchased a gun from a Sears store. He had been involuntarily hospitalized at the VA in the past and noted such, on forms while buying the gun. One month after purchasing the firearm, he shot into an Omaha nightclub, killing Mr. Lipari and wounding Mrs. Lipari. Mrs. L sued Sears for negligently selling the shotgun to a known mentally ill person. Sears in turn filed a complaint against the US govt saying they had negligently treated Mr. Cribbs, saying that the VA should have known Mr. C was dangerous and intervened; Mr. L filed a similar complaint. Defendants filed a motion to dismiss, saying none of the plaintiffs had a claim.",
    issue: "Does duty to protect extend beyond identifiable victims to foreseeable victims at large?",
    holding: "Yes. Therapist has duty to detain dangerous persons; foreseeable victims belong to class.",
    significance: "There are times when a psychotherapist has a duty to persons other than his patient; a therapist has a duty to detain persons who would be dangerous if released. The Court concluded that the victims did belong to the class of individuals that were foreseeable victims -- the public at large. Furthers Tarasoff duty as that was limited just to identifiable victims; this case created a duty to any class of individuals who are foreseeable victims.",
    elements: ["Duty extends beyond identifiable victims","Foreseeable class of victims","Public at large can be protected class"] },
  { id: "littleton", name: "Littleton v. Good Samaritan", year: 1988, court: "OH Sup. Ct.", category: "Duty to Protect",
    facts: "Ms. Pearson had post-partum psychotic depression; psychiatrically hospitalized at Good Sam in Dayton; told nurses that she was planning on killing the baby via injection but later retracted this; nurses told doctor but doctor did not address it fully; discharge plan was made where the baby was placed in care of the father and family was not told that she made threats just informed she should not be alone with the baby; family left her alone with baby and she later killed the baby via aspirin.",
    issue: "Under what circumstances can a psychiatrist be held liable for the violent act of a voluntarily hospitalized patient following their release from the hospital?",
    holding: "OH SC adopted the \"professional judgment rule.\" Psychiatrists are required to adhere to professional standards for violence prediction.",
    significance: "If you conduct a thorough VRA, and act in good faith, and violence happens; not liable. Psychiatrist not liable for mere error of judgment. Only liable if absence of good faith or failure to exercise any professional judgment. If patient wasn't violent while hospitalized and no reason to suspect they would be violent if discharged; not liable. If patient was diagnosed as having violent propensities, and thorough VRA conducted, and treatment plan formulated to address it; not liable.",
    elements: ["Professional judgment standard","Thorough VRA","Good faith","Not liable for mere error of judgment"] },
  { id: "morgan", name: "Morgan v. Fairfield", year: 1994, court: "OH Sup. Ct.", category: "Duty to Protect",
    facts: "Mr. Morgan had a history of psychosis and violence. Got treatment at Fairfield Counseling Center, tried to get SSI, psychiatrist felt he was malingering, tapered his antipsychotic and denied him for disability; he deteriorated and shot and killed his parents and wounded his sister.",
    issue: "Does a psychiatrist's duty to protect a person from violent propensities of the psychiatrist patient extend to the outpatient setting?",
    holding: "When a psychiatrist knows or should know that their outpatient represents a substantial risk of harm to others, they are under a duty to exercise their best professional judgment to prevent such harm from occurring.",
    significance: "OHIO SC considered 5 things in their opinion: Psychotherapist's ability to control patient Public safety Difficulty with accurate VRA and prediction of behavior Patient's liberty interest and freedom from unnecessary confinement Patient confidentiality Inspired outrage from professionals; no longer good law and super seceded by Ohio statute to clarify problems > ORC §2305.51.",
    elements: ["Outpatient duty extends","Knew or should have known","Best professional judgment"] },
  { id: "bragdon", name: "Bragdon v. Abbott", year: 1998, court: "SCOTUS", category: "ADA",
    facts: "Ms. Abbott told her dentist about her asymptomatic HIV infection, and her dentist Mr. Bragdon said she would not fill her cavity in office, that she would need to pay for services at a hospital to get it filled. Ms. Abbott sued in District Court of Maine, alleging discrimination on the basis of her disability (HIV affects reproduction, a \"major life activity\"), the ADA requires public accommodation (which includes the \"professional office of the health care provider\"), and that the ADA further provides that unless an individual poses a \"direct threat to the safety of others\", they can participate in services. The District Court granted summary judgment, and First Circuit Court of appeals affirmed.",
    issue: "Whether a non-symptomatic HIV infection is a disability under the ADA; Whether the Court of Appeals cited sufficient evidence to determine that the HIV infection posed no direct threat.",
    holding: "Asymptomatic HIV infection is a disability under the ADA; that is a physical impairment that limits one or more life activities. The First Circuit did not cite sufficient evidence that HIV posed no direct threat; case remanded for a full exploration of the direct threat issue.",
    significance: "In deciding whether or not Ms. Abbott's HIV infection constituted a disability under the ADA, the Court looked at the statutory definition of disability in the ADA which was drawn from the Rehabilitation Act of 1973: (A) A physical or mental impairment that substantially limits one or more of the major life activities; (B) A record of such an impairment; or (C) Being regarded as having such impairment. A physical or mental impairment means \"any physiological disorder or condition affecting the body\" and asymptomatic HIV infection falls within that definition. The life activity upon which Ms. Abbot relied in her argument is her ability to reproduce and bear children. The ADA defines a direct threat to be \"a significant risk to the health or safety of others that cannot be eliminated by a modification of policies, practices, or procedures, or by the provision of auxiliary aids or services.\" The existence of a significant risk is determined from the standpoint of the health care professional; and the risk assessment is based on the medical or other objective, scientific evidence available to him and his profession, not simply on his good faith belief that a significant risk existed. The Court of Appeals relied on old dentistry journals/standards.",
    elements: ["Physical/mental impairment","Substantially limits major life activity","Direct threat must be based on objective evidence"] },
  { id: "olmstead", name: "Olmstead v. L.C./Zimring", year: 1999, court: "SCOTUS", category: "ADA",
    facts: "L.C. and E.W. (Zimring is L.C.'s guardian ad litem) had MR and psychiatric illness; were committed to a hospital; requested placement in a community-based program as the treatment team thought they were ready. The women filed suit in the US DC of Georgia alleging that the State's failure to place her in a community violated Title II of the ADA which specifies that no individual with disability shall be excluded from participation in a public entity's services, ADA regulations required public entities to administer programs in the most integrated setting appropriate to needs of disabled individuals; it further requires public entities to \"make reasonable modifications\" to avoid discrimination on the basis of disability, but does not require the program to \"fundamentally alter\" their program. DC granted partial summary judgment, ordering their placement in an appropriate community-based treatment program and that lack of funding is not an excuse. The Eleventh Circuit affirmed but remanded for reassessment on the cost-based defense.",
    issue: "Whether the ADA Title II's definition of discrimination requires placement off persons with mental disabilities in community settings rather than institutions.",
    holding: "Yes. Unjustified institutional isolation is discrimination. Community placement required when (1) professionals say appropriate, (2) person doesn't oppose, (3) reasonable accommodation possible.",
    significance: "\"A public entity shall make reasonable modifications in policies, practices, or procedures when the modifications are necessary to avoid discrimination on the basis of disability, unless the public entity can demonstrate that making the modifications would fundamentally alter the nature of the service or program.\" The integration and reasonable-modification regulations issued by the Attorney General rest on two key determinations: (1) Unjustified detention of persons in institutions severely limits their exposure to the outside community, and therefore constitutes a form of discrimination prohibited by Title II, and (2) Qualifying their obligation to avoid unjustified isolation of individuals with disabilities, States can resist modifications that would \"fundamentally alter\" the nature of their services. The majority rejected the argument of the dissenting judges that the women were not subjected to discrimination because they identified no comparison class of similarly situated individuals given preferential treatment. The ADA explicitly identified unjustified \"segregation\" of persons with disabilities as discrimination. Institutional placement of persons who can handle community settings perpetuates unwarranted assumptions that such persons are incapable or unworthy of participating in community life. Furthermore, institutional confinement severely diminishes everyday life activities. Dissimilar treatment exists because in order to receive needed medical services, persons with mental disabilities must relinquish participation in community life they could enjoy given reasonable accommodations, while persons without mental disabilities can receive the medical services without similar sacrifice.",
    elements: ["Professionals deem appropriate","Individual does not oppose","Reasonable accommodation possible without fundamental alteration"] },
  { id: "us_georgia", name: "U.S. v. Georgia", year: 2006, court: "SCOTUS", category: "ADA",
    facts: "Mr. Goodman, a paraplegic inmate in a Georgia prison, filed a complaint in DC against GA and thee GA DOC challenging the conditions of his confinement; alleged that his small cell prevented him from turning his wheelchair around making him unable to use the toilet, shower without assistance thereby leaving him to remain in his feces for hours at a time. He alleged he was repeatedly injured when he attempted self-care tasks without assistance or appropriate accommodations. He also claimed that he had been denied PT and access to services based on his disability. Goodman brought claims under 42 U.S.C. §1983 and Title II of the ADA, seeking both injunctive relief and money damages. The DC dismissed both claims, the 11th Circuit COA held that the DC erred in dismissing his §1983 claims as there were three Eighth Amendment claims relating to the cruel and unusual conditions of his confinement. The Court of Appeals affirmed the DC's holding that Goodman's Title II claims for money damages against the State were barred by sovereign immunity. SC granted cert on appeal.",
    issue: "Can a disabled inmate in a state prison sue the State for money damages under Title II of the Americans with Disabilities Act of 1990?",
    holding: "Insofar as Title II creates a private cause of action for damages against States for conduct that actually violates the Fourteenth Amendment, Title II validly abrogates state sovereign immunity.",
    significance: "The abrogation doctrine is a constitutional law doctrine expounding when and how Congress may waive a state's Sovereign immunity and subject it to lawsuits that to which the state has not consented (i.e., to \"abrogate\" their immunity to such suits). The ADA specifically notes that a State shall not be immune from an action in Federal or State court that violates that ADA. The Eleventh Circuit noted that Goodman was a disabled inmate who had likely been subjected to cruel and unusual punishment in violation of the 8th Amendment, which is applied to the states through the 14th Amendment. Section 5 of the 14th Amendment allows Congress to abrogate state sovereign immunity by authorizing private suits for damages against the States when there are violations of the 14th amendment. Therefore, Goodman may sue the State for money damages under Title II of the ADA for conduct found to violate the 14th Amendment. The Court noted that the lower courts were in a better position to determine if the State actually violated Title II and to what extent such misconduct also violated the 14th amendment.",
    elements: ["Title II claim","Conduct violates 14th Amendment","Sovereign immunity abrogated under §5 of 14th Amendment"] },
  { id: "hurd", name: "State v. Hurd", year: 1981, court: "NJ Sup. Ct.", category: "Hypnosis",
    facts: "Paul Hurd was accused of stabbing his ex-wife. A key witness was hypnotized by a psychiatrist with 2 LE officers present, to \"refresh her memory\", where they asked leading questions. Hurd as a defense brought expert testimony that hypnosis might be unreliable or highly susceptible to suggestibility/coercion. New Jersey had no rules governing hypnotically refreshed testimony.",
    issue: "Should hypnotically refreshed testimony be admissible, and if so, under what conditions?",
    holding: "Hypnotically refreshed testimony can be admissible if certain procedural safeguards are followed, but is subject to significant scrutiny. If using hypnosis testimony, must prove it's not coercive by clear and convincing evidence. NJ adopted the Hurd guidelines.",
    significance: "The court recognized that hypnosis can both aid memory recall and create false memories or heightened suggestibility. Hypnotically refreshed testimony is admissible only if strict procedural safeguards are followed: (1) only qualified mental health professional conducts hypnosis; (2) session is recorded; (3) the hypnotist cannot be beholden to either side; (4) only the hypnotist and subject present; (5) all communications preserved; (6) LE information give to hypnotist must be written down. Pre-hypnosis memories admissible; post-hypnosis additions are scrutinized. NJ Hurd guidelines became widely adopted; balance between allowing hypnotic evidence and guarding against false memories.",
    elements: ["Qualified hypnotist","Recorded session","Neutral hypnotist","Only hypnotist + subject present","All communications preserved","Written LE info"] },
  { id: "shirley", name: "People v. Shirley", year: 1982, court: "CA Sup. Ct.", category: "Hypnosis",
    facts: "Mr. Shirley was convicted of rape and appealed; the prosecution's witness had been hypnotized by police to refresh her memory. Shirley sought to use expert testimony about the unreliability of hypnotically refreshed memory to challenge the witness's credibility.",
    issue: "Should hypnotically refreshed testimony from a witness be admissible? What is the effect of hypnosis on testimonial reliability?",
    holding: "In California, a witness who has undergone hypnosis to refresh recollection is prohibited from testifying about matters covered under hypnosis; only pre-hypnosis recollections are admissible; conviction was reversed.",
    significance: "Hypnosis is not generally accepted as a reliable means of enhancing memory. Under the Kelly-Frye standard (California's version of Frye), hypnotically refreshed testimony fails the general acceptance test in the scientific community. Post-hypnotic testimony is inherently unreliable because hypnosis can create false memories and make subjects highly resistant to cross-examination. Only pre-hypnosis statements retained in the written record are admissible. California approach: more restrictive than Hurd; post-hypnosis testimony is generally inadmissible.",
    elements: ["Post-hypnosis testimony excluded","Only pre-hypnosis statements admissible","Hypnosis fails general acceptance test"] },
  { id: "landeros", name: "Landeros v. Flood", year: 1976, court: "CA Sup. Ct.", category: "Child Abuse Reporting",
    facts: "An 11-month-old child with multiple fractures and injuries consistent with battered child syndrome was brought to a hospital. The treating physician failed to diagnose child abuse, failed to report it, and returned the child to her parents. The child suffered further abuse.",
    issue: "Can a physician be held liable for failing to diagnose and report child abuse when the symptoms were present?",
    holding: "Yes. A physician who fails to diagnose and report battered child syndrome when the clinical signs are present can be held liable for subsequent injuries the child suffers as a result of being returned to the abusive home.",
    significance: "Physicians are mandated reporters of child abuse. The battered child syndrome is a recognized medical diagnosis with identifiable clinical signs. A physician who fails to diagnose and report child abuse when the signs are present breaches the standard of care. The cause of action lies in negligence; foreseeability of harm establishes the causal link between the physician's failure to report and subsequent abuse. Established physician liability for failure to recognize and report battered child syndrome; reinforced mandatory reporting laws.",
    elements: ["Battered child syndrome is diagnosable","Failure to report breaches standard of care","Foreseeability of subsequent harm"] },
  { id: "stritzinger", name: "People v. Stritzinger", year: 1983, court: "CA Sup. Ct.", category: "Child Abuse Reporting",
    facts: "During therapy, a man disclosed that he was sexually abusing his stepdaughter. The therapist reported the abuse to authorities. The defendant sought to suppress the report as a breach of therapist-patient privilege.",
    issue: "Does the therapist-patient privilege bar a therapist from reporting child sexual abuse disclosed during therapy, when the patient is the abuser?",
    holding: "No. The child abuse mandatory reporting law overrides the therapist-patient privilege. Therapists must report when they have reasonable suspicion that a child is being abused, even if this information is disclosed in a confidential therapeutic relationship.",
    significance: "The mandatory child abuse reporting law represents a legislative determination that the protection of children from abuse outweighs the individual's interest in confidentiality. The privilege does not shield disclosures of ongoing child abuse. The therapist's reporting obligation is not discretionary when the statutory criteria are met. Privilege yields to mandatory reporting; therapist-patient privilege does not protect disclosure of ongoing child abuse.",
    elements: ["Mandatory reporting overrides privilege","Not discretionary if statutory criteria met"] },
  { id: "andring", name: "State v. Andring", year: 1984, court: "MN Sup. Ct.", category: "Child Abuse Reporting",
    facts: "During group therapy sessions at a psych hospital following charges of sexual misconduct with a minor, Andring voluntarily committed himself, and made statements relevant to a criminal investigation. The prosecution sought to get records from individual and group sessions. Trial court granted group therapy records. Minnesota's psychiatrist-patient privilege was at issue, in relation to statements made during group therapy.",
    issue: "Does the psychiatrist-patient privilege extend to statements made in a group therapy context?",
    holding: "Yes. The privilege extends to group therapy settings. Child abuse reporting state laws > federal law about tx and confidentiality.",
    significance: "The purpose of the psychiatrist-patient privilege is to encourage patients to be candid in therapy. Group therapy is a recognized and effective treatment modality. If statements made in group therapy were not privileged, patients would be inhibited from speaking candidly, undermining the therapeutic process. Extended privilege to group therapy; recognized that confidentiality is essential to effective group therapeutic treatment. Reporting is limited to specific information, privilege is not completely discarded.",
    elements: ["Group therapy privileged","Limited disclosure for mandatory reporting","Privilege not fully waived in group setting"] },
  { id: "deshaney", name: "DeShaney v. Winnebago", year: 1989, court: "SCOTUS", category: "Child Abuse Reporting",
    facts: "Four-year-old Joshua DeShaney was repeatedly beaten by his father. Winnebago County DSS received reports of abuse and investigated but failed to remove Joshua from his father's custody. Joshua was ultimately beaten so severely he suffered permanent brain damage.",
    issue: "Does the 14th Amendment's Due Process Clause impose an affirmative duty on the state to protect an individual from private violence when state officials were aware of the danger?",
    holding: "No. The 14th Amendment does not impose a duty on the state to protect individuals from private violence. The due process clause is a limitation on state action, not a guarantee of state protection.",
    significance: "The Due Process Clause was intended to protect individuals from the state, not to impose affirmative obligations on the state to protect individuals from each other. The state did not take Joshua into custody, so it did not create the danger. An exception might exist if the state created the danger or had a custodial relationship, but neither applied here. DSS workers felt powerless to intervene given the evidence available. Major limitation on state protective duty; exception carved out for 'danger creation' doctrine and custodial relationships.",
    elements: ["No affirmative duty in non-custodial settings","State-created danger exception","Custodial relationship exception"] },
  { id: "painter", name: "Painter v. Bannister", year: 1966, court: "IA Sup. Ct.", category: "Child Custody",
    facts: "Mark Painter's mother died and his father (an artist) left him in the care of maternal grandparents, the Bannisters. When the father sought to reclaim custody, the Bannisters (who were stable, conservative farmers) refused. The court had to determine best interests of the child.",
    issue: "In a custody dispute between a parent and non-parent, what standard governs the determination of where the child should live?",
    holding: "The child's best interests govern custody determinations. The court upheld custody with the Bannister grandparents despite the father's legal rights, finding the stable, structured environment better served the child's interests.",
    significance: "While parents generally have a superior right to custody over third parties, the best interests of the child may override the parent's right when the child has bonded with non-parents and the parent's lifestyle or circumstances may not serve the child's wellbeing. The court considered the stability of the grandparents' home, Mark's adjustment, and the father's bohemian lifestyle and uncertain prospects. Important for establishing best interests standard over parental rights in custody disputes; controversial for lifestyle considerations.",
    elements: ["Best interests of child","Can override parental presumption","Stability and attachment considered"] },
  { id: "santosky", name: "Santosky v. Kramer", year: 1982, court: "SCOTUS", category: "Child Custody",
    facts: "The Santosky children were adjudicated permanently neglected by their parents. New York sought to terminate parental rights using a fair preponderance of the evidence standard.",
    issue: "What standard of proof is constitutionally required for termination of parental rights?",
    holding: "Clear and convincing evidence is the minimum standard constitutionally required for termination of parental rights, not merely preponderance of the evidence.",
    significance: "Parental rights are fundamental liberty interests protected by the Due Process Clause. Termination is a drastic and irreversible action. At stake is the parents' interest in the care and custody of their children, and the children's interest in preserving family relationships. The risk of erroneous deprivation under a preponderance standard is too high given the profound stakes. Clear and convincing evidence better balances the interests involved. Fundamental case for child welfare law; established clear and convincing evidence standard for termination of parental rights.",
    elements: ["Clear and convincing evidence","Parental rights are fundamental","Higher than preponderance"] },
  { id: "gault", name: "In re Gault", year: 1967, court: "SCOTUS", category: "Juvenile Court/Education Services",
    facts: "Gerald Gault, 15, was committed to a juvenile detention facility for up to 6 years for making an obscene phone call. Adults could receive only a $5-$50 fine or 2 months in jail for the same offense. No notice, no attorney, no right to confront witnesses, no privilege against self-incrimination was provided.",
    issue: "Do juveniles in delinquency proceedings have the same constitutional due process rights as adults in criminal proceedings? (i.e. same 14th amend due process as adults?).",
    holding: "Yes. Juveniles have constitutional rights in delinquency proceedings that could result in commitment to an institution, including: notice of charges, right to counsel, privilege against self-incrimination, and right to confront witnesses.",
    significance: "The juvenile justice system's parens patriae philosophy does not justify denying juveniles fundamental constitutional rights. The consequences of a delinquency adjudication (loss of liberty) are no less severe than criminal conviction. The informality of juvenile proceedings does not guarantee fair outcomes and may actually deprive juveniles of important protections. The 14th Amendment's Due Process Clause requires these fundamental protections. Landmark juvenile rights case; transformed juvenile justice system to provide constitutional protections; influenced by civil rights movement. Note: Chicago had first juvenile court in United States. Also juvenile courts don't have a \"jury of peers\".",
    elements: ["Notice of charges","Right to counsel","Confrontation/cross-exam","Self-incrimination privilege"] },
  { id: "fare", name: "Fare v. Michael C.", year: 1979, court: "SCOTUS", category: "Juvenile Court/Education Services",
    facts: "A 16-year-old (Michael) was suspected of murder and brought in for questioning. He asked to speak with his probation officer rather than an attorney. Police denied this request and continued questioning. Michael eventually made incriminating statements.",
    issue: "When a juvenile asks to speak with his probation officer during police interrogation, does this invoke the right to remain silent under Miranda?",
    holding: "No. A juvenile's request to speak with his probation officer during custodial interrogation does not per se invoke the right to silence under Miranda. Courts must evaluate the totality of circumstances to determine if a waiver of Miranda rights was valid.",
    significance: "Miranda protects the right to counsel and right to silence. A probation officer is not equivalent to an attorney; the request does not amount to an invocation of the right to counsel. Courts should look at the totality of circumstances (age, experience, background, intelligence, capacity to understand) to determine if the juvenile validly waived Miranda rights. Michael's waiver was found valid. Request for probation officer ≠ invocation of Miranda; totality of circumstances test for juvenile Miranda waivers.",
    elements: ["Probation officer ≠ attorney","Totality of circumstances","Age, experience, capacity considered"] },
  { id: "rowley", name: "Board of Education v. Rowley", year: 1982, court: "SCOTUS", category: "Juvenile Court/Education Services",
    facts: "Amy Rowley, a deaf student, was doing well in school with a hearing aid and sign language interpreter part-time. Her parents sought a full-time interpreter under the Education for All Handicapped Children Act (EAHCA/IDEA). The school denied this, and the parents challenged the school's IEP.",
    issue: "What educational standard does the IDEA/EAHCA require schools to provide to disabled students?",
    holding: "Schools must provide an educational program reasonably calculated to enable the child to receive educational benefits. The law does not require schools to maximize a student's potential, only to provide a basic floor of educational opportunity.",
    significance: "The EAHCA requires (1) compliance with procedural requirements, and (2) an IEP reasonably calculated to enable the child to receive educational benefits. The standard is not to maximize the child's potential or provide the best possible education, but to provide access to education with individualized services that confer a meaningful benefit. Amy was advancing grade-to-grade and performing better than average - she was receiving educational benefit. Established the 'educational benefit' standard for IDEA; schools need not maximize potential, only provide meaningful educational benefit.",
    elements: ["Procedural compliance","IEP reasonably calculated for educational benefit","Not required to maximize potential"] },
  { id: "tatro", name: "Irving ISD v. Tatro", year: 1984, court: "SCOTUS", category: "Juvenile Court/Education Services",
    facts: "Amber Tatro had spina bifida and needed clean intermittent catheterization (CIC) every 3-4 hours to attend school. The Irving Independent School District refused to provide CIC, classifying it as an excluded 'medical service' rather than a required 'related service' under IDEA.",
    issue: "Is clean intermittent catheterization (CIC) a 'related service' the school district must provide under IDEA, or is it an excluded 'medical service'?",
    holding: "Yes. CIC is a 'related service' the school district must provide. The test for a 'medical service' exclusion is whether the service must be performed by a physician. Since CIC can be performed by trained nurses or laypersons, it is a required school health service, not an excluded medical service.",
    significance: "IDEA requires related services necessary for the disabled child to benefit from special education. The exclusion for 'medical services' applies only to services that must be performed by a physician. CIC is a simple procedure that trained non-physicians can perform, and is necessary for Amber to attend school. School districts must provide it. Defines medical services exclusion under IDEA; physician requirement is the key test to distinguish school health services from excluded medical services.",
    elements: ["Related service if non-physician can perform","Necessary for child to benefit from special education","Medical service exclusion narrowly construed"] },
  { id: "graham", name: "Graham v. Florida", year: 2010, court: "SCOTUS", category: "Juvenile Sentencing",
    facts: "Terrance Graham was 16 when he committed armed burglary. After violating his probation, he was sentenced to life in prison without the possibility of parole for the non-homicide offense. Florida law permitted life without parole for juveniles who commit certain non-homicide crimes.",
    issue: "Does the 8th Amendment prohibit sentencing juvenile offenders to life imprisonment without the possibility of parole for non-homicide offenses?",
    holding: "Yes. The Cruel and Unusual Punishments Clause of the 8th Amendment prohibits imposing life without parole on juvenile offenders for non-homicide crimes.",
    significance: "Juveniles are constitutionally different from adults in their culpability. They have diminished moral responsibility due to their still-developing brains, susceptibility to peer pressure, and capacity for change and rehabilitation. A sentence of life without parole forswears any consideration of the juvenile's rehabilitation or growth. For non-homicide offenses, this is disproportionate. States may imprison juvenile non-homicide offenders for lengthy periods but must provide some realistic opportunity for release based on demonstrated maturity and rehabilitation. Extends Roper v. Simmons; bars LWOP for juvenile non-homicide offenders; preceded Miller v. Alabama.",
    elements: ["Under 18 at offense","Non-homicide offense","Categorical 8th Amendment bar"] },
  { id: "miller", name: "Miller v. Alabama", year: 2012, court: "SCOTUS", category: "Juvenile Sentencing",
    facts: "Evan Miller was 14 when he and a friend beat a neighbor and set fire to his home, killing him. Miller was convicted of capital murder and sentenced to mandatory life imprisonment without the possibility of parole. Alabama law required this sentence upon conviction. *actually is a combined case of multiple 14 year olds.",
    issue: "Does the 8th Amendment prohibit mandatory life without parole sentences for juvenile homicide offenders?",
    holding: "Yes. Mandatory life without parole for juvenile homicide offenders violates the 8th Amendment's prohibition on cruel and unusual punishment.",
    significance: "Combining Roper, Graham, and Eighth Amendment proportionality principles: juvenile offenders are constitutionally different from adult offenders. Mandatory sentencing schemes that prevent consideration of a juvenile's special circumstances and potential for rehabilitation are unconstitutional. Sentencing courts must have the opportunity to consider youth and its attendant characteristics before imposing LWOP. This does not categorically bar LWOP for juveniles, but it cannot be mandatory. Does not categorically ban LWOP for juveniles who commit homicide; retroactive application confirmed in Montgomery v. Louisiana (2016).",
    elements: ["Mandatory LWOP barred","Individualized sentencing required","Consider youth and circumstances"] },
  { id: "ibntamas", name: "Ibn-Tamas v. U.S.", year: 1979, court: "D.C. Ct. App.", category: "Diminished Capacity",
    facts: "Ms. Ibn-Thomas was convicted of 2nd degree murder as while armed, she shot her husband to death. Evidence was presented that the victim had been violent towards his wife and others; the morning of the shooting, Ms. Tamas was beaten by her husband and kicked out of the house; the extent of self-defense was discussed in court and expertise was sought from a clinical psychologist who was a defense expert on the subject of \"battered women\"; the trial court excluded this testimony because they felt it was prejudicial towards the jury.",
    issue: "Whether the defense expert's testimony should be admitted.",
    holding: "The appellate court held that the TC erred in barring this testimony because it was not going to 'invade the province of the jury'; case was remanded to gather more evidence on the psychologist's methodology.",
    significance: "There are 2 ways an expert can subvert the jury's function - they can speak directly about the ultimate issue, or can speak with no more sophistication than the average layman (beyond the ken). With respect to admission testimony in matters that are not \"beyond the ken\", it is admissible if: the subject matter is beyond the lay person, the expert has sufficient knowledge and experience that will aid the trier of fact, and the state in question does not have a law against it.",
    elements: ["Beyond ken of layperson","Expert has sufficient knowledge","Aids trier of fact","No state law against it"] },
  { id: "egelhoff", name: "Montana v. Egelhoff", year: 1996, court: "SCOTUS", category: "Diminished Capacity",
    facts: "James Egelhoff was found in a vehicle with two dead companions and a recently fired pistol. He was extremely intoxicated (blood alcohol 0.36). Montana law prohibited defendants from presenting evidence of voluntary intoxication to negate the mental state (mens rea) element of a crime. Egelhoff argued this violated due process.",
    issue: "Does a state law prohibiting defendants from introducing evidence of voluntary intoxication to negate the mental state element of a crime violate the Due Process Clause?",
    holding: "No. Montana's prohibition on using voluntary intoxication evidence to negate mens rea does not violate due process. States may make this legislative policy choice without violating the Constitution.",
    significance: "No single majority. Plurality: there is a historical tradition of not excusing crimes committed due to voluntary intoxication. A state may legitimately decide persons who voluntarily become intoxicated assume responsibility for their conduct. Excluding this evidence furthers state interests in deterring intoxicated criminal conduct.",
    elements: ["Historical tradition against intoxication defense","State interest in deterring intoxicated conduct","Voluntary intoxication = assumed responsibility"] },
  { id: "hartogs", name: "Roy v. Hartogs", year: 1976, court: "NY App. Ct.", category: "HIPAA & Patient Liability",
    facts: "Plaintiff Julie Roy filed suit for damages against her psychiatrist Dr. Hartogs, claiming he had sex w/ her as part of prescribed therapy; said she was so emotionally injured she sought hospitalization 2x; defendant claimed that suit was invalid because NY had abolished 'suits for seduction'; trial court awarded compensatory and punitive damages of $153k.",
    issue: "Whether Hartogs' actions constituted malpractice and whether the case was barred by \"Heart Balm Act\" which limited claims r/t 'seduction'.",
    holding: "Verdict upheld but damages reduced; Appellatee Court held that the action was not barred by Heart Balm; there were damages for failure to properly treat; comp damages reduced to 25k; punitive damages denied entirely.",
    significance: "Punitive damages prohibited because Appellate Court did not believe the defendant had evil or malicious intent; cited Freud's advice to not sleep with or kiss patients in opinion.",
    elements: ["Sex with patient = malpractice","Compensatory damages allowed","Punitive requires malicious intent"] },
  { id: "clites", name: "Clites v. Iowa", year: 1982, court: "IA Ct. App.", category: "HIPAA & Patient Liability",
    facts: "Plaintiff Mr. Clites who had MR, was in a state hospital since adolescence and given medication to curb aggression; got TD; father filed suit for negligent use of drugs and that the defendants failed to provide reasonable medical care; trial court agreed; defendants appealed alleging trial court used an incorrect standard regarding use of tranquilizers and informed consent.",
    issue: "Whether the trial court had applied correct standard of care, and whether the awarded damages were excessive and unsupported by evidence.",
    holding: "COA held that the trial court and applied the correct standard of carer and that the damages were appropriate. Award of 385k for future medical expenses and $275k for past and future pain and suffering was not found to be excessive.",
    significance: "There was insufficient evidence that Mr. Clites had severe aggression or self injury to justify the use of the medications; the staff failed to adequately monitor Mr. Clites for TD; failed to stop the meds when TD emerged; staff failed to consult TD experts; polypharmacy masked the TD symptoms; use of meds was seen as convenience for staff rather than a therapeutic program. Court said that the First Amendmeent gives patient a right to refuse, and an institution is required to obtain informed consent. Mr. Clites' parents knew he was receiving medications but risks were not explained nor ws consent sought.",
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
  { term: 'Res ipsa loquitur', def: '"The thing speaks for itself." Negligence inferred from the nature of the accident. Elements: (1) exclusive control by defendant, (2) wouldn\'t ordinarily occur without negligence, (3) no plaintiff contribution, (4) evidence eliminates other causes. When res ipsa loquitur applies, the burden of proof shifts from the plaintiff to the defendant — the defendant must prove that negligence did not occur.' },
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
  { id: 'dispositions', cat: 'Trial Process', title: 'Case Dispositions: Demurrer, Summary Judgment, Directed Verdict, JNOV',
    body: 'Four ways a court can end a case (or claim) without — or despite — a jury verdict, each at a different stage of litigation.',
    points: ['Demurrer (pleadings stage): even if all alleged facts are true, they don\u2019t state a valid legal claim. Tests the law, not the evidence.', 'Summary judgment (pre-trial, after discovery): no genuine dispute of material fact, so the movant wins as a matter of law.', 'Directed verdict (mid-trial, before the jury deliberates): no reasonable jury could find for that party on the evidence.', 'JNOV \u2013 judgment notwithstanding the verdict (post-verdict): judge overturns the jury because no reasonable jury could have reached it.', 'Sequence: pleadings \u2192 demurrer \u00b7 pre-trial \u2192 summary judgment \u00b7 mid-trial \u2192 directed verdict \u00b7 post-verdict \u2192 JNOV'] },
  { id: 'appellate', cat: 'Appeals', title: 'Appellate Review',
    body: 'An appellate court reviews the trial record for ERRORS of law. It does NOT hold a retrial, hear new evidence, or call new witnesses.',
    points: ['Reviews for legal error', 'No retrial / no new evidence', 'May affirm, reverse, or remand'] },
  { id: 'appeals_court', cat: 'Appeals', title: 'Appeals Court & Certiorari',
    body: 'A litigant is generally guaranteed ONE appeal as of right. Further review by the supreme court is discretionary — granted by a writ of certiorari.',
    points: ['One guaranteed appeal (as of right)', 'Higher review is discretionary', 'Writ of certiorari = the order granting review'] },
  { id: 'standards_review', cat: 'Appeals', title: 'Standards of Appellate Review: De Novo vs. Abuse of Discretion',
    body: 'An appellate court doesn\u2019t re-try the case \u2014 it reviews the lower court\u2019s decision under a standard of review that sets how much deference it gives. That standard often decides the appeal. The two most commonly tested are de novo (no deference) and abuse of discretion (high deference).',
    points: ['De novo ("anew"): no deference to the trial court. Used for questions of law \u2014 statutory interpretation, constitutional issues, whether the correct legal standard was applied. The appellate court decides the issue fresh, as if for the first time.', 'Abuse of discretion: high deference. Used for discretionary trial-court calls \u2014 evidentiary rulings, admitting or excluding expert testimony, continuances, discovery. Reversed only if the decision was arbitrary, unreasonable, or rested on a legal error \u2014 not merely because the appellate court would have ruled differently.', 'Rule of thumb: questions of law \u2192 de novo; judgment calls within the trial judge\u2019s authority \u2192 abuse of discretion.', 'Between these sit intermediate standards (e.g., "clearly erroneous" for a trial judge\u2019s findings of fact).'] },
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
function generateTermsQuestions() {
  const qs = [];
  for (const t of TERMS) {
    const d = pickDistractors(TERMS, t, x => x.term, 3).map(x => x.term);
    const { options, correct } = makeOptions(t.term, d);
    qs.push({ q: `Which legal term matches this definition?\n\n"${t.def}"`, options, correct, explanation: `${t.term}: ${t.def}` });
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
    if (d === 'terms') return shuffleArr(generateTermsQuestions());
    return shuffleArr([
      ...generateCaseQuestions(CASES.filter(c => !buried['case:' + c.id])),
      ...generateConLawQuestions(buried), ...generateInsanityQuestions(buried), ...generateBasicLawQuestions(buried), ...generateTermsQuestions(),
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
    { id: 'terms', label: 'Legal Terms' },
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



