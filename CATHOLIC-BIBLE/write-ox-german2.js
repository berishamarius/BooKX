const fs = require('fs');
const BASE = __dirname + '/data-orthodox/german/';

// Book 80: Zusätze zu Ester (Kapitel 10-16 mit Inhalt)
// Chapters 1-9 each have 1 verse "…" — keep as German placeholder
const b80 = { chapters: {} };
for (let c=1;c<=9;c++) b80.chapters[c] = {chapter:c,name:'',verses:{'1':{verse:1,text:'(Kanonisches Buch Ester, Kapitel '+c+')'}}};

// Chapter 10: Deutung des Traums des Mordechai (13 verses, but 1-3 are "…")
const ch10 = ['(Ester, Kapitel 10, Vers 1)','(Ester, Kapitel 10, Vers 2)','(Ester, Kapitel 10, Vers 3)',
'Da sprach Mardochai: Das alles hat Gott getan.',
'Denn ich erinnere mich des Traumes, den ich über diese Dinge hatte, und nichts davon ist ausgeblieben:',
'Ein kleiner Brunnen wurde zu einem Strom, und Licht und Sonne und viel Wasser war da. Dieser Strom ist Ester, die der König geheiratet und zur Königin gemacht hat.',
'Die zwei Drachen bin ich und Haman.',
'Die Völker aber waren die, die sich versammelt hatten, den Namen der Juden zu vertilgen.',
'Und mein Volk ist dieses Israel, das zu Gott schrie und gerettet wurde; denn der Herr hat sein Volk errettet und der Herr hat uns von all diesen Übeln befreit.',
'Und er hat zwei Lose gemacht, eines für das Volk Gottes und eines für alle Heidenvölker.',
'Und diese zwei Lose sind zur Stunde und Zeit und zum Tage des Gerichtes vor Gott unter alle Völker gekommen.',
'Und Gott gedachte seines Volkes und rechtfertigte sein Erbe.',
'Darum sollen ihnen diese Tage im Monat Adar, am vierzehnten und fünfzehnten Tage dieses Monats, in Freude und Jubel versammelt vor Gott gefeiert werden durch alle Geschlechter seines Volkes Israel.'
];
const vv10={}; ch10.forEach((t,i)=>vv10[i+1]={verse:i+1,text:t});
b80.chapters[10]={chapter:10,name:'',verses:vv10};

// Chapter 11: Einleitung und Traum des Mardochai (12 verses)
const ch11 = [
'Im vierten Jahr der Regierung des Ptolemäus und der Kleopatra brachte Dositheus, der sich Priester und Levit nannte, und sein Sohn Ptolemäus diesen Brief über das Purimfest nach Ägypten; er sagte, es sei echt, und Lysimachos, der Sohn des Ptolemäus, habe ihn in Jerusalem übersetzt.',
'Im zweiten Jahr der Regierung des großen Königs Artaxerxes, am ersten Tag des Monats Nisan, hatte Mardochai, der Sohn des Jairus, des Sohnes des Simei, des Sohnes des Kisch, vom Stamme Benjamin, einen Traum.',
'Der war ein Jude und wohnte in der Stadt Susan; ein angesehener Mann, der am Hof des Königs diente.',
'Er war auch einer der Gefangenen, die Nebukadnezar, der König von Babel, aus Jerusalem fortgeführt hatte mit Jechonias, dem König von Juda.',
'Sieh, ein Geräusch von Aufruhr, Donner und Erdbeben und Erschütterung im Lande.',
'Und sieh, zwei große Drachen kamen, bereit zu kämpfen, und ihr Geschrei war gewaltig.',
'Und auf ihr Schreien machten sich alle Völker bereit zum Kampf, um zu kämpfen gegen das Volk der Gerechten.',
'Und sieh, ein Tag der Finsternis und Dunkelheit, Trübsal und Angst, Bedrängnis und großer Erschütterung auf Erden.',
'Und das ganze gerechte Volk war beunruhigt, fürchtete das eigene Übel und war bereit zu verderben.',
'Dann schrien sie zu Gott, und aus ihrem Schreien wurde wie aus einem kleinen Brunnen ein gewaltiger Strom, viel Wasser.',
'Das Licht und die Sonne gingen auf, und die Niedrigen wurden erhöht und verschlangen die Herrlichen.',
'Als Mardochai, der diesen Traum gesehen und was Gott beschlossen hatte zu tun, erwachte, behielt er ihn in seinem Herzen und wollte ihn zu deuten versuchen bis in die Nacht.'
];
const vv11={}; ch11.forEach((t,i)=>vv11[i+1]={verse:i+1,text:t});
b80.chapters[11]={chapter:11,name:'',verses:vv11};

