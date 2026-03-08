const { useState, useEffect, useCallback, useMemo } = React;

// Data loaded from patients-data.js

const CPT_CODES = [
  { code:'97110', desc:'Therapeutic Exercise', units:0 },
  { code:'97112', desc:'Neuromuscular Re-education', units:0 },
  { code:'97116', desc:'Gait Training', units:0 },
  { code:'97140', desc:'Manual Therapy', units:0 },
  { code:'97530', desc:'Therapeutic Activities', units:0 },
  { code:'97535', desc:'Self-care/Home Mgmt Training', units:0 },
  { code:'97542', desc:'Wheelchair Mgmt Training', units:0 },
  { code:'97150', desc:'Group Therapy', units:0 },
  { code:'97010', desc:'Hot/Cold Pack', units:0 },
  { code:'97014', desc:'Electrical Stimulation (unattended)', units:0 },
  { code:'97161', desc:'PT Eval - Low Complexity', units:0 },
  { code:'97162', desc:'PT Eval - Moderate Complexity', units:0 },
  { code:'97163', desc:'PT Eval - High Complexity', units:0 },
  { code:'97164', desc:'PT Re-evaluation', units:0 },
];

// ==================== HELPER FUNCTIONS ====================
function generateClinicalData(patient) {
  const rand = seededRandom(patient.id * 31);
  const pick = (arr) => arr[Math.floor(rand() * arr.length)];

  const chiefComplaints = {
    'Neuro': [`Patient admitted for ${patient.admitReason}. Reports sudden onset of weakness and difficulty with mobility.`, `Admitted ${patient.losDay} day(s) ago for ${patient.admitReason}. Patient reports difficulty with functional mobility and ADLs.`],
    'Cardiopulmonary': [`Patient admitted for ${patient.admitReason}. Reports shortness of breath with exertion and decreased activity tolerance.`, `Admitted for ${patient.admitReason}. Patient reports fatigue and dyspnea with minimal activity.`],
    'Hip Fracture': [`Patient admitted following fall resulting in ${patient.admitReason}. S/P ORIF. Reports pain and inability to bear weight.`, `Admitted for ${patient.admitReason}. Patient reports hip pain and difficulty with mobility post-operatively.`],
    'Joint Replacement': [`Patient admitted for elective ${patient.admitReason}. Post-operative day ${patient.losDay}. Reports surgical site pain and stiffness.`, `S/P ${patient.admitReason}. Patient reports pain managed with medication, difficulty with transfers and ambulation.`],
    'Falls': [`Patient admitted following ${patient.admitReason}. Reports generalized weakness and unsteadiness with ambulation.`, `Admitted after ${patient.admitReason}. Patient reports fear of falling and decreased confidence with mobility.`],
    'Deconditioning': [`Patient admitted for ${patient.admitReason}. Reports progressive decline in functional mobility over past ${pick(['1 week','2 weeks','several days','1 month'])}.`, `Admitted for ${patient.admitReason}. Patient reports inability to perform ADLs and ambulate safely.`],
    'Sepsis': [`Patient admitted for ${patient.admitReason}. Currently medically stabilizing. Reports extreme fatigue and generalized weakness.`, `Admitted for ${patient.admitReason}. Patient is ${pick(['on day ' + patient.losDay + ' of antibiotics','recovering from septic shock','medically improving'])}. Reports significant deconditioning.`],
    'Other Systems': [`Patient admitted for ${patient.admitReason}. Reports decreased functional mobility and need for assistance with ADLs.`, `Admitted for ${patient.admitReason}. Patient reports difficulty with mobility and self-care activities.`],
  };
  const cc = pick(chiefComplaints[patient.category] || chiefComplaints['Other Systems']);

  const hpiTemplates = [
    `${patient.age}-year-old ${patient.gender.toLowerCase()} admitted on ${patient.admitDate} for ${patient.admitReason}. PMH significant for ${patient.pmh}. Prior to admission, patient was ${patient.socialHistory.priorMobility.toLowerCase()} and living ${patient.socialHistory.living.toLowerCase()}. Patient ${patient.socialHistory.stairs !== 'None' ? 'has ' + patient.socialHistory.stairs.toLowerCase() + ' at home' : 'has no stairs at home'}. Current precautions include: ${patient.precautions.join(', ')}. Weight-bearing status: ${patient.wbStatus}. Code status: ${patient.codeStatus}.`,
    `${patient.gender === 'Female' ? 'Female' : 'Male'} patient, ${patient.age} years old, admitted ${patient.losDay} day(s) ago with diagnosis of ${patient.admitReason}. Medical history includes ${patient.pmh}. Prior level of function: ${patient.socialHistory.priorMobility}. Living situation: ${patient.socialHistory.living}. Current weight-bearing status: ${patient.wbStatus}. Precautions: ${patient.precautions.join(', ')}.`,
  ];

  return {
    chiefComplaint: cc,
    hpi: pick(hpiTemplates),
    plof: `Prior to admission, patient was ${patient.socialHistory.priorMobility.toLowerCase()}. Living ${patient.socialHistory.living.toLowerCase()}. ${patient.socialHistory.stairs}. ${patient.socialHistory.occupation !== 'Retired' ? 'Employed as ' + patient.socialHistory.occupation.toLowerCase() + '.' : 'Retired.'} ${patient.priorDevices.walker ? 'Used walker for ambulation.' : ''} ${patient.priorDevices.manualWheelchair ? 'Used manual wheelchair.' : ''}`,
    assessment: `Patient presents with functional limitations in mobility and ADLs secondary to ${patient.admitReason}. ${patient.category === 'Neuro' ? 'Neurological deficits noted affecting functional mobility.' : ''} ${patient.category === 'Cardiopulmonary' ? 'Activity tolerance limited by cardiopulmonary status.' : ''} Patient would benefit from skilled PT services to improve functional mobility, transfers, gait, and ADL independence to achieve safe discharge disposition. Rehab potential: ${pick(['Good','Fair','Fair to Good','Good — patient motivated'])} based on prior level of function and medical stability.`,
    ptDiagnosis: `Impaired functional mobility, balance deficits, and decreased independence with ADLs secondary to ${patient.admitReason}`,
    dcPlan: `Anticipated discharge to ${patient.dcRecommendation}. ${patient.socialHistory.stairs !== 'None' ? 'Patient will need to negotiate ' + patient.socialHistory.stairs.toLowerCase() + ' for home entry.' : ''} DME needs to be assessed prior to discharge.`,
  };
}

// ==================== LOGIN ====================
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('smitchell');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('PT');
  return (
    <div className="login-page">
      <div className="login-box">
        <h1>RehabFlow <span style={{color:'var(--accent)'}}>Inpatient</span></h1>
        <p className="subtitle">Hospital Inpatient PT/PTA EMR Training System</p>
        <div className="login-role">
          {['PT','PTA','Student PT','Student PTA'].map(r => (
            <button key={r} className={role===r?'active':''} onClick={()=>setRole(r)}>{r}</button>
          ))}
        </div>
        <label>Username</label>
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Enter username"/>
        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter password" onKeyDown={e=>e.key==='Enter'&&onLogin({username,role,displayName:role==='PTA'?'Alex Rivera, PTA':role==='Student PT'?`${username} (Student PT)`:role==='Student PTA'?`${username} (Student PTA)`:'Dr. Sarah Mitchell, PT, DPT'})}/>
        <button onClick={()=>onLogin({username,role,displayName:role==='PTA'?'Alex Rivera, PTA':role==='Student PT'?`${username} (Student PT)`:role==='Student PTA'?`${username} (Student PTA)`:'Dr. Sarah Mitchell, PT, DPT'})}>Sign In</button>
        <p style={{marginTop:12,fontSize:11,color:'var(--text-muted)',textAlign:'center'}}>Training environment — No real patient data</p>
      </div>
    </div>
  );
}

// ==================== MAIN APP ====================
function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState(SAMPLE_PATIENTS);

  if (!user) return <LoginPage onLogin={setUser}/>;

  const navItems = [
    { id:'dashboard', label:'Dashboard', icon:'\u{1F3E5}' },
    { id:'schedule', label:'Schedule', icon:'\u{1F4C5}' },
    { id:'patients', label:'Patient Census', icon:'\u{1F465}' },
    { id:'unitBoard', label:'Unit Board', icon:'\u{1F4CB}' },
  ];

  return (
    <div className="app-layout">
      <div className="sidebar">
        <div className="sidebar-logo">Rehab<span>Flow</span> <span style={{fontSize:11,opacity:0.7}}>Inpatient</span></div>
        <div className="sidebar-nav">
          {navItems.map(n => (
            <div key={n.id} className={`sidebar-item ${currentPage===n.id?'active':''}`} onClick={()=>{setCurrentPage(n.id);setSelectedPatient(null);}}>
              <span className="icon">{n.icon}</span>{n.label}
            </div>
          ))}
          {selectedPatient && (
            <div className={`sidebar-item ${currentPage==='chart'?'active':''}`} onClick={()=>setCurrentPage('chart')} style={{borderTop:'1px solid rgba(255,255,255,0.1)',marginTop:8,paddingTop:12}}>
              <span className="icon">{'\u{1F4C4}'}</span>
              <div><div style={{fontSize:12}}>{selectedPatient.lastName}, {selectedPatient.firstName}</div><div style={{fontSize:10,opacity:0.7}}>Rm {selectedPatient.roomNum}</div></div>
            </div>
          )}
        </div>
        <div className="sidebar-user">
          <div className="name">{user.displayName}</div>
          <div className="role">{user.role} | Inpatient Rehab</div>
          <div style={{marginTop:8}}><button onClick={()=>setUser(null)} style={{background:'none',border:'1px solid rgba(255,255,255,0.2)',color:'var(--sidebar-text)',padding:'4px 12px',borderRadius:4,cursor:'pointer',fontSize:11}}>Sign Out</button></div>
        </div>
      </div>
      <div className="main-content">
        <div className="top-bar">
          <h2>{currentPage==='chart'&&selectedPatient ? `${selectedPatient.lastName}, ${selectedPatient.firstName} — Rm ${selectedPatient.roomNum} (${selectedPatient.unit})` : navItems.find(n=>n.id===currentPage)?.label||'Dashboard'}</h2>
          <div className="top-bar-actions">
            <span style={{fontSize:11,opacity:0.7}}>{new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</span>
          </div>
        </div>
        <div className="content-area">
          {currentPage==='dashboard' && <Dashboard patients={patients} setSelectedPatient={setSelectedPatient} setCurrentPage={setCurrentPage}/>}
          {currentPage==='schedule' && <Schedule patients={patients} setSelectedPatient={setSelectedPatient} setCurrentPage={setCurrentPage}/>}
          {currentPage==='patients' && <PatientCensus patients={patients} setPatients={setPatients} setSelectedPatient={setSelectedPatient} setCurrentPage={setCurrentPage}/>}
          {currentPage==='unitBoard' && <UnitBoard patients={patients} setSelectedPatient={setSelectedPatient} setCurrentPage={setCurrentPage}/>}
          {currentPage==='chart' && selectedPatient && <PatientChart patient={selectedPatient} user={user} setCurrentPage={setCurrentPage}/>}
        </div>
      </div>
    </div>
  );
}

