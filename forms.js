(() => {
  const formNames = {
    handover:'Preberací protokol bytu',
    proxy:'Splnomocnenie na schôdzu',
    houseRules:'Obrázkový domový poriadok',
    changeData:'Zmena údajov a počtu osôb',
    reconstruction:'Oznámenie rekonštrukcie',
    confirmation:'Žiadosť o potvrdenie / vyjadrenie'
  };

  function loadScript(src) {
    return new Promise((resolve,reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  let pdfReady = null;
  function ensurePdf() {
    if (window.pdfMake) return Promise.resolve();
    if (!pdfReady) pdfReady = loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.10/pdfmake.min.js')
      .then(() => loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.10/vfs_fonts.js'));
    return pdfReady;
  }

  const line = () => ({text:'________________________________________________________________________________',color:'#b9c5bf',fontSize:8,margin:[0,4,0,8]});
  const box = text => ({text:'□  '+text,fontSize:10,margin:[0,2,0,2]});
  const base = (title,subtitle,body) => ({
    pageSize:'A4', pageMargins:[42,42,42,42], defaultStyle:{fontSize:10,color:'#25322c'},
    styles:{h:{fontSize:20,bold:true,color:'#173d34'},sub:{fontSize:9,color:'#66756d'},sec:{fontSize:11,bold:true,color:'#173d34',margin:[0,12,0,5]},note:{fontSize:8.5,color:'#5e6b65'}},
    content:[
      {table:{widths:['*'],body:[[{stack:[{text:title,style:'h'},{text:subtitle,style:'sub',margin:[0,3,0,0]}],fillColor:'#ffdf63',margin:[14,12,14,12]}]]},layout:'noBorders',margin:[0,0,0,16]},
      ...body,
      {text:'KUSIMA, s.r.o. SVIT  |  info.kusima@gmail.com  |  0919 231 998',style:'note',alignment:'right',margin:[0,18,0,0]}
    ]
  });

  const docs = {
    handover: () => base('Preberací protokol bytu','Odovzdanie bytu a spoločné potvrdenie stavov meradiel pri zmene vlastníka',[
      {text:'Adresa domu / byt / poschodie',style:'sec'},line(),{text:'Dátum odovzdania',style:'sec'},line(),
      {columns:[[{text:'ODOVZDÁVAJÚCI',style:'sec'},'Meno a priezvisko',line(),'Telefón / e-mail',line()],[{text:'PREBERAJÚCI',style:'sec'},'Meno a priezvisko',line(),'Telefón / e-mail',line()]],columnGap:18},
      {text:'STAVY MERADIEL',style:'sec'},{table:{widths:['*','*','*','*'],body:[['Studená voda','Teplá voda','Teplo / rozdeľovač','Elektrina / plyn*'],['','','','']]},layout:'lightHorizontalLines'},
      {text:'ODOVZDANÉ KĽÚČE / PRÍSTUPY',style:'sec'},box('byt'),box('vchod'),box('pivnica / sklad'),box('schránka'),box('garáž / čip / ovládač'),
      {text:'POZNÁMKY K STAVU BYTU / ZÁVADY',style:'sec'},line(),line(),line(),
      {text:'Obe strany potvrdzujú, že uvedené stavy meradiel a odovzdané kľúče zodpovedajú skutočnosti v deň odovzdania. Protokol sám osebe nenahrádza zmluvu o prevode vlastníctva ani rozhodnutie katastra; slúži najmä ako podklad pre správcu a vzájomné vysporiadanie spotrieb.',style:'note',margin:[0,8,0,16]},
      {columns:[[{text:'Odovzdávajúci - podpis'},line()],[{text:'Preberajúci - podpis'},line()]],columnGap:20}
    ]),
    proxy: () => base('Splnomocnenie na schôdzu vlastníkov','Podľa § 14 ods. 4 zákona č. 182/1993 Z. z. - podpis splnomocniteľa musí byť úradne osvedčený',[
      'Splnomocniteľ - meno a priezvisko',line(),'Adresa bytu / nebytového priestoru',line(),'Číslo bytu / NP a kontakt',line(),{text:'týmto splnomocňujem',margin:[0,4,0,8]},'Splnomocnenec - meno a priezvisko',line(),'Adresa / dátum narodenia na identifikáciu',line(),
      {text:'ROZSAH SPLNOMOCNENIA',style:'sec'},box('na zastupovanie na schôdzi vlastníkov dňa ____________________'),box('na zastupovanie pri písomnom hlasovaní v termíne ____________________'),box('v celom rozsahu hlasovacích práv vlastníka pre uvedené konanie'),box('iba podľa nižšie uvedených pokynov k jednotlivým bodom'),
      {text:'Pokyny / obmedzenie splnomocnenia',style:'sec'},line(),line(),line(),
      {text:'Dôležité: Splnomocnenie musí byť v listinnej podobe s úradne osvedčeným podpisom vlastníka a splnomocnenec sa preukazuje originálom. Vlastník nemôže splnomocniť správcu; zákon obsahuje aj ďalšie obmedzenia pri voľbe a odvolávaní funkcií.',style:'note',margin:[0,10,0,16]},
      {columns:[[{text:'Miesto a dátum'},line()],[{text:'ÚRADNE OSVEDČENÝ PODPIS SPLNOMOCNITEĽA',bold:true,fontSize:9},line()]],columnGap:20}
    ]),
    houseRules: () => base('Obrázkový domový poriadok','Vzor jednoduchých pravidiel slušného a bezpečného bývania',[
      {table:{widths:['*','*'],body:[
        [{stack:[{text:'01  Ticho a ohľaduplnosť',bold:true,color:'#173d34'},{text:'Rešpektujte susedov, nočný pokoj a miestne pravidlá. Hlučnú prácu oznámte vopred.',fontSize:9,margin:[0,5,0,0]}],fillColor:'#f7f9f8',margin:10},{stack:[{text:'02  Chodby sú úniková cesta',bold:true,color:'#173d34'},{text:'Neskladujte predmety tak, aby blokovali chodby, schodiská, hydranty alebo východy.',fontSize:9,margin:[0,5,0,0]}],fillColor:'#f7f9f8',margin:10}],
        [{stack:[{text:'03  Čistota spoločných priestorov',bold:true,color:'#173d34'},{text:'Po sťahovaní či rekonštrukcii odstráňte znečistenie bezodkladne.',fontSize:9,margin:[0,5,0,0]}],fillColor:'#fff8d9',margin:10},{stack:[{text:'04  Odpad patrí do nádob',bold:true,color:'#173d34'},{text:'Objemný a stavebný odpad nepatrí ku kontajnerom, ak obec neurčí inak.',fontSize:9,margin:[0,5,0,0]}],fillColor:'#fff8d9',margin:10}],
        [{stack:[{text:'05  Rekonštrukcia s rozumom',bold:true,color:'#173d34'},{text:'Chráňte výťah a chodby; zásahy do spoločných rozvodov a konštrukcií riešte vopred.',fontSize:9,margin:[0,5,0,0]}],fillColor:'#f7f9f8',margin:10},{stack:[{text:'06  Voda, elektrina, kúrenie',bold:true,color:'#173d34'},{text:'Poruchu spoločných rozvodov nahláste bezodkladne a zásah prenechajte oprávnenej osobe.',fontSize:9,margin:[0,5,0,0]}],fillColor:'#f7f9f8',margin:10}],
        [{stack:[{text:'07  Dvere a bezpečnosť',bold:true,color:'#173d34'},{text:'Vchod nenechávajte zbytočne otvorený a chráňte čipy a prístupové údaje.',fontSize:9,margin:[0,5,0,0]}],fillColor:'#fff8d9',margin:10},{stack:[{text:'08  Balkóny a okná',bold:true,color:'#173d34'},{text:'Nevyhadzujte predmety ani nečistoty; pri polievaní myslite na byty pod vami.',fontSize:9,margin:[0,5,0,0]}],fillColor:'#fff8d9',margin:10}],
        [{stack:[{text:'09  Zvieratá',bold:true,color:'#173d34'},{text:'Majiteľ zodpovedá za čistotu a bezpečné správanie zvieraťa v spoločných priestoroch.',fontSize:9,margin:[0,5,0,0]}],fillColor:'#f7f9f8',margin:10},{stack:[{text:'10  Keď vznikne problém',bold:true,color:'#173d34'},{text:'Najprv skúste vecný dohovor. Poruchu domu rieši správca; bezprostredné ohrozenie tiesňové zložky.',fontSize:9,margin:[0,5,0,0]}],fillColor:'#f7f9f8',margin:10}]
      ]},layout:{hLineColor:()=> '#dfe6e2',vLineColor:()=> '#dfe6e2'}},
      {text:'Tento dokument je vzor. Konkrétny dom si môže pravidlá upraviť rozhodnutím vlastníkov a podľa zmluvy o výkone správy, technických podmienok domu, požiarnych predpisov a miestnych nariadení.',style:'note',margin:[0,12,0,0]}
    ]),
    changeData: () => base('Oznámenie zmeny údajov a počtu osôb','Pre aktualizáciu evidencie správcu a položiek závislých od počtu užívateľov',[
      'Meno a priezvisko vlastníka',line(),'Adresa domu / číslo bytu alebo NP',line(),'Telefón',line(),'E-mail',line(),'Korešpondenčná adresa, ak je iná',line(),
      {text:'ZMENA POČTU OSÔB UŽÍVAJÚCICH BYT',style:'sec'},{columns:[['Pôvodný počet',line()],['Nový počet',line()],['Zmena platí od',line()]],columnGap:12},
      {text:'ĎALŠIA ZMENA',style:'sec'},box('telefón / e-mail'),box('korešpondenčná adresa'),box('iné'),line(),line(),
      {text:'Potvrdzujem správnosť uvedených údajov a žiadam správcu o ich použitie v rozsahu potrebnom na výkon správy domu, komunikáciu a rozpočítanie služieb.',style:'note',margin:[0,10,0,15]},
      {columns:[['Miesto a dátum',line()],['Podpis vlastníka',line()]],columnGap:20}
    ]),
    reconstruction: () => base('Oznámenie plánovanej rekonštrukcie bytu','Praktický podklad pre správcu - nenahrádza prípadné povolenie alebo ohlásenie stavebnému úradu',[
      'Vlastník',line(),'Adresa domu / číslo bytu',line(),'Telefón a e-mail',line(),'Predpokladaný termín prác od - do',line(),'Zhotoviteľ / kontakt, ak je známy',line(),
      {text:'STRUČNÝ ROZSAH PRÁC',style:'sec'},line(),line(),line(),
      {text:'TÝKA SA REKONŠTRUKCIA AJ...',style:'sec'},box('vody / kanalizácie'),box('kúrenia / radiátorov'),box('spoločných elektrických rozvodov'),box('nosných konštrukcií'),box('fasády / okien / balkóna'),box('potreby odstávky vody alebo kúrenia'),
      {text:'Chráňte výťah a chodby, stavebný odpad neukladajte do bežných nádob a zásahy do spoločných častí alebo rozvodov riešte so správcom vopred. Za splnenie povinností voči stavebnému úradu zodpovedá stavebník.',style:'note',margin:[0,10,0,15]},
      {columns:[['Miesto a dátum',line()],['Podpis vlastníka',line()]],columnGap:20}
    ]),
    confirmation: () => base('Žiadosť o potvrdenie alebo vyjadrenie správcu','Pre banku, kataster, prevod bytu alebo inú preukázanú potrebu',[
      'Meno a priezvisko vlastníka',line(),'Adresa domu / číslo bytu alebo NP',line(),'Telefón',line(),'E-mail',line(),
      {text:'ŽIADAM O',style:'sec'},box('potvrdenie o nedoplatkoch / stave účtu vlastníka'),box('potvrdenie alebo vyjadrenie pre banku'),box('podklad pri prevode vlastníctva'),box('kópiu dokumentu z archívu'),box('iné vyjadrenie správcu'),
      {text:'ÚČEL / DOPLNENIE',style:'sec'},line(),line(),line(),{text:'SPÔSOB DORUČENIA',style:'sec'},box('e-mail'),box('osobne'),box('poštou'),
      {text:'Úkony nad rámec bežnej správy môžu byť spoplatnené podľa aktuálneho cenníka KUSIMA. Pri žiadosti tretej osoby môže správca požadovať preukázanie oprávnenia alebo súhlasu vlastníka.',style:'note',margin:[0,10,0,15]},
      {columns:[['Miesto a dátum',line()],['Podpis žiadateľa',line()]],columnGap:20}
    ])
  };

  async function download(id,button) {
    const old = button?.textContent;
    if (button) button.textContent = 'Pripravujem PDF…';
    try {
      await ensurePdf();
      const doc = docs[id]?.();
      if (!doc) throw new Error('missing');
      const filename = (formNames[id] || 'KUSIMA').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'_') + '.pdf';
      window.pdfMake.createPdf(doc).download(filename);
    } catch {
      alert('PDF sa nepodarilo pripraviť. Skúste to znova alebo nám napíšte.');
    } finally {
      if (button) setTimeout(() => button.textContent = old, 500);
    }
  }

  document.addEventListener('click', e => {
    const button = e.target.closest('[data-form]');
    if (button) download(button.dataset.form, button);
  });
})();
