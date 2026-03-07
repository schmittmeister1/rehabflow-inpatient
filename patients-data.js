// =====================================================
// RehabFlow Inpatient EMR â 120 Mock Patient Cases
// Hospital inpatient PT/PTA training system
// Section GG, Assist Levels, Vitals, Precautions
// =====================================================

const FIRST_NAMES_F = ['Margaret','Patricia','Dorothy','Linda','Barbara','Susan','Nancy','Karen','Betty','Sandra','Sharon','Donna','Carol','Ruth','Maria','Lisa','Jennifer','Ashley','Amanda','Stephanie','Nicole','Jessica','Heather','Angela','Melissa','Amy','Michelle','Christina','Kimberly','Rebecca','Laura','Brenda','Cynthia','Catherine','Deborah','Gloria','Janet','Teresa','Rosa','Diane','Virginia','Tammy','Tina','Alma','Julia','Hannah','Megan','Olivia','Emily','Sophia','Grace'];
const FIRST_NAMES_M = ['James','Robert','Michael','David','William','Richard','Joseph','Thomas','Charles','Christopher','Daniel','Matthew','Anthony','Mark','Steven','Paul','Andrew','Joshua','Kenneth','Kevin','Brian','Timothy','Ronald','Jason','Jeffrey','Ryan','Jacob','Gary','Nicholas','Eric','Jonathan','Patrick','Raymond','Gregory','Benjamin','Samuel','Henry','Alexander','Tyler','Nathan','Ethan','Dylan','Carlos','Juan','Luis','Jorge','Miguel','Pedro','Frank','Dennis'];
const LAST_NAMES = ['Thompson','Rodriguez','Williams','Chen','Baker','Johnson','Martinez','Garcia','Brown','Davis','Wilson','Moore','Taylor','Anderson','Thomas','Jackson','White','Harris','Martin','Robinson','Clark','Lewis','Lee','Walker','Hall','Allen','Young','King','Wright','Scott','Green','Adams','Nelson','Hill','Campbell','Mitchell','Roberts','Carter','Phillips','Evans','Turner','Torres','Parker','Collins','Edwards','Stewart','Flores','Morris','Murphy','Rivera','Cook','Rogers','Reed','Morgan','Bell','Cooper','Richardson','Cox','Howard','Ward','Peterson','Gray','Ramirez','James','Watson','Brooks','Kelly','Sanders','Price','Bennett','Wood','Barnes','Ross','Henderson','Coleman','Jenkins','Perry','Butler','Foster','Simmons','Gonzalez','Bryant','Alexander','Russell','Griffin','Hayes','Myers','Ford','Hamilton','Graham','Sullivan','Wallace'];