// ==================== DASHBOARD ====================
function Dashboard({ patients, setSelectedPatient, setCurrentPage }) {
  const active = patients.filter(p => p.status !== 'Discharged');
  const icu = patients.filter(p => p.status === 'ICU');
  const newAdmits = patients.filter(p => p.careStage === 'Admission (Day 1)');
  const dcPlanning = patients.filter(p => p.careStage === 'Discharge Planning' || p.careStage === 'Nearing Discharge');

  const catCounts = {};
  active.forEach(p => { catCounts[p.category] = (catCounts[p.category]||0) + 1; });

  return (
    <div className="fade-in">
      <div className="dash-stats">
        <div className="stat-card"><div className="stat-icon">{'\u{1F3E5}'}</div><div className="stat-value">{active.length}</div><div className="stat-label">Active Patients</div></div>
        <div className="stat-card"><div className="stat-icon">{'\u{1F6A8}'}</div><div className="stat-value" style={{color:'var(--danger)'}}>{icu.length}</div><div className="stat-label">ICU Patients</div></div>
        <div className="stat-card"><div className="stat-icon">{'\u{1F195}'}</div><div className="stat-value" style={{color:'var(--accent)'}}>{newAdmits.length}</div><div className="stat-label">New Admissions</div></div>
        <div className="stat-card"><div className="stat-icon">{'\u{1F3E0}'}</div><div className="stat-value" style={{color:'var(--success)'}}>{dcPlanning.length}</div><div className="stat-label">Discharge Planning</div></div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <div className="card">
          <div className="card-header">Patient Census by Diagnosis Category</div>
          <div className="card-body">
            {Object.entries(catCounts).sort((a,b)=>b[1]-a[1]).map(([cat,count]) => (
              <div key={cat} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:'1px solid #f1f5f9'}}>
                <span style={{fontWeight:500}}>{cat}</span>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <div style={{width:Math.max(count*8,20),height:16,background:'var(--primary)',borderRadius:3,opacity:0.7}}></div>
                  <span style={{fontWeight:700,minWidth:24,textAlign:'right'}}>{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">New Admissions — Pending Initial Eval</div>
          <div className="card-body" style={{padding:0}}>
            <table className="data-table">
              <thead><tr><th>Patient</th><th>Room</th><th>Diagnosis</th><th>Precautions</th></tr></thead>
              <tbody>
                {newAdmits.slice(0,8).map(p => (
                  <tr key={p.id} onClick={()=>{setSelectedPatient(p);setCurrentPage('chart');}}>
                    <td style={{fontWeight:600}}>{p.lastName}, {p.firstName}</td>
                    <td>{p.roomNum}</td>
                    <td style={{fontSize:11}}>{p.admitReason}</td>
                    <td>{p.precautions.slice(0,2).map(pr=><span key={pr} className="badge badge-red" style={{fontSize:9,marginRight:2}}>{pr}</span>)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">Discharge Planning</div>
          <div className="card-body" style={{padding:0}}>
            <table className="data-table">
              <thead><tr><th>Patient</th><th>Room</th><th>LOS</th><th>DC Recommendation</th></tr></thead>
              <tbody>
                {dcPlanning.slice(0,8).map(p => (
                  <tr key={p.id} onClick={()=>{setSelectedPatient(p);setCurrentPage('chart');}}>
                    <td style={{fontWeight:600}}>{p.lastName}, {p.firstName}</td>
                    <td>{p.roomNum}</td>
                    <td>{p.losDay} days</td>
                    <td style={{fontSize:11}}>{p.dcRecommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">ICU / Step-Down Patients</div>
          <div className="card-body" style={{padding:0}}>
            <table className="data-table">
              <thead><tr><th>Patient</th><th>Room</th><th>Unit</th><th>Diagnosis</th></tr></thead>
              <tbody>
                {patients.filter(p=>p.careStage==='ICU'||p.careStage==='Step-Down').slice(0,8).map(p => (
                  <tr key={p.id} onClick={()=>{setSelectedPatient(p);setCurrentPage('chart');}}>
                    <td style={{fontWeight:600}}>{p.lastName}, {p.firstName}</td>
                    <td>{p.roomNum}</td>
                    <td><span className="badge badge-red">{p.careStage}</span></td>
                    <td style={{fontSize:11}}>{p.admitReason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== SCHEDULE ====================
function Schedule({ patients, setSelectedPatient, setCurrentPage }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6;
  const dateStr = selectedDate.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  const changeDate = (delta) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + delta);
    setSelectedDate(d);
  };

  const scheduleForDate = useMemo(() => {
    if (isToday) return SCHEDULE_DATA;
    const activePatients = patients.filter(p => p.status !== 'Discharged');
    const times = ['7:00 AM','7:30 AM','8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM'];
    const generated = [];
    const dayOffset = Math.floor((selectedDate - new Date()) / 86400000);
    const statuses = ['Scheduled','Scheduled','In Progress','Completed'];
    times.forEach((time, idx) => {
      const seed1 = ((idx + 1) * 7 + dayOffset * 13 + 1) & 0x7FFFFFFF;
      const seed2 = ((idx + 1) * 11 + dayOffset * 17 + 2) & 0x7FFFFFFF;
      if (seed1 % 100 < 65 && activePatients.length > 0) {
        const pIdx = seed1 % activePatients.length;
        const p = activePatients[pIdx];
        const type = p.careStage === 'Admission (Day 1)' ? 'Initial Eval' : 'Treatment';
        generated.push({time, therapist:'PT', patientId:p.id, patient:`${p.lastName}, ${p.firstName}`, type, status:statuses[seed1 % statuses.length], room:`${p.roomNum} (${p.unit})`});
      } else {
        generated.push({time, therapist:'PT', patientId:null, patient:'', type:'', status:'', room:''});
      }
      if (seed2 % 100 < 45 && activePatients.length > 0) {
        const pIdx = seed2 % activePatients.length;
        const p = activePatients[pIdx];
        generated.push({time, therapist:'PTA', patientId:p.id, patient:`${p.lastName}, ${p.firstName}`, type:'Treatment', status:statuses[seed2 % statuses.length], room:`${p.roomNum} (${p.unit})`});
      } else {
        generated.push({time, therapist:'PTA', patientId:null, patient:'', type:'', status:'', room:''});
      }
    });
    return generated;
  }, [selectedDate, isToday, patients, isWeekend]);

  const times = [...new Set(scheduleForDate.map(s=>s.time))];

  return (
    <div className="fade-in">
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:16,alignItems:'center'}}>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <button className="btn btn-outline" onClick={()=>changeDate(-1)}>{'\u25C0'}</button>
          <h3 style={{minWidth:300,textAlign:'center'}}>{dateStr}</h3>
          <button className="btn btn-outline" onClick={()=>changeDate(1)}>{'\u25B6'}</button>
          {!isToday && <button className="btn btn-sm btn-outline" style={{marginLeft:8}} onClick={()=>setSelectedDate(new Date())}>Today</button>}
        </div>
      </div>
      {isWeekend ? (
        <div className="card"><div className="card-body" style={{textAlign:'center',padding:40,color:'var(--text-muted)'}}><h3>Weekend — Reduced Schedule</h3><p>Only essential/on-call patients scheduled.</p></div></div>
      ) : (
      <div className="card">
        <div className="card-body" style={{padding:0,overflowX:'auto'}}>
          <table className="data-table">
            <thead><tr><th style={{width:80}}>Time</th><th>PT — Dr. Mitchell</th><th>PTA — A. Rivera</th></tr></thead>
            <tbody>
              {times.map(t => {
                const ptAppt = scheduleForDate.find(s=>s.time===t && s.therapist==='PT');
                const ptaAppt = scheduleForDate.find(s=>s.time===t && s.therapist==='PTA');
                return (
                  <tr key={t}>
                    <td style={{fontWeight:600,background:'#f8fafc'}}>{t}</td>
                    <td>{ptAppt && ptAppt.patientId ? (
                      <div className={`schedule-appt ${ptAppt.type==='Initial Eval'?'eval':ptAppt.type==='Discharge Eval'?'discharge':'followup'}`} onClick={()=>{
                        const p = patients.find(p=>p.id===ptAppt.patientId);
                        if(p){setSelectedPatient(p);setCurrentPage('chart');}
                      }}>
                        <div className="appt-name">{ptAppt.patient}</div>
                        <div className="appt-type">{ptAppt.type} {'\u2022'} {ptAppt.room} {'\u2022'} {ptAppt.status}</div>
                      </div>
                    ) : <span style={{color:'#ccc',fontSize:12}}>{'\u2014'} Open {'\u2014'}</span>}</td>
                    <td>{ptaAppt && ptaAppt.patientId ? (
                      <div className="schedule-appt followup" onClick={()=>{
                        const p = patients.find(p=>p.id===ptaAppt.patientId);
                        if(p){setSelectedPatient(p);setCurrentPage('chart');}
                      }}>
                        <div className="appt-name">{ptaAppt.patient}</div>
                        <div className="appt-type">{ptaAppt.type} {'\u2022'} {ptaAppt.room} {'\u2022'} {ptaAppt.status}</div>
                      </div>
                    ) : <span style={{color:'#ccc',fontSize:12}}>{'\u2014'} Open {'\u2014'}</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  );
}

// ==================== PATIENT CENSUS ====================
function PatientCensus({ patients, setPatients, setSelectedPatient, setCurrentPage }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Active');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [unitFilter, setUnitFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(0);
  const perPage = 20;

  const categories = [...new Set(patients.map(p=>p.category))].sort();
  const units = [...new Set(patients.map(p=>p.unit))].sort();
  const stages = ['Admission (Day 1)','Acute (Day 2-3)','Acute (Day 3-5)','Progressing (Day 4-7)','Progressing (Day 5-10)','Nearing Discharge','Discharge Planning','ICU','Step-Down','Discharged'];

  const filtered = useMemo(() => {
    let list = patients.filter(p => {
      const matchSearch = `${p.firstName} ${p.lastName} ${p.dx} ${p.roomNum} ${p.unit} ${p.category} ${p.mrn}`.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter==='All' || (statusFilter==='Active' ? p.status!=='Discharged' : p.status===statusFilter);
      const matchCat = categoryFilter==='All' || p.category===categoryFilter;
      const matchUnit = unitFilter==='All' || p.unit===unitFilter;
      return matchSearch && matchStatus && matchCat && matchUnit;
    });
    list.sort((a,b) => {
      let cmp = 0;
      if (sortBy==='name') cmp = `${a.lastName}${a.firstName}`.localeCompare(`${b.lastName}${b.firstName}`);
      else if (sortBy==='room') cmp = a.roomNum.localeCompare(b.roomNum);
      else if (sortBy==='los') cmp = a.losDay - b.losDay;
      else if (sortBy==='category') cmp = a.category.localeCompare(b.category);
      return sortDir==='asc' ? cmp : -cmp;
    });
    return list;
  }, [patients, search, statusFilter, categoryFilter, unitFilter, sortBy, sortDir]);

  const paged = filtered.slice(page*perPage, (page+1)*perPage);
  const totalPages = Math.ceil(filtered.length / perPage);
  const handleSort = (col) => { if (sortBy===col) setSortDir(sortDir==='asc'?'desc':'asc'); else { setSortBy(col); setSortDir('asc'); } };

  const stageColor = (s) => {
    if (s.includes('Admission')) return 'badge-blue';
    if (s.includes('Acute')) return 'badge-yellow';
    if (s.includes('Progressing')) return 'badge-green';
    if (s.includes('Nearing') || s.includes('Discharge Planning')) return 'badge-purple';
    if (s === 'ICU') return 'badge-red';
    if (s === 'Step-Down') return 'badge-yellow';
    if (s === 'Discharged') return 'badge-gray';
    return 'badge-gray';
  };

  return (
    <div className="fade-in">
      <div style={{marginBottom:12}}>
        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:8}}>
          <input placeholder="Search name, MRN, diagnosis, room, unit..." value={search} onChange={e=>{setSearch(e.target.value);setPage(0);}} style={{padding:'7px 12px',border:'1px solid var(--border)',borderRadius:4,width:350}} />
          <select value={statusFilter} onChange={e=>{setStatusFilter(e.target.value);setPage(0);}} style={{padding:'7px 10px',border:'1px solid var(--border)',borderRadius:4}}>
            <option value="All">All Statuses</option><option value="Active">Active</option><option value="ICU">ICU</option><option value="Discharged">Discharged</option>
          </select>
          <select value={categoryFilter} onChange={e=>{setCategoryFilter(e.target.value);setPage(0);}} style={{padding:'7px 10px',border:'1px solid var(--border)',borderRadius:4}}>
            <option value="All">All Categories</option>{categories.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
          <select value={unitFilter} onChange={e=>{setUnitFilter(e.target.value);setPage(0);}} style={{padding:'7px 10px',border:'1px solid var(--border)',borderRadius:4}}>
            <option value="All">All Units</option>{units.map(u=><option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <span style={{fontSize:12,color:'var(--text-muted)'}}>{filtered.length} patients found</span>
      </div>

      <div className="card">
        <div className="card-body" style={{padding:0}}>
          <table className="data-table">
            <thead><tr>
              <th style={{cursor:'pointer'}} onClick={()=>handleSort('name')}>Patient {sortBy==='name'?(sortDir==='asc'?'\u25B2':'\u25BC'):''}</th>
              <th>MRN</th>
              <th style={{cursor:'pointer'}} onClick={()=>handleSort('room')}>Room {sortBy==='room'?(sortDir==='asc'?'\u25B2':'\u25BC'):''}</th>
              <th>Unit</th>
              <th style={{cursor:'pointer'}} onClick={()=>handleSort('category')}>Category {sortBy==='category'?(sortDir==='asc'?'\u25B2':'\u25BC'):''}</th>
              <th>Diagnosis</th>
              <th style={{cursor:'pointer'}} onClick={()=>handleSort('los')}>LOS {sortBy==='los'?(sortDir==='asc'?'\u25B2':'\u25BC'):''}</th>
              <th>WB Status</th>
              <th>Stage</th>
              <th>Precautions</th>
            </tr></thead>
            <tbody>
              {paged.map(p => (
                <tr key={p.id} onClick={()=>{setSelectedPatient(p);setCurrentPage('chart');}}>
                  <td style={{fontWeight:600}}>{p.lastName}, {p.firstName}</td>
                  <td style={{fontSize:11,fontFamily:'monospace'}}>{p.mrn}</td>
                  <td style={{fontWeight:600}}>{p.roomNum}</td>
                  <td style={{fontSize:11}}>{p.unit}</td>
                  <td><span className={`badge ${p.category==='Neuro'?'badge-purple':p.category==='Cardiopulmonary'?'badge-red':p.category==='Sepsis'?'badge-red':'badge-blue'}`} style={{fontSize:10}}>{p.category}</span></td>
                  <td style={{fontSize:11,maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.admitReason}</td>
                  <td style={{fontWeight:600}}>{p.losDay}d</td>
                  <td><span className={`badge ${p.wbStatus==='NWB'?'badge-red':p.wbStatus==='TTWB'||p.wbStatus==='PWB'?'badge-yellow':'badge-green'}`} style={{fontSize:10}}>{p.wbStatus}</span></td>
                  <td><span className={`badge ${stageColor(p.careStage)}`} style={{fontSize:10}}>{p.careStage}</span></td>
                  <td>{p.precautions.slice(0,2).map(pr=><span key={pr} className="badge badge-red" style={{fontSize:9,marginRight:2}}>{pr}</span>)}{p.precautions.length>2 && <span style={{fontSize:9,color:'var(--text-muted)'}}>+{p.precautions.length-2}</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {totalPages > 1 && (
        <div style={{display:'flex',justifyContent:'center',gap:4,marginTop:12}}>
          <button className="btn btn-sm btn-outline" disabled={page===0} onClick={()=>setPage(page-1)}>{'\u25C0'} Prev</button>
          {[...Array(Math.min(totalPages,10))].map((_,i) => (
            <button key={i} className={`btn btn-sm ${page===i?'btn-primary':'btn-outline'}`} onClick={()=>setPage(i)}>{i+1}</button>
          ))}
          <button className="btn btn-sm btn-outline" disabled={page>=totalPages-1} onClick={()=>setPage(page+1)}>Next {'\u25B6'}</button>
        </div>
      )}
    </div>
  );
}

// ==================== UNIT BOARD ====================
function UnitBoard({ patients, setSelectedPatient, setCurrentPage }) {
  const [selectedUnit, setSelectedUnit] = useState('All');
  const units = [...new Set(patients.filter(p=>p.status!=='Discharged').map(p=>p.unit))].sort();
  const active = patients.filter(p => p.status !== 'Discharged' && (selectedUnit === 'All' || p.unit === selectedUnit));

  return (
    <div className="fade-in">
      <div style={{display:'flex',gap:8,marginBottom:16,alignItems:'center'}}>
        <span style={{fontWeight:600}}>Unit:</span>
        <select value={selectedUnit} onChange={e=>setSelectedUnit(e.target.value)} style={{padding:'7px 10px',border:'1px solid var(--border)',borderRadius:4}}>
          <option value="All">All Units</option>{units.map(u=><option key={u}>{u}</option>)}
        </select>
        <span style={{fontSize:12,color:'var(--text-muted)',marginLeft:8}}>{active.length} patients</span>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:12}}>
        {active.map(p => (
          <div key={p.id} className="card" style={{cursor:'pointer',marginBottom:0}} onClick={()=>{setSelectedPatient(p);setCurrentPage('chart');}}>
            <div className="card-header" style={{padding:'8px 12px'}}>
              <div>
                <span style={{fontWeight:700}}>{p.lastName}, {p.firstName}</span>
                <span style={{fontSize:11,color:'var(--text-muted)',marginLeft:8}}>Rm {p.roomNum}</span>
              </div>
              <span className={`badge ${p.status==='ICU'?'badge-red':'badge-green'}`} style={{fontSize:10}}>{p.careStage}</span>
            </div>
            <div className="card-body" style={{padding:'8px 12px',fontSize:12}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:4}}>
                <div><strong>Dx:</strong> {p.admitReason}</div>
                <div><strong>LOS:</strong> {p.losDay} days</div>
                <div><strong>WB:</strong> <span className={`badge ${p.wbStatus==='NWB'?'badge-red':p.wbStatus==='WBAT'||p.wbStatus==='FWB'?'badge-green':'badge-yellow'}`} style={{fontSize:9}}>{p.wbStatus}</span></div>
                <div><strong>Code:</strong> {p.codeStatus}</div>
              </div>
              <div style={{marginTop:4}}><strong>Precautions:</strong> {p.precautions.map(pr=><span key={pr} className="badge badge-red" style={{fontSize:9,marginRight:2}}>{pr}</span>)}</div>
              <div style={{marginTop:4,display:'flex',gap:8,fontSize:11,color:'var(--text-muted)'}}>
                <span>HR:{p.vitals.hr}</span>
                <span>BP:{p.vitals.bp_sys}/{p.vitals.bp_dia}</span>
                <span>SpO2:{p.vitals.spo2}%</span>
                <span>O2:{p.vitals.o2_device}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== PATIENT CHART ====================
function PatientChart({ patient, user, setCurrentPage }) {
  const [chartTab, setChartTab] = useState('overview');
  const chartTabs = [
    { id:'overview', label:'Overview' },
    { id:'vitals', label:'Vitals/Lines' },
    { id:'sectionGG', label:'Section GG' },
    { id:'assistLevels', label:'Assist Levels' },
    { id:'evalNote', label:'Initial Eval' },
    { id:'dailyNote', label:'Treatment Note' },
    { id:'progressNote', label:'Progress Note' },
    { id:'documents', label:'Documents' },
  ];

  return (
    <div className="fade-in">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
          <button className="btn btn-outline" onClick={()=>setCurrentPage('patients')}>{'\u2190'} Back</button>
          <h2 style={{fontSize:20}}>{patient.lastName}, {patient.firstName}</h2>
          <span className={`badge ${patient.status==='Active'?'badge-green':patient.status==='ICU'?'badge-red':'badge-gray'}`}>{patient.status}</span>
          <span className="badge badge-blue">{patient.careStage}</span>
          <span style={{fontSize:11,color:'var(--text-muted)'}}>Age {patient.age} {'\u2022'} {patient.gender} {'\u2022'} Rm {patient.roomNum} ({patient.unit})</span>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn btn-primary" onClick={()=>setChartTab('dailyNote')}>+ New Note</button>
          <button className="btn btn-outline">Print</button>
        </div>
      </div>

      {/* Alerts Banner */}
      {(patient.precautions.length > 0 || patient.alerts.length > 0) && (
        <div className="alert alert-warning" style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
          <strong>PRECAUTIONS:</strong>
          {patient.precautions.map(p=><span key={p} className="badge badge-red">{p}</span>)}
          {patient.alerts.map(a=><span key={a} className="badge badge-yellow">{a}</span>)}
          <span className={`badge ${patient.wbStatus==='NWB'?'badge-red':patient.wbStatus==='WBAT'||patient.wbStatus==='FWB'?'badge-green':'badge-yellow'}`} style={{fontWeight:700}}>WB: {patient.wbStatus}</span>
          <span className="badge badge-purple">{patient.codeStatus}</span>
        </div>
      )}

      {/* Quick Summary */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(8,1fr)',gap:8,marginBottom:12}}>
        {[
          {label:'LOS',value:`${patient.losDay}d`,color:'var(--primary)'},
          {label:'Tx Sessions',value:patient.totalTxSessions,color:'var(--primary)'},
          {label:'HR',value:patient.vitals.hr,color:patient.vitals.hr>100?'var(--danger)':'var(--success)'},
          {label:'BP',value:`${patient.vitals.bp_sys}/${patient.vitals.bp_dia}`,color:patient.vitals.bp_sys>140||patient.vitals.bp_sys<90?'var(--danger)':'var(--success)'},
          {label:'SpO2',value:`${patient.vitals.spo2}%`,color:patient.vitals.spo2<92?'var(--danger)':'var(--success)'},
          {label:'RR',value:patient.vitals.rr,color:patient.vitals.rr>24?'var(--danger)':'var(--success)'},
          {label:'Temp',value:`${patient.vitals.temp}\u00B0F`,color:parseFloat(patient.vitals.temp)>100.4?'var(--danger)':'var(--success)'},
          {label:'O2 Device',value:patient.vitals.o2_device==='Room Air'?'RA':patient.vitals.o2_device.replace('Nasal Cannula','NC'),color:'var(--text-muted)'},
        ].map((s,i)=>(
          <div key={i} style={{background:'#fff',border:'1px solid var(--border)',borderRadius:6,padding:'6px 8px',textAlign:'center'}}>
            <div style={{fontSize:9,color:'var(--text-muted)',textTransform:'uppercase'}}>{s.label}</div>
            <div style={{fontSize:15,fontWeight:700,color:s.color}}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{marginBottom:0}}>
        <div className="chart-tabs">
          {chartTabs.map(t => (
            <div key={t.id} className={`chart-tab ${chartTab===t.id?'active':''}`} onClick={()=>setChartTab(t.id)}>{t.label}</div>
          ))}
        </div>
        <div className="card-body">
          {chartTab==='overview' && <OverviewTab patient={patient}/>}
          {chartTab==='vitals' && <VitalsTab patient={patient}/>}
          {chartTab==='sectionGG' && <SectionGGTab patient={patient}/>}
          {chartTab==='assistLevels' && <AssistLevelsTab patient={patient}/>}
          {chartTab==='evalNote' && <InitialEvalNote patient={patient} user={user}/>}
          {chartTab==='dailyNote' && <DailyTreatmentNote patient={patient} user={user}/>}
          {chartTab==='progressNote' && <ProgressNote patient={patient} user={user}/>}
          {chartTab==='documents' && <DocumentsTab patient={patient}/>}
        </div>
      </div>
    </div>
  );
}

// ==================== OVERVIEW TAB ====================
function OverviewTab({ patient }) {
  return (
    <div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <div>
          <h4 style={{marginBottom:8,color:'var(--primary)'}}>Patient Information</h4>
          <div className="form-row" style={{gridTemplateColumns:'1fr 1fr'}}>
            <div className="form-group"><label>Name</label><input readOnly value={`${patient.lastName}, ${patient.firstName}`} style={{background:'#f8fafc'}}/></div>
            <div className="form-group"><label>MRN</label><input readOnly value={patient.mrn} style={{background:'#f8fafc',fontFamily:'monospace'}}/></div>
          </div>
          <div className="form-row" style={{gridTemplateColumns:'1fr 1fr 1fr'}}>
            <div className="form-group"><label>DOB</label><input readOnly value={patient.dob} style={{background:'#f8fafc'}}/></div>
            <div className="form-group"><label>Age</label><input readOnly value={patient.age} style={{background:'#f8fafc'}}/></div>
            <div className="form-group"><label>Gender</label><input readOnly value={patient.gender} style={{background:'#f8fafc'}}/></div>
          </div>
          <div className="form-row" style={{gridTemplateColumns:'1fr 1fr'}}>
            <div className="form-group"><label>Room / Unit</label><input readOnly value={`${patient.roomNum} — ${patient.unit}`} style={{background:'#f8fafc'}}/></div>
            <div className="form-group"><label>Admit Date</label><input readOnly value={patient.admitDate} style={{background:'#f8fafc'}}/></div>
          </div>
          <div className="form-group"><label>Admitting Diagnosis</label><input readOnly value={patient.dx} style={{background:'#f8fafc'}}/></div>
          <div className="form-group"><label>Attending Physician</label><input readOnly value={patient.attendingMD} style={{background:'#f8fafc'}}/></div>
          <div className="form-row" style={{gridTemplateColumns:'1fr 1fr'}}>
            <div className="form-group"><label>Insurance</label><input readOnly value={patient.insurance} style={{background:'#f8fafc'}}/></div>
            <div className="form-group"><label>Code Status</label><input readOnly value={patient.codeStatus} style={{background:'#f8fafc',fontWeight:700,color:patient.codeStatus.includes('DNR')?'var(--danger)':'inherit'}}/></div>
          </div>
        </div>
        <div>
          <h4 style={{marginBottom:8,color:'var(--primary)'}}>Medical History</h4>
          <div className="form-group"><label>Past Medical History</label><textarea rows={3} readOnly value={patient.pmh} style={{background:'#f8fafc'}}/></div>
          <div className="form-group"><label>Current Medications</label><textarea rows={3} readOnly value={patient.meds} style={{background:'#f8fafc'}}/></div>
          <div className="form-group"><label>Allergies / Alerts</label><textarea rows={2} readOnly value={patient.alerts.length > 0 ? patient.alerts.join(', ') : 'No known allergies'} style={{background:'#f8fafc'}}/></div>
          <h4 style={{marginBottom:8,marginTop:12,color:'var(--primary)'}}>Social History</h4>
          <div className="form-row" style={{gridTemplateColumns:'1fr 1fr'}}>
            <div className="form-group"><label>Living Situation</label><input readOnly value={patient.socialHistory.living} style={{background:'#f8fafc'}}/></div>
            <div className="form-group"><label>Prior Mobility</label><input readOnly value={patient.socialHistory.priorMobility} style={{background:'#f8fafc'}}/></div>
          </div>
          <div className="form-row" style={{gridTemplateColumns:'1fr 1fr'}}>
            <div className="form-group"><label>Home Stairs</label><input readOnly value={patient.socialHistory.stairs} style={{background:'#f8fafc'}}/></div>
            <div className="form-group"><label>Occupation</label><input readOnly value={patient.socialHistory.occupation} style={{background:'#f8fafc'}}/></div>
          </div>
          <div className="form-group"><label>Emergency Contact</label><input readOnly value={patient.socialHistory.emergencyContact} style={{background:'#f8fafc'}}/></div>
        </div>
      </div>
      <h4 style={{marginTop:16,marginBottom:8,color:'var(--primary)'}}>Cognition</h4>
      <div className="form-row" style={{gridTemplateColumns:'1fr 1fr 1fr'}}>
        <div className="form-group"><label>Orientation</label><input readOnly value={patient.cognition.oriented} style={{background:'#f8fafc'}}/></div>
        <div className="form-group"><label>Command Following</label><input readOnly value={patient.cognition.followsCommands} style={{background:'#f8fafc'}}/></div>
        <div className="form-group"><label>Safety Awareness</label><input readOnly value={patient.cognition.safety} style={{background:'#f8fafc'}}/></div>
      </div>
      <h4 style={{marginTop:16,marginBottom:8,color:'var(--primary)'}}>Discharge Planning</h4>
      <div className="form-group"><label>Discharge Recommendation</label><input defaultValue={patient.dcRecommendation}/></div>
    </div>
  );
}

// ==================== VITALS TAB ====================
function VitalsTab({ patient }) {
  return (
    <div>
      <h4 style={{marginBottom:12,color:'var(--primary)'}}>Current Vitals</h4>
      <div className="form-row" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
        <div className="form-group"><label>Heart Rate (bpm)</label><input defaultValue={patient.vitals.hr} style={{fontWeight:700,color:patient.vitals.hr>100?'var(--danger)':'inherit'}}/></div>
        <div className="form-group"><label>Blood Pressure (mmHg)</label><input defaultValue={`${patient.vitals.bp_sys}/${patient.vitals.bp_dia}`} style={{fontWeight:700}}/></div>
        <div className="form-group"><label>Respiratory Rate</label><input defaultValue={patient.vitals.rr} style={{fontWeight:700,color:patient.vitals.rr>24?'var(--danger)':'inherit'}}/></div>
        <div className="form-group"><label>Temperature ({'\u00B0'}F)</label><input defaultValue={patient.vitals.temp} style={{fontWeight:700,color:parseFloat(patient.vitals.temp)>100.4?'var(--danger)':'inherit'}}/></div>
      </div>
      <div className="form-row" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
        <div className="form-group"><label>SpO2 (%)</label><input defaultValue={patient.vitals.spo2} style={{fontWeight:700,color:patient.vitals.spo2<92?'var(--danger)':'var(--success)'}}/></div>
        <div className="form-group"><label>O2 Delivery Device</label><input defaultValue={patient.vitals.o2_device}/></div>
        <div className="form-group"><label>Pain at Rest (0-10)</label><select defaultValue={Math.min(Math.floor(patient.id % 8), 10)}>{[...Array(11)].map((_,i)=><option key={i} value={i}>{i}</option>)}</select></div>
        <div className="form-group"><label>Pain with Activity (0-10)</label><select defaultValue={Math.min(Math.floor(patient.id % 8) + 2, 10)}>{[...Array(11)].map((_,i)=><option key={i} value={i}>{i}</option>)}</select></div>
      </div>

      <h4 style={{marginTop:16,marginBottom:8,color:'var(--primary)'}}>Vitals — Pre/During/Post Treatment</h4>
      <div style={{overflowX:'auto'}}>
        <table className="assessment-table">
          <thead><tr><th></th><th>HR</th><th>BP</th><th>RR</th><th>SpO2</th><th>Pain</th><th>RPE (Borg)</th></tr></thead>
          <tbody>
            <tr><td style={{fontWeight:600,textAlign:'left'}}>Pre-Treatment</td><td><input defaultValue={patient.vitals.hr}/></td><td><input defaultValue={`${patient.vitals.bp_sys}/${patient.vitals.bp_dia}`}/></td><td><input defaultValue={patient.vitals.rr}/></td><td><input defaultValue={patient.vitals.spo2}/></td><td><input defaultValue={Math.min(patient.id%6+2,10)}/></td><td><input defaultValue=""/></td></tr>
            <tr><td style={{fontWeight:600,textAlign:'left'}}>During Treatment</td><td><input/></td><td><input/></td><td><input/></td><td><input/></td><td><input/></td><td><input/></td></tr>
            <tr><td style={{fontWeight:600,textAlign:'left'}}>Post-Treatment</td><td><input/></td><td><input/></td><td><input/></td><td><input/></td><td><input/></td><td><input/></td></tr>
            <tr><td style={{fontWeight:600,textAlign:'left'}}>Recovery (5 min)</td><td><input/></td><td><input/></td><td><input/></td><td><input/></td><td><input/></td><td><input/></td></tr>
          </tbody>
        </table>
      </div>

      <h4 style={{marginTop:16,marginBottom:8,color:'var(--primary)'}}>Lines / Tubes / Drains</h4>
      <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
        {patient.lines.map((line,i) => (
          <span key={i} className="code-chip"><span className="code">{'\u{1F4CC}'}</span> {line}</span>
        ))}
      </div>

      <h4 style={{marginTop:16,marginBottom:8,color:'var(--primary)'}}>Weight-Bearing Status</h4>
      <div className="form-row" style={{gridTemplateColumns:'1fr 1fr'}}>
        <div className="form-group"><label>Current WB Status</label>
          <select defaultValue={patient.wbStatus}>
            {WEIGHT_BEARING.map(wb=><option key={wb} value={wb}>{wb} — {
              wb==='WBAT'?'Weight Bear As Tolerated':wb==='FWB'?'Full Weight Bearing':wb==='PWB'?'Partial Weight Bearing':wb==='TTWB'?'Toe Touch Weight Bearing':wb==='NWB'?'Non-Weight Bearing':'Touch Down Weight Bearing'
            }</option>)}
          </select>
        </div>
        <div className="form-group"><label>Weight-Bearing Extremity</label><input defaultValue={patient.dxCode.includes('1') ? 'Right lower extremity' : 'Left lower extremity'}/></div>
      </div>

      <h4 style={{marginTop:16,marginBottom:8,color:'var(--primary)'}}>Precautions</h4>
      <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
        {patient.precautions.map((p,i) => (
          <label key={i} style={{display:'flex',alignItems:'center',gap:4,padding:'6px 12px',background:'#fee2e2',borderRadius:6,fontSize:12,fontWeight:600,color:'#991b1b'}}>
            <input type="checkbox" defaultChecked={true}/> {p}
          </label>
        ))}
      </div>
      <div style={{marginTop:12}}><button className="btn btn-primary">Save Vitals</button></div>
    </div>
  );
}

// ==================== SECTION GG TAB ====================
function SectionGGTab({ patient }) {
  const [activeSection, setActiveSection] = useState('mobility');

  const ggScoreLabel = (score) => {
    const labels = {6:'Independent',5:'Setup/Cleanup',4:'Supervision/Touching',3:'Partial/Moderate',2:'Substantial/Maximal',1:'Dependent',7:'Refused',9:'N/A',10:'Not Attempted (Env)',88:'Not Attempted (Med)'};
    return labels[score] || '';
  };

  const scoreColor = (score) => {
    if (score === 6) return '#065f46';
    if (score === 5) return '#166534';
    if (score === 4) return '#854d0e';
    if (score === 3) return '#9a3412';
    if (score === 2) return '#991b1b';
    if (score === 1) return '#7f1d1d';
    return '#6b7280';
  };

  return (
    <div>
      <div className="alert alert-info" style={{marginBottom:12}}>
        <strong>Section GG — CMS Functional Assessment</strong> {'\u2014'} Scoring: 6=Independent, 5=Setup, 4=Supervision/Touching, 3=Partial Assist, 2=Substantial/Max Assist, 1=Dependent | 07=Refused, 09=N/A, 10=Not Attempted (Env), 88=Not Attempted (Medical/Safety)
      </div>

      {/* Prior Functioning GG 0100 */}
      <div className="card" style={{marginBottom:16}}>
        <div className="card-header">GG 0100 — Prior Functioning (Prior to Current Illness/Exacerbation/Injury)</div>
        <div className="card-body">
          <p style={{fontSize:11,color:'var(--text-muted)',marginBottom:8}}>3=Independent, 2=Needed Some Help, 1=Dependent, 8=Unknown, 9=Not Applicable</p>
          <div style={{overflowX:'auto'}}>
            <table className="assessment-table">
              <thead><tr><th style={{textAlign:'left'}}>Item</th><th>Score</th><th>Description</th></tr></thead>
              <tbody>
                {[
                  {label:'A. Self-Care', key:'selfCare'},
                  {label:'B. Indoor Mobility (Ambulation)', key:'indoorMobility'},
                  {label:'C. Stairs', key:'stairs'},
                  {label:'D. Functional Cognition', key:'cognition'},
                ].map(item => (
                  <tr key={item.key}>
                    <td style={{textAlign:'left',fontWeight:600}}>{item.label}</td>
                    <td><select defaultValue={patient.priorFunction[item.key]}><option value={3}>3 - Independent</option><option value={2}>2 - Needed Some Help</option><option value={1}>1 - Dependent</option><option value={8}>8 - Unknown</option><option value={9}>9 - Not Applicable</option></select></td>
                    <td style={{fontSize:11,color:'var(--text-muted)'}}>{patient.priorFunction[item.key]===3?'Independent':patient.priorFunction[item.key]===2?'Needed Some Help':patient.priorFunction[item.key]===1?'Dependent':'Unknown'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Prior Device Use GG 0110 */}
      <div className="card" style={{marginBottom:16}}>
        <div className="card-header">GG 0110 — Prior Device Use</div>
        <div className="card-body">
          <div style={{display:'flex',flexWrap:'wrap',gap:12}}>
            {[
              {label:'Manual Wheelchair', key:'manualWheelchair'},
              {label:'Motorized Wheelchair/Scooter', key:'motorizedWheelchair'},
              {label:'Mechanical Lift', key:'mechanicalLift'},
              {label:'Walker', key:'walker'},
              {label:'Orthotics/Prosthetics', key:'orthoticsProsthetics'},
            ].map(item => (
              <label key={item.key} style={{display:'flex',alignItems:'center',gap:6,padding:'6px 12px',background:'#f1f5f9',borderRadius:6,fontSize:12}}>
                <input type="checkbox" defaultChecked={patient.priorDevices[item.key]}/> {item.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Section tabs */}
      <div className="tabs" style={{marginBottom:0}}>
        <div className={`tab ${activeSection==='selfCare'?'active':''}`} onClick={()=>setActiveSection('selfCare')}>GG 0130 — Self-Care</div>
        <div className={`tab ${activeSection==='mobility'?'active':''}`} onClick={()=>setActiveSection('mobility')}>GG 0170 — Mobility</div>
      </div>

      {/* GG 0130 Self-Care */}
      {activeSection==='selfCare' && (
        <div className="card" style={{borderTop:'none',borderRadius:'0 0 8px 8px'}}>
          <div className="card-body">
            <div style={{overflowX:'auto'}}>
              <table className="assessment-table" style={{minWidth:700}}>
                <thead>
                  <tr>
                    <th style={{textAlign:'left',minWidth:200}}>Self-Care Item (GG 0130)</th>
                    <th style={{minWidth:140}}>Admission</th>
                    <th style={{minWidth:140}}>Goal</th>
                    <th style={{minWidth:140}}>Discharge</th>
                  </tr>
                </thead>
                <tbody>
                  {GG_SELF_CARE_ITEMS.map(item => {
                    const scores = patient.ggSelfCare[item.id];
                    return (
                      <tr key={item.id}>
                        <td style={{textAlign:'left',fontWeight:600}}>{item.id}. {item.label}</td>
                        <td>
                          <select defaultValue={scores.admission} style={{color:scoreColor(scores.admission),fontWeight:600}}>
                            <option value="">Select</option>
                            <option value={6}>06 - Independent</option>
                            <option value={5}>05 - Setup/Cleanup</option>
                            <option value={4}>04 - Supervision/Touching</option>
                            <option value={3}>03 - Partial/Moderate Assist</option>
                            <option value={2}>02 - Substantial/Max Assist</option>
                            <option value={1}>01 - Dependent</option>
                            <option value={7}>07 - Refused</option>
                            <option value={9}>09 - Not Applicable</option>
                            <option value={10}>10 - Not Attempted (Env)</option>
                            <option value={88}>88 - Not Attempted (Med)</option>
                          </select>
                        </td>
                        <td>
                          <select defaultValue={scores.goal} style={{color:scoreColor(scores.goal),fontWeight:600}}>
                            <option value="">Select</option>
                            <option value={6}>06 - Independent</option>
                            <option value={5}>05 - Setup/Cleanup</option>
                            <option value={4}>04 - Supervision/Touching</option>
                            <option value={3}>03 - Partial/Moderate Assist</option>
                            <option value={2}>02 - Substantial/Max Assist</option>
                            <option value={1}>01 - Dependent</option>
                          </select>
                        </td>
                        <td>
                          <select defaultValue={scores.discharge||''} style={{color:scores.discharge?scoreColor(scores.discharge):'#ccc',fontWeight:600}}>
                            <option value="">-- Pending --</option>
                            <option value={6}>06 - Independent</option>
                            <option value={5}>05 - Setup/Cleanup</option>
                            <option value={4}>04 - Supervision/Touching</option>
                            <option value={3}>03 - Partial/Moderate Assist</option>
                            <option value={2}>02 - Substantial/Max Assist</option>
                            <option value={1}>01 - Dependent</option>
                            <option value={7}>07 - Refused</option>
                            <option value={9}>09 - Not Applicable</option>
                            <option value={10}>10 - Not Attempted (Env)</option>
                            <option value={88}>88 - Not Attempted (Med)</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* GG 0170 Mobility */}
      {activeSection==='mobility' && (
        <div className="card" style={{borderTop:'none',borderRadius:'0 0 8px 8px'}}>
          <div className="card-body">
            <div style={{overflowX:'auto'}}>
              <table className="assessment-table" style={{minWidth:700}}>
                <thead>
                  <tr>
                    <th style={{textAlign:'left',minWidth:250}}>Mobility Item (GG 0170)</th>
                    <th style={{minWidth:140}}>Admission</th>
                    <th style={{minWidth:140}}>Goal</th>
                    <th style={{minWidth:140}}>Discharge</th>
                  </tr>
                </thead>
                <tbody>
                  {GG_MOBILITY_ITEMS.map(item => {
                    const scores = patient.ggMobility[item.id];
                    return (
                      <tr key={item.id}>
                        <td style={{textAlign:'left',fontWeight:600}}>{item.id}. {item.label}</td>
                        <td>
                          <select defaultValue={scores.admission} style={{color:scoreColor(scores.admission),fontWeight:600}}>
                            <option value="">Select</option>
                            <option value={6}>06 - Independent</option>
                            <option value={5}>05 - Setup/Cleanup</option>
                            <option value={4}>04 - Supervision/Touching</option>
                            <option value={3}>03 - Partial/Moderate Assist</option>
                            <option value={2}>02 - Substantial/Max Assist</option>
                            <option value={1}>01 - Dependent</option>
                            <option value={7}>07 - Refused</option>
                            <option value={9}>09 - Not Applicable</option>
                            <option value={10}>10 - Not Attempted (Env)</option>
                            <option value={88}>88 - Not Attempted (Med)</option>
                          </select>
                        </td>
                        <td>
                          <select defaultValue={scores.goal} style={{color:scoreColor(scores.goal),fontWeight:600}}>
                            <option value="">Select</option>
                            <option value={6}>06 - Independent</option>
                            <option value={5}>05 - Setup/Cleanup</option>
                            <option value={4}>04 - Supervision/Touching</option>
                            <option value={3}>03 - Partial/Moderate Assist</option>
                            <option value={2}>02 - Substantial/Max Assist</option>
                            <option value={1}>01 - Dependent</option>
                            <option value={9}>09 - Not Applicable</option>
                          </select>
                        </td>
                        <td>
                          <select defaultValue={scores.discharge||''} style={{color:scores.discharge?scoreColor(scores.discharge):'#ccc',fontWeight:600}}>
                            <option value="">-- Pending --</option>
                            <option value={6}>06 - Independent</option>
                            <option value={5}>05 - Setup/Cleanup</option>
                            <option value={4}>04 - Supervision/Touching</option>
                            <option value={3}>03 - Partial/Moderate Assist</option>
                            <option value={2}>02 - Substantial/Max Assist</option>
                            <option value={1}>01 - Dependent</option>
                            <option value={7}>07 - Refused</option>
                            <option value={9}>09 - Not Applicable</option>
                            <option value={10}>10 - Not Attempted (Env)</option>
                            <option value={88}>88 - Not Attempted (Med)</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div style={{marginTop:12}}><button className="btn btn-primary">Save Section GG Scores</button></div>
    </div>
  );
}

// ==================== ASSIST LEVELS TAB ====================
function AssistLevelsTab({ patient }) {
  const al = patient.assistLevels;

  const assistColor = (level) => {
    if (level === 'Independent') return 'badge-green';
    if (level === 'Supervision') return 'badge-blue';
    if (level.includes('CGA') || level.includes('Min')) return 'badge-yellow';
    if (level.includes('Mod')) return 'badge-yellow';
    if (level.includes('Max')) return 'badge-red';
    if (level === 'Dependent') return 'badge-red';
    return 'badge-gray';
  };

  const AssistSelect = ({defaultValue, label}) => (
    <div className="form-group">
      <label>{label}</label>
      <select defaultValue={defaultValue} style={{fontWeight:600}}>
        {ASSIST_LEVELS.map(l=><option key={l} value={l}>{l}</option>)}
      </select>
    </div>
  );

  return (
    <div>
      <div className="alert alert-info" style={{marginBottom:12}}>
        <strong>Functional Mobility Assist Levels</strong> {'\u2014'} Document the level of assistance required for each activity. Update after each treatment session.
      </div>

      {/* Bed Mobility */}
      <div className="card" style={{marginBottom:16}}>
        <div className="card-header" style={{background:'#dbeafe'}}>Bed Mobility</div>
        <div className="card-body">
          <div className="form-row" style={{gridTemplateColumns:'1fr 1fr 1fr 1fr'}}>
            <AssistSelect defaultValue={al.bedMobility.supineToSit} label="Supine to Sit"/>
            <AssistSelect defaultValue={al.bedMobility.sitToSupine} label="Sit to Supine"/>
            <AssistSelect defaultValue={al.bedMobility.rolling} label="Rolling (L/R)"/>
            <AssistSelect defaultValue={al.bedMobility.scooting} label="Scooting in Bed"/>
          </div>
          <div className="form-group"><label>Bed Mobility Notes</label><textarea rows={2} defaultValue="" placeholder="Describe bed mobility performance, cueing needed, equipment used..."/></div>
        </div>
      </div>

      {/* Transfers */}
      <div className="card" style={{marginBottom:16}}>
        <div className="card-header" style={{background:'#d1fae5'}}>Transfers</div>
        <div className="card-body">
          <div className="form-row" style={{gridTemplateColumns:'1fr 1fr 1fr 1fr'}}>
            <AssistSelect defaultValue={al.transfers.sitToStand} label="Sit to Stand"/>
            <AssistSelect defaultValue={al.transfers.standPivot} label="Stand Pivot Transfer"/>
            <AssistSelect defaultValue={al.transfers.bedToChair} label="Bed to Chair"/>
            <AssistSelect defaultValue={al.transfers.toiletTransfer} label="Toilet Transfer"/>
          </div>
          <div className="form-row" style={{gridTemplateColumns:'1fr 1fr 1fr 1fr'}}>
            <AssistSelect defaultValue={al.transfers.tubShower} label="Tub/Shower Transfer"/>
            <AssistSelect defaultValue={al.transfers.squatPivot} label="Squat Pivot Transfer"/>
            <AssistSelect defaultValue={al.transfers.slidingBoard} label="Sliding Board Transfer"/>
            <AssistSelect defaultValue={al.transfers.carTransfer} label="Car Transfer"/>
          </div>
          <div className="form-group"><label>Transfer Notes</label><textarea rows={2} defaultValue="" placeholder="Describe transfer technique, equipment used (gait belt, sliding board, etc.), cueing..."/></div>
        </div>
      </div>

      {/* Gait */}
      <div className="card" style={{marginBottom:16}}>
        <div className="card-header" style={{background:'#fef3c7'}}>Gait</div>
        <div className="card-body">
          <div className="form-row" style={{gridTemplateColumns:'1fr 1fr 1fr'}}>
            <AssistSelect defaultValue={al.gait.levelSurfaces} label="Level Surfaces"/>
            <AssistSelect defaultValue={al.gait.unevenSurfaces} label="Uneven Surfaces"/>
            <div className="form-group"><label>Distance Ambulated</label><input defaultValue={al.gait.distance}/></div>
          </div>
          <div className="form-row" style={{gridTemplateColumns:'1fr 1fr 1fr'}}>
            <div className="form-group"><label>Assistive Device</label>
              <select defaultValue={al.gait.assistDevice}>
                <option>Rolling walker</option><option>Front-wheeled walker</option><option>Standard walker</option>
                <option>Hemi-walker</option><option>Quad cane</option><option>Straight cane</option>
                <option>Lofstrand crutches</option><option>Axillary crutches</option><option>No device</option><option>Parallel bars only</option>
              </select>
            </div>
            <div className="form-group"><label>Gait Belt Used</label>
              <select defaultValue={al.gait.gaitBelt}><option>Yes</option><option>No</option></select>
            </div>
            <div className="form-group"><label>Weight-Bearing Status</label>
              <select defaultValue={patient.wbStatus}>
                {WEIGHT_BEARING.map(wb=><option key={wb} value={wb}>{wb}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group"><label>Gait Deviations / Notes</label><textarea rows={2} defaultValue="" placeholder="Describe gait pattern, deviations, safety concerns..."/></div>
        </div>
      </div>

      {/* Stairs */}
      <div className="card" style={{marginBottom:16}}>
        <div className="card-header" style={{background:'#ede9fe'}}>Stairs</div>
        <div className="card-body">
          <div className="form-row" style={{gridTemplateColumns:'1fr 1fr 1fr 1fr'}}>
            <AssistSelect defaultValue={al.stairs.stairsUp} label="Ascending Stairs"/>
            <AssistSelect defaultValue={al.stairs.stairsDown} label="Descending Stairs"/>
            <div className="form-group"><label>Railing Use</label>
              <select defaultValue={al.stairs.railUse}>
                <option>Bilateral rails</option><option>Right rail</option><option>Left rail</option><option>No rail</option>
              </select>
            </div>
            <div className="form-group"><label># Steps Completed</label><input defaultValue={al.stairs.steps}/></div>
          </div>
          <div className="form-group"><label>Stair Notes</label><textarea rows={2} defaultValue="" placeholder="Step pattern (step-to, step-over-step), reciprocal vs non-reciprocal..."/></div>
        </div>
      </div>

      <div style={{display:'flex',gap:8}}>
        <button className="btn btn-primary">Save Assist Levels</button>
      </div>
    </div>
  );
}

// ==================== INITIAL EVAL NOTE ====================
function InitialEvalNote({ patient, user }) {
  const [noteStatus, setNoteStatus] = useState(patient.careStage==='Admission (Day 1)'?'draft':'signed');
  const [signedBy, setSignedBy] = useState(patient.careStage!=='Admission (Day 1)'?{name:'Dr. Sarah Mitchell, PT, DPT',date:patient.admitDate}:null);
  const isLocked = noteStatus === 'locked' || (patient.careStage!=='Admission (Day 1)' && noteStatus==='signed');

  const cd = useMemo(() => generateClinicalData(patient), [patient.id]);

  const handleSign = () => {
    if (user.role === 'PTA' || user.role === 'Student PTA') {
      setNoteStatus('cosign-needed');
      setSignedBy({ name: user.displayName, date: new Date().toLocaleString() });
    } else {
      setNoteStatus('signed');
      setSignedBy({ name: user.displayName, date: new Date().toLocaleString() });
    }
  };
  const handleLock = () => setNoteStatus('locked');

  return (
    <div>
      <div className={`note-status ${noteStatus==='signed'||noteStatus==='locked'?'signed':noteStatus==='cosign-needed'?'cosign-needed':'draft'}`}>
        {noteStatus==='draft' && '\u{1F4DD} DRAFT \u2014 Not yet signed'}
        {noteStatus==='signed' && `\u2705 SIGNED by ${signedBy?.name} on ${signedBy?.date}`}
        {noteStatus==='cosign-needed' && `\u26A0\uFE0F SIGNED by ${signedBy?.name} \u2014 CO-SIGNATURE REQUIRED`}
        {noteStatus==='locked' && `\u{1F512} LOCKED \u2014 Note is finalized`}
      </div>

      <h3 style={{marginBottom:12,color:'var(--primary)'}}>Initial Evaluation {'\u2014'} {patient.lastName}, {patient.firstName}</h3>
      <p style={{fontSize:12,color:'var(--text-muted)',marginBottom:16}}>
        Date: {patient.admitDate} | Dx: {patient.dx} | Room: {patient.roomNum} ({patient.unit}) | Provider: {user.displayName}
      </p>

      <fieldset disabled={isLocked} style={{border:'none',padding:0}}>
        {/* Subjective */}
        <div className="card"><div className="card-header">Subjective</div><div className="card-body">
          <div className="form-group"><label>Chief Complaint / Reason for Referral</label><textarea defaultValue={cd.chiefComplaint}/></div>
          <div className="form-group"><label>History of Present Illness</label><textarea rows={4} defaultValue={cd.hpi}/></div>
          <div className="form-group"><label>Prior Level of Function</label><textarea rows={3} defaultValue={cd.plof}/></div>
          <div className="form-row" style={{gridTemplateColumns:'1fr 1fr 1fr'}}>
            <div className="form-group"><label>Pain at Rest (0-10)</label><select defaultValue={Math.min(patient.id%6+2,10)}>{[...Array(11)].map((_,i)=><option key={i}>{i}</option>)}</select></div>
            <div className="form-group"><label>Pain with Movement (0-10)</label><select defaultValue={Math.min(patient.id%6+4,10)}>{[...Array(11)].map((_,i)=><option key={i}>{i}</option>)}</select></div>
            <div className="form-group"><label>Pain Location</label><input defaultValue={patient.category==='Hip Fracture'||patient.category==='Joint Replacement'?'Surgical site/hip':'Generalized'}/></div>
          </div>
        </div></div>

        {/* Objective */}
        <div className="card"><div className="card-header">Objective {'\u2014'} Physical Examination</div><div className="card-body">
          <h4 style={{marginBottom:8}}>Vitals at Time of Evaluation</h4>
          <div className="form-row" style={{gridTemplateColumns:'repeat(6,1fr)'}}>
            <div className="form-group"><label>HR</label><input defaultValue={patient.vitals.hr}/></div>
            <div className="form-group"><label>BP</label><input defaultValue={`${patient.vitals.bp_sys}/${patient.vitals.bp_dia}`}/></div>
            <div className="form-group"><label>RR</label><input defaultValue={patient.vitals.rr}/></div>
            <div className="form-group"><label>SpO2</label><input defaultValue={`${patient.vitals.spo2}%`}/></div>
            <div className="form-group"><label>Temp</label><input defaultValue={`${patient.vitals.temp}\u00B0F`}/></div>
            <div className="form-group"><label>O2 Device</label><input defaultValue={patient.vitals.o2_device}/></div>
          </div>

          <h4 style={{marginBottom:8,marginTop:12}}>Cognition / Communication</h4>
          <div className="form-row" style={{gridTemplateColumns:'1fr 1fr 1fr'}}>
            <div className="form-group"><label>Orientation</label><input defaultValue={patient.cognition.oriented}/></div>
            <div className="form-group"><label>Command Following</label><input defaultValue={patient.cognition.followsCommands}/></div>
            <div className="form-group"><label>Safety Awareness</label><input defaultValue={patient.cognition.safety}/></div>
          </div>

          <h4 style={{marginBottom:8,marginTop:12}}>Functional Mobility Assessment</h4>
          <div className="form-row" style={{gridTemplateColumns:'1fr 1fr'}}>
            <div className="form-group"><label>Bed Mobility</label><textarea rows={2} defaultValue={`Supine to sit: ${patient.assistLevels.bedMobility.supineToSit}\nRolling: ${patient.assistLevels.bedMobility.rolling}`}/></div>
            <div className="form-group"><label>Transfers</label><textarea rows={2} defaultValue={`Sit to stand: ${patient.assistLevels.transfers.sitToStand}\nBed to chair: ${patient.assistLevels.transfers.bedToChair}`}/></div>
          </div>
          <div className="form-row" style={{gridTemplateColumns:'1fr 1fr'}}>
            <div className="form-group"><label>Gait</label><textarea rows={2} defaultValue={`Level surfaces: ${patient.assistLevels.gait.levelSurfaces}\nDevice: ${patient.assistLevels.gait.assistDevice}\nDistance: ${patient.assistLevels.gait.distance}`}/></div>
            <div className="form-group"><label>Stairs</label><textarea rows={2} defaultValue={`Ascending: ${patient.assistLevels.stairs.stairsUp}\nDescending: ${patient.assistLevels.stairs.stairsDown}\n${patient.assistLevels.stairs.steps}`}/></div>
          </div>
          <div className="form-row" style={{gridTemplateColumns:'1fr 1fr'}}>
            <div className="form-group"><label>Balance</label><textarea rows={2} defaultValue={`Sitting balance: ${patient.assistLevels.bedMobility.supineToSit.includes('Independent')?'Good':'Fair — requires verbal/tactile cues'}\nStanding balance: ${patient.assistLevels.transfers.sitToStand.includes('Independent')?'Good':'Fair to Poor — requires assist for safety'}`}/></div>
            <div className="form-group"><label>Strength (Gross)</label><textarea rows={2} defaultValue={patient.category==='Neuro'?'UE: R 3/5 grossly, L 4/5 grossly\nLE: R 2+/5 grossly, L 4/5 grossly':'UE: 4/5 grossly bilateral\nLE: 3+/5 grossly bilateral'}/></div>
          </div>
        </div></div>

        {/* Assessment */}
        <div className="card"><div className="card-header">Assessment</div><div className="card-body">
          <div className="form-group"><label>Clinical Assessment</label><textarea rows={4} defaultValue={cd.assessment}/></div>
          <div className="form-group"><label>PT Diagnosis</label><input defaultValue={cd.ptDiagnosis}/></div>
          <h4 style={{marginBottom:8,marginTop:12}}>Short-Term Goals (1-2 weeks)</h4>
          <div className="form-group"><textarea rows={4} defaultValue={`1. Patient will perform supine to sit with ${patient.assistLevels.bedMobility.supineToSit.includes('Max')||patient.assistLevels.bedMobility.supineToSit.includes('Dependent')?'moderate assist':'minimal assist'} in 1 week.\n2. Patient will transfer bed to chair with ${patient.assistLevels.transfers.bedToChair.includes('Max')||patient.assistLevels.transfers.bedToChair.includes('Dependent')?'moderate assist':'minimal assist/CGA'} in 1 week.\n3. Patient will ambulate 50 feet with assistive device with ${patient.assistLevels.gait.levelSurfaces.includes('Max')||patient.assistLevels.gait.levelSurfaces.includes('Dependent')?'moderate assist':'CGA/supervision'} in 1 week.\n4. Patient will demonstrate improved sitting balance for ADLs with supervision in 1 week.`}/></div>
          <h4 style={{marginBottom:8}}>Long-Term Goals (by Discharge)</h4>
          <div className="form-group"><textarea rows={4} defaultValue={`1. Patient will perform bed mobility independently or with supervision for safe discharge.\n2. Patient will transfer all surfaces with supervision or less for safe discharge.\n3. Patient will ambulate 150+ feet with assistive device with supervision or less.\n4. Patient will negotiate stairs (${patient.socialHistory.stairs}) with supervision or less for safe home entry.\n5. Patient will achieve Section GG mobility scores sufficient for discharge to ${patient.dcRecommendation}.`}/></div>
        </div></div>

        {/* Plan */}
        <div className="card"><div className="card-header">Plan</div><div className="card-body">
          <div className="form-group"><label>Treatment Plan</label><textarea rows={3} defaultValue={`Skilled PT services ${patient.status==='ICU'?'1x/day':'1-2x/day'} for functional mobility training, transfer training, gait training, therapeutic exercise, balance training, and patient/family education. Frequency/duration: ${patient.status==='ICU'?'1x/day x duration of stay':'1-2x/day x duration of stay'}.`}/></div>
          <div className="form-group"><label>Discharge Plan</label><textarea rows={2} defaultValue={cd.dcPlan}/></div>
          <h4 style={{marginBottom:8,marginTop:12}}>CPT Codes</h4>
          <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
            {CPT_CODES.slice(0,8).map(c => (
              <label key={c.code} style={{display:'flex',alignItems:'center',gap:4,padding:'4px 8px',background:'#f1f5f9',borderRadius:4,fontSize:11}}>
                <input type="checkbox" defaultChecked={['97110','97116','97530','97535','97163'].includes(c.code)}/> {c.code} - {c.desc}
              </label>
            ))}
          </div>
        </div></div>
      </fieldset>

      {/* Signature */}
      <div className="card">
        <div className="card-header">Signature</div>
        <div className="card-body">
          {noteStatus==='draft' && (
            <div className="signature-area">
              <p>Click "Sign Note" to electronically sign this document</p>
              <button className="btn btn-success btn-lg" onClick={handleSign}>Sign Note</button>
            </div>
          )}
          {(noteStatus==='signed'||noteStatus==='cosign-needed') && (
            <div className="signature-area signed">
              <div className="sig-text">{signedBy?.name}</div>
              <p style={{fontSize:12,color:'var(--text-muted)'}}>{signedBy?.date}</p>
              {noteStatus==='cosign-needed' && <div className="alert alert-warning" style={{marginTop:8}}>Awaiting co-signature from supervising PT</div>}
              <button className="btn btn-outline" style={{marginTop:8}} onClick={handleLock}>Lock Note</button>
            </div>
          )}
          {noteStatus==='locked' && (
            <div className="signature-area signed">
              <div className="sig-text">{signedBy?.name}</div>
              <p style={{fontSize:12}}>{'\u{1F512}'} Note locked and finalized</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== DAILY TREATMENT NOTE ====================
function DailyTreatmentNote({ patient, user }) {
  const [noteStatus, setNoteStatus] = useState('draft');
  const [signedBy, setSignedBy] = useState(null);

  return (
    <div>
      <div className={`note-status ${noteStatus}`}>
        {noteStatus==='draft' && '\u{1F4DD} DRAFT \u2014 New Treatment Note'}
        {noteStatus==='signed' && `\u2705 SIGNED by ${signedBy?.name} on ${signedBy?.date}`}
      </div>

      <h3 style={{marginBottom:12,color:'var(--primary)'}}>Daily Treatment Note {'\u2014'} {patient.lastName}, {patient.firstName}</h3>
      <p style={{fontSize:12,color:'var(--text-muted)',marginBottom:16}}>
        Date: {new Date().toISOString().split('T')[0]} | Room: {patient.roomNum} ({patient.unit}) | LOS Day: {patient.losDay} | Provider: {user.displayName}
      </p>

      {/* Precautions reminder */}
      <div className="alert alert-warning" style={{marginBottom:12}}>
        <strong>Active Precautions:</strong> {patient.precautions.join(' | ')} | <strong>WB:</strong> {patient.wbStatus} | <strong>Code:</strong> {patient.codeStatus}
      </div>

      {/* Subjective */}
      <div className="card"><div className="card-header">Subjective</div><div className="card-body">
        <div className="form-group"><label>Patient Report / Subjective</label><textarea rows={3} defaultValue="" placeholder="How is the patient feeling today? Any complaints? Pain level? Sleep? Tolerance of previous session?"/></div>
        <div className="form-row" style={{gridTemplateColumns:'1fr 1fr 1fr'}}>
          <div className="form-group"><label>Pain at Rest</label><select><option value="">Select</option>{[...Array(11)].map((_,i)=><option key={i}>{i}/10</option>)}</select></div>
          <div className="form-group"><label>Pain with Activity</label><select><option value="">Select</option>{[...Array(11)].map((_,i)=><option key={i}>{i}/10</option>)}</select></div>
          <div className="form-group"><label>Pain Location</label><input defaultValue="" placeholder="Location"/></div>
        </div>
      </div></div>

      {/* Objective — Vitals */}
      <div className="card"><div className="card-header">Objective {'\u2014'} Vitals</div><div className="card-body">
        <div style={{overflowX:'auto'}}>
          <table className="assessment-table">
            <thead><tr><th></th><th>HR</th><th>BP</th><th>RR</th><th>SpO2</th><th>O2 Device</th><th>RPE</th></tr></thead>
            <tbody>
              <tr><td style={{fontWeight:600,textAlign:'left'}}>Pre-Tx</td><td><input/></td><td><input/></td><td><input/></td><td><input/></td><td><input defaultValue={patient.vitals.o2_device}/></td><td><input/></td></tr>
              <tr><td style={{fontWeight:600,textAlign:'left'}}>During Tx</td><td><input/></td><td><input/></td><td><input/></td><td><input/></td><td><input/></td><td><input/></td></tr>
              <tr><td style={{fontWeight:600,textAlign:'left'}}>Post-Tx</td><td><input/></td><td><input/></td><td><input/></td><td><input/></td><td><input/></td><td><input/></td></tr>
            </tbody>
          </table>
        </div>
      </div></div>

      {/* Objective — Treatment Performed */}
      <div className="card"><div className="card-header">Objective {'\u2014'} Treatment Performed</div><div className="card-body">
        <h4 style={{marginBottom:8}}>Functional Mobility (Check off assist level for each activity performed)</h4>

        <div style={{overflowX:'auto',marginBottom:12}}>
          <table className="assessment-table">
            <thead><tr><th style={{textAlign:'left'}}>Activity</th><th>Assist Level</th><th>Device/Equipment</th><th>Distance/Reps</th><th>Notes</th></tr></thead>
            <tbody>
              {[
                {activity:'Supine to Sit',def:patient.assistLevels.bedMobility.supineToSit},
                {activity:'Sit to Stand',def:patient.assistLevels.transfers.sitToStand},
                {activity:'Stand Pivot Transfer',def:patient.assistLevels.transfers.standPivot},
                {activity:'Bed to Chair Transfer',def:patient.assistLevels.transfers.bedToChair},
                {activity:'Toilet Transfer',def:patient.assistLevels.transfers.toiletTransfer},
                {activity:'Ambulation (Level)',def:patient.assistLevels.gait.levelSurfaces},
                {activity:'Stairs',def:patient.assistLevels.stairs.stairsUp},
              ].map((row,i) => (
                <tr key={i}>
                  <td style={{textAlign:'left',fontWeight:600,fontSize:12}}>{row.activity}</td>
                  <td><select defaultValue={row.def} style={{fontSize:11}}>{ASSIST_LEVELS.map(l=><option key={l}>{l}</option>)}</select></td>
                  <td><input style={{width:100}} defaultValue="" placeholder="Device"/></td>
                  <td><input style={{width:80}} defaultValue="" placeholder="Dist/Reps"/></td>
                  <td><input style={{width:120}} defaultValue="" placeholder="Notes"/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h4 style={{marginBottom:8}}>Therapeutic Interventions</h4>
        <div style={{display:'flex',flexWrap:'wrap',gap:4,marginBottom:12}}>
          {['Therapeutic Exercise','Gait Training','Transfer Training','Balance Training','Neuromuscular Re-ed','Bed Mobility Training','Stair Training','Patient/Family Education','Functional Mobility Training','Wheelchair Mobility'].map(tx => (
            <label key={tx} style={{display:'flex',alignItems:'center',gap:4,padding:'4px 10px',background:'#f1f5f9',borderRadius:4,fontSize:11}}>
              <input type="checkbox"/> {tx}
            </label>
          ))}
        </div>

        <div className="form-group"><label>Treatment Description / Skilled Interventions</label><textarea rows={4} defaultValue="" placeholder="Describe skilled interventions performed, patient response, progress toward goals..."/></div>

        <h4 style={{marginBottom:8}}>CPT Codes</h4>
        <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
          {CPT_CODES.slice(0,10).map(c => (
            <label key={c.code} style={{display:'flex',alignItems:'center',gap:4,padding:'4px 8px',background:'#f1f5f9',borderRadius:4,fontSize:11}}>
              <input type="checkbox"/> {c.code} - {c.desc}
              <input type="number" min={0} max={8} defaultValue={0} style={{width:40,marginLeft:4}} placeholder="U"/>
            </label>
          ))}
        </div>
      </div></div>

      {/* Assessment */}
      <div className="card"><div className="card-header">Assessment</div><div className="card-body">
        <div className="form-group"><label>Patient Response to Treatment</label><textarea rows={3} defaultValue="" placeholder="Patient's response, tolerance, progress toward goals, any adverse events..."/></div>
        <div className="form-group"><label>Goal Status</label>
          <select>
            <option>Making progress toward all goals</option>
            <option>Making progress toward some goals</option>
            <option>Plateau — no significant change</option>
            <option>Goals met — ready for discharge</option>
            <option>Regression — declined from previous session</option>
          </select>
        </div>
      </div></div>

      {/* Plan */}
      <div className="card"><div className="card-header">Plan</div><div className="card-body">
        <div className="form-group"><label>Plan for Next Session</label><textarea rows={2} defaultValue="" placeholder="Continue current POC, progress exercises, address..."/></div>
        <div className="form-group"><label>Discharge Disposition (if applicable)</label>
          <select defaultValue="">
            <option value="">N/A — Continue treatment</option>
            <option>Home with home health PT</option>
            <option>Home with outpatient PT</option>
            <option>Skilled nursing facility</option>
            <option>Inpatient rehabilitation facility</option>
            <option>Long-term acute care (LTAC)</option>
          </select>
        </div>
      </div></div>

      {/* Signature */}
      <div className="card"><div className="card-header">Signature</div><div className="card-body">
        {noteStatus==='draft' ? (
          <div className="signature-area">
            <p>Click "Sign Note" to electronically sign</p>
            <button className="btn btn-success btn-lg" onClick={()=>{setNoteStatus('signed');setSignedBy({name:user.displayName,date:new Date().toLocaleString()});}}>Sign Note</button>
          </div>
        ) : (
          <div className="signature-area signed">
            <div className="sig-text">{signedBy?.name}</div>
            <p style={{fontSize:12,color:'var(--text-muted)'}}>{signedBy?.date}</p>
          </div>
        )}
      </div></div>
    </div>
  );
}

// ==================== PROGRESS NOTE ====================
function ProgressNote({ patient, user }) {
  const [noteStatus, setNoteStatus] = useState('draft');
  const [signedBy, setSignedBy] = useState(null);
  const cd = useMemo(() => generateClinicalData(patient), [patient.id]);

  return (
    <div>
      <div className={`note-status ${noteStatus}`}>
        {noteStatus==='draft' && '\u{1F4DD} DRAFT \u2014 Progress Note'}
        {noteStatus==='signed' && `\u2705 SIGNED by ${signedBy?.name} on ${signedBy?.date}`}
      </div>

      <h3 style={{marginBottom:12,color:'var(--primary)'}}>Progress Note {'\u2014'} {patient.lastName}, {patient.firstName}</h3>
      <p style={{fontSize:12,color:'var(--text-muted)',marginBottom:16}}>
        Date: {new Date().toISOString().split('T')[0]} | LOS: {patient.losDay} days | Tx Sessions: {patient.totalTxSessions} | Room: {patient.roomNum} ({patient.unit})
      </p>

      <div className="card"><div className="card-header">Subjective</div><div className="card-body">
        <div className="form-group"><label>Patient Report</label><textarea rows={3} defaultValue={`Patient reports ${patient.category==='Cardiopulmonary'?'improved activity tolerance since admission. Able to ambulate further distances with less dyspnea.':patient.category==='Neuro'?'gradual improvement in affected extremity function. Able to participate more actively in therapy.':'overall improvement in mobility and function since admission. Pain is better managed.'}`}/></div>
      </div></div>

      <div className="card"><div className="card-header">Objective {'\u2014'} Progress Summary</div><div className="card-body">
        <h4 style={{marginBottom:8}}>Current Functional Status vs. Admission</h4>
        <div style={{overflowX:'auto'}}>
          <table className="assessment-table">
            <thead><tr><th style={{textAlign:'left'}}>Activity</th><th>Admission Level</th><th>Current Level</th><th>Change</th></tr></thead>
            <tbody>
              {[
                {activity:'Bed Mobility (Supine to Sit)',adm:patient.assistLevels.bedMobility.supineToSit},
                {activity:'Sit to Stand',adm:patient.assistLevels.transfers.sitToStand},
                {activity:'Stand Pivot Transfer',adm:patient.assistLevels.transfers.standPivot},
                {activity:'Ambulation',adm:patient.assistLevels.gait.levelSurfaces},
                {activity:'Stairs',adm:patient.assistLevels.stairs.stairsUp},
              ].map((row,i)=>(
                <tr key={i}>
                  <td style={{textAlign:'left',fontWeight:600}}>{row.activity}</td>
                  <td>{row.adm}</td>
                  <td><select defaultValue={row.adm}>{ASSIST_LEVELS.map(l=><option key={l}>{l}</option>)}</select></td>
                  <td><select><option>Improved</option><option>No Change</option><option>Declined</option></select></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div></div>

      <div className="card"><div className="card-header">Assessment {'\u2014'} Goal Status</div><div className="card-body">
        <div className="form-group"><label>Overall Assessment</label><textarea rows={4} defaultValue={`Patient has been seen for ${patient.totalTxSessions} treatment sessions over ${patient.losDay} days. ${cd.assessment}`}/></div>
        <div className="form-group"><label>Goal Progress</label>
          <select defaultValue="progress"><option value="met">Goals Met</option><option value="progress">Making Progress</option><option value="partial">Partial Progress</option><option value="plateau">Plateau</option><option value="regression">Regression</option></select>
        </div>
      </div></div>

      <div className="card"><div className="card-header">Plan</div><div className="card-body">
        <div className="form-group"><label>Continued Plan of Care</label><textarea rows={3} defaultValue={`Continue skilled PT 1-2x/day for functional mobility training, transfer training, gait training, therapeutic exercise, and discharge planning. Anticipated discharge to ${patient.dcRecommendation}.`}/></div>
        <div className="form-group"><label>Updated Discharge Recommendation</label>
          <select defaultValue={patient.dcRecommendation}>
            <option>Home with home health PT</option><option>Home with outpatient PT</option><option>Skilled nursing facility</option>
            <option>Inpatient rehabilitation facility</option><option>Long-term acute care (LTAC)</option><option>Home with family assistance</option>
            <option>Acute rehab unit</option><option>Hospice</option>
          </select>
        </div>
      </div></div>

      <div className="card"><div className="card-header">Signature</div><div className="card-body">
        {noteStatus==='draft' ? (
          <div className="signature-area">
            <p>Click "Sign Note" to electronically sign</p>
            <button className="btn btn-success btn-lg" onClick={()=>{setNoteStatus('signed');setSignedBy({name:user.displayName,date:new Date().toLocaleString()});}}>Sign Note</button>
          </div>
        ) : (
          <div className="signature-area signed">
            <div className="sig-text">{signedBy?.name}</div>
            <p style={{fontSize:12,color:'var(--text-muted)'}}>{signedBy?.date}</p>
          </div>
        )}
      </div></div>
    </div>
  );
}

// ==================== DOCUMENTS TAB ====================
function generateNoteContent(note, patient) {
  const p = patient;
  const safeJoin = (v,sep) => Array.isArray(v) ? v.join(sep) : (v || '');
  const subjectives = ['Patient reports feeling better today.','Patient reports mild soreness.','Patient tolerated treatment well.','Patient reports increased pain overnight.','Patient is motivated and engaged.','Patient reports difficulty sleeping due to pain.','Patient notes gradual improvement.'];
  const gaitDescs = ['Ambulated 150ft with rolling walker, CGA on level surfaces.','Ambulated 200ft with front-wheeled walker, supervision level.','Ambulated 100ft in hallway with rolling walker, min assist for balance.','Ambulated 250ft with single point cane, modified independent.','Ambulated 50ft bedside to bathroom with rolling walker, mod assist x1.'];
  const progressNotes = ['Patient demonstrating steady progress toward functional goals.','Patient showing gradual improvement in functional mobility.','Patient making good progress, responding well to interventions.','Patient progressing slower than expected, may need adjusted plan.'];
  const subj = subjectives[Math.floor(Math.random()*subjectives.length)];
  const gait = gaitDescs[Math.floor(Math.random()*gaitDescs.length)];
  const prog = progressNotes[Math.floor(Math.random()*progressNotes.length)];
  const als = p.assistLevels||{};
  const vit = p.vitals||{};

  if(note.type==='Initial Evaluation') {
    return `PHYSICAL THERAPY INITIAL EVALUATION
==========================================
Date: ${note.date}
Therapist: ${note.author}
Status: ${note.status}

PATIENT INFORMATION:
  Name: ${p.firstName} ${p.lastName}
  DOB: ${p.dob}   Age: ${p.age}   Gender: ${p.gender}
  MRN: ${p.mrn}   Room: ${p.roomNum}   Unit: ${p.unit}
  Attending MD: ${p.attendingMD}
  Admit Date: ${p.admitDate}
  Diagnosis: ${p.dx} (${p.dxCode})
  Admit Reason: ${p.admitReason||'See diagnosis'}
  Precautions: ${safeJoin(p.precautions,", ")||'None noted'}
  WB Status: ${p.wbStatus||'WBAT'}
  Code Status: ${p.codeStatus||'Full code'}
  Lines/Tubes: ${safeJoin(p.lines,", ")||'None'}

PAST MEDICAL HISTORY:
  ${safeJoin(p.pmh,", ")||'None reported'}

PRIOR LEVEL OF FUNCTION:
  ${p.priorFunction||'Independent with all ADLs and mobility'}
  Prior Devices: ${safeJoin(p.priorDevices,", ")||'None'}

VITALS AT EVAL:
  BP: ${vit.bp||'N/A'}  HR: ${vit.hr||'N/A'}  RR: ${vit.rr||'N/A'}  SpO2: ${vit.spo2||'N/A'}  Temp: ${vit.temp||'N/A'}

OBJECTIVE FINDINGS:
  Cognition: ${p.cognition||'Alert and oriented x4'}
  Bed Mobility: ${als.bedMobility||'Min A'}
  Transfers: ${als.transfers||'Min A'}
  Gait: ${als.gait||'CGA'}
  Stairs: ${als.stairs||'Not assessed'}

  GG Mobility Score: ${p.ggMobility||'N/A'}
  GG Self-Care Score: ${p.ggSelfCare||'N/A'}

ASSESSMENT:
  Patient is a ${p.age} y/o ${p.gender} admitted for ${p.admitReason||p.dx} presenting with impaired functional mobility, balance deficits, and decreased independence with ADLs. Patient would benefit from skilled PT services to improve functional mobility, balance, strength, and safety for discharge.

PLAN:
  - PT 5-6x/week per acute rehab protocol
  - Focus: functional mobility training, balance, strengthening, gait training
  - Discharge recommendation: ${p.dcRecommendation||'Home with HH services'}
  - Estimated LOS: 10-14 days`;
  }

  if(note.type==='Daily Treatment Note') {
    return `PHYSICAL THERAPY DAILY TREATMENT NOTE
==========================================
Date: ${note.date}
Therapist: ${note.author}
Status: ${note.status}

Patient: ${p.firstName} ${p.lastName}   MRN: ${p.mrn}   Room: ${p.roomNum}
Diagnosis: ${p.dx} (${p.dxCode})
LOS Day: ${p.losDay||'N/A'}   Tx Session #: ${p.totalTxSessions||'N/A'}

SUBJECTIVE: ${subj}

VITALS (pre-treatment):
  BP: ${vit.bp||'N/A'}  HR: ${vit.hr||'N/A'}  SpO2: ${vit.spo2||'N/A'}

OBJECTIVE:
  Bed Mobility: ${als.bedMobility||'Min A'} - Supine to/from sit
  Transfers: ${als.transfers||'Min A'} - Sit to/from stand at EOB
  Gait: ${gait}
  Therapeutic Exercise: LE strengthening - SLR, quad sets, ankle pumps, seated marching x10 reps each
  Balance Training: Static standing with UE support 30 sec x3 trials

RESPONSE TO TREATMENT:
  Patient tolerated treatment session well. No adverse events. Vitals stable throughout.

PLAN:
  Continue PT per plan of care. Progress mobility and gait distance as tolerated.`;
  }

  if(note.type==='Progress Note') {
    return `PHYSICAL THERAPY PROGRESS NOTE
==========================================
Date: ${note.date}
Therapist: ${note.author}
Status: ${note.status}

Patient: ${p.firstName} ${p.lastName}   MRN: ${p.mrn}   Room: ${p.roomNum}
Diagnosis: ${p.dx} (${p.dxCode})
LOS Day: ${p.losDay||'N/A'}   Total Tx Sessions: ${p.totalTxSessions||'N/A'}

PROGRESS SUMMARY:
  ${prog}

CURRENT FUNCTIONAL STATUS:
  Bed Mobility: ${als.bedMobility||'Min A'}
  Transfers: ${als.transfers||'Min A'}
  Gait: ${als.gait||'CGA'}
  Stairs: ${als.stairs||'Not assessed'}

  GG Mobility Score: ${p.ggMobility||'N/A'}
  GG Self-Care Score: ${p.ggSelfCare||'N/A'}

GOALS STATUS:
  1. Bed mobility supervision level - IN PROGRESS
  2. Transfers modified independent - IN PROGRESS
  3. Ambulate 300ft with least restrictive device - IN PROGRESS
  4. Stairs 4-6 steps with rail - NOT YET ADDRESSED

PLAN:
  Continue skilled PT 5-6x/week. Progress functional mobility. Target DC: ${p.dcRecommendation||'Home with services'}`;
  }

  if(note.type==='Discharge Summary') {
    return `PHYSICAL THERAPY DISCHARGE SUMMARY
==========================================
Date: ${note.date}
Therapist: ${note.author}
Status: ${note.status}

Patient: ${p.firstName} ${p.lastName}   MRN: ${p.mrn}   Room: ${p.roomNum}
Diagnosis: ${p.dx} (${p.dxCode})
Admit Date: ${p.admitDate}   Total LOS Days: ${p.losDay||'N/A'}
Total PT Sessions: ${p.totalTxSessions||'N/A'}

DISCHARGE FUNCTIONAL STATUS:
  Bed Mobility: ${als.bedMobility||'Supervision'}
  Transfers: ${als.transfers||'Supervision'}
  Gait: ${als.gait||'Supervision'}
  Stairs: ${als.stairs||'Min A with rail'}

DISCHARGE DISPOSITION: ${p.dcRecommendation||'Home with home health PT'}

RECOMMENDATIONS:
  - Continue outpatient or home health PT 2-3x/week
  - Home exercise program provided and reviewed with patient
  - Follow up with ${p.attendingMD||'PCP'} as scheduled
  - DME: Rolling walker for household and community mobility`;
  }

  return `CLINICAL NOTE
==========================================
Date: ${note.date}
Type: ${note.type}
Author: ${note.author}
Status: ${note.status}

Patient: ${p.firstName} ${p.lastName}
Diagnosis: ${p.dx} (${p.dxCode})

[Note content for this note type]`;
}

function DocumentsTab({ patient }) {
  const [viewingNote, setViewingNote] = React.useState(null);
  return React.createElement('div', {style:{padding:'20px'}},
    React.createElement('h2', {style:{fontSize:'20px',fontWeight:'600',marginBottom:'16px',color:'#1e293b'}}, 'Documents & Notes'),
    (!patient.noteHistory||patient.noteHistory.length===0)
      ? React.createElement('div', {style:{padding:'40px',textAlign:'center',color:'#94a3b8',background:'#f8fafc',borderRadius:'8px'}},
          React.createElement('div', {style:{fontSize:'32px',marginBottom:'8px'}}, String.fromCodePoint(0x1F4C4)),
          React.createElement('p', null, 'No notes documented yet.'))
      : React.createElement('table', {style:{width:'100%',borderCollapse:'collapse',background:'#fff',borderRadius:'8px',overflow:'hidden',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}},
          React.createElement('thead', null,
            React.createElement('tr', {style:{background:'#f1f5f9'}},
              React.createElement('th', {style:{padding:'10px 12px',textAlign:'left',fontWeight:'600',color:'#475569'}}, 'Type'),
              React.createElement('th', {style:{padding:'10px 12px',textAlign:'left',fontWeight:'600',color:'#475569'}}, 'Date'),
              React.createElement('th', {style:{padding:'10px 12px',textAlign:'left',fontWeight:'600',color:'#475569'}}, 'Author'),
              React.createElement('th', {style:{padding:'10px 12px',textAlign:'left',fontWeight:'600',color:'#475569'}}, 'Status'),
              React.createElement('th', {style:{padding:'10px 12px',textAlign:'left',fontWeight:'600',color:'#475569'}}, 'Action'))),
          React.createElement('tbody', null,
            patient.noteHistory.map((n,i) =>
              React.createElement('tr', {key:i, style:{borderBottom:'1px solid #e2e8f0'}},
                React.createElement('td', {style:{padding:'10px 12px',fontWeight:'500'}}, n.type),
                React.createElement('td', {style:{padding:'10px 12px',color:'#64748b'}}, n.date),
                React.createElement('td', {style:{padding:'10px 12px',color:'#64748b'}}, n.author),
                React.createElement('td', {style:{padding:'10px 12px'}},
                  React.createElement('span', {style:{padding:'2px 8px',borderRadius:'12px',fontSize:'11px',fontWeight:'500',
                    background: n.status==='Signed'?'#dcfce7':n.status==='Co-Signed'?'#dbeafe':'#fef9c3',
                    color: n.status==='Signed'?'#166534':n.status==='Co-Signed'?'#1e40af':'#854d0e'}}, n.status)),
                React.createElement('td', {style:{padding:'10px 12px'}},
                  React.createElement('button', {onClick:()=>setViewingNote(n), style:{padding:'4px 12px',fontSize:'12px',border:'1px solid #3b82f6',borderRadius:'6px',background:'#fff',color:'#3b82f6',cursor:'pointer',fontWeight:'500'}}, 'View')))))),
    viewingNote && React.createElement('div', {style:{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',zIndex:10000,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}, onClick:()=>setViewingNote(null)},
      React.createElement('div', {style:{background:'#fff',borderRadius:'12px',width:'100%',maxWidth:'800px',maxHeight:'90vh',display:'flex',flexDirection:'column',boxShadow:'0 25px 50px rgba(0,0,0,0.25)'}, onClick:e=>e.stopPropagation()},
        React.createElement('div', {style:{padding:'20px 24px',borderBottom:'1px solid #e2e8f0',display:'flex',justifyContent:'space-between',alignItems:'center',background:'#f8fafc',borderRadius:'12px 12px 0 0'}},
          React.createElement('h3', {style:{margin:0,fontSize:'18px',fontWeight:'700',color:'#1e293b'}}, viewingNote.type),
          React.createElement('div', {style:{display:'flex',gap:'8px'}},
            React.createElement('button', {onClick:()=>{var w=window.open('','_blank');w.document.write('<pre style="font-family:Consolas,monospace;padding:40px;max-width:800px;margin:auto;line-height:1.6">'+generateNoteContent(viewingNote,patient)+'</pre>');w.document.title=viewingNote.type;}, style:{padding:'6px 14px',fontSize:'12px',border:'none',borderRadius:'6px',background:'#3b82f6',color:'#fff',cursor:'pointer',fontWeight:'500'}}, 'Print'),
            React.createElement('button', {onClick:()=>setViewingNote(null), style:{padding:'6px 14px',fontSize:'12px',border:'none',borderRadius:'6px',background:'#ef4444',color:'#fff',cursor:'pointer',fontWeight:'500'}}, 'Close'))),
        React.createElement('div', {style:{padding:'20px 24px',borderBottom:'1px solid #e2e8f0'}},
          React.createElement('p', {style:{margin:'4px 0',fontSize:'13px',color:'#64748b'}}, viewingNote.date+' | '+viewingNote.author+' | '+viewingNote.status)),
        React.createElement('div', {style:{padding:'24px',overflowY:'auto',flex:1}},
          React.createElement('pre', {style:{fontFamily:'Consolas,Monaco,monospace',fontSize:'13px',lineHeight:'1.7',whiteSpace:'pre-wrap',wordWrap:'break-word',color:'#1e293b',margin:0,background:'#fafafa',padding:'20px',borderRadius:'8px',border:'1px solid #e2e8f0'}}, generateNoteContent(viewingNote,patient))))));}

// ==================== RENDER ====================
ReactDOM.render(<App/>, document.getElementById('root'));