// Chapter 12: Mardochai entdeckt die Verschwörung (6 verses)
const ch12 = [
'Und Mardochai ruhte am Hof mit Gabatha und Tarra, den zwei Kammerherren des Königs, die Wächter des Palastes waren.',
'Und er hörte ihre Anschläge und erforschte ihre Absichten und erfuhr, daß sie Hand anlegen wollten an Artaxerxes, den König, und er zeigte es dem König an.',
'Und der König untersuchte die zwei Kammerherren, und nachdem sie gestanden hatten, wurden sie hingerichtet.',
'Und der König ließ dies aufzeichnen, und Mardochai schrieb auch darüber.',
'So befahl der König, daß Mardochai am Hof dienen solle, und schenkte ihm dafür Gaben.',
'Haman aber, der Sohn des Amadatha, der Agagiter, war in großer Ehre beim König und suchte dem Mardochai und seinem Volk Schaden zu tun um der zwei Kammerherren des Königs willen.'
];
const vv12={}; ch12.forEach((t,i)=>vv12[i+1]={verse:i+1,text:t});
b80.chapters[12]={chapter:12,name:'',verses:vv12};

// Chapter 13: Brief des Artaxerxes + Gebet des Mardochai (18 verses)
const ch13 = [
'Der Abschrift des Briefes war dieser: Der große König Artaxerxes schreibt dieses an die Fürsten und Statthalter der hundertundzwanzigseven Provinzen von Indien bis nach Äthiopien.',
'Nachdem ich über viele Völker gebieter geworden bin und das ganze Weltreich beherrsche, wollte ich nicht von der Macht des Ansehens aufgeblasen werden, sondern stets mit Billigkeit und Güte regieren, damit meine Untertanen im Frieden leben könnten.',
'Als ich nun meine Räte fragte, wie dies zu bewerkstelligen sei, erklärte mir Haman, der durch Klugheit unter uns hervorragt und wegen seiner treuen Gesinnung und beständigen Wohlwollen unverändert an zweiter Stelle nach dem König steht,',
'daß unter allen Völkern auf der Welt ein gewisses mißgünstiges Volk zerstreut ist, das eigenartige Gesetze hat, die allen Nationen feindlich sind, und das Gebot des Königs beständig mißachtet, so daß die von uns eingerichtete gute Ordnung nicht zustande kommen kann.',
'Da wir nun sehen, daß dieses Volk allein in beständigem Gegensatz zu allen Menschen steht und durch fremdartige Lebensweise und Gesetze feindlich gesonnen ist und das Schlimmste für unser Reich tut,',
'haben wir befohlen, daß alle, die in dem an euch gerichteten Schreiben des Haman, der über unsere Angelegenheiten gesetzt ist, bezeichnet sind, mit Weibern und Kindern völlig durch die Schwerter ihrer Feinde ohne Gnade und Schonung vernichtet werden sollen.',
'Damit mögen diese, die von alters her und jetzt noch feindlich gesonnen sind, am selben Tage gewaltsam in die Unterwelt fahren, damit unser Reich von nun an sicher und ungestört bleibt.',
'Da gedachte Mardochai an alle Werke des Herrn und betete zu ihm',
'und sprach: Herr, Herr, du allmächtiger König; denn das ganze Weltall ist in deiner Macht, und wenn du Israel retten willst, gibt es keinen, der dir widerstehen kann.',
'Denn du hast Himmel und Erde und alles Wunderbare unter dem Himmel gemacht.',
'Du bist der Herr über alles, und keiner kann dir widerstehen, du bist der Herr.',
'Du weißt alle Dinge, und du weißt, Herr, daß es nicht aus Hochmut und Anmaßung oder Ehrsucht geschah, daß ich Haman nicht anbetete,',
'denn ich wäre gern bereit gewesen, ihm zum Wohl Israels die Sohlen seiner Schuhe zu küssen.',
'Aber ich tat es, um die Herrlichkeit eines Menschen nicht über die Herrlichkeit Gottes zu stellen, und ich werde niemanden anbeten als dich allein, meinen Herrn, und ich werde das nicht aus Hochmut tun.',
'Und nun, Herr, Gott und König, verschone dein Volk; denn ihre Augen sind auf uns gerichtet, uns zu verderben. Ja, sie begehren, das alte Erbe zu vertilgen.',
'Verschmähe nicht den Anteil, den du dir aus Ägypten selbst befreit hast.',
'Erhöre mein Gebet und sei barmherzig gegenüber deinem Erbe; wandle unsere Trauer in Freude, damit wir, Herr, leben und deinen Namen preisen. Verderbe nicht den Mund derer, die dich preisen.',
'Und ganz Israel schrie mit allen Kräften zu dem Herrn, denn der Tod stand vor ihren Augen.'
];
const vv13={}; ch13.forEach((t,i)=>vv13[i+1]={verse:i+1,text:t});
b80.chapters[13]={chapter:13,name:'',verses:vv13};