// Inpatient diagnoses â neuro, cardiopulmonary, orthopedic, medical/surgical
const DIAGNOSES = [

  // ============== NEURO ==============
  { code:'I63.9', desc:'Cerebral infarction (CVA), unspecified', category:'Neuro', complexity:'high' },
  { code:'I63.511', desc:'Cerebral infarction due to occlusion of right middle cerebral artery', category:'Neuro', complexity:'high' },
  { code:'I63.512', desc:'Cerebral infarction due to occlusion of left middle cerebral artery', category:'Neuro', complexity:'high' },
  { code:'I63.411', desc:'Cerebral infarction due to embolism of right middle cerebral artery', category:'Neuro', complexity:'high' },
  { code:'I63.10', desc:'Cerebral infarction due to embolism of unspecified precerebral artery', category:'Neuro', complexity:'high' },
  { code:'I61.9', desc:'Hemorrhagic stroke, unspecified', category:'Neuro', complexity:'high' },
  { code:'I61.0', desc:'Nontraumatic intracerebral hemorrhage in hemisphere, subcortical', category:'Neuro', complexity:'high' },
  { code:'G81.91', desc:'Hemiplegia, unspecified, affecting right dominant side', category:'Neuro', complexity:'high' },
  { code:'G81.92', desc:'Hemiplegia, unspecified, affecting left dominant side', category:'Neuro', complexity:'high' },
  { code:'G82.20', desc:'Paraplegia, unspecified', category:'Neuro', complexity:'high' },
  { code:'S06.0X0A', desc:'Concussion without loss of consciousness, initial encounter', category:'Neuro', complexity:'moderate' },
  { code:'S06.5X0A', desc:'Traumatic subdural hemorrhage without loss of consciousness, initial', category:'Neuro', complexity:'high' },
  { code:'S14.109A', desc:'Incomplete spinal cord injury at C-spine level, initial', category:'Neuro', complexity:'high' },
  { code:'S24.109A', desc:'Incomplete spinal cord injury at T-spine level, initial', category:'Neuro', complexity:'high' },
  { code:'G35', desc:'Multiple sclerosis, acute exacerbation', category:'Neuro', complexity:'high' },
  { code:'G61.0', desc:'Guillain-BarrÃ© syndrome', category:'Neuro', complexity:'high' },
  { code:'G20', desc:'Parkinson disease, decompensation', category:'Neuro', complexity:'high' },
  { code:'G40.909', desc:'Epilepsy/status epilepticus, unspecified', category:'Neuro', complexity:'high' },
  { code:'G93.1', desc:'Anoxic brain injury, not elsewhere classified', category:'Neuro', complexity:'high' },

  // ============== CARDIOPULMONARY ==============
  { code:'I50.9', desc:'Heart failure, unspecified (CHF exacerbation)', category:'Cardiopulmonary', complexity:'high' },
  { code:'I50.22', desc:'Chronic systolic heart failure, acute exacerbation', category:'Cardiopulmonary', complexity:'high' },
  { code:'I50.23', desc:'Acute on chronic systolic (congestive) heart failure', category:'Cardiopulmonary', complexity:'high' },
  { code:'I50.33', desc:'Acute on chronic diastolic (congestive) heart failure', category:'Cardiopulmonary', complexity:'high' },
  { code:'I21.9', desc:'Acute myocardial infarction, unspecified (post-MI)', category:'Cardiopulmonary', complexity:'high' },
  { code:'I21.09', desc:'ST elevation myocardial infarction of anterior wall', category:'Cardiopulmonary', complexity:'high' },
  { code:'I21.11', desc:'ST elevation myocardial infarction of inferior wall', category:'Cardiopulmonary', complexity:'high' },
  { code:'I25.10', desc:'Atherosclerotic heart disease s/p CABG', category:'Cardiopulmonary', complexity:'high' },
  { code:'I25.110', desc:'Atherosclerotic heart disease of native coronary artery with unstable angina, s/p stent placement', category:'Cardiopulmonary', complexity:'high' },
  { code:'J96.00', desc:'Acute respiratory failure, unspecified hypoxia vs hypercapnia', category:'Cardiopulmonary', complexity:'high' },
  { code:'J96.01', desc:'Acute respiratory failure with hypoxia', category:'Cardiopulmonary', complexity:'high' },
  { code:'J44.1', desc:'COPD with acute exacerbation', category:'Cardiopulmonary', complexity:'high' },
  { code:'J44.0', desc:'COPD with acute lower respiratory infection', category:'Cardiopulmonary', complexity:'high' },
  { code:'J18.9', desc:'Pneumonia, unspecified organism', category:'Cardiopulmonary', complexity:'moderate' },
  { code:'J13', desc:'Pneumonia due to Streptococcus pneumoniae', category:'Cardiopulmonary', complexity:'moderate' },
  { code:'J15.1', desc:'Pneumonia due to Pseudomonas', category:'Cardiopulmonary', complexity:'high' },
  { code:'J12.82', desc:'Pneumonia due to COVID-19 virus', category:'Cardiopulmonary', complexity:'high' },
  { code:'I26.99', desc:'Pulmonary embolism without acute cor pulmonale', category:'Cardiopulmonary', complexity:'high' },
  { code:'I26.09', desc:'Saddle embolus of pulmonary artery with acute cor pulmonale', category:'Cardiopulmonary', complexity:'high' },

  // ============== COVID-19 / INFLUENZA / RESPIRATORY INFECTIONS ==============
  { code:'U07.1', desc:'COVID-19, virus identified', category:'Infectious', complexity:'high' },
  { code:'J12.89', desc:'COVID-19 pneumonia with acute respiratory distress', category:'Infectious', complexity:'high' },
  { code:'J09.X1', desc:'Influenza due to identified novel influenza A virus with pneumonia', category:'Infectious', complexity:'high' },
  { code:'J10.1', desc:'Influenza due to other identified influenza virus with pneumonia', category:'Infectious', complexity:'moderate' },
  { code:'J10.00', desc:'Influenza due to other identified influenza virus with unspecified type of pneumonia', category:'Infectious', complexity:'moderate' },

  // ============== HIP FRACTURE ==============
  { code:'S72.001A', desc:'Fracture of unspecified part of neck of right femur, initial', category:'Hip Fracture', complexity:'high' },
  { code:'S72.002A', desc:'Fracture of unspecified part of neck of left femur, initial', category:'Hip Fracture', complexity:'high' },
  { code:'S72.011A', desc:'Unspecified intracapsular fracture of right femur, initial', category:'Hip Fracture', complexity:'high' },
  { code:'S72.012A', desc:'Unspecified intracapsular fracture of left femur, initial', category:'Hip Fracture', complexity:'high' },
  { code:'S72.101A', desc:'Unspecified trochanteric fracture of right femur, initial', category:'Hip Fracture', complexity:'high' },
  { code:'S72.102A', desc:'Unspecified trochanteric fracture of left femur, initial', category:'Hip Fracture', complexity:'high' },
  { code:'S72.21XA', desc:'Subtrochanteric fracture of right femur, initial', category:'Hip Fracture', complexity:'high' },
  { code:'S72.22XA', desc:'Subtrochanteric fracture of left femur, initial', category:'Hip Fracture', complexity:'high' },

  // ============== JOINT REPLACEMENT ==============
  { code:'Z96.641', desc:'Presence of right artificial hip joint (s/p right THA)', category:'Joint Replacement', complexity:'high' },
  { code:'Z96.642', desc:'Presence of left artificial hip joint (s/p left THA)', category:'Joint Replacement', complexity:'high' },
  { code:'Z96.651', desc:'Presence of right artificial knee joint (s/p right TKA)', category:'Joint Replacement', complexity:'high' },
  { code:'Z96.652', desc:'Presence of left artificial knee joint (s/p left TKA)', category:'Joint Replacement', complexity:'high' },
  { code:'Z96.611', desc:'Presence of right artificial shoulder joint (s/p right TSA)', category:'Joint Replacement', complexity:'high' },
  { code:'Z96.612', desc:'Presence of left artificial shoulder joint (s/p left TSA)', category:'Joint Replacement', complexity:'high' },
  { code:'M87.051', desc:'Idiopathic aseptic necrosis of right femur, s/p hemiarthroplasty', category:'Joint Replacement', complexity:'high' },

  // ============== TRAUMA / MOTOR VEHICLE ACCIDENT / GUNSHOT ==============
  { code:'V43.52XA', desc:'Car passenger injured in collision with SUV, initial encounter (MVA)', category:'Trauma', complexity:'high' },
  { code:'V43.62XA', desc:'Car passenger injured in collision with heavy transport vehicle, initial', category:'Trauma', complexity:'high' },
  { code:'S72.301A', desc:'Unspecified fracture of shaft of right femur, initial (MVA)', category:'Trauma', complexity:'high' },
  { code:'S72.302A', desc:'Unspecified fracture of shaft of left femur, initial (MVA)', category:'Trauma', complexity:'high' },
  { code:'S22.31XA', desc:'Fracture of one rib, right side, initial encounter (MVA)', category:'Trauma', complexity:'moderate' },
  { code:'S27.0XXA', desc:'Traumatic pneumothorax, initial encounter (MVA)', category:'Trauma', complexity:'high' },
  { code:'S32.009A', desc:'Unspecified fracture of lumbar vertebra, initial (MVA)', category:'Trauma', complexity:'high' },
  { code:'S82.101A', desc:'Unspecified fracture of upper end of right tibia, initial (MVA)', category:'Trauma', complexity:'high' },
  { code:'S22.009A', desc:'Unspecified fracture of unspecified thoracic vertebra, initial', category:'Trauma', complexity:'high' },
  { code:'T14.8XXA', desc:'Other injury of unspecified body region, initial (polytrauma)', category:'Trauma', complexity:'high' },
  // Gunshot wounds
  { code:'S31.109A', desc:'Unspecified open wound of abdominal wall, unspecified quadrant with penetration (GSW abdomen)', category:'Trauma', complexity:'high' },
  { code:'S71.001A', desc:'Unspecified open wound, right hip (GSW right hip/thigh)', category:'Trauma', complexity:'high' },
  { code:'S81.001A', desc:'Unspecified open wound, right lower leg (GSW right lower extremity)', category:'Trauma', complexity:'high' },
  { code:'S21.109A', desc:'Unspecified open wound of front wall of thorax (GSW chest, post-thoracotomy)', category:'Trauma', complexity:'high' },
  // Penetrating mechanism
  { code:'W34.00XA', desc:'Accidental discharge from unspecified firearms, initial encounter', category:'Trauma', complexity:'high' },
  { code:'X95.9XXA', desc:'Assault by unspecified firearm discharge, initial encounter', category:'Trauma', complexity:'high' },

  // ============== SEPSIS ==============
  { code:'A41.9', desc:'Sepsis, unspecified organism', category:'Sepsis', complexity:'high' },
  { code:'A41.01', desc:'Sepsis due to Methicillin susceptible Staphylococcus aureus (MSSA)', category:'Sepsis', complexity:'high' },
  { code:'A41.02', desc:'Sepsis due to Methicillin resistant Staphylococcus aureus (MRSA)', category:'Sepsis', complexity:'high' },
  { code:'A41.51', desc:'Sepsis due to Escherichia coli (E. coli)', category:'Sepsis', complexity:'high' },
  { code:'A40.0', desc:'Sepsis due to streptococcus, group A', category:'Sepsis', complexity:'high' },
  { code:'R65.20', desc:'Severe sepsis without septic shock', category:'Sepsis', complexity:'high' },
  { code:'R65.21', desc:'Severe sepsis with septic shock', category:'Sepsis', complexity:'high' },
  { code:'A41.89', desc:'Other specified sepsis (urosepsis)', category:'Sepsis', complexity:'high' },

  // ============== CANCER / ONCOLOGY ==============
  { code:'C34.90', desc:'Malignant neoplasm of unspecified part of bronchus or lung', category:'Cancer', complexity:'high' },
  { code:'C34.11', desc:'Malignant neoplasm of upper lobe, right bronchus or lung', category:'Cancer', complexity:'high' },
  { code:'C50.911', desc:'Malignant neoplasm of unspecified site of right female breast', category:'Cancer', complexity:'high' },
  { code:'C50.912', desc:'Malignant neoplasm of unspecified site of left female breast', category:'Cancer', complexity:'high' },
  { code:'C18.9', desc:'Malignant neoplasm of colon, unspecified (colorectal cancer)', category:'Cancer', complexity:'high' },
  { code:'C61', desc:'Malignant neoplasm of prostate', category:'Cancer', complexity:'high' },
  { code:'C25.9', desc:'Malignant neoplasm of pancreas, unspecified', category:'Cancer', complexity:'high' },
  { code:'C71.9', desc:'Malignant neoplasm of brain, unspecified', category:'Cancer', complexity:'high' },
  { code:'C22.0', desc:'Liver cell carcinoma (hepatocellular carcinoma)', category:'Cancer', complexity:'high' },
  { code:'C90.00', desc:'Multiple myeloma not having achieved remission', category:'Cancer', complexity:'high' },
  { code:'C91.00', desc:'Acute lymphoblastic leukemia not having achieved remission', category:'Cancer', complexity:'high' },
  { code:'C83.30', desc:'Diffuse large B-cell lymphoma, unspecified site', category:'Cancer', complexity:'high' },

  // ============== DIABETES / ENDOCRINE ==============
  { code:'E11.65', desc:'Type 2 diabetes mellitus with hyperglycemia', category:'Diabetes', complexity:'moderate' },
  { code:'E11.641', desc:'Type 2 diabetes mellitus with hypoglycemia with coma', category:'Diabetes', complexity:'high' },
  { code:'E11.10', desc:'Type 2 diabetes mellitus with ketoacidosis without coma', category:'Diabetes', complexity:'high' },
  { code:'E11.69', desc:'Type 2 diabetes mellitus with other specified complication', category:'Diabetes', complexity:'moderate' },
  { code:'E11.51', desc:'Type 2 diabetes mellitus with diabetic peripheral angiopathy without gangrene', category:'Diabetes', complexity:'high' },
  { code:'E11.52', desc:'Type 2 diabetes mellitus with diabetic peripheral angiopathy with gangrene', category:'Diabetes', complexity:'high' },
  { code:'E11.621', desc:'Type 2 diabetes mellitus with foot ulcer', category:'Diabetes', complexity:'high' },
  { code:'E11.22', desc:'Type 2 diabetes mellitus with diabetic chronic kidney disease', category:'Diabetes', complexity:'high' },
  { code:'E10.10', desc:'Type 1 diabetes mellitus with ketoacidosis without coma', category:'Diabetes', complexity:'high' },
  { code:'E10.65', desc:'Type 1 diabetes mellitus with hyperglycemia', category:'Diabetes', complexity:'moderate' },
  { code:'E13.65', desc:'Other specified diabetes mellitus with hyperglycemia', category:'Diabetes', complexity:'moderate' },

  // ============== KIDNEY / RENAL ==============
  { code:'N17.9', desc:'Acute kidney injury (AKI), unspecified', category:'Renal', complexity:'high' },
  { code:'N17.0', desc:'Acute kidney failure with tubular necrosis', category:'Renal', complexity:'high' },
  { code:'N18.6', desc:'End stage renal disease (ESRD)', category:'Renal', complexity:'high' },
  { code:'N18.4', desc:'Chronic kidney disease, stage 4 (severe)', category:'Renal', complexity:'high' },
  { code:'E11.22', desc:'Type 2 DM with diabetic chronic kidney disease', category:'Renal', complexity:'high' },

  // ============== LIVER ==============
  { code:'K72.00', desc:'Acute and subacute hepatic failure without coma', category:'Liver', complexity:'high' },
  { code:'K72.01', desc:'Acute and subacute hepatic failure with coma', category:'Liver', complexity:'high' },
  { code:'K70.41', desc:'Alcoholic hepatic failure with coma', category:'Liver', complexity:'high' },
  { code:'K74.60', desc:'Unspecified cirrhosis of liver', category:'Liver', complexity:'high' },
  { code:'K76.6', desc:'Portal hypertension', category:'Liver', complexity:'high' },

  // ============== UTI / INFECTIONS ==============
  { code:'N39.0', desc:'Urinary tract infection, site not specified', category:'Infectious', complexity:'moderate' },
  { code:'A04.72', desc:'Enterocolitis due to Clostridioides difficile (C. diff)', category:'Infectious', complexity:'high' },
  { code:'L03.115', desc:'Cellulitis of right lower limb', category:'Infectious', complexity:'moderate' },
  { code:'L03.116', desc:'Cellulitis of left lower limb', category:'Infectious', complexity:'moderate' },
  { code:'M86.9', desc:'Osteomyelitis, unspecified', category:'Infectious', complexity:'high' },
  { code:'M86.171', desc:'Other acute osteomyelitis, right ankle and foot', category:'Infectious', complexity:'high' },
  { code:'T81.42XA', desc:'Infection following a procedure, deep incisional surgical site', category:'Infectious', complexity:'high' },
  { code:'T84.54XA', desc:'Infection and inflammatory reaction due to internal right knee prosthesis, initial', category:'Infectious', complexity:'high' },
  { code:'B95.62', desc:'MRSA infection, unspecified site', category:'Infectious', complexity:'high' },
  { code:'A49.02', desc:'Methicillin resistant Staphylococcus aureus infection, unspecified site', category:'Infectious', complexity:'high' },
  { code:'G06.0', desc:'Intracranial abscess and granuloma', category:'Infectious', complexity:'high' },
  { code:'I33.0', desc:'Acute and subacute infective endocarditis', category:'Infectious', complexity:'high' },
  { code:'B37.7', desc:'Candidal sepsis', category:'Infectious', complexity:'high' },

  // ============== FALLS / DECONDITIONING ==============
  { code:'R29.6', desc:'Repeated falls', category:'Falls', complexity:'moderate' },
  { code:'W19.XXXA', desc:'Unspecified fall, initial encounter', category:'Falls', complexity:'moderate' },
  { code:'W01.0XXA', desc:'Fall on same level from slipping, tripping and stumbling without subsequent striking, initial', category:'Falls', complexity:'moderate' },
  { code:'W10.9XXA', desc:'Fall on and from unspecified stairs and steps, initial encounter', category:'Falls', complexity:'moderate' },
  { code:'R53.1', desc:'Weakness / Generalized deconditioning', category:'Deconditioning', complexity:'moderate' },
  { code:'M62.81', desc:'Muscle weakness (generalized)', category:'Deconditioning', complexity:'moderate' },
  { code:'Z74.01', desc:'Bed confinement status / Immobility', category:'Deconditioning', complexity:'moderate' },
  { code:'R54', desc:'Age-related physical debility / Frailty', category:'Deconditioning', complexity:'moderate' },
  { code:'E46', desc:'Unspecified protein-calorie malnutrition', category:'Deconditioning', complexity:'moderate' },
  { code:'R64', desc:'Cachexia', category:'Deconditioning', complexity:'high' },

  // ============== OTHER ORTHOPEDIC / FRACTURES ==============
  { code:'S82.001A', desc:'Unspecified fracture of right patella, initial encounter', category:'Orthopedic', complexity:'high' },
  { code:'S82.101A', desc:'Unspecified fracture of upper end of right tibia (tibial plateau fracture), initial', category:'Orthopedic', complexity:'high' },
  { code:'S82.201A', desc:'Unspecified fracture of shaft of right tibia, initial', category:'Orthopedic', complexity:'high' },
  { code:'S82.891A', desc:'Other fracture of right lower leg (ankle fracture ORIF), initial', category:'Orthopedic', complexity:'high' },
  { code:'S42.201A', desc:'Unspecified fracture of upper end of right humerus (proximal humerus fracture), initial', category:'Orthopedic', complexity:'high' },
  { code:'S42.202A', desc:'Unspecified fracture of upper end of left humerus, initial', category:'Orthopedic', complexity:'high' },
  { code:'S32.009A', desc:'Unspecified fracture of lumbar vertebra, initial encounter', category:'Orthopedic', complexity:'high' },
  { code:'S22.009A', desc:'Unspecified fracture of unspecified thoracic vertebra, initial encounter', category:'Orthopedic', complexity:'high' },
  { code:'S32.10XA', desc:'Unspecified fracture of sacrum, initial encounter', category:'Orthopedic', complexity:'high' },
  { code:'S42.001A', desc:'Fracture of unspecified part of right clavicle, initial', category:'Orthopedic', complexity:'moderate' },
  { code:'S52.501A', desc:'Unspecified fracture of the lower end of right radius (distal radius fracture), initial', category:'Orthopedic', complexity:'moderate' },
  { code:'S12.9XXA', desc:'Unspecified fracture of cervical vertebra, initial encounter', category:'Orthopedic', complexity:'high' },
  { code:'M84.459A', desc:'Pathological fracture in neoplastic disease, hip, initial encounter for fracture', category:'Orthopedic', complexity:'high' },

  // ============== AMPUTATION / VASCULAR ==============
  { code:'I74.3', desc:'Embolism and thrombosis of arteries of lower extremities (s/p BKA)', category:'Amputation', complexity:'high' },
  { code:'E11.52', desc:'Type 2 DM with diabetic peripheral angiopathy with gangrene (s/p AKA)', category:'Amputation', complexity:'high' },
  { code:'I70.261', desc:'Atherosclerosis of native arteries of extremities with gangrene, right leg (s/p BKA)', category:'Amputation', complexity:'high' },
  { code:'I70.262', desc:'Atherosclerosis of native arteries of extremities with gangrene, left leg (s/p BKA)', category:'Amputation', complexity:'high' },
  { code:'S48.011A', desc:'Complete traumatic amputation at knee level, right lower leg, initial', category:'Amputation', complexity:'high' },
  { code:'Z89.511', desc:'Acquired absence of right leg below knee', category:'Amputation', complexity:'high' },
  { code:'Z89.611', desc:'Acquired absence of right leg above knee', category:'Amputation', complexity:'high' },

  // ============== GI / OTHER MEDICAL ==============
  { code:'K92.0', desc:'Hematemesis (upper GI bleed)', category:'Other Medical', complexity:'high' },
  { code:'K92.1', desc:'Melena (lower GI bleed)', category:'Other Medical', complexity:'high' },
  { code:'K85.90', desc:'Acute pancreatitis without necrosis or infection, unspecified', category:'Other Medical', complexity:'high' },
  { code:'K56.60', desc:'Unspecified intestinal obstruction (small bowel obstruction)', category:'Other Medical', complexity:'high' },
  { code:'K35.80', desc:'Unspecified acute appendicitis (post-appendectomy)', category:'Other Medical', complexity:'moderate' },
  { code:'L89.319', desc:'Pressure ulcer of right buttock, stage 3', category:'Other Medical', complexity:'moderate' },
  { code:'L89.159', desc:'Pressure ulcer of sacral region, unstageable', category:'Other Medical', complexity:'moderate' },
  { code:'D64.9', desc:'Anemia, unspecified', category:'Other Medical', complexity:'moderate' },
  { code:'I82.401', desc:'Acute embolism and thrombosis of unspecified deep veins of right lower extremity (DVT)', category:'Other Medical', complexity:'high' },
  { code:'I82.402', desc:'Acute embolism and thrombosis of unspecified deep veins of left lower extremity (DVT)', category:'Other Medical', complexity:'high' },
  { code:'G89.29', desc:'Other chronic pain', category:'Other Medical', complexity:'moderate' },
  { code:'F10.239', desc:'Alcohol dependence with withdrawal, unspecified', category:'Other Medical', complexity:'high' },
  { code:'J95.811', desc:'Postprocedural pneumothorax (post-thoracic surgery)', category:'Other Medical', complexity:'high' },
  { code:'T85.79XA', desc:'Infection and inflammatory reaction due to other internal prosthetic devices, implants and grafts, initial', category:'Other Medical', complexity:'high' },
];


