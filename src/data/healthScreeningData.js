export const NAV_ITEMS = [
  { label: 'HOME', href: 'https://maedamedical.com/' },
  { label: 'ABOUT US', href: 'https://maedamedical.com/about-us/' },
  { label: 'OUR SERVICES', href: 'https://maedamedical.com/our-services/' },
  { label: 'DIALYSIS', href: 'https://maedamedical.com/dialysis/' },
  { label: 'OUR TEAM', href: 'https://maedamedical.com/our-team/' },
  { label: 'CONTACT US', href: 'https://maedamedical.com/contact-us/' },
]

export const GENERAL_IN_ALL = [
  'Medical Consultation & Physical Examination by Doctor',
  'Body Mass Index (BMI)',
  'Waist Measurement',
  'Blood Pressure Measurement',
  'Oxygen Saturation',
  'Visual Acuity',
  'Colour Vision',
  'Medical Report',
  'Post Examination Review by the Doctor',
]

export const GENERAL_PACKAGES = [
  {
    id: 'imperial',
    name: 'IMPERIAL',
    price: '$512.30',
    highlights: [
      'Wide lab coverage for clearer baseline insights',
      'Doctor reviewed categories with optional targeted add-ons',
      'Client-friendly reporting for confident next steps',
    ],
    cards: [
      {
        title: 'Laboratory Tests',
        groups: [
          { label: 'Hematology', items: ['Full Blood Count', 'ESR', 'ABO (Blood group)'] },
          { label: 'Diabetes Panel', items: ['Fasting Blood Glucose'] },
          { label: 'Renal Function', items: ['Urea', 'Creatinine', 'Chloride', 'Potassium'] },
          {
            label: 'Bone & Joint Profile',
            items: ['Calcium', 'Phosphate', 'Uric Acid', 'Rheumatoid Arthritis (RAF)'],
          },
          {
            label: 'Lipid Profile',
            items: [
              'Fasting Blood Cholesterol',
              'Triglycerides',
              'HDL & LDL Cholesterol',
              'Cholesterol / HDL Ratio',
            ],
          },
          {
            label: 'Liver Profile',
            items: [
              'Total Protein',
              'Albumin',
              'Globulin',
              'A/G Ratio',
              'Total Bilirubin',
              'Alkaline Phosphatase',
              'AST / SGOT',
              'ALT / SGPT',
            ],
          },
          { label: 'Cardiac Profile', items: ['High Sensitive CRP (hs-CRP)'] },
          {
            label: 'Hepatitis Profile',
            items: [
              'Hepatitis A IgG Antibody',
              'Hepatitis B s Antigen',
              'Hepatitis B s Antibody',
            ],
          },
          {
            label: 'Cancer Markers',
            items: ['CA 19.9 (Pancreas)', 'CA 125 (Ovary - for female only)'],
          },
          { label: 'STD Profile', items: ['VDRL (&TPHA if required)'] },
          {
            label: 'Urine Analysis',
            items: ['Urine F&E', 'Urine Microalbumin / Urine Creatinine Ratio'],
          },
          { label: 'Stool Analysis', items: ['Stool Occult Blood'] },
        ],
      },
    ],
    optionalAddOns: {
      preMarital: {
        price: '+$100',
        title: 'Pre-marital Screening',
        items: ['Hormone Profile', 'Rubella Profile'],
      },
      fertility: {
        price: '+$130',
        title: 'Fertility Test',
        items: ['Seminal Analysis (Male)', 'Anti-Mullerian Hormone (Female)'],
      },
      vaccinations: [
        'Boostrix (Tetanus, Diphtheria & Pertussis Tdap) - $87.20',
        'Varicella (Chickenpox) - $109',
        'Hepatitis A - $119.90',
        'Hepatitis B - $261.60 for 3 doses',
        'Influenza - $76.30',
        'Measles, Mumps and Rubella (MMR) - $76.30',
        'Pneumococcal - $136.25',
        'Zostavax (Shingles) - $250.70',
        'Tetanus - $76.30',
        'Yellow Fever - $283.40',
      ],
    },
  },
  {
    id: 'lumina',
    name: 'LUMINA',
    price: '$272.50',
    highlights: [
      'Balanced panel for practical annual screening',
      'Clear category breakdown for faster understanding',
      'Optional add-ons when needed for personal goals',
    ],
    cards: [
      {
        title: 'Laboratory Tests',
        groups: [
          { label: 'Hematology', items: ['Full Blood Count', 'ESR', 'ABO (Blood group)'] },
          { label: 'Diabetes Panel', items: ['Fasting Blood Glucose'] },
          {
            label: 'Renal Function',
            items: ['Urea', 'Creatinine', 'Chloride', 'Sodium', 'Potassium'],
          },
          { label: 'Bone & Joint Profile', items: ['Calcium', 'Phosphate', 'Uric Acid'] },
          {
            label: 'Lipid Profile',
            items: [
              'Fasting Blood Cholesterol',
              'Triglycerides',
              'HDL & LDL Cholesterol',
              'Cholesterol / HDL Ratio',
            ],
          },
          {
            label: 'Liver Profile',
            items: [
              'Total Protein',
              'Albumin',
              'Globulin',
              'A/G Ratio',
              'Total Bilirubin',
              'Alkaline Phosphatase',
              'AST / SGOT',
              'ALT / SGPT',
              'Gamma-Glutamyl Transferase (GGT)',
            ],
          },
          { label: 'Cardiac Profile', items: ['High Sensitive CRP (hs-CRP)'] },
          {
            label: 'Hepatitis Profile',
            items: [
              'Hepatitis A IgG Antibody',
              'Hepatitis B s Antigen',
              'Hepatitis Bs Antibody',
            ],
          },
          {
            label: 'Cancer Markers',
            items: ['CA 19.9 (Pancreas)', 'CA 125 (Ovary - for female only)'],
          },
          { label: 'STD Profile', items: ['VDRL (&TPHA if required)'] },
          {
            label: 'Urine Analysis',
            items: ['Urine F&E', 'Urine Microalbumin / Urine Creatinine Ratio'],
          },
          { label: 'Stool Analysis', items: ['Stool Occult Blood'] },
        ],
      },
    ],
    optionalAddOns: {
      preMarital: { price: '+$109', title: 'Pre-marital Screening', items: ['Hormone Profile', 'Rubella Profile'] },
      fertility: {
        price: '+$141.70',
        title: 'Fertility Test',
        items: ['Seminal Analysis (Male)', 'Anti-Mullerian Hormone (Female)'],
      },
      vaccinations: [
        'Boostrix (Tetanus, Diphtheria & Pertussis Tdap) - $87.20',
        'Varicella (Chickenpox) - $109',
        'Hepatitis A - $119.90',
        'Hepatitis B - $261.60 for 3 doses',
        'Influenza - $76.30',
        'Measles, Mumps and Rubella (MMR) - $76.30',
        'Pneumococcal - $136.25',
        'Zostavax (Shingles) - $250.70',
        'Tetanus - $76.30',
        'Yellow Fever - $283.40',
      ],
    },
  },
  {
    id: 'legacy',
    name: 'LEGACY',
    price: '$381.50',
    highlights: [
      'Structured lab categories for easy scanning',
      'Includes core screening with doctor-guided follow-up',
      'Optional add-ons to tailor your results',
    ],
    cards: [
      {
        title: 'Laboratory Tests',
        groups: [
          { label: 'Hematology', items: ['Full Blood Count', 'ESR', 'ABO (Blood group)'] },
          { label: 'Diabetes Panel', items: ['Fasting Blood Glucose'] },
          {
            label: 'Renal Function',
            items: ['Urea', 'Creatinine', 'Chloride', 'Sodium', 'Potassium'],
          },
          { label: 'Bone & Joint Profile', items: ['Calcium', 'Phosphate', 'Uric Acid'] },
          {
            label: 'Lipid Profile',
            items: [
              'Fasting Blood Cholesterol',
              'Triglycerides',
              'HDL & LDL Cholesterol',
              'Cholesterol / HDL Ratio',
            ],
          },
          { label: 'Liver Profile', items: ['Total Protein', 'Albumin'] },
          { label: 'Urine Analysis', items: ['Urine F&E', 'Urine Microalbumin / Urine Creatinine Ratio'] },
          { label: 'Stool Analysis', items: ['Stool Fecal Blood', 'Stool Occult Blood'] },
        ],
      },
    ],
    optionalAddOns: {
      preMarital: { price: '+$109', title: 'Pre-marital Screening', items: ['Hormone Profile', 'Rubella Profile'] },
      fertility: {
        price: '+$141.70',
        title: 'Fertility Test',
        items: ['Seminal Analysis (Male)', 'Anti-Mullerian Hormone (Female)'],
      },
      vaccinations: [
        'Boostrix (Tetanus, Diphtheria & Pertussis Tdap) - $87.20',
        'Varicella (Chickenpox) - $109',
        'Hepatitis A - $119.90',
        'Hepatitis B - $261.60 for 3 doses',
        'Influenza - $76.30',
        'Measles, Mumps and Rubella (MMR) - $76.30',
        'Pneumococcal - $136.25',
        'Zostavax (Shingles) - $250.70',
        'Tetanus - $76.30',
        'Yellow Fever - $283.40',
      ],
    },
  },
  {
    id: 'celestial',
    name: 'CELESTIAL',
    price: '$1689.50',
    highlights: [
      'Premium panel designed for deeper prevention screening',
      'Expanded categories for more comprehensive baseline review',
      'Add-ons supported for specific client needs',
    ],
    cards: [
      {
        title: 'Laboratory Tests (Premium Panel)',
        groups: [
          { label: 'Hematology', items: ['Full Blood Count', 'ESR', 'ABO (Blood group)'] },
          { label: 'Diabetes Panel', items: ['Fasting Blood Glucose', 'HbA1c'] },
          { label: 'Renal Function', items: ['Urea', 'Creatinine', 'Chloride', 'Potassium', 'Sodium'] },
          {
            label: 'Bone & Joint Profile',
            items: ['Calcium', 'Uric Acid', 'Phosphate', 'Rheumatoid Factor (RAF)'],
          },
          {
            label: 'Lipid Profile',
            items: [
              'Fasting Blood Cholesterol',
              'Triglycerides',
              'HDL & LDL Cholesterol',
              'Cholesterol / HDL Ratio',
            ],
          },
          { label: 'Thyroid Profile', items: ['Free T3', 'Free T4', 'TSH (Thyroid Stimulating Hormone)'] },
          { label: 'Cardiac Profile', items: ['High Sensitive CRP (hs-CRP)', 'Homocysteine', 'Apolipoprotein A1', 'Apolipoprotein B'] },
          {
            label: 'Liver Profile',
            items: [
              'Total Protein',
              'Albumin',
              'Globulin',
              'A/G Ratio',
              'Total Bilirubin',
              'Alkaline Phosphatase',
              'AST / SGOT',
              'ALT / SGPT',
              'Gamma-Glutamyl Transferase (GGT)',
            ],
          },
          { label: 'Anemia Profile', items: ['Vitamin B12', 'TIBC', 'Folic Acid', 'Ferritin'] },
          {
            label: 'Cancer Markers',
            items: [
              'Alpha Fetoprotein (Liver)',
              'Carcinoembryonic Antigen (Colon)',
              'CA 19.9 (Pancreas)',
              'CA 125 (Ovary - for female only)',
              'PSA (Prostate - for male only)',
              'EBV EA IgA (Nose)',
            ],
          },
          {
            label: 'Hepatitis Profile',
            items: [
              'Hepatitis A IgG Antibody',
              'Hepatitis B s Antigen',
              'Hepatitis Bs Antigen',
              'Hepatitis Bs Antibody',
            ],
          },
          { label: 'STD Profile', items: ['VDRL (&TPHA if required) indicates presence of TPHA (if VDRL positive)'] },
          { label: 'Toxicology', items: ['Serum Copper'] },
          {
            label: 'Urine Analysis',
            items: ['Urine F&E', 'Urine Microalbumin / Urine Creatinine Ratio', 'Creatinine Ratio'],
          },
          { label: 'Stool Analysis', items: ['Stool Fecal Blood', 'Stool Occult Blood'] },
          {
            label: 'Additional Tests Included',
            items: [
              'Resting 12-Lead Electrocardiogram (ECG)',
              'Chest X-ray',
              'Ultrasound Abdomen',
              'Ultrasound Abdomen & Pelvis (Female)',
            ],
          },
        ],
      },
    ],
    optionalAddOns: {
      preMarital: { price: '+$100', title: 'Pre-marital Screening', items: ['Hormone Profile', 'Rubella Profile'] },
      fertility: {
        price: '+$130',
        title: 'Fertility Test',
        items: ['Seminal Analysis (Male)', 'Anti-Mullerian Hormone (Female)'],
      },
    },
  },
  {
    id: 'dynasty',
    name: 'DYNASTY',
    price: '$981*',
    highlights: [
      'Comprehensive categories for strong early detection focus',
      'Detailed lab coverage with clinician-reviewed interpretation',
      'Structured optional additions where relevant',
    ],
    cards: [
      {
        title: 'Laboratory Tests',
        groups: [
          { label: 'Hematology', items: ['Full Blood Count', 'ESR', 'ABO (Blood group)'] },
          { label: 'Diabetes Panel', items: ['Fasting Blood Glucose', 'HbA1c'] },
          { label: 'Renal Function', items: ['Urea', 'Creatinine', 'Chloride', 'Sodium', 'Potassium'] },
          {
            label: 'Bone & Joint Profile',
            items: ['Calcium', 'Uric Acid', 'Phosphate', 'Rheumatoid Factor (RAF)'],
          },
          {
            label: 'Lipid Profile',
            items: [
              'Fasting Blood Cholesterol',
              'Triglycerides',
              'HDL & LDL Cholesterol',
              'Cholesterol / HDL Ratio',
            ],
          },
          { label: 'Cardiac Profile', items: ['High Sensitive CRP (hs-CRP)', 'Homocysteine'] },
          { label: 'Liver Profile', items: ['Total Protein', 'Albumin', 'Globulin', 'A/G Ratio', 'Total Bilirubin', 'Alkaline Phosphatase', 'AST / SGOT', 'ALT / SGPT', 'Gamma-Glutamyl Transferase (GGT)'] },
          { label: 'Thyroid Profile', items: ['Free T3', 'Free T4', 'TSH'] },
          { label: 'STD Profile', items: ['VDRL (&TPHA if required) indicates presence of TPHA (if VDRL positive)'] },
          { label: 'Hepatitis Profile', items: ['Hepatitis A IgG Antibody', 'Hepatitis Bs Antigen', 'Hepatitis Bs Antibody'] },
          { label: 'Cancer Markers', items: ['Alpha Fetoprotein (Liver)', 'Carcinoembryonic Antigen (Colon)', 'CA 19.9 (Pancreas)', 'CA 125 (Ovary - for female only)', 'PSA (Prostate - for male only)', 'EBV EA IgA (Nose)'] },
          { label: 'Anemia / Nutrition', items: ['Vitamin B12', 'TIBC', 'Folic Acid', 'Ferritin'] },
          { label: 'Stool Analysis', items: ['Stool Fecal Blood', 'Stool Occult Blood'] },
        ],
      },
    ],
    optionalAddOns: {
      preMarital: { price: '+$100', title: 'Pre-marital Screening', items: ['Hormone Profile', 'Rubella Profile'] },
      fertility: {
        price: '+$130',
        title: 'Fertility Test',
        items: ['Seminal Analysis (Male)', 'Anti-Mullerian Hormone (Female)'],
      },
    },
  },
]