// Chapter 14: Gebet der Königin Ester (19 verses)
const ch14 = [
'Auch die Königin Ester wandte sich in Todesfurcht zum Herrn.',
'Und sie legte ihre prachtvollen Kleider ab und zog Kleider der Trauer und Betrübnis an; und statt kostbarer Salben bestreute sie ihr Haupt mit Asche und Staub und erniedrigte ihren Leib sehr.',
'Und sie betete zum Herrn, dem Gott Israels, und sprach: Mein Herr, du bist unser König allein; hilf mir, der Verlassenen, die ich keine andere Helferin habe als dich allein.',
'Denn meine Gefahr steht in meiner Hand.',
'Von meiner Jugend auf habe ich im Stamm meiner Familie gehört, Herr, daß du Israel unter allen Völkern auserwählt hast und unsere Väter unter allen ihren Vorfahren zu ewigem Erbe.',
'Und nun haben wir vor dir gesündigt; darum hast du uns in die Hände unserer Feinde gegeben,',
'weil wir ihre Götter ehrten. Du bist gerecht, Herr.',
'Aber es genügt ihnen nicht, daß wir in bitterer Knechtschaft sind; sondern sie haben ihren Götzen die Hände gereicht,',
'um das aufzuheben, was du mit deinem Mund verordnet hast, und dein Erbe zu vertilgen und den Mund derer zu verstopfen, die dich loben, und die Ehre deines Hauses und deines Altares zu verlöschen,',
'und statt dessen den Mund der Heiden aufzusperren, um die Götzen zu preisen und einen fleischlichen König auf ewig zu verherrlichen.',
'Herr, gib dein Zepter nicht denen, die nichts sind, und laß sie nicht über unsern Fall lachen; wende ihren Anschlag gegen sie selbst, den aber, der wider uns den Kampf begonnen hat, mache zu einem Beispiel.',
'Gedenke, Herr, mach dich bekannt in der Zeit unserer Not, und stärke mich, König der Götter und Herr aller Macht.',
'Gib meinem Mund geschickte Rede vor dem Löwen; wandle sein Herz, ihn zu hassen, der wider uns streitet, daß Ende komme ihm und denen, die ihm gleichgesinnt sind.',
'Rette uns aber durch deine Hand und hilf mir, der Verlassenen, die keine andere Hilfe hat als dich allein, Herr.',
'Du weißt alle Dinge, Herr; du weißt, daß ich die Herrlichkeit der Ungerechten hasse und das Bett der Unbeschnittenen und jedes Fremden verabscheue.',
'Du weißt meine Not: daß ich das Zeichen meiner hohen Stellung, das auf meinem Haupt ist, in den Tagen meiner Bezeugung verabscheue, wie ein schmutziges Tuch, und nicht trage in den Tagen meiner Ruhe.',
'Und daß deine Magd nicht gegessen hat am Tisch Hamans noch das Mahl des Königs geehrt noch den Wein der Trankopfer getrunken hat.',
'Und daß deine Magd keine Freude hatte seit dem Tage, da sie hierher gebracht wurde, bis jetzt, außer in dir, Herr, dem Gott Abrahams.',
'O Gott, Mächtiger über alle, erhöre die Stimme der Verlassenen und rette uns aus der Hand der Bösen und errette mich aus meiner Furcht.'
];
const vv14={}; ch14.forEach((t,i)=>vv14[i+1]={verse:i+1,text:t});
b80.chapters[14]={chapter:14,name:'',verses:vv14};