const ATTENDING_MDS = [
  'Dr. Robert Chen, MD (Hospitalist)','Dr. Sarah Kim, MD (Hospitalist)','Dr. Michael Torres, DO (Hospitalist)',
  'Dr. Lisa Patel, MD (Neurologist)','Dr. James Wright, MD (Cardiologist)','Dr. Amy Nguyen, MD (Pulmonologist)',
  'Dr. David Hernandez, DO (Orthopedic Surgeon)','Dr. Jennifer Lee, MD (Orthopedic Surgeon)',
  'Dr. Marcus Brown, MD (Internal Medicine)','Dr. Rachel Green, MD (Infectious Disease)',
  'Dr. Kevin O\'Brien, DO (General Surgeon)','Dr. Samantha Cruz, MD (Neurologist)',
  'Dr. Thomas Russo, MD (Intensivist)','Dr. Angela Park, MD (Physiatrist/PM&R)',
  'Dr. Brian Foster, DO (Hospitalist)','Dr. Maria Santos, MD (Oncologist)',
];

const UNITS = ['3 North','3 South','4 East','4 West','5 North','ICU','CCU','Neuro ICU','Ortho Unit','Cardiac Step-Down','Medical Floor 2','Rehab Unit'];
const PRECAUTION_OPTIONS = [
  ['Fall risk','DVT precautions'],
  ['Fall risk','Aspiration precautions','Contact isolation'],
  ['Cardiac precautions','Telemetry','O2 monitoring'],
  ['Fall risk','Seizure precautions','1:1 sitter'],
  ['Sternal precautions','Cardiac precautions','Telemetry'],
  ['Hip precautions (posterior approach)','Weight-bearing restrictions','Fall risk'],
  ['Hip precautions (anterior approach)','Weight-bearing restrictions','Fall risk'],
  ['Weight-bearing restrictions','DVT precautions','Fall risk'],
  ['Neutropenic precautions','Contact isolation','Fall risk'],
  ['Airborne precautions','Contact isolation','Respiratory monitoring'],
  ['Spinal precautions','C-collar','Log roll only'],
  ['Cardiac precautions','O2 monitoring','Activity restriction'],
  ['Fall risk','Bleeding precautions','Contact isolation'],
  ['Aspiration precautions','NPO','Fall risk'],
  ['DVT precautions','Anticoagulation','Fall risk'],
  ['Fall risk','Confusion/delirium protocol'],
  ['Droplet precautions','Fall risk','O2 monitoring'],
  ['Pressure ulcer precautions','Turning schedule q2h','Fall risk'],
  ['Fall risk'],
  ['Fall risk','DVT precautions'],
];