export const WELLNESS_COMBOS = [
  {
    id: 'legacy-male-wellness',
    theme: 'legacy',
    title: 'LEGACY MALE WELLNESS SCREENING',
    price: '$817.50',
    bullets: ['Ultrasound Scrotum', 'Ultrasound Prostate', 'Male Hormone Profile: Total Testosterone'],
  },
  {
    id: 'legacy-female-wellness',
    theme: 'legacy',
    title: 'LEGACY FEMALE WELLNESS SCREENING',
    price: '$817.50',
    bullets: [
      'Ultrasound Breast',
      'Ultrasound Pelvis',
      'Pap smear (Thin Prep)',
      // 'Mammogram (Add $150 for ladies above 40 or family history of Breast Cancer)',
      'Female Hormone Profile: Progesterone, Estradiol (E2), Luteinising Hormone (LH), Follicle Stimulating Hormone (FSH)',
    ],
  },
  {
    id: 'legacy-cardiac-a',
    theme: 'legacy',
    title: 'LEGACY CARDIAC WELLNESS A SCREENING',
    price: '$708.50',
    bullets: ['Treadmill Stress Test'],
  },
  {
    id: 'legacy-cardiac-b',
    theme: 'legacy',
    title: 'LEGACY CARDIAC WELLNESS B SCREENING',
    price: '$827',
    bullets: ['CT Coronary Calcium Scoring'],
  },
  {
    id: 'legacy-cancer-wellness',
    theme: 'legacy',
    title: 'LEGACY CANCER WELLNESS SCREENING',
    price: '$1199',
    bullets: [
      'Ultrasound Abdomen',
      'Low Dose CT Lung',
      'Gastro Clear',
      'Ultrasound Prostate (Male)',
      'Ultrasound Pelvis (Female)',
      'Additional cancer marker: CA 15.3 (Breast Cancer)',
    ],
  },
  {
    id: 'imperial-male-wellness',
    theme: 'imperial',
    title: 'IMPERIAL MALE WELLNESS SCREENING',
    price: '$948.30',
    bullets: ['Ultrasound Scrotum', 'Ultrasound Prostate', 'Male Hormone Profile: Total Testosterone'],
  },
  {
    id: 'imperial-female-wellness',
    theme: 'imperial',
    title: 'IMPERIAL FEMALE WELLNESS SCREENING',
    price: '$948.30',
    bullets: [
      'Ultrasound Breast',
      'Ultrasound Pelvis',
      'Pap smear (Thin Prep)',
      'Mammogram (Add $150 for ladies above 40 or family history of Breast Cancer)',
      'Female Hormone Profile: Progesterone, Estradiol (E2), Luteinising Hormone (LH), Follicle Stimulating Hormone (FSH)',
    ],
  },
  {
    id: 'imperial-cardiac-a',
    theme: 'imperial',
    title: 'IMPERIAL CARDIAC WELLNESS A SCREENING',
    price: '$839.30',
    bullets: ['Treadmill Stress Test'],
  },
  {
    id: 'imperial-cardiac-b',
    theme: 'imperial',
    title: 'IMPERIAL CARDIAC WELLNESS B SCREENING',
    price: '$1002.80',
    bullets: ['CT Coronary Calcium Scoring'],
  },
  {
    id: 'imperial-cancer-wellness',
    theme: 'imperial',
    title: 'IMPERIAL CANCER WELLNESS SCREENING',
    price: '$1329.80',
    bullets: [
      'Ultrasound Abdomen',
      'Low Dose CT Lung',
      'Gastro Clear',
      'Ultrasound Prostate (Male)',
      'Ultrasound Pelvis (Female)',
      'Additional cancer marker: CA 15.3 (Breast Cancer)',
    ],
  },
]