// Chapter 15: Ester vor dem König (16 verses)
const ch15 = [
'Am dritten Tage, nachdem sie ihr Gebet beendet hatte, legte sie die Kleider der Trauer ab und zog ihre prächtige Kleidung an.',
'Und nachdem sie sich herrlich geschmückt hatte und Gott, den Beistand und Retter aller, angerufen hatte, nahm sie ihre zwei Mägde',
'und lehnte sich auf die eine, als ob sie sich zierlich trage,',
'und die andere folgte ihr, ihr Gewand tragend.',
'Und sie war rötlich durch die Vollkommenheit ihrer Schönheit, und ihr Gesicht war heiter und sehr lieblich; aber ihr Herz war beklommen vor Furcht.',
'Als sie nun alle Türen durchschritten hatte, stand sie vor dem König, der auf seinem königlichen Thron saß, bekleidet mit all seinem Prunkgewand, über und über mit Gold und Edelsteinen glänzend; und er war sehr furchtbar.',
'Da erhob er sein Angesicht, das in Glanz strahlte, und sah sie mit heftigem Zorn; und die Königin fiel hin, wurde bleich und neigte ihr Haupt auf die Magd, die vor ihr war.',
'Da wandelte Gott den Sinn des Königs zu Milde, und er sprang eilig von seinem Throne und hob sie in seinen Armen auf, bis sie zu sich kam, und sprach ihr tröstlich zu:',
'Ester, was ist dir? Ich bin dein Bruder, sei getrost!',
'Du sollst nicht sterben; denn unser Gebot gilt nicht für dich. Tritt herzu!',
'Und er hob sein goldenes Zepter auf und legte es auf ihren Nacken',
'und umarmte sie und sprach: Rede mit mir.',
'Da sprach sie zu ihm: Ich sah dich, mein Herr, wie einen Engel Gottes, und mein Herz erstarrte vor Furcht ob deiner Herrlichkeit.',
'Denn du bist wunderbar, Herr, und dein Angesicht ist voll Anmut.',
'Und während sie redete, fiel sie in Ohnmacht.',
'Da war der König beunruhigt, und alle seine Diener trösteten sie.'
];
const vv15={}; ch15.forEach((t,i)=>vv15[i+1]={verse:i+1,text:t});
b80.chapters[15]={chapter:15,name:'',verses:vv15};