const ALERT_OPTIONS = [
  ['Latex allergy'],
  ['Penicillin allergy'],
  ['Sulfa allergy'],
  ['Contrast dye allergy'],
  ['MRSA positive'],
  ['C. diff positive'],
  ['VRE positive'],
  ['Code status: DNR/DNI'],
  ['Code status: Full Code'],
  ['Difficult IV access'],
  ['Blood thinner (Warfarin)'],
  ['Blood thinner (Heparin drip)'],
  ['Interpreter needed - Spanish'],
  ['Hard of hearing'],
  ['Legally blind'],
];

const PMH_OPTIONS = [
  'Hypertension, Type 2 Diabetes, Hyperlipidemia, Obesity',
  'Hypertension, CAD, CHF (EF 35%), A-fib, Type 2 Diabetes',
  'COPD, Hypertension, Osteoarthritis, GERD',
  'Type 2 Diabetes, CKD Stage 3, Hypertension, Anemia',
  'A-fib, Hypertension, s/p pacemaker placement 2023, Type 2 Diabetes',
  'Osteoporosis, Hypertension, Hypothyroidism, GERD',
  'Parkinson disease, Depression, Orthostatic hypotension, Constipation',
  'History of CVA (2023), A-fib, Hypertension, Dysphagia',
  'Breast cancer (Stage II, in treatment), Anemia, Depression',
  'Lung cancer (Stage IIIA), COPD, Hypertension, Cachexia',
  'ESRD on hemodialysis, Diabetes, Hypertension, Anemia',
  'CHF (EF 25%), CAD s/p CABG 2022, COPD, Type 2 Diabetes',
  'Rheumatoid arthritis, Osteoporosis, Chronic pain, Depression',
  'Dementia (moderate), Hypertension, Type 2 Diabetes, Recurrent UTIs',
  'Seizure disorder, Anxiety, GERD, Hypertension',
  'Morbid obesity (BMI 42), Type 2 Diabetes, OSA on CPAP, OA bilateral knees',
  'HIV (well-controlled on ART), Hypertension, Hepatitis C (treated)',
  'SLE, CKD Stage 2, Hypertension, Anemia',
  'Alcoholic liver disease, Portal hypertension, Ascites, Malnutrition',
  'Sickle cell disease, Chronic pain, Depression, Avascular necrosis bilateral hips',
];

