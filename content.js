(() => {
  const EMAIL = 'info.kusima@gmail.com';
  const mail = (subject, body) => `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const contactButton = (subject='[KUSIMA] Požiadavka vlastníka', body='Prosím uveďte:\n- dom / adresu\n- číslo bytu alebo priestor\n- čo potrebujete vyriešiť\n- telefón\n') => `<div class="actions"><a class="btn primary" href="${mail(subject,body)}">Napísať správcovi</a></div>`;

  const cennik = {
    aktualizovane: '07.09.2026',
    poznamka: 'Cenník vychádza z doterajšieho cenníka KUSIMA platného od roku 2024. Uvedené ceny sú orientačné; dohodnutá cena je súčasťou konkrétnej zmluvy o výkone správy a môže zohľadňovať ročnú mieru inflácie. KUSIMA s.r.o. nie je platiteľom DPH.',
    polozky: [
      ['Správa bytu v bytovom dome od 20 do 50 bytov','od 6 € / mesiac','za byt'],
      ['Správa bytu v bytovom dome do 20 a nad 50 bytov','dohodou','za byt / mesiac'],
      ['Správa domovej kotolne bez obsluhy','od 50 € / mesiac',''],
      ['Správa domovej výmenníkovej stanice tepla bez obsluhy','od 40 € / mesiac',''],
      ['Servisné výjazdy a opravy vlastnými kapacitami správcu','15 € / hod.',''],
      ['Príprava a realizácia písomného hlasovania','30 €',''],
      ['Zvolanie mimoriadnej schôdze','40 €',''],
      ['Administrácia bankového úveru','1,35 % zo sumy poskytnutého úveru','minimálne 200 €'],
      ['Vystavenie potvrdenia pre kataster alebo banku','20 €',''],
      ['Vyhľadávanie dokumentov na žiadosť vlastníka v archíve','15 € / hod.',''],
      ['Hotovostné operácie v pokladni','neposkytujeme','aktuálne správca hotovostné operácie nerealizuje']
    ]
  };

  const priceRows = cennik.polozky.map(([name,price,note]) => `<div class="copy-line" style="cursor:default"><span>${note||'služba'}</span><strong>${name}</strong><i>${price}</i></div>`).join('');

  const forms = [
    ['handover','Preberací protokol bytu','Odpočty meradiel, kľúče a stav bytu pri zmene vlastníka.'],
    ['proxy','Splnomocnenie na schôdzu','Vzor podľa § 14 ods. 4; podpis vlastníka musí byť úradne osvedčený.'],
    ['houseRules','Obrázkový domový poriadok','Jednoduchý vizuálny vzor pravidiel slušného a bezpečného bývania.'],
    ['changeData','Zmena údajov a počtu osôb','Kontakt, korešpondenčná adresa a počet užívateľov bytu.'],
    ['reconstruction','Oznámenie rekonštrukcie','Termín, rozsah prác a zásahy do spoločných rozvodov alebo častí domu.'],
    ['confirmation','Žiadosť o potvrdenie / vyjadrenie','Pre banku, kataster, prevod bytu alebo dokument z archívu.']
  ];
  const formCards = forms.map(([id,title,desc]) => `<article class="content-card"><div class="mini-icon">▤</div><h3>${title}</h3><p>${desc}</p><button class="btn" data-form="${id}">Stiahnuť PDF</button></article>`).join('');

  const nodes = {
    client: {
      title: 'Ako vám môžem pomôcť?',
      intro: 'Vyberte, čo je vám najbližšie. Nemusíte vedieť, kam presne váš problém patrí.',
      choices: [
        ['problem','Mám problém','Porucha, vyúčtovanie, susedský spor alebo iná nepríjemnosť.'],
        ['forms','Tlačivá na stiahnutie','Pripravené PDF vzory pre najčastejšie situácie.'],
        ['objection','Mám výhradu alebo návrh','K správe, vyúčtovaniu, dodávateľovi, hlasovaniu alebo zlepšeniu domu.'],
        ['complaints','Reklamačný poriadok','Ako uplatniť reklamáciu služby a čo bude nasledovať.'],
        ['arrange','Potrebujem niečo vybaviť','Zmena údajov, prevod bytu, potvrdenie alebo hlasovanie.'],
        ['priceList','Cenník služieb','Prehľad cien a informácia, čo je zahrnuté v správe.']
      ]
    },
    problem: {
      title: 'Čo sa deje?',
      intro: 'Vyberte najbližšiu možnosť. Ak sa netrafíte presne, nič sa nedeje.',
      choices: [
        ['fault','Porucha alebo havária','Voda, výťah, dvere, osvetlenie, strecha, elektro alebo spoločné priestory.'],
        ['billing','Vyúčtovanie alebo platba','Preplatok, nedoplatok, predpis, odpočet alebo rozpočítanie.'],
        ['heat','Teplo, voda alebo merače','Kúrenie, teplá voda, odpočty alebo meradlá.'],
        ['neighbors','Susedské spory','Hluk, fajčenie, konflikt alebo obťažovanie.'],
        ['reconstruction','Sused prerába byt','Obava zo zásahu do konštrukcie alebo rozvodov.'],
        ['otherproblem','Niečo iné','Napíšte nám stručne, čo sa deje.']
      ]
    },
    arrange: {
      title: 'Čo potrebujete vybaviť?',
      intro: 'Cieľom je, aby ste nemuseli telefonicky zisťovať, čo od vás potrebujeme.',
      choices: [
        ['sale','Predávam alebo kupujem byt','Odpočty, kontakty a zmena vlastníka.'],
        ['change','Mením údaje alebo počet osôb','E-mail, telefón, korešpondenčná adresa alebo užívatelia.'],
        ['forms','Potrebujem tlačivo','Vzory a dokumenty na stiahnutie.'],
        ['myreconstruction','Chcem prerábať byt','Čo oznámiť správcovi a kedy riešiť stavebný úrad.'],
        ['confirmation','Potrebujem potvrdenie alebo doklad','Kópia, potvrdenie, vyjadrenie alebo podklad.'],
        ['voting','Schôdza, hlasovanie alebo splnomocnenie','Ako sa zapojiť do rozhodovania.']
      ]
    },
    objection: {
      title: 'Čo vám prekáža alebo čo navrhujete?',
      intro: 'Výhradu preveríme a dobrý návrh radi posunieme ďalej. Vyberte, čo je vám najbližšie.',
      choices: [
        ['managercomplaint','Nie som spokojný so správou','Komunikácia, rýchlosť alebo postup správcu.'],
        ['billcomplaint','Nesedí mi vyúčtovanie','Chcem vysvetlenie alebo kontrolu konkrétnej položky.'],
        ['contractorcomplaint','Nie som spokojný s dodávateľom','Kvalita opravy, správanie alebo termín.'],
        ['votecomplaint','Nesúhlasím s hlasovaním','Výsledok, postup, kvórum alebo zápisnica.'],
        ['repairproposal','Navrhujem opravu alebo obnovu','Strecha, fasáda, výťah, dvere, rozvody alebo balkóny.'],
        ['energyproposal','Navrhujem úsporu energie','Zateplenie, regulácia, meranie alebo osvetlenie.'],
        ['ruleproposal','Navrhujem zmenu pravidla','Spoločné priestory, poriadok alebo spôsob užívania.'],
        ['surveyproposal','Chcem zistiť názor ostatných','Anketa alebo príprava rozhodnutia.'],
        ['supplierproposal','Odporúčam dodávateľa','Firma alebo remeselník, s ktorým máte dobrú skúsenosť.']
      ]
    },

    fault: { kicker:'PORUCHA / HAVÁRIA', title:'Najprv potrebujeme vedieť, čo sa stalo a kde.', html:`<p>Ak ide o poruchu domu, správca je správna prvá adresa. Najrýchlejšie je poslať e-mail s domom, miestom poruchy, stručným popisom, telefónom a podľa možnosti fotografiou.</p><div class="notice"><strong>Pri bezprostrednom ohrození života, požiari, plyne alebo vážnej havárii nečakajte na správcu a volajte 112.</strong></div>${contactButton('[KUSIMA] Porucha v dome','Prosím uveďte:\n- dom / adresu\n- miesto poruchy\n- čo presne sa deje\n- telefón\n- podľa možnosti priložte fotografiu\n')}` },
    billing: { kicker:'VYÚČTOVANIE / PLATBY', title:'Ak niečo nesedí, potrebujeme konkrétnu položku.', html:`<p>Ročné vyúčtovanie je výsledkom viacerých nákladov, odpočtov a pravidiel rozpočítania. Najprv vysvetlíme výpočet, potom preveríme vstupné údaje.</p><div class="softnote"><b>Najlepšia otázka:</b> „Prečo je táto položka 184 €?“ namiesto „Mám vysoký nedoplatok.“</div>${contactButton('[KUSIMA] Otázka k vyúčtovaniu','Prosím uveďte:\n- dom / adresu\n- číslo bytu\n- rok vyúčtovania\n- konkrétnu položku alebo sumu\n- čo podľa vás nesedí\n')}` },
    heat: { kicker:'TEPLO / VODA / MERAČE', title:'Najprv rozlíšime poruchu, meranie a rozpočítanie.', html:`<p>Pri kúrení alebo vode môže byť problém technický, merací alebo účtovný. Napíšte, či ide o nefunkčné kúrenie, teplú vodu, podozrivý odpočet, merač alebo vyúčtovanie.</p><div class="softnote"><b>Merač:</b> odfoťte displej, označenie a typ. <b>Rozpočítanie:</b> uveďte rok a položku vyúčtovania.</div>${contactButton()}` },
    neighbors: { kicker:'SUSEDIA A SPOLUNAŽÍVANIE', title:'Susedský spor vie znepríjemniť bývanie.', html:`<p>Situáciu nám môžete stručne opísať. Pomôžeme vám zorientovať sa a oddeliť to, čo patrí správcovi, od osobného sporu.</p><div class="notice"><strong>Správca nie je polícia ani súd.</strong> Pri násilí, vyhrážkach alebo závažnom rušení verejného poriadku treba kontaktovať príslušné orgány.</div>${contactButton('[KUSIMA] Susedský spor','Prosím uveďte:\n- kde sa problém týka\n- čo sa deje\n- ako dlho\n- čo ste už skúsili\n- čo od správcu očakávate\n')}` },
    reconstruction: { kicker:'STAVEBNÉ ÚPRAVY SUSEDA', title:'Nie každá prerábka je vecou správcu. Niektoré zásahy však môžu byť.', html:`<p>Ak máte podozrenie na zásah do nosnej konštrukcie, spoločných rozvodov, fasády alebo iného spoločného prvku, napíšte nám konkrétne, čo ste spozorovali.</p><div class="notice"><strong>Správca nie je stavebný úrad.</strong> Otázky povoľovania stavebných zásahov rieši príslušný orgán podľa aktuálneho stavebného zákona.</div>${contactButton()}` },
    otherproblem: { kicker:'INÝ PROBLÉM', title:'Napíšte nám ho vlastnými slovami.', html:`<p>Nemusíte poznať správnu kategóriu. Uveďte dom, byt alebo priestor, čo sa deje a čo od správcu potrebujete.</p>${contactButton()}` },

    sale: { kicker:'PREDAJ / KÚPA BYTU', title:'Pri zmene vlastníka potrebujeme čistý prechod údajov.', html:`<p>Pri odovzdaní bytu si spoločne zapíšte stavy meradiel, odovzdané kľúče a kontakty. Nový vlastník následne oznámi správcovi svoje kontaktné a korešpondenčné údaje.</p><div class="actions"><button class="btn" data-form="handover">Stiahnuť preberací protokol</button></div>` },
    change: { kicker:'ZMENA ÚDAJOV', title:'Pošlite nám nové údaje a odkedy platia.', html:`<p>Môže ísť o e-mail, telefón, korešpondenčnú adresu alebo počet užívateľov bytu. Uveďte dom a číslo bytu.</p>${contactButton('[KUSIMA] Zmena údajov vlastníka','Prosím uveďte:\n- dom / adresu\n- číslo bytu\n- meno vlastníka\n- čo sa mení\n- odkedy zmena platí\n')}` },
    myreconstruction: { kicker:'REKONŠTRUKCIA BYTU', title:'Pred začiatkom je dobré vedieť, čo zasahuje do spoločných častí domu.', html:`<p>Oznámte termín a rozsah prác. Pri zásahoch do spoločných rozvodov, nosných konštrukcií alebo fasády treba riešiť aj ďalšie súhlasy či povolenia.</p><div class="actions"><button class="btn" data-form="reconstruction">Stiahnuť oznámenie rekonštrukcie</button></div>` },
    confirmation: { kicker:'POTVRDENIE / DOKLAD', title:'Napíšte, aký dokument potrebujete a na aký účel.', html:`<p>Pri potvrdení pre banku, kataster alebo pri vyhľadávaní staršieho dokumentu uveďte dom, byt, vlastníka a čo presne potrebujete.</p>${contactButton('[KUSIMA] Žiadosť o potvrdenie / doklad','Prosím uveďte:\n- dom / adresu\n- číslo bytu\n- meno vlastníka\n- aký dokument potrebujete\n- na aký účel\n')}` },
    voting: { kicker:'SCHÔDZA / HLASOVANIE', title:'Vlastníci rozhodujú podľa pravidiel zákona a domu.', html:`<p>Ak sa nemôžete zúčastniť, pri splnení zákonných podmienok môžete využiť splnomocnenie. Pri elektronickej komunikácii používame adresu, ktorú vlastník správcovi uviedol a odsúhlasil.</p><div class="actions"><button class="btn" data-form="proxy">Stiahnuť splnomocnenie</button></div>` },

    managercomplaint: { kicker:'VÝHRADA K SPRÁVE', title:'Napíšte konkrétne, čo máme preveriť alebo zmeniť.', html:`<p>Najlepšie sa dá reagovať na konkrétny postup, termín, odpoveď alebo situáciu. Uveďte, čo sa stalo a akú nápravu očakávate.</p>${contactButton('[KUSIMA] Výhrada k správe')}` },
    billcomplaint: { kicker:'VÝHRADA K VYÚČTOVANIU', title:'Preveríme konkrétnu položku alebo vstupný údaj.', html:`<p>Uveďte rok, položku, sumu a čo podľa vás nesedí.</p>${contactButton('[KUSIMA] Výhrada k vyúčtovaniu')}` },
    contractorcomplaint: { kicker:'DODÁVATEĽ', title:'Potrebujeme vedieť, ktorá práca a čo konkrétne nie je v poriadku.', html:`<p>Ak je to možné, pridajte fotografiu, dátum realizácie a stručný opis vady alebo problému.</p>${contactButton('[KUSIMA] Výhrada k dodávateľovi')}` },
    votecomplaint: { kicker:'HLASOVANIE', title:'Preveríme postup, výsledok alebo podklady.', html:`<p>Uveďte dom, dátum hlasovania a konkrétnu výhradu: kvórum, spôsob hlasovania, výsledok alebo zápisnicu.</p>${contactButton('[KUSIMA] Výhrada k hlasovaniu')}` },
    repairproposal: { kicker:'NÁVRH OPRAVY / OBNOVY', title:'Dobrý návrh najprv technicky a cenovo preveríme.', html:`<p>Napíšte, čo navrhujete opraviť alebo obnoviť a prečo. Ak máte fotografiu alebo kontakt na dodávateľa, priložte ho.</p>${contactButton('[KUSIMA] Návrh opravy / obnovy')}` },
    energyproposal: { kicker:'ÚSPORA ENERGIE', title:'Úspora musí dávať technický aj ekonomický zmysel.', html:`<p>Navrhované riešenie porovnáme s nákladmi, možnou úsporou a potrebou rozhodnutia vlastníkov.</p>${contactButton('[KUSIMA] Návrh úspory energie')}` },
    ruleproposal: { kicker:'PRAVIDLÁ DOMU', title:'Pravidlo má byť zrozumiteľné a vymáhateľné.', html:`<p>Napíšte, čo chcete zmeniť, prečo a koho sa to týka. Podľa povahy veci navrhneme anketu, schôdzu alebo hlasovanie.</p>${contactButton('[KUSIMA] Návrh pravidla v dome')}` },
    surveyproposal: { kicker:'ANKETA', title:'Anketa a zisťovanie názoru', html:`<p>Ak netreba hneď právne záväzné hlasovanie, vieme rýchlo zistiť názor vlastníkov cez Google Forms a výsledok prehľadne vyhodnotiť.</p><div class="notice"><strong>Anketa nie je automaticky zákonné hlasovanie.</strong> Použijeme ju na prieskum alebo prípravu rozhodnutia.</div>${contactButton('[KUSIMA] Návrh ankety')}` },
    supplierproposal: { kicker:'ODPORÚČANÝ DODÁVATEĽ', title:'Pošlite nám kontakt a čo na ňom odporúčate.', html:`<p>Referencie od vlastníkov sú užitočné. Dodávateľa však pri konkrétnej zákazke vždy posudzujeme podľa zadania, ceny, oprávnení a podmienok.</p>${contactButton('[KUSIMA] Odporúčanie dodávateľa')}` },

    forms: { kicker:'NAŠA ŠPAJZA', title:'Tlačivá na stiahnutie', html:`<p>Vybrali sme dokumenty, ktoré majú praktický význam. Poruchy sem zámerne nedávame – tie riešte rovno telefonicky alebo e-mailom.</p><div class="content-grid">${formCards}</div><div class="notice"><strong>Splnomocnenie:</strong> pri zastupovaní vlastníka na hlasovaní vyžaduje zákon listinnú formu a úradne osvedčený podpis vlastníka.</div>` },
    complaints: { kicker:'NAŠA PRACOVŇA', title:'Reklamačný poriadok', html:`<p>Tento postup sa týka reklamácie vady služby poskytovanej spoločnosťou KUSIMA s.r.o. pri výkone správy. Bežná otázka, podnet, susedský spor alebo hlásenie poruchy nemusí byť reklamáciou služby.</p><div class="softnote"><b>1. Reklamáciu pošlite písomne.</b> Najjednoduchšie e-mailom na info.kusima@gmail.com alebo poštou na sídlo spoločnosti. Uveďte dom, byt alebo priestor, svoje meno, čo reklamujete, kedy sa problém prejavil a čo žiadate napraviť.</div><div class="softnote"><b>2. Potvrdíme prijatie.</b> Pri vytknutí vady služby vám vydáme písomné potvrdenie a uvedieme lehotu, v ktorej vadu odstránime. Tá nesmie byť dlhšia ako 30 dní odo dňa vytknutia vady služby.</div><div class="softnote"><b>3. Ak zodpovednosť odmietneme, vysvetlíme prečo.</b> Dôvody odmietnutia zodpovednosti za vadu služby oznámime písomne.</div><div class="notice"><strong>Dôležité:</strong> reklamácia služby správcu nie je to isté ako reklamácia práce dodávateľa domu, nesúhlas s rozhodnutím vlastníkov alebo osobný spor medzi susedmi.</div>${contactButton('[KUSIMA] Reklamácia služby správcu','Prosím uveďte:\n- dom / adresu\n- číslo bytu alebo priestor\n- meno vlastníka\n- ktorú službu reklamujete\n- čo považujete za vadu alebo nesprávny postup\n- kedy sa problém prejavil\n- akú nápravu žiadate\n- telefón\n')}` },
    priceList: { kicker:'NAŠA PRACOVŇA', title:'Cenník platný od 1.1.2026', html:`<div class="invoice-grid">${priceRows}</div><p class="softnote">${cennik.poznamka}</p>` }
  };

  window.KUSIMA_CONTENT = {
    email: EMAIL,
    cennik,
    nodes,
    roomMap: {
      client:['kitchen','· naša kuchyňa'], problem:['kitchen','· naša kuchyňa'], arrange:['kitchen','· naša kuchyňa'], objection:['kitchen','· naša kuchyňa'],
      forms:['pantry','· naša špajza'], priceList:['office','· naša pracovňa'], complaints:['office','· naša pracovňa'],
      fault:['workshop','· naša dielňa'], heat:['workshop','· naša dielňa'], reconstruction:['workshop','· naša dielňa'], myreconstruction:['workshop','· naša dielňa'], contractorcomplaint:['workshop','· naša dielňa'], repairproposal:['workshop','· naša dielňa'], energyproposal:['workshop','· naša dielňa'], supplierproposal:['workshop','· naša dielňa']
    },
    roomMeta: {
      kitchen:['Naša kuchyňa','tu sa veci varia a riešia'], pantry:['Naša špajza','všetko dôležité po ruke'], office:['Naša pracovňa','poriadok, pravidlá a čísla'], workshop:['Naša dielňa','technika, opravy a realizácia']
    }
  };
})();