// Chapter 16: Zweiter Brief des Artaxerxes (24 verses)
const ch16 = [
'Der große König Artaxerxes an die Fürsten und Statthalter der hundertsiebenundzwanzig Provinzen von Indien bis nach Äthiopien, die Statthalter und Treuen:',
'Viele, je öfter sie durch die große Freigebigkeit ihrer gnädigen Wohltäter geehrt werden, desto übermütiger werden sie.',
'Und sie suchen nicht nur unseren Untertanen Schaden zu tun, sondern da sie den Reichtum nicht zu ertragen vermögen, trachten sie auch gegen die, die ihnen Gutes getan haben.',
'Und sie heben nicht nur den Dank unter den Menschen auf, sondern verleitet durch die hochtrabenden Reden von Schurken, die der Güte der regierenden Fürsten niemals kundig waren,',
'wähnen sie, auch den Gott zu täuschen, der alles sieht und alles richtet.',
'Und oft sind Viele, die mit der Verwaltung der Angelegenheiten ihrer Freunde betraut wurden, durch die falschen Überredungen derer, die beim Bösen stehen, zu Mitschuldigen unschuldiger Blutschuld geworden.',
'Nun könnt ihr das, was wir nicht so sehr aus alten Geschichten als aus dem, was ihr unmittelbar vor Augen seht, erkennen.',
'Und wir müssen für die Zukunft sorgen, daß das Königreich für alle Menschen still und friedlich sei,',
'sowohl durch Abänderung unserer Beschlüsse als auch stets über das klar Vorliegende mit billigerer Beurteilung zu urteilen.',
'Denn Haman, ein Makedonier, Sohn des Amadatha, war wirklich ein Fremder vom persischen Blut und weit entfernt von unserer Güte.',
'Er hatte in solchem Maße das Wohlwollen erhalten, das wir jedem Volk erweisen, daß er unser Vater genannt und ununterbrochen von allen verehrt als die zweite Person nach dem König wurde.',
'Aber er vermochte die große Würde nicht zu tragen und trachtete, uns des Königtums und des Lebens zu berauben;',
'indem er durch vielerlei und listige Täuschungen den Untergang des Mardochai ersann, der uns das Leben gerettet und stets Gutes für uns getan hat, sowie der Ester, der untadeligen Mitherrscherin unseres Reiches, mit ihrem ganzen Volk.',
'Denn er dachte, uns durch diese Mittel ohne Freunde zu finden und das Königreich der Perser zu Makedoniern zu übertragen.',
'Wir aber finden, daß die Juden, die dieser ruchlose Verbrecher zur Vernichtung übergeben hat, keine Übeltäter sind, sondern nach den gerechten Gesetzen leben,',
'und Kinder des Höchsten und Mächtigsten, des lebendigen Gottes, der unser Reich und unserer Vorfahren Königtum in bester Ordnung erhalten hat.',
'Ihr werdet daher wohltun, wenn ihr die von Haman, dem Sohn des Amadatha, geschickten Briefe nicht ausführt.',
'Denn er selbst, der Urheber dieser Dinge, ist an den Toren von Susan mit seinem ganzen Hause aufgehängt worden: Gott, der über alles regiert, hat ihm in Kürze den verdienten Lohn gegeben.',
'Ihr sollt daher den Abschrift dieses Briefes überall bekanntmachen, damit die Juden nach ihren eigenen Gesetzen frei leben können.',
'Und ihr sollt ihnen helfen, damit sie am selben Tage, nämlich am dreizehnten Tage des zwölften Monats Adar, sich an denen, die sie angreifen wollten, rächen können.',
'Denn Gott, der Allmächtige, hat diesen Tag für sie zum Freudentag gemacht statt zur Vernichtung des auserwählten Volkes.',
'Daher sollt ihr unter euren feierlichen Festen diesen Tag mit allem Jubel als Festtag begehen,',
'damit er sowohl jetzt als in Zukunft Heil bedeute für uns und die wohlgesinnten Perser; den aber, die gegen uns verschwören, als Mahnung und Zeichen ihres Untergangs.',
'Jede Stadt und jedes Land, das diesem nicht folgt, soll unnachsichtlich mit Feuer und Schwert verwüstet werden und soll nicht nur den Menschen, sondern auch den Tieren unzugänglich sein zum ewigen Abscheu.'
];
const vv16={}; ch16.forEach((t,i)=>vv16[i+1]={verse:i+1,text:t});
b80.chapters[16]={chapter:16,name:'',verses:vv16};

fs.writeFileSync(BASE+'080.json', JSON.stringify(b80), 'utf8');
const total=Object.values(b80.chapters).reduce((a,c)=>a+Object.keys(c.verses).length,0);
console.log('080 done: '+total+' verses total');