const MED_OPTIONS = [
  'Metoprolol 50mg BID, Lisinopril 20mg daily, Metformin 1000mg BID, Atorvastatin 40mg daily, Aspirin 81mg daily',
  'Warfarin 5mg daily (INR monitoring), Digoxin 0.125mg daily, Furosemide 40mg BID, Potassium 20mEq daily',
  'Heparin drip (per protocol), Pantoprazole 40mg IV daily, Morphine 2mg IV q4h PRN, Ondansetron 4mg IV q6h PRN',
  'Insulin glargine 30u QHS, Insulin lispro sliding scale, Metformin 500mg BID, Lisinopril 10mg daily',
  'Vancomycin 1g IV q12h, Piperacillin-tazobactam 4.5g IV q6h, NS @ 125mL/hr, Acetaminophen 650mg q6h PRN',
  'Enoxaparin 40mg SQ daily, Oxycodone 5mg q4h PRN, Docusate 100mg BID, Senna 8.6mg BID, Cephalexin 500mg QID',
  'Carbidopa-Levodopa 25/100mg TID, Amantadine 100mg BID, Sertraline 100mg daily, Midodrine 5mg TID',
  'Albuterol neb q4h PRN, Ipratropium neb q6h, Prednisone 40mg daily (taper), Azithromycin 500mg daily',
  'Apixaban 5mg BID, Carvedilol 12.5mg BID, Furosemide 40mg daily, Potassium 20mEq BID, Spironolactone 25mg daily',
  'Levetiracetam 1000mg BID, Lacosamide 200mg BID, Lorazepam 1mg IV PRN seizure, Levetiracetam load',
  'Amlodipine 10mg daily, Hydrochlorothiazide 25mg daily, Gabapentin 300mg TID, Duloxetine 60mg daily',
  'Dexamethasone 4mg IV q6h, Phenytoin 100mg TID, Ondansetron 4mg q8h PRN, Famotidine 20mg BID',
  'Norepinephrine drip (per protocol), Vasopressin 0.04 units/min, Hydrocortisone 50mg IV q8h, Meropenem 1g IV q8h',
  'Metoprolol 25mg BID, Atorvastatin 80mg daily, Aspirin 325mg daily, Clopidogrel 75mg daily, Heparin drip',
  'Rivaroxaban 15mg BID x21d, Acetaminophen 1g q8h, Tramadol 50mg q6h PRN, Lovenox bridge',
];

// Section GG scoring constants
const GG_SCORES = {
  6: 'Independent',
  5: 'Setup or Clean-up Assistance',
  4: 'Supervision or Touching Assistance',
  3: 'Partial/Moderate Assistance',
  2: 'Substantial/Maximal Assistance',
  1: 'Dependent',
  7: 'Patient Refused',
  9: 'Not Applicable',
  10: 'Not Attempted due to Environment',
  88: 'Not Attempted due to Medical Condition/Safety'
};

const GG_SELF_CARE_ITEMS = [
  {id:'A',label:'Eating'},
  {id:'B',label:'Oral Hygiene'},
  {id:'C',label:'Toileting Hygiene'},
  {id:'D',label:'Wash Upper Body'},
  {id:'E',label:'Shower/Bathe Self'},
  {id:'F',label:'Upper Body Dressing'},
  {id:'G',label:'Lower Body Dressing'},
  {id:'H',label:'Putting On/Taking Off Footwear'},
  {id:'I',label:'Personal Hygiene'},
];

const GG_MOBILITY_ITEMS = [
  {id:'A',label:'Roll Left and Right'},
  {id:'B',label:'Sit to Lying'},
  {id:'C',label:'Lying to Sitting on Side of Bed'},
  {id:'D',label:'Sit to Stand'},
  {id:'E',label:'Chair/Bed-to-Chair Transfer'},
  {id:'F',label:'Toilet Transfer'},
  {id:'G',label:'Tub/Shower Transfer'},
  {id:'H',label:'Car Transfer'},
  {id:'I',label:'Walk 10 Feet'},
  {id:'J',label:'Walk 50 Feet with Two Turns'},
  {id:'K',label:'Walk 150 Feet'},
  {id:'L',label:'Walking 10 Feet on Uneven Surfaces'},
  {id:'M',label:'1 Step (Curb)'},
  {id:'N',label:'4 Steps'},
  {id:'O',label:'12 Steps'},
  {id:'P',label:'Picking Up Object'},
  {id:'R',label:'Wheel 50 Feet with Two Turns'},
  {id:'S',label:'Wheel 150 Feet'},
];

const ASSIST_LEVELS = ['Independent','Supervision','Contact Guard Assist (CGA)','Minimal Assist (Min A)','Moderate Assist (Mod A)','Maximal Assist (Max A)','Dependent','Not Tested'];
const WEIGHT_BEARING = ['WBAT','FWB','PWB','TTWB','NWB','TDWB'];