export const GLOBAL_STD = {
  title: 'GLOBAL HEALTH AND STD SCREENING',
  malePrice: '$566.80',
  femalePrice: '$643.10',
  description:
    'Our Global Health and STD Screening services provide comprehensive, confidential testing aligned with international medical guidelines. These screenings support early detection, timely treatment, and peace of mind for individuals seeking preventive care, travel readiness, or routine sexual health assessments.',
  maleTests: [
    'Full Blood Count',
    'Cholesterol Profile (TC/HDL/LDL)',
    'Kidney Function',
    'Bone/Joint Function',
    'Liver Function',
    'Thyroid Function',
    'Cancer Markers',
    'HIV',
    'Hepatitis A',
    'Hepatitis B',
    'Chlamydia',
    'Gonorrhoea',
    'Trichomoniasis',
    'Herpes Simplex Virus Type I/II',
    'Candida / Ureaplasma / Mycoplasma (as part of STD panel)',
    'VDRL / Syphilis testing (as part of STD panel)',
  ],
  femaleTests: [
    'Full Blood Count',
    'Cholesterol Profile (TC/HDL/LDL)',
    'Kidney Function',
    'Bone/Joint Function',
    'Liver Function',
    'Thyroid Function',
    'Cancer Markers',
    'HIV',
    'Hepatitis A',
    'Hepatitis B',
    'Chlamydia',
    'Gonorrhoea',
    'Trichomoniasis',
    'Herpes Simplex Virus Type I/II',
    'Candida / Ureaplasma / Mycoplasma (as part of STD panel)',
    'VDRL / Syphilis testing (as part of STD panel)',
  ],
}