function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateInpatientPatients() {
  const rand = seededRandom(77);
  const pick = (arr) => arr[Math.floor(rand() * arr.length)];
  const randInt = (min, max) => Math.floor(rand() * (max - min + 1)) + min;
  const patients = [];

  // Distribution of categories
  const categoryWeights = [
      { cat: 'Neuro', weight: 14 },
      { cat: 'Cardiopulmonary', weight: 12 },
      { cat: 'Hip Fracture', weight: 8 },
      { cat: 'Joint Replacement', weight: 7 },
      { cat: 'Trauma', weight: 8 },
      { cat: 'Sepsis', weight: 7 },
      { cat: 'Infectious', weight: 7 },
      { cat: 'Cancer', weight: 6 },
      { cat: 'Diabetes', weight: 5 },
      { cat: 'Renal', weight: 4 },
      { cat: 'Liver', weight: 3 },
      { cat: 'Falls', weight: 4 },
      { cat: 'Deconditioning', weight: 4 },
      { cat: 'Orthopedic', weight: 5 },
      { cat: 'Amputation', weight: 3 },
      { cat: 'Other Medical', weight: 3 },
    ];

  function pickWeightedCategory() {
    const total = categoryWeights.reduce((s,c) => s + c.weight, 0);
    let r = rand() * total;
    for (const cw of categoryWeights) {
      r -= cw.weight;
      if (r <= 0) return cw.cat;
    }
    return categoryWeights[0].cat;
  }

  // Inpatient care stages
  const CARE_STAGES = [
    { stage:'Admission (Day 1)', dayMin:0, dayMax:0 },
    { stage:'Acute (Day 2-3)', dayMin:1, dayMax:2 },
    { stage:'Acute (Day 3-5)', dayMin:2, dayMax:4 },
    { stage:'Progressing (Day 4-7)', dayMin:3, dayMax:6 },
    { stage:'Progressing (Day 5-10)', dayMin:4, dayMax:9 },
    { stage:'Nearing Discharge', dayMin:5, dayMax:12 },
    { stage:'Discharge Planning', dayMin:7, dayMax:14 },
    { stage:'Discharged', dayMin:3, dayMax:14 },
    { stage:'ICU', dayMin:1, dayMax:5 },
    { stage:'Step-Down', dayMin:2, dayMax:6 },
  ];

  for (let i = 1; i <= 120; i++) {
    const isFemale = rand() > 0.48;
    const firstName = isFemale ? pick(FIRST_NAMES_F) : pick(FIRST_NAMES_M);
    const lastName = pick(LAST_NAMES);

    // Inpatient age distribution â weighted older
    const ageBase = rand();
    let age;
    if (ageBase < 0.03) age = randInt(18, 30);
    else if (ageBase < 0.10) age = randInt(31, 45);
    else if (ageBase < 0.25) age = randInt(46, 59);
    else if (ageBase < 0.50) age = randInt(60, 74);
    else if (ageBase < 0.80) age = randInt(75, 84);
    else age = randInt(85, 96);

    const birthYear = 2026 - age;
    const birthMonth = randInt(1, 12);
    const birthDay = randInt(1, 28);
    const dob = `${birthYear}-${String(birthMonth).padStart(2,'0')}-${String(birthDay).padStart(2,'0')}`;

    const category = pickWeightedCategory();
    const categoryDxs = DIAGNOSES.filter(d => d.category === category);
    const dx = pick(categoryDxs);

    const insurance = age >= 65 && rand() > 0.15 ? 'Medicare' : pick(['Medicare','Medicaid','Blue Cross Blue Shield','Aetna','United Healthcare','Cigna','Humana','Anthem','Tricare']);

    const careStage = pick(CARE_STAGES);
    const losDay = randInt(careStage.dayMin, careStage.dayMax);
    const totalTxSessions = careStage.stage === 'Admission (Day 1)' ? 0 : Math.min(losDay * randInt(1, 2), losDay + 2);

    let status;
    if (careStage.stage === 'Discharged') status = 'Discharged';
    else if (careStage.stage === 'ICU') status = 'ICU';
    else status = 'Active';

    // Admission date
    const admitDaysAgo = losDay;
    const admitDate = new Date(2026, 2, 7 - admitDaysAgo);
    const admitDateStr = admitDate.toISOString().split('T')[0];

    // Room number
    const unit = pick(UNITS);
    const roomNum = `${randInt(300, 599)}${pick(['A','B',''])}`;

    // Precautions
    const precautions = pick(PRECAUTION_OPTIONS);
    // Add weight-bearing for ortho
    let wbStatus = 'WBAT';
    if (category === 'Hip Fracture' || category === 'Joint Replacement' || category === 'Orthopedic') {
        wbStatus = pick(['WBAT','FWB','PWB','TTWB','NWB']);
      } else if (category === 'Trauma' || category === 'Amputation' || dx.code.startsWith('S82') || dx.code.startsWith('S32') || dx.code.startsWith('S72') || dx.code.startsWith('S42')) {
        wbStatus = pick(['NWB','TTWB','PWB','WBAT']);
      }

    // Alerts
    const alertCount = rand() < 0.3 ? 0 : (rand() < 0.6 ? 1 : 2);
    const alerts = [];
    for (let a = 0; a < alertCount; a++) {
      const al = pick(ALERT_OPTIONS);
      if (!alerts.includes(al[0])) alerts.push(al[0]);
    }

    const pmh = pick(PMH_OPTIONS);
    const meds = pick(MED_OPTIONS);
    const attendingMD = pick(ATTENDING_MDS);

    // Vitals - realistic for inpatient
    let vitals = {};
    if (category === 'Cardiopulmonary') {
      vitals = {
        hr: randInt(72, 120), bp_sys: randInt(100, 160), bp_dia: randInt(55, 90),
        rr: randInt(16, 28), spo2: randInt(88, 97), temp: (97.5 + rand() * 3).toFixed(1),
        o2_device: pick(['Room Air','Nasal Cannula 2L','Nasal Cannula 4L','Venturi Mask 40%','Non-Rebreather','BiPAP']),
      };
    } else if (category === 'Sepsis') {
      vitals = {
        hr: randInt(90, 130), bp_sys: randInt(85, 130), bp_dia: randInt(45, 75),
        rr: randInt(18, 32), spo2: randInt(90, 98), temp: (98.0 + rand() * 5).toFixed(1),
        o2_device: pick(['Nasal Cannula 2L','Nasal Cannula 4L','Venturi Mask 35%','High Flow NC 30L']),
      };
    } else if (category === 'Neuro') {
      vitals = {
        hr: randInt(60, 100), bp_sys: randInt(110, 180), bp_dia: randInt(60, 95),
        rr: randInt(14, 22), spo2: randInt(94, 99), temp: (97.8 + rand() * 2).toFixed(1),
        o2_device: pick(['Room Air','Nasal Cannula 2L','Room Air','Room Air']),
      };
    } else if (category === 'Infectious') {
        vitals = {
          hr: randInt(80, 120), bp_sys: randInt(90, 145), bp_dia: randInt(50, 80),
          rr: randInt(16, 26), spo2: randInt(90, 98),
          temp: (98.5 + rand() * 4).toFixed(1),
          o2_device: pick(['Room Air','Nasal Cannula 2L','Nasal Cannula 4L','Venturi Mask 35%']),
        };
      } else if (category === 'Trauma') {
        vitals = {
          hr: randInt(70, 115), bp_sys: randInt(95, 150), bp_dia: randInt(55, 85),
          rr: randInt(14, 24), spo2: randInt(92, 99),
          temp: (97.8 + rand() * 2).toFixed(1),
          o2_device: pick(['Room Air','Room Air','Nasal Cannula 2L','Nasal Cannula 4L']),
        };
      } else if (category === 'Cancer') {
        vitals = {
          hr: randInt(65, 110), bp_sys: randInt(95, 145), bp_dia: randInt(55, 85),
          rr: randInt(14, 24), spo2: randInt(91, 98),
          temp: (97.4 + rand() * 3).toFixed(1),
          o2_device: pick(['Room Air','Room Air','Nasal Cannula 2L','Nasal Cannula 3L']),
        };
      } else if (category === 'Renal' || category === 'Liver') {
        vitals = {
          hr: randInt(70, 110), bp_sys: randInt(95, 160), bp_dia: randInt(50, 85),
          rr: randInt(14, 24), spo2: randInt(92, 98),
          temp: (97.5 + rand() * 2.5).toFixed(1),
          o2_device: pick(['Room Air','Room Air','Nasal Cannula 2L']),
        };
      } else {
        vitals = {
          hr: randInt(60, 105), bp_sys: randInt(100, 155), bp_dia: randInt(55, 90),
          rr: randInt(14, 22), spo2: randInt(93, 99),
          temp: (97.6 + rand() * 2.5).toFixed(1),
          o2_device: pick(['Room Air','Room Air','Nasal Cannula 2L','Nasal Cannula 3L']),
        };
      }

    // Lines / Tubes / Drains
    const linesOptions = [
      ['Peripheral IV (right forearm)'],
      ['Peripheral IV (left hand)','Foley catheter'],
      ['PICC line (right arm)','Foley catheter'],
      ['Central line (right subclavian)','Foley catheter','Arterial line'],
      ['Peripheral IV (left forearm)'],
      ['Peripheral IV (right hand)','Sequential compression devices'],
      ['PICC line (left arm)'],
      ['Central line (right IJ)','Foley catheter','NG tube'],
      ['Peripheral IV (right AC)','JP drain (right hip)'],
      ['Peripheral IV (left hand)','Hemovac drain (right knee)'],
      ['Peripheral IV (right hand)','Chest tube (left)'],
    ];
    const lines = pick(linesOptions);

    // Section GG scores
    function genGGScore(baseLevel, isAdmission) {
      if (isAdmission) {
        const scores = [1, 1, 2, 2, 2, 3, 3, 88];
        const base = scores[Math.floor(rand() * scores.length)];
        return Math.max(1, Math.min(base + (rand() > 0.5 ? 1 : 0), 6));
      }
      return Math.min(baseLevel + randInt(0, 2), 6);
    }

    let ggBaseLevel;
    if (category === 'Neuro' && dx.complexity === 'high') ggBaseLevel = 1;
      else if (category === 'Sepsis') ggBaseLevel = 1;
      else if (category === 'Trauma' && dx.complexity === 'high') ggBaseLevel = 1;
      else if (category === 'Cardiopulmonary') ggBaseLevel = 2;
      else if (category === 'Hip Fracture') ggBaseLevel = 2;
      else if (category === 'Orthopedic') ggBaseLevel = 2;
      else if (category === 'Amputation') ggBaseLevel = 2;
      else if (category === 'Cancer') ggBaseLevel = 2;
      else if (category === 'Renal' || category === 'Liver') ggBaseLevel = 2;
      else if (category === 'Joint Replacement') ggBaseLevel = 3;
      else if (category === 'Deconditioning') ggBaseLevel = 2;
      else if (category === 'Infectious') ggBaseLevel = 2;
      else if (category === 'Diabetes') ggBaseLevel = 3;
      else ggBaseLevel = 2;

    const ggSelfCare = {};
    GG_SELF_CARE_ITEMS.forEach(item => {
      const admission = genGGScore(ggBaseLevel, true);
      const goal = Math.min(admission + randInt(1, 3), 6);
      const discharge = careStage.stage === 'Discharged' ? Math.min(admission + randInt(1, 2), goal) : null;
      ggSelfCare[item.id] = { admission, goal, discharge };
    });

    const ggMobility = {};
    GG_MOBILITY_ITEMS.forEach(item => {
      let admission;
      // Wheelchair items
      if (item.id === 'R' || item.id === 'S') {
        admission = (category === 'Neuro' && rand() > 0.5) ? genGGScore(ggBaseLevel, true) : 9; // N/A for most
      } else if (item.id === 'M' || item.id === 'N' || item.id === 'O') {
        // Stairs - often 88 on admission
        admission = rand() > 0.6 ? 88 : genGGScore(ggBaseLevel, true);
      } else {
        admission = genGGScore(ggBaseLevel, true);
      }
      const goal = admission === 9 ? 9 : (admission === 88 ? Math.min(ggBaseLevel + randInt(2, 4), 6) : Math.min(admission + randInt(1, 3), 6));
      const discharge = careStage.stage === 'Discharged' ? (admission === 9 ? 9 : Math.min((admission === 88 ? ggBaseLevel : admission) + randInt(1, 2), goal)) : null;
      ggMobility[item.id] = { admission, goal, discharge };
    });

    // Assist levels for functional mobility
    function pickAssist(baseLevel) {
      const levels = {
        1: ['Dependent','Maximal Assist (Max A)','Dependent'],
        2: ['Maximal Assist (Max A)','Moderate Assist (Mod A)','Maximal Assist (Max A)'],
        3: ['Moderate Assist (Mod A)','Minimal Assist (Min A)','Moderate Assist (Mod A)'],
        4: ['Contact Guard Assist (CGA)','Supervision','Minimal Assist (Min A)'],
        5: ['Supervision','Independent','Contact Guard Assist (CGA)'],
        6: ['Independent','Independent','Supervision'],
      };
      const opts = levels[Math.max(1, Math.min(baseLevel, 6))] || levels[2];
      return pick(opts);
    }

    const currentAssistBase = Math.min(ggBaseLevel + Math.floor(losDay / 2), 5);
    const assistLevels = {
      bedMobility: { supineToSit: pickAssist(currentAssistBase + 1), sitToSupine: pickAssist(currentAssistBase + 1), rolling: pickAssist(currentAssistBase + 1), scooting: pickAssist(currentAssistBase) },
      transfers: { sitToStand: pickAssist(currentAssistBase), standPivot: pickAssist(currentAssistBase), slidingBoard: category === 'Neuro' ? pickAssist(currentAssistBase) : 'Not Tested', squatPivot: pickAssist(currentAssistBase), bedToChair: pickAssist(currentAssistBase), toiletTransfer: pickAssist(currentAssistBase), tubShower: pickAssist(Math.max(currentAssistBase - 1, 1)), carTransfer: losDay > 3 ? pickAssist(Math.max(currentAssistBase - 1, 1)) : 'Not Tested' },
      gait: { levelSurfaces: pickAssist(currentAssistBase), unevenSurfaces: pickAssist(Math.max(currentAssistBase - 1, 1)), distance: `${randInt(10, 300)} feet`, assistDevice: pick(['Rolling walker','Front-wheeled walker','Standard walker','Hemi-walker','Quad cane','Straight cane','No device','Parallel bars only']), gaitBelt: rand() > 0.2 ? 'Yes' : 'No' },
      stairs: { stairsUp: losDay > 2 ? pickAssist(Math.max(currentAssistBase - 1, 1)) : 'Not Tested', stairsDown: losDay > 2 ? pickAssist(Math.max(currentAssistBase - 1, 1)) : 'Not Tested', railUse: pick(['Bilateral rails','Right rail','Left rail','No rail']), steps: losDay > 2 ? `${randInt(1, 12)} steps` : 'Not tested' },
    };

    // Prior functioning (GG 0100)
    const priorFunction = {
      selfCare: pick([3, 3, 3, 2, 2, 1]),
      indoorMobility: pick([3, 3, 3, 2, 2, 1]),
      stairs: pick([3, 3, 2, 2, 1, 8]),
      cognition: pick([3, 3, 3, 2, 2, 1]),
    };

    // Prior device use (GG 0110)
    const priorDevices = {
      manualWheelchair: rand() < 0.15,
      motorizedWheelchair: rand() < 0.05,
      mechanicalLift: rand() < 0.03,
      walker: rand() < 0.35,
      orthoticsProsthetics: rand() < 0.1,
    };

    // Note history
    const noteHistory = [];
    if (careStage.stage !== 'Admission (Day 1)') {
      noteHistory.push({ type:'Initial Evaluation', date:admitDateStr, author:'Dr. Sarah Mitchell, PT, DPT', status:'Signed & Locked' });
      for (let d = 1; d <= totalTxSessions; d++) {
        const noteDate = new Date(admitDate.getTime() + d * 86400000);
        const isPTANote = rand() > 0.4;
        const isProgressNote = d % 5 === 0;
        noteHistory.push({
          type: isProgressNote ? 'Progress Note' : 'Treatment Note',
          date: noteDate.toISOString().split('T')[0],
          author: isPTANote ? 'Alex Rivera, PTA' : 'Dr. Sarah Mitchell, PT, DPT',
          status: d === totalTxSessions && rand() > 0.4 ? 'Draft' : (isPTANote ? 'Co-signed' : 'Signed & Locked')
        });
      }
      if (careStage.stage === 'Discharged') {
        noteHistory.push({ type:'Discharge Summary', date:'2026-03-06', author:'Dr. Sarah Mitchell, PT, DPT', status:'Signed & Locked' });
      }
    }

    // Discharge recommendation
    const dcRec = pick(['Home with home health PT','Home with outpatient PT','Skilled nursing facility','Inpatient rehabilitation facility','Long-term acute care (LTAC)','Home with family assistance','Acute rehab unit','Hospice']);

    patients.push({
      id: i,
      firstName, lastName, dob, age,
      gender: isFemale ? 'Female' : 'Male',
      mrn: `MRN-${String(100000 + i).padStart(7,'0')}`,
      accountNum: `ACCT-2026-${String(randInt(10000,99999))}`,
      phone: `(555)${randInt(100,999)}-${randInt(1000,9999)}`,
      address: `${randInt(100,9999)} ${pick(['Oak Lane','Elm Street','Maple Drive','Pine Road','Birch Avenue','Cedar Blvd','Walnut Court','Spruce Way','Cherry Circle','Willow Terrace'])}, ${pick(['Springfield','Riverside','Fairview','Georgetown','Madison','Franklin','Salem','Greenville','Bristol'])}, IL ${randInt(60000,62999)}`,
      insurance,
      dx: `${dx.code} - ${dx.desc}`,
      dxCode: dx.code,
      category: dx.category,
      complexity: dx.complexity,
      attendingMD,
      admitDate: admitDateStr,
      admitReason: dx.desc,
      unit, roomNum,
      status, careStage: careStage.stage,
      losDay, totalTxSessions,
      precautions, alerts, wbStatus,
      pmh, meds,
      vitals, lines,
      ggSelfCare, ggMobility,
      priorFunction, priorDevices,
      assistLevels,
      noteHistory,
      dcRecommendation: dcRec,
      codeStatus: pick(['Full Code','Full Code','Full Code','DNR/DNI','DNR/Full Intubation','Comfort Care Only']),
      socialHistory: {
        living: pick(['Home alone','Home with spouse','Home with family','Assisted living','Skilled nursing facility','Group home','Homeless shelter']),
        priorMobility: pick(['Independent community ambulator','Independent household ambulator','Ambulates with walker','Ambulates with cane','Wheelchair dependent','Bed-bound']),
        stairs: pick(['None','3 steps with railing to enter home','1 flight (12 steps) with railing','2 flights with railing','Elevator access only','No stairs needed']),
        occupation: age >= 65 ? 'Retired' : pick(['Office worker','Teacher','Construction worker','Nurse','Factory worker','Truck driver','Homemaker','Custodian','Restaurant worker']),
        emergencyContact: `${pick(FIRST_NAMES_F)} ${pick(LAST_NAMES)} (${pick(['Spouse','Daughter','Son','Sister','Brother','Friend'])}) - (555)${randInt(100,999)}-${randInt(1000,9999)}`,
      },
      cognition: {
        oriented: pick(['x4 (person, place, time, situation)','x3 (person, place, time)','x2 (person, place)','x1 (person only)','x4','x4','x4','x3']),
        followsCommands: pick(['Follows 3-step commands','Follows 2-step commands','Follows 1-step commands with cues','Follows simple commands with repetition','Unable to follow commands']),
        safety: pick(['Good safety awareness','Fair safety awareness â requires verbal cues','Poor safety awareness â impulsive, requires constant supervision','Intact safety awareness','Fair â occasional impulsive behavior']),
      },
    });
  }
  return patients;
}

// Generate schedule for inpatient
function generateInpatientSchedule(patients) {
  const activePatients = patients.filter(p => p.status !== 'Discharged');
  const times = ['7:00 AM','7:30 AM','8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM'];
  const schedule = [];
  const rand = seededRandom(99);
  const pick = (arr) => arr[Math.floor(rand() * arr.length)];

  let ptIdx = 0;
  let ptaIdx = Math.floor(activePatients.length / 3);

  for (const time of times) {
    if (ptIdx < activePatients.length && rand() > 0.1) {
      const p = activePatients[ptIdx++];
      const type = p.careStage === 'Admission (Day 1)' ? 'Initial Eval' :
                   p.careStage.includes('Discharge') ? 'Discharge Eval' :
                   (rand() > 0.8 ? 'Progress Note' : 'Treatment');
      schedule.push({ time, patient:`${p.lastName}, ${p.firstName}`, patientId:p.id, type, therapist:'PT', status:pick(['Scheduled','Scheduled','In Progress','Completed']), room:`${p.roomNum} (${p.unit})` });
    } else {
      schedule.push({ time, patient:'(Open Slot)', type:'', therapist:'PT', status:'', patientId:null, room:'' });
    }

    if (ptaIdx < activePatients.length && rand() > 0.2) {
      const p = activePatients[ptaIdx++];
      schedule.push({ time, patient:`${p.lastName}, ${p.firstName}`, patientId:p.id, type:'Treatment', therapist:'PTA', status:pick(['Scheduled','In Progress','Completed']), room:`${p.roomNum} (${p.unit})` });
    } else {
      schedule.push({ time, patient:'(Open Slot)', type:'', therapist:'PTA', status:'', patientId:null, room:'' });
    }
  }
  return schedule;
}

const SAMPLE_PATIENTS = generateInpatientPatients();
const SCHEDULE_DATA = generateInpatientSchedule(SAMPLE_PATIENTS);