export const STD_HIV_PACKAGES = [
  { id: 'std-hiv-1', label: 'BASIC 1', price: '$65.40', items: ['HIV', 'Syphilis', 'Hepatitis B Antibody', 'Hepatitis B Antigen'] },
  { id: 'std-hiv-2', label: 'BASIC 2', price: '$130.80', items: ['HIV', 'Syphilis', 'Hepatitis B Antibody', 'Hepatitis B Antigen', 'Herpes Simplex Virus (HSV I & II)'] },
  { id: 'std-hiv-3', label: 'BASIC 3', price: '$109', items: ['HIV', 'Syphilis', 'Hepatitis B Antibody', 'Hepatitis B Antigen', 'Hepatitis C'] },
  { id: 'std-hiv-4', label: 'BASIC 4', price: '$174.40', items: ['HIV', 'Syphilis', 'Hepatitis B Antibody', 'Hepatitis B Antigen', 'Hepatitis C', 'Herpes Simplex Virus (HSV I & II)'] },
]

// Additional STD/HIV package cards shown in the UI (urinary pathway).
export const STD_URINARY_PACKAGES = [
  {
    id: 'std-urinary-essential',
    label: 'ESSENTIAL',
    price: '$327',
    items: [
      'HIV',
      'Syphilis',
      'Hepatitis B Antibody',
      'Hepatitis B Antigen',
      'Hepatitis C',
      'Herpes Simplex Virus (HSV)',
      'Chlamydia & Gonorrhea PCR',
    ],
  },
  {
    id: 'std-urinary-male',
    label: 'MALE URINARY',
    price: '$305.20',
    items: [
      'Chlamydia & Gonorrhea PCR',
      'Monilia',
      'Trichomoniasis',
      'Ureaplasma',
      'Ureaplasma Mycoplasma',
      'Urine Culture & Sensitivity',
    ],
  },
  {
    id: 'std-urinary-female',
    label: 'FEMALE URINARY',
    price: '$414.20',
    items: [
      'Chlamydia & Gonorrhea PCR',
      'Monilia',
      'Trichomoniasis',
      'Ureaplasma',
      'Ureaplasma Mycoplasma',
      'Urine Culture & Sensitivity',
      'Vaginal Swab',
    ],
  },
]

export const ALLERGY_SECTION = {
  title: 'COMPREHENSIVE TESTING & ALLERGY TESTING',
  description:
    'Our body’s immune system can overreact to substances such as food, dust, seafood, animals and insects, proteins, and even some parasites. Most people are younger age, during childhood, but some allergies appear later in life. We provide single allergy test and comprehensive allergy testing to test for a particular allergen group or allergens. We are pleased to extend the following allergy panel comprising 59 of the most common allergens:',
  allergenGroups: [
    'Dust mites',
    'Fungi',
    'Insect (cockroaches)',
    'Nuts',
    'Seeds and legumes',
    'Meat',
    'Milk component',
    'Egg',
    'Seafood',
    'Animals epidermal / dander',
    'Dog / cat-type proteins (panel includes animal proteins)',
    'Grains',
    'Vegetables',
    'Fruits',
    'Peanut component',
    'Baker’s yeast (other component)',
  ],
}

